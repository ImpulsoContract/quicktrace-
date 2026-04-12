import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const { name, password, permissions } = await req.json();

    const worker = await prisma.worker.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!worker || worker.clientProfileId !== session.user.profileId) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.worker.update({
        where: { id },
        data: {
          name: name || worker.name,
          hasTraceability: permissions.hasTraceability !== undefined ? permissions.hasTraceability : worker.hasTraceability,
          hasCleaning: permissions.hasCleaning !== undefined ? permissions.hasCleaning : worker.hasCleaning,
          hasTemperatures: permissions.hasTemperatures !== undefined ? permissions.hasTemperatures : worker.hasTemperatures,
          hasWater: permissions.hasWater !== undefined ? permissions.hasWater : worker.hasWater,
          hasGoods: permissions.hasGoods !== undefined ? permissions.hasGoods : worker.hasGoods
        }
      });

      const userUpdateData = { name: name || worker.user.name };
      if (password) {
        userUpdateData.password = await bcrypt.hash(password, 10);
      }

      await tx.user.update({
        where: { id: worker.userId },
        data: userUpdateData
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error PATCH /api/workers/[id]:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const worker = await prisma.worker.findUnique({
      where: { id }
    });

    if (!worker || worker.clientProfileId !== session.user.profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Deleting the User will delete the Worker due to Cascade in schema
    await prisma.user.delete({
      where: { id: worker.userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error DELETE /api/workers/[id]:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
