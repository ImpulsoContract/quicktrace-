/**
 * Crea un contacto en Clientify y le asigna una etiqueta.
 * @param {Object} data - Datos del contacto
 */
export async function createClientifyContact({ email, name, phone, razonSocial }) {
  const apiKey = process.env.CLIENTIFY_API_KEY;

  if (!apiKey) {
    console.warn('[Clientify] API Key missing. Skipping CRM sync.');
    return;
  }

  try {
    // 1. Buscar si el contacto ya existe
    let contact = null;
    const searchRes = await fetch(`https://api.clientify.net/v1/contacts/?query=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`
      }
    });
    
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.results && searchData.results.length > 0) {
        // Obtenemos coincidencia exacta por email si es posible
        contact = searchData.results.find(c => c.email && c.email.toLowerCase() === email.toLowerCase()) || searchData.results[0];
        console.log('[Clientify] Contact Found (Already Exists):', contact.id);
      }
    }

    // 2. Si no existe, lo creamos
    if (!contact) {
      const createRes = await fetch('https://api.clientify.net/v1/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${apiKey}`
        },
        body: JSON.stringify({
          email: email,
          first_name: name.split(' ')[0] || "Usuario",
          last_name: name.split(' ').slice(1).join(' ') || "QT",
          phone: phone,
          company: razonSocial,
          type: 'Person'
        })
      });

      contact = await createRes.json();
      console.log('[Clientify] Contact Created:', contact.id);
    }

    if (contact && contact.id) {
      // 3. Añadir etiquetas
      const tags = ['Quicktrace', 'Registrado Quicktrace'];
      
      for (const tag of tags) {
        await fetch(`https://api.clientify.net/v1/contacts/${contact.id}/tags/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${apiKey}`
          },
          body: JSON.stringify({ name: tag })
        });
      }
      console.log(`[Clientify] Tags "${tags.join(', ')}" added to contact`, contact.id);
    }

    return contact;
  } catch (error) {
    console.error('[Clientify] Error sync:', error);
  }
}

/**
 * Busca un contacto por email y le asigna una etiqueta específica
 * @param {string} email - Email del contacto
 * @param {string} tag - Nombre de la etiqueta
 */
export async function assignClientifyTagByEmail(email, tag) {
  const apiKey = process.env.CLIENTIFY_API_KEY;
  if (!apiKey || !email) return;

  try {
    const searchRes = await fetch(`https://api.clientify.net/v1/contacts/?query=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Authorization': `Token ${apiKey}` }
    });
    
    if (!searchRes.ok) return;
    const searchData = await searchRes.json();
    
    if (searchData.results && searchData.results.length > 0) {
      const contact = searchData.results.find(c => c.email && c.email.toLowerCase() === email.toLowerCase()) || searchData.results[0];
      
      if (contact && contact.id) {
        await fetch(`https://api.clientify.net/v1/contacts/${contact.id}/tags/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${apiKey}`
          },
          body: JSON.stringify({ name: tag })
        });
        console.log(`[Clientify] Tag "${tag}" added to contact ${email}`);
      }
    }
  } catch (error) {
    console.error('[Clientify] Error assigning tag by email:', error);
  }
}

