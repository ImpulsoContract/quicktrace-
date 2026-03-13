import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: { plan: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching client profile:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      personName, 
      razonSocial, 
      nif, 
      phone,
      address,
      postalCode,
      city,
      province,
      country,
      labelConfig
    } = body;

    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: parseInt(session.user.id) },
      data: {
        personName: personName !== undefined ? personName : undefined,
        razonSocial: razonSocial !== undefined ? razonSocial : undefined,
        nif: nif !== undefined ? nif : undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        postalCode: postalCode !== undefined ? postalCode : undefined,
        city: city !== undefined ? city : undefined,
        province: province !== undefined ? province : undefined,
        country: country !== undefined ? country : undefined,
        labelConfig: labelConfig !== undefined ? labelConfig : undefined,
      },
      include: { plan: true }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating client profile:", error);
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
  }
}
