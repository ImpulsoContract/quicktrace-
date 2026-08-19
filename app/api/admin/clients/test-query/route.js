import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        lastLogin: true,
        lastLoginLanguage: true,
        termsAcceptedAt: true,
        clientProfile: {
          select: {
            id: true,
            razonSocial: true,
            nif: true,
            phone: true,
            personName: true,
            accountType: true,
            recetasContratadas: true,
            stripeCurrentPeriodEnd: true,
            origin: true,
            utmSource: true,
            utmMedium: true,
            utmCampaign: true,
            utmContent: true,
            utmTerm: true,
            gclid: true,
            fbclid: true,
            plan: true,
            hasIaGoods: true,
            _count: {
              select: { recipes: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, count: clients.length });
  } catch (error) {
    console.error("[TestQuery] Error:", error);
    return NextResponse.json({ 
      error: error.message || "Unknown error", 
      stack: error.stack || "" 
    }, { status: 500 });
  }
}
