import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { userId: Number(session.user.id) },
      include: {
        user: true,
        plan: true
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const supportEmail = process.env.SUPPORT_ALERT_EMAIL || "soporte@quicktrace.es";

    await sendEmail({
      to: supportEmail,
      subject: `🚀 Solicitud de información Software ERP Completo - ${profile.razonSocial || profile.personName || session.user.email}`,
      html: `
        <div style="font-family: sans-serif; color: #334155; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #426216; margin-top: 0; border-bottom: 2px solid #426216; padding-bottom: 10px;">
            Solicitud para probar el Software ERP Completo
          </h2>
          <p>Un cliente que actualmente está en la <strong>versión sencilla</strong> ha pulsado el botón <em>"Si necesitas un software más completo haz click aquí"</em> en la pantalla de Planes y Precios y ha solicitado que el equipo de ventas le llame e informe para probar el software ERP más completo.</p>
          <h3 style="color: #1e293b; margin-top: 20px;">Datos del cliente:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Empresa / Razón Social:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${profile.razonSocial || "No especificado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Persona de contacto:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${profile.personName || profile.user?.name || "No especificado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${profile.user?.email || session.user.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Teléfono:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${profile.phone || "No especificado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">NIF / CIF:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${profile.nif || "No especificado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Localidad / Provincia:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${[profile.city, profile.province, profile.country].filter(Boolean).join(", ") || "No especificado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Plan actual:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${profile.plan?.name || "Demo"} (${profile.isSimpleVersion ? "Versión Sencilla" : "Versión Completa"})</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Fecha de solicitud:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString("es-ES")}</td>
            </tr>
          </table>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending ERP info request email:", error);
    return NextResponse.json({ error: "Error al enviar la solicitud" }, { status: 500 });
  }
}
