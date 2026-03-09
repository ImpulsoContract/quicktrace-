const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'fernando@quicktrace.es'.toLowerCase();
  const adminPassword = await bcrypt.hash('1alejandra1FERNANDO', 10);

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
