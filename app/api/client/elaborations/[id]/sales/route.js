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

    const totalSoldPercentage = sales.reduce((sum, s) => sum + (s.percentage || 0), 0);

    return NextResponse.json({
      success: true,
      sales,
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
    const { customerId, percentage, price, date } = body;

    const parsedPercentage = parseFloat(percentage);
    if (isNaN(parsedPercentage) || parsedPercentage <= 0) {
      return NextResponse.json({ error: "El porcentaje debe ser mayor que 0" }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "El precio debe ser un número válido" }, { status: 400 });
    }

    // Comprobar la suma de porcentajes acumulados
    const existingSales = await prisma.elaborationSale.findMany({
      where: { elaborationId }
    });

    const currentTotal = existingSales.reduce((sum, s) => sum + (s.percentage || 0), 0);
    const available = Math.max(0, Math.round((100 - currentTotal) * 100) / 100);

    // Permitir pequeño margen de tolerancia por punto flotante (0.001)
    if (currentTotal + parsedPercentage > 100.001) {
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

    const newSale = await prisma.elaborationSale.create({
      data: {
        elaborationId,
        customerId: validCustomerId,
        percentage: parsedPercentage,
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
