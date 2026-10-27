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

    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    // Check if client has POS mode enabled
    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId },
      select: { hasPosMode: true }
    });

    if (!profile?.hasPosMode && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "El modo TPV no está activado para este cliente" }, { status: 403 });
    }

    // 1. Fetch all product families
    const families = await prisma.productFamily.findMany({
      where: { clientProfileId: profileId },
      include: {
        recipes: {
          select: {
            id: true,
            name: true
          },
          orderBy: { name: 'asc' }
        },
        goodsForSale: {
          where: { isArchived: false },
          select: {
            id: true,
            name: true,
            unit: true,
            salePrice: true,
            stock: true
          },
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { name: "asc" }
    });

    // 2. Fetch all recipes
    const recipes = await prisma.recipe.findMany({
      where: { clientProfileId: profileId },
      select: {
        id: true,
        name: true,
        productFamilyId: true,
        productFamily: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: "asc" }
    });

    // 3. Fetch all active goods for sale
    const goods = await prisma.goodsForSale.findMany({
      where: {
        clientProfileId: profileId,
        isArchived: false
      },
      select: {
        id: true,
        name: true,
        unit: true,
        salePrice: true,
        stock: true,
        productFamilyId: true,
        productFamily: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({
      success: true,
      families,
      recipes,
      goods
    });
  } catch (error) {
    console.error("Error fetching product families data:", error);
    return NextResponse.json({ error: "Error al cargar las familias de productos" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
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
    const name = (body.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "El nombre de la familia es obligatorio" }, { status: 400 });
    }

    // Check for duplicate name
    const existing = await prisma.productFamily.findFirst({
      where: {
        clientProfileId: profileId,
        name: {
          equals: name,
          mode: "insensitive"
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe una familia con ese nombre" }, { status: 400 });
    }

    const family = await prisma.productFamily.create({
      data: {
        name,
        clientProfileId: profileId
      },
      include: {
        recipes: true,
        goodsForSale: true
      }
    });

    return NextResponse.json({ success: true, family }, { status: 201 });
  } catch (error) {
    console.error("Error creating product family:", error);
    return NextResponse.json({ error: "Error al crear la familia de productos" }, { status: 500 });
  }
}
