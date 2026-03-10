import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
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

    const logs = await prisma.cleaningLog.findMany({
      where: { clientProfileId: profile.id },
      include: {
        zones: {
          include: {
            cleaningZone: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching cleaning logs:", error);
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
      where: { userId: parseInt(session.user.id) },
      include: { 
        plan: true,
        _count: { select: { cleaningLogs: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (!profile.plan || !profile.plan.hasCleaning) {
      return NextResponse.json({ error: "El módulo de limpieza no está incluido en tu plan." }, { status: 403 });
    }

    if (profile.plan.cleaningLimit !== null && profile._count.cleaningLogs >= profile.plan.cleaningLimit) {
      return NextResponse.json({ error: "Has alcanzado el límite de registros de limpieza de tu plan." }, { status: 403 });
    }

    const body = await req.json();
    const { personName, date, selectedZones } = body;

    if (!personName || !date || !Array.isArray(selectedZones)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const log = await prisma.cleaningLog.create({
      data: {
        personName,
        date: new Date(date),
        clientProfileId: profile.id,
        zones: {
          create: selectedZones.map(zoneId => ({
            cleaningZoneId: zoneId
          }))
        }
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error("Error creating cleaning log:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, personName, date, selectedZones } = await req.json();
    if (!id || !personName || !date || !Array.isArray(selectedZones)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Update the log and its zones relation
    const log = await prisma.cleaningLog.update({
      where: { id: parseInt(id) },
      data: {
        personName,
        date: new Date(date),
        zones: {
          deleteMany: {}, // Clean existing zones
          create: selectedZones.map(zoneId => ({
            cleaningZoneId: zoneId
          }))
        }
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error("Error updating cleaning log:", error);
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
    return NextResponse.json({ error: "ID de registro requerido" }, { status: 400 });
  }

  try {
    await prisma.cleaningLog.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cleaning log:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
