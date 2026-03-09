import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const elabCount = await prisma.elaboration.count({
      where: { recipeId: parseInt(id) }
    });

    if (elabCount > 0) {
      return NextResponse.json({ 
        error: "No se puede eliminar la receta porque ya existen elaboraciones registradas con ella. Elimínalas primero para poder borrar la receta." 
      }, { status: 400 });
    }

    await prisma.recipe.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
