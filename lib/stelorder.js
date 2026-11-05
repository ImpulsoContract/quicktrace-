/**
 * STEL Order ERP / Invoicing integration helper
 */

export function normalizeStelorderUrl(apiUrl) {
  const url = (apiUrl || "https://app.stelorder.com/app").trim();
  return url.replace(/\/+$/, "");
}

export function getStelorderHeaders(apiKey) {
  return {
    "APIKEY": apiKey,
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "QuickTrace-ERP/1.0"
  };
}

/**
 * Tests connection with STEL Order API and retrieves numbering series for ordinary invoices
 */
export async function testStelorderConnection({ apiKey, apiUrl }) {
  if (!apiKey?.trim()) {
    return { success: false, error: "Debes introducir una clave API de STEL Order." };
  }

  const cleanKey = apiKey.trim();
  const baseUrl = normalizeStelorderUrl(apiUrl);
  const headers = getStelorderHeaders(cleanKey);

  let seriesList = [];
  let success = false;
  let lastError = "";

  // 1. Fetch numbering series for ORDINARYINVOICE
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const seriesRes = await fetch(`${baseUrl}/serialNumbers?type=ORDINARYINVOICE&limit=100`, {
      method: "GET",
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (seriesRes.ok) {
      const data = await seriesRes.json().catch(() => []);
      const rawSeries = Array.isArray(data) 
        ? data 
        : (Array.isArray(data.items) ? data.items : (Array.isArray(data.data) ? data.data : []));

      seriesList = rawSeries.map(s => ({
        id: String(s.id),
        name: s.name || (s.prefix ? `Serie ${s.prefix}` : `Serie ${s.id}`),
        prefix: s.prefix || "",
        default: Boolean(s.default)
      }));

      success = true;
    } else if (seriesRes.status === 401 || seriesRes.status === 403) {
      lastError = `Clave API de STEL Order no válida o sin permisos (Error HTTP ${seriesRes.status}). Genera una API Key desde STEL Order en Configuración > Funcionalidades > API.`;
    } else {
      const errText = await seriesRes.text().catch(() => "");
      try {
        const errJson = JSON.parse(errText);
        lastError = errJson.message || errJson.error || errJson.detail || `STEL Order devolvió código HTTP ${seriesRes.status}`;
      } catch (e) {
        lastError = `STEL Order devolvió código HTTP ${seriesRes.status}`;
      }
    }
  } catch (e) {
    if (e.name === "AbortError") {
      lastError = "Tiempo de espera agotado al conectar con STEL Order.";
    } else {
      lastError = e.message || "Error al conectar con STEL Order.";
    }
  }

  // 2. If series request failed but not 401/403, try company endpoint as fallback verification
  if (!success && !lastError.includes("401") && !lastError.includes("403")) {
    try {
      const compRes = await fetch(`${baseUrl}/company`, {
        method: "GET",
        headers
      });
      if (compRes.ok) {
        success = true;
      }
    } catch (e) {}
  }

  if (!success) {
    return {
      success: false,
      error: lastError || "No se pudo conectar con STEL Order. Comprueba que la API Key sea correcta."
    };
  }

  return {
    success: true,
    series: seriesList
  };
}

/**
 * Searches or creates a generic product/service item in STEL Order to use on invoice lines
 */
export async function getOrCreateStelorderItem({ apiKey, apiUrl }) {
  const baseUrl = normalizeStelorderUrl(apiUrl);
  const headers = getStelorderHeaders(apiKey);

  // 1. Try finding an existing service
  try {
    const sRes = await fetch(`${baseUrl}/services?limit=10`, { method: "GET", headers });
    if (sRes.ok) {
      const services = await sRes.json().catch(() => []);
      const list = Array.isArray(services) ? services : (services.items || services.data || []);
      if (list.length > 0) {
        return list[0].id;
      }
    }
  } catch (e) {
    console.error("Error finding STEL Order service:", e);
  }

  // 2. Try finding an existing product
  try {
    const pRes = await fetch(`${baseUrl}/products?limit=10`, { method: "GET", headers });
    if (pRes.ok) {
      const products = await pRes.json().catch(() => []);
      const list = Array.isArray(products) ? products : (products.items || products.data || []);
      if (list.length > 0) {
        return list[0].id;
      }
    }
  } catch (e) {
    console.error("Error finding STEL Order product:", e);
  }

  // 3. Create a generic service for QuickTrace if none exists
  try {
    const createRes = await fetch(`${baseUrl}/services`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Venta QuickTrace",
        description: "Servicio genérico para facturación de ventas emitidas desde QuickTrace"
      })
    });
    if (createRes.ok) {
      const created = await createRes.json().catch(() => ({}));
      if (created.id) return created.id;
    }
  } catch (e) {
    console.error("Error creating STEL Order service:", e);
  }

  return 1; // Fallback ID if service creation cannot complete
}

