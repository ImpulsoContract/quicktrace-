import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/plans - List all plans
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const plans = await prisma.pricingPlan.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { clients: true }
        }
      }
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST /api/admin/plans - Create a new plan
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await req.json();
    
    // Validar nombre único
    const existing = await prisma.pricingPlan.findUnique({
      where: { name: data.name }
    });
    if (existing) {
      return NextResponse.json({ error: "Ya existe un plan con ese nombre" }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name: data.name,
        priceMonthly: parseFloat(data.priceMonthly) || 0,
        priceYearly: parseFloat(data.priceYearly) || 0,
        stripePriceIdMonthly: data.stripePriceIdMonthly?.trim() || null,
        stripePriceIdYearly: data.stripePriceIdYearly?.trim() || data.stripePriceId?.trim() || null,
        stripePriceId: data.stripePriceIdYearly?.trim() || data.stripePriceId?.trim() || null, // Keeping legacy for now
        recipesLimit: data.recipesLimit === "" ? null : parseInt(data.recipesLimit),
        elaborationsLimit: data.elaborationsLimit === "" ? null : parseInt(data.elaborationsLimit),
        hasCleaning: data.hasCleaning || false,
        cleaningLimit: data.hasCleaning ? (data.cleaningLimit === "" ? null : parseInt(data.cleaningLimit)) : null,
        hasGoods: data.hasGoods || false,
        goodsLimit: data.hasGoods ? (data.goodsLimit === "" ? null : parseInt(data.goodsLimit)) : null,
        hasTemperatures: data.hasTemperatures || false,
        temperaturesLimit: data.hasTemperatures ? (data.temperaturesLimit === "" ? null : parseInt(data.temperaturesLimit)) : null,
      }
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
