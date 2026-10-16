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

    // Call Holded to fetch invoice numbering series
    const holdedRes = await fetch("https://api.holded.com/api/invoicing/v1/numberingseries/invoice", {
      method: "GET",
      headers: {
        "key": apiKey,
        "Accept": "application/json"
      }
    });

    if (!holdedRes.ok) {
      return NextResponse.json({
        success: false,
        error: "No se pudo conectar con Holded. Verifica que la API Key sea correcta y tenga permisos de facturación."
      }, { status: 400 });
    }

    const data = await holdedRes.json();
    const seriesList = Array.isArray(data) ? data.map(s => ({
      id: s.id,
      name: s.name || s.id,
      prefix: s.prefix || s.format || ""
    })) : [];

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
