import * as XLSX from "xlsx";

/**
 * Exports all recipes and their detailed ingredients to an Excel workbook (.xlsx)
 * @param {Array} recipes - Array of recipe objects
 * @param {Function} t - i18n translation function
 * @param {string} locale - Current locale code
 */
export function exportRecipesToExcel(recipes = [], t = (key) => key, locale = "es") {
  if (!recipes || recipes.length === 0) {
    alert(t("recipes.no_recipes_to_export") || "No hay recetas disponibles para exportar");
    return;
  }

  const yesStr = t("common.yes") || "Sí";
  const noStr = t("common.no") || "No";
  const noneStr = t("common.none") || "Ninguno";

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${mins}`;
    } catch (e) {
      return "-";
    }
  };

  const formatAllergenName = (allergenCode) => {
    if (!allergenCode) return "";
    const key = `recipes.allergens_list.${allergenCode}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    return allergenCode.charAt(0).toUpperCase() + allergenCode.slice(1);
  };

  const formatExpiryType = (type) => {
    if (type === "BEST_BEFORE") {
      return t("modals.expiry_type_best_before") || "Consumo preferente";
    }
    return t("modals.expiry_type_expiration") || "Caducidad";
  };

  // --- SHEET 1: RESUMEN COMPLETO DE RECETAS ---
  const recipesData = recipes.map((r, index) => {
    const ings = r.ingredients || [];
    const ingredientsSummary = ings
      .map((ing) => `${ing.name || ""}${ing.amount ? ` (${ing.amount} ${ing.unit || ""})`.trim() : ""}`)
      .filter(Boolean)
      .join(", ");

    const allergensFormatted = (r.allergens && r.allergens.length > 0)
      ? r.allergens.map(formatAllergenName).join(", ")
      : noneStr;

    return {
      "Nº": index + 1,
      "ID Receta": r.id,
      "Nombre de la Receta": r.name || "",
      "Familia de Producto": r.productFamily?.name || "-",
      "Tiene Imagen": r.imageUrl ? yesStr : noStr,
      "Código de Barras": r.hasBarcode ? (r.barcode || "-") : noStr,
      "Días de Caducidad": r.expiryDays ?? 0,
      "Tipo de Caducidad": formatExpiryType(r.expiryType),
      "Requiere Secadero": r.hasDryingRoom ? yesStr : noStr,
      "Lotes Obligatorios": r.lotesMandatory ? yesStr : noStr,
      "Cantidades Obligatorias": r.quantitiesMandatory ? yesStr : noStr,
      "Nº de Ingredientes": ings.length,
      "Ingredientes (Resumen)": ingredientsSummary || "-",
      "Personalizar Ingredientes en Etiqueta": r.useCustomLabelIngredients ? yesStr : noStr,
      "Texto Personalizado Etiqueta": r.useCustomLabelIngredients ? (r.customLabelIngredients || "-") : "-",
      "Alérgenos": allergensFormatted,
      "Modo de Elaboración / Instrucciones": r.elaborationInstructions || "-",
      "Instrucciones de Conservación": r.conservationInstructions || "-",
      "Valor Energético (100g)": r.energyValue || "-",
      "Grasas (100g)": r.fats || "-",
      "Grasas Saturadas (100g)": r.saturatedFats || "-",
      "Hidratos de Carbono (100g)": r.carbohydrates || "-",
      "Azúcares (100g)": r.sugars || "-",
      "Proteínas (100g)": r.proteins || "-",
      "Sal (100g)": r.salt || "-",
      "Elaboraciones Registradas": r._count?.elaborations ?? 0,
      "Fecha de Creación": formatDate(r.createdAt),
      "Última Modificación": formatDate(r.updatedAt)
    };
  });

  // --- SHEET 2: DETALLE FILA A FILA DE INGREDIENTES ---
  const ingredientsData = [];
  recipes.forEach((r) => {
    const ings = r.ingredients || [];
    if (ings.length === 0) {
      ingredientsData.push({
        "ID Receta": r.id,
        "Nombre Receta": r.name || "",
        "Familia de Producto": r.productFamily?.name || "-",
        "Orden": "-",
        "Ingrediente": "(Sin ingredientes registrados)",
        "Cantidad": "-",
        "Unidad": "-",
        "Lote Obligatorio": "-",
        "Cantidad Real Obligatoria": "-",
        "Desglosar Ingrediente": "-",
        "Texto Desglose": "-"
      });
    } else {
      ings.forEach((ing, idx) => {
        ingredientsData.push({
          "ID Receta": r.id,
          "Nombre Receta": r.name || "",
          "Familia de Producto": r.productFamily?.name || "-",
          "Orden": typeof ing.order === "number" ? ing.order + 1 : idx + 1,
          "Ingrediente": ing.name || "",
          "Cantidad": ing.amount || "",
          "Unidad": ing.unit || "",
          "Lote Obligatorio": ing.loteMandatory ? yesStr : noStr,
          "Cantidad Real Obligatoria": ing.quantityMandatory ? yesStr : noStr,
          "Desglosar Ingrediente": ing.expandItem ? yesStr : noStr,
          "Texto Desglose": ing.expandedText || "-"
        });
      });
    }
  });

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create worksheets
  const wsRecipes = XLSX.utils.json_to_sheet(recipesData);
  const wsIngredients = XLSX.utils.json_to_sheet(ingredientsData);

  // Column widths for sheet 1
  wsRecipes["!cols"] = [
    { wch: 6 },   // Nº
    { wch: 10 },  // ID Receta
    { wch: 32 },  // Nombre de la Receta
    { wch: 22 },  // Familia de Producto
    { wch: 18 },  // Código de Barras
    { wch: 18 },  // Días de Caducidad
    { wch: 20 },  // Tipo de Caducidad
    { wch: 18 },  // Requiere Secadero
    { wch: 18 },  // Lotes Obligatorios
    { wch: 22 },  // Cantidades Obligatorias
    { wch: 18 },  // Nº de Ingredientes
    { wch: 50 },  // Ingredientes (Resumen)
    { wch: 32 },  // Personalizar Ingredientes en Etiqueta
    { wch: 45 },  // Texto Personalizado Etiqueta
    { wch: 35 },  // Alérgenos
    { wch: 45 },  // Modo de Elaboración / Instrucciones
    { wch: 40 },  // Instrucciones de Conservación
    { wch: 24 },  // Valor Energético (100g)
    { wch: 16 },  // Grasas (100g)
    { wch: 22 },  // Grasas Saturadas (100g)
    { wch: 24 },  // Hidratos de Carbono (100g)
    { wch: 16 },  // Azúcares (100g)
    { wch: 16 },  // Proteínas (100g)
    { wch: 14 },  // Sal (100g)
    { wch: 24 },  // Elaboraciones Registradas
    { wch: 20 },  // Fecha de Creación
    { wch: 20 }   // Última Modificación
  ];

  // Column widths for sheet 2
  wsIngredients["!cols"] = [
    { wch: 10 },  // ID Receta
    { wch: 30 },  // Nombre Receta
    { wch: 22 },  // Familia de Producto
    { wch: 8 },   // Orden
    { wch: 30 },  // Ingrediente
    { wch: 12 },  // Cantidad
    { wch: 12 },  // Unidad
    { wch: 16 },  // Lote Obligatorio
    { wch: 24 },  // Cantidad Real Obligatoria
    { wch: 20 },  // Desglosar Ingrediente
    { wch: 40 }   // Texto Desglose
  ];

  // Append sheets
  const sheet1Name = t("recipes.excel_sheet_recipes") || "Recetas";
  const sheet2Name = t("recipes.excel_sheet_ingredients") || "Detalle de Ingredientes";
  XLSX.utils.book_append_sheet(wb, wsRecipes, sheet1Name.substring(0, 31));
  XLSX.utils.book_append_sheet(wb, wsIngredients, sheet2Name.substring(0, 31));

  // Generate file name
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Recetas_${dateStr}.xlsx`;

  // Write and trigger download
  try {
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error("XLSX.writeFile failed, using Blob fallback:", error);
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
