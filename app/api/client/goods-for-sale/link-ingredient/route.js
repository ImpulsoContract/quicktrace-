import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
      return NextResponse.json({ error: "No tienes permiso para acceder a mercancías" }, { status: 403 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { action } = body;

    // UNLINK ACTION
    if (action === "unlink") {
      const { goodsForSaleId, ingredientName } = body;

      const whereClause = { clientProfileId: profileId };
      if (goodsForSaleId) {
        whereClause.id = parseInt(goodsForSaleId, 10);
      } else if (ingredientName) {
        whereClause.linkedIngredientName = { equals: ingredientName.trim(), mode: "insensitive" };
      } else {
        return NextResponse.json({ error: "Parámetros insuficientes para desvincular" }, { status: 400 });
      }

      const item = await prisma.goodsForSale.findFirst({ where: whereClause });
      if (!item) {
        return NextResponse.json({ error: "Mercancía no encontrada" }, { status: 404 });
      }

      await prisma.goodsForSale.update({
        where: { id: item.id },
        data: { linkedIngredientName: null }
      });

      return NextResponse.json({ success: true, message: "Desvinculado correctamente" });
    }

    // LINK ACTION
    const {
      goodsForSaleId,
      ingredientName,
      unifyUnitOption, // 'ingredient' | 'goods' | 'manual'
      manualUnit,
      unifyValuesOption, // 'ingredient' | 'goods' | 'manual'
      manualStock,
      manualCostPrice
    } = body;

    if (!goodsForSaleId || !ingredientName) {
      return NextResponse.json({ error: "Se requiere la mercancía y el ingrediente a enlazar." }, { status: 400 });
    }

    const gfsId = parseInt(goodsForSaleId, 10);
    const cleanIngName = ingredientName.trim();

    const goods = await prisma.goodsForSale.findFirst({
      where: { id: gfsId, clientProfileId: profileId }
    });

    if (!goods) {
      return NextResponse.json({ error: "Mercancía no encontrada" }, { status: 404 });
    }

    // Retrieve current ingredient info
    const [ingStockRecord, ingPriceRecord, recipeIng] = await Promise.all([
      prisma.ingredientStock.findFirst({
        where: { clientProfileId: profileId, name: { equals: cleanIngName, mode: "insensitive" } }
      }),
      prisma.ingredientPrice.findFirst({
        where: { clientProfileId: profileId, name: { equals: cleanIngName, mode: "insensitive" } }
      }),
      prisma.ingredient.findFirst({
        where: { recipe: { clientProfileId: profileId }, name: { equals: cleanIngName, mode: "insensitive" } }
      })
    ]);

    const ingUnit = ingStockRecord?.unit || ingPriceRecord?.unit || recipeIng?.unit || "";
    const ingStock = ingStockRecord?.stock !== undefined ? ingStockRecord.stock : 0;
    const ingCostPrice = ingPriceRecord?.price !== undefined ? ingPriceRecord.price : null;

    // Resolve unified Unit
    let targetUnit = "";
    if (unifyUnitOption === "ingredient") {
      targetUnit = (ingUnit || goods.unit).trim();
    } else if (unifyUnitOption === "goods") {
      targetUnit = (goods.unit || ingUnit).trim();
    } else if (unifyUnitOption === "manual") {
      targetUnit = (manualUnit || "").trim();
    } else {
      targetUnit = (goods.unit || ingUnit).trim();
    }

    if (!targetUnit) {
      return NextResponse.json({ error: "La unidad de medida es obligatoria." }, { status: 400 });
    }

    // Check duplicate goods with same name & targetUnit
    const duplicate = await prisma.goodsForSale.findFirst({
      where: {
        id: { not: gfsId },
        clientProfileId: profileId,
        name: { equals: goods.name, mode: "insensitive" },
        unit: { equals: targetUnit, mode: "insensitive" }
      }
    });

    if (duplicate) {
      return NextResponse.json({
        error: "Ya existe otra mercancía con este nombre y la unidad seleccionada. Cambia la unidad o el nombre antes de enlazar."
      }, { status: 400 });
    }

    // Resolve unified Stock and Cost Price
    let targetStock = 0;
    let targetCostPrice = null;

    if (unifyValuesOption === "ingredient") {
      targetStock = Math.max(0, ingStock);
      targetCostPrice = ingCostPrice !== null && ingCostPrice !== undefined ? Math.max(0, ingCostPrice) : null;
    } else if (unifyValuesOption === "goods") {
      targetStock = Math.max(0, goods.stock || 0);
      targetCostPrice = goods.costPrice !== null && goods.costPrice !== undefined ? Math.max(0, goods.costPrice) : null;
    } else if (unifyValuesOption === "manual") {
      const pStock = parseFloat(manualStock?.toString().replace(',', '.'));
      targetStock = isNaN(pStock) ? 0 : Math.max(0, pStock);

      if (manualCostPrice !== null && manualCostPrice !== undefined && manualCostPrice !== "") {
        const pCost = parseFloat(manualCostPrice?.toString().replace(',', '.'));
        targetCostPrice = isNaN(pCost) ? null : Math.max(0, pCost);
      } else {
        targetCostPrice = null;
      }
    } else {
      targetStock = Math.max(0, goods.stock || 0);
      targetCostPrice = goods.costPrice !== null && goods.costPrice !== undefined ? Math.max(0, goods.costPrice) : null;
    }

    const roundedStock = Math.round(targetStock * 10000) / 10000;
    const roundedCost = targetCostPrice !== null ? Math.round(targetCostPrice * 100) / 100 : null;

    await prisma.$transaction(async (tx) => {
      // 1. Unlink any other goods linked to this ingredient
      await tx.goodsForSale.updateMany({
        where: {
          clientProfileId: profileId,
          linkedIngredientName: { equals: cleanIngName, mode: "insensitive" },
          id: { not: gfsId }
        },
        data: { linkedIngredientName: null }
      });

      // 2. Update GoodsForSale
      await tx.goodsForSale.update({
        where: { id: gfsId },
        data: {
          unit: targetUnit,
          stock: roundedStock,
          costPrice: roundedCost,
          linkedIngredientName: cleanIngName
        }
      });

      // 3. Upsert / synchronize IngredientStock
      await tx.ingredientStock.deleteMany({
        where: {
          clientProfileId: profileId,
          name: { equals: cleanIngName, mode: "insensitive" }
        }
      });
      await tx.ingredientStock.create({
        data: {
          clientProfileId: profileId,
          name: cleanIngName,
          unit: targetUnit,
          stock: roundedStock
        }
      });

      // 4. Upsert / synchronize IngredientPrice
      await tx.ingredientPrice.deleteMany({
        where: {
          clientProfileId: profileId,
          name: { equals: cleanIngName, mode: "insensitive" }
        }
      });
      await tx.ingredientPrice.create({
        data: {
          clientProfileId: profileId,
          name: cleanIngName,
          unit: targetUnit,
          price: roundedCost !== null ? roundedCost : 0
        }
      });

      // 5. Update unit in all recipe ingredients with this name
      await tx.ingredient.updateMany({
        where: {
          recipe: { clientProfileId: profileId },
          name: { equals: cleanIngName, mode: "insensitive" }
        },
        data: { unit: targetUnit }
      });

      // 6. Recalculate elaborations cost if cost is updated
      if (roundedCost !== null) {
        const allPrices = await tx.ingredientPrice.findMany({
          where: { clientProfileId: profileId }
        });
        const priceMap = {};
        allPrices.forEach(p => {
          priceMap[`${p.name.trim().toLowerCase()}_${p.unit.trim().toLowerCase()}`] = p.price;
        });

        const elaborationsToUpdate = await tx.elaboration.findMany({
          where: { recipe: { clientProfileId: profileId } },
          include: { ingredients: true }
        });

        for (const elab of elaborationsToUpdate) {
          let hasTargetIng = false;
          let totalCost = 0;
          elab.ingredients.forEach(ing => {
            if (ing.name.trim().toLowerCase() === cleanIngName.toLowerCase()) {
              hasTargetIng = true;
            }
            const lookupKey = `${ing.name.trim().toLowerCase()}_${ing.unit.trim().toLowerCase()}`;
            const price = priceMap[lookupKey] || 0;
            const amount = parseFloat(ing.realAmount?.toString().replace(',', '.')) || 0;
            totalCost += amount * price;
          });

          if (hasTargetIng) {
            await tx.elaboration.update({
              where: { id: elab.id },
              data: { costPrice: totalCost }
            });
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        goodsForSaleId: gfsId,
        ingredientName: cleanIngName,
        unit: targetUnit,
        stock: roundedStock,
        costPrice: roundedCost
      }
    });
  } catch (error) {
    console.error("Error POST /api/client/goods-for-sale/link-ingredient:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
