import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
    return NextResponse.json({ error: "No tienes permiso para acceder a proveedores" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const providers = await prisma.provider.findMany({
      where: { clientProfileId: profileId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { name, nif, rgs, phone, address, products, merchantTypes } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: { clientProfile: true }
    });

    if (!user || !user.clientProfile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const provider = await prisma.provider.create({
      data: {
        name,
        nif,
        rgs,
        phone,
        address,
        products,
        merchantTypes: merchantTypes || [],
        clientProfileId: user.clientProfile.id
      }
    });

    return NextResponse.json({ success: true, data: provider });
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
