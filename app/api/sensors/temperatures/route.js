import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    // 1. Authenticate via API Key
    const authHeader = req.headers.get("authorization");
    let apiKey = null;

    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      apiKey = authHeader.slice(7).trim();
    } else if (authHeader) {
      apiKey = authHeader.trim();
    }

    if (!apiKey) {
      apiKey = req.headers.get("x-api-key");
    }

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "No autorizado. Se requiere una clave de API válida. Proporciónala en la cabecera 'Authorization: Bearer <API_KEY>' o 'x-api-key: <API_KEY>'." 
        }, 
        { status: 401 }
      );
    }

    // 2. Lookup Client Profile
    const profile = await prisma.clientProfile.findUnique({
      where: { apiKey },
      include: {
        plan: true,
        chambers: true
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Clave de API no válida o revocada." }, 
        { status: 401 }
      );
    }

    // 3. Plan validation
    if (!profile.plan || !profile.plan.hasTemperatures) {
      return NextResponse.json(
        { error: "El módulo de temperaturas no está incluido o activo en tu plan contratado." }, 
        { status: 403 }
      );
    }

    // 4. Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "El cuerpo de la petición debe ser un JSON válido." }, 
        { status: 400 }
      );
    }

    // Normalize body to an array of raw readings
    let rawItems = [];
    if (Array.isArray(body)) {
      rawItems = body;
    } else if (body && typeof body === "object") {
      if (Array.isArray(body.temperatures)) {
        rawItems = body.temperatures;
      } else if (Array.isArray(body.readings)) {
        rawItems = body.readings;
      } else if (Array.isArray(body.camaras)) {
        rawItems = body.camaras;
      } else {
        // Single object e.g. { chamber: "Cámara 1", temperature: 4.2 }
        rawItems = [body];
      }
    }

    if (!rawItems || rawItems.length === 0) {
      return NextResponse.json(
        { 
          error: "No se proporcionaron lecturas de temperatura. Envía un objeto con 'chamber' y 'temperature', o un array de lecturas." 
        }, 
        { status: 400 }
      );
    }

    // 5. Validate each reading and match to client's chambers
    const processedReadings = [];
    const availableChamberNames = profile.chambers.map(c => c.name);

    for (let i = 0; i < rawItems.length; i++) {
      const item = rawItems[i];
      if (!item || typeof item !== "object") {
        return NextResponse.json(
          { error: `La lectura en la posición ${i} no es un objeto válido.` }, 
          { status: 400 }
        );
      }

      // Extract chamber name
      const chamberName = item.chamber ?? item.chamberName ?? item.camara ?? item.nombreCamara ?? item.name;
      if (!chamberName || typeof chamberName !== "string" || !chamberName.trim()) {
        return NextResponse.json(
          { error: `Cada lectura debe incluir el nombre de la cámara ('chamber'). Lectura ${i + 1} incompleta.` }, 
          { status: 400 }
        );
      }

      // Extract temperature value
      const tempRaw = item.temperature ?? item.temp ?? item.valor ?? item.temperatura ?? item.value;
      if (tempRaw === undefined || tempRaw === null) {
        return NextResponse.json(
          { error: `Falta el valor de temperatura para la cámara '${chamberName}'.` }, 
          { status: 400 }
        );
      }

      const tempVal = typeof tempRaw === "number" ? tempRaw : parseFloat(tempRaw);
      if (isNaN(tempVal) || !isFinite(tempVal) || tempVal < -100 || tempVal > 100) {
        return NextResponse.json(
          { 
            error: `Valor de temperatura no válido para '${chamberName}': '${tempRaw}'. Debe ser un número válido entre -100 y 100 °C.` 
          }, 
          { status: 400 }
        );
      }

      // Match chamber by name (case-insensitive & trimmed)
      const matchedChamber = profile.chambers.find(
        c => c.name.trim().toLowerCase() === chamberName.trim().toLowerCase()
      );

      if (!matchedChamber) {
        return NextResponse.json(
          { 
            error: `La cámara '${chamberName}' no existe en tu cuenta. Cámaras disponibles: [${availableChamberNames.map(n => `"${n}"`).join(", ")}]. Puedes darla de alta en tu panel de control.` 
          }, 
          { status: 404 }
        );
      }

      processedReadings.push({
        chamberId: matchedChamber.id,
        chamberName: matchedChamber.name,
        value: tempVal
      });
    }

    // 6. Create TemperatureRecord with exact required notes and current timestamp
    const now = new Date();
    const record = await prisma.temperatureRecord.create({
      data: {
        date: now,
        notes: "Entrada creada automáticamente desde el api de los sensores.",
        clientProfileId: profile.id,
        values: {
          create: processedReadings.map(r => ({
            chamberId: r.chamberId,
            value: r.value
          }))
        }
      },
      include: {
        values: {
          include: {
            chamber: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lecturas registradas correctamente",
        record: {
          id: record.id,
          date: record.date,
          notes: record.notes,
          readings: record.values.map(v => ({
            chamber: v.chamber.name,
            temperature: v.value
          }))
        }
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in sensor temperatures API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar las temperaturas" }, 
      { status: 500 }
    );
  }
}
