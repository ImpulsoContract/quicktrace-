import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.quicktrace_POSTGRES_PRISMA_URL
    }
  }
});

async function checkDates() {
  try {
    const profiles = await prisma.clientProfile.findMany({
      include: { user: { select: { email: true } } }
    });
    
    console.log("--- CLIENT RENEWAL DATES ---");
    profiles.forEach(p => {
      console.log(`Client: ${p.user.email}`);
      console.log(`  Renewal Date (DB): ${p.stripeCurrentPeriodEnd}`);
      console.log(`  Type: ${typeof p.stripeCurrentPeriodEnd}`);
      console.log(`  SubID: ${p.stripeSubscriptionId}`);
      console.log("----------------------------");
    });
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDates();
