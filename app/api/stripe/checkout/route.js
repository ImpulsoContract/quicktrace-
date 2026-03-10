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

  const stripe = new Stripe(stripeKey);

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let planId;
    try {
      const body = await req.json();
      planId = body.planId;
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

    let priceId = plan.stripePriceId;
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

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: clientProfile.stripeCustomerId || undefined,
      customer_email: clientProfile.stripeCustomerId ? undefined : session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/plans`,
      metadata: {
        userId: String(session.user.id),
        planId: plan.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ 
      error: "Error al procesar el pago",
      details: error.message 
    }, { status: 500 });
  }
}
