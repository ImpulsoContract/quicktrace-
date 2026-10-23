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

    if (!profileId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const isDraftParam = searchParams.get("isDraft");
    const sellerIdParam = searchParams.get("sellerId");
    const sellerNameParam = searchParams.get("sellerName");

    let draftFilter = {};
    if (isDraftParam === "true") draftFilter.isDraft = true;
    else if (isDraftParam === "false") draftFilter.isDraft = false;

    let sellerFilter = {};
    if (sellerIdParam !== null && sellerIdParam !== undefined) {
      if (sellerIdParam === "null" || sellerIdParam === "anonymous") {
        sellerFilter.sellerId = null;
      } else {
        const parsedSId = parseInt(sellerIdParam);
        if (!isNaN(parsedSId)) sellerFilter.sellerId = parsedSId;
      }
    }
    if (sellerNameParam) {
      sellerFilter.sellerName = sellerNameParam;
    }

    const where = {
      ...((session.user.role === "ADMIN" && !profileId) ? {} : { clientProfileId: profileId }),
      ...draftFilter,
      ...sellerFilter
    };

    const combinedSales = await prisma.combinedSale.findMany({
      where,
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
          orderBy: { id: 'asc' }
        },
        goodsSales: {
          include: {
            goodsForSale: true
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
        if (customer && (session.user.role === "ADMIN" || customer.clientProfileId === profileId)) {
          validCustomerId = customer.id;
        }
      }
    }

    // Separate elaboration items vs goods_for_sale items
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

        const totalProduced = parseFloat(elab.quantityProduced?.toString().replace(',', '.')) || 0;
        const unit = elab.quantityUnit || "unidades";

        const totalSold = (elab.sales || []).filter(s => !s.isDraft).reduce((sum, s) => {
          if (s.quantity != null) return sum + s.quantity;
          if (totalProduced > 0 && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
          return sum;
        }, 0);

        const availableStock = Math.max(0, Math.round((totalProduced - totalSold) * 1000) / 1000);

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
          ...(session.user.role === "ADMIN" && !profileId ? {} : { clientProfileId: profileId })
        }
      });

      if (goodsList.length !== gfsIds.length) {
        return NextResponse.json({ error: "Una o más mercancías en venta no fueron encontradas." }, { status: 400 });
      }

      const gfsMap = new Map();
      goodsList.forEach(g => gfsMap.set(g.id, g));

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

        const availableStock = gfs.stock || 0;
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

    let finalSellerId = null;
    let finalSellerName = sellerName || "Gestión";

    if (sellerId) {
      const parsedSId = parseInt(sellerId);
      if (!isNaN(parsedSId)) {
        const seller = await prisma.seller.findUnique({ where: { id: parsedSId } });
        if (seller && (session.user.role === "ADMIN" || seller.clientProfileId === profileId)) {
          finalSellerId = seller.id;
          finalSellerName = seller.name;
        }
      }
    } else if (sellerName === "Anónimo" || sellerName === "Anonimo") {
      finalSellerId = null;
      finalSellerName = "Anónimo";
    }

    const saleDate = date ? new Date(date) : new Date();

    // Execute in transaction
    const result = await prisma.$transaction(async (tx) => {
      const combinedSale = await tx.combinedSale.create({
        data: {
          clientProfileId: profileId,
          customerId: validCustomerId,
          sellerId: finalSellerId,
          sellerName: finalSellerName,
          date: saleDate,
          totalPrice: Math.round(totalPrice * 100) / 100,
          notes: notes ? notes.trim() : null,
          isDraft: isDraftSale
        }
      });

      // 1. Create ElaborationSales
      for (const item of validatedElabItems) {
        await tx.elaborationSale.create({
          data: {
            elaborationId: item.elaborationId,
            combinedSaleId: combinedSale.id,
            customerId: validCustomerId,
            quantity: item.quantity,
            percentage: item.percentage,
            price: item.price,
            date: saleDate,
            isDraft: isDraftSale,
            clientProfileId: profileId
          }
        });
      }

      // 2. Create GoodsSales (deduct stock FIFO only if NOT draft)
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

          // Decrement GoodsForSale total stock
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
            combinedSaleId: combinedSale.id,
            goodsForSaleId: item.goodsForSaleId,
            quantity: item.quantity,
            price: item.price,
            lotAllocations: lotAllocations
          }
        });
      }

      return tx.combinedSale.findUnique({
        where: { id: combinedSale.id },
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

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating combined sale:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
