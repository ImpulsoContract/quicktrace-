import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { normalizeProviderName } from "@/lib/utils";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profileId = session.user.profileId;
    if (!profileId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(session.user.id) },
        include: { clientProfile: true }
      });
      profileId = user?.clientProfile?.id;
    }

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const { id } = params;
    const providerId = parseInt(id, 10);
    if (isNaN(providerId)) {
      return NextResponse.json({ error: "ID de proveedor inválido" }, { status: 400 });
    }

    const provider = await prisma.provider.findFirst({
      where: { id: providerId, clientProfileId: profileId }
    });

    if (!provider) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
    }

    // 1. Revisa todos los albaranes de mercancía sin enlazar de este cliente.
    // Si su nombre coincide con el de uno de los proveedores del cliente, los enlaza.
    const allProviders = await prisma.provider.findMany({
      where: { clientProfileId: profileId },
      select: { id: true, name: true }
    });

    const unlinkedReceipts = await prisma.goodsReceipt.findMany({
      where: {
        clientProfileId: profileId,
        providerId: null,
        providerName: { not: null }
      },
      select: {
        id: true,
        providerName: true
      }
    });

    const providerToReceiptIds = new Map();
    for (const r of unlinkedReceipts) {
      if (!r.providerName || !r.providerName.trim()) continue;
      const normR = normalizeProviderName(r.providerName);
      const matched = allProviders.find(p => normalizeProviderName(p.name) === normR);
      if (matched) {
        if (!providerToReceiptIds.has(matched.id)) {
          providerToReceiptIds.set(matched.id, []);
        }
        providerToReceiptIds.get(matched.id).push(r.id);
      }
    }

    for (const [pId, rIds] of providerToReceiptIds.entries()) {
      await prisma.goodsReceipt.updateMany({
        where: { id: { in: rIds } },
        data: { providerId: pId }
      });
    }

    // 2. Devuelve todos los albaranes correspondientes a este proveedor
    const receipts = await prisma.goodsReceipt.findMany({
      where: {
        clientProfileId: profileId,
        OR: [
          { providerId: provider.id },
          { providerName: { equals: provider.name.trim(), mode: "insensitive" } }
        ]
      },
      orderBy: { date: "desc" }
    });

    return NextResponse.json({ success: true, receipts });
  } catch (error) {
    console.error("Error fetching provider receipts:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
