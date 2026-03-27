import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function simulateApi() {
  try {
    const userId = 5; // Fernando's known ID
    console.log(`Simulating stats API for userId: ${userId}`);

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    });

    if (!clientProfile || !clientProfile.isAffiliate) {
      console.log('User is not an affiliate or profile not found');
      return;
    }

    // This is the EXACT query from stats/route.js
    const referrals = await prisma.clientProfile.findMany({
      where: { referredById: clientProfile.id },
      select: {
        id: true,
        razonSocial: true,
        personName: true,
        createdAt: true,
        registrationFinished: true,
        user: {
          select: {
            email: true
          }
        },
        plan: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('--- API RESPONSE SIMULATION ---');
    console.log(JSON.stringify({
      success: true,
      referralCode: clientProfile.referralCode,
      referrals: referrals
    }, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateApi();