/**
 * Finds or creates a customer in STEL Order
 */
export async function findOrCreateStelorderCustomer({ apiKey, apiUrl, customer, autoCreate = true }) {
  const baseUrl = normalizeStelorderUrl(apiUrl);
  const headers = getStelorderHeaders(apiKey);
  const cleanNif = customer?.nif ? customer.nif.toUpperCase().replace(/\s+/g, '') : "";
  const contactName = (customer?.fiscalName || customer?.commercialName || "Cliente").trim();

  // 1. Search existing client by NIF
  if (cleanNif) {
    try {
      const res = await fetch(`${baseUrl}/clients?tax-identification-number=${encodeURIComponent(cleanNif)}&limit=10`, {
        method: "GET",
        headers
      });
      if (res.ok) {
        const data = await res.json().catch(() => []);
        const list = Array.isArray(data) ? data : (data.items || data.data || []);
        const matched = list.find(c => {
          const tId = c["tax-identification-number"] || c.tax_identification_number || c.cif || c.nif || "";
          return tId.toUpperCase().replace(/\s+/g, '') === cleanNif;
        }) || list[0];
        if (matched?.id) {
          return { found: true, client: matched };
        }
      }
    } catch (e) {
      console.error("Error searching STEL Order client by NIF:", e);
    }
  }

  // 2. Search existing client by Name
  if (contactName) {
    try {
      const res = await fetch(`${baseUrl}/clients?name=${encodeURIComponent(contactName)}&limit=10`, {
        method: "GET",
        headers
      });
      if (res.ok) {
        const data = await res.json().catch(() => []);
        const list = Array.isArray(data) ? data : (data.items || data.data || []);
        if (list.length > 0 && list[0]?.id) {
          return { found: true, client: list[0] };
        }
      }
    } catch (e) {
      console.error("Error searching STEL Order client by Name:", e);
    }
  }

  // 3. Client not found
  if (!autoCreate) {
    return {
      found: false,
      contactNotFound: true,
      customerName: contactName,
      customerNif: customer?.nif || cleanNif
    };
  }

  // 4. Auto-create client in STEL Order
  try {
    const newClientPayload = {
      name: contactName,
      "legal-name": customer?.fiscalName?.trim() || contactName,
      "tax-identification-number": cleanNif || undefined,
      phone: (customer?.phone || customer?.phone2)?.trim() || undefined,
      email: customer?.email?.trim() || undefined,
      comments: "Cliente creado automáticamente desde QuickTrace"
    };

    if (customer?.address || customer?.city || customer?.postalCode || customer?.province) {
      newClientPayload["main-address"] = {
        "address-data": customer?.address?.trim() || "",
        "city-town": customer?.city?.trim() || "",
        "postal-code": customer?.postalCode?.trim() || "",
        "province": customer?.province?.trim() || "",
        "country-code": "ES"
      };
    }

    const createRes = await fetch(`${baseUrl}/clients`, {
      method: "POST",
      headers,
      body: JSON.stringify(newClientPayload)
    });

    const createData = await createRes.json().catch(() => ({}));
    if (createRes.ok && createData.id) {
      return { found: true, client: createData };
    } else {
      const errDetail = createData.message || createData.error || createData.detail || `HTTP ${createRes.status}`;
      return {
        found: false,
        error: `Error al crear el cliente en STEL Order: ${errDetail}`
      };
    }
  } catch (e) {
    return {
      found: false,
      error: `Error al crear el cliente en STEL Order: ${e.message}`
    };
  }
}

/**
 * Creates an invoice in STEL Order
 */
