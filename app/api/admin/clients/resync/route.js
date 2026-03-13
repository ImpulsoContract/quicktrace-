import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { clientId } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    const client = await prisma.user.findUnique({
      where: { id: parseInt(clientId) },
      include: { clientProfile: true }
    });

    if (!client || !client.clientProfile) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    let subscriptionId = client.clientProfile.stripeSubscriptionId;
    let customerId = client.clientProfile.stripeCustomerId;

    if (!subscriptionId) {
      console.log(`[Resync] No subscription ID found for ${client.email}, searching Stripe by email...`);
      const customers = await stripe.customers.list({ email: client.email, limit: 1 });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log(`[Resync] Found Stripe Customer: ${customerId}`);
        
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1
        });

        if (subscriptions.data.length > 0) {
          subscriptionId = subscriptions.data[0].id;
          console.log(`[Resync] Found Active Subscription: ${subscriptionId}`);
        } else {
          return NextResponse.json({ error: "Cliente encontrado en Stripe pero sin suscripción activa" }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: "No se encontró ningún cliente en Stripe con el email: " + client.email }, { status: 400 });
      }
    }

    // Fetch subscription from Stripe to get the most recent data
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find the corresponding plan in our DB
    const stripePriceId = subscription.items.data[0].price.id;
    console.log(`[Resync] Found Stripe Price ID: ${stripePriceId} for user ${client.email}`);

    const plan = await prisma.pricingPlan.findFirst({
      where: {
        OR: [
          { stripePriceIdMonthly: stripePriceId },
          { stripePriceIdYearly: stripePriceId },
          { stripePriceId: stripePriceId }
        ]
      }
    });

    if (!plan) {
      console.warn(`[Resync] No matching plan found in DB for Price ID: ${stripePriceId}`);
    } else {
      console.log(`[Resync] Matched plan: ${plan.name} (${plan.id})`);
    }

    // For flexible billing, current_period_end might be in the item instead of the root
    let stripeDate = subscription.current_period_end;
    if (!stripeDate && subscription.items?.data?.[0]?.current_period_end) {
      stripeDate = subscription.items.data[0].current_period_end;
    }

    const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;

    // Actualizamos el perfil
    console.log(`[Resync] Updating client ${client.id} (${client.email}) with renewal date string: ${nextRenewalStr}`);
    
    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: client.id },
      data: {
        stripeCurrentPeriodEnd: nextRenewalStr,
        stripePriceId: stripePriceId,
        planId: plan?.id || undefined,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id
      }
    });

    console.log(`[Resync] Update successful. Saved: ${updatedProfile.stripeCurrentPeriodEnd}`);

    return NextResponse.json({ 
      success: true, 
      message: plan ? "Sincronización completada" : "Sincronización completada (Plan no identificado)",
      data: {
        planName: plan?.name || "Desconocido (Precio ID: " + stripePriceId + ")",
        renewalDate: nextRenewalStr ? new Date(nextRenewalStr).toLocaleDateString() : "N/A",
        stripePriceId: stripePriceId,
        planMatched: !!plan,
        debugRawDate: subscription.current_period_end,
        savedDate: updatedProfile.stripeCurrentPeriodEnd,
        rawStripeData: subscription // Added for user debugging
      }
    });

  } catch (error) {
    console.error("Error resyncing with Stripe:", error);
    return NextResponse.json({ error: "Error al sincronizar con Stripe: " + error.message }, { status: 500 });
  }
}
