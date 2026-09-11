import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
      return NextResponse.json({ error: "No tienes permiso para acceder a trazabilidad ni ventas" }, { status: 403 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where = {
      clientProfileId: profileId
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        where.date.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const sales = await prisma.elaborationSale.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            commercialName: true,
            fiscalName: true,
            nif: true
          }
        },
        elaboration: {
          select: {
            id: true,
            name: true,
            date: true,
            quantityProduced: true,
            quantityUnit: true,
            recipe: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        date: "asc"
      }
    });

    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
