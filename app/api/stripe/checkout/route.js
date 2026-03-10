import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { planId } = await req.json();

    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    let priceId = plan.stripePriceId;

    // Fallback a variables de entorno si no está en la base de datos
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
      return NextResponse.json({ error: "Este plan aún no está configurado para pagos (falta Stripe Price ID)" }, { status: 400 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Si ya existe un stripeCustomerId, lo usamos. Si no, Stripe creará uno nuevo.
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: clientProfile.stripeCustomerId || undefined,
      customer_email: clientProfile.stripeCustomerId ? undefined : session.user.email,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/plans`,
      metadata: {
        userId: session.user.id,
        planId: plan.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
