import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAndNotifyGoodsLowStock } from "@/lib/goodsLowStockAlert";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
      return NextResponse.json({ error: "No tienes permiso para acceder al inventario" }, { status: 403 });
    }

    const profileId = session.user.profileId;
    if (!profileId) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    // Fetch all recipes with their ingredients
    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: profileId },
      include: { ingredients: true }
    });

    // Fetch existing stocks
    const existingStocks = await prisma.ingredientStock.findMany({
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
    const inventoryMap = {};

    // 1. Populate from existing stocks first
    existingStocks.forEach(stockRecord => {
      const nameKey = stockRecord.name.trim();
      const unitKey = stockRecord.unit.trim();
      const lookupKey = `${nameKey.toLowerCase()}_${unitKey.toLowerCase()}`;
      
      inventoryMap[lookupKey] = {
        name: nameKey,
        unit: unitKey,
        recipes: [],
        stock: stockRecord.stock,
        linkedGoods: linkedGoodsByIngName[nameKey.toLowerCase()] || null
      };
    });

    // 2. Populate/merge from recipes
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const nameKey = ing.name.trim();
        const unitKey = ing.unit.trim();
        const lookupKey = `${nameKey.toLowerCase()}_${unitKey.toLowerCase()}`;
        
        if (!inventoryMap[lookupKey]) {
          inventoryMap[lookupKey] = {
            name: nameKey,
            unit: unitKey,
            recipes: [],
            stock: 0,
            linkedGoods: linkedGoodsByIngName[nameKey.toLowerCase()] || null
          };
        }
        if (!inventoryMap[lookupKey].recipes.includes(recipe.name)) {
          inventoryMap[lookupKey].recipes.push(recipe.name);
        }
      });
    });

    const result = Object.values(inventoryMap).sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error GET /api/client/inventory:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
      return NextResponse.json({ error: "No tienes permiso para modificar el inventario" }, { status: 403 });
    }

    const profileId = session.user.profileId;
    if (!profileId) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    const items = await req.json(); // Array of { name, unit, stock }

    for (const item of items) {
      if (item.stock === "" || item.stock === null || undefined === item.stock) continue;
      
      const stockVal = parseFloat(item.stock.toString().replace(',', '.'));
      if (isNaN(stockVal)) continue;

      const clampedStock = Math.max(0, stockVal);

      await prisma.ingredientStock.upsert({
        where: {
          clientProfileId_name_unit: {
            clientProfileId: profileId,
            name: item.name.trim(),
            unit: item.unit.trim()
          }
        },
        update: { stock: clampedStock },
        create: {
          clientProfileId: profileId,
          name: item.name.trim(),
          unit: item.unit.trim(),
          stock: clampedStock
        }
      });

      // Synchronize with linked GoodsForSale if exists
      const linkedGoods = await prisma.goodsForSale.findFirst({
        where: {
          clientProfileId: profileId,
          linkedIngredientName: { equals: item.name.trim(), mode: "insensitive" }
        }
      });
      if (linkedGoods) {
        await prisma.goodsForSale.update({
          where: { id: linkedGoods.id },
          data: { stock: clampedStock }
        });
        try {
          await checkAndNotifyGoodsLowStock(profileId, linkedGoods.id);
        } catch (e) {
          console.error("Error in checkAndNotifyGoodsLowStock:", e);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error POST /api/client/inventory:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
