import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;
    const { searchParams } = new URL(req.url);
    const recipeIdStr = searchParams.get("recipeId");
    const isV2 = searchParams.get("v") === "2" || searchParams.get("detailed") === "true";

    let targetIngredientNames = [];
    if (recipeIdStr) {
      const parsedId = parseInt(recipeIdStr);
      if (!isNaN(parsedId)) {
        const recipe = await prisma.recipe.findFirst({
          where: { id: parsedId, clientProfileId: profileId },
          include: { ingredients: true }
        });
        if (recipe && recipe.ingredients) {
          targetIngredientNames = recipe.ingredients
            .map(i => i.name ? i.name.trim().toLowerCase() : "")
            .filter(Boolean);
        }
      }
    }

    // 1. Fetch goods receipts for this client with lotes
    const goodsReceipts = await prisma.goodsReceipt.findMany({
      where: {
        clientProfileId: profileId,
        NOT: [
          { lote: null },
          { lote: "" }
        ]
      },
      select: {
        id: true,
        productName: true,
        providerName: true,
        lote: true,
        invoiceNumber: true,
        quantity: true,
        date: true,
        manufacturingTemp: true,
        endDate: true,
        typeAndOrigin: true,
        merchantTypes: true,
        relatedIngredients: true
      },
      orderBy: {
        date: "desc"
      },
      take: 2000
    });

    // 2. Fetch elaboration ingredients for this client with lotes, including recipe name and date
    const elabIngredients = await prisma.elaborationIngredient.findMany({
      where: {
        elaboration: {
          recipe: {
            clientProfileId: profileId
          }
        },
        NOT: [
          { lote: null },
          { lote: "" }
        ]
      },
      select: {
        name: true,
        lote: true,
        createdAt: true,
        elaboration: {
          select: {
            date: true,
            recipe: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 2000
    });

    const result = {};

    // Process goods receipts
    goodsReceipts.forEach(gr => {
      const lot = gr.lote ? gr.lote.trim() : "";
      if (!lot) return;

      const matchedNames = new Set();
      if (Array.isArray(gr.relatedIngredients)) {
        gr.relatedIngredients.forEach(ri => {
          if (ri && ri.trim()) matchedNames.add(ri.trim().toLowerCase());
        });
      }
      if (gr.productName && gr.productName.trim()) {
        matchedNames.add(gr.productName.trim().toLowerCase());
      }

      matchedNames.forEach(name => {
        if (targetIngredientNames.length > 0 && !targetIngredientNames.includes(name)) {
          return;
        }
        if (!result[name]) {
          result[name] = { goods: [], elaborations: [] };
        }
        if (isV2) {
          const alreadyExists = result[name].goods.some(g => g.id === gr.id || (g.lote === lot && String(g.date) === String(gr.date)));
          if (!alreadyExists && result[name].goods.length < 50) {
            result[name].goods.push({
              id: gr.id,
              lote: lot,
              date: gr.date,
              productName: gr.productName,
              providerName: gr.providerName || "",
              invoiceNumber: gr.invoiceNumber || "",
              quantity: gr.quantity || "",
              manufacturingTemp: gr.manufacturingTemp || "",
              endDate: gr.endDate || "",
              typeAndOrigin: gr.typeAndOrigin || "",
              merchantTypes: gr.merchantTypes || []
            });
          }
        } else {
          if (result[name].goods.length < 3 && !result[name].goods.includes(lot)) {
            result[name].goods.push(lot);
          }
        }
      });
    });

    // Process elaboration ingredients
    elabIngredients.forEach(ei => {
      const lot = ei.lote ? ei.lote.trim() : "";
      if (!lot) return;

      const name = ei.name ? ei.name.trim().toLowerCase() : "";
      if (!name) return;

      if (targetIngredientNames.length > 0 && !targetIngredientNames.includes(name)) {
        return;
      }

      if (!result[name]) {
        result[name] = { goods: [], elaborations: [] };
      }

      if (isV2) {
        const alreadyIn = result[name].elaborations.some(e => (typeof e === 'object' ? e.lote : e) === lot);
        if (result[name].elaborations.length < 3 && !alreadyIn) {
          result[name].elaborations.push({
            lote: lot,
            recipeName: ei.elaboration?.recipe?.name || "",
            date: ei.elaboration?.date || ei.createdAt
          });
        }
      } else {
        if (result[name].elaborations.length < 3 && !result[name].elaborations.includes(lot)) {
          result[name].elaborations.push(lot);
        }
      }
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error GET /api/client/ingredient-lotes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
