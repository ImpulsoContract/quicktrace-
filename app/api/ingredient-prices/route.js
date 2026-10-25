import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    // Fetch all recipes with their ingredients
    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: profileId },
      include: { ingredients: true }
    });

    // Fetch existing prices
    const existingPrices = await prisma.ingredientPrice.findMany({
      where: { clientProfileId: profileId }
    });

    // Fetch linked goods for sale
    const linkedGoodsList = await prisma.goodsForSale.findMany({
      where: {
        clientProfileId: profileId,
        linkedIngredientName: { not: null }
      },
      select: {
        id: true,
        name: true,
        unit: true,
        stock: true,
        costPrice: true,
        linkedIngredientName: true
      }
    });

    const linkedGoodsByIngName = {};
    linkedGoodsList.forEach(g => {
      if (g.linkedIngredientName) {
        linkedGoodsByIngName[g.linkedIngredientName.trim().toLowerCase()] = {
          id: g.id,
          name: g.name,
          unit: g.unit,
          stock: g.stock,
          costPrice: g.costPrice
        };
      }
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
            price: 0,
            linkedGoods: linkedGoodsByIngName[nameKey.toLowerCase()] || null
          };
        }
        if (!ingredientGroups[lookupKey].recipes.includes(recipe.name)) {
          ingredientGroups[lookupKey].recipes.push(recipe.name);
        }
      });
    });

    // Merge with existing prices
    existingPrices.forEach(priceRecord => {
      const nameKey = priceRecord.name.trim();
      const unitKey = priceRecord.unit.trim();
      const lookupKey = `${nameKey.toLowerCase()}_${unitKey.toLowerCase()}`;
      if (ingredientGroups[lookupKey]) {
        ingredientGroups[lookupKey].price = priceRecord.price;
      } else {
        ingredientGroups[lookupKey] = {
          name: nameKey,
          unit: unitKey,
          recipes: [],
          price: priceRecord.price,
          linkedGoods: linkedGoodsByIngName[nameKey.toLowerCase()] || null
        };
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
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    const body = await req.json();
    const ingredients = Array.isArray(body) ? body : (body.ingredients || []);
    const targetRecipeId = body.recipeId ? parseInt(body.recipeId) : null;
    const targetElaborationId = body.elaborationId ? parseInt(body.elaborationId) : null;

    const savedPrices = [];

    // Save or update prices
    for (const ing of ingredients) {
      if (ing.price === "" || ing.price === null || undefined === ing.price) continue;
      
      const priceVal = parseFloat(ing.price.toString().replace(',', '.'));
      if (isNaN(priceVal)) continue;

      const updatedPrice = await prisma.ingredientPrice.upsert({
        where: {
          clientProfileId_name_unit: {
            clientProfileId: profileId,
            name: ing.name.trim(),
            unit: ing.unit.trim()
          }
        },
        update: { price: priceVal },
        create: {
          clientProfileId: profileId,
          name: ing.name.trim(),
          unit: ing.unit.trim(),
          price: priceVal
        }
      });
      savedPrices.push(updatedPrice);

      // Synchronize with linked GoodsForSale if exists
      const linkedGoods = await prisma.goodsForSale.findFirst({
        where: {
          clientProfileId: profileId,
          linkedIngredientName: { equals: ing.name.trim(), mode: "insensitive" }
        }
      });
      if (linkedGoods) {
        await prisma.goodsForSale.update({
          where: { id: linkedGoods.id },
          data: { costPrice: priceVal }
        });
      }
    }

    // Recalculate elaborations
    if (savedPrices.length > 0) {
      const allPrices = await prisma.ingredientPrice.findMany({
        where: { clientProfileId: profileId }
      });

      const priceMap = {};
      allPrices.forEach(p => {
        priceMap[`${p.name.trim().toLowerCase()}_${p.unit.trim().toLowerCase()}`] = p.price;
      });

      const elabWhere = {
        recipe: { clientProfileId: profileId }
      };

      if (targetRecipeId) {
        elabWhere.recipeId = targetRecipeId;
      } else if (targetElaborationId) {
        elabWhere.id = targetElaborationId;
      }

      const elaborationsToUpdate = await prisma.elaboration.findMany({
        where: elabWhere,
        include: { ingredients: true }
      });

      for (const elab of elaborationsToUpdate) {
        let totalCost = 0;
        elab.ingredients.forEach(ing => {
          const lookupKey = `${ing.name.trim().toLowerCase()}_${ing.unit.trim().toLowerCase()}`;
          const price = priceMap[lookupKey] || 0;
          const amount = parseFloat(ing.realAmount?.toString().replace(',', '.')) || 0;
          totalCost += amount * price;
        });

        await prisma.elaboration.update({
          where: { id: elab.id },
          data: { costPrice: totalCost }
        });
      }
    }

    return NextResponse.json({ success: true, backpopulated: true });
  } catch (error) {
    console.error("Error POST /api/ingredient-prices:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
