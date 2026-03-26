import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Enabling Water module for all plans...');
  const updatedPlans = await prisma.pricingPlan.updateMany({
    data: {
      hasWater: true,
      waterLimit: 50
    }
  });
  console.log(`Updated ${updatedPlans.count} plans.`);
  
  // Also ensuring the DEMO plan (if recreated) has it
  const demo = await prisma.pricingPlan.findUnique({ where: { name: 'DEMO' } });
  if (demo) {
    await prisma.pricingPlan.update({
      where: { id: demo.id },
      data: { hasWater: true, waterLimit: 50 }
    });
    console.log('DEMO plan updated explicitly.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
