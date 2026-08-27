import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isRecipeLimitExceeded } from "@/lib/planLimits";
import { 
  processNewGoodsReceiptStock, 
  processUpdatedGoodsReceiptStock, 
  processDeletedGoodsReceiptsStock 
} from "@/lib/stock-utils";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
    return NextResponse.json({ error: "No tienes permiso para acceder a mercancías" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const productName = searchParams.get("productName");
    const providerName = searchParams.get("providerName");
    const lote = searchParams.get("lote");

    const where = { clientProfileId: profileId };
    let take = undefined;
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    if (productName) {
      where.productName = {
        contains: productName,
        mode: "insensitive"
      };
    }

    if (providerName) {
      where.providerName = {
        contains: providerName,
        mode: "insensitive"
      };
    }

    if (lote) {
      where.lote = {
        contains: lote,
        mode: "insensitive"
      };
    }

    const hasFilters = startDate || endDate || productName || providerName || lote;
    if (!hasFilters) {
      take = 40;
    }

    const receipts = await prisma.goodsReceipt.findMany({
      where,
      orderBy: { date: 'desc' },
      take: take
    });

    const totalCount = await prisma.goodsReceipt.count({
      where: { clientProfileId: profileId }
    });

    return NextResponse.json(receipts, {
      headers: {
        "x-total-count": totalCount.toString()
      }
    });
  } catch (error) {
    console.error("Error fetching goods receipts:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
    return NextResponse.json({ error: "No tienes permiso para registrar entradas de mercancía" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (await isRecipeLimitExceeded(profileId)) {
      return NextResponse.json({ error: "RECIPES_LIMIT_EXCEEDED" }, { status: 403 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId },
      include: { 
        plan: true,
        _count: { select: { goodsReceipts: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (!profile.plan || !profile.plan.hasGoods) {
      return NextResponse.json({ error: "El módulo de recepción de mercancías no está incluido en tu plan." }, { status: 403 });
    }

    if (profile.plan.goodsLimit !== null && profile._count.goodsReceipts >= profile.plan.goodsLimit) {
      return NextResponse.json({ error: "Has alcanzado el límite de registros de mercancías de tu plan." }, { status: 403 });
    }

    const body = await req.json();
    const { 
      providerName, 
      productName, 
      lote, 
      invoiceNumber, 
      quantity, 
      date, 
      deliveryNoteImage,
      manufacturingTemp,
      endDate,
      typeAndOrigin,
      providerId,
      merchantTypes,
      relatedIngredients,
      relatedQuantities
    } = body;

    if (!productName || !date) {
      return NextResponse.json({ error: "Producto y fecha son obligatorios" }, { status: 400 });
    }

    const receipt = await prisma.goodsReceipt.create({
      data: {
        providerName,
        productName,
        lote,
        invoiceNumber,
        quantity,
        date: new Date(date),
        deliveryNoteImage,
        manufacturingTemp,
        endDate,
        typeAndOrigin,
        merchantTypes: merchantTypes || [],
        relatedIngredients: relatedIngredients || [],
        relatedQuantities: relatedQuantities || {},
        providerId: providerId ? parseInt(providerId) : null,
        clientProfileId: profile.id
      }
    });

    // Update stock levels
    await processNewGoodsReceiptStock(profile.id, relatedQuantities);

    return NextResponse.json({ success: true, receipt });
  } catch (error) {
    console.error("Error creating goods receipt:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
    return NextResponse.json({ error: "No tienes permiso para modificar entradas de mercancía" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    const body = await req.json();
    const { 
      id,
      providerName, 
      productName, 
      lote, 
      invoiceNumber, 
      quantity, 
      date, 
      deliveryNoteImage,
      manufacturingTemp,
      endDate,
      typeAndOrigin,
      providerId,
      merchantTypes,
      relatedIngredients,
      relatedQuantities
    } = body;

    if (!id || !productName || !date) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Fetch existing record to calculate old quantities
    const existing = await prisma.goodsReceipt.findUnique({
      where: { 
        id: parseInt(id),
        clientProfileId: profileId
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });
    }

    const receipt = await prisma.goodsReceipt.update({
      where: { 
        id: parseInt(id),
        clientProfileId: profileId
      },
      data: {
        providerName,
        productName,
        lote,
        invoiceNumber,
        quantity,
        date: new Date(date),
        deliveryNoteImage,
        manufacturingTemp,
        endDate,
        typeAndOrigin,
        merchantTypes: merchantTypes !== undefined ? merchantTypes : undefined,
        relatedIngredients: relatedIngredients !== undefined ? relatedIngredients : undefined,
        relatedQuantities: relatedQuantities !== undefined ? relatedQuantities : undefined,
        providerId: providerId ? parseInt(providerId) : null
      }
    });

    // Update stock levels
    const finalNewQuantities = relatedQuantities !== undefined ? relatedQuantities : existing.relatedQuantities;
    await processUpdatedGoodsReceiptStock(profileId, existing.relatedQuantities, finalNewQuantities);

    return NextResponse.json({ success: true, receipt });
  } catch (error) {
    console.error("Error updating goods receipt:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER") {
    return NextResponse.json({ error: "No tienes permisos para eliminar registros" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let idsToDelete = [];
  try {
    if (id) {
      idsToDelete = [parseInt(id)];
    } else {
      const body = await req.json();
      if (body.ids && Array.isArray(body.ids)) {
        idsToDelete = body.ids.map(id => parseInt(id));
      }
    }
  } catch (e) {}

  if (idsToDelete.length === 0) {
    return NextResponse.json({ error: "IDs requeridos" }, { status: 400 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Fetch the receipts to be deleted first
    const receiptsToDelete = await prisma.goodsReceipt.findMany({
      where: {
        id: { in: idsToDelete },
        clientProfileId: profileId
      }
    });

    const deleteResult = await prisma.goodsReceipt.deleteMany({
      where: { 
        id: { in: idsToDelete },
        clientProfileId: profileId
      }
    });

    // Subtract from stock
    await processDeletedGoodsReceiptsStock(profileId, receiptsToDelete);

    return NextResponse.json({ success: true, count: deleteResult.count });
  } catch (error) {
    console.error("Error deleting goods receipts:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
