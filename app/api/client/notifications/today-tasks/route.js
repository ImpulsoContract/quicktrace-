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

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { id: profileId },
      select: {
        hasWaterSection: true,
        hasWasteSection: true,
        hasOilCollection: true,
        hasVegetableDisinfection: true
      }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);

    let startOfDay, endOfDay, currentDayOfWeek, currentWeekOfMonth;

    if (searchParams.get("start") && searchParams.get("end")) {
      startOfDay = new Date(searchParams.get("start"));
      endOfDay = new Date(searchParams.get("end"));
    } else {
      const now = new Date();
      startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }

    if (searchParams.get("dayOfWeek")) {
      currentDayOfWeek = parseInt(searchParams.get("dayOfWeek"), 10);
    } else {
      const jsDay = new Date().getDay();
      currentDayOfWeek = jsDay === 0 ? 7 : jsDay;
    }

    if (searchParams.get("weekOfMonth")) {
      currentWeekOfMonth = parseInt(searchParams.get("weekOfMonth"), 10);
    } else {
      currentWeekOfMonth = Math.min(4, Math.ceil(new Date().getDate() / 7));
    }

    const allAlerts = await prisma.taskAlert.findMany({
      where: { clientProfileId: profileId }
    });

    const activeTodayAlerts = allAlerts.filter(a => {
      const matchesDay = Array.isArray(a.daysOfWeek) && a.daysOfWeek.includes(currentDayOfWeek);
      const matchesWeek = Array.isArray(a.weeksOfMonth) && a.weeksOfMonth.includes(currentWeekOfMonth);
      if (!matchesDay || !matchesWeek) return false;

      if (a.alertType === "WATER" && !clientProfile.hasWaterSection) return false;
      if (a.alertType === "WASTE" && !clientProfile.hasWasteSection) return false;
      if (a.alertType === "OIL" && !clientProfile.hasOilCollection) return false;
      if (a.alertType === "VEGETABLE_DISINFECTION" && !clientProfile.hasVegetableDisinfection) return false;

      return true;
    });

    const tasksWithCounts = await Promise.all(activeTodayAlerts.map(async (alert) => {
      let currentCount = 0;
      switch (alert.alertType) {
        case "ELABORATIONS":
          currentCount = await prisma.elaboration.count({
            where: {
              recipe: { clientProfileId: profileId },
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
        case "CLEANING":
          currentCount = await prisma.cleaningLog.count({
            where: {
              clientProfileId: profileId,
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
        case "TEMPERATURES":
          currentCount = await prisma.temperatureRecord.count({
            where: {
              clientProfileId: profileId,
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
        case "WATER":
          currentCount = await prisma.waterMeasurement.count({
            where: {
              clientProfileId: profileId,
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
        case "GOODS_RECEIPTS":
          currentCount = await prisma.goodsReceipt.count({
            where: {
              clientProfileId: profileId,
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
        case "WASTE":
          currentCount = await prisma.wasteCollection.count({
            where: {
              clientProfileId: profileId,
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
        case "OIL":
          currentCount = await prisma.oilCollection.count({
            where: {
              clientProfileId: profileId,
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
        case "VEGETABLE_DISINFECTION":
          currentCount = await prisma.vegetableDisinfection.count({
            where: {
              clientProfileId: profileId,
              date: { gte: startOfDay, lte: endOfDay }
            }
          });
          break;
      }

      const pendingCount = Math.max(0, alert.targetCount - currentCount);
      const isCompleted = currentCount >= alert.targetCount;

      return {
        id: alert.id,
        alertType: alert.alertType,
        targetCount: alert.targetCount,
        currentCount,
        pendingCount,
        isCompleted
      };
    }));

    // Sort: pending first, then by targetCount desc
    tasksWithCounts.sort((a, b) => {
      if (!a.isCompleted && b.isCompleted) return -1;
      if (a.isCompleted && !b.isCompleted) return 1;
      return b.targetCount - a.targetCount;
    });

    const totalPendingToday = tasksWithCounts.filter(t => !t.isCompleted).length;

    return NextResponse.json({
      success: true,
      totalAlertsConfigured: allAlerts.length,
      todayTasks: tasksWithCounts,
      totalPendingToday
    });
  } catch (error) {
    console.error("Error fetching today's task alerts:", error);
    return NextResponse.json({ error: "Error al obtener tareas de hoy", details: error.message }, { status: 500 });
  }
}
