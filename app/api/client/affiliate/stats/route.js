import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        affiliateSettlements: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!clientProfile || !clientProfile.isAffiliate) {
      return NextResponse.json({ error: "No eres afiliado o perfil no encontrado" }, { status: 403 });
    }

    // Auto-generación de código si falta
    if (!clientProfile.referralCode) {
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newReferralCode = `${clientProfile.razonSocial?.substring(0, 3).toUpperCase() || 'QT'}${randomSuffix}`;
      
      await prisma.clientProfile.update({
        where: { id: clientProfile.id },
        data: { referralCode: newReferralCode }
      });
      clientProfile.referralCode = newReferralCode;
    }

    // Traer los usuarios que han sido referidos por este afiliado
    const referrals = await prisma.clientProfile.findMany({
      where: { referredById: clientProfile.id },
      select: {
        id: true,
        razonSocial: true,
        personName: true,
        createdAt: true,
        stripeCustomerId: true,
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

    // Para cada referido, obtener sus facturas reales de Stripe para precisión total
    const referralsWithPayments = await Promise.all(referrals.map(async (ref) => {
      let realPayments = [];
      let totalPaidFromStripe = 0;

      if (ref.stripeCustomerId) {
        try {
          const invoices = await stripe.invoices.list({
            customer: ref.stripeCustomerId,
            status: 'paid',
            limit: 50
          });

          realPayments = invoices.data.map(inv => ({
            id: inv.id,
            amount: inv.amount_paid / 100,
            currency: inv.currency,
            createdAt: new Date(inv.created * 1000).toISOString(),
            status: 'paid',
            clientProfile: {
              razonSocial: ref.razonSocial,
              user: { email: ref.user?.email }
            }
          }));
          totalPaidFromStripe = realPayments.reduce((acc, p) => acc + p.amount, 0);
        } catch (e) {
          console.error(`Error fetching stripe invoices for ${ref.stripeCustomerId}:`, e);
        }
      }

      return {
        ...ref,
        realPayments,
        totalPaidFromStripe,
        commission: totalPaidFromStripe * 0.05
      };
    }));

    // Consolidar todos los pagos para la tabla del dashboard
    const allStripePayments = referralsWithPayments.flatMap(r => r.realPayments)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalGenerated = referralsWithPayments.reduce((acc, r) => acc + r.commission, 0);
    const totalSettled = clientProfile.affiliateSettlements.reduce((acc, s) => acc + (s.amount || 0), 0);
    const pendingCommission = totalGenerated - totalSettled;

    return NextResponse.json({
      success: true,
      referralCode: clientProfile.referralCode,
      referrals: referralsWithPayments,
      payments: allStripePayments,
      settlements: clientProfile.affiliateSettlements,
      totalGenerated,
      totalSettled,
      pendingCommission
    });

  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
