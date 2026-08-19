import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Check if permission is needed for workers
  if (session.user.role === "WORKER" && !session.user.permissions?.hasCleaning) {
    return NextResponse.json({ error: "No tienes permiso para acceder a fichas técnicas" }, { status: 403 });
  }

  try {
    // Verify Vercel Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ 
        error: "Falta configurar la variable de entorno BLOB_READ_WRITE_TOKEN. Asegúrate de conectar tu base de datos Vercel Blob en el panel de Vercel y sincronizar las variables locales." 
      }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo en el formulario" }, { status: 400 });
    }

    // Upload to Vercel Blob using the SDK
    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Error in upload API:", error);
    return NextResponse.json({ 
      error: "Error al subir el archivo", 
      details: error.message 
    }, { status: 500 });
  }
}
