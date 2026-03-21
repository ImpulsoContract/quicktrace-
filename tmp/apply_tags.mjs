import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const apiKey = process.env.CLIENTIFY_API_KEY;

async function assignTag(email, tag) {
  if (!apiKey || !email) return;
  try {
    const searchRes = await fetch(`https://api.clientify.net/v1/contacts/?query=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Authorization': `Token ${apiKey}` }
    });
    if (!searchRes.ok) return;
    const searchData = await searchRes.json();
    let contact = searchData.results?.find(c => c.email && c.email.toLowerCase() === email.toLowerCase()) || searchData.results?.[0];
    if (contact && contact.id) {
      await fetch(`https://api.clientify.net/v1/contacts/${contact.id}/tags/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${apiKey}` },
        body: JSON.stringify({ name: tag })
      });
      console.log(`[Clientify] Tag "${tag}" added to ${email}`);
    } else {
      console.log(`[Clientify] Contact not found for ${email}`);
    }
  } catch (err) {
    console.error(`Error with ${email}:`, err.message);
  }
}

async function main() {
  console.log("Buscando clientes de pago y asignando etiqueta...");
  const users = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: { clientProfile: { include: { plan: true } } }
  });

  for (const user of users) {
    const planName = user.clientProfile?.plan?.name || user.clientProfile?.accountType || "";
    const isPaid = !planName.toLowerCase().includes("demo") && !planName.toLowerCase().includes("básic");
    const hasActiveSub = !!user.clientProfile?.stripeSubscriptionId;
    
    if (isPaid || hasActiveSub) {
      console.log(`Procesando usuario de pago: ${user.email} (Plan: ${planName})`);
      await assignTag(user.email, "cliente quicktrace");
      // Esperar un poco para no saturar la API
      await new Promise(r => setTimeout(r, 500));
    }
  }
  console.log("Sincronización masiva de clientes de pago completada.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
