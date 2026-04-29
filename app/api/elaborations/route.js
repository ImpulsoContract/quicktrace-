import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/lib/utils";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
      return NextResponse.json({ error: "No tienes permiso para acceder a trazabilidad" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const lote = searchParams.get("lote");
    const recipeId = searchParams.get("recipeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const where = {
      recipe: {
        clientProfileId: profileId
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
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
      return NextResponse.json({ error: "No tienes permiso para registrar elaboraciones" }, { status: 403 });
    }

    const data = await req.json();
    const { name, recipeId, ingredients, personName, date, expirationDate, dryingRoomIn, dryingRoomOut, preparationTime, unitPrice, quantityProduced, netWeight, workshopTemp } = data;

    const profileId = session.user.profileId;
    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId },
      include: { plan: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    if (!profile.plan) {
      return NextResponse.json({ error: "No tienes un plan asignado." }, { status: 403 });
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
        error: `Límite alcanzado.` 
      }, { status: 403 });
    }

    // Verificar que la receta pertenece al cliente
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(recipeId) }
    });

    if (!recipe || recipe.clientProfileId !== profile.id) {
      return NextResponse.json({ error: "Receta no encontrada o no pertenece al cliente" }, { status: 403 });
    }

    // Calculate Cost Price
    const existingPrices = await prisma.ingredientPrice.findMany({
      where: { clientProfileId: profile.id }
    });

    const priceMap = {};
    existingPrices.forEach(p => {
      priceMap[`${p.name.toLowerCase()}_${p.unit.toLowerCase()}`] = p.price;
    });

    let totalCost = 0;
    ingredients.forEach(ing => {
      const lookupKey = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`;
      const price = priceMap[lookupKey] || 0;
      const amount = parseFloat(ing.realAmount.toString().replace(',', '.')) || 0;
      totalCost += amount * price;
    });

    const elaboration = await prisma.elaboration.create({
      data: {
        name,
        recipeId: parseInt(recipeId),
        personName: data.personName,
        date: data.date ? new Date(data.date) : new Date(),
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        dryingRoomIn: data.dryingRoomIn,
        dryingRoomOut: data.dryingRoomOut,
        workshopTemp: data.workshopTemp,
        quantityProduced: data.quantityProduced,
        netWeight: data.netWeight,
        preparationTime: data.preparationTime,
        unitPrice: parseFloat(data.unitPrice?.toString().replace(',', '.')) || 0,
        laborCostHourlyRate: profile.laborCostHourlyRate || 0,
        costPrice: totalCost,
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

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasTraceability) {
      return NextResponse.json({ error: "No tienes permiso para modificar elaboraciones" }, { status: 403 });
    }

    const data = await req.json();
    const { id, name, personName, date, expirationDate, dryingRoomIn, dryingRoomOut, workshopTemp, quantityProduced, netWeight, preparationTime, unitPrice, ingredients } = data;

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const profileId = session.user.profileId;

    // Verify ownership
    const existing = await prisma.elaboration.findUnique({
      where: { id: parseInt(id) },
      include: { recipe: true }
    });

    if (!existing || existing.recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado o no encontrado" }, { status: 403 });
    }

    // Calculate Cost Price
    const existingPrices = await prisma.ingredientPrice.findMany({
      where: { clientProfileId: profileId }
    });

    const priceMap = {};
    existingPrices.forEach(p => {
      priceMap[`${p.name.toLowerCase()}_${p.unit.toLowerCase()}`] = p.price;
    });

    const updateData = {
      name,
      personName,
      date: date ? new Date(date) : undefined,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      dryingRoomIn,
      dryingRoomOut,
      workshopTemp,
      quantityProduced,
      netWeight,
      preparationTime,
      unitPrice: unitPrice !== undefined ? (parseFloat(unitPrice?.toString().replace(',', '.')) || 0) : undefined,
    };

    if (ingredients) {
      let totalCost = 0;
      ingredients.forEach(ing => {
        const lookupKey = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`;
        const price = priceMap[lookupKey] || 0;
        const amount = parseFloat(ing.realAmount.toString().replace(',', '.')) || 0;
        totalCost += amount * price;
      });
      updateData.costPrice = totalCost;

      updateData.ingredients = {
        deleteMany: {},
        create: ingredients.map(ing => ({
          name: toTitleCase(ing.name),
          lote: ing.lote,
          realAmount: ing.realAmount.toString(),
          unit: ing.unit
        }))
      };
    }

    const elaboration = await prisma.elaboration.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        recipe: true,
        ingredients: true
      }
    });

    return NextResponse.json(elaboration);
  } catch (error) {
    console.error("Error PATCH /api/elaborations:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER") {
      return NextResponse.json({ error: "No tienes permisos para eliminar registros" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    // Support both single ID and multiple IDs in body
    let idsToDelete = [];
    if (id) {
      idsToDelete = [parseInt(id)];
    } else {
      const body = await req.json();
      if (body.ids && Array.isArray(body.ids)) {
        idsToDelete = body.ids.map(id => parseInt(id));
      }
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: "IDs requeridos" }, { status: 400 });
    }

    const profileId = session.user.profileId;

    // Delete records that belong to the client
    const deleteResult = await prisma.elaboration.deleteMany({
      where: {
        id: { in: idsToDelete },
        recipe: {
          clientProfileId: profileId
        }
      }
    });

    return NextResponse.json({ success: true, count: deleteResult.count });
  } catch (error) {
    console.error("Error DELETE /api/elaborations:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
