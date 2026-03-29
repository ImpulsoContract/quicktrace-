import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugReferral() {
  try {
    const affiliateEmail = 'fernando@impulsocontract.com';
    const referralEmail = 'info@yeclaweb.com';

    console.log(`Searching for Affiliate: ${affiliateEmail}`);
    const affiliate = await prisma.user.findUnique({
      where: { email: affiliateEmail },
      include: { clientProfile: true }
    });

    if (!affiliate) {
        console.log("Affiliate user not found.");
    } else {
        console.log("Affiliate Profile ID:", affiliate.clientProfile?.id);
        console.log("Affiliate Referral Code:", affiliate.clientProfile?.referralCode);
    }

    console.log(`\nSearching for Referral: ${referralEmail}`);
    const referral = await prisma.user.findUnique({
        where: { email: referralEmail },
        include: { 
            clientProfile: {
                include: { referredBy: true }
            }
        }
    });

    if (!referral) {
        console.log("Referral user not found.");
    } else {
        const profile = referral.clientProfile;
        console.log("Referral Profile ID:", profile?.id);
        console.log("Referred By ID:", profile?.referredById);
        console.log("Stripe Customer ID:", profile?.stripeCustomerId);
        console.log("Stripe Subscription ID:", profile?.stripeSubscriptionId);
        if (profile?.referredBy) {
            console.log("Linked to referrer email:", profile.referredBy.id === affiliate.clientProfile.id ? "MATCH FOUND" : "MISMATCH");
        } else {
            console.log("NOT LINKED TO ANY REFERRER.");
        }
        
        console.log("\nChecking payments for referral profile...");
        const payments = await prisma.payment.findMany({
            where: { clientProfileId: profile?.id }
        });
        console.log(`Found ${payments.length} payments.`);
        payments.forEach(p => {
            console.log(`- ID: ${p.id}, Amount: ${p.amount}, Status: ${p.status}, Created: ${p.createdAt}`);
        });

        if (payments.length === 0) {
            console.log("Searching for ALL payments in DB to see if any exist...");
            const allPayments = await prisma.payment.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
            console.log(`Total payments in DB (last 5): ${allPayments.length}`);
            allPayments.forEach(p => {
                console.log(`- ProfileId: ${p.clientProfileId}, Amount: ${p.amount}, Created: ${p.createdAt}`);
            });
        }
    }

  } catch (err) {
    console.error("DB DEBUG ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugReferral();