export async function createStelorderInvoice({ profile, customer, items, notes, autoCreateContact = true }) {
  const apiKey = profile?.stelorderApiKey?.trim();
  if (!apiKey) {
    return {
      success: false,
      error: "Debes configurar tu API Key de STEL Order en la sección de 'Configuración del negocio' para poder emitir facturas."
    };
  }

  const baseUrl = normalizeStelorderUrl(profile?.stelorderApiUrl);
  const headers = getStelorderHeaders(apiKey);

  // 1. Get or create customer in STEL Order
  const clientResult = await findOrCreateStelorderCustomer({
    apiKey,
    apiUrl: profile?.stelorderApiUrl,
    customer,
    autoCreate: autoCreateContact
  });

  if (!clientResult.found) {
    if (clientResult.contactNotFound) {
      return {
        success: false,
        contactNotFound: true,
        customerName: clientResult.customerName,
        customerNif: clientResult.customerNif,
        message: "El cliente no existe en STEL Order. ¿Deseas darlo de alta automáticamente?"
      };
    }
    return {
      success: false,
      error: clientResult.error || "No se pudo vincular el cliente en STEL Order."
    };
  }

  const clientId = clientResult.client.id;

  // 2. Get item id to satisfy STEL Order line-type ITEM requirement
  const defaultItemId = await getOrCreateStelorderItem({ apiKey, apiUrl: profile?.stelorderApiUrl });

  const taxRate = profile.stelorderTax !== undefined && profile.stelorderTax !== null 
    ? profile.stelorderTax 
    : 10;

  // 3. Format lines
  const formattedLines = items.map(it => {
    const units = it.units && it.units > 0 ? it.units : (it.quantity && it.quantity > 0 ? it.quantity : 1);
    const price = it.price !== undefined ? it.price : (it.subtotal !== undefined ? it.subtotal : 0);
    const lineTax = it.tax !== undefined ? it.tax : taxRate;

    return {
      "line-type": "ITEM",
      "item-id": parseInt(defaultItemId) || 1,
      "item-name": it.name || "Producto / Elaboración",
      "item-description": it.desc || it.description || "",
      "units": units,
      "item-base-price": parseFloat(price.toFixed(4)),
      "primary-tax-percentage": lineTax
    };
  });

  // 4. Build invoice payload
  const invoicePayload = {
    "account-id": parseInt(clientId),
    "comments": notes || "Factura emitida desde QuickTrace",
    "lines": formattedLines
  };

  if (profile.stelorderSeriesId && !isNaN(parseInt(profile.stelorderSeriesId))) {
    invoicePayload["serial-number-id"] = parseInt(profile.stelorderSeriesId);
  }

  // 5. Send POST to /app/ordinaryInvoices
  try {
    const invoiceRes = await fetch(`${baseUrl}/ordinaryInvoices`, {
      method: "POST",
      headers,
      body: JSON.stringify(invoicePayload)
    });

    const resText = await invoiceRes.text().catch(() => "");
    let invoiceData = {};
    try {
      invoiceData = JSON.parse(resText);
    } catch (e) {}

    if (invoiceRes.ok && (invoiceData.id || invoiceData.reference || invoiceData["full-reference"])) {
      const invoiceId = String(invoiceData.id || "");
      const invoiceNum = String(invoiceData.reference || invoiceData["full-reference"] || invoiceData.id || "");

      return {
        success: true,
        invoiceId,
        invoiceNum,
        pdfPath: invoiceData["pdf-path"] || ""
      };
    } else {
      const errDetail = invoiceData.message || invoiceData.error || invoiceData.detail || resText || `Error HTTP ${invoiceRes.status}`;
      return {
        success: false,
        error: `Error al generar factura en STEL Order: ${errDetail}`
      };
    }
  } catch (e) {
    return {
      success: false,
      error: `Error al conectar con STEL Order para crear la factura: ${e.message}`
    };
  }
}

/**
 * Downloads invoice PDF from STEL Order
 */
export async function getStelorderInvoicePdf({ profile, invoiceId }) {
  const apiKey = profile?.stelorderApiKey?.trim();
  if (!apiKey) {
    return { error: "Clave API de STEL Order no configurada." };
  }

  const baseUrl = normalizeStelorderUrl(profile?.stelorderApiUrl);
  const headers = {
    "APIKEY": apiKey,
    "Accept": "application/pdf, application/json"
  };

  // 1. Get the invoice to inspect pdf-path
  try {
    const invRes = await fetch(`${baseUrl}/ordinaryInvoices/${invoiceId}`, {
      method: "GET",
      headers: getStelorderHeaders(apiKey)
    });

    if (invRes.ok) {
      const invData = await invRes.json().catch(() => ({}));
      const item = Array.isArray(invData) ? invData[0] : invData;
      const pdfPath = item?.["pdf-path"] || item?.pdf_path;

      if (pdfPath && typeof pdfPath === "string" && pdfPath.trim()) {
        const cleanPdfPath = pdfPath.trim();
        let downloadUrl = cleanPdfPath;
        if (!cleanPdfPath.startsWith("http://") && !cleanPdfPath.startsWith("https://")) {
          downloadUrl = cleanPdfPath.startsWith("/") 
            ? `https://app.stelorder.com${cleanPdfPath}`
            : `https://app.stelorder.com/app/${cleanPdfPath}`;
        }

        const pdfRes = await fetch(downloadUrl, { method: "GET", headers });
        if (pdfRes.ok) {
          return { ok: true, response: pdfRes };
        }
      }
    }
  } catch (e) {
    console.error("Error retrieving invoice data from STEL Order:", e);
  }

  // 2. Try candidate direct PDF endpoints
  const candidateEndpoints = [
    `${baseUrl}/ordinaryInvoices/${invoiceId}/pdf`,
    `${baseUrl}/ordinaryInvoices/${invoiceId}/download`,
    `${baseUrl}/invoices/${invoiceId}/pdf`
  ];

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetch(endpoint, { method: "GET", headers });
      if (res.ok) {
        return { ok: true, response: res };
      }
    } catch (e) {}
  }

  return { ok: false, error: "No se pudo descargar el PDF de la factura desde STEL Order. Puedes descargarla directamente desde tu panel de STEL Order." };
}
