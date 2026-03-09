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

  try {
    const body = await req.json();
    const { 
      email, name, razonSocial, nif, phone, urlClientify,
      accountType, recetasContratadas, canManageRecipes
    } = body;

    const userId = parseInt(id);

    // Update user and profile
    const result = await prisma.$transaction(async (tx) => {
      const userData = { email, name };

      await tx.user.update({
        where: { id: userId },
        data: userData
      });

      const profileData = {
        razonSocial,
        nif,
        phone,
        urlClientify,
        accountType: (accountType || "CLIENTE").toUpperCase(),
        recetasContratadas: parseInt(recetasContratadas) || 0,
        canManageRecipes: !!canManageRecipes
      };

      await tx.clientProfile.update({
        where: { userId: userId },
        data: profileData
      });

      return true;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
