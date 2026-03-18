import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function test() {
  try {
    const account = await stripe.accounts.retrieve();
    console.log("Account:", account.id);
    console.log("Stripe Platform Version:", stripe.getApiField('version')); // Node SDK internal version
  } catch(e) {
    console.error(e.message);
  }
}
test();
