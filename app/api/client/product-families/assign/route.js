import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { type, itemId, productFamilyId } = body;

    if (!type || !itemId) {
      return NextResponse.json({ error: "Parámetros incompletos" }, { status: 400 });
    }

    const targetFamilyId = productFamilyId ? parseInt(productFamilyId) : null;

    if (targetFamilyId !== null) {
      // Validate family belongs to this client
      const family = await prisma.productFamily.findUnique({
        where: { id: targetFamilyId }
      });
      if (!family || (session.user.role !== "ADMIN" && family.clientProfileId !== profileId)) {
        return NextResponse.json({ error: "Familia de destino no válida" }, { status: 404 });
      }
    }

    if (type === "recipe") {
      const parsedId = parseInt(itemId);
      const recipe = await prisma.recipe.findUnique({
        where: { id: parsedId }
      });
      if (!recipe || (session.user.role !== "ADMIN" && recipe.clientProfileId !== profileId)) {
        return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
      }

      await prisma.recipe.update({
        where: { id: parsedId },
        data: { productFamilyId: targetFamilyId }
      });

      return NextResponse.json({
        success: true,
        type: "recipe",
        itemId: parsedId,
        productFamilyId: targetFamilyId
      });
    } else if (type === "goods") {
      const parsedId = parseInt(itemId);
      const goods = await prisma.goodsForSale.findUnique({
        where: { id: parsedId }
      });
      if (!goods || (session.user.role !== "ADMIN" && goods.clientProfileId !== profileId)) {
        return NextResponse.json({ error: "Mercancía en venta no encontrada" }, { status: 404 });
      }

      await prisma.goodsForSale.update({
        where: { id: parsedId },
        data: { productFamilyId: targetFamilyId }
      });

      return NextResponse.json({
        success: true,
        type: "goods",
        itemId: parsedId,
        productFamilyId: targetFamilyId
      });
    } else {
      return NextResponse.json({ error: "Tipo de elemento inválido (debe ser recipe o goods)" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error assigning item to product family:", error);
    return NextResponse.json({ error: "Error al asignar elemento a la familia" }, { status: 500 });
  }
}
