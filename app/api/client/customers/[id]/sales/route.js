import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = params;
    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && customer.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const sales = await prisma.elaborationSale.findMany({
      where: {
        customerId: customerId,
        clientProfileId: profileId
      },
      include: {
        customer: {
          select: {
            id: true,
            commercialName: true,
            fiscalName: true,
            nif: true
          }
        },
        elaboration: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true
              }
            },
            sales: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    });

    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching customer sales:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
