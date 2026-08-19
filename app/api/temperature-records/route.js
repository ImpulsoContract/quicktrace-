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

  if (session.user.role === "WORKER" && !session.user.permissions?.hasTemperatures) {
    return NextResponse.json({ error: "No tienes permiso para acceder a temperaturas" }, { status: 403 });
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

    const records = await prisma.temperatureRecord.findMany({
      where,
      include: {
        values: {
          include: {
            chamber: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching temperature records:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasTemperatures) {
    return NextResponse.json({ error: "No tienes permiso para registrar temperaturas" }, { status: 403 });
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
        _count: { select: { temperatureRecords: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (!profile.plan || !profile.plan.hasTemperatures) {
      return NextResponse.json({ error: "El módulo de temperaturas no está incluido en tu plan." }, { status: 403 });
    }

    /*
    if (profile.plan.temperaturesLimit !== null && profile._count.temperatureRecords >= profile.plan.temperaturesLimit) {
      return NextResponse.json({ error: "Has alcanzado el límite de registros de temperatura de tu plan." }, { status: 403 });
    }
    */

    const { date, values, notes } = await req.json(); // values: { [chamberId]: temperature }
    if (!date || !values) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const record = await prisma.temperatureRecord.create({
      data: {
        date: new Date(date),
        notes: notes || null,
        clientProfileId: profile.id,
        values: {
          create: Object.entries(values).map(([chamberId, value]) => ({
            value: parseFloat(value),
            chamberId: parseInt(chamberId)
          }))
        }
      }
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Error creating temperature record:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasTemperatures) {
    return NextResponse.json({ error: "No tienes permiso para modificar temperaturas" }, { status: 403 });
  }

  try {
    const { id, date, values, notes } = await req.json();
    if (!id || !date || !values) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const existing = await prisma.temperatureRecord.findUnique({ where: { id: parseInt(id) } });
    if (!existing || existing.clientProfileId !== session.user.profileId) {
      return NextResponse.json({ error: "No autorizado o no encontrado" }, { status: 403 });
    }

    const record = await prisma.temperatureRecord.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        notes: notes || null,
        values: {
          deleteMany: {},
          create: Object.entries(values).map(([chamberId, value]) => ({
            value: parseFloat(value),
            chamberId: parseInt(chamberId)
          }))
        }
      }
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Error updating temperature record:", error);
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

    const deleteResult = await prisma.temperatureRecord.deleteMany({
      where: { 
        id: { in: idsToDelete },
        clientProfileId: profileId
      }
    });
    return NextResponse.json({ success: true, count: deleteResult.count });
  } catch (error) {
    console.error("Error deleting temperature records:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
