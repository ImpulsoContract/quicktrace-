import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const token = body?.token;
    const password = body?.password;

    if (!token) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Token inválido o ya verificado" }, { status: 400 });
    }

    const updateData = {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null
    };

    // Soporte opcional para cambio de contraseña si se proporciona
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return NextResponse.json({ error: "Token inválido o ya verificado" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
