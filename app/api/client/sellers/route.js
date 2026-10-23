import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const where = session.user.role === "ADMIN" && !profileId
      ? {}
      : { clientProfileId: profileId };

    const sellers = await prisma.seller.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN" && session.user.role !== "WORKER")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { name } = body;
    const trimmedName = (name || "").trim();

    if (!trimmedName) {
      return NextResponse.json({ error: "El nombre del vendedor es obligatorio." }, { status: 400 });
    }

    // Check if seller with same name already exists for this client
    const existing = await prisma.seller.findFirst({
      where: {
        clientProfileId: profileId,
        name: { equals: trimmedName, mode: 'insensitive' }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe un vendedor con ese nombre." }, { status: 400 });
    }

    const seller = await prisma.seller.create({
      data: {
        name: trimmedName,
        clientProfileId: profileId
      }
    });

    return NextResponse.json({ success: true, data: seller });
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
