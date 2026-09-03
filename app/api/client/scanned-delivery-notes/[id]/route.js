import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
      return NextResponse.json({ error: "No tienes permiso para acceder a mercancías" }, { status: 403 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const id = parseInt(params.id);
    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const note = await prisma.scannedDeliveryNote.findUnique({
      where: { id }
    });

    if (!note || note.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Albarán no encontrado o no autorizado" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error GET /api/client/scanned-delivery-notes/[id]:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
