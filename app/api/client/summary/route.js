import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profile = await prisma.clientProfile.findFirst({
      where: {
        OR: [
          { id: session.user.profileId ? Number(session.user.profileId) : undefined },
          { userId: session.user.id ? Number(session.user.id) : undefined }
        ].filter(Boolean)
      },
      select: { id: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const clientProfileId = profile.id;
    const { searchParams } = new URL(request.url);

    const now = new Date();
    const defaultTodayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const defaultTodayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const dayOfWeek = now.getDay(); // 0 (Sun) .. 6 (Sat)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const defaultWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
    const defaultWeekEnd = new Date(defaultWeekStart.getFullYear(), defaultWeekStart.getMonth(), defaultWeekStart.getDate() + 6, 23, 59, 59, 999);

    const todayStart = searchParams.get("todayStart") ? new Date(searchParams.get("todayStart")) : defaultTodayStart;
    const todayEnd = searchParams.get("todayEnd") ? new Date(searchParams.get("todayEnd")) : defaultTodayEnd;
    const weekStart = searchParams.get("weekStart") ? new Date(searchParams.get("weekStart")) : defaultWeekStart;
    const weekEnd = searchParams.get("weekEnd") ? new Date(searchParams.get("weekEnd")) : defaultWeekEnd;

    const [
      activeRecipesCount,
      todayElaborations,
      todayGoods,
      todayTemperatures,
      todayCleaning,
      todayWater,
      todayWaste,
      todayCutting,
      todayOil,
      todayVegetables,
      weekElaborations,
      weekGoods,
      weekTemperatures,
      weekCleaning,
      weekWater,
      weekWaste,
      weekCutting,
      weekOil,
      weekVegetables
    ] = await Promise.all([
      prisma.recipe.count({ where: { clientProfileId } }),
      prisma.elaboration.count({
        where: { recipe: { clientProfileId }, date: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.goodsReceipt.count({
        where: { clientProfileId, date: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.temperatureRecord.count({
        where: { clientProfileId, date: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.cleaningLog.count({
        where: { clientProfileId, date: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.waterMeasurement.count({
        where: { clientProfileId, date: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.wasteCollection.count({
        where: { clientProfileId, date: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.cuttingRecord.count({
        where: {
          clientProfileId,
          OR: [
            { openDate: { gte: todayStart, lte: todayEnd } },
            { openDate: null, createdAt: { gte: todayStart, lte: todayEnd } }
          ]
        }
      }),
      prisma.oilCollection.count({
        where: { clientProfileId, changeDate: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.vegetableDisinfection.count({
        where: { clientProfileId, date: { gte: todayStart, lte: todayEnd } }
      }),
      // Weekly records (only dates)
      prisma.elaboration.findMany({
        where: { recipe: { clientProfileId }, date: { gte: weekStart, lte: weekEnd } },
        select: { date: true }
      }),
      prisma.goodsReceipt.findMany({
        where: { clientProfileId, date: { gte: weekStart, lte: weekEnd } },
        select: { date: true }
      }),
      prisma.temperatureRecord.findMany({
        where: { clientProfileId, date: { gte: weekStart, lte: weekEnd } },
        select: { date: true }
      }),
      prisma.cleaningLog.findMany({
        where: { clientProfileId, date: { gte: weekStart, lte: weekEnd } },
        select: { date: true }
      }),
      prisma.waterMeasurement.findMany({
        where: { clientProfileId, date: { gte: weekStart, lte: weekEnd } },
        select: { date: true }
      }),
      prisma.wasteCollection.findMany({
        where: { clientProfileId, date: { gte: weekStart, lte: weekEnd } },
        select: { date: true }
      }),
      prisma.cuttingRecord.findMany({
        where: {
          clientProfileId,
          OR: [
            { openDate: { gte: weekStart, lte: weekEnd } },
            { openDate: null, createdAt: { gte: weekStart, lte: weekEnd } }
          ]
        },
        select: { openDate: true, createdAt: true }
      }),
      prisma.oilCollection.findMany({
        where: { clientProfileId, changeDate: { gte: weekStart, lte: weekEnd } },
        select: { changeDate: true }
      }),
      prisma.vegetableDisinfection.findMany({
        where: { clientProfileId, date: { gte: weekStart, lte: weekEnd } },
        select: { date: true }
      })
    ]);

    const todayControlsBreakdown = {
      goods: todayGoods,
      temperatures: todayTemperatures,
      cleaning: todayCleaning,
      water: todayWater,
      waste: todayWaste,
      cutting: todayCutting,
      oil: todayOil,
      vegetables: todayVegetables
    };

    const todayControlsTotal =
      todayGoods +
      todayTemperatures +
      todayCleaning +
      todayWater +
      todayWaste +
      todayCutting +
      todayOil +
      todayVegetables;

    return NextResponse.json(
      {
        activeRecipesCount,
        todayElaborations,
        todayControlsTotal,
        todayControlsBreakdown,
        weekDates: {
          elaborations: weekElaborations.map((r) => r.date),
          goods: weekGoods.map((r) => r.date),
          temperatures: weekTemperatures.map((r) => r.date),
          cleaning: weekCleaning.map((r) => r.date),
          water: weekWater.map((r) => r.date),
          waste: weekWaste.map((r) => r.date),
          cutting: weekCutting.map((r) => r.openDate || r.createdAt),
          oil: weekOil.map((r) => r.changeDate),
          vegetables: weekVegetables.map((r) => r.date)
        }
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      }
    );
  } catch (error) {
    console.error("Error in /api/client/summary:", error);
    return NextResponse.json({ error: "Error al cargar el resumen" }, { status: 500 });
  }
}
