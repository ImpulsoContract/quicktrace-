import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        razonSocial: true,
        apiKey: true,
        apiKeyCreatedAt: true
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      apiKey: profile.apiKey,
      apiKeyCreatedAt: profile.apiKeyCreatedAt,
      razonSocial: profile.razonSocial
    });
  } catch (error) {
    console.error("Error fetching client API key:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { apiKey, generateRandom } = body;

    let targetKey = "";

    if (generateRandom) {
      targetKey = "qt_live_" + crypto.randomBytes(24).toString("hex");
    } else if (typeof apiKey === "string") {
      targetKey = apiKey.trim();
      if (!targetKey) {
        return NextResponse.json(
          { error: "La clave no puede estar vacía. Si deseas eliminarla, usa el botón de revocar." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Debes proporcionar una clave de API o solicitar la generación aleatoria." },
        { status: 400 }
      );
    }

    // Check uniqueness across other client profiles
    const existing = await prisma.clientProfile.findFirst({
      where: {
        apiKey: targetKey,
        NOT: { id: profile.id }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Esta clave de API ya está asignada a otro cliente. Por favor, introduce una diferente o genera una aleatoria." },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.clientProfile.update({
      where: { id: profile.id },
      data: {
        apiKey: targetKey,
        apiKeyCreatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      apiKey: updatedProfile.apiKey,
      apiKeyCreatedAt: updatedProfile.apiKeyCreatedAt
    });
  } catch (error) {
    console.error("Error updating client API key:", error);
    return NextResponse.json({ error: "Error interno del servidor al actualizar la clave de API" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    await prisma.clientProfile.update({
      where: { id: profile.id },
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
    console.error("Error revoking client API key:", error);
    return NextResponse.json({ error: "Error interno del servidor al revocar la clave de API" }, { status: 500 });
  }
}
