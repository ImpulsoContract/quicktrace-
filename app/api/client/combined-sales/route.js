import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const where = session.user.role === "ADMIN" ? {} : { clientProfileId: profileId };

    const combinedSales = await prisma.combinedSale.findMany({
      where,
      include: {
        customer: true,
        sales: {
          include: {
            elaboration: {
              include: {
                recipe: true
              }
            }
          },
          orderBy: { id: 'asc' }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ success: true, data: combinedSales });
  } catch (error) {
    console.error("Error fetching combined sales:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { customerId, date, notes, items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Debes seleccionar al menos una elaboración para la venta combinada." }, { status: 400 });
    }

    // Validate customer
    let validCustomerId = null;
    if (customerId) {
      const parsedCustId = parseInt(customerId);
      if (!isNaN(parsedCustId)) {
        const customer = await prisma.customer.findUnique({
          where: { id: parsedCustId }
        });
        if (customer && (session.user.role === "ADMIN" || customer.clientProfileId === profileId)) {
          validCustomerId = customer.id;
        }
      }
    }

    // Fetch elaborations and validate stock
    const elaborationIds = items.map(it => parseInt(it.elaborationId)).filter(id => !isNaN(id));
    if (elaborationIds.length !== items.length) {
      return NextResponse.json({ error: "IDs de elaboración inválidos." }, { status: 400 });
    }

    const elaborations = await prisma.elaboration.findMany({
      where: {
        id: { in: elaborationIds },
        recipe: session.user.role === "ADMIN" ? {} : { clientProfileId: profileId }
      },
      include: {
        recipe: true,
        sales: true
      }
    });

    if (elaborations.length !== elaborationIds.length) {
      return NextResponse.json({ error: "Una o más elaboraciones no fueron encontradas o no pertenecen a tu cuenta." }, { status: 400 });
    }

    const elabMap = new Map();
    elaborations.forEach(e => elabMap.set(e.id, e));

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const elabId = parseInt(item.elaborationId);
      const elab = elabMap.get(elabId);
      const elabName = `${elab.recipe?.name || 'Receta'} (Lote: ${elab.name})`;

      const qty = parseFloat(item.quantity?.toString().replace(',', '.'));
      if (isNaN(qty) || qty <= 0) {
        return NextResponse.json({ error: `La cantidad para "${elabName}" debe ser un número mayor a 0.` }, { status: 400 });
      }

      const price = parseFloat(item.price?.toString().replace(',', '.'));
      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: `El precio para "${elabName}" debe ser un número válido.` }, { status: 400 });
      }

      // Check stock
      const totalProduced = parseFloat(elab.quantityProduced?.toString().replace(',', '.')) || 0;
      const unit = elab.quantityUnit || elab.recipe?.baseUnit || "unidades";

      const totalSold = (elab.sales || []).reduce((sum, s) => {
        if (s.quantity != null) return sum + s.quantity;
        if (totalProduced > 0 && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
        return sum;
      }, 0);

      const availableStock = Math.max(0, Math.round((totalProduced - totalSold) * 1000) / 1000);

      if (totalProduced > 0 && qty > availableStock + 0.0001) {
        return NextResponse.json({
          error: `Stock insuficiente para "${elabName}". Intentas vender ${qty} ${unit}, pero solo hay ${availableStock} ${unit} disponibles.`
        }, { status: 400 });
      }

      const percentage = totalProduced > 0 ? (qty / totalProduced) * 100 : 0;
      totalPrice += price;

      validatedItems.push({
        elaborationId: elabId,
        quantity: Math.round(qty * 1000) / 1000,
        percentage: Math.round(percentage * 100) / 100,
        price: Math.round(price * 100) / 100
      });
    }

    const saleDate = date ? new Date(date) : new Date();

    // Execute in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const combinedSale = await tx.combinedSale.create({
        data: {
          clientProfileId: profileId,
          customerId: validCustomerId,
          date: saleDate,
          totalPrice: Math.round(totalPrice * 100) / 100,
          notes: notes ? notes.trim() : null
        }
      });

      for (const item of validatedItems) {
        await tx.elaborationSale.create({
          data: {
            elaborationId: item.elaborationId,
            combinedSaleId: combinedSale.id,
            customerId: validCustomerId,
            quantity: item.quantity,
            percentage: item.percentage,
            price: item.price,
            date: saleDate,
            clientProfileId: profileId
          }
        });
      }

      return tx.combinedSale.findUnique({
        where: { id: combinedSale.id },
        include: {
          customer: true,
          sales: {
            include: {
              elaboration: {
                include: {
                  recipe: true
                }
              }
            }
          }
        }
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
