import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_ALLERGENS = [
  "gluten", "crustaceans", "eggs", "fish", "peanuts", 
  "soy", "milk", "nuts", "celery", "mustard", 
  "sesame", "sulphites", "lupins", "molluscs"
];

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

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg");

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `Eres un asistente experto en cocina, fichas técnicas de hostelería y tecnología de los alimentos.
Tu tarea es analizar esta ficha técnica o documento de receta y extraer detalladamente la información para autorrellenar el formulario de la receta.

Instrucciones de extracción:
1. name: Nombre de la receta o plato elaborado.
2. expiryDays: Días hasta la fecha de caducidad o consumo preferente (número entero). Si no se indica, pon 0.
3. expiryType: Si indica caducidad o consumo inmediato pon "EXPIRATION". Si indica consumo preferente pon "BEST_BEFORE". Por defecto "EXPIRATION".
4. ingredients: Extrae TODOS y cada uno de los ingredientes presentes. Para cada ingrediente:
   - name: Nombre del ingrediente.
   - amount: Cantidad numérica o texto de la cantidad (ej. "500", "1.5", "10"). Si no aparece, deja cadena vacía "".
   - unit: Unidad de medida (ej. "g", "kg", "ml", "L", "cda", "uds", etc.). Si no aparece, deja cadena vacía "".
5. elaborationInstructions: Pasos, proceso o método de elaboración y preparación del plato.
6. conservationInstructions: Condiciones e instrucciones de conservación y almacenamiento (temperatura, refrigeración, congelación, etc.).
7. Información nutricional (valores por 100g si están disponibles):
   - energyValue: Valor energético (ej. "245 kcal / 1024 kJ").
   - fats: Grasas totales (ej. "12.5 g" o "12.5").
   - saturatedFats: Grasas saturadas / de las cuales saturadas (ej. "3.2 g" o "3.2").
   - carbohydrates: Hidratos de carbono (ej. "28.0 g" o "28").
   - sugars: Azúcares / de los cuales azúcares (ej. "4.1 g" o "4.1").
   - proteins: Proteínas (ej. "8.6 g" o "8.6").
   - salt: Sal (ej. "1.1 g" o "1.1").
8. allergens: Lista de alérgenos presentes, seleccionados EXCLUSIVAMENTE entre estas claves en minúsculas:
   - "gluten" (si contiene trigo, centeno, cebada, avena, espelta, kamut o variedades híbridas)
   - "crustaceans" (crustáceos)
   - "eggs" (huevos)
   - "fish" (pescado)
   - "peanuts" (cacahuetes)
   - "soy" (soja)
   - "milk" (leche y derivados, lactosa)
   - "nuts" (frutos de cáscara: almendras, avellanas, nueces, anacardos, etc.)
   - "celery" (apio)
   - "mustard" (mostaza)
   - "sesame" (granos de sésamo)
   - "sulphites" (dióxido de azufre y sulfitos)
   - "lupins" (altramuces)
   - "molluscs" (moluscos)
9. SECADERO: IMPORTANTE: Ignora por completo cualquier dato o sección referente a secadero, cámara de secado o curación.

Si algún dato no aparece en la imagen o documento, simplemente déjalo como cadena vacía "" o valor por defecto según el esquema.
Responde únicamente con el JSON que cumpla el esquema requerido.`;

    const geminiBody = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generation_config: {
        response_mime_type: "application/json",
        response_schema: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING", description: "Nombre de la receta" },
            expiryDays: { type: "INTEGER", description: "Días de caducidad" },
            expiryType: { type: "STRING", description: "EXPIRATION o BEST_BEFORE" },
            elaborationInstructions: { type: "STRING", description: "Instrucciones de elaboración" },
            conservationInstructions: { type: "STRING", description: "Instrucciones de conservación" },
            energyValue: { type: "STRING", description: "Valor energético" },
            fats: { type: "STRING", description: "Grasas totales" },
            saturatedFats: { type: "STRING", description: "Grasas saturadas" },
            carbohydrates: { type: "STRING", description: "Hidratos de carbono" },
            sugars: { type: "STRING", description: "Azúcares" },
            proteins: { type: "STRING", description: "Proteínas" },
            salt: { type: "STRING", description: "Sal" },
            allergens: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Claves de alérgenos detectados"
            },
            ingredients: {
              type: "ARRAY",
              description: "Listado de todos los ingredientes",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING", description: "Nombre del ingrediente" },
                  amount: { type: "STRING", description: "Cantidad del ingrediente o vacío si no se indica" },
                  unit: { type: "STRING", description: "Unidad de medida o vacío si no se indica" }
                },
                required: ["name", "amount", "unit"]
              }
            }
          },
          required: ["name", "ingredients"]
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
      console.error(`[Gemini Error] HTTP ${geminiRes.status}:`, errText);
      return NextResponse.json({ error: "Error en el servicio de IA de Gemini", details: errText }, { status: 502 });
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
      console.error("Error parsing Gemini JSON:", e, textPart);
      return NextResponse.json({ error: "Respuesta de IA no válida como JSON" }, { status: 500 });
    }

    // Sanitize allergens to ensure only valid keys
    const allergens = Array.isArray(parsed.allergens)
      ? parsed.allergens
          .map(a => String(a).toLowerCase().trim())
          .filter(a => VALID_ALLERGENS.includes(a))
      : [];

    // Sanitize ingredients
    const ingredients = Array.isArray(parsed.ingredients)
      ? parsed.ingredients.map(ing => ({
          name: String(ing.name || "").trim(),
          amount: String(ing.amount || "").trim(),
          unit: String(ing.unit || "").trim()
        })).filter(ing => ing.name.length > 0)
      : [];

    const resultData = {
      name: parsed.name ? String(parsed.name).trim() : "",
      expiryDays: typeof parsed.expiryDays === "number" ? Math.max(0, parsed.expiryDays) : 0,
      expiryType: parsed.expiryType === "BEST_BEFORE" ? "BEST_BEFORE" : "EXPIRATION",
      elaborationInstructions: parsed.elaborationInstructions ? String(parsed.elaborationInstructions).trim() : "",
      conservationInstructions: parsed.conservationInstructions ? String(parsed.conservationInstructions).trim() : "",
      energyValue: parsed.energyValue ? String(parsed.energyValue).trim() : "",
      fats: parsed.fats ? String(parsed.fats).trim() : "",
      saturatedFats: parsed.saturatedFats ? String(parsed.saturatedFats).trim() : "",
      carbohydrates: parsed.carbohydrates ? String(parsed.carbohydrates).trim() : "",
      sugars: parsed.sugars ? String(parsed.sugars).trim() : "",
      proteins: parsed.proteins ? String(parsed.proteins).trim() : "",
      salt: parsed.salt ? String(parsed.salt).trim() : "",
      allergens,
      ingredients
    };

    return NextResponse.json({ data: resultData });
  } catch (error) {
    console.error("Error analyzing recipe sheet:", error);
    return NextResponse.json({ error: error.message || "Error interno al analizar la ficha" }, { status: 500 });
  }
}
