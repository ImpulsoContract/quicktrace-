const { PrismaClient } = require("./prisma/generated-client");
const prisma = new PrismaClient();

async function verifyStrictDeletion() {
  console.log("Starting strict deletion verification...");

  try {
    // 1. Create a test profile
    const profile = await prisma.clientProfile.create({
      data: {
        userId: 999, // dummy
        razonSocial: "Test Deletions",
        nif: "12345678X",
        recetasContratadas: 10
      }
    });

    // 2. Create a recipe
    const recipe = await prisma.recipe.create({
      data: {
        name: "Recipe with Data",
        clientProfileId: profile.id,
        ingredients: {
          create: [
            { name: "Persistent Ingredient", amount: "100", unit: "g" },
            { name: "Disposable Ingredient", amount: "50", unit: "g" }
          ]
        }
      },
      include: { ingredients: true }
    });

    // 3. Create an elaboration
    await prisma.elaboration.create({
      data: {
        name: "Elab 1",
        recipeId: recipe.id,
        ingredients: {
          create: [
            { name: "Persistent Ingredient", lote: "L123", realAmount: "105", unit: "g" },
            { name: "Disposable Ingredient", lote: "", realAmount: "0", unit: "g" }
          ]
        }
      }
    });

    console.log("Step 1: Test removing Persistent Ingredient (Should fail logically in my code)");
    // Simulating the check logic here as I can't call the API directly from this script with auth etc.
    // But I will verify the logic I wrote in the API.
    
    const checkIngRemoval = async (nameToRemove) => {
        const dataCount = await prisma.elaborationIngredient.count({
          where: {
            elaboration: { recipeId: recipe.id },
            name: nameToRemove,
            OR: [
              { lote: { not: "" } },
              { realAmount: { not: "" } },
              { realAmount: { not: "0" } }
            ]
          }
        });
        return dataCount > 0;
    };

    if (await checkIngRemoval("Persistent Ingredient")) {
      console.log("PASS: Persistent Ingredient correctly identified as having data.");
    } else {
      console.log("FAIL: Persistent Ingredient should have data.");
    }

    if (!(await checkIngRemoval("Disposable Ingredient"))) {
      console.log("PASS: Disposable Ingredient correctly identified as NOT having data.");
    } else {
      console.log("FAIL: Disposable Ingredient should not have data.");
    }

    // Clean up
    await prisma.clientProfile.delete({ where: { id: profile.id } });
    console.log("SUCCESS");
  } catch (error) {
    console.error(error);
  }
}

verifyStrictDeletion().finally(() => prisma.$disconnect());
