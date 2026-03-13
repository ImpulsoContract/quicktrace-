import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config({ path: '.env.local' });

async function check() {
  const client = new Client({
    connectionString: process.env.quicktrace_POSTGRES_PRISMA_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT u.email, cp."stripeCurrentPeriodEnd", cp."stripeSubscriptionId"
      FROM "User" u
      JOIN "ClientProfile" cp ON u.id = cp."userId"
      WHERE u.role = 'CLIENT'
    `);
    
    console.log("--- DB VALUES ---");
    res.rows.forEach(row => {
      console.log(`Email: ${row.email}`);
      console.log(`  Renewal: ${row.stripeCurrentPeriodEnd}`);
      console.log(`  SubID: ${row.stripeSubscriptionId}`);
    });
  } catch (err) {
    console.error(err.message);
  } finally {
    await client.end();
  }
}

check();
