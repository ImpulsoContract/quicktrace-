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
    // 1. Crear o actualizar contacto
    const response = await fetch('https://api.clientify.net/v1/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`
      },
      body: JSON.stringify({
        email: email,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' '),
        phone: phone,
        company: razonSocial,
        type: 'Person'
      })
    });

    const contact = await response.json();
    console.log('[Clientify] Contact Created/Found:', contact);

    if (contact && contact.id) {
      // 2. Añadir etiqueta "nuevo registro"
      await fetch(`https://api.clientify.net/v1/contacts/${contact.id}/tags/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${apiKey}`
        },
        body: JSON.stringify({
          name: 'nuevo registro'
        })
      });
      console.log('[Clientify] Tag "nuevo registro" added to contact', contact.id);
    }

    return contact;
  } catch (error) {
    console.error('[Clientify] Error sync:', error);
  }
}
