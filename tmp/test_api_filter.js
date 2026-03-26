const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFilter() {
  try {
    const startDate = "2026-03-20";
    const endDate = "2026-03-22";
    
    const where = {
      date: {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
      }
    };
    
    console.log("Testing with where clause:", JSON.stringify(where, null, 2));
    
    // Just a dry run of the logic since I don't want to query real data if not needed
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    console.log("End date object:", end.toISOString());
    
    if (end.toISOString().includes("23:59:59.999")) {
      console.log("Filter logic is CORRECT: End date includes the full day.");
    } else {
      console.log("Filter logic might be WRONG.");
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

testFilter();
