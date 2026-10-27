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

    // 1. Fetch low stock active goods for sale
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
        costPrice: true,
        linkedIngredientName: true
      },
      orderBy: { stock: "asc" }
    });

    // All active goods for sale with links to avoid duplicating items
    const allLinkedGoods = await prisma.goodsForSale.findMany({
      where: {
        clientProfileId: profileId,
        isArchived: false,
        linkedIngredientName: { not: null }
      },
      select: {
        linkedIngredientName: true
      }
    });
    const allLinkedIngNames = new Set(
      allLinkedGoods
        .map(g => g.linkedIngredientName?.trim().toLowerCase())
        .filter(Boolean)
    );

    // 2. Fetch low stock ingredients
    const lowStockIngredients = await prisma.ingredientStock.findMany({
      where: {
        clientProfileId: profileId,
        stock: { lt: threshold }
      },
      select: {
        id: true,
        name: true,
        unit: true,
        stock: true
      },
      orderBy: { stock: "asc" }
    });

    // Exclude ingredients that are already represented as a linked goods for sale
    const unlinkedLowStockIngredients = lowStockIngredients.filter(ing => {
      return !allLinkedIngNames.has(ing.name.trim().toLowerCase());
    });

    const items = [
      ...lowStockGoods.map(g => ({
        id: `gfs_${g.id}`,
        rawId: g.id,
        name: g.name,
        unit: g.unit,
        stock: g.stock,
        type: 'goods',
        isLinked: Boolean(g.linkedIngredientName)
      })),
      ...unlinkedLowStockIngredients.map(ing => ({
        id: `ing_${ing.id}`,
        rawId: ing.id,
        name: ing.name,
        unit: ing.unit,
        stock: ing.stock,
        type: 'ingredient',
        isLinked: false
      }))
    ];

    items.sort((a, b) => (a.stock || 0) - (b.stock || 0));

    return NextResponse.json({
      enabled: true,
      threshold,
      count: items.length,
      items,
      goodsCount: lowStockGoods.length,
      ingredientsCount: unlinkedLowStockIngredients.length
    });
  } catch (error) {
    console.error("Error GET /api/client/notifications/goods-low-stock:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
