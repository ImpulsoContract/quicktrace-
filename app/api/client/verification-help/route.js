import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { id: session.user.profileId },
      include: { user: true }
    });

    if (!profile || !profile.user) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const userEmail = profile.user.email;
    const userName = profile.personName || profile.user.name || "No especificado";
    const userCompany = profile.razonSocial || "No especificado";
    const userPhone = profile.phone || "No especificado";
    const regDate = profile.user.createdAt ? new Date(profile.user.createdAt).toLocaleString("es-ES") : "Desconocida";

    await sendEmail({
      to: "soporte@quicktrace.es",
      subject: `⚠️ [Ayuda Verificación] Cliente no recibe email de verificación - ${userCompany}`,
      html: `
        <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 0.5rem;">
            Problema al recibir email de verificación
          </h2>
          <p>El siguiente usuario ha indicado que <strong>no logra recibir el correo de verificación</strong> y solicita que el equipo de soporte se ponga en contacto con él:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Empresa:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${userCompany}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Contacto:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${userName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #0284c7; font-weight: bold;">${userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Teléfono:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${userPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Fecha Registro:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${regDate}</td>
            </tr>
          </table>
          <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #64748b;">
            Por favor, contacta con este cliente para confirmar si su correo es correcto o asistirlo en la verificación manual de su cuenta.
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification help email:", error);
    return NextResponse.json({ error: "Error interno al enviar la solicitud" }, { status: 500 });
  }
}
