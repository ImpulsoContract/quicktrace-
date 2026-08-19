import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

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
      include: { recipe: true }
    });

    if (!existingElab || existingElab.recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "No autorizado para modificar esta elaboración" }, { status: 403 });
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
        unitPrice: unitPrice !== undefined ? (parseFloat(unitPrice?.toString().replace(',', '.')) || 0) : undefined,
        extraInfo: extraInfo !== undefined ? extraInfo : undefined,
        ingredients: {
          deleteMany: {},
          create: ingredients.map(ing => ({
            name: toTitleCase(ing.name),
            lote: ing.lote,
            realAmount: ing.realAmount.toString(),
            unit: ing.unit
          }))
        }
      },
      include: {
        recipe: true,
        ingredients: true
      }
    });

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
      include: { recipe: true }
    });

    if (!existingElab || existingElab.recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "No autorizado para eliminar esta elaboración" }, { status: 403 });
    }

    await prisma.elaboration.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error DELETE /api/elaborations/${params.id}:`, error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
