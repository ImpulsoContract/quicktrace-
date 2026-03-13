import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.quicktrace_POSTGRES_PRISMA_URL
    }
  }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function syncAll() {
  console.log("--- STARTING BULK SYNC (STRING SCHEMA) ---");

  try {
    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
      include: { clientProfile: { include: { plan: true } } }
    });

    console.log(`Found ${clients.length} clients to process.`);

    for (const client of clients) {
      const profile = client.clientProfile;
      if (!profile) continue;

      console.log(`\nProcessing: ${client.email}`);
      
      let subscription = null;
      let customerId = profile.stripeCustomerId;
      let subscriptionId = profile.stripeSubscriptionId;

      try {
        if (subscriptionId) {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
        } else {
          const customers = await stripe.customers.list({ email: client.email, limit: 1 });
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
            const subs = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
            if (subs.data.length > 0) {
              subscription = subs.data[0];
              subscriptionId = subscription.id;
            }
          }
        }

        if (subscription) {
          const nextRenewalStr = new Date(subscription.current_period_end * 1000).toISOString();
          
          const updated = await prisma.clientProfile.update({
            where: { userId: client.id },
            data: {
              stripeCurrentPeriodEnd: nextRenewalStr,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId
            }
          });

          console.log(`  Updated ${client.email}: ${updated.stripeCurrentPeriodEnd}`);
        } else {
          console.log(`  No subscription found.`);
        }
      } catch (inner) {
        console.error(`  Error for ${client.email}: ${inner.message}`);
      }
    }
  } catch (err) {
    console.error("Critical error:", err);
  }

  console.log("\n--- BULK SYNC FINISHED ---");
}

syncAll()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
