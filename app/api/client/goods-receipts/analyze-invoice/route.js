import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isRecipeLimitExceeded } from "@/lib/planLimits";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Check if permissions are needed for worker
  if (session.user.role === "WORKER" && !session.user.permissions?.hasGoods) {
    return NextResponse.json({ error: "No tienes permiso para registrar entradas de mercancía" }, { status: 403 });
  }

  try {
    const profileId = session.user.profileId;
    if (await isRecipeLimitExceeded(profileId)) {
      return NextResponse.json({ error: "RECIPES_LIMIT_EXCEEDED" }, { status: 403 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    if (!profile.hasIaGoods) {
      return NextResponse.json({ error: "No tienes acceso al sistema de IA de entrada de mercancías. Pide al administrador que te lo active." }, { status: 403 });
    }

    // Dynamic Token Suffix Fallback for Vercel Blob
    let token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      const keys = Object.keys(process.env);
      const tokenKey = keys.find(k => k.endsWith("READ_WRITE_TOKEN"));
      if (tokenKey) {
        token = process.env[tokenKey];
      }
    }

    if (!token) {
      return NextResponse.json({ 
        error: "Falta configurar la variable de entorno BLOB_READ_WRITE_TOKEN. Asegúrate de conectar tu base de datos Vercel Blob en el panel de Vercel y sincronizar las variables locales." 
      }, { status: 500 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === '""' || apiKey === "''") {
      return NextResponse.json({ 
        error: "Falta configurar la variable de entorno GEMINI_API_KEY en Vercel. Actualmente el valor está vacío. Asegúrate de añadir el valor de la clave." 
      }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    // 1. Upload the file to Vercel Blob first
    const blob = await put(`albaranes/${Date.now()}-${file.name}`, file, {
      access: "public",
      token
    });

    // 2. Read file as buffer for Gemini inlineData
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    // 3. Request analysis from Gemini 2.5 Flash with responseSchema
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const promptText = "Extract the provider name and all line items from this delivery note (albarán). The provider name should be the overall issuer/seller of the goods. For each line item, extract the product name, the lot number (lote, if visible), and the quantity (cantidad, if visible). Respond only with a JSON object matching the requested schema.";

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
            provider: { type: "STRING", description: "Name of the provider / issuer of the delivery note" },
            items: {
              type: "ARRAY",
              description: "List of goods / products delivered",
              items: {
                type: "OBJECT",
                properties: {
                  product: { type: "STRING", description: "Name of the product" },
                  lote: { type: "STRING", description: "Lot / batch number, or empty string if not visible" },
                  quantity: { type: "STRING", description: "Quantity / amount delivered, or empty string if not visible" }
                },
                required: ["product", "lote", "quantity"]
              }
            }
          },
          required: ["provider", "items"]
        }
      }
    };

    console.log(`[Gemini Request] Sending document to gemini-2.5-flash... Size: ${buffer.length} bytes`);
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
    const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      console.error(`[Gemini Error] Empty response:`, JSON.stringify(geminiData));
      return NextResponse.json({ error: "La IA no devolvió datos estructurados" }, { status: 500 });
    }

    console.log(`[Gemini Response] Extracted text:`, resultText);
    const parsedData = JSON.parse(resultText);

    const initialItems = (parsedData.items || []).map((item, idx) => ({
      id: idx,
      productName: item.product || "",
      lote: item.lote || "",
      quantity: item.quantity || "",
      saved: false,
      goodsReceiptId: null
    }));

    let scannedDoc = null;
    try {
      scannedDoc = await prisma.scannedDeliveryNote.create({
        data: {
          clientProfileId: profileId,
          providerName: parsedData.provider || "",
          imageUrl: blob.url,
          fileName: file.name || "albaran.jpg",
          items: initialItems,
          date: new Date()
        }
      });
    } catch (saveErr) {
      console.error("[analyze-invoice] Error saving scanned delivery note:", saveErr);
    }

    return NextResponse.json({
      success: true,
      scannedDeliveryNoteId: scannedDoc ? scannedDoc.id : null,
      imageUrl: blob.url,
      provider: parsedData.provider || "",
      items: parsedData.items || []
    });

  } catch (error) {
    console.error("Error in analyze-invoice API:", error);
    return NextResponse.json({ 
      error: "Error interno al procesar el albarán con IA", 
      details: error.message 
    }, { status: 500 });
  }
}
