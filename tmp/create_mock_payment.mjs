import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMockPayment() {
  try {
    const referralEmail = 'info@yeclaweb.com';
    const user = await prisma.user.findUnique({
        where: { email: referralEmail },
        include: { clientProfile: true }
    });

    if (!user || !user.clientProfile) {
        console.log("User or profile not found.");
        return;
    }

    console.log(`Creating mock payment for profile ${user.clientProfile.id} (${referralEmail})...`);
    const payment = await prisma.payment.create({
        data: {
            clientProfileId: user.clientProfile.id,
            stripeInvoiceId: 'mock_' + Date.now(),
            amount: 149.00,
            currency: 'eur',
            status: 'paid',
            createdAt: new Date()
        }
    });

    console.log("Payment created successfully:", payment.id);

  } catch (err) {
    console.error("MOCK ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

createMockPayment();
