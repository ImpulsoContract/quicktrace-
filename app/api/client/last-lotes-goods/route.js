import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;

    // Fetch all goods receipts with a lote for this client, ordered by date desc (latest first)
    const receipts = await prisma.goodsReceipt.findMany({
      where: {
        clientProfileId: profileId,
        NOT: {
          lote: null
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    const lastLotes = {};
    receipts.forEach(receipt => {
      if (receipt.lote && receipt.relatedIngredients) {
        receipt.relatedIngredients.forEach(ingName => {
          if (ingName) {
            const normalized = ingName.trim().toLowerCase();
            if (!lastLotes[normalized]) {
              lastLotes[normalized] = receipt.lote;
            }
          }
        });
      }
    });

    return NextResponse.json(lastLotes);
  } catch (error) {
    console.error("Error GET /api/client/last-lotes-goods:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
