import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
      return NextResponse.json({ error: "No tienes permiso para acceder a precios de coste" }, { status: 403 });
    }

    const profileId = session.user.profileId;
    if (!profileId) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    // Fetch all recipes with their ingredients
    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: profileId },
      include: { ingredients: true }
    });

    // Fetch existing prices
    const existingPrices = await prisma.ingredientPrice.findMany({
      where: { clientProfileId: profile.id }
    });

    // Group ingredients by Name and Unit
    const ingredientGroups = {};

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const nameKey = ing.name.trim();
        const unitKey = ing.unit.trim();
        const lookupKey = `${nameKey.toLowerCase()}_${unitKey.toLowerCase()}`;
        
        if (!ingredientGroups[lookupKey]) {
          ingredientGroups[lookupKey] = {
            name: nameKey,
            unit: unitKey,
            recipes: [],
            price: 0
          };
        }
        if (!ingredientGroups[lookupKey].recipes.includes(recipe.name)) {
          ingredientGroups[lookupKey].recipes.push(recipe.name);
        }
      });
    });

    // Merge with existing prices
    existingPrices.forEach(priceRecord => {
      const lookupKey = `${priceRecord.name.trim().toLowerCase()}_${priceRecord.unit.trim().toLowerCase()}`;
      if (ingredientGroups[lookupKey]) {
        ingredientGroups[lookupKey].price = priceRecord.price;
      }
    });

    const result = Object.values(ingredientGroups).sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error GET /api/ingredient-prices:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });
    if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    const ingredients = await req.json(); // Array of { name, unit, price }

    // Check if it's the first time setting prices
    const existingPricesCount = await prisma.ingredientPrice.count({
      where: { clientProfileId: profile.id }
    });
    const isFirstTime = existingPricesCount === 0;

    const savedPrices = [];

    // Use a transaction for efficiency or just loop
    for (const ing of ingredients) {
      if (ing.price === "" || ing.price === null || undefined === ing.price) continue;
      
      const priceVal = parseFloat(ing.price.toString().replace(',', '.'));
      if (isNaN(priceVal)) continue;

      const updatedPrice = await prisma.ingredientPrice.upsert({
        where: {
          clientProfileId_name_unit: {
            clientProfileId: profile.id,
            name: ing.name.trim(),
            unit: ing.unit.trim()
          }
        },
        update: { price: priceVal },
        create: {
          clientProfileId: profile.id,
          name: ing.name.trim(),
          unit: ing.unit.trim(),
          price: priceVal
        }
      });
      savedPrices.push(updatedPrice);
    }

    // If it's the first time, backpopulate past elaborations
    if (isFirstTime && savedPrices.length > 0) {
      const pastElaborations = await prisma.elaboration.findMany({
        where: {
          recipe: { clientProfileId: profile.id }
        },
        include: { ingredients: true }
      });

      // Create a map for quick lookup
      const priceMap = {};
      savedPrices.forEach(p => {
        priceMap[`${p.name.toLowerCase()}_${p.unit.toLowerCase()}`] = p.price;
      });

      // Update each past elaboration
      for (const elab of pastElaborations) {
        let totalCost = 0;
        elab.ingredients.forEach(ing => {
          const lookupKey = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`;
          const price = priceMap[lookupKey] || 0;
          const amount = parseFloat(ing.realAmount.toString().replace(',', '.')) || 0;
          totalCost += amount * price;
        });

        if (totalCost > 0) {
          await prisma.elaboration.update({
            where: { id: elab.id },
            data: { costPrice: totalCost }
          });
        }
      }
    }

    return NextResponse.json({ success: true, backpopulated: isFirstTime });
  } catch (error) {
    console.error("Error POST /api/ingredient-prices:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
