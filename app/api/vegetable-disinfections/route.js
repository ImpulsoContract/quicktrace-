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

    const targetClientId = (session.user.role === 'ADMIN' && clientId) ? parseInt(clientId) : profile.id;

    const disinfections = await prisma.vegetableDisinfection.findMany({
      where: {
        clientProfileId: targetClientId
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ success: true, disinfections });
  } catch (error) {
    console.error("GET VegetableDisinfections error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const { date, vegetable, disinfectionTime, personName, observations, correctiveActions } = data;

    if (!date || !vegetable || disinfectionTime === undefined || disinfectionTime === null || disinfectionTime === "") {
      return NextResponse.json({ error: "Faltan datos obligatorios (Fecha, Vegetal, Tiempo de desinfección)" }, { status: 400 });
    }

    const profile = await prisma.clientProfile.findFirst({
      where: {
        OR: [
          { id: session.user.profileId ? parseInt(session.user.profileId) : undefined },
          { userId: session.user.id ? parseInt(session.user.id) : undefined }
        ].filter(Boolean)
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    if (await isRecipeLimitExceeded(profile.id)) {
      return NextResponse.json({ error: "RECIPES_LIMIT_EXCEEDED" }, { status: 403 });
    }

    const newRecord = await prisma.vegetableDisinfection.create({
      data: {
        date: new Date(date),
        vegetable: vegetable.trim(),
        disinfectionTime: parseInt(disinfectionTime) || 0,
        personName: personName ? personName.trim() : null,
        observations: observations ? observations.toString() : null,
        correctiveActions: correctiveActions ? correctiveActions.toString() : null,
        clientProfileId: profile.id
      }
    });

    return NextResponse.json({ success: true, disinfection: newRecord });
  } catch (error) {
    console.error("POST VegetableDisinfection error:", error);
    return NextResponse.json({ error: "Error al guardar el registro" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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
      const record = await prisma.vegetableDisinfection.findUnique({ where: { id: parseInt(id) } });
      if (!record || (record.clientProfileId !== profile.id && session.user.role !== 'ADMIN')) {
        return NextResponse.json({ error: "No encontrado o sin permiso" }, { status: 403 });
      }

      await prisma.vegetableDisinfection.delete({
        where: { id: parseInt(id) }
      });
    } else {
      const body = await request.json();
      const ids = body.ids;
      if (!ids || !ids.length) {
        return NextResponse.json({ error: "IDs no proporcionados" }, { status: 400 });
      }

      await prisma.vegetableDisinfection.deleteMany({
        where: {
          id: { in: ids },
          clientProfileId: session.user.role === 'ADMIN' ? undefined : profile.id
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE VegetableDisinfection error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const { id, date, vegetable, disinfectionTime, personName, observations, correctiveActions } = data;

    if (!id || !date || !vegetable || disinfectionTime === undefined || disinfectionTime === null || disinfectionTime === "") {
      return NextResponse.json({ error: "Faltan datos obligatorios (Fecha, Vegetal, Tiempo de desinfección)" }, { status: 400 });
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

    const record = await prisma.vegetableDisinfection.findUnique({ where: { id: parseInt(id) } });
    if (!record || (record.clientProfileId !== profile.id && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "No encontrado o sin permiso" }, { status: 403 });
    }

    const updatedRecord = await prisma.vegetableDisinfection.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        vegetable: vegetable.trim(),
        disinfectionTime: parseInt(disinfectionTime) || 0,
        personName: personName ? personName.trim() : null,
        observations: observations !== undefined ? (observations ? observations.toString() : null) : undefined,
        correctiveActions: correctiveActions !== undefined ? (correctiveActions ? correctiveActions.toString() : null) : undefined
      }
    });

    return NextResponse.json({ success: true, disinfection: updatedRecord });
  } catch (error) {
    console.error("PATCH VegetableDisinfection error:", error);
    return NextResponse.json({ error: "Error al actualizar el registro" }, { status: 500 });
  }
}
