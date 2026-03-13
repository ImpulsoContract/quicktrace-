import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = parseInt(session.metadata.userId);
      const planId = session.metadata.planId;

      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        let stripeDate = subscription.current_period_end;
        if (!stripeDate && subscription.items?.data?.[0]?.current_period_end) {
          stripeDate = subscription.items.data[0].current_period_end;
        }
        const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;
        
        const profile = await prisma.clientProfile.update({
          where: { userId },
          include: { user: true },
          data: {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: nextRenewalStr,
            planId: planId,
          },
        });

        // Notify Support
        await sendEmail({
          to: "soporte@quicktrace.es",
          subject: `Nueva Contratación: ${profile.razonSocial}`,
          html: `
            <p>El cliente <b>${profile.razonSocial}</b> (${profile.user.email}) ha realizado una nueva contratación.</p>
            <p>Suscripción: ${session.subscription}</p>
            <p>Próxima renovación: ${new Date(nextRenewalStr).toLocaleDateString()}</p>
          `
        });
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      console.log(`[Webhook] invoice.paid for subscription ${invoice.subscription}`);
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const priceId = subscription.items.data[0].price.id;
        
        let stripeDate = subscription.current_period_end;
        if (!stripeDate && subscription.items?.data?.[0]?.current_period_end) {
          stripeDate = subscription.items.data[0].current_period_end;
        }
        const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;
        
        // Buscamos el plan por stripePriceId (ya sea mensual o anual)
        const plan = await prisma.pricingPlan.findFirst({
          where: {
            OR: [
              { stripePriceIdMonthly: priceId },
              { stripePriceIdYearly: priceId },
              { stripePriceId: priceId }
            ]
          }
        });

        if (!plan) console.warn(`[Webhook] No matching plan found for Price ID: ${priceId}`);
        else console.log(`[Webhook] Matched plan: ${plan.name} for subscription ${invoice.subscription}`);

        const profile = await prisma.clientProfile.update({
          where: { stripeSubscriptionId: invoice.subscription },
          include: { user: true },
          data: {
            stripeCurrentPeriodEnd: nextRenewalStr,
            stripePriceId: priceId,
            planId: plan?.id || undefined
          },
        });

        // Notify Support only if it's a renewal (billing_reason is not subscription_create)
        if (invoice.billing_reason !== 'subscription_create') {
          await sendEmail({
            to: "soporte@quicktrace.es",
            subject: `Renovación de Suscripción: ${profile.razonSocial}`,
            html: `
              <p>La suscripción del cliente <b>${profile.razonSocial}</b> (${profile.user.email}) se ha renovado correctamente.</p>
              <p>Nueva fecha de renovación: ${new Date(nextRenewalStr).toLocaleDateString()}</p>
            `
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const updatedSub = event.data.object;
      const priceId = updatedSub.items.data[0].price.id;

      let stripeDate = updatedSub.current_period_end;
      if (!stripeDate && updatedSub.items?.data?.[0]?.current_period_end) {
        stripeDate = updatedSub.items.data[0].current_period_end;
      }
      const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;
      console.log(`[Webhook] customer.subscription.updated for ${updatedSub.id}. Price ID: ${priceId}`);
      
      const newPlan = await prisma.pricingPlan.findFirst({
        where: {
          OR: [
            { stripePriceIdMonthly: priceId },
            { stripePriceIdYearly: priceId },
            { stripePriceId: priceId }
          ]
        }
      });
      
      if (!newPlan) console.warn(`[Webhook] No matching plan found for Price ID: ${priceId}`);
      else console.log(`[Webhook] Matched plan: ${newPlan.name} for subscription ${updatedSub.id}`);

      await prisma.clientProfile.update({
        where: { stripeSubscriptionId: updatedSub.id },
        data: {
          planId: newPlan?.id || undefined,
          stripeCurrentPeriodEnd: nextRenewalStr,
          stripePriceId: priceId
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      
      const fallbackPlan = await prisma.pricingPlan.findFirst({
        where: { 
          OR: [
            { name: { contains: "Básico", mode: 'insensitive' } },
            { name: { contains: "Demo", mode: 'insensitive' } }
          ]
        }
      });

      const profile = await prisma.clientProfile.update({
        where: { stripeSubscriptionId: subscription.id },
        include: { user: true },
        data: {
          planId: fallbackPlan?.id || null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
          stripePriceId: null
        },
      });

      // Notify Support
      await sendEmail({
        to: "soporte@quicktrace.es",
        subject: `Suscripción Cancelada: ${profile.razonSocial}`,
        html: `
          <p>La suscripción del cliente <b>${profile.razonSocial}</b> (${profile.user.email}) ha sido cancelada o ha expirado.</p>
          <p>El cliente ha sido movido al plan: ${fallbackPlan?.name || "Básico (Demo)"}.</p>
        `
      });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
