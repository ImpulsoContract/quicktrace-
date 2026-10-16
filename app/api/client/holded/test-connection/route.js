import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    let apiKey = body.apiKey?.trim();

    if (!apiKey) {
      const profile = await prisma.clientProfile.findUnique({
        where: { id: session.user.profileId }
      });
      apiKey = profile?.holdedApiKey?.trim();
    }

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "Debes introducir una clave API de Holded." 
      }, { status: 400 });
    }

    let seriesList = [];
    let success = false;
    let lastError = "";

    // 1. Try Holded API v1 (Legacy header 'key: ...')
    try {
      const v1Res = await fetch("https://api.holded.com/api/invoicing/v1/numberingseries/invoice", {
        method: "GET",
        headers: {
          "key": apiKey,
          "Accept": "application/json"
        }
      });

      if (v1Res.ok) {
        const data = await v1Res.json();
        seriesList = Array.isArray(data) ? data.map(s => ({
          id: s.id,
          name: s.name || s.id,
          prefix: s.prefix || s.format || ""
        })) : [];
        success = true;
      } else {
        const errText = await v1Res.text().catch(() => "");
        try {
          const jsonErr = JSON.parse(errText);
          lastError = jsonErr.info || jsonErr.message || jsonErr.detail || "";
        } catch (e) {}
      }
    } catch (e) {
      console.error("Holded v1 check failed:", e);
    }

    // 2. If v1 didn't succeed, try Holded API v2 ('Authorization: Bearer ...')
    if (!success) {
      try {
        const v2Res = await fetch("https://api.holded.com/api/v2/numbering-series/invoice", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Accept": "application/json"
          }
        });

        if (v2Res.ok) {
          const data = await v2Res.json();
          const items = Array.isArray(data) ? data : (data.items || []);
          seriesList = items.map(s => ({
            id: s.id,
            name: s.name || s.id,
            prefix: s.prefix || s.format || ""
          }));
          success = true;
        } else {
          const errText = await v2Res.text().catch(() => "");
          try {
            const jsonErr = JSON.parse(errText);
            lastError = jsonErr.detail || jsonErr.message || jsonErr.info || lastError;
          } catch (e) {}
        }
      } catch (e) {
        console.error("Holded v2 check failed:", e);
      }
    }

    if (!success) {
      return NextResponse.json({
        success: false,
        error: lastError 
          ? `Holded respondió: "${lastError}". Verifica que la clave sea correcta y tenga permisos de Facturación/Ventas.` 
          : "No se pudo conectar con Holded. Verifica que la API Key sea correcta y que en Holded tenga activados los permisos de Ventas (Facturas) y Contactos."
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      series: seriesList
    });
  } catch (error) {
    console.error("Error connecting to Holded:", error);
    return NextResponse.json({
      success: false,
      error: "Error interno al intentar conectar con Holded."
    }, { status: 500 });
  }
}
