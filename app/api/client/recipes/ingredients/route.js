import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profileId = session.user.profileId;

    // 1. Fetch all recipes for this client with ingredients
    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: profileId },
      include: {
        ingredients: true
      },
      orderBy: { name: "asc" }
    });

    // 2. Fetch all elaboration ingredients for this client to count lotes per ingredient name
    const elabIngredients = await prisma.elaborationIngredient.findMany({
      where: {
        elaboration: {
          recipe: {
            clientProfileId: profileId
          }
        },
        NOT: [
          { lote: null },
          { lote: "" }
        ]
      },
      select: {
        name: true,
        lote: true
      }
    });

    const lotesCountByIng = new Map();
    elabIngredients.forEach(ei => {
      const nameKey = (ei.name || "").trim().toLowerCase();
      if (!nameKey) return;
      lotesCountByIng.set(nameKey, (lotesCountByIng.get(nameKey) || 0) + 1);
    });

    // 3. Aggregate unique ingredients
    const map = new Map();

    recipes.forEach(r => {
      (r.ingredients || []).forEach(ing => {
        const rawName = (ing.name || "").trim();
        if (!rawName) return;
        const normKey = rawName.toLowerCase();

        if (!map.has(normKey)) {
          map.set(normKey, {
            name: rawName,
            recipes: [],
            recipeIds: [],
            units: new Set(),
            lotesCount: lotesCountByIng.get(normKey) || 0
          });
        }

        const entry = map.get(normKey);
        if (!entry.recipeIds.includes(r.id)) {
          entry.recipeIds.push(r.id);
          entry.recipes.push(r.name);
        }
        if (ing.unit) {
          entry.units.add(ing.unit.trim());
        }
      });
    });

    // Format output
    const list = Array.from(map.values()).map(item => ({
      name: item.name,
      recipes: item.recipes,
      recipeCount: item.recipes.length,
      units: Array.from(item.units),
      lotesCount: item.lotesCount
    }));

    // Sort alphabetically
    list.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

    return NextResponse.json({ success: true, ingredients: list });
  } catch (error) {
    console.error("Error in GET /api/client/recipes/ingredients:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
