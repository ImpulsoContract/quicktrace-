import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isRecipeLimitExceeded } from "@/lib/planLimits";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para acceder a registros de limpieza" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const where = { clientProfileId: profileId };

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

    const logs = await prisma.cleaningLog.findMany({
      where,
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

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para registrar limpieza" }, { status: 403 });
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
        _count: { select: { cleaningLogs: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (!profile.plan || !profile.plan.hasCleaning) {
      return NextResponse.json({ error: "El módulo de limpieza no está incluido en tu plan." }, { status: 403 });
    }

    /*
    if (profile.plan.cleaningLimit !== null && profile._count.cleaningLogs >= profile.plan.cleaningLimit) {
      return NextResponse.json({ error: "Has alcanzado el límite de registros de limpieza de tu plan." }, { status: 403 });
    }
    */

    const body = await req.json();
    const { personName, date, selectedZones, notes } = body;

    if (!personName || !date || !Array.isArray(selectedZones)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const log = await prisma.cleaningLog.create({
      data: {
        personName,
        date: new Date(date),
        notes: notes || null,
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
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para modificar limpieza" }, { status: 403 });
  }

  try {
    const { id, personName, date, selectedZones, notes } = await req.json();
    if (!id || !personName || !date || !Array.isArray(selectedZones)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const currentLog = await prisma.cleaningLog.findUnique({ where: { id: parseInt(id) } });
    if (!currentLog || currentLog.clientProfileId !== session.user.profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Update the log and its zones relation
    const log = await prisma.cleaningLog.update({
      where: { id: parseInt(id) },
      data: {
        personName,
        date: new Date(date),
        notes: notes || null,
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

    const deleteResult = await prisma.cleaningLog.deleteMany({
      where: { 
        id: { in: idsToDelete },
        clientProfileId: profileId
      }
    });
    return NextResponse.json({ success: true, count: deleteResult.count });
  } catch (error) {
    console.error("Error deleting cleaning logs:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
