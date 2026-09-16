import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      try {
        const blob = await put(`cutting-labels/${Date.now()}-${file.name || "etiqueta.jpg"}`, file, {
          access: "public",
          token
        });
        return NextResponse.json({ url: blob.url });
      } catch (blobErr) {
        console.warn("Vercel Blob upload failed, falling back to base64 Data URL:", blobErr);
      }
    }

    // Fallback: Convert to Base64 Data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error("Error POST /api/client/cutting-records/upload:", error);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
