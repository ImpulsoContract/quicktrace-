import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (!["CLIENT", "ADMIN", "WORKER"].includes(session.user.role))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const elaborationId = parseInt(params.id);
    if (isNaN(elaborationId)) {
      return NextResponse.json({ error: "ID de elaboración inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const elaboration = await prisma.elaboration.findUnique({
      where: { id: elaborationId },
      include: {
        recipe: { select: { clientProfileId: true, name: true } },
        stockAdjustments: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!elaboration) {
      return NextResponse.json({ error: "Elaboración no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: elaboration.stockAdjustments || []
    });
  } catch (error) {
    console.error("Error fetching elaboration stock adjustments:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (!["CLIENT", "ADMIN", "WORKER"].includes(session.user.role))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
    return NextResponse.json({ error: "Permiso de trazabilidad denegado" }, { status: 403 });
  }

  try {
    const elaborationId = parseInt(params.id);
    if (isNaN(elaborationId)) {
      return NextResponse.json({ error: "ID de elaboración inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({ orderBy: { id: "asc" } });
      profileId = firstProfile?.id;
    }

    const elaboration = await prisma.elaboration.findUnique({
      where: { id: elaborationId },
      include: {
        recipe: { select: { clientProfileId: true, name: true } },
        sales: { select: { quantity: true, percentage: true, isDraft: true } },
        stockAdjustments: { select: { difference: true } }
      }
    });

    if (!elaboration) {
      return NextResponse.json({ error: "Elaboración no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { newStock, reason, customReason } = body;

    const parsedNewStock = parseFloat(newStock?.toString().replace(",", "."));
    if (isNaN(parsedNewStock) || parsedNewStock < 0) {
      return NextResponse.json({ error: "El nuevo stock debe ser un número mayor o igual a 0" }, { status: 400 });
    }

    // Normalizar motivo
    const validReasons = ["Caducado", "Deteriorado", "Devolución", "Otra razón", "EXPIRED", "DAMAGED", "RETURN", "OTHER"];
    if (!reason || !validReasons.includes(reason)) {
      return NextResponse.json({ error: "Debe seleccionar un motivo de modificación válido" }, { status: 400 });
    }

    let normalizedReason = reason;
    if (reason === "EXPIRED" || reason === "Caducado") normalizedReason = "Caducado";
    else if (reason === "DAMAGED" || reason === "Deteriorado") normalizedReason = "Deteriorado";
    else if (reason === "RETURN" || reason === "Devolución") normalizedReason = "Devolución";
    else if (reason === "OTHER" || reason === "Otra razón") normalizedReason = "Otra razón";

    if (normalizedReason === "Otra razón" && (!customReason || !customReason.trim())) {
      return NextResponse.json({ error: "Debe especificar el motivo de la modificación" }, { status: 400 });
    }

    // Calcular stock actual previo
    const totalProduced = parseFloat(elaboration.quantityProduced?.toString().replace(",", ".")) || 0;
    const totalSold = (elaboration.sales || []).filter(s => !s.isDraft).reduce((sum, s) => {
      if (s.quantity != null) return sum + s.quantity;
      if (totalProduced > 0 && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
      return sum;
    }, 0);

    const totalAdjustments = (elaboration.stockAdjustments || []).reduce((sum, a) => sum + (a.difference || 0), 0);
    const previousStock = Math.max(0, Math.round((totalProduced - totalSold + totalAdjustments) * 1000) / 1000);

    const difference = Math.round((parsedNewStock - previousStock) * 1000) / 1000;
    if (Math.abs(difference) < 0.0001) {
      return NextResponse.json({ error: "El nuevo stock debe ser diferente al stock actual" }, { status: 400 });
    }

    const adjustment = await prisma.elaborationStockAdjustment.create({
      data: {
        elaborationId: elaboration.id,
        previousStock,
        newStock: parsedNewStock,
        difference,
        reason: normalizedReason,
        customReason: normalizedReason === "Otra razón" ? customReason.trim() : null,
        userName: session.user.name || session.user.email || null
      }
    });

    return NextResponse.json({
      success: true,
      data: adjustment,
      currentStock: parsedNewStock
    });
  } catch (error) {
    console.error("Error creating elaboration stock adjustment:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
