import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testSave() {
  console.log("Starting diagnostic save...");
  
  // 1. Find the latest recipe
  const recipe = await prisma.recipe.findFirst({
    orderBy: { updatedAt: 'desc' },
    include: { ingredients: true }
  });
  
  if (!recipe) {
    console.log("No recipes found to test.");
    return;
  }
  
  console.log(`Testing with recipe ID: ${recipe.id} ("${recipe.name}")`);
  console.log("Current ingredients count:", recipe.ingredients.length);
  
  const recipeId = recipe.id;
  const testIngredients = recipe.ingredients.map((ing, idx) => ({
    name: ing.name,
    amount: ing.amount,
    unit: ing.unit,
    loteMandatory: ing.loteMandatory,
    quantityMandatory: ing.quantityMandatory,
    // Force the first one to be expanded for testing
    expandItem: idx === 0 ? true : false,
    expandedText: idx === 0 ? "EXPANDED TEXT TEST" : null
  }));

  console.log("Attempting to save with expansion...");

  try {
    await prisma.$transaction(async (tx) => {
      // Delete old ingredients (mimicking PATCH route)
      await tx.ingredient.deleteMany({ where: { recipeId } });

      // Update recipe and create new ingredients
      await tx.recipe.update({
        where: { id: recipeId },
        data: {
          ingredients: {
            create: testIngredients
          }
        }
      });
    });
    console.log("Save successful!");

    // 2. Verify save
    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: true }
    });

    console.log("Verification of saved ingredients:");
    updatedRecipe.ingredients.forEach((ing, i) => {
      console.log(`[${i}] ${ing.name}: expandItem=${ing.expandItem}, expandedText=${ing.expandedText}`);
    });

  } catch (err) {
    console.error("Save failed:", err);
  }
}

testSave()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
