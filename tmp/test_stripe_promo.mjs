import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function test() {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: 10,
      duration: 'once',
    });
    console.log("Coupon ID:", coupon.id);
    const p = await stripe.promotionCodes.create({
      promotion: {
        type: 'coupon',
        coupon: coupon.id
      },
      code: 'TEST2026' + Date.now().toString().slice(-4),
      active: true
    });
    console.log("Promo Code:", p.id);
    
    // cleanup
    await stripe.coupons.del(coupon.id);
  } catch(e) {
    console.error(e.message);
  }
}
test();
