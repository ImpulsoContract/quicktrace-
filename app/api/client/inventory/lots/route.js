import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name")?.trim();
    const unit = searchParams.get("unit")?.trim();

    if (!name) {
      return NextResponse.json({ error: "El nombre del ingrediente es obligatorio" }, { status: 400 });
    }

    // 1. Obtener registro de stock total del ingrediente
    const stockRecord = await prisma.ingredientStock.findFirst({
      where: {
        clientProfileId: profileId,
        name: { equals: name, mode: "insensitive" },
        ...(unit ? { unit: { equals: unit, mode: "insensitive" } } : {})
      }
    });

    // 2. Obtener todas las entradas de mercancías con lote
    const receipts = await prisma.goodsReceipt.findMany({
      where: {
        clientProfileId: profileId,
        NOT: [{ lote: null }, { lote: "" }]
      },
      select: {
        id: true,
        lote: true,
        productName: true,
        providerName: true,
        invoiceNumber: true,
        quantity: true,
        date: true,
        relatedIngredients: true,
        relatedQuantities: true
      },
      orderBy: { date: "desc" }
    });

    // 3. Obtener todas las elaboraciones que usaron este ingrediente
    const elabIngredients = await prisma.elaborationIngredient.findMany({
      where: {
        elaboration: {
          recipe: { clientProfileId: profileId }
        },
        name: { equals: name, mode: "insensitive" },
        ...(unit ? { unit: { equals: unit, mode: "insensitive" } } : {}),
        NOT: [{ lote: null }, { lote: "" }]
      },
      select: {
        id: true,
        name: true,
        lote: true,
        realAmount: true,
        unit: true,
        createdAt: true,
        elaboration: {
          select: {
            id: true,
            name: true,
            date: true,
            recipe: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // 4. Mapear y agrupar por lote
    const lotsMap = new Map();

    const getOrCreateLot = (lotStr) => {
      const cleanLot = lotStr.trim();
      if (!lotsMap.has(cleanLot)) {
        lotsMap.set(cleanLot, {
          lote: cleanLot,
          initialStock: 0,
          consumedStock: 0,
          remainingStock: 0,
          lastReceiptDate: null,
          providerName: null,
          receipts: [],
          elaborations: []
        });
      }
      return lotsMap.get(cleanLot);
    };

    // Procesar entradas de mercancías
    receipts.forEach(r => {
      const lotStr = r.lote ? r.lote.trim() : "";
      if (!lotStr) return;

      let addedQty = 0;
      let foundInRelatedQuantities = false;

      const relatedQs = (r.relatedQuantities && typeof r.relatedQuantities === "object") ? r.relatedQuantities : {};
      for (const [key, val] of Object.entries(relatedQs)) {
        const lastColon = key.lastIndexOf(":");
        if (lastColon === -1) continue;
        const kName = key.slice(0, lastColon).trim().toLowerCase();
        const kUnit = key.slice(lastColon + 1).trim().toLowerCase();

        const nameMatches = kName === name.toLowerCase();
        const unitMatches = !unit || kUnit === unit.toLowerCase();

        if (nameMatches && unitMatches) {
          const parsed = parseFloat(val?.toString().replace(',', '.')) || 0;
          if (parsed > 0) {
            addedQty += parsed;
            foundInRelatedQuantities = true;
          }
        }
      }

      // Si no estaba en relatedQuantities, verificar si está en relatedIngredients o productName
      const hasRelated = Array.isArray(r.relatedIngredients) && r.relatedIngredients.some(ri => ri && ri.trim().toLowerCase() === name.toLowerCase());
      const nameMatchesProduct = r.productName && r.productName.trim().toLowerCase() === name.toLowerCase();

      if (!foundInRelatedQuantities && (hasRelated || nameMatchesProduct)) {
        const hasAnyOtherQuantities = Object.keys(relatedQs).length > 0;
        if (!hasAnyOtherQuantities && r.quantity) {
          const parsed = parseFloat(r.quantity.toString().replace(',', '.')) || 0;
          if (parsed > 0) {
            addedQty += parsed;
          }
        }
      }

      if (addedQty > 0 || hasRelated) {
        const lotObj = getOrCreateLot(lotStr);
        lotObj.initialStock = Math.round((lotObj.initialStock + addedQty) * 10000) / 10000;
        if (!lotObj.lastReceiptDate || new Date(r.date) > new Date(lotObj.lastReceiptDate)) {
          lotObj.lastReceiptDate = r.date;
          if (r.providerName) lotObj.providerName = r.providerName;
        }
        lotObj.receipts.push({
          id: r.id,
          date: r.date,
          invoiceNumber: r.invoiceNumber || "",
          providerName: r.providerName || "",
          quantityAdded: addedQty
        });
      }
    });

    // Procesar elaboraciones
    elabIngredients.forEach(ei => {
      const lotStr = ei.lote ? ei.lote.trim() : "";
      if (!lotStr) return;

      const consumed = parseFloat(ei.realAmount?.toString().replace(',', '.')) || 0;
      const lotObj = getOrCreateLot(lotStr);
      lotObj.consumedStock = Math.round((lotObj.consumedStock + consumed) * 10000) / 10000;
      lotObj.elaborations.push({
        id: ei.id,
        elaborationId: ei.elaboration?.id,
        elaborationName: ei.elaboration?.name || "",
        recipeName: ei.elaboration?.recipe?.name || "",
        date: ei.elaboration?.date || ei.createdAt,
        quantityConsumed: consumed
      });
    });

    // Calcular stock restante y estado
    const lots = Array.from(lotsMap.values()).map(l => {
      const remaining = Math.max(0, Math.round((l.initialStock - l.consumedStock) * 10000) / 10000);
      return {
        ...l,
        remainingStock: remaining,
        status: remaining > 0 ? "in_stock" : "out_of_stock",
        receiptsCount: l.receipts.length,
        elaborationsCount: l.elaborations.length
      };
    });

    // Ordenar: primero los que tienen stock disponible, luego por fecha más reciente
    lots.sort((a, b) => {
      if (a.remainingStock > 0 && b.remainingStock <= 0) return -1;
      if (a.remainingStock <= 0 && b.remainingStock > 0) return 1;
      const dateA = a.lastReceiptDate ? new Date(a.lastReceiptDate).getTime() : 0;
      const dateB = b.lastReceiptDate ? new Date(b.lastReceiptDate).getTime() : 0;
      return dateB - dateA;
    });

    const totalStockInLots = Math.round(lots.reduce((acc, l) => acc + l.remainingStock, 0) * 10000) / 10000;
    const activeLotsCount = lots.filter(l => l.remainingStock > 0).length;

    return NextResponse.json({
      success: true,
      ingredient: {
        name,
        unit: unit || stockRecord?.unit || "",
        totalStock: stockRecord ? stockRecord.stock : 0
      },
      summary: {
        totalLotsCount: lots.length,
        activeLotsCount,
        totalStockInLots
      },
      lots
    });
  } catch (error) {
    console.error("Error GET /api/client/inventory/lots:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
