const { PrismaClient } = require("./prisma/generated-client");
const prisma = new PrismaClient();

async function main() {
  const email = "fernando@yeclaweb.com";
  
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: { clientProfile: true }
  });

  if (!user || user.role !== "CLIENT" || !user.clientProfile) {
    console.log("User not found or not a client or no profile");
    return;
  }

  console.log("Found User:", user.email, "Profile ID:", user.clientProfile.id);

  const elaborations = await prisma.elaboration.findMany({
    where: {
      recipe: {
        clientProfileId: user.clientProfile.id
      }
    },
    include: {
      recipe: {
        include: {
          ingredients: true
        }
      },
      ingredients: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  console.log("Elaborations found for this user:", elaborations.length);
  elaborations.forEach(e => {
    console.log(`- ${e.name} (Recipe: ${e.recipe.name})`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
