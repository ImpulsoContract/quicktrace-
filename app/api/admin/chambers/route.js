import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "Se requiere el ID del cliente" }, { status: 400 });
  }

  try {
    const chambers = await prisma.chamber.findMany({
      where: { clientProfileId: parseInt(clientId) },
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
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { clientId, name } = await req.json();
    if (!clientId || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const chamber = await prisma.chamber.create({
      data: {
        name,
        clientProfileId: parseInt(clientId)
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
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const chamber = await prisma.chamber.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    return NextResponse.json({ success: true, chamber });
  } catch (error) {
    console.error("Error updating chamber:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID de cámara requerido" }, { status: 400 });
  }

  try {
    await prisma.chamber.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chamber:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
