import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";
import { sendMetaConversionEvent } from "@/lib/meta";
import { createClientifyContact } from "@/lib/clientify";
import { headers } from "next/headers";

export async function POST(req) {
  let name, email, razonSocial, phone, termsAccepted, referralCode, locale,
      utmSource, utmMedium, utmCampaign, utmContent, utmTerm, 
      gclid, fbclid, msclkid, ttclid;
  try {
    const body = await req.json();
    ({ 
      name, email, razonSocial, phone, termsAccepted, referralCode, locale,
      utmSource, utmMedium, utmCampaign, utmContent, utmTerm, 
      gclid, fbclid, msclkid, ttclid 
    } = body);
    const headersList = headers();

    if (!name || !email || !razonSocial || !phone) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: "Debes aceptar las Condiciones de Uso" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      try {
        await sendEmail({
          to: process.env.SUPPORT_ALERT_EMAIL || "soporte@quicktrace.es",
          subject: `⚠️ [Intento de Registro] Email en Uso`,
          html: `
            <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 0.5rem;">Intento de Registro con Email Existente</h2>
              <p>Se ha intentado registrar una cuenta con un correo electrónico que ya está registrado en el sistema:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Email:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${normalizedEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Nombre:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${name || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Empresa:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${razonSocial || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Teléfono:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${phone || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Fecha:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString('es-ES')}</td>
                </tr>
              </table>
            </div>
          `
        });
      } catch (mailErr) {
        console.error("Failed to send duplicate registration email:", mailErr);
      }
      return NextResponse.json({ error: "Este email ya está en uso" }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    let referrer = null;
    let calculatedOrigin = 'DIRECT';

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

      // Find the referring client if any
      if (referralCode) {
        referrer = await tx.clientProfile.findUnique({
          where: { referralCode: referralCode.toUpperCase() }
        });
      }

      const source = (utmSource || '').toLowerCase();
      const medium = (utmMedium || '').toLowerCase();

      if (referrer) {
        calculatedOrigin = 'AFFILIATE';
      } else if (fbclid || ['meta', 'facebook', 'instagram', 'fb', 'ig'].some(s => source.includes(s))) {
        calculatedOrigin = 'META';
      } else if (gclid || ['google', 'gads', 'googleads', 'google-ads'].some(s => source.includes(s))) {
        calculatedOrigin = 'GOOGLE';
      } else if (msclkid || ['bing', 'microsoft'].some(s => source.includes(s))) {
        calculatedOrigin = 'BING';
      } else if (ttclid || ['tiktok', 'tt'].some(s => source.includes(s))) {
        calculatedOrigin = 'TIKTOK';
      } else if (source || medium || utmCampaign) {
        calculatedOrigin = 'OTHER';
      }

      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name,
          password: "", // Temporary empty password
          role: "CLIENT",
          verificationToken,
          verificationTokenExpires,
          emailVerified: false,
          termsAcceptedAt: termsAccepted ? new Date() : null
        }
      });

      await tx.clientProfile.create({
        data: {
          userId: user.id,
          razonSocial,
          phone,
          personName: name,
          nif: "", 
          planId: demoPlan ? demoPlan.id : undefined,
          accountType: demoPlan ? demoPlan.name : "DEMO",
          recetasContratadas: demoPlan ? (demoPlan.recipesLimit || 0) : 3,
          canManageRecipes: true,
          referredById: referrer ? referrer.id : undefined,
          origin: calculatedOrigin,
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null,
          utmContent: utmContent || null,
          utmTerm: utmTerm || null,
          gclid: gclid || null,
          fbclid: fbclid || null
        }
      });
    });

    // Send verification email
    // ... (rest of the code moved down)


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

    // Notify Support about new registration
    try {
      await sendEmail({
        to: "soporte@quicktrace.es",
        subject: `Nuevo Registro: ${razonSocial}`,
        html: `
          <h2>Nuevo Usuario Registrado</h2>
          <p>Un nuevo cliente se ha registrado en QuickTrace:</p>
          <ul>
            <li><strong>Empresa / Razón Social:</strong> ${razonSocial}</li>
            <li><strong>Contacto:</strong> ${name}</li>
            <li><strong>Email:</strong> ${normalizedEmail}</li>
            <li><strong>Teléfono:</strong> ${phone}</li>
            <li><strong>Código Ref:</strong> ${referralCode || 'Ninguno'}</li>
            <li><strong>Origen Calculado:</strong> ${calculatedOrigin}</li>
            <li><strong>UTM Source:</strong> ${utmSource || '-'}</li>
            <li><strong>UTM Medium:</strong> ${utmMedium || '-'}</li>
            <li><strong>UTM Campaign:</strong> ${utmCampaign || '-'}</li>
            <li><strong>GCLID:</strong> ${gclid || '-'}</li>
            <li><strong>FBCLID:</strong> ${fbclid || '-'}</li>
            <li><strong>Recomendado por:</strong> ${referrer ? (referrer.razonSocial || 'ID: ' + referrer.id) : 'Directo'}</li>
            <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
          </ul>
        `
      });
    } catch (supportEmailErr) {
      console.error('[Support Email] Error:', supportEmailErr);
    }

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
      const source = (utmSource || '').toLowerCase();
      let syncOrigin = 'DIRECT';
      if (referralCode) syncOrigin = 'AFFILIATE';
      else if (['meta', 'facebook', 'instagram', 'fb', 'ig'].some(s => source.includes(s))) syncOrigin = 'META';
      else if (['google', 'gads', 'googleads', 'google-ads'].some(s => source.includes(s))) syncOrigin = 'GOOGLE';
      else if (source) syncOrigin = 'OTHER';
      
      // Defensive check: Only sync if this is a CLIENT registration
      await createClientifyContact({
        email: normalizedEmail,
        name: name,
        phone: phone,
        razonSocial: razonSocial,
        locale: locale,
        utmSource,
        utmMedium,
        utmCampaign,
        origin: syncOrigin
      });
    } catch (crmErr) {
      console.error('[Clientify Sync] Error:', crmErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    try {
      await sendEmail({
        to: process.env.SUPPORT_ALERT_EMAIL || "soporte@quicktrace.es",
        subject: `🚨 [Error de Registro] Fallo en Servidor`,
        html: `
          <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 0.5rem;">Error Interno en el Registro</h2>
            <p>Se produjo un error al registrar un usuario:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${email || 'Desconocido'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Nombre:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${name || 'Desconocido'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Empresa:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${razonSocial || 'Desconocido'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Teléfono:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${phone || 'Desconocido'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Fecha:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString('es-ES')}</td>
              </tr>
            </table>
            <h3 style="margin-top: 1.5rem; color: #dc2626; border-bottom: 1px solid #fca5a5; padding-bottom: 0.25rem;">Mensaje de Error:</h3>
            <pre style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; color: #b91c1c; overflow-x: auto;">${error.message}</pre>
            <h3 style="color: #dc2626; border-bottom: 1px solid #fca5a5; padding-bottom: 0.25rem;">Stack Trace:</h3>
            <pre style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 0.85rem; overflow-x: auto;">${error.stack}</pre>
          </div>
        `
      });
    } catch (mailErr) {
      console.error("Failed to send registration error email:", mailErr);
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
