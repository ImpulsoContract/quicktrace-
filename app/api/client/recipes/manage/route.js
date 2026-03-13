import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, ingredients, expiryDays, expiryType } = body;

    // Get client profile and check privilege
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: { 
        plan: true,
        _count: { select: { recipes: true } } 
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    if (!profile.plan) {
      return NextResponse.json({ error: "No tienes un plan asignado. Contacta con soporte." }, { status: 403 });
    }

    // Check limits
    const currentCount = profile._count.recipes;
    const limit = profile.plan.recipesLimit;

    if (limit !== null && currentCount >= limit) {
      return NextResponse.json({ 
        error: `Límite alcanzado. Tu plan '${profile.plan.name}' permite ${limit} recetas y ya has creado ${currentCount}.` 
      }, { status: 403 });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "Se requiere al menos un ingrediente." }, { status: 400 });
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        expiryDays: expiryDays ? parseInt(expiryDays) : 0,
        expiryType: expiryType || "EXPIRATION",
        clientProfileId: profile.id,
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
    console.error("Error creating recipe by client:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
