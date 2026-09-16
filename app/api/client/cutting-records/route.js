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

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    const where = {
      clientProfileId: profileId,
      ...(q
        ? {
            OR: [
              { lote: { contains: q, mode: "insensitive" } },
              { pieceName: { contains: q, mode: "insensitive" } },
              { notes: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const records = await prisma.cuttingRecord.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error GET /api/client/cutting-records:", error);
    return NextResponse.json({ error: "Error al obtener los registros de despiece" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { lote, pieceName, notes, openDate, closeDate, labelPhoto } = body;

    if (!lote || !lote.trim()) {
      return NextResponse.json({ error: "El número de lote es obligatorio" }, { status: 400 });
    }

    if (!pieceName || !pieceName.trim()) {
      return NextResponse.json({ error: "El nombre de la pieza es obligatorio" }, { status: 400 });
    }

    const newRecord = await prisma.cuttingRecord.create({
      data: {
        clientProfileId: profileId,
        lote: lote.trim(),
        pieceName: pieceName.trim(),
        notes: notes ? notes.trim() : null,
        openDate: openDate ? new Date(openDate) : null,
        closeDate: closeDate ? new Date(closeDate) : null,
        labelPhoto: labelPhoto || null
      }
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error POST /api/client/cutting-records:", error);
    return NextResponse.json({ error: "Error al crear el registro de despiece" }, { status: 500 });
  }
}
