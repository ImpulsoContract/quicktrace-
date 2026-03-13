import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const lote = searchParams.get("lote");
    const recipeId = searchParams.get("recipeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    // Buscar el perfil del cliente asociado al usuario de la sesión usando el ID
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const where = {
      recipe: {
        clientProfileId: profile.id
      }
    };

    if (lote) {
      where.ingredients = {
        some: {
          lote: {
            contains: lote
          }
        }
      };
    }

    if (recipeId && recipeId !== "all") {
      where.recipeId = parseInt(recipeId);
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const [total, elaborations] = await Promise.all([
      prisma.elaboration.count({ where }),
      prisma.elaboration.findMany({
        where,
        include: {
          recipe: {
            include: {
              ingredients: true
            }
          },
          ingredients: true
        },
        orderBy: {
          date: 'desc'
        },
        skip,
        take: limit
      })
    ]);

    return NextResponse.json({
      data: elaborations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error GET /api/elaborations:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const data = await req.json();
    const { name, recipeId, ingredients, personName, date, expirationDate } = data;

    // Buscar el perfil del cliente
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: { plan: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    if (!profile.plan) {
      return NextResponse.json({ error: "No tienes un plan asignado. Contacta con soporte." }, { status: 403 });
    }

    // Check limits
    const currentCount = await prisma.elaboration.count({
      where: {
        recipe: {
          clientProfileId: profile.id
        }
      }
    });
    
    const limit = profile.plan.elaborationsLimit;

    if (limit !== null && currentCount >= limit) {
      return NextResponse.json({ 
        error: `Límite alcanzado. Tu plan '${profile.plan.name}' permite ${limit} elaboraciones y ya has creado ${currentCount}.` 
      }, { status: 403 });
    }

    // Verificar que la receta pertenece al cliente
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(recipeId) }
    });

    if (!recipe || recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Receta no encontrada o no pertenece al cliente" }, { status: 403 });
    }

    const elaboration = await prisma.elaboration.create({
      data: {
        name,
        recipeId: parseInt(recipeId),
        personName,
        date: date ? new Date(date) : new Date(),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        ingredients: {
          create: ingredients.map(ing => ({
            name: toTitleCase(ing.name),
            lote: ing.lote,
            realAmount: ing.realAmount.toString(),
            unit: ing.unit
          }))
        }
      },
      include: {
        recipe: true,
        ingredients: true
      }
    });

    return NextResponse.json(elaboration);
  } catch (error) {
    console.error("Error POST /api/elaborations:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
