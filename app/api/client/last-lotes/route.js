import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;

    // Fetch all ingredients from all elaborations of this client
    const elabIngredients = await prisma.elaborationIngredient.findMany({
      where: {
        elaboration: {
          recipe: {
            clientProfileId: profileId
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map last lote by ingredient name
    const lastLotes = {};
    elabIngredients.forEach(ing => {
      if (!lastLotes[ing.name] && ing.lote) {
        lastLotes[ing.name] = ing.lote;
      }
    });

    return NextResponse.json(lastLotes);
  } catch (error) {
    console.error("Error GET /api/client/last-lotes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
