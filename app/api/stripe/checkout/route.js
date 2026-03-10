import { NextResponse } from "next/server";
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

    if (!plan || !plan.stripePriceId) {
      return NextResponse.json({ error: "Plan no válido o sin configuración de Stripe" }, { status: 400 });
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
