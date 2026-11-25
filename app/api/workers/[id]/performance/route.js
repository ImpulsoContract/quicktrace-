import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getDateRange(range, customStart, customEnd) {
  const now = new Date();
  let start, end;

  switch (range) {
    case "today":
    case "hoy": {
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "yesterday":
    case "ayer": {
      start = new Date(now);
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "14days":
    case "14_days":
    case "ultimos_14_dias": {
      start = new Date(now);
      start.setDate(start.getDate() - 14);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "30days":
    case "30_days":
    case "ultimos_30_dias": {
      start = new Date(now);
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "3months":
    case "3_months":
    case "ultimos_3_meses": {
      start = new Date(now);
      start.setMonth(start.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "custom":
    case "personalizado": {
      if (customStart) {
        start = new Date(customStart);
        if (isNaN(start.getTime())) start = new Date(now);
        start.setHours(0, 0, 0, 0);
      } else {
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
      }
      if (customEnd) {
        end = new Date(customEnd);
        if (isNaN(end.getTime())) end = new Date(now);
        end.setHours(23, 59, 59, 999);
      } else {
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
      }
      break;
    }
    case "7days":
    case "7_days":
    case "ultimos_7_dias":
    default: {
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }
  }

  return { start, end };
}

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const workerId = parseInt(params.id, 10);
    if (isNaN(workerId)) {
      return NextResponse.json({ error: "ID de trabajador inválido" }, { status: 400 });
    }

    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: {
        user: { select: { email: true, name: true } },
        clientProfile: { select: { id: true, razonSocial: true, personName: true } }
      }
    });

    if (!worker) {
      return NextResponse.json({ error: "Trabajador no encontrado" }, { status: 404 });
    }

    // Ensure the client owns this worker (unless ADMIN)
    if (session.user.role !== "ADMIN" && worker.clientProfileId !== session.user.profileId) {
      return NextResponse.json({ error: "No autorizado para ver este trabajador" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7days";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const { start, end } = getDateRange(range, startDateParam, endDateParam);
    const clientProfileId = worker.clientProfileId;
    const trimmedName = worker.name.trim();

    // Check for other workers in this profile to see if first name is safe to use
    const otherWorkers = await prisma.worker.findMany({
      where: { clientProfileId, id: { not: worker.id } },
      select: { name: true }
    });

    const firstWord = trimmedName.split(/\s+/)[0];
    const isFirstWordUnique =
      firstWord &&
      firstWord.length >= 3 &&
      !otherWorkers.some(o => o.name.toLowerCase().includes(firstWord.toLowerCase()));

    const nameConditions = [
      { equals: trimmedName, mode: "insensitive" },
      { contains: trimmedName, mode: "insensitive" }
    ];
    if (isFirstWordUnique) {
      nameConditions.push({ equals: firstWord, mode: "insensitive" });
    }

    // Query record counts in parallel across all modules
    const [
      elaborationsCount,
      cleaningCount,
      waterCount,
      wasteCount,
      oilCount,
      vegetablesCount,
      temperaturesCount,
      goodsCount,
      cuttingCount
    ] = await Promise.all([
      // 1. Elaborations
      prisma.elaboration.count({
        where: {
          recipe: { clientProfileId },
          date: { gte: start, lte: end },
          OR: nameConditions.map(c => ({ personName: c }))
        }
      }),

      // 2. Cleaning Logs
      prisma.cleaningLog.count({
        where: {
          clientProfileId,
          date: { gte: start, lte: end },
          OR: nameConditions.map(c => ({ personName: c }))
        }
      }),

      // 3. Water Measurements
      prisma.waterMeasurement.count({
        where: {
          clientProfileId,
          date: { gte: start, lte: end },
          OR: nameConditions.map(c => ({ responsible: c }))
        }
      }),

      // 4. Waste Collections
      prisma.wasteCollection.count({
        where: {
          clientProfileId,
          date: { gte: start, lte: end },
          OR: nameConditions.map(c => ({ personName: c }))
        }
      }),

      // 5. Oil Collections
      prisma.oilCollection.count({
        where: {
          clientProfileId,
          OR: [
            { changeDate: { gte: start, lte: end } },
            { loadDate: { gte: start, lte: end } },
            { createdAt: { gte: start, lte: end } }
          ],
          AND: [
            {
              OR: nameConditions.map(c => ({ personName: c }))
            }
          ]
        }
      }),

      // 6. Vegetable Disinfections
      prisma.vegetableDisinfection.count({
        where: {
          clientProfileId,
          date: { gte: start, lte: end },
          OR: nameConditions.map(c => ({ personName: c }))
        }
      }),

      // 7. Temperature Records
      prisma.temperatureRecord.count({
        where: {
          clientProfileId,
          date: { gte: start, lte: end },
          OR: nameConditions.map(c => ({ notes: c }))
        }
      }),

      // 8. Goods Receipts
      prisma.goodsReceipt.count({
        where: {
          clientProfileId,
          date: { gte: start, lte: end },
          OR: [
            ...nameConditions.map(c => ({ providerName: c })),
            ...nameConditions.map(c => ({ invoiceNumber: c })),
            ...nameConditions.map(c => ({ typeAndOrigin: c }))
          ]
        }
      }),

      // 9. Cutting Records
      prisma.cuttingRecord.count({
        where: {
          clientProfileId,
          OR: [
            { openDate: { gte: start, lte: end } },
            { closeDate: { gte: start, lte: end } },
            { createdAt: { gte: start, lte: end } }
          ],
          AND: [
            {
              OR: nameConditions.map(c => ({ notes: c }))
            }
          ]
        }
      })
    ]);

    const counts = {
      elaborations: elaborationsCount,
      cleaning: cleaningCount,
      water: waterCount,
      waste: wasteCount,
      oil: oilCount,
      vegetables: vegetablesCount,
      temperatures: temperaturesCount,
      goods: goodsCount,
      cutting: cuttingCount
    };

    const total = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

    return NextResponse.json({
      worker: {
        id: worker.id,
        name: worker.name,
        email: worker.user?.email,
        permissions: {
          hasTraceability: Boolean(worker.hasTraceability),
          hasCleaning: Boolean(worker.hasCleaning),
          hasTemperatures: Boolean(worker.hasTemperatures),
          hasWater: Boolean(worker.hasWater),
          hasGoods: Boolean(worker.hasGoods),
          hasCutting: Boolean(worker.hasCutting),
          hasWaste: Boolean(worker.hasWaste),
          hasOil: Boolean(worker.hasOil),
          hasVegetables: Boolean(worker.hasVegetables)
        }
      },
      range,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      counts,
      total
    });
  } catch (error) {
    console.error("Error in GET /api/workers/[id]/performance:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
