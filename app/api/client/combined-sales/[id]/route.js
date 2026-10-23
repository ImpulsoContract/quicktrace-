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
        seller: true,
        sales: {
          include: {
            elaboration: {
              include: {
                recipe: true
              }
            }
          },
          orderBy: { id: "asc" }
        },
        goodsSales: {
          include: {
            goodsForSale: true
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
        sales: true,
        goodsSales: true
      }
    });

    if (!existingCombinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && existingCombinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { customerId, date, notes, items, isDraft, sellerId, sellerName } = body;
    const isDraftSale = Boolean(isDraft);

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Debes añadir al menos un lote o mercancía para la venta combinada." }, { status: 400 });
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

    // Separate elaboration vs goods items
    const elabRawItems = items.filter(it => it.type === 'elaboration' || (!it.type && it.elaborationId));
    const goodsRawItems = items.filter(it => it.type === 'goods_for_sale' || (!it.type && it.goodsForSaleId));

    if (elabRawItems.length + goodsRawItems.length === 0) {
      return NextResponse.json({ error: "Debes seleccionar al menos un producto para la venta combinada." }, { status: 400 });
    }

    let totalPrice = 0;
    const validatedElabItems = [];
    const validatedGoodsItems = [];

    // Validate elaborations
    if (elabRawItems.length > 0) {
      const elaborationIds = elabRawItems.map(it => parseInt(it.elaborationId)).filter(id => !isNaN(id));
      if (elaborationIds.length !== elabRawItems.length) {
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

      for (const item of elabRawItems) {
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

        const totalSoldOthers = (elab.sales || []).filter(s => !s.isDraft).reduce((sum, s) => {
          if (s.combinedSaleId === id) return sum;
          if (s.quantity != null) return sum + s.quantity;
          if (totalProduced > 0 && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
          return sum;
        }, 0);

        const availableStock = Math.max(0, Math.round((totalProduced - totalSoldOthers) * 1000) / 1000);

        if (!isDraftSale && totalProduced > 0 && qty > availableStock + 0.0001) {
          return NextResponse.json({
            error: `Stock insuficiente para "${elabName}". Intentas vender ${qty} ${unit}, pero solo hay ${availableStock} ${unit} disponibles.`
          }, { status: 400 });
        }

        const percentage = totalProduced > 0 ? (qty / totalProduced) * 100 : 0;
        totalPrice += price;

        validatedElabItems.push({
          elaborationId: elabId,
          quantity: Math.round(qty * 1000) / 1000,
          percentage: Math.round(percentage * 100) / 100,
          price: Math.round(price * 100) / 100
        });
      }
    }

    // Validate goods for sale
    if (goodsRawItems.length > 0) {
      const gfsIds = goodsRawItems.map(it => parseInt(it.goodsForSaleId)).filter(id => !isNaN(id));
      if (gfsIds.length !== goodsRawItems.length) {
        return NextResponse.json({ error: "IDs de mercancía en venta inválidos." }, { status: 400 });
      }

      const goodsList = await prisma.goodsForSale.findMany({
        where: {
          id: { in: gfsIds },
          clientProfileId: existingCombinedSale.clientProfileId
        }
      });

      if (goodsList.length !== gfsIds.length) {
        return NextResponse.json({ error: "Una o más mercancías en venta no fueron encontradas." }, { status: 400 });
      }

      const gfsMap = new Map();
      goodsList.forEach(g => gfsMap.set(g.id, g));

      // Calculate existing allocations in this combined sale
      const existingAllocByGfs = new Map();
      for (const gs of existingCombinedSale.goodsSales) {
        existingAllocByGfs.set(gs.goodsForSaleId, (existingAllocByGfs.get(gs.goodsForSaleId) || 0) + gs.quantity);
      }

      for (const item of goodsRawItems) {
        const gfsId = parseInt(item.goodsForSaleId);
        const gfs = gfsMap.get(gfsId);

        const qty = parseFloat(item.quantity?.toString().replace(',', '.'));
        if (isNaN(qty) || qty <= 0) {
          return NextResponse.json({ error: `La cantidad para "${gfs.name}" debe ser un número mayor a 0.` }, { status: 400 });
        }

        const price = parseFloat(item.price?.toString().replace(',', '.'));
        if (isNaN(price) || price < 0) {
          return NextResponse.json({ error: `El precio para "${gfs.name}" debe ser un número válido.` }, { status: 400 });
        }

        const currentlyAllocatedInThisSale = !existingCombinedSale.isDraft ? (existingAllocByGfs.get(gfsId) || 0) : 0;
        const availableStock = Math.round(((gfs.stock || 0) + currentlyAllocatedInThisSale) * 1000) / 1000;

        if (!isDraftSale && qty > availableStock + 0.0001) {
          return NextResponse.json({
            error: `Stock insuficiente para "${gfs.name}". Intentas vender ${qty} ${gfs.unit}, pero solo hay ${availableStock} ${gfs.unit} disponibles.`
          }, { status: 400 });
        }

        totalPrice += price;

        validatedGoodsItems.push({
          goodsForSaleId: gfsId,
          quantity: Math.round(qty * 1000) / 1000,
          price: Math.round(price * 100) / 100
        });
      }
    }

    let finalSellerId = undefined;
    let finalSellerName = undefined;

    if (sellerId !== undefined) {
      if (!sellerId || sellerId === 'anonymous') {
        finalSellerId = null;
        finalSellerName = sellerName || "Anónimo";
      } else {
        const parsedSId = parseInt(sellerId);
        if (!isNaN(parsedSId)) {
          const seller = await prisma.seller.findUnique({ where: { id: parsedSId } });
          if (seller) {
            finalSellerId = seller.id;
            finalSellerName = seller.name;
          }
        }
      }
    } else if (sellerName !== undefined) {
      finalSellerName = sellerName;
    }

    const saleDate = date ? new Date(date) : new Date();

    // Execute in transaction
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Restore previous goodsSales allocations (only if previous was not draft)
      if (!existingCombinedSale.isDraft) {
        for (const gItem of existingCombinedSale.goodsSales) {
          if (Array.isArray(gItem.lotAllocations)) {
            for (const alloc of gItem.lotAllocations) {
              if (alloc.receiptId && alloc.quantity) {
                await tx.goodsReceipt.update({
                  where: { id: alloc.receiptId },
                  data: { goodsForSaleQuantity: { increment: alloc.quantity } }
                }).catch(() => {});
              }
            }
          }
          await tx.goodsForSale.update({
            where: { id: gItem.goodsForSaleId },
            data: { stock: { increment: gItem.quantity } }
          }).catch(() => {});
        }
      }

      // 2. Remove old records
      await tx.elaborationSale.deleteMany({
        where: { combinedSaleId: id }
      });
      await tx.combinedSaleGoodsItem.deleteMany({
        where: { combinedSaleId: id }
      });

      // 3. Update CombinedSale header
      await tx.combinedSale.update({
        where: { id },
        data: {
          customerId: validCustomerId,
          ...(finalSellerId !== undefined ? { sellerId: finalSellerId } : {}),
          ...(finalSellerName !== undefined ? { sellerName: finalSellerName } : {}),
          date: saleDate,
          totalPrice: Math.round(totalPrice * 100) / 100,
          notes: notes ? notes.trim() : null,
          isDraft: isDraftSale
        }
      });

      // 4. Re-create elaboration sales
      for (const item of validatedElabItems) {
        await tx.elaborationSale.create({
          data: {
            elaborationId: item.elaborationId,
            combinedSaleId: id,
            customerId: validCustomerId,
            quantity: item.quantity,
            percentage: item.percentage,
            price: item.price,
            date: saleDate,
            isDraft: isDraftSale,
            clientProfileId: existingCombinedSale.clientProfileId,
            holdedInvoiceId: existingCombinedSale.holdedInvoiceId || null,
            holdedInvoiceNum: existingCombinedSale.holdedInvoiceNum || null,
            invoicedAt: existingCombinedSale.invoicedAt || null
          }
        });
      }

      // 5. Create new goodsSales (deduct stock FIFO only if NOT draft)
      for (const item of validatedGoodsItems) {
        let lotAllocations = null;

        if (!isDraftSale) {
          const receipts = await tx.goodsReceipt.findMany({
            where: {
              goodsForSaleId: item.goodsForSaleId,
              goodsForSaleQuantity: { gt: 0 }
            },
            orderBy: { date: 'asc' }
          });

          let remainingToDeduct = item.quantity;
          lotAllocations = [];

          for (const r of receipts) {
            if (remainingToDeduct <= 0) break;
            const avail = r.goodsForSaleQuantity || 0;
            const deduct = Math.min(avail, remainingToDeduct);
            const newLotQty = Math.round((avail - deduct) * 10000) / 10000;
            await tx.goodsReceipt.update({
              where: { id: r.id },
              data: { goodsForSaleQuantity: newLotQty }
            });
            lotAllocations.push({ receiptId: r.id, quantity: deduct });
            remainingToDeduct = Math.round((remainingToDeduct - deduct) * 10000) / 10000;
          }

          const currentGfs = await tx.goodsForSale.findUnique({
            where: { id: item.goodsForSaleId }
          });
          const currentStock = currentGfs?.stock || 0;
          const newStock = Math.max(0, Math.round((currentStock - item.quantity) * 10000) / 10000);
          await tx.goodsForSale.update({
            where: { id: item.goodsForSaleId },
            data: { stock: newStock }
          });
        }

        await tx.combinedSaleGoodsItem.create({
          data: {
            combinedSaleId: id,
            goodsForSaleId: item.goodsForSaleId,
            quantity: item.quantity,
            price: item.price,
            lotAllocations: lotAllocations
          }
        });
      }

      return tx.combinedSale.findUnique({
        where: { id },
        include: {
          customer: true,
          seller: true,
          sales: {
            include: {
              elaboration: {
                include: {
                  recipe: true
                }
              }
            }
          },
          goodsSales: {
            include: {
              goodsForSale: true
            }
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
      where: { id },
      include: {
        goodsSales: true
      }
    });

    if (!combinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && combinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Restore goods for sale stock before deleting (only if not draft)
    await prisma.$transaction(async (tx) => {
      if (!combinedSale.isDraft) {
        for (const gItem of combinedSale.goodsSales) {
          if (Array.isArray(gItem.lotAllocations)) {
            for (const alloc of gItem.lotAllocations) {
              if (alloc.receiptId && alloc.quantity) {
                await tx.goodsReceipt.update({
                  where: { id: alloc.receiptId },
                  data: { goodsForSaleQuantity: { increment: alloc.quantity } }
                }).catch(() => {});
              }
            }
          }
          await tx.goodsForSale.update({
            where: { id: gItem.goodsForSaleId },
            data: { stock: { increment: gItem.quantity } }
          }).catch(() => {});
        }
      }

      await tx.combinedSale.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true, message: "Venta combinada eliminada correctamente." });
  } catch (error) {
    console.error("Error deleting combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
