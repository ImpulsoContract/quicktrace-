import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const affiliates = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        clientProfile: {
          isAffiliate: true
        }
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        clientProfile: {
          select: {
            id: true,
            referralCode: true,
            affiliateAcceptedAt: true,
            razonSocial: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(affiliates);
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
