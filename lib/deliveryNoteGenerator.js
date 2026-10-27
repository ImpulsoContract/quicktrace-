import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates and downloads or opens an A4 Delivery Note (Albarán de entrega) in PDF.
 *
 * @param {Object} options
 * @param {Object} options.sale - The sale object (ElaborationSale or CombinedSale)
 * @param {Object} [options.elaboration] - Parent elaboration if sale is an ElaborationSale
 * @param {Object} [options.customer] - Customer data (if not embedded in sale)
 * @param {Object} options.profile - Business ClientProfile data
 * @param {boolean} options.withPrices - Whether to include prices in the delivery note
 * @param {string} [options.locale='es'] - Active language code
 * @param {Function} options.t - Translation function from useI18n
 */
export async function generateDeliveryNotePDF({
  sale,
  elaboration = null,
  customer = null,
  profile = {},
  withPrices = false,
  locale = 'es',
  t = (key) => key
}) {
  if (!sale) return;

  // 1. If this is an elaboration sale that belongs to a combined sale, fetch the entire combined sale
  let combinedSaleData = null;
  if (sale.sales && Array.isArray(sale.sales)) {
    // Already a CombinedSale
    combinedSaleData = sale;
  } else if (sale.combinedSaleId) {
    try {
      const res = await fetch(`/api/client/combined-sales/${sale.combinedSaleId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          combinedSaleData = json.data;
        }
      }
    } catch (e) {
      console.warn("Could not fetch full combined sale details, falling back to line item", e);
    }
  }

  // 2. Resolve Customer
  const targetCustomer = combinedSaleData?.customer || sale.customer || customer || null;
  const customerName = targetCustomer?.commercialName || targetCustomer?.fiscalName || t('delivery_note.direct_sale') || "Venta directa / Contado";
  const customerFiscalName = targetCustomer?.fiscalName && targetCustomer?.fiscalName !== targetCustomer?.commercialName ? targetCustomer.fiscalName : "";
  const customerNif = targetCustomer?.nif || "";
  const customerAddress = targetCustomer?.address || "";
  const customerCityLine = [
    targetCustomer?.postalCode,
    targetCustomer?.city,
    targetCustomer?.province ? `(${targetCustomer.province})` : ""
  ].filter(Boolean).join(" ");
  const customerContact = [
    targetCustomer?.phone,
    targetCustomer?.email
  ].filter(Boolean).join(" • ");

  // 3. Resolve Issuer / Profile
  const companyName = profile?.razonSocial || "Empresa";
  const companyNif = profile?.nif || "";
  const companyAddress = profile?.address || "";
  const companyCityLine = [
    profile?.postalCode,
    profile?.city,
    profile?.province ? `(${profile.province})` : ""
  ].filter(Boolean).join(" ");
  const companyContact = [
    profile?.phone,
    profile?.user?.email
  ].filter(Boolean).join(" • ");

  // 4. Resolve Currency
  const currencyCode = profile?.currency || "EUR";
  const currencySymbol = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    MXN: "$",
    COP: "$"
  }[currencyCode] || "€";

  // 5. Resolve Document Reference, Date, Seller & Notes
  const isCombined = Boolean(combinedSaleData);
  const docId = isCombined ? combinedSaleData.id : sale.id;
  const docNumber = isCombined
    ? `ALB-C${String(docId).padStart(5, '0')}`
    : `ALB-${String(docId).padStart(5, '0')}`;

  const rawDate = combinedSaleData?.date || sale.date || sale.createdAt || new Date();
  const dateObj = new Date(rawDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'pt' ? 'pt-PT' : 'es-ES')
    : new Date().toLocaleDateString();

  const sellerName = combinedSaleData?.sellerName || combinedSaleData?.seller?.name || null;
  const notes = combinedSaleData?.notes || sale.notes || "";

  // 6. Build Line Items
  let items = [];
  let grandTotal = 0;

  if (isCombined) {
    // Elaborations
    (combinedSaleData.sales || []).forEach((s) => {
      const prodName = s.elaboration?.recipe?.name || s.elaboration?.name || t('combined_sales.badge_elaboration') || "Elaboración";
      const lot = s.elaboration?.name || "-";
      const unit = s.elaboration?.quantityUnit || "ud";
      const qtyStr = s.quantity != null ? `${s.quantity} ${unit}` : `${s.percentage}%`;
      const numQty = s.quantity != null && s.quantity > 0 ? s.quantity : 1;
      const priceVal = parseFloat(s.price) || 0;
      const unitPriceVal = priceVal / numQty;

      items.push({
        type: 'elaboration',
        name: prodName,
        lot,
        quantity: qtyStr,
        unitPrice: unitPriceVal,
        totalPrice: priceVal
      });
      grandTotal += priceVal;
    });

    // Goods for sale
    (combinedSaleData.goodsSales || []).forEach((gs) => {
      const prodName = gs.goodsForSale?.name || t('combined_sales.badge_goods') || "Mercancía";
      const lot = "-";
      const unit = gs.goodsForSale?.unit || "ud";
      const qtyStr = `${gs.quantity} ${unit}`;
      const numQty = gs.quantity != null && gs.quantity > 0 ? gs.quantity : 1;
      const priceVal = parseFloat(gs.price) || 0;
      const unitPriceVal = priceVal / numQty;

      items.push({
        type: 'goods',
        name: prodName,
        lot,
        quantity: qtyStr,
        unitPrice: unitPriceVal,
        totalPrice: priceVal
      });
      grandTotal += priceVal;
    });

    if (combinedSaleData.totalPrice && combinedSaleData.totalPrice > 0) {
      grandTotal = combinedSaleData.totalPrice;
    }
  } else {
    // Single Elaboration Sale
    const currentElab = elaboration || sale.elaboration || {};
    const prodName = currentElab.recipe?.name || currentElab.name || "Elaboración";
    const lot = currentElab.name || "-";
    const unit = currentElab.quantityUnit || "ud";
    const qtyStr = sale.quantity != null 
      ? `${sale.quantity} ${unit}`
      : `${sale.percentage}%`;
    const numQty = sale.quantity != null && sale.quantity > 0 ? sale.quantity : 1;
    const priceVal = parseFloat(sale.price) || 0;
    const unitPriceVal = priceVal / numQty;

    items.push({
      type: 'elaboration',
      name: prodName,
      lot,
      quantity: qtyStr,
      unitPrice: unitPriceVal,
      totalPrice: priceVal
    });
    grandTotal = priceVal;
  }

  // 7. Initialize jsPDF Document (A4: 210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const marginX = 15;
  const contentWidth = pageWidth - (marginX * 2); // 180 mm

  // ==========================================
  // TOP SECTION: EMISOR (Left) & ALBARÁN CARD (Right)
  // ==========================================
  // Left: Company Data
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(66, 98, 22); // Corporate green #426216
  doc.text(companyName.toUpperCase(), marginX, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // Slate 600

  let currentY = 25;
  if (companyNif) {
    doc.text(`CIF / NIF: ${companyNif}`, marginX, currentY);
    currentY += 4.5;
  }
  if (companyAddress) {
    doc.text(companyAddress, marginX, currentY);
    currentY += 4.5;
  }
  if (companyCityLine) {
    doc.text(companyCityLine, marginX, currentY);
    currentY += 4.5;
  }
  if (companyContact) {
    doc.text(companyContact, marginX, currentY);
    currentY += 4.5;
  }

  // Right: Document Meta Box
  const metaBoxX = 125;
  const metaBoxWidth = 70;
  const metaBoxHeight = sellerName ? 27 : 23;

  doc.setFillColor(245, 248, 240); // Soft corporate green tint
  doc.setDrawColor(66, 98, 22);
  doc.setLineWidth(0.4);
  doc.roundedRect(metaBoxX, 13, metaBoxWidth, metaBoxHeight, 2, 2, 'FD');

  const centerX = metaBoxX + (metaBoxWidth / 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(66, 98, 22);
  doc.text(t('delivery_note.pdf_title') || "ALBARÁN DE ENTREGA", centerX, 19.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text(`${t('delivery_note.number_label') || "Albarán Nº"}: ${docNumber}`, centerX, 25, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${t('delivery_note.date_label') || "Fecha"}: ${formattedDate}`, centerX, 30, { align: 'center' });

  if (sellerName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${t('delivery_note.seller_label') || "Vendedor"}: ${sellerName}`, centerX, 35, { align: 'center' });
  }

  // ==========================================
  // CUSTOMER / DELIVERY LOCATION BOX
  // ==========================================
  const custBoxY = Math.max(currentY + 2, 43);
  const custBoxHeight = 25;

  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, custBoxY, contentWidth, custBoxHeight, 2, 2, 'FD');

  // Customer Box Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(t('delivery_note.customer_title') || "DATOS DEL CLIENTE / LUGAR DE ENTREGA", marginX + 4, custBoxY + 5);

  // Customer Details (Two Columns)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(customerName, marginX + 4, custBoxY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  let custSubY = custBoxY + 15.5;
  if (customerFiscalName) {
    doc.text(`Razón fiscal: ${customerFiscalName}`, marginX + 4, custSubY);
    custSubY += 4;
  }
  if (customerNif) {
    doc.text(`NIF/CIF: ${customerNif}`, marginX + 4, custSubY);
  }

  // Customer Right Column (Address & Contact)
  const custRightX = marginX + 90;
  let custRightY = custBoxY + 11;
  if (customerAddress) {
    doc.text(customerAddress, custRightX, custRightY);
    custRightY += 4.5;
  }
  if (customerCityLine) {
    doc.text(customerCityLine, custRightX, custRightY);
    custRightY += 4.5;
  }
  if (customerContact) {
    doc.text(customerContact, custRightX, custRightY);
  }

  // ==========================================
  // ITEMS TABLE (autoTable)
  // ==========================================
  const tableStartY = custBoxY + custBoxHeight + 6;

  let tableHeaders = [];
  let tableRows = [];
  let columnStyles = {};

  if (withPrices) {
    tableHeaders = [[
      t('delivery_note.col_item') || "#",
      t('delivery_note.col_description') || "Descripción / Producto",
      t('delivery_note.col_lot') || "Lote trazabilidad",
      t('delivery_note.col_quantity') || "Cantidad",
      t('delivery_note.col_unit_price') || "Precio Ud.",
      t('delivery_note.col_total') || "Total"
    ]];

    tableRows = items.map((it, idx) => [
      String(idx + 1),
      it.name,
      it.lot,
      it.quantity,
      `${it.unitPrice.toFixed(2)} ${currencySymbol}`,
      `${it.totalPrice.toFixed(2)} ${currencySymbol}`
    ]);

    columnStyles = {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 78 },
      2: { cellWidth: 36 },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 18, halign: 'right' },
      5: { cellWidth: 18, halign: 'right', fontStyle: 'bold' }
    };
  } else {
    tableHeaders = [[
      t('delivery_note.col_item') || "#",
      t('delivery_note.col_description') || "Descripción / Producto",
      t('delivery_note.col_lot') || "Lote trazabilidad",
      t('delivery_note.col_quantity') || "Cantidad"
    ]];

    tableRows = items.map((it, idx) => [
      String(idx + 1),
      it.name,
      it.lot,
      it.quantity
    ]);

    columnStyles = {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 43 },
      3: { cellWidth: 30, halign: 'right' }
    };
  }

  const footRow = withPrices ? [[
    "",
    "",
    "",
    "",
    t('delivery_note.table_total') || "TOTAL",
    `${grandTotal.toFixed(2)} ${currencySymbol}`
  ]] : undefined;

  autoTable(doc, {
    head: tableHeaders,
    body: tableRows,
    startY: tableStartY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: {
      fillColor: [66, 98, 22],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [250, 252, 248]
    },
    columnStyles,
    foot: footRow,
    footStyles: withPrices ? {
      fillColor: [240, 243, 235],
      textColor: [66, 98, 22],
      fontStyle: 'bold',
      halign: 'right',
      fontSize: 9
    } : undefined
  });

  let lastY = doc.lastAutoTable.finalY + 6;

  // ==========================================
  // OBSERVACIONES / NOTES (If present)
  // ==========================================
  if (notes && notes.trim()) {
    if (lastY + 16 > 250) {
      doc.addPage();
      lastY = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.roundedRect(marginX, lastY, contentWidth, 13, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${t('delivery_note.notes_title') || "Observaciones"}:`, marginX + 3, lastY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const splitNotes = doc.splitTextToSize(notes.trim(), contentWidth - 6);
    doc.text(splitNotes, marginX + 3, lastY + 9);

    lastY += 17;
  }

  // ==========================================
  // SIGNATURES SECTION
  // ==========================================
  const signHeight = 28;
  const signWidth = (contentWidth - 6) / 2; // ~87 mm each

  let signY = Math.max(lastY + 4, 238);
  if (signY + signHeight > 280) {
    doc.addPage();
    signY = 238;
  }

  // Box 1: Entregado por (Emisor)
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginX, signY, signWidth, signHeight, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(t('delivery_note.delivered_by') || "ENTREGADO POR (EMPRESA / TRANSPORTE):", marginX + 3, signY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(companyName, marginX + 3, signY + 9.5);
  doc.text(t('delivery_note.signature') || "Firma:", marginX + 3, signY + 24);

  // Box 2: Recibido conforme (Cliente)
  const signRightX = marginX + signWidth + 6;
  doc.roundedRect(signRightX, signY, signWidth, signHeight, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(t('delivery_note.received_by') || "RECIBIDO CONFORME (CLIENTE):", signRightX + 3, signY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(t('delivery_note.name_dni') || "Nombre / DNI:", signRightX + 3, signY + 10);
  doc.text(t('delivery_note.date_signature') || "Fecha y firma:", signRightX + 3, signY + 24);

  // ==========================================
  // FOOTER ON ALL PAGES
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400

    const disclaimer = t('delivery_note.disclaimer') || "Documento acreditativo de entrega física de mercancía. No válido como factura fiscal.";
    doc.text(disclaimer, marginX, 289);

    const pageStr = `${t('delivery_note.page_indicator') || "Pág."} ${i} / ${totalPages}`;
    doc.text(pageStr, pageWidth - marginX, 289, { align: 'right' });
  }

  // ==========================================
  // OUTPUT & DOWNLOAD / OPEN
  // ==========================================
  const fileName = `${docNumber}_${withPrices ? 'valorado' : 'sin_precios'}.pdf`;

  try {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const newTab = window.open(blobUrl, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      doc.save(fileName);
    }
  } catch (err) {
    console.error("Error opening delivery note tab, saving directly:", err);
    doc.save(fileName);
  }
}
