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

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where = { clientProfileId: profile.id };
    
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

    const measurements = await prisma.waterMeasurement.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(measurements);
  } catch (error) {
    console.error("Error fetching water measurements:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
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
        _count: { select: { waterMeasurements: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Check plan limits for Water module
    if (profile.plan && profile.plan.waterLimit !== null) {
      if (profile._count.waterMeasurements >= profile.plan.waterLimit) {
        return NextResponse.json({ 
          error: "Has alcanzado el límite de mediciones de agua para tu plan.",
          code: "LIMIT_REACHED"
        }, { status: 403 });
      }
    }

    const body = await req.json();
    const { 
      date,
      samplingPoint,
      chlorine,
      turbidity,
      odor,
      flavor,
      color,
      responsible,
      receiptImage
    } = body;

    if (!date || chlorine === undefined) {
      return NextResponse.json({ error: "Fecha y Cloro son obligatorios" }, { status: 400 });
    }

    const measurement = await prisma.waterMeasurement.create({
      data: {
        date: new Date(date),
        samplingPoint,
        chlorine,
        turbidity: !!turbidity,
        odor: !!odor,
        flavor: !!flavor,
        color: !!color,
        responsible,
        receiptImage,
        clientProfileId: profile.id
      }
    });

    return NextResponse.json({ success: true, measurement });
  } catch (error) {
    console.error("Error creating water measurement:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
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

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { 
      id,
      date,
      samplingPoint,
      chlorine,
      turbidity,
      odor,
      flavor,
      color,
      responsible,
      receiptImage
    } = body;

    if (!id || !date || chlorine === undefined) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const measurement = await prisma.waterMeasurement.update({
      where: { 
        id: parseInt(id),
        clientProfileId: profile.id
      },
      data: {
        date: new Date(date),
        samplingPoint,
        chlorine,
        turbidity: !!turbidity,
        odor: !!odor,
        flavor: !!flavor,
        color: !!color,
        responsible,
        receiptImage
      }
    });

    return NextResponse.json({ success: true, measurement });
  } catch (error) {
    console.error("Error updating water measurement:", error);
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
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const deleteResult = await prisma.waterMeasurement.deleteMany({
      where: { 
        id: { in: idsToDelete },
        clientProfileId: profile.id
      }
    });
    return NextResponse.json({ success: true, count: deleteResult.count });
  } catch (error) {
    console.error("Error deleting water measurements:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
