import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function test() {
  console.log("URL:", process.env.quicktrace_POSTGRES_PRISMA_URL ? "Exists" : "Missing");
  try {
    const clients = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    console.log("Success! Found client:", clients?.email || "None");
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

test().finally(() => prisma.$disconnect());
