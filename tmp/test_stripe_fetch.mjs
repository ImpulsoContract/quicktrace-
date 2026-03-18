import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const key = process.env.STRIPE_SECRET_KEY;
  const auth = 'Basic ' + Buffer.from(key + ':').toString('base64');
  
  const formData = new URLSearchParams();
  formData.append('coupon', 'YXqb2omB');
  formData.append('code', 'REST2026');

  try {
    const res = await fetch('https://api.stripe.com/v1/promotion_codes', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    const data = await res.json();
    console.log("REST Response:", data);
  } catch(e) {
    console.error(e);
  }
}
test();
