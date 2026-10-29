import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const existingItem = await prisma.goodsForSale.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Mercancía no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && existingItem.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();

    // If only toggling isArchived:
    if (body.isArchived !== undefined && body.name === undefined) {
      const updated = await prisma.goodsForSale.update({
        where: { id },
        data: {
          isArchived: Boolean(body.isArchived)
        }
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const { name, unit, salePrice, isArchived, barcode } = body;

    const trimmedName = (name || "").trim();
    const trimmedUnit = (unit || "").trim();
    const parsedPrice = parseFloat(salePrice?.toString().replace(',', '.'));

    if (!trimmedName) {
      return NextResponse.json({ error: "El nombre de la mercancía es obligatorio." }, { status: 400 });
    }

    if (!trimmedUnit) {
      return NextResponse.json({ error: "La unidad de medida es obligatoria." }, { status: 400 });
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "El precio de venta debe ser un número válido mayor o igual a 0." }, { status: 400 });
    }

    // Check duplicate with another item
    const duplicate = await prisma.goodsForSale.findFirst({
      where: {
        id: { not: id },
        clientProfileId: existingItem.clientProfileId,
        name: { equals: trimmedName, mode: 'insensitive' },
        unit: { equals: trimmedUnit, mode: 'insensitive' }
      }
    });

    if (duplicate) {
      return NextResponse.json({ error: "Ya existe otra mercancía en venta con este nombre y unidad de medida." }, { status: 400 });
    }

    const updateData = {
      name: trimmedName,
      unit: trimmedUnit,
      salePrice: Math.round(parsedPrice * 100) / 100
    };

    if (barcode !== undefined) {
      updateData.barcode = barcode ? barcode.trim() : null;
    }

    if (isArchived !== undefined) {
      updateData.isArchived = Boolean(isArchived);
    }

    const updated = await prisma.goodsForSale.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating good for sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const existingItem = await prisma.goodsForSale.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Mercancía no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && existingItem.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Check if there are related goods receipts
    const receiptsCount = await prisma.goodsReceipt.count({
      where: { goodsForSaleId: id }
    });

    if (receiptsCount > 0) {
      return NextResponse.json({
        error: "No se puede eliminar la mercancía porque tiene entradas asociadas. Puedes archivarla en su lugar.",
        hasReceipts: true,
        canArchive: true
      }, { status: 400 });
    }

    await prisma.goodsForSale.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Mercancía eliminada correctamente." });
  } catch (error) {
    console.error("Error deleting good for sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
