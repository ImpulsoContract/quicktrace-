import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
      return NextResponse.json({ error: "No tienes permiso para acceder a mercancías" }, { status: 403 });
    }

    const goodsForSaleId = parseInt(params.id, 10);
    if (isNaN(goodsForSaleId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const goodsForSale = await prisma.goodsForSale.findFirst({
      where: {
        id: goodsForSaleId,
        ...(session.user.role !== "ADMIN" && profileId ? { clientProfileId: profileId } : {})
      }
    });

    if (!goodsForSale) {
      return NextResponse.json({ error: "Mercancía en venta no encontrada" }, { status: 404 });
    }

    const receipts = await prisma.goodsReceipt.findMany({
      where: {
        goodsForSaleId: goodsForSaleId,
        clientProfileId: goodsForSale.clientProfileId,
        goodsForSaleQuantity: { gt: 0 }
      },
      select: {
        id: true,
        lote: true,
        date: true,
        providerName: true,
        invoiceNumber: true,
        goodsForSaleQuantity: true,
        goodsForSaleCostPrice: true
      },
      orderBy: { date: "desc" }
    });

    return NextResponse.json({
      success: true,
      goodsForSale: {
        id: goodsForSale.id,
        name: goodsForSale.name,
        unit: goodsForSale.unit,
        stock: goodsForSale.stock
      },
      lots: receipts
    });
  } catch (error) {
    console.error("Error GET /api/client/goods-for-sale/[id]/lots:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
      return NextResponse.json({ error: "No tienes permiso para modificar mercancías" }, { status: 403 });
    }

    const goodsForSaleId = parseInt(params.id, 10);
    if (isNaN(goodsForSaleId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const goodsForSale = await prisma.goodsForSale.findFirst({
      where: {
        id: goodsForSaleId,
        ...(session.user.role !== "ADMIN" && profileId ? { clientProfileId: profileId } : {})
      }
    });

    if (!goodsForSale) {
      return NextResponse.json({ error: "Mercancía en venta no encontrada" }, { status: 404 });
    }

    const body = await req.json();
    let updates = [];
    if (Array.isArray(body.updates)) {
      updates = body.updates;
    } else if (body.receiptId !== undefined) {
      updates = [{ receiptId: body.receiptId, newQuantity: body.newQuantity }];
    } else {
      return NextResponse.json({ error: "Datos de actualización inválidos" }, { status: 400 });
    }

    for (const u of updates) {
      const receiptId = parseInt(u.receiptId, 10);
      const newQty = parseFloat(u.newQuantity?.toString().replace(',', '.'));
      if (isNaN(receiptId) || isNaN(newQty) || newQty < 0) {
        continue;
      }

      // Verify that this receipt belongs to this goods for sale and client
      const receipt = await prisma.goodsReceipt.findFirst({
        where: {
          id: receiptId,
          goodsForSaleId: goodsForSaleId,
          clientProfileId: goodsForSale.clientProfileId
        }
      });

      if (receipt) {
        const roundedQty = Math.round(newQty * 10000) / 10000;
        await prisma.goodsReceipt.update({
          where: { id: receiptId },
          data: { goodsForSaleQuantity: roundedQty }
        });
      }
    }

    // Recalculate total stock for this GoodsForSale
    const allReceipts = await prisma.goodsReceipt.findMany({
      where: {
        goodsForSaleId: goodsForSaleId,
        clientProfileId: goodsForSale.clientProfileId
      },
      select: { goodsForSaleQuantity: true }
    });

    const totalStock = allReceipts.reduce((sum, r) => sum + (parseFloat(r.goodsForSaleQuantity) || 0), 0);
    const roundedTotalStock = Math.round(totalStock * 10000) / 10000;

    const updatedGoodsForSale = await prisma.goodsForSale.update({
      where: { id: goodsForSaleId },
      data: { stock: roundedTotalStock }
    });

    return NextResponse.json({
      success: true,
      newStock: roundedTotalStock,
      goodsForSale: updatedGoodsForSale
    });
  } catch (error) {
    console.error("Error PUT /api/client/goods-for-sale/[id]/lots:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
