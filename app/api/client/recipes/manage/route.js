import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, ingredients, expiryDays, expiryType, elaborationInstructions, conservationInstructions, hasBarcode, barcode, energyValue, fats, saturatedFats, carbohydrates, sugars, proteins, salt, allergens } = body;

    // Get client profile and check privilege
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: { 
        plan: true,
        _count: { select: { recipes: true } } 
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    if (!profile.plan) {
      return NextResponse.json({ error: "No tienes un plan asignado. Contacta con soporte." }, { status: 403 });
    }

    // Check limits
    const currentCount = profile._count.recipes;
    const limit = profile.plan.recipesLimit;

    if (limit !== null && currentCount >= limit) {
      return NextResponse.json({ 
        error: `Límite alcanzado. Tu plan '${profile.plan.name}' permite ${limit} recetas y ya has creado ${currentCount}.` 
      }, { status: 403 });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "Se requiere al menos un ingrediente." }, { status: 400 });
    }

    if (hasBarcode) {
      const { isValidEAN13 } = require('@/lib/barcode');
      if (!isValidEAN13(barcode)) {
        return NextResponse.json({ error: "El código de barras introducido no es un EAN-13 válido." }, { status: 400 });
      }
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        expiryDays: expiryDays ? parseInt(expiryDays) : 0,
        expiryType: expiryType || "EXPIRATION",
        hasDryingRoom: !!body.hasDryingRoom,
        elaborationInstructions,
        conservationInstructions,
        hasBarcode: !!hasBarcode,
        barcode: hasBarcode ? barcode : null,
        energyValue,
        fats,
        saturatedFats,
        carbohydrates,
        sugars,
        proteins,
        salt,
        allergens: allergens || [],
        clientProfileId: profile.id,
        ingredients: {
          create: ingredients.map((ing, idx) => ({
            name: toTitleCase(ing.name),
            amount: ing.amount,
            unit: ing.unit,
            order: typeof ing.order === 'number' ? ing.order : idx,
            loteMandatory: !!ing.loteMandatory,
            quantityMandatory: !!ing.quantityMandatory,
            expandItem: !!ing.expandItem,
            expandedText: ing.expandedText || null
          }))
        }
      },
      include: {
        ingredients: {
          orderBy: [
            { order: 'asc' },
            { id: 'asc' }
          ]
        }
      }
    });

    // Sync any ingredients marked as goods for sale
    if (Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        if (ing.sellAsGood && ing.name && ing.name.trim()) {
          const cleanName = toTitleCase(ing.name).trim();
          const cleanUnit = (ing.unit || "").trim();
          const parsedPrice = parseFloat(String(ing.goodsSalePrice || 0).replace(',', '.')) || 0;
          const cleanBarcode = ing.goodsBarcode && String(ing.goodsBarcode).trim() ? String(ing.goodsBarcode).trim() : null;

          try {
            const existingGood = await prisma.goodsForSale.findFirst({
              where: {
                clientProfileId: profile.id,
                OR: [
                  {
                    name: { equals: cleanName, mode: 'insensitive' },
                    unit: { equals: cleanUnit, mode: 'insensitive' }
                  },
                  {
                    linkedIngredientName: { equals: cleanName, mode: 'insensitive' }
                  }
                ]
              }
            });

            if (existingGood) {
              await prisma.goodsForSale.update({
                where: { id: existingGood.id },
                data: {
                  name: cleanName,
                  unit: cleanUnit || existingGood.unit,
                  salePrice: parsedPrice > 0 ? parsedPrice : existingGood.salePrice,
                  barcode: cleanBarcode !== null ? cleanBarcode : existingGood.barcode,
                  linkedIngredientName: cleanName,
                  isArchived: false
                }
              });
            } else if (cleanUnit) {
              await prisma.goodsForSale.create({
                data: {
                  clientProfileId: profile.id,
                  name: cleanName,
                  unit: cleanUnit,
                  salePrice: parsedPrice >= 0 ? parsedPrice : 0,
                  barcode: cleanBarcode,
                  linkedIngredientName: cleanName,
                  stock: 0
                }
              });
            }
          } catch (gfsErr) {
            console.error("Error upserting goodsForSale for recipe ingredient:", gfsErr);
          }
        }
      }
    }

    // Tag first recipe in Clientify
    if (currentCount === 0) {
      try {
        const { assignClientifyTagByEmail } = await import("@/lib/clientify");
        await assignClientifyTagByEmail(session.user.email, "quicktrace con receta");
      } catch (err) {
        console.error("[Clientify Sync] Error tagging first recipe:", err);
      }
    }

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error("Error creating recipe by client:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
