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

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId },
      select: {
        goodsLowStockAlertEnabled: true,
        goodsLowStockThreshold: true,
        goodsLowStockInApp: true
      }
    });

    if (!profile || !profile.goodsLowStockAlertEnabled || !profile.goodsLowStockInApp) {
      return NextResponse.json({
        enabled: false,
        count: 0,
        items: []
      });
    }

    const threshold = (profile.goodsLowStockThreshold !== null && profile.goodsLowStockThreshold !== undefined)
      ? profile.goodsLowStockThreshold
      : 2;

    const lowStockGoods = await prisma.goodsForSale.findMany({
      where: {
        clientProfileId: profileId,
        isArchived: false,
        stock: { lt: threshold }
      },
      select: {
        id: true,
        name: true,
        unit: true,
        stock: true,
        salePrice: true,
        costPrice: true
      },
      orderBy: { stock: "asc" }
    });

    return NextResponse.json({
      enabled: true,
      threshold,
      count: lowStockGoods.length,
      items: lowStockGoods
    });
  } catch (error) {
    console.error("Error GET /api/client/notifications/goods-low-stock:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
