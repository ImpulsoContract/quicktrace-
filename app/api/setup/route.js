import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminEmail = 'fernando@quicktrace.es'.toLowerCase();
    const adminPassword = await bcrypt.hash('1alejandra1FERNANDO', 10);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: adminPassword,
        role: 'ADMIN',
        name: 'Fernando Admin'
      },
      create: {
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        name: 'Fernando Admin'
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Base de datos inicializada y administrador creado.",
      admin: admin.email 
    });
  } catch (error) {
    console.error("Error en setup:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
