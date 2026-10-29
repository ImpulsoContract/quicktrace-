import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const archived = searchParams.get("archived");
    const all = searchParams.get("all");

    let isArchivedCondition = { isArchived: false };
    if (archived === "true") {
      isArchivedCondition = { isArchived: true };
    } else if (all === "true") {
      isArchivedCondition = {};
    }

    const where = {
      ...(session.user.role === "ADMIN" && !profileId ? {} : { clientProfileId: profileId }),
      ...isArchivedCondition
    };

    const items = await prisma.goodsForSale.findMany({
      where,
      include: {
        _count: {
          select: { goodsReceipts: true }
        },
        goodsReceipts: {
          select: {
            id: true,
            lote: true,
            barcode: true,
            goodsForSaleQuantity: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const baseWhere = (session.user.role === "ADMIN" && !profileId)
      ? {}
      : { clientProfileId: profileId };

    const [activeCount, archivedCount] = await Promise.all([
      prisma.goodsForSale.count({
        where: { ...baseWhere, isArchived: false }
      }),
      prisma.goodsForSale.count({
        where: { ...baseWhere, isArchived: true }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      activeCount,
      archivedCount
    });
  } catch (error) {
    console.error("Error fetching goods for sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
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

    const body = await req.json();
    const { name, unit, salePrice, barcode } = body;

    const trimmedName = (name || "").trim();
    const trimmedUnit = (unit || "").trim();
    const parsedPrice = parseFloat(salePrice?.toString().replace(',', '.'));

    if (!trimmedName) {
      return NextResponse.json({ error: "El nombre de la mercancía es obligatorio." }, { status: 400 });
    }

    if (!trimmedUnit) {
      return NextResponse.json({ error: "La unidad de medida es obligatoria." }, { status: 400 });
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "El precio de venta debe ser un número válido mayor o igual a 0." }, { status: 400 });
    }

    // Check existing
    const existing = await prisma.goodsForSale.findFirst({
      where: {
        clientProfileId: profileId,
        name: { equals: trimmedName, mode: 'insensitive' },
        unit: { equals: trimmedUnit, mode: 'insensitive' }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe una mercancía en venta con este nombre y unidad de medida." }, { status: 400 });
    }

    const item = await prisma.goodsForSale.create({
      data: {
        clientProfileId: profileId,
        name: trimmedName,
        unit: trimmedUnit,
        barcode: barcode ? barcode.trim() : null,
        salePrice: Math.round(parsedPrice * 100) / 100
      }
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error creating good for sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
