import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role === "WORKER" && !session.user.permissions?.hasRecipes) {
    return NextResponse.json({ error: "No tienes permiso para gestionar recetas" }, { status: 403 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === '""' || apiKey === "''") {
      return NextResponse.json({ 
        error: "Falta configurar la variable de entorno GEMINI_API_KEY en el servidor." 
      }, { status: 500 });
    }

    const body = await req.json();
    const { recipeName, ingredients, cookingDescription, finishedWeight } = body || {};

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ 
        error: "Debes incluir al menos un ingrediente para calcular los valores nutricionales." 
      }, { status: 400 });
    }

    if (!cookingDescription || String(cookingDescription).trim() === "") {
      return NextResponse.json({ 
        error: "Debes proporcionar una descripción de la elaboración y cocinado." 
      }, { status: 400 });
    }

    if (!finishedWeight || String(finishedWeight).trim() === "") {
      return NextResponse.json({ 
        error: "Debes proporcionar el peso total de la elaboración terminada." 
      }, { status: 400 });
    }

    // Validate that every ingredient has an amount and unit
    const invalidIng = ingredients.find(ing => !ing.name || !String(ing.name).trim() || !ing.amount || !String(ing.amount).trim() || !ing.unit || !String(ing.unit).trim());
    if (invalidIng) {
      return NextResponse.json({ 
        error: "Todos los ingredientes deben tener nombre, cantidad y unidad de medida asignadas." 
      }, { status: 400 });
    }

    const ingredientsSummary = ingredients.map((ing, idx) => 
      `${idx + 1}. ${ing.name}: ${ing.amount} ${ing.unit}${ing.expandedText ? ` (${ing.expandedText})` : ""}`
    ).join("\n");

    const promptText = `Eres un experto bromatólogo, nutricionista y especialista en tecnología de los alimentos y formulación culinaria según el Reglamento (UE) nº 1169/2011 sobre la información alimentaria facilitada al consumidor.

Tu misión es calcular rigurosamente la información nutricional media por cada 100 gramos de producto terminado a partir de los siguientes datos reales proporcionados por el usuario:

Nombre de la receta: ${recipeName || "Receta sin nombre"}
Peso final de la elaboración terminada (cocinada y lista para consumo): ${finishedWeight}
Descripción del proceso de elaboración y cocinado:
${cookingDescription}

Lista de ingredientes brutos y cantidades iniciales:
${ingredientsSummary}

Instrucciones metodológicas de cálculo:
1. Analiza el aporte nutricional bruto de cada ingrediente (energía, grasas, grasas saturadas, hidratos de carbono, azúcares, proteínas y sal/sodio).
2. Considera los efectos reales del cocinado especificado (pérdida de agua por evaporación o merma térmica, absorción o liberación de grasas en fritura/asado, concentración de azúcares y nutrientes, etc.) comparando la masa bruta inicial con el peso final indicado ("${finishedWeight}").
3. Divide las cantidades totales de cada nutriente calculadas entre el peso final terminado y multiplica por 100 para obtener con precisión matemática los valores MEDIOS POR 100 GRAMOS de producto terminado.
4. Para la sal: si calculas el sodio, aplica la fórmula Sal = Sodio x 2.5.
5. Formato exacto de respuesta por 100g:
   - energyValue: valor energético combinando kcal y kJ, ejemplo: "245 kcal / 1025 kJ" o "245 kcal".
   - fats: gramos de grasas totales redondeado a un decimal (ejemplo: "12.5" o "12.5 g").
   - saturatedFats: gramos de grasas saturadas redondeado a un decimal (ejemplo: "3.2" o "3.2 g").
   - carbohydrates: gramos de hidratos de carbono redondeado a un decimal (ejemplo: "28.0" o "28.0 g").
   - sugars: gramos de azúcares redondeado a un decimal (ejemplo: "4.1" o "4.1 g").
   - proteins: gramos de proteínas redondeado a un decimal (ejemplo: "8.6" o "8.6 g").
   - salt: gramos de sal redondeado a dos decimales (ejemplo: "1.15" o "1.15 g").

Devuelve única y exclusivamente un objeto JSON según el esquema especificado.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiBody = {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ],
      generation_config: {
        response_mime_type: "application/json",
        response_schema: {
          type: "OBJECT",
          properties: {
            energyValue: { type: "STRING", description: "Valor energético por 100g (ej. 245 kcal / 1025 kJ)" },
            fats: { type: "STRING", description: "Grasas totales por 100g en gramos (ej. 12.5 o 12.5 g)" },
            saturatedFats: { type: "STRING", description: "Grasas saturadas por 100g en gramos (ej. 3.2 o 3.2 g)" },
            carbohydrates: { type: "STRING", description: "Hidratos de carbono por 100g en gramos (ej. 28.0 o 28.0 g)" },
            sugars: { type: "STRING", description: "Azúcares por 100g en gramos (ej. 4.1 o 4.1 g)" },
            proteins: { type: "STRING", description: "Proteínas por 100g en gramos (ej. 8.6 o 8.6 g)" },
            salt: { type: "STRING", description: "Sal por 100g en gramos (ej. 1.15 o 1.15 g)" }
          },
          required: ["energyValue", "fats", "saturatedFats", "carbohydrates", "sugars", "proteins", "salt"]
        }
      }
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(geminiBody)
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[Gemini Error - Nutritional Calc] HTTP ${geminiRes.status}:`, errText);
      return NextResponse.json({ 
        error: "Error en el servicio de IA de Gemini al calcular valores nutricionales", 
        details: errText 
      }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const candidate = geminiData.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (!textPart) {
      return NextResponse.json({ error: "No se obtuvo respuesta del modelo de IA" }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(textPart);
    } catch (e) {
      console.error("Error parsing Gemini Nutritional JSON:", e, textPart);
      return NextResponse.json({ error: "Respuesta de IA no válida como JSON" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        energyValue: parsed.energyValue ? String(parsed.energyValue).trim() : "",
        fats: parsed.fats ? String(parsed.fats).trim() : "",
        saturatedFats: parsed.saturatedFats ? String(parsed.saturatedFats).trim() : "",
        carbohydrates: parsed.carbohydrates ? String(parsed.carbohydrates).trim() : "",
        sugars: parsed.sugars ? String(parsed.sugars).trim() : "",
        proteins: parsed.proteins ? String(parsed.proteins).trim() : "",
        salt: parsed.salt ? String(parsed.salt).trim() : ""
      }
    });

  } catch (error) {
    console.error("Error calculating nutritional values with Gemini:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
