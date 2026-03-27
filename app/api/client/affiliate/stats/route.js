import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    });

    if (!clientProfile || !clientProfile.isAffiliate) {
      return NextResponse.json({ error: "No eres afiliado o perfil no encontrado" }, { status: 403 });
    }

    // Traer los usuarios que han sido referidos por este afiliado
    const referrals = await prisma.clientProfile.findMany({
      where: { referredById: clientProfile.id },
      select: {
        id: true,
        razonSocial: true,
        personName: true,
        createdAt: true,
        registrationFinished: true,
        user: {
          select: {
            email: true
          }
        },
        plan: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      referralCode: clientProfile.referralCode,
      referrals: referrals
    });

  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
