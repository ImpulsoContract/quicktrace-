import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
                id: true,
                stripeCustomerId: true,
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

    // Calculate pending for each using Stripe Real-time data
    const processed = await Promise.all(affiliates.map(async (aff) => {
      let totalGeneratedReal = 0;

      // Por cada referido, necesitamos sus facturas de Stripe
      for (const ref of aff.clientProfile.referrals) {
        if (ref.stripeCustomerId) {
          try {
            const invoices = await stripe.invoices.list({
              customer: ref.stripeCustomerId,
              status: 'paid',
              limit: 50
            });
            
            const totalPaidRef = invoices.data.reduce((acc, inv) => acc + (inv.amount_paid / 100), 0);
            totalGeneratedReal += (totalPaidRef * 0.05);
          } catch (stripeErr) {
            console.error(`[AdminAffiliatesList] Error fetching stripe for customer ${ref.stripeCustomerId}:`, stripeErr);
            // Fallback to local DB if Stripe fails
            const totalPaidDB = ref.payments.reduce((pAcc, p) => pAcc + (p.amount || 0), 0);
            totalGeneratedReal += (totalPaidDB * 0.05);
          }
        } else {
          const totalPaidDB = ref.payments.reduce((pAcc, p) => pAcc + (p.amount || 0), 0);
          totalGeneratedReal += (totalPaidDB * 0.05);
        }
      }
      
      const settled = aff.clientProfile.affiliateSettlements.reduce((acc, s) => acc + (s.amount || 0), 0);
      
      return {
        id: aff.id,
        email: aff.email,
        createdAt: aff.createdAt,
        clientProfile: {
          ...aff.clientProfile,
          pendingCommission: totalGeneratedReal - settled
        },
        pendingCommission: totalGeneratedReal - settled
      };
    }));

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

