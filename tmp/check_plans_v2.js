const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const plans = await prisma.pricingPlan.findMany();
    console.log('PLANS_START');
    console.log(JSON.stringify(plans));
    console.log('PLANS_END');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
