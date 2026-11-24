import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
    return NextResponse.json({ error: "Permiso de trazabilidad denegado" }, { status: 403 });
  }

  try {
    const elaborationId = parseInt(params.id);
    if (isNaN(elaborationId)) {
      return NextResponse.json({ error: "ID de elaboración inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const elaboration = await prisma.elaboration.findUnique({
      where: { id: elaborationId },
      include: {
        recipe: { select: { clientProfileId: true } }
      }
    });

    if (!elaboration) {
      return NextResponse.json({ error: "Elaboración no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { warehouseId } = body;

    let targetWarehouseId = null;
    if (warehouseId !== null && warehouseId !== undefined && warehouseId !== "" && warehouseId !== "none") {
      targetWarehouseId = parseInt(warehouseId);
      if (isNaN(targetWarehouseId)) {
        return NextResponse.json({ error: "ID de almacén inválido" }, { status: 400 });
      }

      // Verificar que el almacén pertenece al cliente
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

    const updated = await prisma.elaboration.update({
      where: { id: elaborationId },
      data: {
        warehouseId: targetWarehouseId
      },
      include: {
        warehouse: true,
        recipe: true
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error PATCH /api/client/elaborations/[id]/warehouse:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
