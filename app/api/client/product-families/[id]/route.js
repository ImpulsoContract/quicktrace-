import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de familia inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const family = await prisma.productFamily.findUnique({
      where: { id }
    });

    if (!family || (session.user.role !== "ADMIN" && family.clientProfileId !== profileId)) {
      return NextResponse.json({ error: "Familia no encontrada" }, { status: 404 });
    }

    const body = await req.json();
    const name = (body.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "El nombre de la familia no puede estar vacío" }, { status: 400 });
    }

    // Check if another family has this name
    const duplicate = await prisma.productFamily.findFirst({
      where: {
        clientProfileId: family.clientProfileId,
        name: { equals: name, mode: "insensitive" },
        NOT: { id }
      }
    });

    if (duplicate) {
      return NextResponse.json({ error: "Ya existe otra familia con ese nombre" }, { status: 400 });
    }

    const updated = await prisma.productFamily.update({
      where: { id },
      data: { name },
      include: {
        recipes: true,
        goodsForSale: true
      }
    });

    return NextResponse.json({ success: true, family: updated });
  } catch (error) {
    console.error("Error updating product family:", error);
    return NextResponse.json({ error: "Error al actualizar la familia" }, { status: 500 });
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
      return NextResponse.json({ error: "ID de familia inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const family = await prisma.productFamily.findUnique({
      where: { id }
    });

    if (!family || (session.user.role !== "ADMIN" && family.clientProfileId !== profileId)) {
      return NextResponse.json({ error: "Familia no encontrada" }, { status: 404 });
    }

    // On delete, recipes and goods have onDelete: SetNull in Prisma schema
    await prisma.productFamily.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Familia eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting product family:", error);
    return NextResponse.json({ error: "Error al eliminar la familia" }, { status: 500 });
  }
}
