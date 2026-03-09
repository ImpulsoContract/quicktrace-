import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, ingredients } = body;

    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile || !profile.canManageRecipes) {
      return NextResponse.json({ error: "No autorizado para gestionar recetas" }, { status: 403 });
    }

    const recipeId = parseInt(id);

    // Verify ownership
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { 
        ingredients: true,
        _count: { select: { elaborations: true } } 
      }
    });

    if (!recipe || recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
    }

    // Check if any ingredient is being removed and if it has data in elaborations
    const newIngredientNames = ingredients.map(ing => toTitleCase(ing.name));
    const removedIngredients = recipe.ingredients.filter(
      old => !newIngredientNames.includes(old.name)
    );

    if (removedIngredients.length > 0) {
      for (const removed of removedIngredients) {
        const dataCount = await prisma.elaborationIngredient.count({
          where: {
            elaboration: { recipeId },
            name: removed.name,
            OR: [
              { lote: { not: "" } },
              { realAmount: { not: "" } },
              { realAmount: { not: "0" } }
            ]
          }
        });

        if (dataCount > 0) {
          return NextResponse.json({ 
            error: `No puedes eliminar el ingrediente "${removed.name}" porque está presente en algunas elaboraciones.` 
          }, { status: 400 });
        }
      }
    }

    // Update recipe in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete old ingredients
      await tx.ingredient.deleteMany({ where: { recipeId } });

      // Update recipe and create new ingredients
      await tx.recipe.update({
        where: { id: recipeId },
        data: {
          name,
          ingredients: {
            create: ingredients.map((ing) => ({
              name: toTitleCase(ing.name),
              amount: ing.amount,
              unit: ing.unit,
              loteMandatory: !!ing.loteMandatory,
              quantityMandatory: !!ing.quantityMandatory
            }))
          }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating recipe by client:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile || !profile.canManageRecipes) {
      return NextResponse.json({ error: "No autorizado para gestionar recetas" }, { status: 403 });
    }

    const recipeId = parseInt(id);

    // Verify ownership and if it has elaborations
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { _count: { select: { elaborations: true } } }
    });

    if (!recipe || recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
    }

    if (recipe._count.elaborations > 0) {
      return NextResponse.json({ error: "No se puede eliminar la receta porque ya existen elaboraciones registradas con ella." }, { status: 400 });
    }

    await prisma.recipe.delete({ where: { id: recipeId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe by client:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
