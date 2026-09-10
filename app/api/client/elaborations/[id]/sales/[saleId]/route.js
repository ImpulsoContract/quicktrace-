import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const elaborationId = parseInt(params.id);
    const saleId = parseInt(params.saleId);

    if (isNaN(elaborationId) || isNaN(saleId)) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const sale = await prisma.elaborationSale.findUnique({
      where: { id: saleId },
      include: {
        elaboration: {
          include: { recipe: true }
        }
      }
    });

    if (!sale || sale.elaborationId !== elaborationId) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && sale.elaboration.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.elaborationSale.delete({
      where: { id: saleId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting elaboration sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
