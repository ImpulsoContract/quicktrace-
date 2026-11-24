import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function handleWarehouseUpdate(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
    return NextResponse.json({ error: "Permiso de mercancías denegado" }, { status: 403 });
  }

  try {
    const receiptId = parseInt(params.id, 10);
    if (isNaN(receiptId)) {
      return NextResponse.json({ error: "ID de entrada de mercancía inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const receipt = await prisma.goodsReceipt.findUnique({
      where: { id: receiptId },
      select: { id: true, clientProfileId: true }
    });

    if (!receipt) {
      return NextResponse.json({ error: "Entrada de mercancía no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && receipt.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { warehouseId } = body;

    let targetWarehouseId = null;
    if (warehouseId !== null && warehouseId !== undefined && warehouseId !== "" && warehouseId !== "none") {
      targetWarehouseId = parseInt(warehouseId, 10);
      if (isNaN(targetWarehouseId)) {
        return NextResponse.json({ error: "ID de almacén inválido" }, { status: 400 });
      }

      const warehouse = await prisma.warehouse.findUnique({
        where: { id: targetWarehouseId }
      });

      if (!warehouse) {
        return NextResponse.json({ error: "Almacén no encontrado" }, { status: 404 });
      }

      if (session.user.role !== "ADMIN" && warehouse.clientProfileId !== profileId) {
        return NextResponse.json({ error: "No autorizado para usar este almacén" }, { status: 403 });
      }
    }

    const updated = await prisma.goodsReceipt.update({
      where: { id: receiptId },
      data: { warehouseId: targetWarehouseId },
      include: {
        warehouse: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error("Error updating goods receipt warehouse:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function PUT(req, ctx) {
  return handleWarehouseUpdate(req, ctx);
}

export async function PATCH(req, ctx) {
  return handleWarehouseUpdate(req, ctx);
}
