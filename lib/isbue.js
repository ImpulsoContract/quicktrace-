/**
 * Isbue ERP / Invoicing integration helper
 */

export function normalizeIsbueUrl(apiUrl) {
  const url = (apiUrl || "https://api.isbue.io/v1").trim();
  return url.replace(/\/+$/, "");
}

export function getIsbueHeaders(apiKey) {
  return {
    "Authorization": `Bearer ${apiKey}`,
    "X-API-Key": apiKey,
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "QuickTrace-ERP/1.0"
  };
}

/**
 * Tests connection with Isbue API and retrieves numbering series if available
 */
export async function testIsbueConnection({ apiKey, apiUrl }) {
  if (!apiKey) {
    return { success: false, error: "Debes introducir una clave API o Token de Isbue." };
  }

  const baseUrl = normalizeIsbueUrl(apiUrl);
  const headers = getIsbueHeaders(apiKey);

  const candidateEndpoints = [
    `${baseUrl}/series`,
    `${baseUrl}/invoicing/series`,
    `${baseUrl}/invoices/series`,
    `${baseUrl}/company`,
    `${baseUrl}/me`,
    `${baseUrl}/status`
  ];

  let seriesList = [];
  let success = false;
  let lastError = "";

  for (const endpoint of candidateEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(endpoint, {
        method: "GET",
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const rawSeries = Array.isArray(data) 
          ? data 
          : (Array.isArray(data.series) ? data.series : (Array.isArray(data.items) ? data.items : (Array.isArray(data.data) ? data.data : [])));

        if (rawSeries.length > 0) {
          seriesList = rawSeries.map(s => ({
            id: String(s.id || s.code || s.name),
            name: s.name || s.title || s.code || String(s.id),
            prefix: s.prefix || s.series || ""
          }));
        }

        success = true;
        break;
      } else if (res.status === 401 || res.status === 403) {
        lastError = "Clave API o Token no válido en Isbue (Error " + res.status + "). Comprueba tus credenciales en Isbue.";
        break;
      } else if (res.status !== 404) {
        const errText = await res.text().catch(() => "");
        try {
          const errJson = JSON.parse(errText);
          lastError = errJson.message || errJson.error || errJson.detail || "";
        } catch (e) {
          lastError = `Isbue devolvió código de error HTTP ${res.status}`;
        }
      }
    } catch (e) {
      if (e.name === "AbortError") {
        lastError = "Tiempo de espera agotado al conectar con Isbue.";
      } else {
        lastError = e.message || "Error al conectar con el servidor de Isbue.";
      }
    }
  }

  if (!success) {
    return {
      success: false,
      error: lastError || "No se pudo establecer conexión con Isbue. Revisa la URL del endpoint y la clave API."
    };
  }

  return {
    success: true,
    series: seriesList
  };
}

/**
 * Creates an invoice in Isbue
 */
export async function createIsbueInvoice({ profile, customer, items, notes, autoCreateContact = true }) {
  const apiKey = profile?.isbueApiKey?.trim();
  if (!apiKey) {
    return {
      success: false,
      error: "Debes configurar tu API Key de Isbue en la sección de 'Configuración del negocio' para poder emitir facturas."
    };
  }

  const baseUrl = normalizeIsbueUrl(profile?.isbueApiUrl);
  const headers = getIsbueHeaders(apiKey);
  const cleanNif = customer?.nif ? customer.nif.toUpperCase().replace(/\s+/g, '') : "";

  const contactName = (customer?.fiscalName || customer?.commercialName || "Cliente").trim();
  const taxRate = profile.isbueTax !== undefined && profile.isbueTax !== null ? profile.isbueTax : 10;

  // Invoice lines formatting
  const formattedLines = items.map(it => {
    const units = it.units && it.units > 0 ? it.units : (it.quantity && it.quantity > 0 ? it.quantity : 1);
    const price = it.price !== undefined ? it.price : (it.subtotal !== undefined ? it.subtotal : 0);
    return {
      name: it.name || "Producto",
      description: it.desc || it.description || "",
      quantity: units,
      units: units,
      price: price,
      unit_price: price,
      tax: it.tax !== undefined ? it.tax : taxRate,
      vat: it.tax !== undefined ? it.tax : taxRate
    };
  });

  const invoicePayload = {
    customer: {
      name: contactName,
      fiscal_name: customer?.fiscalName || contactName,
      trade_name: customer?.commercialName || contactName,
      nif: cleanNif,
      tax_id: cleanNif,
      email: customer?.email?.trim() || undefined,
      phone: (customer?.phone || customer?.phone2)?.trim() || undefined,
      address: customer?.address?.trim() || "",
      city: customer?.city?.trim() || "",
      postal_code: customer?.postalCode?.trim() || "",
      province: customer?.province?.trim() || "",
      country: "ES"
    },
    series: profile.isbueSeriesId?.trim() || undefined,
    series_id: profile.isbueSeriesId?.trim() || undefined,
    date: new Date().toISOString().slice(0, 10),
    notes: notes || "Factura emitida desde QuickTrace",
    items: formattedLines,
    lines: formattedLines
  };

  const invoiceEndpoints = [
    `${baseUrl}/invoices`,
    `${baseUrl}/invoicing/invoices`,
    `${baseUrl}/facturas`
  ];

  let invoiceData = null;
  let lastError = "";

  for (const endpoint of invoiceEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(invoicePayload)
      });

      const responseText = await res.text().catch(() => "");
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (e) {}

      if (res.ok && (data.id || data.invoice_id || data.number || data.doc_number || data.uuid)) {
        invoiceData = data;
        break;
      } else {
        lastError = data.message || data.error || data.detail || responseText || `Error HTTP ${res.status}`;
      }
    } catch (e) {
      lastError = e.message || "Error al conectar con Isbue para crear la factura.";
    }
  }

  if (!invoiceData) {
    return {
      success: false,
      error: `Error al generar factura en Isbue: ${lastError}`
    };
  }

  const invoiceId = String(invoiceData.id || invoiceData.invoice_id || invoiceData.uuid || invoiceData.number || "");
  const invoiceNum = String(invoiceData.number || invoiceData.invoice_number || invoiceData.doc_number || invoiceData.code || invoiceId);

  return {
    success: true,
    invoiceId,
    invoiceNum
  };
}

/**
 * Downloads invoice PDF from Isbue
 */
export async function getIsbueInvoicePdf({ profile, invoiceId }) {
  const apiKey = profile?.isbueApiKey?.trim();
  if (!apiKey) {
    return { error: "Clave API de Isbue no configurada." };
  }

  const baseUrl = normalizeIsbueUrl(profile?.isbueApiUrl);
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "X-API-Key": apiKey,
    "Accept": "application/pdf, application/json"
  };

  const candidatePdfEndpoints = [
    `${baseUrl}/invoices/${invoiceId}/pdf`,
    `${baseUrl}/invoicing/invoices/${invoiceId}/pdf`,
    `${baseUrl}/facturas/${invoiceId}/pdf`
  ];

  for (const endpoint of candidatePdfEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers
      });

      if (res.ok) {
        return { ok: true, response: res };
      }
    } catch (e) {}
  }

  return { ok: false, error: "No se pudo descargar el PDF de la factura desde Isbue." };
}
