import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch all zones for a client
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "Se requiere el ID del cliente" }, { status: 400 });
  }

  try {
    const zones = await prisma.cleaningZone.findMany({
      where: { clientProfileId: parseInt(clientId) },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(zones);
  } catch (error) {
    console.error("Error fetching cleaning zones:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}

// POST: Create a new zone
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { clientId, name } = await req.json();
    if (!clientId || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const zone = await prisma.cleaningZone.create({
      data: {
        name,
        clientProfileId: parseInt(clientId)
      }
    });
    return NextResponse.json({ success: true, zone });
  } catch (error) {
    console.error("Error creating cleaning zone:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}

// PATCH: Update a zone
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const zone = await prisma.cleaningZone.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    return NextResponse.json({ success: true, zone });
  } catch (error) {
    console.error("Error updating cleaning zone:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE: Remove a zone with guard
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID de zona requerido" }, { status: 400 });
  }

  try {
    const zoneId = parseInt(id);

    // Check if logs exist in this zone
    const logCount = await prisma.cleaningLogZone.count({
      where: { cleaningZoneId: zoneId }
    });

    if (logCount > 0) {
      return NextResponse.json({ 
        error: "No se puede eliminar la zona porque tiene registros de limpieza asociados. El cliente debe eliminarlos primero." 
      }, { status: 400 });
    }

    await prisma.cleaningZone.delete({
      where: { id: zoneId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cleaning zone:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
