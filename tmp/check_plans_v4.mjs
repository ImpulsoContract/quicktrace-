import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("--- PRICING PLANS ---");
  const plans = await prisma.pricingPlan.findMany();
  console.log(JSON.stringify(plans, null, 2));

  console.log("\n--- CLIENT PROFILES WITH ISSUES ---");
  const profiles = await prisma.clientProfile.findMany({
    include: {
      plan: true,
      user: {
        select: {
          email: true,
          razonSocial: true
        }
      }
    }
  });
  console.log(JSON.stringify(profiles.map(p => ({
    email: p.user.email,
    razonSocial: p.user.razonSocial,
    planName: p.plan?.name || "MISSING",
    stripePriceId: p.stripePriceId,
    subscriptionId: p.stripeSubscriptionId,
    periodEnd: p.stripeCurrentPeriodEnd
  })), null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
