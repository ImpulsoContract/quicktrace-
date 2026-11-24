import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_ALERT_TYPES = [
  "ELABORATIONS",
  "CLEANING",
  "TEMPERATURES",
  "WATER",
  "GOODS_RECEIPTS",
  "WASTE",
  "OIL",
  "VEGETABLE_DISINFECTION"
];

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

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const alerts = await prisma.taskAlert.findMany({
      where: { clientProfileId: profileId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error("Error fetching task alerts:", error);
    return NextResponse.json({ error: "Error al obtener alertas", details: error.message }, { status: 500 });
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
    const { alertType, daysOfWeek, weeksOfMonth, targetCount } = body;

    if (!alertType || !VALID_ALERT_TYPES.includes(alertType)) {
      return NextResponse.json({ error: "Tipo de alerta no válido" }, { status: 400 });
    }

    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0 || !daysOfWeek.every(d => Number.isInteger(d) && d >= 1 && d <= 7)) {
      return NextResponse.json({ error: "Selecciona al menos un día de la semana válido" }, { status: 400 });
    }

    if (!Array.isArray(weeksOfMonth) || weeksOfMonth.length === 0 || !weeksOfMonth.every(w => Number.isInteger(w) && w >= 1 && w <= 4)) {
      return NextResponse.json({ error: "Selecciona al menos una semana del mes válida" }, { status: 400 });
    }

    const parsedTarget = parseInt(targetCount, 10);
    if (isNaN(parsedTarget) || parsedTarget < 1) {
      return NextResponse.json({ error: "El número de registros debe ser al menos 1" }, { status: 400 });
    }

    // Sort arrays for clean consistent storage
    const sortedDays = Array.from(new Set(daysOfWeek)).sort((a, b) => a - b);
    const sortedWeeks = Array.from(new Set(weeksOfMonth)).sort((a, b) => a - b);

    const newAlert = await prisma.taskAlert.create({
      data: {
        clientProfileId: profileId,
        alertType,
        daysOfWeek: sortedDays,
        weeksOfMonth: sortedWeeks,
        targetCount: parsedTarget
      }
    });

    return NextResponse.json({
      success: true,
      alert: newAlert
    });
  } catch (error) {
    console.error("Error creating task alert:", error);
    return NextResponse.json({ error: "Error al crear la alerta", details: error.message }, { status: 500 });
  }
}
