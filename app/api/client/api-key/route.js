import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Generate cryptographically secure API key: qt_live_<48 hex chars>
    const apiKey = `qt_live_${crypto.randomBytes(24).toString("hex")}`;
    const apiKeyCreatedAt = new Date();

    const updatedProfile = await prisma.clientProfile.update({
      where: { id: profileId },
      data: {
        apiKey,
        apiKeyCreatedAt
      }
    });

    return NextResponse.json({
      success: true,
      apiKey: updatedProfile.apiKey,
      apiKeyCreatedAt: updatedProfile.apiKeyCreatedAt
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json({ error: "Error interno del servidor al generar la clave de API" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    await prisma.clientProfile.update({
      where: { id: profileId },
      data: {
        apiKey: null,
        apiKeyCreatedAt: null
      }
    });

    return NextResponse.json({
      success: true,
      message: "Clave de API revocada correctamente"
    });
  } catch (error) {
    console.error("Error revoking API key:", error);
    return NextResponse.json({ error: "Error interno del servidor al revocar la clave de API" }, { status: 500 });
  }
}
