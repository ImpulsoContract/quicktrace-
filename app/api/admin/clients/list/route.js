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
      include: {
        clientProfile: {
          include: {
            plan: true,
            _count: {
              select: { recipes: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Logging only first client to check structure in Vercel logs
    if (clients.length > 0) {
      console.log(`[AdminList] First client profile sample:`, {
        email: clients[0].email,
        hasProfile: !!clients[0].clientProfile,
        renewalDate: clients[0].clientProfile?.stripeCurrentPeriodEnd
      });
    }

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
