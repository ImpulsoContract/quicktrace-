import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const elaborationId = parseInt(params.id);
    if (isNaN(elaborationId)) {
      return NextResponse.json({ error: "ID de elaboración inválido" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const elaboration = await prisma.elaboration.findUnique({
      where: { id: elaborationId },
      include: { recipe: true }
    });

    if (!elaboration) {
      return NextResponse.json({ error: "Elaboración no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const sales = await prisma.elaborationSale.findMany({
      where: { elaborationId },
      include: { customer: true },
      orderBy: { date: 'desc' }
    });

    const totalProduced = parseFloat(elaboration.quantityProduced?.toString().replace(',', '.')) || null;
    const unit = elaboration.quantityUnit || "";

    const totalSoldQuantity = sales.reduce((sum, s) => {
      if (s.quantity != null) return sum + s.quantity;
      if (totalProduced != null && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
      return sum;
    }, 0);

    const availableQuantity = totalProduced != null ? Math.max(0, totalProduced - totalSoldQuantity) : null;
    const totalSoldPercentage = totalProduced != null && totalProduced > 0
      ? (totalSoldQuantity / totalProduced) * 100
      : sales.reduce((sum, s) => sum + (s.percentage || 0), 0);

    return NextResponse.json({
      success: true,
      sales,
      totalProduced,
      quantityUnit: unit,
      totalSoldQuantity: Math.round(totalSoldQuantity * 1000) / 1000,
      availableQuantity: availableQuantity != null ? Math.round(availableQuantity * 1000) / 1000 : null,
      totalSoldPercentage: Math.min(100, Math.round(totalSoldPercentage * 100) / 100),
      availablePercentage: Math.max(0, Math.round((100 - totalSoldPercentage) * 100) / 100)
    });
  } catch (error) {
    console.error("Error fetching elaboration sales:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const elaborationId = parseInt(params.id);
    if (isNaN(elaborationId)) {
      return NextResponse.json({ error: "ID de elaboración inválido" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const elaboration = await prisma.elaboration.findUnique({
      where: { id: elaborationId },
      include: { recipe: true }
    });

    if (!elaboration) {
      return NextResponse.json({ error: "Elaboración no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { customerId, quantity, percentage, price, date } = body;

    const totalProduced = parseFloat(elaboration.quantityProduced?.toString().replace(',', '.')) || null;
    const unit = elaboration.quantityUnit || "";

    let parsedQuantity = null;
    let parsedPercentage = null;

    if (quantity !== undefined && quantity !== null && quantity !== "") {
      parsedQuantity = parseFloat(quantity.toString().replace(',', '.'));
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return NextResponse.json({ error: "La cantidad debe ser mayor que 0" }, { status: 400 });
      }
      if (totalProduced != null && totalProduced > 0) {
        parsedPercentage = (parsedQuantity / totalProduced) * 100;
      } else {
        parsedPercentage = percentage ? parseFloat(percentage.toString().replace(',', '.')) || 0 : 0;
      }
    } else {
      parsedPercentage = parseFloat(percentage);
      if (isNaN(parsedPercentage) || parsedPercentage <= 0) {
        return NextResponse.json({ error: "El porcentaje o la cantidad debe ser mayor que 0" }, { status: 400 });
      }
      if (totalProduced != null && totalProduced > 0) {
        parsedQuantity = (parsedPercentage / 100) * totalProduced;
      }
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "El precio debe ser un número válido" }, { status: 400 });
    }

    // Comprobar ventas existentes
    const existingSales = await prisma.elaborationSale.findMany({
      where: { elaborationId }
    });

    if (parsedQuantity != null && totalProduced != null && totalProduced > 0) {
      const currentSoldQuantity = existingSales.reduce((sum, s) => {
        if (s.quantity != null) return sum + s.quantity;
        return sum + (totalProduced * (s.percentage || 0) / 100);
      }, 0);
      const availableQty = Math.max(0, Math.round((totalProduced - currentSoldQuantity) * 1000) / 1000);

      if (currentSoldQuantity + parsedQuantity > totalProduced + 0.001) {
        return NextResponse.json({
          error: "quantity_exceeded",
          message: `La cantidad vendida no puede superar el stock disponible (${availableQty} ${unit}).`,
          available: availableQty,
          unit
        }, { status: 400 });
      }
    } else {
      const currentTotalPct = existingSales.reduce((sum, s) => sum + (s.percentage || 0), 0);
      const availablePct = Math.max(0, Math.round((100 - currentTotalPct) * 100) / 100);

      if (currentTotalPct + parsedPercentage > 100.001) {
        return NextResponse.json({
          error: "percentage_exceeded",
          message: `La suma de porcentajes no puede superar el 100%. Porcentaje disponible: ${availablePct}%`,
          available: availablePct
        }, { status: 400 });
      }
    }

    let validCustomerId = null;
    if (customerId) {
      const parsedCustId = parseInt(customerId);
      if (!isNaN(parsedCustId)) {
        const customer = await prisma.customer.findUnique({
          where: { id: parsedCustId }
        });
        if (customer && (session.user.role === "ADMIN" || customer.clientProfileId === profileId)) {
          validCustomerId = customer.id;
        }
      }
    }

    const newSale = await prisma.elaborationSale.create({
      data: {
        elaborationId,
        customerId: validCustomerId,
        quantity: parsedQuantity != null ? Math.round(parsedQuantity * 1000) / 1000 : null,
        percentage: Math.round(parsedPercentage * 100) / 100,
        price: parsedPrice,
        date: date ? new Date(date) : new Date(),
        clientProfileId: profileId
      },
      include: {
        customer: true
      }
    });

    return NextResponse.json({ success: true, data: newSale });
  } catch (error) {
    console.error("Error creating elaboration sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
