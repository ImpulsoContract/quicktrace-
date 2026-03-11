import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      email, password, name, razonSocial, nif, phone, urlClientify,
      planId, personName, address, postalCode, city, province, country
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "CLIENT"
        }
      });

      const profile = await tx.clientProfile.create({
        data: {
          userId: user.id,
          razonSocial,
          nif,
          phone,
          urlClientify,
          personName,
          address,
          postalCode,
          city,
          province,
          country,
          planId: planId || null,
          canManageRecipes: true // Default for now, can be adjusted
        }
      });

      return { user, profile };
    });

    return NextResponse.json({ success: true, userId: result.user.id });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
