import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profile = await prisma.clientProfile.findUnique({
      where: { id: session.user.profileId },
      include: { plan: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Comprobación en vivo con Stripe
    if (profile.stripeSubscriptionId && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const subscription = await stripe.subscriptions.retrieve(profile.stripeSubscriptionId);
        
        let stripeDate = subscription.current_period_end;
        if (!stripeDate && subscription.items?.data?.[0]?.current_period_end) {
          stripeDate = subscription.items.data[0].current_period_end;
        }
        const nextRenewalStr = stripeDate ? new Date(stripeDate * 1000).toISOString() : null;
        
        // Comprobar si está cancelada y al final del periodo o cancelada directamente
        const isCanceled = subscription.cancel_at_period_end || subscription.status === 'canceled';

        const dateChanged = profile.stripeCurrentPeriodEnd !== nextRenewalStr;
        const cancelStatusChanged = profile.stripeCancelAtPeriodEnd !== isCanceled;

        // Si los datos de Stripe están más actualizados que la base de datos local, sincronizamos de inmediato
        if (dateChanged || cancelStatusChanged) {
          profile = await prisma.clientProfile.update({
            where: { id: profile.id },
            include: { plan: true },
            data: {
              stripeCancelAtPeriodEnd: isCanceled,
              stripeCurrentPeriodEnd: nextRenewalStr
            }
          });
          console.log(`[Profile Live Sync] Sincronizado estado de cancelación para el usuario ${session.user.email}.`);
        }
      } catch (stripeErr) {
        console.error("Error comprobando estado en vivo Stripe:", stripeErr);
        // Si hay una caída de red o error de Stripe, permitimos continuar y mostramos el perfil de la BD local antigua por seguridad.
      }
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching client profile:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      personName, 
      razonSocial, 
      nif, 
      phone,
      address,
      postalCode,
      city,
      province,
      country,
      labelConfig,
      merchantTypes
    } = body;

    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: parseInt(session.user.id) },
      data: {
        personName: personName !== undefined ? personName : undefined,
        razonSocial: razonSocial !== undefined ? razonSocial : undefined,
        nif: nif !== undefined ? nif : undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        postalCode: postalCode !== undefined ? postalCode : undefined,
        city: city !== undefined ? city : undefined,
        province: province !== undefined ? province : undefined,
        country: country !== undefined ? country : undefined,
        labelConfig: labelConfig !== undefined ? labelConfig : undefined,
        merchantTypes: merchantTypes !== undefined ? merchantTypes : undefined,
      },
      include: { plan: true }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating client profile:", error);
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
  }
}
