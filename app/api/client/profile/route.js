import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profile = await prisma.clientProfile.findUnique({
      where: { id: session.user.profileId },
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
        
        // Si la suscripción ya ha terminado por completo en Stripe ('canceled'), devolver a plan Demo y pedir selección de modo
        if (subscription.status === 'canceled') {
          const demoPlan = await prisma.pricingPlan.findFirst({
            where: { name: { equals: "Demo", mode: "insensitive" } }
          });
          profile = await prisma.clientProfile.update({
            where: { id: profile.id },
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
            },
            data: {
              planId: demoPlan?.id || "1",
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
              stripeCancelAtPeriodEnd: false,
              hasSelectedMode: false,
              hasSeenTutorialVideo: false,
              useLegacyPricing: false,
              demoActivatedAt: null
            }
          });
          console.log(`[Profile Live Sync] Suscripción terminada para ${session.user.email}, devuelto a Demo.`);
        } else {
          // Comprobar si está programada la cancelación al final del periodo
          const isCanceled = Boolean(subscription.cancel_at_period_end);

          const currentStripePriceId = subscription.items?.data?.[0]?.price?.id;

          const dateChanged = profile.stripeCurrentPeriodEnd !== nextRenewalStr;
          const cancelStatusChanged = profile.stripeCancelAtPeriodEnd !== isCanceled;
          const priceChanged = currentStripePriceId && profile.stripePriceId !== currentStripePriceId;

          // Si los datos de Stripe están más actualizados que la base de datos local, sincronizamos de inmediato
          if (dateChanged || cancelStatusChanged || priceChanged) {
            profile = await prisma.clientProfile.update({
              where: { id: profile.id },
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
              },
              data: {
                stripeCancelAtPeriodEnd: isCanceled,
                stripeCurrentPeriodEnd: nextRenewalStr,
                ...(priceChanged ? { stripePriceId: currentStripePriceId } : {})
              }
            });
            console.log(`[Profile Live Sync] Sincronizado estado para el usuario ${session.user.email}.`);
          }
        }
      } catch (stripeErr) {
        console.error("Error comprobando estado en vivo Stripe:", stripeErr);
        // Si hay una caída de red o error de Stripe, permitimos continuar y mostramos el perfil de la BD local antigua por seguridad.
      }
    }

    if ((!profile.planId || profile.planId === "1" || profile.plan?.name?.toLowerCase().includes("demo")) && profile.hasSelectedMode && !profile.demoActivatedAt) {
      profile = await prisma.clientProfile.update({
        where: { id: profile.id },
        data: { demoActivatedAt: new Date() },
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
    }

    const totalElaborations = await prisma.elaboration.count({
      where: { recipe: { clientProfileId: profile.id } }
    });

    // Detect billing cycle
    let billingCycle = null;
    if (profile.plan && profile.stripePriceId) {
      if (profile.stripePriceId === profile.plan.stripePriceIdMonthly) {
        billingCycle = "monthly";
      } else if (
        profile.stripePriceId === profile.plan.stripePriceIdYearly ||
        profile.stripePriceId === profile.plan.stripePriceId
      ) {
        billingCycle = "yearly";
      }
    }

    const { apiKey, apiKeyCreatedAt, ...safeProfile } = profile;
    const emailVerified = profile.user?.emailVerified ?? true;
    const userEmail = profile.user?.email || "";
    const userCreatedAt = profile.user?.createdAt || null;

    return NextResponse.json(
      { 
        ...safeProfile, 
        hasApiKey: !!profile.apiKey, 
        totalElaborations, 
        billingCycle,
        emailVerified,
        userEmail,
        userCreatedAt
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }
    );
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
      merchantTypes,
      currency,
      laborCostHourlyRate,
      isPreparationTimeMandatory,
      lotFormat,
      isSimpleVersion,
      hasSelectedMode,
      hasSeenTutorialVideo,
      hasCuttingTraceability,
      hasOilCollection,
      hasVegetableDisinfection,
      hasWaterSection,
      hasWasteSection,
      blockOutOfStockLots,
      blockOutOfStockGoodsSales,
      goodsLowStockAlertEnabled,
      goodsLowStockThreshold,
      goodsLowStockInApp,
      goodsLowStockEmail,
      holdedApiKey,
      holdedTax,
      holdedSeriesId,
      holdedSeriesName,
      invoicingProvider,
      isbueApiKey,
      isbueApiUrl,
      isbueTax,
      isbueSeriesId,
      isbueSeriesName,
      stelorderApiKey,
      stelorderTax,
      stelorderSeriesId,
      stelorderSeriesName,
      deliveryNotePrefix,
      nextDeliveryNoteNumber
    } = body;

    const whereClause = session.user.profileId
      ? { id: Number(session.user.profileId) }
      : { userId: parseInt(session.user.id) };

    const existingProfile = await prisma.clientProfile.findFirst({
      where: whereClause,
      select: { id: true, demoActivatedAt: true, hasSelectedMode: true }
    });

    const isActivatingMode = Boolean(hasSelectedMode) || isSimpleVersion !== undefined;
    const shouldSetDemoActivatedAt = isActivatingMode && !existingProfile?.demoActivatedAt;

    const updatedProfile = await prisma.clientProfile.update({
      where: whereClause,
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
        currency: currency !== undefined ? currency : undefined,
        laborCostHourlyRate: laborCostHourlyRate !== undefined ? laborCostHourlyRate : undefined,
        isPreparationTimeMandatory: isPreparationTimeMandatory !== undefined ? isPreparationTimeMandatory : undefined,
        lotFormat: lotFormat !== undefined ? lotFormat : undefined,
        isSimpleVersion: isSimpleVersion !== undefined ? Boolean(isSimpleVersion) : undefined,
        hasSelectedMode: hasSelectedMode !== undefined ? Boolean(hasSelectedMode) : (isSimpleVersion !== undefined ? true : undefined),
        hasSeenTutorialVideo: hasSeenTutorialVideo !== undefined ? Boolean(hasSeenTutorialVideo) : undefined,
        ...(shouldSetDemoActivatedAt ? { demoActivatedAt: new Date() } : {}),
        hasCuttingTraceability: hasCuttingTraceability !== undefined ? hasCuttingTraceability : undefined,
        hasOilCollection: hasOilCollection !== undefined ? hasOilCollection : undefined,
        hasVegetableDisinfection: hasVegetableDisinfection !== undefined ? hasVegetableDisinfection : undefined,
        hasWaterSection: hasWaterSection !== undefined ? Boolean(hasWaterSection) : undefined,
        hasWasteSection: hasWasteSection !== undefined ? Boolean(hasWasteSection) : undefined,
        blockOutOfStockLots: blockOutOfStockLots !== undefined ? blockOutOfStockLots : undefined,
        blockOutOfStockGoodsSales: blockOutOfStockGoodsSales !== undefined ? blockOutOfStockGoodsSales : undefined,
        goodsLowStockAlertEnabled: goodsLowStockAlertEnabled !== undefined ? Boolean(goodsLowStockAlertEnabled) : undefined,
        goodsLowStockThreshold: goodsLowStockThreshold !== undefined ? (goodsLowStockThreshold === null || goodsLowStockThreshold === "" ? null : parseFloat(goodsLowStockThreshold)) : undefined,
        goodsLowStockInApp: goodsLowStockInApp !== undefined ? Boolean(goodsLowStockInApp) : undefined,
        goodsLowStockEmail: goodsLowStockEmail !== undefined ? Boolean(goodsLowStockEmail) : undefined,
        holdedApiKey: holdedApiKey !== undefined ? holdedApiKey : undefined,
        holdedTax: holdedTax !== undefined ? (holdedTax === null ? null : parseFloat(holdedTax)) : undefined,
        holdedSeriesId: holdedSeriesId !== undefined ? holdedSeriesId : undefined,
        holdedSeriesName: holdedSeriesName !== undefined ? holdedSeriesName : undefined,
        invoicingProvider: invoicingProvider !== undefined ? invoicingProvider : undefined,
        isbueApiKey: isbueApiKey !== undefined ? isbueApiKey : undefined,
        isbueApiUrl: isbueApiUrl !== undefined ? isbueApiUrl : undefined,
        isbueTax: isbueTax !== undefined ? (isbueTax === null ? null : parseFloat(isbueTax)) : undefined,
        isbueSeriesId: isbueSeriesId !== undefined ? isbueSeriesId : undefined,
        isbueSeriesName: isbueSeriesName !== undefined ? isbueSeriesName : undefined,
        stelorderApiKey: stelorderApiKey !== undefined ? stelorderApiKey : undefined,
        stelorderTax: stelorderTax !== undefined ? (stelorderTax === null ? null : parseFloat(stelorderTax)) : undefined,
        stelorderSeriesId: stelorderSeriesId !== undefined ? stelorderSeriesId : undefined,
        stelorderSeriesName: stelorderSeriesName !== undefined ? stelorderSeriesName : undefined,
        deliveryNotePrefix: deliveryNotePrefix !== undefined ? String(deliveryNotePrefix) : undefined,
        nextDeliveryNoteNumber: nextDeliveryNoteNumber !== undefined ? Math.max(1, parseInt(nextDeliveryNoteNumber, 10) || 1) : undefined
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

    const totalElaborations = await prisma.elaboration.count({
      where: { recipe: { clientProfileId: updatedProfile.id } }
    });

    return NextResponse.json(
      { 
        ...updatedProfile, 
        totalElaborations,
        emailVerified: updatedProfile.user?.emailVerified ?? true,
        userEmail: updatedProfile.user?.email || "",
        userCreatedAt: updatedProfile.user?.createdAt || null
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      }
    );
  } catch (error) {
    console.error("Error updating client profile:", error);
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 });
  }
}
