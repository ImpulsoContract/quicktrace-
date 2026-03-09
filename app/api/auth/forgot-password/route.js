import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "El email es obligatorio" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ success: true });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken,
        resetPasswordExpires
      }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordToken}`;

    await sendEmail({
      to: email,
      subject: "Restablece tu contraseña en QuickTrace",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
          <h2 style="color: #426216;">Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para elegir una nueva:</p>
          <div style="margin: 2rem 0;">
            <a href="${resetUrl}" style="background: #426216; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: bold; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p>Este enlace caducará en 1 hora.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 2rem 0;" />
          <p style="font-size: 0.85rem; color: #94a3b8;">Si no has solicitado este cambio, puedes ignorar este correo de forma segura.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
