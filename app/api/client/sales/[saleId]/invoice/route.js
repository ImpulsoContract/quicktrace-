import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "CLIENT" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const saleId = parseInt(params.saleId);
    if (isNaN(saleId)) {
      return NextResponse.json({ error: "ID de venta inválido" }, { status: 400 });
    }

    const profileId = session.user.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "Perfil de cliente no encontrado" }, { status: 404 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { id: profileId }
    });

    const apiKey = profile?.holdedApiKey?.trim();
    if (!apiKey) {
      return NextResponse.json({ 
        error: "Debes configurar tu API Key de Holded en la sección de 'Configuración del negocio' para poder emitir facturas." 
      }, { status: 400 });
    }

    const sale = await prisma.elaborationSale.findUnique({
      where: { id: saleId },
      include: {
        customer: true,
        combinedSale: {
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
        },
        elaboration: {
          include: {
            recipe: true
          }
        }
      }
    });

    if (!sale) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && sale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Check if already invoiced
    if (sale.holdedInvoiceId) {
      return NextResponse.json({
        success: false,
        alreadyInvoiced: true,
        invoiceNum: sale.holdedInvoiceNum,
        invoiceId: sale.holdedInvoiceId,
        error: `Esta venta ya ha sido facturada previamente (${sale.holdedInvoiceNum || sale.holdedInvoiceId}).`
      }, { status: 400 });
    }

    const isCombined = !!(sale.combinedSaleId && sale.combinedSale);
    const activeCustomer = isCombined ? (sale.combinedSale.customer || sale.customer) : sale.customer;

    // Check customer presence
    if (!activeCustomer) {
      return NextResponse.json({
        error: "La venta debe estar asociada a un cliente registrado para poder generar una factura."
      }, { status: 400 });
    }

    // Check NIF presence
    const customerNif = activeCustomer.nif?.trim();
    if (!customerNif) {
      return NextResponse.json({
        error: `El cliente "${activeCustomer.commercialName}" no tiene NIF/CIF informado. Por favor, edita los datos del cliente y añade su NIF/CIF.`
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
          customerName: activeCustomer.fiscalName || activeCustomer.commercialName,
          customerNif: customerNif,
          message: "El cliente no existe en Holded. ¿Deseas darlo de alta automáticamente?"
        }, { status: 200 });
      }

      // Create contact in Holded
      const contactName = (activeCustomer.fiscalName || activeCustomer.commercialName || "Cliente").trim();
      
      if (usedVersion === "v1") {
        const createPayloadV1 = {
          name: contactName,
          tradeName: (activeCustomer.commercialName || "").trim() || undefined,
          code: customerNif,
          email: activeCustomer.email?.trim() || undefined,
          phone: (activeCustomer.phone || activeCustomer.phone2)?.trim() || undefined,
          billAddress: {
            address: activeCustomer.address?.trim() || "",
            postalCode: activeCustomer.postalCode?.trim() || "",
            city: activeCustomer.city?.trim() || "",
            province: activeCustomer.province?.trim() || "",
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
          email: activeCustomer.email?.trim() || undefined,
          phone: (activeCustomer.phone || activeCustomer.phone2)?.trim() || undefined,
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

    // 3. Build invoice items (single sale or full combined sale)
    const taxRate = profile.holdedTax !== undefined && profile.holdedTax !== null 
      ? profile.holdedTax 
      : 10;

    const salesList = isCombined ? sale.combinedSale.sales : [sale];

    const itemsV1 = salesList.map(s => {
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

    const itemsV2 = salesList.map(s => {
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

    let invoiceId = null;
    let invoiceNum = null;
    const invoiceNotes = isCombined 
      ? `Venta combinada registrada desde QuickTrace. ID: ${sale.combinedSaleId}` 
      : `Venta registrada desde QuickTrace. Venta ID: ${sale.id}`;

    if (usedVersion === "v1") {
      const invoicePayload = {
        contactId: matchedContact.id,
        date: Math.floor(new Date(sale.date || Date.now()).getTime() / 1000),
        notes: invoiceNotes,
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
        date: new Date(sale.date || Date.now()).toISOString().slice(0, 10),
        notes: invoiceNotes,
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

    // Save invoice info in database
    if (isCombined) {
      await prisma.combinedSale.update({
        where: { id: sale.combinedSaleId },
        data: {
          holdedInvoiceId: invoiceId,
          holdedInvoiceNum: invoiceNum,
          invoicedAt: now
        }
      });
      await prisma.elaborationSale.updateMany({
        where: { combinedSaleId: sale.combinedSaleId },
        data: {
          holdedInvoiceId: invoiceId,
          holdedInvoiceNum: invoiceNum,
          invoicedAt: now
        }
      });
    } else {
      await prisma.elaborationSale.update({
        where: { id: sale.id },
        data: {
          holdedInvoiceId: invoiceId,
          holdedInvoiceNum: invoiceNum,
          invoicedAt: now
        }
      });
    }

    return NextResponse.json({
      success: true,
      invoiceId,
      invoiceNum,
      invoicedAt: now,
      message: `Factura ${invoiceNum} generada con éxito en Holded.`
    });
  } catch (error) {
    console.error("Error creating invoice in Holded:", error);
    return NextResponse.json({
      error: "Error interno al procesar la factura con Holded."
    }, { status: 500 });
  }
}
