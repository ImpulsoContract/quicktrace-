import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Buscar el perfil del cliente asociado al usuario de la sesión
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: profile.id },
      include: { ingredients: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching client recipes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
