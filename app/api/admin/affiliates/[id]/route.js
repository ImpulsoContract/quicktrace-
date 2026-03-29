import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    // Process referrals to calculate commissions fetching real data from Stripe
    const referralsData = await Promise.all(affiliate.clientProfile.referrals.map(async (ref) => {
      let totalPaidFromStripe = 0;
      let stripePaymentsList = [];

      if (ref.stripeCustomerId) {
        try {
          const invoices = await stripe.invoices.list({
            customer: ref.stripeCustomerId,
            status: 'paid',
            limit: 50
          });

          totalPaidFromStripe = invoices.data.reduce((acc, inv) => acc + (inv.amount_paid / 100), 0);
          stripePaymentsList = invoices.data.map(inv => ({
            id: inv.id,
            amount: inv.amount_paid / 100,
            date: new Date(inv.created * 1000).toISOString(),
            currency: inv.currency,
            status: 'paid'
          }));
        } catch (stripeErr) {
          console.error(`[AdminAffiliates] Stripe error for customer ${ref.stripeCustomerId}:`, stripeErr);
          // Fallback to local DB if Stripe fails
          totalPaidFromStripe = (ref.payments || []).reduce((acc, p) => acc + (p.amount || 0), 0);
        }
      } else {
        totalPaidFromStripe = (ref.payments || []).reduce((acc, p) => acc + (p.amount || 0), 0);
      }

      const commission = totalPaidFromStripe * 0.05;
      
      return {
        id: ref.id,
        razonSocial: ref.razonSocial,
        email: ref.user?.email || "Sin email",
        totalPaid: totalPaidFromStripe,
        commission,
        payments: stripePaymentsList.length > 0 ? stripePaymentsList : (ref.payments || [])
      };
    }));

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

