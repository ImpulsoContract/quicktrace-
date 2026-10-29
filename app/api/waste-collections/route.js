import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isRecipeLimitExceeded } from "@/lib/planLimits";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasWaste) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const profile = await prisma.clientProfile.findFirst({
      where: {
        OR: [
          { userId: session.user.id ? parseInt(session.user.id) : undefined },
          { id: session.user.profileId ? parseInt(session.user.profileId) : undefined }
        ].filter(Boolean)
      },
      include: { plan: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Si es ADMIN y envía clientId, busca para ese cliente. Si no, busca los del propio cliente.
    const targetClientId = (session.user.role === 'ADMIN' && clientId) ? parseInt(clientId) : profile.id;

    const collections = await prisma.wasteCollection.findMany({
      where: {
        clientProfileId: targetClientId
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ success: true, collections });
  } catch (error) {
    console.error("GET WasteCollections error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasWaste) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const data = await request.json();
    const { date, personName, kilos, observations } = data;

    if (!date || !personName || kilos === undefined) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const profile = await prisma.clientProfile.findFirst({
      where: {
        OR: [
          { userId: session.user.id ? parseInt(session.user.id) : undefined },
          { id: session.user.profileId ? parseInt(session.user.profileId) : undefined }
        ].filter(Boolean)
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (await isRecipeLimitExceeded(profile.id)) {
      return NextResponse.json({ error: "RECIPES_LIMIT_EXCEEDED" }, { status: 403 });
    }

    const newCollection = await prisma.wasteCollection.create({
      data: {
        date: new Date(date),
        personName,
        kilos: parseFloat(kilos),
        observations: observations ? observations.toString() : null,
        clientProfileId: profile.id
      }
    });

    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error) {
    console.error("POST WasteCollection error:", error);
    return NextResponse.json({ error: "Error al guardar el registro" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasWaste) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const profile = await prisma.clientProfile.findFirst({
      where: {
        OR: [
          { userId: session.user.id ? parseInt(session.user.id) : undefined },
          { id: session.user.profileId ? parseInt(session.user.profileId) : undefined }
        ].filter(Boolean)
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (id) {
      // Single delete
      const record = await prisma.wasteCollection.findUnique({ where: { id: parseInt(id) } });
      if (!record || (record.clientProfileId !== profile.id && session.user.role !== 'ADMIN')) {
        return NextResponse.json({ error: "No encontrado o sin permiso" }, { status: 403 });
      }

      await prisma.wasteCollection.delete({
        where: { id: parseInt(id) }
      });
    } else {
      // Bulk delete
      const body = await request.json();
      const ids = body.ids;
      if (!ids || !ids.length) {
         return NextResponse.json({ error: "IDs no proporcionados" }, { status: 400 });
      }
      
      await prisma.wasteCollection.deleteMany({
        where: {
          id: { in: ids },
          clientProfileId: session.user.role === 'ADMIN' ? undefined : profile.id
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE WasteCollection error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role === "WORKER" && !session.user.permissions?.hasWaste) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const data = await request.json();
    const { id, date, personName, kilos, observations } = data;

    if (!id || !date || !personName || kilos === undefined) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const profile = await prisma.clientProfile.findFirst({
      where: {
        OR: [
          { userId: session.user.id ? parseInt(session.user.id) : undefined },
          { id: session.user.profileId ? parseInt(session.user.profileId) : undefined }
        ].filter(Boolean)
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const record = await prisma.wasteCollection.findUnique({ where: { id: parseInt(id) } });
    if (!record || (record.clientProfileId !== profile.id && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "No encontrado o sin permiso" }, { status: 403 });
    }

    const updatedCollection = await prisma.wasteCollection.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        personName,
        kilos: parseFloat(kilos),
        observations: observations !== undefined ? (observations ? observations.toString() : null) : undefined,
      }
    });

    return NextResponse.json({ success: true, collection: updatedCollection });
  } catch (error) {
    console.error("PATCH WasteCollection error:", error);
    return NextResponse.json({ error: "Error al actualizar el registro" }, { status: 500 });
  }
}

