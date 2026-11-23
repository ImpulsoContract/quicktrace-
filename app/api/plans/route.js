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

    let targetGroups = ["COMMON", "SIMPLE"];

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
        } else {
          targetGroups = ["COMMON", "SIMPLE"];
        }
      }
    }

    // Asegurar que el plan Starter existe con los IDs de Stripe correspondientes
    const starterPlan = await prisma.pricingPlan.findFirst({
      where: {
        OR: [
          { stripePriceIdMonthly: "price_1UeygJFXbV1PkWSmxb4PA2ZR" },
          { stripePriceIdYearly: "price_1UeyhTFXbV1PkWSmNdEmifGO" },
          { name: "Starter" }
        ]
      }
    });

    if (!starterPlan) {
      await prisma.pricingPlan.create({
        data: {
          name: "Starter",
          planGroup: "SIMPLE",
          priceMonthly: 25,
          priceYearly: 280,
          stripePriceIdMonthly: "price_1UeygJFXbV1PkWSmxb4PA2ZR",
          stripePriceIdYearly: "price_1UeyhTFXbV1PkWSmNdEmifGO",
          stripePriceId: "price_1UeyhTFXbV1PkWSmNdEmifGO",
          recipesLimit: 30,
          elaborationsLimit: null,
          hasCleaning: true,
          cleaningLimit: null,
          hasGoods: true,
          goodsLimit: null,
          hasTemperatures: true,
          temperaturesLimit: null,
          hasWater: true,
          waterLimit: null,
          hasProviders: true
        }
      });
    }

    // Asegurar que el plan Gold tiene recetas ilimitadas
    await prisma.pricingPlan.updateMany({
      where: { name: { contains: 'Gold', mode: 'insensitive' }, recipesLimit: { not: null } },
      data: { recipesLimit: null }
    }).catch(() => {});

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
