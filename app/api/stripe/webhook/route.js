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
      console.log(`[Webhook] checkout.session.completed for session ${session.id}`);
      const userId = session.metadata.userId ? parseInt(session.metadata.userId) : null;
      const planId = session.metadata.planId;

      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0].price.id;

        let stripeDate = subscription.current_period_end;
        if (!stripeDate && subscription.items?.data?.[0]?.current_period_end) {
          stripeDate = subscription.items.data[0].current_period_end;
        }
        const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;
        
        // Identification fallback: if no userId in metadata, we might try to find by email if available
        let profile;
        if (userId) {
          profile = await prisma.clientProfile.update({
            where: { userId },
            include: { user: true },
            data: {
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: nextRenewalStr,
              planId: planId,
            },
          });
          console.log(`[Webhook] Updated profile for userId ${userId} via checkout metadata`);
        } else {
          console.warn(`[Webhook] No userId in checkout metadata for session ${session.id}`);
        }

        if (profile) {
          // Notify Support
          await sendEmail({
            to: "soporte@quicktrace.es",
            subject: `Nueva Contratación: ${profile.razonSocial}`,
            html: `
              <p>El cliente <b>${profile.razonSocial}</b> (${profile.user.email}) ha realizado una nueva contratación.</p>
              <p>Suscripción: ${session.subscription}</p>
              <p>Próxima renovación: ${nextRenewalStr ? new Date(nextRenewalStr).toLocaleDateString() : 'N/A'}</p>
            `
          });
        }
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      console.log(`[Webhook] invoice.paid for subscription ${invoice.subscription} and customer ${invoice.customer}`);
      
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const priceId = subscription.items.data[0].price.id;
        
        let stripeDate = subscription.current_period_end;
        if (!stripeDate && subscription.items?.data?.[0]?.current_period_end) {
          stripeDate = subscription.items.data[0].current_period_end;
        }
        const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;
        
        // Use metadata from subscription if available (as we just added it to checkout)
        const subUserId = subscription.metadata?.userId ? parseInt(subscription.metadata.userId) : null;
        const subPlanId = subscription.metadata?.planId;

        // Buscamos el plan por stripePriceId
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

        // Robust Identification: Try subscription ID first, then userId from metadata, then customer ID
        let profile;
        try {
          profile = await prisma.clientProfile.update({
            where: { stripeSubscriptionId: invoice.subscription },
            include: { user: true },
            data: {
              stripeCurrentPeriodEnd: nextRenewalStr,
              stripePriceId: priceId,
              planId: plan?.id || subPlanId || undefined
            },
          });
          console.log(`[Webhook] Updated profile by stripeSubscriptionId`);
        } catch (e) {
          console.log(`[Webhook] Update by stripeSubscriptionId failed, trying customerId...`);
          const profiles = await prisma.clientProfile.findMany({
            where: { 
              OR: [
                { stripeCustomerId: invoice.customer },
                { userId: subUserId || -1 }
              ]
            }
          });
          
          if (profiles.length > 0) {
            profile = await prisma.clientProfile.update({
              where: { id: profiles[0].id },
              include: { user: true },
              data: {
                stripeSubscriptionId: invoice.subscription,
                stripeCustomerId: invoice.customer,
                stripeCurrentPeriodEnd: nextRenewalStr,
                stripePriceId: priceId,
                planId: plan?.id || subPlanId || undefined
              }
            });
            console.log(`[Webhook] Updated profile by stripeCustomerId/userId fallback`);
          } else {
            console.error(`[Webhook] CRITICAL: Could not find client profile for invoice ${invoice.id}`);
          }
        }

        if (profile && invoice.billing_reason !== 'subscription_create') {
          await sendEmail({
            to: "soporte@quicktrace.es",
            subject: `Renovación de Suscripción: ${profile.razonSocial}`,
            html: `
              <p>La suscripción del cliente <b>${profile.razonSocial}</b> (${profile.user.email}) se ha renovado correctamente.</p>
              <p>Nueva fecha de renovación: ${nextRenewalStr ? new Date(nextRenewalStr).toLocaleDateString() : 'N/A'}</p>
            `
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const updatedSub = event.data.object;
      console.log(`[Webhook] customer.subscription.updated for ${updatedSub.id}`);
      
      const priceId = updatedSub.items.data[0].price.id;
      let stripeDate = updatedSub.current_period_end;
      if (!stripeDate && updatedSub.items?.data?.[0]?.current_period_end) {
        stripeDate = updatedSub.items.data[0].current_period_end;
      }
      const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;
      
      const newPlan = await prisma.pricingPlan.findFirst({
        where: {
          OR: [
            { stripePriceIdMonthly: priceId },
            { stripePriceIdYearly: priceId },
            { stripePriceId: priceId }
          ]
        }
      });
      
      const subUserId = updatedSub.metadata?.userId ? parseInt(updatedSub.metadata.userId) : null;

      try {
        await prisma.clientProfile.update({
          where: { stripeSubscriptionId: updatedSub.id },
          data: {
            planId: newPlan?.id || updatedSub.metadata?.planId || undefined,
            stripeCurrentPeriodEnd: nextRenewalStr,
            stripePriceId: priceId
          },
        });
        console.log(`[Webhook] Updated profile on sub.updated by subscription ID`);
      } catch (e) {
        console.log(`[Webhook] sub.updated by subscription ID failed, trying customer/userId...`);
        const profiles = await prisma.clientProfile.findMany({
          where: { 
            OR: [
              { stripeCustomerId: updatedSub.customer },
              { userId: subUserId || -1 }
            ]
          }
        });
        
        if (profiles.length > 0) {
          await prisma.clientProfile.update({
            where: { id: profiles[0].id },
            data: {
              stripeSubscriptionId: updatedSub.id,
              planId: newPlan?.id || updatedSub.metadata?.planId || undefined,
              stripeCurrentPeriodEnd: nextRenewalStr,
              stripePriceId: priceId
            }
          });
          console.log(`[Webhook] Updated profile on sub.updated by customer/userId fallback`);
        }
      }
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
