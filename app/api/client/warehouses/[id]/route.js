import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const warehouseId = parseInt(params.id);
    if (isNaN(warehouseId)) {
      return NextResponse.json({ error: "ID de almacén inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId }
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Almacén no encontrado" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && warehouse.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { name } = body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName) {
      return NextResponse.json({ error: "El nombre del almacén es obligatorio" }, { status: 400 });
    }

    // Comprobar duplicado con otro almacén
    const duplicate = await prisma.warehouse.findFirst({
      where: {
        clientProfileId: warehouse.clientProfileId,
        name: { equals: trimmedName, mode: "insensitive" },
        id: { not: warehouseId }
      }
    });

    if (duplicate) {
      return NextResponse.json({ error: "Ya existe otro almacén con este nombre" }, { status: 400 });
    }

    const updated = await prisma.warehouse.update({
      where: { id: warehouseId },
      data: { name: trimmedName },
      include: {
        _count: {
          select: { elaborations: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error PUT /api/client/warehouses/[id]:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const warehouseId = parseInt(params.id);
    if (isNaN(warehouseId)) {
      return NextResponse.json({ error: "ID de almacén inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId }
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Almacén no encontrado" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && warehouse.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.warehouse.delete({
      where: { id: warehouseId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error DELETE /api/client/warehouses/[id]:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
