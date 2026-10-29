import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const workers = await prisma.worker.findMany({
      where: { clientProfileId: session.user.profileId },
      include: { user: { select: { email: true } } }
    });

    return NextResponse.json(workers);
  } catch (error) {
    console.error("Error GET /api/workers:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name, email, password, permissions } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ error: "El email/usuario ya está en uso" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role: "WORKER"
        }
      });

      const newWorker = await tx.worker.create({
        data: {
          userId: newUser.id,
          clientProfileId: session.user.profileId,
          name,
          hasTraceability: Boolean(permissions.hasTraceability),
          hasCleaning: Boolean(permissions.hasCleaning),
          hasTemperatures: Boolean(permissions.hasTemperatures),
          hasWater: Boolean(permissions.hasWater),
          hasGoods: Boolean(permissions.hasGoods),
          hasCutting: Boolean(permissions.hasCutting ?? permissions.hasCuttingTraceability),
          hasWaste: Boolean(permissions.hasWaste ?? permissions.hasWasteCollection),
          hasOil: Boolean(permissions.hasOil ?? permissions.hasOilCollection),
          hasVegetables: Boolean(permissions.hasVegetables ?? permissions.hasVegetableDisinfection)
        }
      });

      return newWorker;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error POST /api/workers:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
