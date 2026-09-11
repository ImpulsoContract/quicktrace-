import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const elaborationId = parseInt(params.id);
    const saleId = parseInt(params.saleId);

    if (isNaN(elaborationId) || isNaN(saleId)) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const sale = await prisma.elaborationSale.findUnique({
      where: { id: saleId },
      include: {
        elaboration: {
          include: { recipe: true }
        }
      }
    });

    if (!sale || sale.elaborationId !== elaborationId) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && sale.elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.elaborationSale.delete({
      where: { id: saleId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting elaboration sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const elaborationId = parseInt(params.id);
    const saleId = parseInt(params.saleId);

    if (isNaN(elaborationId) || isNaN(saleId)) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const sale = await prisma.elaborationSale.findUnique({
      where: { id: saleId },
      include: {
        elaboration: {
          include: { recipe: true }
        }
      }
    });

    if (!sale || sale.elaborationId !== elaborationId) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && sale.elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { customerId, quantity, percentage, price, date } = body;

    const totalProduced = parseFloat(sale.elaboration.quantityProduced?.toString().replace(',', '.')) || null;
    const unit = sale.elaboration.quantityUnit || "";

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

    // Comprobar las demás ventas de la elaboración
    const otherSales = await prisma.elaborationSale.findMany({
      where: {
        elaborationId,
        id: { not: saleId }
      }
    });

    if (parsedQuantity != null && totalProduced != null && totalProduced > 0) {
      const otherSoldQuantity = otherSales.reduce((sum, s) => {
        if (s.quantity != null) return sum + s.quantity;
        return sum + (totalProduced * (s.percentage || 0) / 100);
      }, 0);
      const availableQty = Math.max(0, Math.round((totalProduced - otherSoldQuantity) * 1000) / 1000);

      if (otherSoldQuantity + parsedQuantity > totalProduced + 0.001) {
        return NextResponse.json({
          error: "quantity_exceeded",
          message: `La cantidad vendida no puede superar el stock disponible (${availableQty} ${unit}).`,
          available: availableQty,
          unit
        }, { status: 400 });
      }
    } else {
      const otherTotalPct = otherSales.reduce((sum, s) => sum + (s.percentage || 0), 0);
      const availablePct = Math.max(0, Math.round((100 - otherTotalPct) * 100) / 100);

      if (otherTotalPct + parsedPercentage > 100.001) {
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

    const updatedSale = await prisma.elaborationSale.update({
      where: { id: saleId },
      data: {
        customerId: validCustomerId,
        quantity: parsedQuantity != null ? Math.round(parsedQuantity * 1000) / 1000 : null,
        percentage: Math.round(parsedPercentage * 100) / 100,
        price: parsedPrice,
        date: date ? new Date(date) : undefined
      },
      include: {
        customer: true
      }
    });

    return NextResponse.json({ success: true, data: updatedSale });
  } catch (error) {
    console.error("Error updating elaboration sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
