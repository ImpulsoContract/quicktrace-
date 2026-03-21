import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 1,
    include: { ingredients: true }
  })
  
  if (recipes.length > 0) {
    console.dir(recipes[0].ingredients, { depth: null });
  } else {
    console.log("No recipes found");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
