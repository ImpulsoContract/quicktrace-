import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const combinedSale = await prisma.combinedSale.findUnique({
      where: { id },
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
          orderBy: { id: "asc" }
        }
      }
    });

    if (!combinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && combinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: combinedSale });
  } catch (error) {
    console.error("Error fetching combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const existingCombinedSale = await prisma.combinedSale.findUnique({
      where: { id },
      include: {
        sales: {
          include: {
            elaboration: true
          }
        }
      }
    });

    if (!existingCombinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && existingCombinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
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
        if (customer && (session.user.role === "ADMIN" || customer.clientProfileId === existingCombinedSale.clientProfileId)) {
          validCustomerId = customer.id;
        }
      }
    }

    // Fetch elaborations and validate stock
    const elaborationIds = items.map(it => parseInt(it.elaborationId)).filter(elId => !isNaN(elId));
    if (elaborationIds.length !== items.length) {
      return NextResponse.json({ error: "IDs de elaboración inválidos." }, { status: 400 });
    }

    const elaborations = await prisma.elaboration.findMany({
      where: {
        id: { in: elaborationIds },
        recipe: session.user.role === "ADMIN" ? {} : { clientProfileId: existingCombinedSale.clientProfileId }
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

      // Check stock: exclude sales belonging to THIS combinedSale!
      const totalProduced = parseFloat(elab.quantityProduced?.toString().replace(',', '.')) || 0;
      const unit = elab.quantityUnit || "unidades";

      const totalSoldOthers = (elab.sales || []).reduce((sum, s) => {
        if (s.combinedSaleId === id) return sum; // don't count the current allocation of this sale
        if (s.quantity != null) return sum + s.quantity;
        if (totalProduced > 0 && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
        return sum;
      }, 0);

      const availableStock = Math.max(0, Math.round((totalProduced - totalSoldOthers) * 1000) / 1000);

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
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update CombinedSale header
      await tx.combinedSale.update({
        where: { id },
        data: {
          customerId: validCustomerId,
          date: saleDate,
          totalPrice: Math.round(totalPrice * 100) / 100,
          notes: notes ? notes.trim() : null
        }
      });

      // 2. Remove existing elaboration sales for this combined sale
      await tx.elaborationSale.deleteMany({
        where: { combinedSaleId: id }
      });

      // 3. Re-create updated elaboration sales
      for (const item of validatedItems) {
        await tx.elaborationSale.create({
          data: {
            elaborationId: item.elaborationId,
            combinedSaleId: id,
            customerId: validCustomerId,
            quantity: item.quantity,
            percentage: item.percentage,
            price: item.price,
            date: saleDate,
            clientProfileId: existingCombinedSale.clientProfileId,
            holdedInvoiceId: existingCombinedSale.holdedInvoiceId || null,
            holdedInvoiceNum: existingCombinedSale.holdedInvoiceNum || null,
            invoicedAt: existingCombinedSale.invoicedAt || null
          }
        });
      }

      return tx.combinedSale.findUnique({
        where: { id },
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
            orderBy: { id: "asc" }
          }
        }
      });
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "WORKER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let profileId = session.user.profileId;
    if (!profileId && session.user.role === "ADMIN") {
      const firstProfile = await prisma.clientProfile.findFirst({
        orderBy: { id: "asc" }
      });
      profileId = firstProfile?.id;
    }

    const combinedSale = await prisma.combinedSale.findUnique({
      where: { id }
    });

    if (!combinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && combinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Cascade delete deletes all associated ElaborationSale records and restores stock
    await prisma.combinedSale.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Venta combinada eliminada correctamente." });
  } catch (error) {
    console.error("Error deleting combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
