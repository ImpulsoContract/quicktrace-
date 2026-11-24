import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    if (!profileId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const where = (session.user.role === "ADMIN" && !profileId)
      ? {}
      : { clientProfileId: profileId };

    const warehouses = await prisma.warehouse.findMany({
      where,
      include: {
        _count: {
          select: { elaborations: true }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ success: true, data: warehouses });
  } catch (error) {
    console.error("Error GET /api/client/warehouses:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { name } = body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName) {
      return NextResponse.json({ error: "El nombre del almacén es obligatorio" }, { status: 400 });
    }

    // Comprobar si ya existe un almacén con este nombre para el cliente
    const existing = await prisma.warehouse.findFirst({
      where: {
        clientProfileId: profileId,
        name: { equals: trimmedName, mode: "insensitive" }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe un almacén con este nombre" }, { status: 400 });
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name: trimmedName,
        clientProfileId: profileId
      },
      include: {
        _count: {
          select: { elaborations: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: warehouse });
  } catch (error) {
    console.error("Error POST /api/client/warehouses:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
