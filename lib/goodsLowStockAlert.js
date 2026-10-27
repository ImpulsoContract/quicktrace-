import prisma from "@/lib/prisma";
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

/**
 * Checks goods for sale total stock against client profile threshold.
 * Sends email alert if enabled and marks lowStockAlertSent to prevent spamming.
 * Resets lowStockAlertSent if stock is replenished back above threshold.
 * 
 * @param {number} clientProfileId 
 * @param {number|number[]} goodsForSaleIdOrIds 
 */
export async function checkAndNotifyGoodsLowStock(clientProfileId, goodsForSaleIdOrIds) {
  try {
    if (!clientProfileId || !goodsForSaleIdOrIds) return;

    const profile = await prisma.clientProfile.findUnique({
      where: { id: parseInt(clientProfileId, 10) },
      include: {
        user: { select: { email: true, name: true, lastLoginLanguage: true } }
      }
    });

    if (!profile || !profile.goodsLowStockAlertEnabled) return;

    const threshold = (profile.goodsLowStockThreshold !== null && profile.goodsLowStockThreshold !== undefined)
      ? profile.goodsLowStockThreshold
      : 2;

    const rawIds = Array.isArray(goodsForSaleIdOrIds) ? goodsForSaleIdOrIds : [goodsForSaleIdOrIds];
    const ids = rawIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

    if (ids.length === 0) return;

    const goodsList = await prisma.goodsForSale.findMany({
      where: {
        id: { in: ids },
        clientProfileId: profile.id,
        isArchived: false
      }
    });

    const recipientEmail = profile.user?.email;
    const recipientName = profile.personName || profile.user?.name || profile.razonSocial || "Usuario";

    for (const item of goodsList) {
      const currentStock = item.stock || 0;

      // Case 1: Stock is below threshold
      if (currentStock < threshold) {
        if (profile.goodsLowStockEmail && !item.lowStockAlertSent && recipientEmail) {
          await sendGoodsLowStockEmail({
            recipientEmail,
            recipientName,
            businessName: profile.razonSocial || "QuickTrace",
            goodsName: item.name,
            currentStock,
            unit: item.unit,
            threshold,
            language: profile.user?.lastLoginLanguage || "es"
          });

          await prisma.goodsForSale.update({
            where: { id: item.id },
            data: { lowStockAlertSent: true }
          }).catch(e => console.error("Error setting lowStockAlertSent:", e));
        }
      } 
      // Case 2: Stock was replenished back to or above threshold
      else if (currentStock >= threshold && item.lowStockAlertSent) {
        await prisma.goodsForSale.update({
          where: { id: item.id },
          data: { lowStockAlertSent: false }
        }).catch(e => console.error("Error clearing lowStockAlertSent:", e));
      }
    }
  } catch (error) {
    console.error("Error in checkAndNotifyGoodsLowStock:", error);
  }
}

/**
 * Sends a localized HTML email alerting about low stock on a specific goods for sale.
 */
