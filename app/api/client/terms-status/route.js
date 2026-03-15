import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { pendingTermsUpdate: true }
    });

    return NextResponse.json({ pendingTermsUpdate: user?.pendingTermsUpdate || false });
  } catch (error) {
    console.error("Error fetching terms status:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
