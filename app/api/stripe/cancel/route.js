import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe connection error" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: Number(session.user.id) },
      include: { user: true }
    });

    if (!clientProfile || !clientProfile.stripeSubscriptionId) {
      return NextResponse.json({ error: "No se encontró una suscripción activa" }, { status: 404 });
    }

    // Cancelar la suscripción al final del periodo
    await stripe.subscriptions.update(clientProfile.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Enviar email a Fernando
    try {
      await sendEmail({
        to: "fernando@quicktrace.es",
        subject: `Cancelación de Suscripción - ${clientProfile.razonSocial}`,
        html: `
          <h1>Aviso de Cancelación</h1>
          <p>El cliente <strong>${clientProfile.razonSocial}</strong> (${clientProfile.user.email}) ha solicitado la cancelación de su suscripción.</p>
          <p>La suscripción continuará activa hasta el final del periodo contratado.</p>
          <hr />
          <p><strong>Datos del Cliente:</strong></p>
          <ul>
            <li>Nombre Responsable: ${clientProfile.personName || 'No indicado'}</li>
            <li>Teléfono: ${clientProfile.phone || 'No indicado'}</li>
            <li>ID Suscripción Stripe: ${clientProfile.stripeSubscriptionId}</li>
          </ul>
        `
      });
    } catch (emailError) {
      console.error("Error sending cancellation email:", emailError);
      // No bloqueamos la respuesta al cliente por un error de envío de email administrativo
    }

    return NextResponse.json({ success: true, message: "Suscripción cancelada correctamente al final del periodo." });

  } catch (error) {
    console.error("Stripe Cancellation Error:", error);
    return NextResponse.json({ 
      error: "Error al cancelar la suscripción",
      details: error.message 
    }, { status: 500 });
  }
}
