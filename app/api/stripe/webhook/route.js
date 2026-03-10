import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userId = parseInt(session.metadata.userId);
      const planId = session.metadata.planId;

      await prisma.clientProfile.update({
        where: { userId },
        data: {
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          planId: planId,
        },
      });
      break;

    case "customer.subscription.deleted":
      const subscription = event.data.object;
      
      // Buscamos el perfil por stripeSubscriptionId y lo bajamos al plan demo
      // Nota: Deberías tener un plan "Demo" con ID fijo o buscarlo por nombre
      const demoPlan = await prisma.pricingPlan.findFirst({
        where: { name: { contains: "Demo", mode: 'insensitive' } }
      });

      await prisma.clientProfile.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          planId: demoPlan?.id || null,
          stripeSubscriptionId: null,
        },
      });
      break;

    case "customer.subscription.updated":
      const updatedSub = event.data.object;
      // Actualizar el plan si ha cambiado en Stripe
      const newPlan = await prisma.pricingPlan.findFirst({
        where: { stripePriceId: updatedSub.items.data[0].price.id }
      });
      
      if (newPlan) {
        await prisma.clientProfile.update({
          where: { stripeSubscriptionId: updatedSub.id },
          data: {
            planId: newPlan.id,
          },
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
