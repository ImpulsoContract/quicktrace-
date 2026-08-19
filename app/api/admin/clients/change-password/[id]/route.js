import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = params;
  const userId = parseInt(id);

  try {
    const { password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing client password:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
