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
            razonSocial: true,
            referrals: {
              select: {
                payments: {
                  where: { status: "paid" },
                  select: { amount: true }
                }
              }
            },
            affiliateSettlements: {
              select: { amount: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate pending for each
    const processed = affiliates.map(aff => {
      const generated = aff.clientProfile.referrals.reduce((acc, ref) => {
        return acc + (ref.payments.reduce((pAcc, p) => pAcc + (p.amount || 0), 0) * 0.05);
      }, 0);
      
      const settled = aff.clientProfile.affiliateSettlements.reduce((acc, s) => acc + (s.amount || 0), 0);
      
      return {
        ...aff,
        pendingCommission: generated - settled
      };
    });

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
