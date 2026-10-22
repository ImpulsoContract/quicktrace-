import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
      return NextResponse.json({ error: "No tienes permiso para gestionar recetas" }, { status: 403 });
    }

    const profileId = session.user.profileId;
    const body = await req.json();
    const { targetName, sourceNames } = body || {};

    if (!targetName || typeof targetName !== "string" || !targetName.trim()) {
      return NextResponse.json({ error: "El ingrediente principal es obligatorio" }, { status: 400 });
    }

    if (!Array.isArray(sourceNames) || sourceNames.length === 0) {
      return NextResponse.json({ error: "Debes seleccionar al menos un ingrediente a fusionar" }, { status: 400 });
    }

    const targetClean = targetName.trim();
    // Sources are all source names except targetName (case-insensitive)
    const sourcesClean = Array.from(new Set(
      sourceNames
        .map(s => (typeof s === "string" ? s.trim() : ""))
        .filter(s => s && s.toLowerCase() !== targetClean.toLowerCase())
    ));

    if (sourcesClean.length === 0) {
      return NextResponse.json({ error: "No hay ingredientes diferentes al principal para fusionar" }, { status: 400 });
    }

    // 1. Get all recipe IDs belonging to this client profile
    const clientRecipes = await prisma.recipe.findMany({
      where: { clientProfileId: profileId },
      select: { id: true }
    });
    const recipeIds = clientRecipes.map(r => r.id);

    if (recipeIds.length === 0) {
      return NextResponse.json({ error: "No tienes recetas registradas" }, { status: 400 });
    }

    // Prepare lower-case source names for comparison
    const lowerSources = sourcesClean.map(s => s.toLowerCase());

    // Execute merge in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 2. Update Recipe Ingredients
      const updatedIngredients = await tx.ingredient.updateMany({
        where: {
          recipeId: { in: recipeIds },
          name: { in: sourcesClean, mode: "insensitive" }
        },
        data: {
          name: targetClean
        }
      });

      // 3. Update Elaboration Ingredients
      const updatedElabIngredients = await tx.elaborationIngredient.updateMany({
        where: {
          elaboration: {
            recipeId: { in: recipeIds }
          },
          name: { in: sourcesClean, mode: "insensitive" }
        },
        data: {
          name: targetClean
        }
      });

      // 4. Update GoodsReceipts (Entradas de mercancía)
      const goodsReceipts = await tx.goodsReceipt.findMany({
        where: { clientProfileId: profileId }
      });

      let updatedGoodsCount = 0;
      for (const gr of goodsReceipts) {
        let modified = false;
        let newRelatedIngredients = Array.isArray(gr.relatedIngredients) ? [...gr.relatedIngredients] : [];
        let newRelatedQuantities = (gr.relatedQuantities && typeof gr.relatedQuantities === "object") ? { ...gr.relatedQuantities } : {};
        let newProductName = gr.productName;

        // Check relatedIngredients array
        const hasMatchInRelated = newRelatedIngredients.some(ri => lowerSources.includes((ri || "").trim().toLowerCase()));
        if (hasMatchInRelated) {
          newRelatedIngredients = newRelatedIngredients.map(ri => {
            if (lowerSources.includes((ri || "").trim().toLowerCase())) {
              return targetClean;
            }
            return ri;
          });
          // Deduplicate
          newRelatedIngredients = Array.from(new Set(newRelatedIngredients));
          modified = true;
        }

        // Check relatedQuantities keys (format: "IngredientName:unit")
        for (const [key, qty] of Object.entries(newRelatedQuantities)) {
          const colonIdx = key.lastIndexOf(":");
          if (colonIdx !== -1) {
            const ingPart = key.slice(0, colonIdx).trim().toLowerCase();
            const unitPart = key.slice(colonIdx + 1);
            if (lowerSources.includes(ingPart)) {
              delete newRelatedQuantities[key];
              const newKey = `${targetClean}:${unitPart}`;
              const prev = parseFloat(newRelatedQuantities[newKey]) || 0;
              const add = parseFloat(qty) || 0;
              newRelatedQuantities[newKey] = String(prev + add);
              modified = true;
            }
          }
        }

        // Check productName (if supplier item was named exactly like the typo)
        if (gr.productName && lowerSources.includes(gr.productName.trim().toLowerCase())) {
          newProductName = targetClean;
          modified = true;
        }

        if (modified) {
          await tx.goodsReceipt.update({
            where: { id: gr.id },
            data: {
              relatedIngredients: newRelatedIngredients,
              relatedQuantities: newRelatedQuantities,
              productName: newProductName
            }
          });
          updatedGoodsCount++;
        }
      }

      // 5. Delete stocks for source names (the primary ingredient preserves its stocks)
      const deletedStocks = await tx.ingredientStock.deleteMany({
        where: {
          clientProfileId: profileId,
          name: { in: sourcesClean, mode: "insensitive" }
        }
      });

      // 6. Delete prices for source names (the primary ingredient preserves its cost price)
      const deletedPrices = await tx.ingredientPrice.deleteMany({
        where: {
          clientProfileId: profileId,
          name: { in: sourcesClean, mode: "insensitive" }
        }
      });

      return {
        updatedIngredientsCount: updatedIngredients.count,
        updatedElaborationsCount: updatedElabIngredients.count,
        updatedGoodsCount,
        deletedStocksCount: deletedStocks.count,
        deletedPricesCount: deletedPrices.count
      };
    });

    return NextResponse.json({
      success: true,
      targetName: targetClean,
      sourceNames: sourcesClean,
      details: result
    });
  } catch (error) {
    console.error("Error in POST /api/client/recipes/ingredients/merge:", error);
    return NextResponse.json({ error: error.message || "Error interno al fusionar ingredientes" }, { status: 500 });
  }
}
