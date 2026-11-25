import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasRecipes) {
    return NextResponse.json({ error: "No tienes permiso para gestionar recetas" }, { status: 403 });
  }

  const userRecord = await prisma.user.findFirst({
    where: {
      OR: [
        { id: parseInt(session.user.id) },
        { clientProfile: { id: session.user.profileId } }
      ]
    },
    select: { emailVerified: true, email: true }
  });

  if (userRecord && !userRecord.emailVerified) {
    return NextResponse.json({ 
      error: "Debes verificar tu correo electrónico para utilizar la generación de imágenes con Inteligencia Artificial.",
      emailNotVerified: true,
      email: userRecord.email
    }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const recipeId = parseInt(id);
    if (isNaN(recipeId)) {
      return NextResponse.json({ error: "ID de receta inválido" }, { status: 400 });
    }

    // Verify ownership and load recipe with ingredients
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: true }
    });

    if (!recipe || recipe.clientProfileId !== profileId) {
      return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").replace(/['"]/g, "").trim();
    if (!apiKey) {
      return NextResponse.json({ 
        error: "Falta configurar la clave de Inteligencia Artificial (GEMINI_API_KEY) en el servidor." 
      }, { status: 500 });
    }

    // Optional user prompt or customized focus
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const customPrompt = body.prompt ? String(body.prompt).trim() : "";
    const mainIngredients = (recipe.ingredients || [])
      .slice(0, 6)
      .map(i => i.name)
      .filter(Boolean)
      .join(", ");

    const basePrompt = customPrompt || `A mouth-watering, highly appetizing professional gourmet culinary photograph of "${recipe.name}". ${mainIngredients ? `Features visible ingredients: ${mainIngredients}.` : ""} Artfully plated on a rustic elegant table, natural studio lighting, macro food photography style, crisp details, fresh garnishes, vibrant colors, appetizing textures, 4k ultra-high resolution.`;

    const models = ["gemini-2.5-flash-image", "gemini-3.1-flash-image", "gemini-3-pro-image"];
    let generatedImageUrl = null;
    let lastError = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: basePrompt }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status} en modelo ${model}`;
          continue;
        }

        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        
        // Search for inlineData with image
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || "image/png";
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }

        if (generatedImageUrl) break;
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!generatedImageUrl) {
      return NextResponse.json({
        error: lastError || "No se pudo generar la imagen con Inteligencia Artificial. Inténtalo de nuevo."
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: generatedImageUrl
    });
  } catch (error) {
    console.error("Error generating recipe image with AI:", error);
    return NextResponse.json({ 
      error: error.message || "Error interno al generar la imagen con IA" 
    }, { status: 500 });
  }
}
