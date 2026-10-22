import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const elaborations = await prisma.elaboration.findMany({
      where: {
        recipe: session.user.role === "ADMIN" ? {} : { clientProfileId: profileId }
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            baseUnit: true
          }
        },
        sales: {
          select: {
            quantity: true,
            percentage: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const availableElaborations = elaborations.map(el => {
      const totalProduced = parseFloat(el.quantityProduced?.toString().replace(',', '.')) || 0;
      const unit = el.quantityUnit || el.recipe?.baseUnit || "unidades";

      const totalSold = (el.sales || []).reduce((sum, s) => {
        if (s.quantity != null) return sum + s.quantity;
        if (totalProduced > 0 && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
        return sum;
      }, 0);

      const availableStock = Math.max(0, Math.round((totalProduced - totalSold) * 1000) / 1000);

      return {
        id: el.id,
        name: el.name, // Lote
        date: el.date,
        expirationDate: el.expirationDate,
        recipeName: el.recipe?.name || "Sin receta",
        recipeId: el.recipeId,
        quantityProduced: totalProduced,
        quantityUnit: unit,
        unitPrice: el.unitPrice || 0,
        availableStock,
        totalSold: Math.round(totalSold * 1000) / 1000
      };
    }).filter(el => el.availableStock > 0.0001);

    return NextResponse.json({ success: true, data: availableElaborations });
  } catch (error) {
    console.error("Error fetching available elaborations:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
