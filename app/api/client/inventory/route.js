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
        stock: stockRecord.stock
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
            stock: 0
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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error POST /api/client/inventory:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
