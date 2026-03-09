const { PrismaClient } = require("./prisma/generated-client");
const prisma = new PrismaClient();

function toTitleCase(str) {
  if (!str) return str;
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function migrate() {
  console.log("Starting ingredient name migration...");

  // 1. Migrate Recipe Ingredients
  const ingredients = await prisma.ingredient.findMany();
  console.log(`Found ${ingredients.length} recipe ingredients.`);

  for (const ing of ingredients) {
    const newName = toTitleCase(ing.name);
    if (newName !== ing.name) {
      await prisma.ingredient.update({
        where: { id: ing.id },
        data: { name: newName }
      });
      console.log(`Updated Ingredient: "${ing.name}" -> "${newName}"`);
    }
  }

  // 2. Migrate Elaboration Ingredients
  const elabIngredients = await prisma.elaborationIngredient.findMany();
  console.log(`Found ${elabIngredients.length} elaboration ingredients.`);

  for (const ing of elabIngredients) {
    const newName = toTitleCase(ing.name);
    if (newName !== ing.name) {
      await prisma.elaborationIngredient.update({
        where: { id: ing.id },
        data: { name: newName }
      });
      console.log(`Updated ElaborationIngredient: "${ing.name}" -> "${newName}"`);
    }
  }

  console.log("Migration completed successfully.");
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
