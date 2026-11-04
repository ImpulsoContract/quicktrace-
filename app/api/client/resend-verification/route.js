import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
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
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: parseInt(session.user.id) },
          { clientProfile: { id: session.user.profileId } }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ 
        success: true, 
        alreadyVerified: true, 
        message: "Tu correo electrónico ya está verificado." 
      });
    }

    // Generar o refrescar token de verificación
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires
      }
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verifica tu cuenta en QuickTrace",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
          <h2 style="color: #426216;">Verificación de tu cuenta QuickTrace</h2>
          <p>Hola ${user.name || ''},</p>
          <p>Has solicitado reenviar el correo de verificación de tu cuenta.</p>
          <p>Para verificar tu dirección de correo electrónico y activar todas las funciones avanzadas (incluido el escaneo de albaranes, lectura de recetas y cálculo de tablas nutricionales con Inteligencia Artificial), haz clic en el siguiente enlace:</p>
          <div style="margin: 2rem 0;">
            <a href="${verificationUrl}" style="background: #426216; color: white; padding: 0.85rem 1.75rem; text-decoration: none; border-radius: 0.5rem; font-weight: bold; display: inline-block;">
              Verificar mi Cuenta
            </a>
          </div>
          <p style="font-size: 0.9rem; color: #64748b;">Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #0284c7; font-size: 0.85rem;">${verificationUrl}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 2rem 0;" />
          <p style="font-size: 0.85rem; color: #94a3b8;">Si no has solicitado este correo, puedes ignorarlo de forma segura.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json({ error: "Error interno al enviar el correo" }, { status: 500 });
  }
}
