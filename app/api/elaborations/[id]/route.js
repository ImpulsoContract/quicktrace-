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
      preparationTime,
      unitPrice,
      quantityProduced,
      quantityUnit,
      netWeight,
      extraInfo
    } = data;

    // Buscar el perfil del cliente
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Verificar que la elaboración pertenece al cliente
    const existingElab = await prisma.elaboration.findUnique({
      where: { id: parseInt(id) },
      include: { recipe: true, ingredients: true }
    });

    if (!existingElab || existingElab.recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "No autorizado para modificar esta elaboración" }, { status: 403 });
    }

    // Calculate Cost Price if ingredients are provided
    let totalCost = undefined;
    if (ingredients && Array.isArray(ingredients)) {
      const existingPrices = await prisma.ingredientPrice.findMany({
        where: { clientProfileId: profile.id }
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
      await processUpdatedElaborationStock(profile.id, existingElab.ingredients || [], ingredients);
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
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Verificar que la elaboración pertenece al cliente
    const existingElab = await prisma.elaboration.findUnique({
      where: { id: parseInt(id) },
      include: { recipe: true, ingredients: true }
    });

    if (!existingElab || existingElab.recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "No autorizado para eliminar esta elaboración" }, { status: 403 });
    }

    await prisma.elaboration.delete({
      where: { id: parseInt(id) }
    });

    // Add back quantities to stock
    if (existingElab.ingredients && existingElab.ingredients.length > 0) {
      await processDeletedElaborationsStock(profile.id, [existingElab]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error DELETE /api/elaborations/${params.id}:`, error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
