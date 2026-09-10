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
    const { customerId, percentage, price, date } = body;

    const parsedPercentage = parseFloat(percentage);
    if (isNaN(parsedPercentage) || parsedPercentage <= 0) {
      return NextResponse.json({ error: "El porcentaje debe ser mayor que 0" }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "El precio debe ser un número válido" }, { status: 400 });
    }

    // Comprobar la suma de los porcentajes de las demás ventas
    const otherSales = await prisma.elaborationSale.findMany({
      where: {
        elaborationId,
        id: { not: saleId }
      }
    });

    const otherTotal = otherSales.reduce((sum, s) => sum + (s.percentage || 0), 0);
    const available = Math.max(0, Math.round((100 - otherTotal) * 100) / 100);

    if (otherTotal + parsedPercentage > 100.001) {
      return NextResponse.json({
        error: "percentage_exceeded",
        message: `La suma de porcentajes no puede superar el 100%. Porcentaje disponible: ${available}%`,
        available
      }, { status: 400 });
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
        percentage: parsedPercentage,
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
