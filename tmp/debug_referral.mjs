import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const referrerEmail = 'fernando@impulsocontract.com';
    const refereeEmail = 'info@yeclaweb.com';

    const referrerUser = await prisma.user.findUnique({
      where: { email: referrerEmail },
      include: { clientProfile: true }
    });

    const refereeUser = await prisma.user.findUnique({
      where: { email: refereeEmail },
      include: { clientProfile: true }
    });

    console.log('--- Referrer Info ---');
    if (referrerUser) {
      console.log('User ID:', referrerUser.id);
      console.log('Profile ID:', referrerUser.clientProfile?.id);
      console.log('Referral Code:', referrerUser.clientProfile?.referralCode);
      console.log('Is Affiliate:', referrerUser.clientProfile?.isAffiliate);
    } else {
      console.log('Referrer user not found');
    }

    console.log('\n--- Referee Info ---');
    if (refereeUser) {
      console.log('User ID:', refereeUser.id);
      console.log('Profile ID:', refereeUser.clientProfile?.id);
      console.log('Referred By ID:', refereeUser.clientProfile?.referredById);
      console.log('Account Type:', refereeUser.clientProfile?.accountType);
    } else {
      console.log('Referee user not found');
    }

    if (referrerUser && refereeUser) {
      if (refereeUser.clientProfile?.referredById === referrerUser.clientProfile?.id) {
        console.log('\nSUCCESS: LINKING IS CORRECT IN DATABASE');
      } else {
        console.log('\nFAILURE: LINKING IS MISSING OR INCORRECT IN DATABASE');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
