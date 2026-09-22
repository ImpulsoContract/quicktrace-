import { sendEmail } from "@/lib/mail";
import esLocale from "@/lib/i18n/locales/es.json";
import enLocale from "@/lib/i18n/locales/en.json";
import frLocale from "@/lib/i18n/locales/fr.json";
import itLocale from "@/lib/i18n/locales/it.json";
import ptLocale from "@/lib/i18n/locales/pt.json";

const locales = {
  es: esLocale,
  en: enLocale,
  fr: frLocale,
  it: itLocale,
  pt: ptLocale
};

export async function sendTemperatureOutOfRangeEmail({
  recipientEmail,
  businessName,
  alerts, // array of { chamberName, value, minTemp, maxTemp }
  date,
  registeredBy,
  language = "es"
}) {
  if (!recipientEmail || !alerts || alerts.length === 0) {
    return { success: false, error: "Missing required parameters" };
  }

  const langKey = locales[language] ? language : "es";
  const tStrings = locales[langKey]?.temperature_alert_email || locales.es.temperature_alert_email;

  // Format date
  const d = date ? new Date(date) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const formattedDate = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

  // Build subject
  const subject = alerts.length === 1
    ? tStrings.subject_single.replace("{chamber}", alerts[0].chamberName)
    : tStrings.subject_multiple.replace("{count}", alerts.length);

  // Helper to format range string
  const formatRange = (min, max) => {
    if (min !== null && min !== undefined && max !== null && max !== undefined) {
      return `${min} ºC a ${max} ºC`;
    }
    if (min !== null && min !== undefined) {
      return `>= ${min} ºC`;
    }
    if (max !== null && max !== undefined) {
      return `<= ${max} ºC`;
    }
    return "-";
  };

  // Build HTML table rows
  const tableRowsHtml = alerts.map(a => `
    <tr style="border-bottom: 1px solid #fee2e2;">
      <td style="padding: 12px 16px; font-weight: 600; color: #1e293b;">${a.chamberName}</td>
      <td style="padding: 12px 16px; font-weight: 700; color: #dc2626; font-size: 1.05rem;">${a.value} ºC</td>
      <td style="padding: 12px 16px; color: #64748b;">${formatRange(a.minTemp, a.maxTemp)}</td>
    </tr>
  `).join("");

  // Build text rows
  const tableRowsText = alerts.map(a => 
    `- ${a.chamberName}: ${a.value} ºC (${tStrings.col_range}: ${formatRange(a.minTemp, a.maxTemp)})`
  ).join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${tStrings.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #334155;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
    
    <!-- Top Header Bar -->
    <div style="background-color: #426216; padding: 18px 24px; text-align: left;">
      <span style="color: #ffffff; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;">Quicktrace</span>
      <span style="color: #d9f99d; font-size: 0.85rem; margin-left: 8px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">| Food Safety</span>
    </div>

    <!-- Alert Banner -->
    <div style="background-color: #fef2f2; border-bottom: 2px solid #ef4444; padding: 20px 24px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.5rem;">⚠️</span>
        <h1 style="color: #991b1b; margin: 0; font-size: 1.2rem; font-weight: 800;">${tStrings.title}</h1>
      </div>
      ${businessName ? `<p style="margin: 6px 0 0 0; color: #b91c1c; font-size: 0.9rem; font-weight: 600;">${businessName}</p>` : ''}
    </div>

    <!-- Content Area -->
    <div style="padding: 24px;">
      <p style="margin-top: 0; margin-bottom: 20px; font-size: 0.95rem; line-height: 1.5; color: #475569;">
        ${tStrings.intro}
      </p>

      <!-- Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #fee2e2; border-radius: 8px; overflow: hidden; text-align: left; font-size: 0.9rem;">
        <thead>
          <tr style="background-color: #fee2e2; color: #991b1b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">
            <th style="padding: 10px 16px;">${tStrings.col_chamber}</th>
            <th style="padding: 10px 16px;">${tStrings.col_recorded}</th>
            <th style="padding: 10px 16px;">${tStrings.col_range}</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <!-- Meta Details Card -->
      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; font-size: 0.85rem; color: #475569; line-height: 1.6;">
        <div><strong>${tStrings.date_label}:</strong> ${formattedDate}</div>
        <div><strong>${tStrings.registered_by_label}:</strong> ${registeredBy || '-'}</div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 0.75rem; color: #94a3b8; text-align: center;">
      <p style="margin: 0;">${tStrings.footer}</p>
      <p style="margin: 4px 0 0 0;">Quicktrace - <a href="https://quicktrace.es" style="color: #426216; text-decoration: none;">https://quicktrace.es</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
${tStrings.title}
${businessName ? `[${businessName}]\n` : ''}
${tStrings.intro}

${tableRowsText}

${tStrings.date_label}: ${formattedDate}
${tStrings.registered_by_label}: ${registeredBy || '-'}

---
${tStrings.footer}
https://quicktrace.es
  `.trim();

  try {
    const res = await sendEmail({
      to: recipientEmail,
      subject,
      html,
      text
    });
    return res;
  } catch (err) {
    console.error("Error sending temperature alert email:", err);
    return { success: false, error: err.message };
  }
}
