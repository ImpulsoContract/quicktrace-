import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const message = body?.message?.trim();
    if (!message) {
      return NextResponse.json(
        { error: "Por favor, introduce la información de tu programa." },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);
    let clientProfile = null;
    if (userId) {
      clientProfile = await prisma.clientProfile.findUnique({
        where: { userId },
        include: { user: true }
      });
    }

    const userEmail = session.user.email || clientProfile?.user?.email || "Sin email";
    const userName = clientProfile?.personName || session.user.name || "Sin nombre";
    const razonSocial = clientProfile?.razonSocial || "No especificada";
    const nif = clientProfile?.nif || "No especificado";
    const phone = clientProfile?.phone || "No especificado";
    const nowStr = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #426216; padding: 20px; color: white;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Nueva solicitud de integración de facturación</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Recibida desde el panel de QuickTrace</p>
        </div>
        <div style="padding: 24px; background: white;">
          <p style="font-size: 15px; margin-top: 0;">Un cliente solicita la integración de su software de facturación con QuickTrace:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; font-size: 14px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 35%; color: #475569;">Empresa / Razón Social:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;">${razonSocial}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">NIF / CIF:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${nif}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Contacto:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${userName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${userEmail}" style="color: #426216; text-decoration: underline;">${userEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Teléfono:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">ID de Usuario:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${userId || session.user.id}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Fecha y hora:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${nowStr}</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; padding: 16px 20px; border-radius: 8px; border: 1.5px solid #cbd5e1;">
            <h4 style="margin: 0 0 10px 0; color: #426216; font-size: 15px;">Información indicada por el usuario:</h4>
            <div style="white-space: pre-wrap; font-size: 14px; color: #0f172a; line-height: 1.6; background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">${message}</div>
          </div>
        </div>
      </div>
    `;

    const emailText = `
Nueva solicitud de integración de programa de facturación en QuickTrace:

Empresa / Razón Social: ${razonSocial}
NIF / CIF: ${nif}
Contacto: ${userName}
Email: ${userEmail}
Teléfono: ${phone}
ID de Usuario: ${userId || session.user.id}
Fecha y hora: ${nowStr}

Información indicada por el usuario:
${message}
    `.trim();

    const emailResult = await sendEmail({
      to: "fernando@quicktrace.es",
      subject: `Solicitud de integración facturación: ${razonSocial} (${userName})`,
      html: emailHtml,
      text: emailText
    });

    if (!emailResult.success) {
      console.error("Failed to send integration request email:", emailResult.error);
      return NextResponse.json(
        { error: "Error al enviar el email. Inténtalo de nuevo más tarde." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Solicitud enviada correctamente"
    });
  } catch (err) {
    console.error("Error in invoicing-integration-request route:", err);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud" },
      { status: 500 }
    );
  }
}
