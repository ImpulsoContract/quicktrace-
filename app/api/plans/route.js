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

    const plans = await prisma.pricingPlan.findMany({
      orderBy: { priceYearly: 'asc' }
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching public plans:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
