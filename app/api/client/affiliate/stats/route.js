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

    // Auto-generación de código si falta (para corregir registros previos con error)
    if (!clientProfile.referralCode) {
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newReferralCode = `${clientProfile.razonSocial?.substring(0, 3).toUpperCase() || 'QT'}${randomSuffix}`;
      
      const updatedProfile = await prisma.clientProfile.update({
        where: { id: clientProfile.id },
        data: { referralCode: newReferralCode }
      });
      clientProfile.referralCode = newReferralCode;
    }

    console.log(`[AffiliateStats] Fetching for userId: ${userId}, profileId: ${clientProfile.id}`);

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

    console.log(`[AffiliateStats] Found ${referrals.length} referrals for profileId ${clientProfile.id}`);

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
