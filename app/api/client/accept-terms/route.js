import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { termsAccepted } = await req.json();

    if (!termsAccepted) {
      return NextResponse.json({ error: "Debes aceptar las condiciones para continuar." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        pendingTermsUpdate: false,
        termsAcceptedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error accepting terms:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
