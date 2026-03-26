const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'fernando@quicktrace.es'.toLowerCase();
  const adminPassword = await bcrypt.hash('1alejandra1FERNANDO', 10);

  // Crear Plan Demo inicial
  const demoPlan = await prisma.pricingPlan.upsert({
    where: { name: 'Demo' },
    update: {
      waterLimit: 20,
      hasWater: true
    },
    create: {
      name: 'Demo',
      recipesLimit: 3,
      elaborationsLimit: 200,
      hasCleaning: true,
      cleaningLimit: 10,
      hasGoods: true,
      goodsLimit: 10,
      hasTemperatures: true,
      temperaturesLimit: 10,
      hasWater: true,
      waterLimit: 20,
    },
  });

  // Otros planes (Básico, Premium, Gold)
  const basicoPlan = await prisma.pricingPlan.upsert({
    where: { name: 'Básico' },
    update: { waterLimit: 250, hasWater: true },
    create: {
      name: 'Básico',
      priceMonthly: 19,
      priceYearly: 149,
      recipesLimit: 20,
      elaborationsLimit: 600,
      hasCleaning: true,
      cleaningLimit: 50,
      hasGoods: true,
      goodsLimit: 250,
      hasTemperatures: true,
      temperaturesLimit: 250,
      hasWater: true,
      waterLimit: 250,
    }
  });

  const premiumPlan = await prisma.pricingPlan.upsert({
    where: { name: 'Premium' },
    update: { waterLimit: 1000, hasWater: true },
    create: {
      name: 'Premium',
      priceMonthly: 39,
      priceYearly: 390,
      recipesLimit: 80,
      elaborationsLimit: 2500,
      hasCleaning: true,
      cleaningLimit: 300,
      hasGoods: true,
      goodsLimit: 1000,
      hasTemperatures: true,
      temperaturesLimit: 1000,
      hasWater: true,
      waterLimit: 1000,
    }
  });

  const goldPlan = await prisma.pricingPlan.upsert({
    where: { name: 'Gold' },
    update: { waterLimit: 5000, hasWater: true },
    create: {
      name: 'Gold',
      priceMonthly: 69,
      priceYearly: 690,
      recipesLimit: 150,
      elaborationsLimit: 5000,
      hasCleaning: true,
      cleaningLimit: 5000,
      hasGoods: true,
      goodsLimit: 5000,
      hasTemperatures: true,
      temperaturesLimit: 5000,
      hasWater: true,
      waterLimit: 5000,
    }
  });

  console.log('Seed: Planes asegurados con límites de agua');

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      role: 'ADMIN',
      name: 'Fernando Admin'
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      name: 'Fernando Admin'
    },
  });

  console.log('Seed: Administrador creado/actualizado:', admin.email);

  // Vincular clientes existentes al plan DEMO si no tienen uno
  await prisma.clientProfile.updateMany({
    where: { planId: null },
    data: { planId: demoPlan.id }
  });
  console.log('Seed: Clientes existentes vinculados al plan DEMO');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
