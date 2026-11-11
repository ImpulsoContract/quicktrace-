import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

function getOrdinalTextEs(count) {
  const map = {
    1: "Primera vez (1ª reactivación)",
    2: "Segunda vez (2ª reactivación)",
    3: "Tercera vez (3ª reactivación)",
    4: "Cuarta vez (4ª reactivación)",
    5: "Quinta vez (5ª reactivación)",
    6: "Sexta vez (6ª reactivación)",
    7: "Séptima vez (7ª reactivación)",
    8: "Octava vez (8ª reactivación)",
    9: "Novena vez (9ª reactivación)",
    10: "Décima vez (10ª reactivación)"
  };
  return map[count] || `Reactivación número ${count} (${count}ª vez)`;
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const whereClause = session.user.profileId
      ? { id: Number(session.user.profileId) }
      : { userId: Number(session.user.id) };

    const profile = await prisma.clientProfile.findFirst({
      where: whereClause,
      include: {
        user: true,
        plan: true
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const nextCount = (profile.demoReactivationCount || 0) + 1;
    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);

    const updatedProfile = await prisma.clientProfile.update({
      where: { id: profile.id },
      data: {
        demoActivatedAt: now,
        demoReactivationCount: nextCount,
        hasSelectedMode: true
      },
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
            createdAt: true
          }
        }
      }
    });

    const ordinalText = getOrdinalTextEs(nextCount);
    const clientEmail = profile.user?.email || session.user.email || "No especificado";
    const clientName = profile.personName || profile.user?.name || session.user.name || "No especificado";
    const companyName = profile.razonSocial || "No especificada";
    const phone = profile.phone || "No especificado";
    const nif = profile.nif || "No especificado";
    const modeLabel = profile.isSimpleVersion ? "Versión Sencilla" : "Versión ERP Completa";

    try {
      await sendEmail({
        to: "soporte@quicktrace.es",
        subject: `🔄 [Demo Reactivada - ${nextCount}ª vez] ${companyName} (${clientName})`,
        html: `
          <div style="font-family: sans-serif; color: #334155; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
            <h2 style="color: #426216; border-bottom: 2px solid #426216; padding-bottom: 8px; margin-top: 0;">
              Reactivación de Versión Demo por 20 días más
            </h2>
            <p>Un cliente ha finalizado sus días de prueba y ha reactivado su <strong>Versión Demo por 20 días adicionales</strong>.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 16px 0;">
              <p style="margin: 0; font-size: 15px; color: #166534;">
                <strong>Veces que ha reactivado la Demo:</strong> ${ordinalText} (Total reactivaciones: <strong>${nextCount}</strong>)
              </p>
            </div>
            <h3 style="color: #1e293b; margin-top: 20px; margin-bottom: 10px;">Datos del cliente:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 38%;">Empresa / Razón Social:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${companyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Persona de Contacto:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${clientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${clientEmail}">${clientEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Teléfono:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">NIF / CIF:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${nif}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Modo de uso activo:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${modeLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Fecha de reactivación:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${now.toLocaleString("es-ES")}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Nueva fecha fin de Demo (20 días):</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${newExpiresAt.toLocaleDateString("es-ES")}</td>
              </tr>
            </table>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Error enviando email de reactivación de demo a soporte:", mailError);
    }

    const totalElaborations = await prisma.elaboration.count({
      where: { recipe: { clientProfileId: updatedProfile.id } }
    });

    const { apiKey, apiKeyCreatedAt, ...safeProfile } = updatedProfile;

    return NextResponse.json(
      {
        ...safeProfile,
        hasApiKey: !!updatedProfile.apiKey,
        totalElaborations,
        emailVerified: updatedProfile.user?.emailVerified ?? true,
        userEmail: updatedProfile.user?.email || "",
        userCreatedAt: updatedProfile.user?.createdAt || null
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      }
    );
  } catch (error) {
    console.error("Error reactivating demo:", error);
    return NextResponse.json({ error: "Error al reactivar la demo" }, { status: 500 });
  }
}
