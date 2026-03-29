import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const affiliate = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        clientProfile: {
          include: {
            referrals: {
              include: {
                user: {
                  select: {
                    email: true
                  }
                },
                payments: {
                  where: {
                    status: "paid"
                  }
                }
              }
            },
            affiliateSettlements: {
              orderBy: {
                date: 'desc'
              }
            }
          }
        }
      }
    });

    if (!affiliate || !affiliate.clientProfile || !affiliate.clientProfile.isAffiliate) {
      return NextResponse.json({ error: "Afiliado no encontrado" }, { status: 404 });
    }

    // Process referrals to calculate commissions
    const referralsData = affiliate.clientProfile.referrals.map(ref => {
      const refPayments = ref.payments || [];
      const totalPaid = refPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
      const commission = totalPaid * 0.05;
      
      return {
        id: ref.id,
        razonSocial: ref.razonSocial,
        email: ref.user?.email || "Sin email",
        totalPaid,
        commission,
        payments: refPayments
      };
    });

    const totalGenerated = referralsData.reduce((acc, ref) => acc + ref.commission, 0);
    const totalSettled = affiliate.clientProfile.affiliateSettlements.reduce((acc, s) => acc + (s.amount || 0), 0);
    const pendingCommission = totalGenerated - totalSettled;

    return NextResponse.json({
      id: affiliate.id,
      email: affiliate.email,
      referralCode: affiliate.clientProfile.referralCode,
      affiliateAcceptedAt: affiliate.clientProfile.affiliateAcceptedAt,
      referrals: referralsData,
      settlements: affiliate.clientProfile.affiliateSettlements,
      totalGenerated,
      totalSettled,
      pendingCommission
    });
  } catch (error) {
    console.error(`Error fetching affiliate details for user ${id}:`, error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
