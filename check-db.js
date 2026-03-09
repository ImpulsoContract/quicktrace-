const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  const clients = await prisma.clientProfile.findMany({
    include: { 
      user: true,
      _count: { select: { recipes: true } }
    }
  });
  console.log('Clientes (Profiles):', clients.length);
  clients.forEach(c => {
    console.log(`- ${c.user.email} (ID: ${c.id}) - Razón: ${c.razonSocial} - Recetas: ${c._count.recipes}`);
  });

  const recipes = await prisma.recipe.findMany({
    include: { clientProfile: { include: { user: true } } }
  });
  console.log('\nRecetas:', recipes.length);
  recipes.forEach(r => {
    console.log(`- ${r.name} (ID: ${r.id}) -> Cliente: ${r.clientProfile.user.email}`);
  });
}

checkData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
