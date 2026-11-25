import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasRecipes) {
    return NextResponse.json({ error: "No tienes permiso para gestionar recetas" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const recipeId = parseInt(id);
    if (isNaN(recipeId)) {
      return NextResponse.json({ error: "ID de receta inválido" }, { status: 400 });
    }

    // Verify ownership
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    });

    if (!recipe || recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
    }

    const body = await req.json();
    const { imageUrl } = body;

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        imageUrl: imageUrl ? String(imageUrl).trim() : null
      }
    });

    return NextResponse.json({
      success: true,
      imageUrl: updatedRecipe.imageUrl
    });
  } catch (error) {
    console.error("Error updating recipe image:", error);
    return NextResponse.json({ error: "Error interno al guardar la imagen" }, { status: 500 });
  }
}
