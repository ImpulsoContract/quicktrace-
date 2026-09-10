import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { id } = params;
    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const profileId = session.user.profileId;
    if (session.user.role !== "ADMIN" && customer.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();

    if (body.commercialName !== undefined && (!body.commercialName || !body.commercialName.trim())) {
      return NextResponse.json({ error: "El nombre comercial es obligatorio" }, { status: 400 });
    }

    const updateData = {};
    if (body.commercialName !== undefined) updateData.commercialName = body.commercialName.trim();
    if (body.fiscalName !== undefined) updateData.fiscalName = body.fiscalName?.trim() || null;
    if (body.nif !== undefined) updateData.nif = body.nif?.trim() || null;
    if (body.address !== undefined) updateData.address = body.address?.trim() || null;
    if (body.postalCode !== undefined) updateData.postalCode = body.postalCode?.trim() || null;
    if (body.city !== undefined) updateData.city = body.city?.trim() || null;
    if (body.province !== undefined) updateData.province = body.province?.trim() || null;
    if (body.email !== undefined) updateData.email = body.email?.trim() || null;
    if (body.email2 !== undefined) updateData.email2 = body.email2?.trim() || null;
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null;
    if (body.phone2 !== undefined) updateData.phone2 = body.phone2?.trim() || null;

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { id } = params;
    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const profileId = session.user.profileId;
    if (session.user.role !== "ADMIN" && customer.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.customer.delete({
      where: { id: customerId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
