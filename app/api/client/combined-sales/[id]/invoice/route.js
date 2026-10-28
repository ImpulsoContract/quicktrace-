import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createIsbueInvoice } from "@/lib/isbue";

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const combinedSaleId = parseInt(params.id);
    if (isNaN(combinedSaleId)) {
      return NextResponse.json({ error: "ID de venta combinada inválido" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId }
    });

    const provider = (profile?.invoicingProvider || (profile?.isbueApiKey && !profile?.holdedApiKey ? "ISBUE" : "HOLDED")).toUpperCase();

    if (provider === "ISBUE") {
      const isbueKey = profile?.isbueApiKey?.trim();
      if (!isbueKey) {
        return NextResponse.json({ 
          error: "Debes configurar tu API Key o Token de Isbue en la sección de 'Configuración del negocio' para poder emitir facturas." 
        }, { status: 400 });
      }
    } else {
      const apiKey = profile?.holdedApiKey?.trim();
      if (!apiKey) {
        return NextResponse.json({ 
          error: "Debes configurar tu API Key de Holded en la sección de 'Configuración del negocio' para poder emitir facturas." 
        }, { status: 400 });
      }
    }

    const combinedSale = await prisma.combinedSale.findUnique({
      where: { id: combinedSaleId },
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
        },
        goodsSales: {
          include: {
            goodsForSale: true
          }
        }
      }
    });

    if (!combinedSale) {
      return NextResponse.json({ error: "Venta combinada no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && combinedSale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (combinedSale.isDraft) {
      return NextResponse.json({
        error: "No se puede facturar una venta en borrador. Debes confirmar la venta antes de generar la factura."
      }, { status: 400 });
    }

    // Check if already invoiced
    if (combinedSale.holdedInvoiceId || combinedSale.isbueInvoiceId) {
      const invNum = combinedSale.holdedInvoiceNum || combinedSale.isbueInvoiceNum || combinedSale.holdedInvoiceId || combinedSale.isbueInvoiceId;
      return NextResponse.json({
        success: false,
        alreadyInvoiced: true,
        invoiceNum: invNum,
        invoiceId: combinedSale.holdedInvoiceId || combinedSale.isbueInvoiceId,
        error: `Esta venta combinada ya ha sido facturada previamente (${invNum}).`
      }, { status: 400 });
    }

    // Check customer presence
    if (!combinedSale.customer) {
      return NextResponse.json({
        error: "La venta combinada debe estar asociada a un cliente registrado para poder generar una factura."
      }, { status: 400 });
    }

    // Check NIF presence
    const customerNif = combinedSale.customer.nif?.trim();
    if (!customerNif) {
      return NextResponse.json({
        error: `El cliente "${combinedSale.customer.commercialName}" no tiene NIF/CIF informado. Por favor, edita los datos del cliente y añade su NIF/CIF.`
      }, { status: 400 });
    }

    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }
    const autoCreateContact = !!body.autoCreateContact;
    const cleanNif = customerNif.toUpperCase().replace(/\s+/g, '');

    if (provider === "ISBUE") {
      const elabItems = (combinedSale.sales || []).map(s => {
        const itemName = s.elaboration?.recipe?.name || s.elaboration?.name || "Elaboración";
        const descParts = [];
        if (s.elaboration?.name) descParts.push(`Lote: ${s.elaboration.name}`);
        if (s.elaboration?.date) descParts.push(`Elab: ${new Date(s.elaboration.date).toLocaleDateString('es-ES')}`);
        if (s.elaboration?.expirationDate) descParts.push(`Caducidad: ${new Date(s.elaboration.expirationDate).toLocaleDateString('es-ES')}`);
        const itemDesc = descParts.length > 0 ? descParts.join(" | ") : "";

        const units = s.quantity && s.quantity > 0 ? s.quantity : 1;
        const subtotal = s.quantity && s.quantity > 0 
          ? parseFloat((s.price / s.quantity).toFixed(4)) 
          : parseFloat((s.price || 0).toFixed(4));

        return {
          name: itemName,
          desc: itemDesc,
          units,
          price: subtotal,
          tax: profile.isbueTax !== undefined && profile.isbueTax !== null ? profile.isbueTax : 10
        };
      });

      const goodsItems = (combinedSale.goodsSales || []).map(gs => {
        const itemName = gs.goodsForSale?.name || "Mercancía en venta";
        const itemDesc = gs.goodsForSale?.unit ? `Unidad: ${gs.goodsForSale.unit}` : "";
        const units = gs.quantity && gs.quantity > 0 ? gs.quantity : 1;
        const subtotal = gs.quantity && gs.quantity > 0
          ? parseFloat((gs.price / gs.quantity).toFixed(4))
          : parseFloat((gs.price || 0).toFixed(4));

        return {
          name: itemName,
          desc: itemDesc,
          units,
          price: subtotal,
          tax: profile.isbueTax !== undefined && profile.isbueTax !== null ? profile.isbueTax : 10
        };
      });

      const allItems = [...elabItems, ...goodsItems];

      const isbueResult = await createIsbueInvoice({
        profile,
        customer: combinedSale.customer,
        items: allItems,
        notes: `Venta combinada registrada desde QuickTrace. ID: ${combinedSale.id}`,
        autoCreateContact
      });

      if (!isbueResult.success) {
        return NextResponse.json({
          error: isbueResult.error || "Error al generar la factura en Isbue."
        }, { status: 400 });
      }

      const now = new Date();
      await prisma.combinedSale.update({
        where: { id: combinedSale.id },
        data: {
          holdedInvoiceId: isbueResult.invoiceId,
          holdedInvoiceNum: isbueResult.invoiceNum,
          isbueInvoiceId: isbueResult.invoiceId,
          isbueInvoiceNum: isbueResult.invoiceNum,
          invoicingProvider: "ISBUE",
          invoicedAt: now
        }
      });

      await prisma.elaborationSale.updateMany({
        where: { combinedSaleId: combinedSale.id },
        data: {
          holdedInvoiceId: isbueResult.invoiceId,
          holdedInvoiceNum: isbueResult.invoiceNum,
          isbueInvoiceId: isbueResult.invoiceId,
          isbueInvoiceNum: isbueResult.invoiceNum,
          invoicingProvider: "ISBUE",
          invoicedAt: now
        }
      });

      return NextResponse.json({
        success: true,
        invoiceId: isbueResult.invoiceId,
        invoiceNum: isbueResult.invoiceNum,
        invoicedAt: now,
        message: `Factura ${isbueResult.invoiceNum} generada con éxito en Isbue para la venta combinada.`
      });
    }

    const apiKey = profile.holdedApiKey.trim();
    // 1. Fetch contacts: Try v1, fallback to v2
    let matchedContact = null;
    let isV2 = apiKey.startsWith("pat_") || apiKey.includes(".");
    let usedVersion = isV2 ? "v2" : "v1";

    if (!isV2) {
      try {
        const v1ContactsRes = await fetch("https://api.holded.com/api/invoicing/v1/contacts", {
          method: "GET",
          headers: { "key": apiKey, "Accept": "application/json" }
        });
        if (v1ContactsRes.ok) {
          const contacts = await v1ContactsRes.json();
          if (Array.isArray(contacts)) {
            matchedContact = contacts.find(c => c.code && c.code.trim().toUpperCase().replace(/\s+/g, '') === cleanNif);
          }
          usedVersion = "v1";
        } else if (v1ContactsRes.status === 401 || v1ContactsRes.status === 403) {
          isV2 = true;
        }
      } catch (e) {
        console.error("Holded v1 contacts error:", e);
        isV2 = true;
      }
    }

    if (isV2 && !matchedContact) {
      try {
        const v2ContactsRes = await fetch("https://api.holded.com/api/v2/contacts", {
          method: "GET",
          headers: { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" }
        });
        if (v2ContactsRes.ok) {
          const data = await v2ContactsRes.json();
          const contacts = Array.isArray(data) ? data : (data.items || []);
          matchedContact = contacts.find(c => (c.code || c.vat_number) && (c.code || c.vat_number).trim().toUpperCase().replace(/\s+/g, '') === cleanNif);
          usedVersion = "v2";
        }
      } catch (e) {
        console.error("Holded v2 contacts error:", e);
      }
    }

    // 2. If contact not found in Holded
    if (!matchedContact) {
      if (!autoCreateContact) {
        return NextResponse.json({
          success: false,
          contactNotFound: true,
          customerName: combinedSale.customer.fiscalName || combinedSale.customer.commercialName,
          customerNif: customerNif,
          message: "El cliente no existe en Holded. ¿Deseas darlo de alta automáticamente?"
        }, { status: 200 });
      }

      // Create contact in Holded
      const contactName = (combinedSale.customer.fiscalName || combinedSale.customer.commercialName || "Cliente").trim();
      
      if (usedVersion === "v1") {
        const createPayloadV1 = {
          name: contactName,
          tradeName: (combinedSale.customer.commercialName || "").trim() || undefined,
          code: customerNif,
          email: combinedSale.customer.email?.trim() || undefined,
          phone: (combinedSale.customer.phone || combinedSale.customer.phone2)?.trim() || undefined,
          billAddress: {
            address: combinedSale.customer.address?.trim() || "",
            postalCode: combinedSale.customer.postalCode?.trim() || "",
            city: combinedSale.customer.city?.trim() || "",
            province: combinedSale.customer.province?.trim() || "",
            country: "España"
          },
          isCustomer: true
        };

        const createRes = await fetch("https://api.holded.com/api/invoicing/v1/contacts", {
          method: "POST",
          headers: { "key": apiKey, "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(createPayloadV1)
        });

        const createData = await createRes.json().catch(() => ({}));
        if (!createRes.ok || createData.status === 0 || !createData.id) {
          return NextResponse.json({
            error: `Error al crear el cliente en Holded: ${createData.info || createData.message || createRes.statusText}`
          }, { status: 400 });
        }
        matchedContact = { id: createData.id };
      } else {
        const createPayloadV2 = {
          name: contactName,
          code: customerNif,
          email: combinedSale.customer.email?.trim() || undefined,
          phone: (combinedSale.customer.phone || combinedSale.customer.phone2)?.trim() || undefined,
          type: "client"
        };

        const createRes = await fetch("https://api.holded.com/api/v2/contacts", {
          method: "POST",
          headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(createPayloadV2)
        });

        const createData = await createRes.json().catch(() => ({}));
        if (!createRes.ok || !createData.id) {
          return NextResponse.json({
            error: `Error al crear el cliente en Holded: ${createData.detail || createData.message || createRes.statusText}`
          }, { status: 400 });
        }
        matchedContact = { id: createData.id };
      }
    }

    // 3. Build invoice items for all elaborations in the combined sale
    const taxRate = profile.holdedTax !== undefined && profile.holdedTax !== null 
      ? profile.holdedTax 
      : 10;

    const elabItemsV1 = (combinedSale.sales || []).map(s => {
      const itemName = s.elaboration?.recipe?.name || s.elaboration?.name || "Elaboración";
      const descParts = [];
      if (s.elaboration?.name) descParts.push(`Lote: ${s.elaboration.name}`);
      if (s.elaboration?.date) descParts.push(`Elab: ${new Date(s.elaboration.date).toLocaleDateString('es-ES')}`);
      if (s.elaboration?.expirationDate) descParts.push(`Caducidad: ${new Date(s.elaboration.expirationDate).toLocaleDateString('es-ES')}`);
      const itemDesc = descParts.length > 0 ? descParts.join(" | ") : "";

      const units = s.quantity && s.quantity > 0 ? s.quantity : 1;
      const subtotal = s.quantity && s.quantity > 0 
        ? parseFloat((s.price / s.quantity).toFixed(4)) 
        : parseFloat((s.price || 0).toFixed(4));

      return {
        name: itemName,
        desc: itemDesc,
        units,
        subtotal,
        tax: taxRate
      };
    });

    const goodsItemsV1 = (combinedSale.goodsSales || []).map(gs => {
      const itemName = gs.goodsForSale?.name || "Mercancía en venta";
      const itemDesc = gs.goodsForSale?.unit ? `Unidad: ${gs.goodsForSale.unit}` : "";
      const units = gs.quantity && gs.quantity > 0 ? gs.quantity : 1;
      const subtotal = gs.quantity && gs.quantity > 0
        ? parseFloat((gs.price / gs.quantity).toFixed(4))
        : parseFloat((gs.price || 0).toFixed(4));

      return {
        name: itemName,
        desc: itemDesc,
        units,
        subtotal,
        tax: taxRate
      };
    });

    const itemsV1 = [...elabItemsV1, ...goodsItemsV1];

    const elabItemsV2 = (combinedSale.sales || []).map(s => {
      const itemName = s.elaboration?.recipe?.name || s.elaboration?.name || "Elaboración";
      const descParts = [];
      if (s.elaboration?.name) descParts.push(`Lote: ${s.elaboration.name}`);
      if (s.elaboration?.date) descParts.push(`Elab: ${new Date(s.elaboration.date).toLocaleDateString('es-ES')}`);
      if (s.elaboration?.expirationDate) descParts.push(`Caducidad: ${new Date(s.elaboration.expirationDate).toLocaleDateString('es-ES')}`);
      const itemDesc = descParts.length > 0 ? descParts.join(" | ") : "";

      const units = s.quantity && s.quantity > 0 ? s.quantity : 1;
      const price = s.quantity && s.quantity > 0 
        ? parseFloat((s.price / s.quantity).toFixed(4)) 
        : parseFloat((s.price || 0).toFixed(4));

      return {
        name: itemName,
        description: itemDesc,
        units,
        price,
        tax: taxRate
      };
    });

    const goodsItemsV2 = (combinedSale.goodsSales || []).map(gs => {
      const itemName = gs.goodsForSale?.name || "Mercancía en venta";
      const itemDesc = gs.goodsForSale?.unit ? `Unidad: ${gs.goodsForSale.unit}` : "";
      const units = gs.quantity && gs.quantity > 0 ? gs.quantity : 1;
      const price = gs.quantity && gs.quantity > 0
        ? parseFloat((gs.price / gs.quantity).toFixed(4))
        : parseFloat((gs.price || 0).toFixed(4));

      return {
        name: itemName,
        description: itemDesc,
        units,
        price,
        tax: taxRate
      };
    });

    const itemsV2 = [...elabItemsV2, ...goodsItemsV2];

    let invoiceId = null;
    let invoiceNum = null;

    if (usedVersion === "v1") {
      const invoicePayload = {
        contactId: matchedContact.id,
        date: Math.floor(new Date(combinedSale.date || Date.now()).getTime() / 1000),
        notes: `Venta combinada registrada desde QuickTrace. ID: ${combinedSale.id}`,
        items: itemsV1
      };

      if (profile.holdedSeriesId?.trim()) {
        invoicePayload.seriesId = profile.holdedSeriesId.trim();
      }

      const invoiceRes = await fetch("https://api.holded.com/api/invoicing/v1/documents/invoice", {
        method: "POST",
        headers: { "key": apiKey, "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(invoicePayload)
      });

      const invoiceData = await invoiceRes.json().catch(() => ({}));

      if (!invoiceRes.ok || invoiceData.status === 0 || (!invoiceData.id && !invoiceData.documentNum)) {
        return NextResponse.json({
          error: `Error al generar factura en Holded: ${invoiceData.info || invoiceData.message || invoiceRes.statusText}`
        }, { status: 400 });
      }

      invoiceId = String(invoiceData.id || invoiceData.invoiceId || "");
      invoiceNum = String(invoiceData.documentNum || invoiceData.docNumber || invoiceId);
    } else {
      const invoicePayloadV2 = {
        contact_id: matchedContact.id,
        date: new Date(combinedSale.date || Date.now()).toISOString().slice(0, 10),
        notes: `Venta combinada registrada desde QuickTrace. ID: ${combinedSale.id}`,
        items: itemsV2
      };

      if (profile.holdedSeriesId?.trim()) {
        invoicePayloadV2.numbering_series_id = profile.holdedSeriesId.trim();
      }

      const invoiceRes = await fetch("https://api.holded.com/api/v2/invoices", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(invoicePayloadV2)
      });

      const invoiceData = await invoiceRes.json().catch(() => ({}));

      if (!invoiceRes.ok || (!invoiceData.id && !invoiceData.doc_number)) {
        return NextResponse.json({
          error: `Error al generar factura en Holded: ${invoiceData.detail || invoiceData.message || invoiceRes.statusText}`
        }, { status: 400 });
      }

      invoiceId = String(invoiceData.id || "");
      invoiceNum = String(invoiceData.doc_number || invoiceData.number || invoiceId);
    }

    const now = new Date();

    // Update combined sale record
    await prisma.combinedSale.update({
      where: { id: combinedSale.id },
      data: {
        holdedInvoiceId: invoiceId,
        holdedInvoiceNum: invoiceNum,
        invoicingProvider: "HOLDED",
        invoicedAt: now
      }
    });

    // Also update all individual elaboration sales belonging to this combined sale
    await prisma.elaborationSale.updateMany({
      where: { combinedSaleId: combinedSale.id },
      data: {
        holdedInvoiceId: invoiceId,
        holdedInvoiceNum: invoiceNum,
        invoicingProvider: "HOLDED",
        invoicedAt: now
      }
    });

    return NextResponse.json({
      success: true,
      invoiceId,
      invoiceNum,
      invoicedAt: now,
      message: `Factura ${invoiceNum} generada con éxito en Holded para la venta combinada.`
    });
  } catch (error) {
    console.error("Error creating combined sale invoice in Holded:", error);
    return NextResponse.json({
      error: "Error interno al procesar la factura con Holded."
    }, { status: 500 });
  }
}
