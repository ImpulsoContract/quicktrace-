import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req) {
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

    const scannedNotes = await prisma.scannedDeliveryNote.findMany({
      where: { clientProfileId: profileId },
      orderBy: { date: "desc" }
    });

    return NextResponse.json(scannedNotes);
  } catch (error) {
    console.error("Error GET /api/client/scanned-delivery-notes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
      return NextResponse.json({ error: "No tienes permiso para gestionar mercancías" }, { status: 403 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existing = await prisma.scannedDeliveryNote.findUnique({
      where: { id }
    });

    if (!existing || existing.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Albarán escaneado no encontrado o no autorizado" }, { status: 404 });
    }

    await prisma.scannedDeliveryNote.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error DELETE /api/client/scanned-delivery-notes:", error);
    return NextResponse.json({ error: "Error interno al eliminar el albarán escaneado" }, { status: 500 });
  }
}
