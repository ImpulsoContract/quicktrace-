import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession || checkoutSession.payment_status !== "paid") {
       return NextResponse.json({ error: "Pago no completado o sesión inválida" }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    
    let subscriptionId = checkoutSession.subscription;
    let customerId = checkoutSession.customer;
    
    if (!subscriptionId) {
        return NextResponse.json({ error: "No se encontró suscripción en esta sesión" }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find the corresponding plan in our DB
    const stripePriceId = subscription.items.data[0].price.id;

    const plan = await prisma.pricingPlan.findFirst({
      where: {
        OR: [
          { stripePriceIdMonthly: stripePriceId },
          { stripePriceIdYearly: stripePriceId },
          { stripePriceId: stripePriceId }
        ]
      }
    });

    let stripeDate = subscription.current_period_end;
    if (!stripeDate && subscription.items?.data?.[0]?.current_period_end) {
      stripeDate = subscription.items.data[0].current_period_end;
    }

    const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;

    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: userId },
      data: {
        stripeCurrentPeriodEnd: nextRenewalStr,
        stripePriceId: stripePriceId,
        planId: plan?.id || undefined,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end || false
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Suscripción sincronizada correctamente" 
    });

  } catch (error) {
    console.error("Error syncing checkout session:", error);
    return NextResponse.json({ error: "Error al sincronizar con Stripe: " + error.message }, { status: 500 });
  }
}
