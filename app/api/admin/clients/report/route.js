import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // 1. Fetch all clients with their profile, plan, payments and basic counts
    const users = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        lastLogin: true,
        clientProfile: {
          select: {
            id: true,
            razonSocial: true,
            nif: true,
            phone: true,
            country: true,
            origin: true,
            utmSource: true,
            utmMedium: true,
            utmCampaign: true,
            utmContent: true,
            utmTerm: true,
            accountType: true,
            planId: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            stripeCancelAtPeriodEnd: true,
            createdAt: true,
            updatedAt: true,
            plan: {
              select: {
                id: true,
                name: true,
                priceMonthly: true,
                priceYearly: true,
                stripePriceIdMonthly: true,
                stripePriceIdYearly: true,
                stripePriceId: true,
              }
            },
            payments: {
              select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
              },
              orderBy: { createdAt: 'asc' }
            },
            _count: {
              select: {
                recipes: true,
                goodsReceipts: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Fetch elaborations count per client profile in a fast raw aggregate
    const elabMap = {};
    try {
      const elabCounts = await prisma.$queryRaw`
        SELECT r."clientProfileId", COUNT(e.id)::int as count
        FROM "Elaboration" e
        JOIN "Recipe" r ON e."recipeId" = r.id
        WHERE r."clientProfileId" IS NOT NULL
        GROUP BY r."clientProfileId"
      `;
      if (Array.isArray(elabCounts)) {
        elabCounts.forEach(row => {
          if (row.clientProfileId) {
            elabMap[row.clientProfileId] = Number(row.count) || 0;
          }
        });
      }
    } catch (err) {
      console.error("[Admin Clients Report] Error querying elaboration counts:", err);
    }

    const now = new Date();

    // 3. Map into the specific format requested
    const reportData = users.map(user => {
      const profile = user.clientProfile;
      const plan = profile?.plan;

      // ID Empresa
      const companyId = profile?.id ?? "";
      const companyName = profile?.razonSocial || user.name || "";
      const nif = profile?.nif || "";

      // Fecha de registro
      const registrationDate = user.createdAt ? user.createdAt.toISOString() : "";

      // País de procedencia
      const country = profile?.country && profile.country.trim() !== "" ? profile.country.trim() : "";

      // Plan actual: gratuito, Básico, Premium o Gold
      let planName = "";
      if (plan?.name) {
        if (plan.name.toLowerCase() === "demo") {
          planName = "Gratuito";
        } else {
          planName = plan.name;
        }
      } else if (profile?.accountType === "DEMO") {
        planName = "Gratuito";
      } else {
        planName = "";
      }

      // Tipo de contratación: mensual o anual
      let billingType = "";
      if (profile?.stripePriceId) {
        if (plan?.stripePriceIdMonthly && profile.stripePriceId === plan.stripePriceIdMonthly) {
          billingType = "Mensual";
        } else if ((plan?.stripePriceIdYearly && profile.stripePriceId === plan.stripePriceIdYearly) || 
                   (plan?.stripePriceId && profile.stripePriceId === plan.stripePriceId)) {
          billingType = "Anual";
        } else if (profile.stripeCurrentPeriodEnd) {
          // Si el periodo final es a más de 60 días, suele ser anual
          try {
            const endD = new Date(profile.stripeCurrentPeriodEnd);
            const startD = profile.createdAt ? new Date(profile.createdAt) : now;
            const diffDays = (endD.getTime() - startD.getTime()) / (1000 * 3600 * 24);
            billingType = diffDays > 60 ? "Anual" : "Mensual";
          } catch {
            billingType = "";
          }
        }
      }

      // Estado: activo, cancelado o impagado
      let status = "Activo";
      let cancellationDate = "";

      const hasUnpaidPayment = profile?.payments?.some(p => p.status === 'unpaid' || p.status === 'past_due' || p.status === 'failed');
      if (hasUnpaidPayment) {
        status = "Impagado";
      } else if (profile?.stripeCancelAtPeriodEnd) {
        status = "Cancelado";
        if (profile.stripeCurrentPeriodEnd) {
          cancellationDate = profile.stripeCurrentPeriodEnd;
        }
      } else if (profile?.stripeCurrentPeriodEnd && new Date(profile.stripeCurrentPeriodEnd) < now && profile.stripeSubscriptionId) {
        status = "Cancelado";
        cancellationDate = profile.stripeCurrentPeriodEnd;
      } else {
        status = "Activo";
      }

      // Fecha de primera contratación y cambios de plan
      let contractDate = "";
      let planChanges = "";

      if (profile?.payments && profile.payments.length > 0) {
        contractDate = profile.payments[0].createdAt.toISOString();
        if (profile.payments.length > 1) {
          // Verificar si ha habido cambios de importe o plan
          const amounts = Array.from(new Set(profile.payments.map(p => p.amount)));
          if (amounts.length > 1) {
            planChanges = `${profile.payments.length} renovaciones/cambios`;
          }
        }
      } else if (profile?.stripeSubscriptionId && profile?.stripeCurrentPeriodEnd) {
        // Si tiene suscripción Stripe activa pero no pagos locales
        try {
          const endD = new Date(profile.stripeCurrentPeriodEnd);
          if (billingType === "Anual") {
            const approxStart = new Date(endD);
            approxStart.setFullYear(approxStart.getFullYear() - 1);
            contractDate = approxStart.toISOString();
          } else if (billingType === "Mensual") {
            const approxStart = new Date(endD);
            approxStart.setMonth(approxStart.getMonth() - 1);
            contractDate = approxStart.toISOString();
          } else {
            contractDate = profile.createdAt ? profile.createdAt.toISOString() : "";
          }
        } catch {
          contractDate = profile.createdAt ? profile.createdAt.toISOString() : "";
        }
      }

      // Origen del registro, si lo conocéis
      let origin = "";
      if (profile?.origin && profile.origin.trim() !== "") {
        origin = profile.origin.trim().toUpperCase();
        if (profile.utmCampaign && profile.utmCampaign.trim() !== "") {
          origin += ` (${profile.utmCampaign.trim()})`;
        } else if (profile.utmSource && profile.utmSource.trim() !== "" && profile.utmSource.trim().toUpperCase() !== origin) {
          origin += ` (${profile.utmSource.trim()})`;
        }
      }

      // Número de recetas, elaboraciones y entradas de mercancía
      const recipesCount = profile?._count?.recipes || 0;
      const elaborationsCount = profile?.id ? (elabMap[profile.id] || 0) : 0;
      const goodsReceiptsCount = profile?._count?.goodsReceipts || 0;

      // Fecha del último uso de la aplicación
      const lastLogin = user.lastLogin ? user.lastLogin.toISOString() : "";

      return {
        userId: user.id,
        companyId,
        companyName,
        nif,
        email: user.email,
        registrationDate,
        country,
        planName,
        contractDate,
        planChanges,
        billingType,
        status,
        cancellationDate,
        origin,
        recipesCount,
        elaborationsCount,
        goodsReceiptsCount,
        lastLogin
      };
    });

    return NextResponse.json({
      success: true,
      data: reportData,
      total: reportData.length
    });

  } catch (error) {
    console.error("[Admin Clients Report Error]:", error);
    return NextResponse.json({ error: error.message || "Error al generar informe de clientes" }, { status: 500 });
  }
}
