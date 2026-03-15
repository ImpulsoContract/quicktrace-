import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const result = await prisma.user.updateMany({
      where: { role: "CLIENT" },
      data: { pendingTermsUpdate: true }
    });

    return NextResponse.json({ 
        success: true, 
        message: "Todos los clientes han sido marcados para aceptar las nuevas condiciones.",
        count: result.count 
    });
  } catch (error) {
    console.error("Error setting pendingTermsUpdate:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
