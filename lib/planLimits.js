import prisma from "@/lib/prisma";

/**
 * Checks if the client's current recipe count exceeds their plan limit.
 * @param {number} profileId - The client profile ID.
 * @returns {Promise<boolean>} True if the limit is exceeded, false otherwise.
 */
export async function isRecipeLimitExceeded(profileId) {
  if (!profileId) return false;
  
  const profile = await prisma.clientProfile.findUnique({
    where: { id: profileId },
    include: { plan: true }
  });
  
  if (!profile) return false;
  
  // Default to 3 if no plan is associated (DEMO / legacy)
  const limit = profile.plan ? profile.plan.recipesLimit : 3;
  
  // null means unlimited
  if (limit === null) return false;
  
  const recipesCount = await prisma.recipe.count({
    where: { clientProfileId: profileId }
  });
  
  return recipesCount > limit;
}
