import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";


export async function POST(req) {
  console.log("--- Stripe Checkout Request Start ---");
  
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  const missingVars = [];
  if (!stripeKey) {
    return NextResponse.json({ error: "Configuración incompleta: STRIPE_SECRET_KEY no está definida." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2024-04-10",
  });

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let planId, billingCycle;
    try {
      const body = await req.json();
      planId = body.planId;
      billingCycle = body.billingCycle || "yearly"; // Default to yearly
    } catch (e) {
      return NextResponse.json({ error: "Cuerpo de solicitud no válido" }, { status: 400 });
    }

    if (!planId) {
      return NextResponse.json({ error: "Falta el ID del plan" }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    let priceId = billingCycle === "monthly" ? plan.stripePriceIdMonthly : (plan.stripePriceIdYearly || plan.stripePriceId);
    
    // Fallback logic for legacy environment variables if no price ID is set in the plan
    if (!priceId) {
      const planName = plan.name.toLowerCase();
      if (planName.includes('gold') || planName.includes('oro')) {
        priceId = process.env.STRIPE_PRICE_GOLD;
      } else if (planName.includes('premium')) {
        priceId = process.env.STRIPE_PRICE_PREMIUM;
      } else if (planName.includes('basico') || planName.includes('básico')) {
        priceId = process.env.STRIPE_PRICE_BASIC;
      }
    }

    if (!priceId) {
      return NextResponse.json({ error: `El plan "${plan.name}" no tiene un ID de precio configurado.` }, { status: 400 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: Number(session.user.id) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000';

    const isUpdate = !!clientProfile.stripeSubscriptionId;

    if (isUpdate) {
      // Optamos por el Billing Portal para actualizaciones. Es MUCHO más robusto y maneja prorrateo automáticamente.
      console.log(`[Stripe] Creating Billing Portal update session for subscription ${clientProfile.stripeSubscriptionId}`);
      
      const subscription = await stripe.subscriptions.retrieve(clientProfile.stripeSubscriptionId);
      const subscriptionItemId = subscription.items.data[0].id;

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: clientProfile.stripeCustomerId,
        return_url: `${baseUrl}/dashboard/plans`,
        flow_data: {
          type: "subscription_update_confirm",
          subscription_update_confirm: {
            subscription: clientProfile.stripeSubscriptionId,
            items: [
              {
                id: subscriptionItemId,
                price: priceId,
                quantity: 1,
              },
            ],
          },
        },
      });

      return NextResponse.json({ url: portalSession.url });
    }

    // Flujo para NUEVAS suscripciones (Checkout normal)
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: clientProfile.stripeCustomerId || undefined,
      customer_email: clientProfile.stripeCustomerId ? undefined : session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/dashboard/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/plans`,
      allow_promotion_codes: true,
      billing_address_collection: "required", // Añadido para forzar la dirección de facturación
      tax_id_collection: { enabled: true },   // Añadido para permitir meter el NIF/CIF
      ...(clientProfile.stripeCustomerId ? {
        customer_update: { address: 'auto', name: 'auto' }
      } : {}),
      metadata: {
        userId: String(session.user.id),
        planId: plan.id,
      },
      subscription_data: {
        metadata: {
          userId: String(session.user.id),
          planId: plan.id,
        }
      }
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error("STRIKE CHECKOUT ERROR [FULL]:", error);
    if (error.type === 'StripeInvalidRequestError') {
      console.error("Stripe Invalid Request Details:", error.raw);
    }
    return NextResponse.json({ 
      error: "Error al procesar el pago: " + error.message,
      details: error.message,
      type: error.type
    }, { status: 500 });
  }
}
