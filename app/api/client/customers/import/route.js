import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profileId = session.user.profileId || (await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    }))?.id;

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { customers } = body;

    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json({ error: "No se proporcionaron clientes para importar" }, { status: 400 });
    }

    // Filtrar clientes que tengan nombre comercial válido
    const validCustomers = customers
      .filter(c => c && typeof c.commercialName === 'string' && c.commercialName.trim().length > 0)
      .map(c => ({
        commercialName: c.commercialName.trim(),
        fiscalName: c.fiscalName && typeof c.fiscalName === 'string' && c.fiscalName.trim() ? c.fiscalName.trim() : null,
        nif: c.nif && typeof c.nif === 'string' && c.nif.trim() ? c.nif.trim() : null,
        address: c.address && typeof c.address === 'string' && c.address.trim() ? c.address.trim() : null,
        postalCode: c.postalCode ? c.postalCode.toString().trim() : null,
        city: c.city && typeof c.city === 'string' && c.city.trim() ? c.city.trim() : null,
        province: c.province && typeof c.province === 'string' && c.province.trim() ? c.province.trim() : null,
        email: c.email && typeof c.email === 'string' && c.email.trim() ? c.email.trim() : null,
        email2: c.email2 && typeof c.email2 === 'string' && c.email2.trim() ? c.email2.trim() : null,
        phone: c.phone ? c.phone.toString().trim() : null,
        phone2: c.phone2 ? c.phone2.toString().trim() : null,
        clientProfileId: profileId
      }));

    if (validCustomers.length === 0) {
      return NextResponse.json({ 
        error: "Ningún registro contiene un nombre comercial válido para ser importado" 
      }, { status: 400 });
    }

    const created = await prisma.customer.createMany({
      data: validCustomers
    });

    return NextResponse.json({
      success: true,
      count: created.count,
      totalSent: customers.length,
      skipped: customers.length - created.count
    });
  } catch (error) {
    console.error("Error importing customers:", error);
    return NextResponse.json({ error: "Error al importar los clientes" }, { status: 500 });
  }
}
