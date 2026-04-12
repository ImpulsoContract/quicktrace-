import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
    return NextResponse.json({ error: "No tienes permiso para acceder a recetas" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: profileId },
      include: { ingredients: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching client recipes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
