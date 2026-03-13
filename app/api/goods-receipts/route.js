import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where = { clientProfileId: profile.id };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const receipts = await prisma.goodsReceipt.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(receipts);
  } catch (error) {
    console.error("Error fetching goods receipts:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: { 
        plan: true,
        _count: { select: { goodsReceipts: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (!profile.plan || !profile.plan.hasGoods) {
      return NextResponse.json({ error: "El módulo de recepción de mercancías no está incluido en tu plan." }, { status: 403 });
    }

    if (profile.plan.goodsLimit !== null && profile._count.goodsReceipts >= profile.plan.goodsLimit) {
      return NextResponse.json({ error: "Has alcanzado el límite de registros de mercancías de tu plan." }, { status: 403 });
    }

    const body = await req.json();
    const { 
      providerName, 
      productName, 
      lote, 
      invoiceNumber, 
      quantity, 
      date, 
      deliveryNoteImage 
    } = body;

    if (!productName || !date) {
      return NextResponse.json({ error: "Producto y fecha son obligatorios" }, { status: 400 });
    }

    const receipt = await prisma.goodsReceipt.create({
      data: {
        providerName,
        productName,
        lote,
        invoiceNumber,
        quantity,
        date: new Date(date),
        deliveryNoteImage,
        clientProfileId: profile.id
      }
    });

    return NextResponse.json({ success: true, receipt });
  } catch (error) {
    console.error("Error creating goods receipt:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { 
      id,
      providerName, 
      productName, 
      lote, 
      invoiceNumber, 
      quantity, 
      date, 
      deliveryNoteImage 
    } = body;

    if (!id || !productName || !date) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const receipt = await prisma.goodsReceipt.update({
      where: { 
        id: parseInt(id),
        clientProfileId: profile.id
      },
      data: {
        providerName,
        productName,
        lote,
        invoiceNumber,
        quantity,
        date: new Date(date),
        deliveryNoteImage
      }
    });

    return NextResponse.json({ success: true, receipt });
  } catch (error) {
    console.error("Error updating goods receipt:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    await prisma.goodsReceipt.delete({
      where: { 
        id: parseInt(id),
        clientProfileId: profile.id
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting goods receipt:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
