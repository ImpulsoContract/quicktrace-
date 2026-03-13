import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";
import { sendMetaConversionEvent } from "@/lib/meta";
import { createClientifyContact } from "@/lib/clientify";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    const { name, email, razonSocial, phone } = await req.json();
    const headersList = headers();

    if (!name || !email || !razonSocial || !phone) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este email ya está en uso" }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user and profile in a transaction
    await prisma.$transaction(async (tx) => {
      // Find the "Demo" plan
      const demoPlan = await tx.pricingPlan.findFirst({
        where: {
          name: {
            contains: 'Demo',
            mode: 'insensitive'
          }
        }
      });

      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name,
          password: "", // Temporary empty password
          role: "CLIENT",
          verificationToken,
          verificationTokenExpires,
          emailVerified: false
        }
      });

      await tx.clientProfile.create({
        data: {
          userId: user.id,
          razonSocial,
          phone,
          nif: "", 
          planId: demoPlan ? demoPlan.id : undefined,
          accountType: demoPlan ? demoPlan.name : "DEMO",
          recetasContratadas: demoPlan ? (demoPlan.recipesLimit || 0) : 3,
          canManageRecipes: true
        }
      });
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: normalizedEmail,
      subject: "Verifica tu cuenta en QuickTrace",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
          <h2 style="color: #426216;">¡Bienvenido a QuickTrace!</h2>
          <p>Hola ${name},</p>
          <p>Gracias por registrarte. Para completar tu cuenta y establecer tu contraseña, haz clic en el siguiente botón:</p>
          <div style="margin: 2rem 0;">
            <a href="${verificationUrl}" style="background: #426216; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: bold; display: inline-block;">
              Verificar Email y Configurar Contraseña
            </a>
          </div>
          <p>Este enlace caducará en 24 horas.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 2rem 0;" />
          <p style="font-size: 0.85rem; color: #94a3b8;">Si no has solicitado este registro, puedes ignorar este correo.</p>
        </div>
      `
    });

    // Report to Meta Conversions API (CAPI)
    try {
      sendMetaConversionEvent({
        eventName: 'CompleteRegistration',
        email: normalizedEmail,
        phone: phone,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        url: `${process.env.NEXTAUTH_URL}/register`,
        clientIpAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip'),
        clientUserAgent: headersList.get('user-agent')
      });
    } catch (metaErr) {
      console.error('[Meta CAPI] Error:', metaErr);
    }

    // Report to Clientify CRM
    try {
      createClientifyContact({
        email: normalizedEmail,
        name: name,
        phone: phone,
        razonSocial: razonSocial
      });
    } catch (crmErr) {
      console.error('[Clientify Sync] Error:', crmErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
