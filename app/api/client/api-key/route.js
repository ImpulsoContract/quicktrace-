import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req) {
  return NextResponse.json({ error: "Las claves de API solo pueden ser gestionadas por el administrador." }, { status: 403 });
}

export async function DELETE(req) {
  return NextResponse.json({ error: "Las claves de API solo pueden ser gestionadas por el administrador." }, { status: 403 });
}
