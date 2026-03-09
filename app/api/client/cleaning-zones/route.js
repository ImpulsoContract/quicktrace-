import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const zones = await prisma.cleaningZone.findMany({
      where: { clientProfileId: profile.id },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(zones);
  } catch (error) {
    console.error("Error fetching cleaning zones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Nombre de zona requerido" }, { status: 400 });
    }

    const zone = await prisma.cleaningZone.create({
      data: {
        name,
        clientProfileId: profile.id
      }
    });

    return NextResponse.json({ success: true, zone });
  } catch (error) {
    console.error("Error creating cleaning zone:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const zone = await prisma.cleaningZone.findUnique({
      where: { id: parseInt(id) }
    });

    if (!zone || zone.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Zona no encontrada o no pertenece al cliente" }, { status: 403 });
    }

    const updated = await prisma.cleaningZone.update({
      where: { id: parseInt(id) },
      data: { name }
    });

    return NextResponse.json({ success: true, zone: updated });
  } catch (error) {
    console.error("Error updating cleaning zone:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de zona requerido" }, { status: 400 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    const zoneId = parseInt(id);
    const zone = await prisma.cleaningZone.findUnique({
      where: { id: zoneId }
    });

    if (!zone || zone.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Zona no encontrada o no pertenece al cliente" }, { status: 403 });
    }

    // Guard: Check if logs exist in this zone
    const logCount = await prisma.cleaningLogZone.count({
      where: { cleaningZoneId: zoneId }
    });

    if (logCount > 0) {
      return NextResponse.json({ 
        error: "No se puede eliminar la zona porque tiene registros de limpieza asociados. Debe eliminarlos primero." 
      }, { status: 400 });
    }

    await prisma.cleaningZone.delete({
      where: { id: zoneId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cleaning zone:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
