import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const id = parseInt(params.id);
    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existing = await prisma.cuttingRecord.findUnique({
      where: { id }
    });

    if (!existing || existing.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Registro no encontrado o no autorizado" }, { status: 404 });
    }

    const body = await req.json();
    const { lote, pieceName, notes, openDate, closeDate, labelPhoto } = body;

    if (lote !== undefined && (!lote || !lote.trim())) {
      return NextResponse.json({ error: "El número de lote es obligatorio" }, { status: 400 });
    }

    if (pieceName !== undefined && (!pieceName || !pieceName.trim())) {
      return NextResponse.json({ error: "El nombre de la pieza es obligatorio" }, { status: 400 });
    }

    const updated = await prisma.cuttingRecord.update({
      where: { id },
      data: {
        lote: lote !== undefined ? lote.trim() : undefined,
        pieceName: pieceName !== undefined ? pieceName.trim() : undefined,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : undefined,
        openDate: openDate !== undefined ? (openDate ? new Date(openDate) : null) : undefined,
        closeDate: closeDate !== undefined ? (closeDate ? new Date(closeDate) : null) : undefined,
        labelPhoto: labelPhoto !== undefined ? labelPhoto : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error PATCH /api/client/cutting-records/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar el registro de despiece" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const id = parseInt(params.id);
    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existing = await prisma.cuttingRecord.findUnique({
      where: { id }
    });

    if (!existing || existing.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Registro no encontrado o no autorizado" }, { status: 404 });
    }

    await prisma.cuttingRecord.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error DELETE /api/client/cutting-records/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar el registro de despiece" }, { status: 500 });
  }
}
