import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = await req.json();
    const { 
      name, 
      ingredients, // Array of { name, amount, unit, loteMandatory, quantityMandatory }
      lotesMandatory,
      quantitiesMandatory
    } = body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "Se requiere al menos un ingrediente." }, { status: 400 });
    }

    const recipeId = parseInt(id);

    // Fetch existing ingredients for comparison
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: true }
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
    }

    // Check if any ingredient is being removed and if it has data
    const newIngredientNames = ingredients.map(ing => toTitleCase(ing.name));
    const removedIngredients = existingRecipe.ingredients.filter(
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

    const recipe = await prisma.$transaction(async (tx) => {
      // Delete old ingredients
      await tx.ingredient.deleteMany({
        where: { recipeId }
      });

      // Update recipe name and create new ingredients
      return await tx.recipe.update({
        where: { id: recipeId },
        data: {
          name,
          lotesMandatory: !!lotesMandatory,
          quantitiesMandatory: !!quantitiesMandatory,
          ingredients: {
            create: ingredients.map((ing) => ({
              name: toTitleCase(ing.name),
              amount: ing.amount,
              unit: ing.unit,
              loteMandatory: !!ing.loteMandatory,
              quantityMandatory: !!ing.quantityMandatory
            }))
          }
        },
        include: { ingredients: true }
      });
    });

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
