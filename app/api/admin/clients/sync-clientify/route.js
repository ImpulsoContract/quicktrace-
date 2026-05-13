import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClientifyContact, assignClientifyTagByEmail } from "@/lib/clientify";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { clientId } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: "Falta el ID del cliente" }, { status: 400 });
    }

    const client = await prisma.user.findUnique({
      where: { id: parseInt(clientId) },
      include: { clientProfile: { include: { plan: true } } }
    });

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    if (client.role !== "CLIENT") {
      return NextResponse.json({ error: "Solo se pueden sincronizar perfiles de clientes" }, { status: 400 });
    }

    // Usar la misma función que el login, que ahora busca primero si existe
    const contact = await createClientifyContact({
      email: client.email,
      name: client.name,
      phone: client.clientProfile?.phone || "",
      razonSocial: client.clientProfile?.razonSocial || ""
    });

    if (contact && contact.id) {
       // Check if it's a paid plan
       const planName = client.clientProfile?.plan?.name || client.clientProfile?.accountType || "";
       const isPaid = !planName.toLowerCase().includes("demo") && !planName.toLowerCase().includes("básic");
       const hasActiveSub = !!client.clientProfile?.stripeSubscriptionId;
       
       if (isPaid || hasActiveSub) {
          await assignClientifyTagByEmail(client.email, "cliente quicktrace");
       }
       
       return NextResponse.json({ success: true, message: "Sincronizado correctamente con Clientify", contactId: contact.id });
    } else {
       return NextResponse.json({ success: false, error: "No se pudo sincronizar con Clientify. Revisa la consola o la API Key." });
    }
  } catch (error) {
    console.error("Sync Clientify error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
