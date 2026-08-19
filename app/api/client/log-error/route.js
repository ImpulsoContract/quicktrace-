import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { errorName, errorMessage, errorStack, url } = body;

    let userInfoHtml = "";
    if (session && session.user) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { clientProfile: { include: { plan: true } } }
      });

      if (user) {
        userInfoHtml = `
          <h3 style="color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; margin-top: 1.5rem;">Información del Usuario:</h3>
          <ul style="list-style-type: none; padding-left: 0; line-height: 1.6;">
            <li><strong>ID de Usuario:</strong> ${user.id}</li>
            <li><strong>Nombre:</strong> ${user.name || "N/A"}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Rol:</strong> ${user.role}</li>
            <li><strong>Razón Social:</strong> ${user.clientProfile?.razonSocial || "N/A"}</li>
            <li><strong>Plan Actual:</strong> ${user.clientProfile?.plan?.name || "Sin Plan"}</li>
          </ul>
        `;
      } else {
        userInfoHtml = `
          <h3 style="color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; margin-top: 1.5rem;">Información del Usuario (Sesión):</h3>
          <ul style="list-style-type: none; padding-left: 0; line-height: 1.6;">
            <li><strong>ID de Usuario:</strong> ${session.user.id}</li>
            <li><strong>Email:</strong> ${session.user.email || "N/A"}</li>
            <li><strong>Nombre:</strong> ${session.user.name || "N/A"}</li>
          </ul>
        `;
      }
    } else {
      userInfoHtml = `<p style="color: #ef4444; font-weight: bold; margin-top: 1.5rem;">Usuario: No autenticado (Sesión no encontrada)</p>`;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 0.5rem;">Reporte de Error de Cliente - QuickTrace</h2>
        <p>Se ha producido un error inesperado en la interfaz del cliente.</p>
        
        <h3 style="color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; margin-top: 1.5rem;">Detalles del Error:</h3>
        <ul style="list-style-type: none; padding-left: 0; line-height: 1.6;">
          <li><strong>Tipo de Error:</strong> <span style="color: #dc2626; font-family: monospace;">${errorName || "Desconocido"}</span></li>
          <li><strong>Mensaje de Error:</strong> <span style="color: #b91c1c; font-weight: bold;">${errorMessage || "Sin mensaje"}</span></li>
          <li><strong>URL de Origen:</strong> <a href="${url || '#'}" target="_blank">${url || "Desconocida"}</a></li>
          <li><strong>Fecha/Hora:</strong> ${new Date().toLocaleString()} (UTC)</li>
        </ul>

        ${userInfoHtml}

        <h3 style="color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; margin-top: 1.5rem;">Pila de Llamadas (Stack Trace):</h3>
        <pre style="background: #f3f4f6; padding: 15px; border-radius: 6px; overflow-x: auto; font-family: 'Courier New', Courier, monospace; font-size: 13px; border: 1px solid #e5e7eb; color: #374151; white-space: pre-wrap; word-break: break-all;">${errorStack || "Sin stack trace"}</pre>
      </div>
    `;

    const textContent = `
      Reporte de Error de Cliente - QuickTrace
      ----------------------------------------
      Tipo de Error: ${errorName || "Desconocido"}
      Mensaje: ${errorMessage || "Sin mensaje"}
      URL: ${url || "Desconocida"}
      Fecha/Hora: ${new Date().toISOString()}

      Usuario ID: ${session?.user?.id || "N/A"}
      Email: ${session?.user?.email || "N/A"}
      
      Stack Trace:
      ${errorStack || "Sin stack trace"}
    `;

    await sendEmail({
      to: "soporte@quicktrace.es",
      subject: `[ERROR CLIENTE] ${errorName || "Error"}: ${errorMessage || "Sin mensaje"}`,
      html: htmlContent,
      text: textContent
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging error API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
