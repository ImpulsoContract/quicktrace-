import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAndNotifyGoodsLowStock } from "@/lib/goodsLowStockAlert";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && session.user.permissions && !session.user.permissions.hasGoods && !session.user.permissions.hasSales && !session.user.permissions.hasPos) {
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

    const { searchParams } = new URL(req.url);
    const inStockOnly = searchParams.get("inStockOnly") === "true";

    const where = {
      goodsForSaleId: goodsForSaleId,
      clientProfileId: goodsForSale.clientProfileId,
      ...(inStockOnly ? { goodsForSaleQuantity: { gt: 0 } } : {})
    };

    const receipts = await prisma.goodsReceipt.findMany({
      where,
      select: {
        id: true,
        lote: true,
        barcode: true,
        date: true,
        providerName: true,
        invoiceNumber: true,
        goodsForSaleQuantity: true,
        goodsForSaleCostPrice: true
      },
      orderBy: [
        { date: "desc" },
        { id: "desc" }
      ]
    });

    return NextResponse.json({
      success: true,
      goodsForSale: {
        id: goodsForSale.id,
        name: goodsForSale.name,
        unit: goodsForSale.unit,
        barcode: goodsForSale.barcode,
        stock: goodsForSale.stock,
        costPrice: goodsForSale.costPrice
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
      updates = [{
        receiptId: body.receiptId,
        newQuantity: body.newQuantity,
        newCostPrice: body.newCostPrice
      }];
    } else {
      return NextResponse.json({ error: "Datos de actualización inválidos" }, { status: 400 });
    }

    let hasQuantityUpdate = false;
    let hasCostPriceUpdate = false;

    for (const u of updates) {
      const receiptId = parseInt(u.receiptId, 10);
      if (isNaN(receiptId)) continue;

      // Verify that this receipt belongs to this goods for sale and client
      const receipt = await prisma.goodsReceipt.findFirst({
        where: {
          id: receiptId,
          goodsForSaleId: goodsForSaleId,
          clientProfileId: goodsForSale.clientProfileId
        }
      });

      if (!receipt) continue;

      const updateData = {};

      if (u.newQuantity !== undefined && u.newQuantity !== null && u.newQuantity !== "") {
        const parsedQty = parseFloat(u.newQuantity?.toString().replace(',', '.'));
        if (!isNaN(parsedQty) && parsedQty >= 0) {
          updateData.goodsForSaleQuantity = Math.round(parsedQty * 10000) / 10000;
          hasQuantityUpdate = true;
        }
      }

      if (u.newCostPrice !== undefined) {
        if (u.newCostPrice === null || u.newCostPrice === "") {
          updateData.goodsForSaleCostPrice = null;
          hasCostPriceUpdate = true;
        } else {
          const parsedCost = parseFloat(u.newCostPrice?.toString().replace(',', '.'));
          if (!isNaN(parsedCost) && parsedCost >= 0) {
            updateData.goodsForSaleCostPrice = Math.round(parsedCost * 100) / 100;
            hasCostPriceUpdate = true;
          }
        }
      }

      if (u.newBarcode !== undefined) {
        updateData.barcode = u.newBarcode ? u.newBarcode.trim() : null;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.goodsReceipt.update({
          where: { id: receiptId },
          data: updateData
        });
      }
    }

    const goodsForSaleUpdates = {};

    // Recalculate total stock if quantity was updated
    if (hasQuantityUpdate) {
      const allReceipts = await prisma.goodsReceipt.findMany({
        where: {
          goodsForSaleId: goodsForSaleId,
          clientProfileId: goodsForSale.clientProfileId
        },
        select: { goodsForSaleQuantity: true }
      });
      const totalStock = allReceipts.reduce((sum, r) => sum + (parseFloat(r.goodsForSaleQuantity) || 0), 0);
      goodsForSaleUpdates.stock = Math.round(totalStock * 10000) / 10000;
    }

    // Update costPrice on GoodsForSale from the most recent receipt with a cost price
    if (hasCostPriceUpdate) {
      const latestReceiptWithCost = await prisma.goodsReceipt.findFirst({
        where: {
          goodsForSaleId: goodsForSaleId,
          clientProfileId: goodsForSale.clientProfileId,
          goodsForSaleCostPrice: { not: null }
        },
        orderBy: [
        { date: "desc" },
        { id: "desc" }
      ]
      });
      goodsForSaleUpdates.costPrice = latestReceiptWithCost ? latestReceiptWithCost.goodsForSaleCostPrice : null;
    }

    let updatedGoodsForSale = goodsForSale;
    if (Object.keys(goodsForSaleUpdates).length > 0) {
      updatedGoodsForSale = await prisma.goodsForSale.update({
        where: { id: goodsForSaleId },
        data: goodsForSaleUpdates
      });

      if (updatedGoodsForSale.linkedIngredientName) {
        if (hasQuantityUpdate) {
          await prisma.ingredientStock.upsert({
            where: {
              clientProfileId_name_unit: {
                clientProfileId: updatedGoodsForSale.clientProfileId,
                name: updatedGoodsForSale.linkedIngredientName.trim(),
                unit: updatedGoodsForSale.unit.trim()
              }
            },
            update: { stock: updatedGoodsForSale.stock },
            create: {
              clientProfileId: updatedGoodsForSale.clientProfileId,
              name: updatedGoodsForSale.linkedIngredientName.trim(),
              unit: updatedGoodsForSale.unit.trim(),
              stock: updatedGoodsForSale.stock
            }
          });
        }

        if (hasCostPriceUpdate) {
          await prisma.ingredientPrice.upsert({
            where: {
              clientProfileId_name_unit: {
                clientProfileId: updatedGoodsForSale.clientProfileId,
                name: updatedGoodsForSale.linkedIngredientName.trim(),
                unit: updatedGoodsForSale.unit.trim()
              }
            },
            update: { price: updatedGoodsForSale.costPrice || 0 },
            create: {
              clientProfileId: updatedGoodsForSale.clientProfileId,
              name: updatedGoodsForSale.linkedIngredientName.trim(),
              unit: updatedGoodsForSale.unit.trim(),
              price: updatedGoodsForSale.costPrice || 0
            }
          });
        }
      }
    }

    if (hasQuantityUpdate && updatedGoodsForSale) {
      try {
        await checkAndNotifyGoodsLowStock(updatedGoodsForSale.clientProfileId, updatedGoodsForSale.id);
      } catch (e) {
        console.error("Error in checkAndNotifyGoodsLowStock:", e);
      }
    }

    return NextResponse.json({
      success: true,
      newStock: updatedGoodsForSale.stock,
      newCostPrice: updatedGoodsForSale.costPrice,
      goodsForSale: updatedGoodsForSale
    });
  } catch (error) {
    console.error("Error PUT /api/client/goods-for-sale/[id]/lots:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
