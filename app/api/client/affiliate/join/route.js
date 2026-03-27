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

    const userId = Number(session.user.id);
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (clientProfile.isAffiliate) {
      return NextResponse.json({ success: true, message: "Ya eres afiliado" });
    }

    // Generar código de referido único (usando parte del nombre o un random)
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const referralCode = `${clientProfile.businessName?.substring(0, 3).toUpperCase() || 'QT'}${randomSuffix}`;

    await prisma.clientProfile.update({
      where: { id: clientProfile.id },
      data: {
        isAffiliate: true,
        affiliateAcceptedAt: new Date(),
        referralCode: referralCode
      }
    });

    // Enviar email a soporte
    try {
      await sendEmail({
        to: "soporte@quicktrace.es",
        subject: `Nuevo Afiliado: ${clientProfile.businessName}`,
        text: `El usuario ${clientProfile.personName} (${clientProfile.user.email}) de la empresa ${clientProfile.businessName} se ha unido al programa de recomendación.\n\nCódigo de referido: ${referralCode}`,
        html: `
          <h1>Nuevo Alta en Programa de Recomendación</h1>
          <p><strong>Empresa:</strong> ${clientProfile.businessName}</p>
          <p><strong>Usuario:</strong> ${clientProfile.personName} (${clientProfile.user.email})</p>
          <p><strong>Código de referido:</strong> ${referralCode}</p>
          <p>Fecha: ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error("Error sending affiliate notification email:", emailError);
      // No bloqueamos el proceso si falla el email, pero lo logueamos
    }

    return NextResponse.json({ success: true, referralCode });

  } catch (error) {
    console.error("Error joining affiliate:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
