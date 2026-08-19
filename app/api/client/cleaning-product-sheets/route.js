import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para acceder a ficas técnicas" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const sheets = await prisma.cleaningProductSheet.findMany({
      where: { clientProfileId: profileId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(sheets);
  } catch (error) {
    console.error("Error fetching cleaning product sheets:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para guardar ficas técnicas" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { name, imageUrl } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Nombre del producto requerido" }, { status: 400 });
    }

    const sheet = await prisma.cleaningProductSheet.create({
      data: {
        name,
        imageUrl,
        clientProfileId: profileId
      }
    });

    return NextResponse.json({ success: true, sheet });
  } catch (error) {
    console.error("Error creating cleaning product sheet:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para modificar ficas técnicas" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { id, name, imageUrl } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const sheet = await prisma.cleaningProductSheet.findUnique({
      where: { id: parseInt(id) }
    });

    if (!sheet || sheet.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Ficha técnica no encontrada o acceso denegado" }, { status: 403 });
    }

    const updated = await prisma.cleaningProductSheet.update({
      where: { id: parseInt(id) },
      data: {
        name,
        imageUrl
      }
    });

    return NextResponse.json({ success: true, sheet: updated });
  } catch (error) {
    console.error("Error updating cleaning product sheet:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para eliminar ficas técnicas" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de ficha técnica requerido" }, { status: 400 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const sheetId = parseInt(id);
    const sheet = await prisma.cleaningProductSheet.findUnique({
      where: { id: sheetId }
    });

    if (!sheet || sheet.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Ficha técnica no encontrada o acceso denegado" }, { status: 403 });
    }

    await prisma.cleaningProductSheet.delete({
      where: { id: sheetId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cleaning product sheet:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
