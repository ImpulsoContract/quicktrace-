import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profileId = session.user.profileId;

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const customers = await prisma.customer.findMany({
      where: { clientProfileId: profileId },
      orderBy: { commercialName: 'asc' }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      commercialName, 
      fiscalName, 
      nif, 
      address, 
      postalCode, 
      city, 
      province, 
      email, 
      email2, 
      phone, 
      phone2 
    } = body;

    if (!commercialName || !commercialName.trim()) {
      return NextResponse.json({ error: "El nombre comercial es obligatorio" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const customer = await prisma.customer.create({
      data: {
        commercialName: commercialName.trim(),
        fiscalName: fiscalName?.trim() || null,
        nif: nif?.trim() || null,
        address: address?.trim() || null,
        postalCode: postalCode?.trim() || null,
        city: city?.trim() || null,
        province: province?.trim() || null,
        email: email?.trim() || null,
        email2: email2?.trim() || null,
        phone: phone?.trim() || null,
        phone2: phone2?.trim() || null,
        clientProfileId: profileId
      }
    });

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
