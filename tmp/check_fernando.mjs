import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = "fernando@impulsocontract.com";
  console.log(`--- CHECKING USER: ${email} ---`);
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      clientProfile: {
        include: {
          plan: true
        }
      }
    }
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log(JSON.stringify({
    id: user.id,
    email: user.email,
    profile: {
      id: user.clientProfile?.id,
      stripeCustomerId: user.clientProfile?.stripeCustomerId,
      stripeSubscriptionId: user.clientProfile?.stripeSubscriptionId,
      stripePriceId: user.clientProfile?.stripePriceId,
      stripeCurrentPeriodEnd: user.clientProfile?.stripeCurrentPeriodEnd,
      planName: user.clientProfile?.plan?.name
    }
  }, null, 2));

  console.log("\n--- ALL PLANS ---");
  const plans = await prisma.pricingPlan.findMany();
  console.log(plans.map(p => ({
    name: p.name,
    monthly: p.stripePriceIdMonthly,
    yearly: p.stripePriceIdYearly,
    legacy: p.stripePriceId
  })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
