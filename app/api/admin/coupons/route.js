import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const coupons = await prisma.discountCoupon.findMany({
      include: {
        plans: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Error al cargar los cupones" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { code, percentage, duration, durationInMonths, planIds } = body;

    if (!code || !percentage || !duration) {
      return NextResponse.json({ error: "Faltan datos requeridos (código, porcentaje, duración)" }, { status: 400 });
    }

    if (percentage <= 0 || percentage > 100) {
      return NextResponse.json({ error: "El porcentaje debe estar entre 1 y 100" }, { status: 400 });
    }

    // Check if code already exists in our DB
    const existing = await prisma.discountCoupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: "Ese código promocional ya existe en la plataforma" }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Falta configuración de Stripe" }, { status: 500 });
    }
    const stripe = new Stripe(stripeKey);

    // Get Target Products for Stripe constraints
    const eligibleProducts = new Set();
    
    if (planIds && planIds.length > 0) {
      const plans = await prisma.pricingPlan.findMany({
        where: { id: { in: planIds } },
        select: { stripePriceIdMonthly: true, stripePriceIdYearly: true, stripePriceId: true }
      });

      for (const plan of plans) {
        // Collect all distinct price IDs
        const priceIds = [plan.stripePriceIdMonthly, plan.stripePriceIdYearly, plan.stripePriceId].filter(Boolean);
        for (const pid of priceIds) {
          try {
             // Retrieve the Price object from Stripe to determine the Product ID
             const priceObj = await stripe.prices.retrieve(pid);
             if (priceObj && priceObj.product) {
               eligibleProducts.add(typeof priceObj.product === 'string' ? priceObj.product : priceObj.product.id);
             }
          } catch (e) {
             console.error(`Failed to retrieve price ${pid} from Stripe`, e);
          }
        }
      }
    }

    const appliesToProducts = Array.from(eligibleProducts);
    
    // 1. Create Coupon in Stripe
    const stripeCouponObj = {
      name: `Descuento ${percentage}% - ${code.toUpperCase()}`,
      percent_off: parseInt(percentage),
      duration: duration.toLowerCase() // "once", "repeating", "forever"
    };

    if (stripeCouponObj.duration === "repeating" && durationInMonths) {
      stripeCouponObj.duration_in_months = parseInt(durationInMonths);
    }

    if (appliesToProducts.length > 0) {
      stripeCouponObj.applies_to = { products: appliesToProducts };
    }

    let stripeCoupon;
    try {
      stripeCoupon = await stripe.coupons.create(stripeCouponObj);
    } catch (e) {
      return NextResponse.json({ error: `Error creando cupón en Stripe: ${e.message}` }, { status: 400 });
    }

    // 2. Create Promotion Code in Stripe attached to the newly created Coupon
    let stripePromoCode;
    try {
      stripePromoCode = await stripe.promotionCodes.create({
        coupon: stripeCoupon.id,
        code: code.toUpperCase(),
        active: true
      });
    } catch (e) {
      // Rollback coupon creation if promocode fails
      await stripe.coupons.del(stripeCoupon.id).catch(() => {});
      return NextResponse.json({ error: `Error creando código en Stripe: ${e.message}` }, { status: 400 });
    }

    // 3. Save to Prisma
    const newDbCoupon = await prisma.discountCoupon.create({
      data: {
        code: code.toUpperCase(),
        percentage: parseInt(percentage),
        duration: duration.toUpperCase(),
        durationInMonths: durationInMonths ? parseInt(durationInMonths) : null,
        stripeCouponId: stripeCoupon.id,
        stripePromoCodeId: stripePromoCode.id,
        active: true,
        plans: planIds && planIds.length > 0 ? {
          connect: planIds.map(id => ({ id }))
        } : undefined
      }
    });

    return NextResponse.json({ success: true, coupon: newDbCoupon });

  } catch (error) {
    console.error("Coupon Creation Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { id, active } = body;

    if (!id || active === undefined) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const coupon = await prisma.discountCoupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: "Cupón no encontrado" }, { status: 404 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && coupon.stripePromoCodeId) {
      const stripe = new Stripe(stripeKey);
      try {
        await stripe.promotionCodes.update(coupon.stripePromoCodeId, {
          active: !!active
        });
      } catch (e) {
        console.error("Error updating promotion code in Stripe:", e);
        return NextResponse.json({ error: `Error en Stripe: ${e.message}` }, { status: 400 });
      }
    }

    const updated = await prisma.discountCoupon.update({
      where: { id },
      data: { active: !!active }
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
