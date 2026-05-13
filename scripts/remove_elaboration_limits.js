const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating all pricing plans to have unlimited elaborations...');
  const result = await prisma.pricingPlan.updateMany({
    data: {
      elaborationsLimit: null,
      cleaningLimit: null
    }
  });
  console.log(`Updated ${result.count} plans.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
