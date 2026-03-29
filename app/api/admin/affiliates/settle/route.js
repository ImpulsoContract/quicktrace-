import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { userId, amount, notes } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Datos de liquidación inválidos" }, { status: 400 });
    }

    // 1. Get affiliate profile
    const affiliate = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        clientProfile: {
          include: {
            referrals: {
              include: {
                payments: { where: { status: "paid" } }
              }
            },
            affiliateSettlements: true
          }
        }
      }
    });

    if (!affiliate || !affiliate.clientProfile || !affiliate.clientProfile.isAffiliate) {
      return NextResponse.json({ error: "Afiliado no encontrado" }, { status: 404 });
    }

    // 2. Validate pending amount
    const totalGenerated = affiliate.clientProfile.referrals.reduce((acc, ref) => {
      const refPayments = ref.payments || [];
      return acc + (refPayments.reduce((pAcc, p) => pAcc + (p.amount || 0), 0) * 0.05);
    }, 0);

    const totalSettled = affiliate.clientProfile.affiliateSettlements.reduce((acc, s) => acc + (s.amount || 0), 0);
    const pending = totalGenerated - totalSettled;

    if (amount > (pending + 0.01)) { // Allow small float margin
      return NextResponse.json({ error: `La cantidad (${amount}€) supera el saldo pendiente (${pending.toFixed(2)}€)` }, { status: 400 });
    }

    // 3. Create settlement
    const settlement = await prisma.affiliateSettlement.create({
      data: {
        clientProfileId: affiliate.clientProfile.id,
        amount: parseFloat(amount),
        notes: notes || "Liquidación de comisiones"
      }
    });

    return NextResponse.json({ success: true, settlement });
  } catch (error) {
    console.error("Error registering settlement:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
