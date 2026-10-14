import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";
import {
  processUpdatedElaborationStock,
  processDeletedElaborationsStock
} from "@/lib/stock-utils";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = params;
    const data = await req.json();
    const { 
      name, 
      ingredients, 
      personName, 
      date, 
      expirationDate, 
      dryingRoomIn, 
      dryingRoomOut, 
      workshopTemp,
      finalElaborationTemp,
      coolingTimeUnder10,
      preparationTime,
      unitPrice,
      quantityProduced,
      quantityUnit,
      netWeight,
      extraInfo
    } = data;

    // Buscar el perfil del cliente
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Verificar que la elaboración pertenece al cliente
    const existingElab = await prisma.elaboration.findUnique({
      where: { id: parseInt(id) },
      include: { recipe: true, ingredients: true }
    });

    if (!existingElab || (session.user.role !== "ADMIN" && existingElab.recipe.clientProfileId !== profileId)) {
      return NextResponse.json({ error: "No autorizado para modificar esta elaboración" }, { status: 403 });
    }

    // Calculate Cost Price if ingredients are provided
    let totalCost = undefined;
    if (ingredients && Array.isArray(ingredients)) {
      const existingPrices = await prisma.ingredientPrice.findMany({
        where: { clientProfileId: profileId }
      });

      const priceMap = {};
      existingPrices.forEach(p => {
        const nameKey = (p.name || '').trim().toLowerCase();
        const unitKey = (p.unit || '').trim().toLowerCase();
        priceMap[`${nameKey}_${unitKey}`] = p.price;
        if (!priceMap[nameKey]) {
          priceMap[nameKey] = p.price;
        }
      });

      totalCost = 0;
      ingredients.forEach(ing => {
        const nameKey = (ing.name || '').trim().toLowerCase();
        const unitKey = (ing.unit || '').trim().toLowerCase();
        const lookupKey = `${nameKey}_${unitKey}`;
        const price = priceMap[lookupKey] !== undefined ? priceMap[lookupKey] : (priceMap[nameKey] || 0);
        const amount = parseFloat((ing.realAmount || 0).toString().replace(',', '.')) || 0;
        totalCost += amount * price;
      });

      const profile = await prisma.clientProfile.findUnique({
        where: { id: profileId },
        select: { blockOutOfStockLots: true }
      });

      if (profile?.blockOutOfStockLots) {
        for (const ing of ingredients) {
          const lot = ing.lote ? ing.lote.trim() : "";
          const ingName = ing.name ? ing.name.trim().toLowerCase() : "";
          if (!lot || !ingName) continue;

          // If the lot was already assigned to this ingredient in the existing elaboration, allow it
          const wasAlreadyAssigned = existingElab.ingredients?.some(
            ei => (ei.name || '').trim().toLowerCase() === ingName && (ei.lote || '').trim().toLowerCase() === lot.toLowerCase()
          );
          if (wasAlreadyAssigned) continue;

          const matchingReceipts = await prisma.goodsReceipt.findMany({
            where: {
              clientProfileId: profileId,
              lote: { equals: lot, mode: 'insensitive' }
            },
            select: {
              relatedIngredients: true,
              relatedQuantities: true,
              quantity: true
            }
          });

          if (matchingReceipts.length > 0) {
            let received = 0;
            matchingReceipts.forEach(gr => {
              const relQs = (gr.relatedQuantities && typeof gr.relatedQuantities === 'object') ? gr.relatedQuantities : {};
              let foundInRel = false;
              for (const [k, val] of Object.entries(relQs)) {
                const lastColon = k.lastIndexOf(":");
                const kName = lastColon !== -1 ? k.slice(0, lastColon).trim().toLowerCase() : k.trim().toLowerCase();
                if (kName === ingName) {
                  received += parseFloat(val?.toString().replace(',', '.')) || 0;
                  foundInRel = true;
                }
              }
              if (!foundInRel && gr.relatedIngredients && Array.isArray(gr.relatedIngredients)) {
                if (gr.relatedIngredients.some(ri => ri.trim().toLowerCase() === ingName)) {
                  received += parseFloat(gr.quantity?.toString().replace(',', '.')) || 0;
                }
              }
            });

            const matchingConsumptions = await prisma.elaborationIngredient.findMany({
              where: {
                lote: { equals: lot, mode: 'insensitive' },
                name: { equals: ing.name.trim(), mode: 'insensitive' },
                elaboration: {
                  recipe: { clientProfileId: profileId }
                }
              },
              select: { realAmount: true }
            });

            let consumed = 0;
            matchingConsumptions.forEach(ci => {
              consumed += parseFloat(ci.realAmount?.toString().replace(',', '.')) || 0;
            });

            if (received > 0 && (received - consumed) <= 0) {
              return NextResponse.json({
                error: `El lote "${lot}" del ingrediente "${ing.name}" está agotado y tu configuración no permite utilizar lotes sin stock.`
              }, { status: 400 });
            }
          }
        }
      }
    }

    // Update elaboration and recreate ingredients (simpler than syncing for this case)
    const elaboration = await prisma.elaboration.update({
      where: { id: parseInt(id) },
      data: {
        name,
        personName,
        date: date ? new Date(date) : undefined,
        expirationDate: expirationDate !== undefined ? (expirationDate ? new Date(expirationDate) : null) : undefined,
        dryingRoomIn: dryingRoomIn !== undefined ? dryingRoomIn : undefined,
        dryingRoomOut: dryingRoomOut !== undefined ? dryingRoomOut : undefined,
        workshopTemp: workshopTemp !== undefined ? workshopTemp : undefined,
        finalElaborationTemp: finalElaborationTemp !== undefined ? finalElaborationTemp : undefined,
        coolingTimeUnder10: coolingTimeUnder10 !== undefined ? coolingTimeUnder10 : undefined,
        preparationTime: preparationTime !== undefined ? preparationTime : undefined,
        quantityProduced: quantityProduced !== undefined ? quantityProduced : undefined,
        quantityUnit: quantityUnit !== undefined ? quantityUnit : undefined,
        netWeight: netWeight !== undefined ? netWeight : undefined,
        unitPrice: unitPrice !== undefined ? (parseFloat(unitPrice?.toString().replace(',', '.')) || 0) : undefined,
        extraInfo: extraInfo !== undefined ? extraInfo : undefined,
        ...(totalCost !== undefined ? { costPrice: totalCost } : {}),
        ...(ingredients && Array.isArray(ingredients) ? {
          ingredients: {
            deleteMany: {},
            create: ingredients.map(ing => ({
              name: toTitleCase(ing.name),
              lote: ing.lote,
              realAmount: ing.realAmount.toString(),
              unit: ing.unit
            }))
          }
        } : {})
      },
      include: {
        recipe: {
          include: {
            ingredients: {
              orderBy: [
                { order: 'asc' },
                { id: 'asc' }
              ]
            }
          }
        },
        ingredients: true
      }
    });

    // Update stock levels
    if (ingredients && Array.isArray(ingredients)) {
      await processUpdatedElaborationStock(profileId, existingElab.ingredients || [], ingredients);
    }

    return NextResponse.json(elaboration);
  } catch (error) {
    console.error(`Error PATCH /api/elaborations/${params.id}:`, error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = params;

    // Buscar el perfil del cliente
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Verificar que la elaboración pertenece al cliente
    const existingElab = await prisma.elaboration.findUnique({
      where: { id: parseInt(id) },
      include: { recipe: true, ingredients: true }
    });

    if (!existingElab || (session.user.role !== "ADMIN" && existingElab.recipe.clientProfileId !== profileId)) {
      return NextResponse.json({ error: "No autorizado para eliminar esta elaboración" }, { status: 403 });
    }

    await prisma.elaboration.delete({
      where: { id: parseInt(id) }
    });

    // Add back quantities to stock
    if (existingElab.ingredients && existingElab.ingredients.length > 0) {
      await processDeletedElaborationsStock(profileId, [existingElab]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error DELETE /api/elaborations/${params.id}:`, error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
