import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const seller = await prisma.seller.findUnique({
      where: { id }
    });

    if (!seller) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && seller.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { name } = body;
    const trimmedName = (name || "").trim();

    if (!trimmedName) {
      return NextResponse.json({ error: "El nombre del vendedor es obligatorio." }, { status: 400 });
    }

    // Check duplicate name excluding self
    const duplicate = await prisma.seller.findFirst({
      where: {
        clientProfileId: seller.clientProfileId,
        name: { equals: trimmedName, mode: 'insensitive' },
        NOT: { id }
      }
    });

    if (duplicate) {
      return NextResponse.json({ error: "Ya existe otro vendedor con ese nombre." }, { status: 400 });
    }

    const updated = await prisma.seller.update({
      where: { id },
      data: { name: trimmedName }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating seller:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const seller = await prisma.seller.findUnique({
      where: { id }
    });

    if (!seller) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && seller.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.seller.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Vendedor eliminado correctamente." });
  } catch (error) {
    console.error("Error deleting seller:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
