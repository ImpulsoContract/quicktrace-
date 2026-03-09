import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      clientProfileId, 
      name, 
      ingredients, // Array of { name, amount, unit, loteMandatory, quantityMandatory }
      lotesMandatory, // Deprecated at recipe level, but keeping for compatibility if needed
      quantitiesMandatory // Deprecated at recipe level
    } = body;

    const profileId = parseInt(clientProfileId);

    // Check recipe limits
    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId },
      include: { _count: { select: { recipes: true } } }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const currentCount = profile._count.recipes;
    let limit = profile.accountType.toUpperCase() === "DEMO" ? 3 : profile.recetasContratadas;

    if (currentCount >= limit) {
      return NextResponse.json({ 
        error: `Límite alcanzado. Máximo ${limit} recetas permitidas para este tipo de cuenta.` 
      }, { status: 403 });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "Se requiere al menos un ingrediente." }, { status: 400 });
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        clientProfileId: profileId,
        lotesMandatory: !!lotesMandatory,
        quantitiesMandatory: !!quantitiesMandatory,
        ingredients: {
          create: ingredients.map((ing) => ({
            name: toTitleCase(ing.name),
            amount: ing.amount,
            unit: ing.unit,
            loteMandatory: !!ing.loteMandatory,
            quantityMandatory: !!ing.quantityMandatory
          }))
        }
      },
      include: {
        ingredients: true
      }
    });

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ error: "Se requiere el ID del cliente" }, { status: 400 });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: parseInt(clientId) },
      include: { ingredients: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
