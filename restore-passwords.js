const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'fernando@quicktrace.com' },
    data: { password: '$2a$10$k8vcWJ9wT7YCTVGeb86BLuzFSGBWFlKadyzBDb3GApbzBerAlkAWO' }
  });
  await prisma.user.update({
    where: { email: 'fernando@yeclaweb.com' },
    data: { password: '$2a$10$m6dtJ/nXIiL2OH3nVp0NOeT9k2VtnyzaBTuXkyLgU.0wa.L5d0x5O' }
  });
  console.log('Original passwords restored');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
