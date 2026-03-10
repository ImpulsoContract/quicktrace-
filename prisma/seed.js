const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'fernando@quicktrace.es'.toLowerCase();
  const adminPassword = await bcrypt.hash('1alejandra1FERNANDO', 10);

  // Crear Plan DEMO inicial
  const demoPlan = await prisma.pricingPlan.upsert({
    where: { name: 'DEMO' },
    update: {},
    create: {
      name: 'DEMO',
      recipesLimit: 3,
      elaborationsLimit: 200,
      hasCleaning: false,
      hasGoods: false,
      hasTemperatures: false,
    },
  });

  console.log('Seed: Plan DEMO asegurado');

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
