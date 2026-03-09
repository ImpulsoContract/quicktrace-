const { PrismaClient } = require("./prisma/generated-client");
const prisma = new PrismaClient();

async function verify() {
  const email = "fernando@yeclaweb.com";
  console.log(`Checking user: ${email}`);
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { clientProfile: true }
  });
  
  if (!user) {
    console.error("User not found");
    return;
  }
  
  console.log(`User ID: ${user.id}`);
  console.log(`Profile ID: ${user.clientProfile?.id}`);
  
  // Test finding by userID explicitly (as we do in the API now)
  const profileByUserId = await prisma.clientProfile.findUnique({
    where: { userId: user.id }
  });
  
  if (profileByUserId && profileByUserId.id === user.clientProfile.id) {
    console.log("SUCCESS: Profile lookup by userId is consistent and correct.");
  } else {
    console.error("FAILURE: Profile lookup by userId failed or is inconsistent.");
  }
  
  // Test finding elaborations by profileId
  const count = await prisma.elaboration.count({
    where: {
      recipe: {
        clientProfileId: user.clientProfile.id
      }
    }
  });
  
  console.log(`Elaborations for this profile: ${count}`);
}

verify().finally(() => prisma.$disconnect());
