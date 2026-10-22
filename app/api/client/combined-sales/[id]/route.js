import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    const combinedSale = await prisma.combinedSale.findUnique({
      where: { id },
      include: {
        customer: true,
        sales: {
          include: {
            elaboration: {
              include: {
                recipe: true
              }
            }
          }
        }
      }
    });

    if (!combinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && combinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: combinedSale });
  } catch (error) {
    console.error("Error fetching combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    const combinedSale = await prisma.combinedSale.findUnique({
      where: { id }
    });

    if (!combinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && combinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Cascade delete deletes all associated ElaborationSale records and restores stock
    await prisma.combinedSale.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Venta combinada eliminada correctamente." });
  } catch (error) {
    console.error("Error deleting combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
