import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function syncAll() {
  console.log("--- STARTING BULK SYNC ---");
  
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: { clientProfile: { include: { plan: true } } }
  });

  console.log(`Found ${clients.length} clients to process.`);

  for (const client of clients) {
    const profile = client.clientProfile;
    if (!profile) {
      console.log(`Skipping ${client.email}: No profile found.`);
      continue;
    }

    console.log(`\nProcessing: ${client.email} (${profile.razonSocial || 'No Reason Social'})`);
    
    let subscription = null;
    let customerId = profile.stripeCustomerId;
    let subscriptionId = profile.stripeSubscriptionId;

    try {
      if (subscriptionId) {
        console.log(`  Found existing Subscription ID: ${subscriptionId}`);
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      } else {
        console.log(`  No Subscription ID found. Searching by email...`);
        const customers = await stripe.customers.list({ email: client.email, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 1 });
          if (subscriptions.data.length > 0) {
            subscription = subscriptions.data[0];
            subscriptionId = subscription.id;
            console.log(`  Found subscription via email search: ${subscriptionId}`);
          } else {
            console.log(`  No subscriptions found for customer ${customerId}`);
          }
        } else {
          console.log(`  No customer found for email ${client.email}`);
        }
      }

      if (subscription) {
        const nextRenewal = new Date(subscription.current_period_end * 1000);
        const priceId = subscription.items.data[0].price.id;

        // Try to match plan
        const plan = await prisma.pricingPlan.findFirst({
          where: {
            OR: [
              { stripePriceIdMonthly: priceId },
              { stripePriceIdYearly: priceId },
              { stripePriceId: priceId }
            ]
          }
        });

        const updateData = {
          stripeCurrentPeriodEnd: nextRenewal,
          stripePriceId: priceId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId
        };
        if (plan) updateData.planId = plan.id;

        const updated = await prisma.clientProfile.update({
          where: { userId: client.id },
          data: updateData
        });

        console.log(`  SUCCESS: Saved Renewal Date: ${updated.stripeCurrentPeriodEnd}`);
        console.log(`  Plan: ${plan?.name || 'Not Matched'} (Price: ${priceId})`);
      } else {
        console.log(`  No active subscription found for this client.`);
      }
    } catch (err) {
      console.error(`  ERROR processing ${client.email}: ${err.message}`);
    }
  }

  console.log("\n--- BULK SYNC FINISHED ---");
}

syncAll()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
