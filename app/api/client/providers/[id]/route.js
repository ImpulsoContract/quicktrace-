import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { id } = params;
    const body = await req.json();

    const provider = await prisma.provider.findUnique({
      where: { id: parseInt(id) },
      include: { clientProfile: true }
    });

    if (!provider) return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });

    // Verificar pertenencia
    const userRole = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: { clientProfile: true }
    });
    
    if (provider.clientProfileId !== userRole.clientProfile.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const updatedProvider = await prisma.provider.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        nif: body.nif,
        rgs: body.rgs,
        phone: body.phone,
        address: body.address,
        products: body.products,
        merchantTypes: body.merchantTypes !== undefined ? body.merchantTypes : undefined
      }
      }
    });

    return NextResponse.json({ success: true, data: updatedProvider });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { id } = params;

    const provider = await prisma.provider.findUnique({
      where: { id: parseInt(id) }
    });

    if (!provider) return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });

    const userRole = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: { clientProfile: true }
    });
    
    if (provider.clientProfileId !== userRole.clientProfile.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.provider.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting provider:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
