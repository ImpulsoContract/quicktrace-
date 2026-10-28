import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { testIsbueConnection } from "@/lib/isbue";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    let apiKey = body.apiKey?.trim();
    let apiUrl = body.apiUrl?.trim();

    if (!apiKey) {
      const profile = await prisma.clientProfile.findUnique({
        where: { id: session.user.profileId }
      });
      apiKey = profile?.isbueApiKey?.trim();
      if (!apiUrl && profile?.isbueApiUrl) {
        apiUrl = profile.isbueApiUrl.trim();
      }
    }

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "Debes introducir una clave API o Token de Isbue." 
      }, { status: 400 });
    }

    const result = await testIsbueConnection({ apiKey, apiUrl });
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      series: result.series || []
    });
  } catch (error) {
    console.error("Error connecting to Isbue:", error);
    return NextResponse.json({
      success: false,
      error: "Error interno al intentar conectar con Isbue."
    }, { status: 500 });
  }
}
