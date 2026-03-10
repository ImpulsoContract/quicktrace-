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
  if (!stripeKey) missingVars.push("STRIPE_SECRET_KEY");
  if (!webhookSecret) missingVars.push("STRIPE_WEBHOOK_SECRET");
  
  if (missingVars.length > 0) {
    console.error("Missing Env Vars:", missingVars);
    return NextResponse.json({ 
      error: `Configuración incompleta en Vercel. Faltan las siguientes variables de entorno: ${missingVars.join(", ")}.`,
      howToFix: "Añádalas en el panel de Vercel > Settings > Environment Variables."
    }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log("No authorization session");
      return NextResponse.json({ error: "No autorizado: Por favor, inicia sesión de nuevo." }, { status: 401 });
    }
    console.log("User:", session.user.email, "ID:", session.user.id);

    let planId;
    try {
      const body = await req.json();
      planId = body.planId;
    } catch (e) {
      console.error("Error parsing request body:", e);
      return NextResponse.json({ error: "Cuerpo de solicitud no válido" }, { status: 400 });
    }

    if (!planId) {
      return NextResponse.json({ error: "Falta el ID del plan" }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      console.error("Plan not found:", planId);
      return NextResponse.json({ error: "Plan no encontrado en la base de datos." }, { status: 404 });
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
      console.error("No Price ID found for plan:", plan.name);
      return NextResponse.json({ error: `El plan "${plan.name}" no tiene un ID de precio de Stripe configurado.` }, { status: 400 });
    }

    console.log("Creating session with Price ID:", priceId);

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: Number(session.user.id) }
    });

    if (!clientProfile) {
      console.error("Client profile missing for user:", session.user.id);
      return NextResponse.json({ error: "Tu perfil de cliente no está configurado correctamente. Contacta con soporte." }, { status: 404 });
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

    console.log("Checkout session created:", checkoutSession.id);
    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error("CRITICAL Stripe Checkout Error:", error);
    return NextResponse.json({ 
      error: "Error interno del servidor al procesar el pago.",
      details: error.message 
    }, { status: 500 });
  }
}
