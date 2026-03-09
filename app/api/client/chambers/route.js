import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const chambers = await prisma.chamber.findMany({
      where: { clientProfileId: profile.id },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(chambers);
  } catch (error) {
    console.error("Error fetching chambers:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Nombre de cámara requerido" }, { status: 400 });
    }

    const chamber = await prisma.chamber.create({
      data: {
        name,
        clientProfileId: profile.id
      }
    });

    return NextResponse.json({ success: true, chamber });
  } catch (error) {
    console.error("Error creating chamber:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const chamber = await prisma.chamber.findUnique({
      where: { id: parseInt(id) }
    });

    if (!chamber || chamber.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Cámara no encontrada o no pertenece al cliente" }, { status: 403 });
    }

    const updated = await prisma.chamber.update({
      where: { id: parseInt(id) },
      data: { name }
    });

    return NextResponse.json({ success: true, chamber: updated });
  } catch (error) {
    console.error("Error updating chamber:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de cámara requerido" }, { status: 400 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    const chamberId = parseInt(id);
    const chamber = await prisma.chamber.findUnique({
      where: { id: chamberId }
    });

    if (!chamber || chamber.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Cámara no encontrada o no pertenece al cliente" }, { status: 403 });
    }

    // Guard: Check for temperature values
    const valueCount = await prisma.temperatureValue.count({
      where: { chamberId }
    });

    if (valueCount > 0) {
      return NextResponse.json({ 
        error: "No se puede eliminar la cámara porque tiene registros de temperatura asociados. Debe eliminarlos primero." 
      }, { status: 400 });
    }

    await prisma.chamber.delete({
      where: { id: chamberId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chamber:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
