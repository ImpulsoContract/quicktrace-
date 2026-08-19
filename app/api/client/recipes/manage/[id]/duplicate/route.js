import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: {
        plan: true,
        _count: { select: { recipes: true } }
      }
    });

    if (!profile || !profile.canManageRecipes) {
      return NextResponse.json({ error: "No autorizado para gestionar recetas" }, { status: 403 });
    }

    if (!profile.plan) {
      return NextResponse.json({ error: "No tienes un plan asignado. Contacta con soporte." }, { status: 403 });
    }

    // Check plan limits
    const currentCount = profile._count.recipes;
    const limit = profile.plan.recipesLimit;

    if (limit !== null && currentCount >= limit) {
      return NextResponse.json({
        error: `Límite alcanzado. Tu plan '${profile.plan.name}' permite ${limit} recetas y ya has creado ${currentCount}.`
      }, { status: 403 });
    }

    const recipeId = parseInt(id);

    // Verify ownership and get original recipe
    const originalRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: true }
    });

    if (!originalRecipe || originalRecipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
    }

    // Read name from body or fallback
    let name = originalRecipe.name + " (Copia)";
    try {
      const body = await req.json();
      if (body && body.name) {
        name = body.name;
      }
    } catch (e) {}

    // Duplicate recipe and its ingredients
    const duplicatedRecipe = await prisma.recipe.create({
      data: {
        name,
        clientProfileId: profile.id,
        lotesMandatory: originalRecipe.lotesMandatory,
        quantitiesMandatory: originalRecipe.quantitiesMandatory,
        expiryDays: originalRecipe.expiryDays,
        expiryType: originalRecipe.expiryType,
        hasDryingRoom: originalRecipe.hasDryingRoom,
        elaborationInstructions: originalRecipe.elaborationInstructions,
        conservationInstructions: originalRecipe.conservationInstructions,
        hasBarcode: originalRecipe.hasBarcode,
        barcode: originalRecipe.barcode,
        energyValue: originalRecipe.energyValue,
        fats: originalRecipe.fats,
        saturatedFats: originalRecipe.saturatedFats,
        carbohydrates: originalRecipe.carbohydrates,
        sugars: originalRecipe.sugars,
        proteins: originalRecipe.proteins,
        salt: originalRecipe.salt,
        allergens: originalRecipe.allergens,
        ingredients: {
          create: originalRecipe.ingredients.map(ing => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            loteMandatory: ing.loteMandatory,
            quantityMandatory: ing.quantityMandatory,
            expandItem: ing.expandItem,
            expandedText: ing.expandedText
          }))
        }
      },
      include: {
        ingredients: true
      }
    });

    return NextResponse.json({ success: true, recipe: duplicatedRecipe });
  } catch (error) {
    console.error("Error duplicating recipe:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
