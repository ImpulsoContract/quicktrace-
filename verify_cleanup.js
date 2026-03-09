const { PrismaClient } = require("./prisma/generated-client");
const prisma = new PrismaClient();

async function testDeletion() {
  console.log("Setting up test data...");
  
  // 1. Create Test User
  const user = await prisma.user.create({
    data: {
      email: "test_cleanup@example.com",
      password: "password123",
      name: "Cleanup Test",
      role: "CLIENT",
      clientProfile: {
        create: {
          razonSocial: "Test Cleanup SL",
          nif: "B12345678",
          accountType: "CLIENTE"
        }
      }
    },
    include: { clientProfile: true }
  });

  const profileId = user.clientProfile.id;
  const userId = user.id;

  // 2. Create Recipe and Elaboration
  const recipe = await prisma.recipe.create({
    data: {
      name: "Test Recipe",
      clientProfileId: profileId,
      ingredients: {
        create: [{ name: "Ing 1", amount: "10", unit: "kg" }]
      }
    }
  });

  await prisma.elaboration.create({
    data: {
      name: "Test Elaboration",
      recipeId: recipe.id,
      ingredients: {
        create: [{ name: "Ing 1", lote: "L1", realAmount: "10", unit: "kg" }]
      }
    }
  });

  // 3. Create other records
  await prisma.cleaningLog.create({
    data: { personName: "Test", clientProfileId: profileId }
  });

  await prisma.temperatureRecord.create({
    data: { clientProfileId: profileId }
  });

  await prisma.goodsReceipt.create({
    data: { productName: "Test Goods", clientProfileId: profileId }
  });

  console.log("Verifying test data existence...");
  const elabCount = await prisma.elaboration.count({ where: { recipeId: recipe.id } });
  const logCount = await prisma.cleaningLog.count({ where: { clientProfileId: profileId } });
  
  if (elabCount === 1 && logCount === 1) {
    console.log("Test data created successfully.");
  } else {
    throw new Error("Failed to create test data");
  }

  // 4. Simulate Deletion Logic (same as in API)
  console.log("Executing deletion logic...");
  
  const profileToDelete = await prisma.clientProfile.findUnique({
    where: { userId },
    include: { recipes: true }
  });
  
  const recipeIds = profileToDelete.recipes.map(r => r.id);

  await prisma.$transaction(async (tx) => {
    if (recipeIds.length > 0) {
      await tx.elaboration.deleteMany({ where: { recipeId: { in: recipeIds } } });
    }
    await tx.recipe.deleteMany({ where: { clientProfileId: profileId } });
    await tx.cleaningLog.deleteMany({ where: { clientProfileId: profileId } });
    await tx.temperatureRecord.deleteMany({ where: { clientProfileId: profileId } });
    await tx.goodsReceipt.deleteMany({ where: { clientProfileId: profileId } });
    await tx.chamber.deleteMany({ where: { clientProfileId: profileId } });
    await tx.cleaningZone.deleteMany({ where: { clientProfileId: profileId } });
    await tx.clientProfile.delete({ where: { id: profileId } });
    await tx.user.delete({ where: { id: userId } });
  });

  console.log("Verifying cleanup...");
  const userCheck = await prisma.user.findUnique({ where: { id: userId } });
  const profileCheck = await prisma.clientProfile.findUnique({ where: { id: profileId } });
  const elabCheck = await prisma.elaboration.count({ where: { recipeId: recipe.id } });
  
  if (!userCheck && !profileCheck && elabCheck === 0) {
    console.log("SUCCESS: All data cleaned up correctly.");
  } else {
    console.error("FAILURE: Some data remains.");
    if (userCheck) console.log("- User remains");
    if (profileCheck) console.log("- Profile remains");
    if (elabCheck > 0) console.log("- Elaborations remain");
  }
}

testDeletion().catch(console.error).finally(() => prisma.$disconnect());
