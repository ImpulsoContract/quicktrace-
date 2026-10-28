import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getIsbueInvoicePdf } from "@/lib/isbue";

export async function GET(request, { params }) {
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
    const sale = await prisma.elaborationSale.findUnique({
      where: { id: saleId },
      include: { clientProfile: true }
    });

    if (!sale) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && sale.clientProfileId !== profileId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const invoiceId = sale.isbueInvoiceId || sale.holdedInvoiceId;
    if (!invoiceId) {
      return NextResponse.json({ error: "Esta venta no tiene factura generada." }, { status: 400 });
    }

    const provider = sale.invoicingProvider || (sale.isbueInvoiceId ? "ISBUE" : "HOLDED");

    if (provider === "ISBUE") {
      const isbueRes = await getIsbueInvoicePdf({
        profile: sale.clientProfile,
        invoiceId
      });

      if (!isbueRes.ok || !isbueRes.response) {
        return NextResponse.json({ 
          error: isbueRes.error || "No se pudo descargar el PDF de la factura desde Isbue." 
        }, { status: 400 });
      }

      const contentType = isbueRes.response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await isbueRes.response.json();
        if (data.data || data.pdf) {
          const base64Str = data.data || data.pdf;
          const cleanBase64 = base64Str.replace(/^data:application\/pdf;base64,/, "");
          const buffer = Buffer.from(cleanBase64, 'base64');
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="Factura_${sale.isbueInvoiceNum || sale.holdedInvoiceNum || sale.id}.pdf"`
            }
          });
        }
      }

      const pdfBuffer = await isbueRes.response.arrayBuffer();
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="Factura_${sale.isbueInvoiceNum || sale.holdedInvoiceNum || sale.id}.pdf"`
        }
      });
    }

    const apiKey = sale.clientProfile?.holdedApiKey?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: "Clave API de Holded no configurada." }, { status: 400 });
    }

    // Try Holded API v1 first
    let holdedRes = await fetch(`https://api.holded.com/api/invoicing/v1/documents/invoice/${sale.holdedInvoiceId}/pdf`, {
      method: "GET",
      headers: {
        "key": apiKey,
        "Accept": "application/json, application/pdf"
      }
    });

    // If v1 failed (401/403/404), try Holded API v2
    if (!holdedRes.ok) {
      holdedRes = await fetch(`https://api.holded.com/api/v2/invoices/${sale.holdedInvoiceId}/pdf`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json, application/pdf"
        }
      });
    }

    if (!holdedRes.ok) {
      return NextResponse.json({ 
        error: "No se pudo descargar el PDF de la factura desde Holded." 
      }, { status: 400 });
    }

    const contentType = holdedRes.headers.get("content-type") || "";

    // If Holded returned JSON with base64 data
    if (contentType.includes("application/json")) {
      const data = await holdedRes.json();
      if (data.data) {
        const pdfBuffer = Buffer.from(data.data, "base64");
        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="Factura_${sale.holdedInvoiceNum || sale.id}.pdf"`
          }
        });
      }
    }

    // If Holded returned binary stream
    const pdfBuffer = await holdedRes.arrayBuffer();
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Factura_${sale.holdedInvoiceNum || sale.id}.pdf"`
      }
    });
  } catch (error) {
    console.error("Error fetching invoice PDF from Holded:", error);
    return NextResponse.json({ error: "Error interno al obtener el PDF de la factura." }, { status: 500 });
  }
}
