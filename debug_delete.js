const { PrismaClient } = require("./prisma/generated-client");
const prisma = new PrismaClient();

async function debugDelete() {
  const userId = 2; // Fernando
  console.log(`Debug deleting User ID: ${userId}`);

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId },
      include: { recipes: true }
    });

    if (!profile) {
      console.log("No profile found.");
      return;
    }

    const profileId = profile.id;
    const recipeIds = profile.recipes.map(r => r.id);

    await prisma.$transaction(async (tx) => {
      console.log("Step 1: Elaborations");
      if (recipeIds.length > 0) {
        await tx.elaboration.deleteMany({
          where: { recipeId: { in: recipeIds } }
        });
      }

      console.log("Step 2: Recipes");
      await tx.recipe.deleteMany({
        where: { clientProfileId: profileId }
      });

      console.log("Step 3: Logs/Records");
      await tx.cleaningLog.deleteMany({
        where: { clientProfileId: profileId }
      });
      await tx.temperatureRecord.deleteMany({
        where: { clientProfileId: profileId }
      });
      await tx.goodsReceipt.deleteMany({
        where: { clientProfileId: profileId }
      });

      console.log("Step 4: Infrastructure");
      await tx.chamber.deleteMany({
          where: { clientProfileId: profileId }
      });
      await tx.cleaningZone.deleteMany({
          where: { clientProfileId: profileId }
      });

      console.log("Step 5: Profile");
      await tx.clientProfile.delete({
        where: { id: profileId }
      });

      console.log("Step 6: User");
      await tx.user.delete({
        where: { id: userId }
      });
    });

    console.log("SUCCESS");
  } catch (error) {
    console.error("FULL ERROR DETAILS:");
    console.error(error);
  }
}

debugDelete().finally(() => prisma.$disconnect());
