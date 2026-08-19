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

  if (session.user.role === "WORKER" && !session.user.permissions?.hasWater) {
    return NextResponse.json({ error: "No tienes permiso para acceder a agua" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    const measurements = await prisma.waterMeasurement.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(measurements);
  } catch (error) {
    console.error("Error fetching water measurements:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasWater) {
    return NextResponse.json({ error: "No tienes permiso para registrar mediciones de agua" }, { status: 403 });
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
        _count: { select: { waterMeasurements: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Check plan limits for Water module
    /*
    if (profile.plan && profile.plan.waterLimit !== null) {
      if (profile._count.waterMeasurements >= profile.plan.waterLimit) {
        return NextResponse.json({ 
          error: "Has alcanzado el límite de mediciones de agua para tu plan.",
          code: "LIMIT_REACHED"
        }, { status: 403 });
      }
    }
    */

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
      ph,
      receiptImage,
      notes
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
        ph,
        receiptImage,
        notes: notes || null,
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
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasWater) {
    return NextResponse.json({ error: "No tienes permiso para modificar mediciones de agua" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
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
      ph,
      receiptImage,
      notes
    } = body;

    if (!id || !date || chlorine === undefined) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const measurement = await prisma.waterMeasurement.update({
      where: { 
        id: parseInt(id),
        clientProfileId: profileId
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
        ph,
        receiptImage,
        notes: notes || null
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

    const deleteResult = await prisma.waterMeasurement.deleteMany({
      where: { 
        id: { in: idsToDelete },
        clientProfileId: profileId
      }
    });
    return NextResponse.json({ success: true, count: deleteResult.count });
  } catch (error) {
    console.error("Error deleting water measurements:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
