import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Verificar que sea administrador
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Falta el ID del usuario objetivo" }, { status: 400 });
    }

    // 2. Verificar que el usuario objetivo existe
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(targetUserId) }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuario objetivo no encontrado" }, { status: 404 });
    }

    // 3. Generar el token firmado
    const timestamp = Date.now();
    const secret = process.env.NEXTAUTH_SECRET || "fallback-secret";
    
    const hash = crypto.createHmac('sha256', secret)
      .update(`${timestamp}:${targetUserId}`)
      .digest('hex');
      
    const impersonationToken = `${timestamp}:${targetUserId}:${hash}`;

    console.log(`[Admin] Admin ${session.user.email} generated impersonation token for ${targetUser.email}`);

    return NextResponse.json({ 
      success: true, 
      email: targetUser.email,
      impersonationToken 
    });

  } catch (error) {
    console.error("Impersonate error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
