import prisma from "./prisma";

/**
 * Adjusts the stock of an ingredient.
 * If the resulting stock goes below 0, it is clamped to 0.
 * @param {number} clientProfileId 
 * @param {string} name 
 * @param {string} unit 
 * @param {number} adjustment - can be positive or negative
 */
export async function adjustIngredientStock(clientProfileId, name, unit, adjustment) {
  const nameClean = name.trim();
  const unitClean = unit.trim();

  // Find existing stock
  let existing = await prisma.ingredientStock.findUnique({
    where: {
      clientProfileId_name_unit: {
        clientProfileId,
        name: nameClean,
        unit: unitClean
      }
    }
  });

  if (!existing) {
    existing = await prisma.ingredientStock.findFirst({
      where: {
        clientProfileId,
        name: { equals: nameClean, mode: "insensitive" },
        unit: { equals: unitClean, mode: "insensitive" }
      }
    });
  }

  const finalName = existing ? existing.name : nameClean;
  const finalUnit = existing ? existing.unit : unitClean;
  const currentStock = existing ? existing.stock : 0;
  const calculatedStock = Math.max(0, currentStock + adjustment);
  const newStock = Math.round(calculatedStock * 10000) / 10000;

  await prisma.ingredientStock.upsert({
    where: {
      clientProfileId_name_unit: {
        clientProfileId,
        name: finalName,
        unit: finalUnit
      }
    },
    update: { stock: newStock },
    create: {
      clientProfileId,
      name: finalName,
      unit: finalUnit,
      stock: newStock
    }
  });
}

/**
 * Process stock updates for a newly created Goods Receipt.
 */
export async function processNewGoodsReceiptStock(clientProfileId, relatedQuantities) {
  if (!relatedQuantities || typeof relatedQuantities !== "object") return;
  for (const [key, val] of Object.entries(relatedQuantities)) {
    if (val === "" || val === null || val === undefined) continue;
    const qty = parseFloat(val.toString().replace(',', '.')) || 0;
    if (qty === 0) continue;
    const lastColon = key.lastIndexOf(":");
    if (lastColon === -1) continue;
    const name = key.slice(0, lastColon).trim();
    const unit = key.slice(lastColon + 1).trim();
    await adjustIngredientStock(clientProfileId, name, unit, qty);
  }
}

/**
 * Process stock updates for a modified Goods Receipt.
 */
export async function processUpdatedGoodsReceiptStock(clientProfileId, oldQuantities, newQuantities) {
  const oldQs = (oldQuantities && typeof oldQuantities === "object") ? oldQuantities : {};
  const newQs = (newQuantities && typeof newQuantities === "object") ? newQuantities : {};
  const allKeys = new Set([...Object.keys(oldQs), ...Object.keys(newQs)]);

  for (const key of allKeys) {
    const oldRaw = oldQs[key];
    const newRaw = newQs[key];
    const oldVal = (oldRaw !== undefined && oldRaw !== null && oldRaw !== "") 
      ? (parseFloat(oldRaw.toString().replace(',', '.')) || 0) 
      : 0;
    const newVal = (newRaw !== undefined && newRaw !== null && newRaw !== "") 
      ? (parseFloat(newRaw.toString().replace(',', '.')) || 0) 
      : 0;
    const diff = Math.round((newVal - oldVal) * 10000) / 10000;
    if (diff === 0) continue;

    const lastColon = key.lastIndexOf(":");
    if (lastColon === -1) continue;
    const name = key.slice(0, lastColon).trim();
    const unit = key.slice(lastColon + 1).trim();
    await adjustIngredientStock(clientProfileId, name, unit, diff);
  }
}

/**
 * Process stock updates for deleted Goods Receipts.
 */
export async function processDeletedGoodsReceiptsStock(clientProfileId, receipts) {
  for (const receipt of receipts) {
    const relatedQs = (receipt.relatedQuantities && typeof receipt.relatedQuantities === "object") ? receipt.relatedQuantities : {};
    for (const [key, val] of Object.entries(relatedQs)) {
      if (val === "" || val === null || val === undefined) continue;
      const qty = parseFloat(val.toString().replace(',', '.')) || 0;
      if (qty === 0) continue;
      const lastColon = key.lastIndexOf(":");
      if (lastColon === -1) continue;
      const name = key.slice(0, lastColon).trim();
      const unit = key.slice(lastColon + 1).trim();
      // We subtract the quantity since the receipt is deleted
      await adjustIngredientStock(clientProfileId, name, unit, -qty);
    }
  }
}

/**
 * Process stock updates for a newly created Elaboration.
 * Subtracts the realAmount of each ingredient from stock.
 */
export async function processNewElaborationStock(clientProfileId, ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) return;
  for (const ing of ingredients) {
    const qty = parseFloat(ing.realAmount?.toString().replace(",", ".")) || 0;
    if (qty === 0) continue;
    // We subtract the quantity
    await adjustIngredientStock(clientProfileId, ing.name, ing.unit, -qty);
  }
}

/**
 * Process stock updates for a modified Elaboration.
 * Adds back old ingredient quantities and subtracts new ones.
 */
export async function processUpdatedElaborationStock(clientProfileId, oldIngredients, newIngredients) {
  // Add back old quantities
  if (oldIngredients && Array.isArray(oldIngredients)) {
    for (const ing of oldIngredients) {
      const qty = parseFloat(ing.realAmount?.toString().replace(",", ".")) || 0;
      if (qty === 0) continue;
      await adjustIngredientStock(clientProfileId, ing.name, ing.unit, qty);
    }
  }
  // Subtract new quantities
  if (newIngredients && Array.isArray(newIngredients)) {
    for (const ing of newIngredients) {
      const qty = parseFloat(ing.realAmount?.toString().replace(",", ".")) || 0;
      if (qty === 0) continue;
      await adjustIngredientStock(clientProfileId, ing.name, ing.unit, -qty);
    }
  }
}

/**
 * Process stock updates for deleted Elaborations.
 * Adds back the quantities of the deleted ingredients.
 */
export async function processDeletedElaborationsStock(clientProfileId, elaborations) {
  for (const elab of elaborations) {
    if (elab.ingredients && Array.isArray(elab.ingredients)) {
      for (const ing of elab.ingredients) {
        const qty = parseFloat(ing.realAmount?.toString().replace(",", ".")) || 0;
        if (qty === 0) continue;
        await adjustIngredientStock(clientProfileId, ing.name, ing.unit, qty);
      }
    }
  }
}
