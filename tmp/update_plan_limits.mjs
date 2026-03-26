import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Updating Plan Limits for Water Module...');
  
  const plans = [
    { name: 'DEMO', limit: 20 },
    { name: 'Básico', limit: 250 },
    { name: 'Premium', limit: 1000 },
    { name: 'Gold', limit: 5000 }
  ];

  for (const plan of plans) {
    const p = await prisma.pricingPlan.updateMany({
      where: { name: plan.name },
      data: {
        hasWater: true,
        waterLimit: plan.limit
      }
    });
    console.log(`Plan ${plan.name} updated: ${p.count} records.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
