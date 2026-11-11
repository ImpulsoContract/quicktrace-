import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let targetGroups = ["COMMON", "ERP"];

    if (session.user.profileId || session.user.id) {
      const profile = await prisma.clientProfile.findFirst({
        where: session.user.profileId
          ? { id: Number(session.user.profileId) }
          : { userId: Number(session.user.id) },
        include: { plan: true }
      });

      if (profile) {
        if (profile.useLegacyPricing) {
          targetGroups = ["COMMON", "LEGACY"];
        } else if (profile.isSimpleVersion || profile.plan?.planGroup === "SIMPLE") {
          targetGroups = ["COMMON", "SIMPLE"];
        } else {
          targetGroups = ["COMMON", "ERP"];
        }
      }
    }

    const plans = await prisma.pricingPlan.findMany({
      where: {
        planGroup: { in: targetGroups }
      },
      orderBy: { priceYearly: "asc" }
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching public plans:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