export async function sendGoodsLowStockEmail({
  recipientEmail,
  recipientName,
  businessName,
  goodsName,
  currentStock,
  unit,
  threshold,
  language = "es"
}) {
  try {
    const langKey = locales[language] ? language : "es";
    const tStrings = locales[langKey]?.low_stock_email || locales.es.low_stock_email;

    const subject = (tStrings.subject || "⚠️ Alerta: Stock bajo en {name} - QuickTrace")
      .replace("{name}", goodsName);

    const greeting = (tStrings.greeting || "Hola {personName},")
      .replace("{personName}", recipientName);

    const messageIntro = tStrings.message_intro || 
      "Te informamos de que el stock total de una de tus mercancías en venta ha bajado por debajo del umbral mínimo configurado.";

    const goodsLabel = tStrings.goods_label || "Mercancía:";
    const currentStockLabel = tStrings.current_stock_label || "Stock actual:";
    const thresholdLabel = tStrings.threshold_label || "Umbral configurado:";
    const callToAction = tStrings.call_to_action || 
      "Te recomendamos reponer existencias o registrar nuevas entradas de mercancía lo antes posible.";
    const footer = tStrings.footer || 
      "Este aviso se ha generado automáticamente según tus preferencias de notificación en QuickTrace.";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #426216; padding: 24px 32px; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
          .badge { display: inline-block; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-weight: 700; font-size: 12px; padding: 4px 10px; borderRadius: 20px; margin-top: 8px; text-transform: uppercase; }
          .content { padding: 32px; }
          .greeting { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
          .intro { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #64748b; font-weight: 600; }
          .info-value { color: #0f172a; font-weight: 700; text-align: right; }
          .danger-value { color: #dc2626; font-size: 16px; font-weight: 800; }
          .action-box { background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 16px; color: #854d0e; font-size: 14px; line-height: 1.5; margin-bottom: 24px; font-weight: 500; }
          .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>QuickTrace</h1>
            <span class="badge">⚠️ Stock bajo</span>
          </div>
          <div class="content">
            <div class="greeting">${greeting}</div>
            <p class="intro">${messageIntro}</p>

            <div class="info-card">
              <div class="info-row">
                <span class="info-label">${goodsLabel}</span>
                <span class="info-value">${goodsName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${currentStockLabel}</span>
                <span class="info-value danger-value">${currentStock} ${unit}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${thresholdLabel}</span>
                <span class="info-value">${threshold} ${unit}</span>
              </div>
            </div>

            <div class="action-box">
              ${callToAction}
            </div>
          </div>
          <div class="footer">
            ${footer}
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `${greeting}\n\n${messageIntro}\n\n${goodsLabel} ${goodsName}\n${currentStockLabel} ${currentStock} ${unit}\n${thresholdLabel} ${threshold} ${unit}\n\n${callToAction}\n\n${footer}`;

    await sendEmail({
      to: recipientEmail,
      subject,
      html,
      text
    });

    console.log(`[Low Stock Alert] Email sent to ${recipientEmail} for goods '${goodsName}' (stock: ${currentStock}, threshold: ${threshold})`);
    return { success: true };
  } catch (err) {
    console.error("Error sending goods low stock email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Checks ingredient stock against client profile threshold.
 * Sends email alert if enabled and marks lowStockAlertSent to prevent spamming.
 * Resets lowStockAlertSent if stock is replenished back above threshold.
 * 
 * @param {number} clientProfileId 
 * @param {string} ingredientName 
 * @param {string} unit 
 */
export async function checkAndNotifyIngredientLowStock(clientProfileId, ingredientName, unit) {
  try {
    if (!clientProfileId || !ingredientName) return;

    const profile = await prisma.clientProfile.findUnique({
      where: { id: parseInt(clientProfileId, 10) },
      include: {
        user: { select: { email: true, name: true, lastLoginLanguage: true } }
      }
    });

    if (!profile || !profile.goodsLowStockAlertEnabled) return;

    const threshold = (profile.goodsLowStockThreshold !== null && profile.goodsLowStockThreshold !== undefined)
      ? profile.goodsLowStockThreshold
      : 2;

    const cleanName = ingredientName.trim();
    const cleanUnit = unit ? unit.trim() : "";

    // Find the ingredient stock record
    const ingStock = await prisma.ingredientStock.findFirst({
      where: {
        clientProfileId: profile.id,
        name: { equals: cleanName, mode: "insensitive" },
        ...(cleanUnit ? { unit: { equals: cleanUnit, mode: "insensitive" } } : {})
      }
    });

    if (!ingStock) return;

    // Check if it is linked to an active goods for sale
    const linkedGoods = await prisma.goodsForSale.findFirst({
      where: {
        clientProfileId: profile.id,
        linkedIngredientName: { equals: ingStock.name, mode: "insensitive" },
        isArchived: false
      }
    });

    // If linked, checkAndNotifyGoodsLowStock handles the unified notification
    if (linkedGoods) {
      await checkAndNotifyGoodsLowStock(profile.id, linkedGoods.id);
      return;
    }

    const currentStock = ingStock.stock || 0;
    const recipientEmail = profile.user?.email;
    const recipientName = profile.personName || profile.user?.name || profile.razonSocial || "Usuario";

    // Case 1: Below threshold
    if (currentStock < threshold) {
      if (profile.goodsLowStockEmail && !ingStock.lowStockAlertSent && recipientEmail) {
        await sendIngredientLowStockEmail({
          recipientEmail,
          recipientName,
          businessName: profile.razonSocial || "QuickTrace",
          ingredientName: ingStock.name,
          currentStock,
          unit: ingStock.unit,
          threshold,
          language: profile.user?.lastLoginLanguage || "es"
        });

        await prisma.ingredientStock.update({
          where: { id: ingStock.id },
          data: { lowStockAlertSent: true }
        }).catch(e => console.error("Error setting lowStockAlertSent on ingredient:", e));
      }
    }
    // Case 2: Stock was replenished back to or above threshold
    else if (currentStock >= threshold && ingStock.lowStockAlertSent) {
      await prisma.ingredientStock.update({
        where: { id: ingStock.id },
        data: { lowStockAlertSent: false }
      }).catch(e => console.error("Error clearing lowStockAlertSent on ingredient:", e));
    }
  } catch (error) {
    console.error("Error in checkAndNotifyIngredientLowStock:", error);
  }
}

/**
 * Sends a localized HTML email alerting about low stock on a specific ingredient.
 */
export async function sendIngredientLowStockEmail({
  recipientEmail,
  recipientName,
  businessName,
  ingredientName,
  currentStock,
  unit,
  threshold,
  language = "es"
}) {
  try {
    const langKey = locales[language] ? language : "es";
    const tStrings = locales[langKey]?.low_stock_email || locales.es.low_stock_email;

    const subject = (tStrings.subject || "⚠️ Alerta: Stock bajo en {name} - QuickTrace")
      .replace("{name}", ingredientName);

    const greeting = (tStrings.greeting || "Hola {personName},")
      .replace("{personName}", recipientName);

    const messageIntro = tStrings.ingredient_message_intro || 
      "Te informamos de que el stock de uno de tus ingredientes / materias primas ha bajado por debajo del umbral mínimo configurado.";

    const ingredientLabel = tStrings.ingredient_label || "Ingrediente:";
    const currentStockLabel = tStrings.current_stock_label || "Stock actual:";
    const thresholdLabel = tStrings.threshold_label || "Umbral configurado:";
    const callToAction = tStrings.ingredient_call_to_action || 
      "Te recomendamos reponer existencias o registrar una nueva recepción de mercancías lo antes posible.";
    const footer = tStrings.footer || 
      "Este aviso se ha generado automáticamente según tus preferencias de notificación en QuickTrace.";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #426216; padding: 24px 32px; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
          .badge { display: inline-block; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 20px; margin-top: 8px; text-transform: uppercase; }
          .content { padding: 32px; }
          .greeting { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
          .intro { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #64748b; font-weight: 600; }
          .info-value { color: #0f172a; font-weight: 700; text-align: right; }
          .danger-value { color: #dc2626; font-size: 16px; font-weight: 800; }
          .action-box { background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 16px; color: #854d0e; font-size: 14px; line-height: 1.5; margin-bottom: 24px; font-weight: 500; }
          .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>QuickTrace</h1>
            <span class="badge">⚠️ Stock bajo de ingrediente</span>
          </div>
          <div class="content">
            <div class="greeting">${greeting}</div>
            <p class="intro">${messageIntro}</p>

            <div class="info-card">
              <div class="info-row">
                <span class="info-label">${ingredientLabel}</span>
                <span class="info-value">${ingredientName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${currentStockLabel}</span>
                <span class="info-value danger-value">${currentStock} ${unit}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${thresholdLabel}</span>
                <span class="info-value">${threshold} ${unit}</span>
              </div>
            </div>

            <div class="action-box">
              ${callToAction}
            </div>
          </div>
          <div class="footer">
            ${footer}
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `${greeting}\n\n${messageIntro}\n\n${ingredientLabel} ${ingredientName}\n${currentStockLabel} ${currentStock} ${unit}\n${thresholdLabel} ${threshold} ${unit}\n\n${callToAction}\n\n${footer}`;

    await sendEmail({
      to: recipientEmail,
      subject,
      html,
      text
    });

    console.log(`[Low Stock Alert] Email sent to ${recipientEmail} for ingredient '${ingredientName}' (stock: ${currentStock}, threshold: ${threshold})`);
    return { success: true };
  } catch (err) {
    console.error("Error sending ingredient low stock email:", err);
    return { success: false, error: err.message };
  }
}
