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

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const alertId = parseInt(params.id, 10);
    if (isNaN(alertId)) {
      return NextResponse.json({ error: "ID de alerta inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const existingAlert = await prisma.taskAlert.findUnique({
      where: { id: alertId }
    });

    if (!existingAlert) {
      return NextResponse.json({ error: "Alerta no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && existingAlert.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
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

    const sortedDays = Array.from(new Set(daysOfWeek)).sort((a, b) => a - b);
    const sortedWeeks = Array.from(new Set(weeksOfMonth)).sort((a, b) => a - b);

    const updatedAlert = await prisma.taskAlert.update({
      where: { id: alertId },
      data: {
        alertType,
        daysOfWeek: sortedDays,
        weeksOfMonth: sortedWeeks,
        targetCount: parsedTarget
      }
    });

    return NextResponse.json({
      success: true,
      alert: updatedAlert
    });
  } catch (error) {
    console.error("Error updating task alert:", error);
    return NextResponse.json({ error: "Error al actualizar la alerta", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !["CLIENT", "ADMIN", "WORKER"].includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const alertId = parseInt(params.id, 10);
    if (isNaN(alertId)) {
      return NextResponse.json({ error: "ID de alerta inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const existingAlert = await prisma.taskAlert.findUnique({
      where: { id: alertId }
    });

    if (!existingAlert) {
      return NextResponse.json({ error: "Alerta no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && existingAlert.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.taskAlert.delete({
      where: { id: alertId }
    });

    return NextResponse.json({
      success: true,
      message: "Alerta eliminada correctamente"
    });
  } catch (error) {
    console.error("Error deleting task alert:", error);
    return NextResponse.json({ error: "Error al eliminar la alerta", details: error.message }, { status: 500 });
  }
}
