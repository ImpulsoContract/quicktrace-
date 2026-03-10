import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PATCH /api/admin/plans/[id] - Update a plan
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const data = await req.json();

    const plan = await prisma.pricingPlan.update({
      where: { id },
      data: {
        name: data.name,
        priceYearly: parseFloat(data.priceYearly) || 0,
        stripePriceId: data.stripePriceId || null,
        recipesLimit: data.recipesLimit === "" || data.recipesLimit === null ? null : parseInt(data.recipesLimit),
        elaborationsLimit: data.elaborationsLimit === "" || data.elaborationsLimit === null ? null : parseInt(data.elaborationsLimit),
        hasCleaning: data.hasCleaning,
        cleaningLimit: data.hasCleaning ? (data.cleaningLimit === "" || data.cleaningLimit === null ? null : parseInt(data.cleaningLimit)) : null,
        hasGoods: data.hasGoods,
        goodsLimit: data.hasGoods ? (data.goodsLimit === "" || data.goodsLimit === null ? null : parseInt(data.goodsLimit)) : null,
        hasTemperatures: data.hasTemperatures,
        temperaturesLimit: data.hasTemperatures ? (data.temperaturesLimit === "" || data.temperaturesLimit === null ? null : parseInt(data.temperaturesLimit)) : null,
      }
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE /api/admin/plans/[id]
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const id = parseInt(params.id);

    // Verificar si hay clientes usando este plan
    const clientsCount = await prisma.clientProfile.count({
      where: { planId: id }
    });

    if (clientsCount > 0) {
      return NextResponse.json({ error: "No se puede eliminar un plan que tiene clientes asociados" }, { status: 400 });
    }

    await prisma.pricingPlan.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
