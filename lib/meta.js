import crypto from 'crypto';

/**
 * Envia un evento a la API de Conversiones de Meta (CAPI)
 * @param {Object} data - Datos del evento
 */
export async function sendMetaConversionEvent({
  eventName,
  email,
  phone,
  firstName,
  lastName,
  url,
  clientIpAddress,
  clientUserAgent,
  fbc,
  fbp
}) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const testCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    console.warn('[Meta CAPI] Pixel ID or Access Token missing. Skipping event.');
    return;
  }

  // Hash sensible data using SHA256
  const hash = (val) => val ? crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex') : null;

  const userData = {
    em: hash(email),
    ph: hash(phone),
    fn: hash(firstName),
    ln: hash(lastName),
    client_ip_address: clientIpAddress,
    client_user_agent: clientUserAgent,
    fbc: fbc,
    fbp: fbp
  };

  const eventData = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: url,
    user_data: userData
  };

  const payload = {
    data: [eventData],
    ...(testCode ? { test_event_code: testCode } : {})
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('[Meta CAPI] Result:', result);
    return result;
  } catch (error) {
    console.error('[Meta CAPI] Error:', error);
  }
}
