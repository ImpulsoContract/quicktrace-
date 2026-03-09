import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;
    const userId = parseInt(id);

    // 1. Get Client Profile to find related IDs
    const profile = await prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        recipes: true,
      }
    });

    if (!profile) {
      // If no profile, we just try to delete the user if it exists
      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({ success: true });
    }

    const profileId = profile.id;
    const recipeIds = profile.recipes.map(r => r.id);

    // Explicit deletion logic as requested
    await prisma.$transaction(async (tx) => {
      // 1. Delete Elaborations (and their ingredients) for all client recipes
      if (recipeIds.length > 0) {
        await tx.elaboration.deleteMany({
          where: { recipeId: { in: recipeIds } }
        });
      }

      // 2. Delete Recipes (and their ingredients)
      await tx.recipe.deleteMany({
        where: { clientProfileId: profileId }
      });

      // 3. Delete other records: Cleaning Logs, Temperature Records, Goods Receipts
      await tx.cleaningLog.deleteMany({
        where: { clientProfileId: profileId }
      });
      
      await tx.temperatureRecord.deleteMany({
        where: { clientProfileId: profileId }
      });

      await tx.goodsReceipt.deleteMany({
        where: { clientProfileId: profileId }
      });

      // 4. Delete Chambers and Cleaning Zones (infrastructure)
      await tx.chamber.deleteMany({
          where: { clientProfileId: profileId }
      });

      await tx.cleaningZone.deleteMany({
          where: { clientProfileId: profileId }
      });

      // 5. Delete Client Profile
      await tx.clientProfile.delete({
        where: { id: profileId }
      });

      // 6. Delete User
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`CRITICAL ERROR deleting client ${params.id}:`, error);
    // Log details of where it might have failed
    return NextResponse.json({ 
      error: "Error al eliminar el cliente y sus datos",
      details: error.message 
    }, { status: 500 });
  }
}
