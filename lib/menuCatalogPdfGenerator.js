import jsPDF from "jspdf";
import { getAllergenIconDataUrl } from "./allergenIcons";

const formatPrice = (val, currency = "EUR") => {
  if (val === undefined || val === null || val === "" || val === 0) return "";
  const num = parseFloat(String(val).replace(",", "."));
  if (isNaN(num)) return String(val);
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "€";
  return `${num.toFixed(2)} ${symbol}`;
};

export const DEFAULT_MENU_COLUMNS = {
  col1: ["recipeImage"],
  col2: ["recipeName", "ingredientsList"],
  col3: ["allergensIcons"],
  col4: ["price"]
};

export const MENU_ELEMENT_LABELS = {
  recipeImage: "Imagen de la receta",
  ingredientsList: "Listado de ingredientes",
  recipeName: "Nombre de la receta",
  allergensIcons: "Alérgenos con iconos",
  allergensText: "Alérgenos con palabras",
  price: "Precio",
  elaborationInstructions: "Elaboración",
  conservationInstructions: "Conservación"
};

/**
 * Generates the 4-column restaurant menu / catalog PDF
 */
export async function generateMenuCatalogPDF({
  recipes = [],
  menuConfig = {},
  profile = {},
  t = (k) => k,
  locale = "es",
  isPreview = false
}) {
  const columns = menuConfig.columns || DEFAULT_MENU_COLUMNS;
  const col1Elements = columns.col1 || [];
  const col2Elements = columns.col2 || [];
  const col3Elements = columns.col3 || [];
  const col4Elements = columns.col4 || [];

  const currency = profile?.currency || "EUR";
  const menuTitle = menuConfig.title !== undefined ? menuConfig.title : (t("recipes.menu_default_title") || "CARTA DE PLATOS");
  const menuSubtitle = menuConfig.subtitle || "";

  // Document setup: A4 Portrait
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const marginTop = 20;
  const marginBottom = 20;
  const contentWidth = pageWidth - marginX * 2; // 182mm

  // Determine dynamic column widths based on contents
  // Total width: 182mm
  const getColWeight = (elems) => {
    if (elems.length === 0) return 20;
    let weight = 0;
    if (elems.includes("recipeImage")) weight += 32;
    if (elems.includes("recipeName")) weight += 45;
    if (elems.includes("ingredientsList")) weight += 50;
    if (elems.includes("allergensIcons")) weight += 35;
    if (elems.includes("allergensText")) weight += 40;
    if (elems.includes("price")) weight += 25;
    if (elems.includes("elaborationInstructions")) weight += 45;
    if (elems.includes("conservationInstructions")) weight += 35;
    return Math.max(weight, 25);
  };

  const w1 = getColWeight(col1Elements);
  const w2 = getColWeight(col2Elements);
  const w3 = getColWeight(col3Elements);
  const w4 = getColWeight(col4Elements);
  const totalWeight = w1 + w2 + w3 + w4;

  const colWidths = [
    (w1 / totalWeight) * contentWidth,
    (w2 / totalWeight) * contentWidth,
    (w3 / totalWeight) * contentWidth,
    (w4 / totalWeight) * contentWidth
  ];

  const colPositions = [
    marginX,
    marginX + colWidths[0],
    marginX + colWidths[0] + colWidths[1],
    marginX + colWidths[0] + colWidths[1] + colWidths[2]
  ];

  let currentY = marginTop;

  // Header drawing helper
  const drawHeader = (isContinuation = false) => {
    // Decorative top accent bar
    doc.setFillColor(63, 98, 18); // corp-green
    doc.rect(marginX, currentY, contentWidth, 3, "F");
    currentY += 8;

    // Title
    if (menuTitle && menuTitle.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      const displayTitle = isContinuation ? `${menuTitle.trim()} (cont.)` : menuTitle.trim();
      doc.text(displayTitle, pageWidth / 2, currentY, { align: "center" });
      currentY += 6;
    }

    // Subtitle (from textarea, multiline)
    if (!isContinuation && menuSubtitle && menuSubtitle.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      const lines = doc.splitTextToSize(menuSubtitle.trim(), contentWidth - 10);
      lines.forEach(line => {
        doc.text(line, pageWidth / 2, currentY, { align: "center" });
        currentY += 4.5;
      });
      currentY += 2;
    }

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 7;
  };

  drawHeader(false);

  // Allergen name translation helper
  const getAllergenName = (key) => {
    const trans = t(`recipes.allergens_list.${key}`);
    if (trans && trans !== `recipes.allergens_list.${key}`) return trans;
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Helper to measure elements inside a column for a given recipe
  const measureColumnContent = (elements, recipe, colW) => {
    let height = 0;
    const paddingInternal = 1.5;

    elements.forEach((elem) => {
      switch (elem) {
        case "recipeImage":
          height += 26; // 24mm image + 2mm margin
          break;
        case "recipeName": {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          const lines = doc.splitTextToSize(recipe.name || "", colW - 4);
          height += lines.length * 4.5 + paddingInternal;
          break;
        }
        case "ingredientsList": {
          const ings = recipe.ingredients || [];
          if (ings.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const ingText = ings.map(i => `${i.name}${i.amount ? ` (${i.amount} ${i.unit || ""})`.trim() : ""}`).join(", ");
            const lines = doc.splitTextToSize(ingText, colW - 4);
            height += lines.length * 3.5 + paddingInternal;
          }
          break;
        }
        case "allergensIcons": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            height += 9; // icon badge row
          }
          break;
        }
        case "allergensText": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            const text = "Contiene: " + allg.map(getAllergenName).join(", ");
            const lines = doc.splitTextToSize(text, colW - 4);
            height += lines.length * 3.2 + paddingInternal;
          }
          break;
        }
        case "price": {
          height += 7; // Price tag
          break;
        }
        case "elaborationInstructions": {
          if (recipe.elaborationInstructions) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const lines = doc.splitTextToSize(recipe.elaborationInstructions, colW - 4);
            height += lines.length * 3.4 + paddingInternal;
          }
          break;
        }
        case "conservationInstructions": {
          if (recipe.conservationInstructions) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            const lines = doc.splitTextToSize(recipe.conservationInstructions, colW - 4);
            height += lines.length * 3.2 + paddingInternal;
          }
          break;
        }
        default:
          break;
      }
    });

    return Math.max(height, 8);
  };

  // Helper to render elements inside a cell
  const renderCellContent = (elements, recipe, x, y, colW) => {
    let curY = y + 2;

    elements.forEach((elem) => {
      switch (elem) {
        case "recipeImage": {
          if (recipe.imageUrl) {
            try {
              const imgSize = Math.min(24, colW - 4);
              doc.addImage(recipe.imageUrl, "JPEG", x + 2, curY, imgSize, imgSize);
              curY += imgSize + 2;
            } catch (e) {
              // Fallback placeholder box
              doc.setDrawColor(203, 213, 225);
              doc.setFillColor(248, 250, 252);
              doc.roundedRect(x + 2, curY, 24, 24, 2, 2, "FD");
              curY += 26;
            }
          } else {
            // Subtle placeholder
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(x + 2, curY, 22, 22, 2, 2, "FD");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text("Sin foto", x + 13, curY + 12, { align: "center" });
            curY += 24;
          }
          break;
        }
        case "recipeName": {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(15, 23, 42);
          const lines = doc.splitTextToSize(recipe.name || "", colW - 4);
          doc.text(lines, x + 2, curY + 3.5);
          curY += lines.length * 4.5 + 1.5;
          break;
        }
        case "ingredientsList": {
          const ings = recipe.ingredients || [];
          if (ings.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(71, 85, 105);
            const ingText = ings.map(i => `${i.name}${i.amount ? ` (${i.amount} ${i.unit || ""})`.trim() : ""}`).join(", ");
            const lines = doc.splitTextToSize(ingText, colW - 4);
            doc.text(lines, x + 2, curY + 2.5);
            curY += lines.length * 3.5 + 1.5;
          }
          break;
        }
        case "allergensIcons": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            let iconX = x + 2;
            const iconSize = 6;
            allg.forEach((allergenKey) => {
              if (iconX + iconSize > x + colW - 2) return; // avoid overflow
              try {
                const dataUrl = getAllergenIconDataUrl(allergenKey, 80);
                if (dataUrl) {
                  doc.addImage(dataUrl, "PNG", iconX, curY, iconSize, iconSize);
                }
              } catch (e) {
                // Ignore icon error
              }
              iconX += iconSize + 1.5;
            });
            curY += iconSize + 2.5;
          }
          break;
        }
        case "allergensText": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(180, 83, 9); // amber tone
            const text = "Alérgenos: " + allg.map(getAllergenName).join(", ");
            const lines = doc.splitTextToSize(text, colW - 4);
            doc.text(lines, x + 2, curY + 2.5);
            curY += lines.length * 3.2 + 1.5;
          }
          break;
        }
        case "price": {
          // Resolve price: from menuConfig override, or recipe.price, or latest elaboration unitPrice
          const customPrice = menuConfig.recipePrices?.[recipe.id];
          const rawPrice = customPrice !== undefined && customPrice !== "" 
            ? customPrice 
            : (recipe.price || recipe.elaborations?.[0]?.unitPrice || "");

          if (rawPrice !== "" && rawPrice !== undefined) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(21, 128, 61); // corp-green
            const formatted = formatPrice(rawPrice, currency);
            doc.text(formatted, x + 2, curY + 3.5);
            curY += 6.5;
          }
          break;
        }
        case "elaborationInstructions": {
          if (recipe.elaborationInstructions) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(7.8);
            doc.setTextColor(100, 116, 139);
            const lines = doc.splitTextToSize(recipe.elaborationInstructions, colW - 4);
            doc.text(lines, x + 2, curY + 2.5);
            curY += lines.length * 3.4 + 1.5;
          }
          break;
        }
        case "conservationInstructions": {
          if (recipe.conservationInstructions) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            const lines = doc.splitTextToSize(recipe.conservationInstructions, colW - 4);
            doc.text(lines, x + 2, curY + 2.5);
            curY += lines.length * 3.2 + 1.5;
          }
          break;
        }
        default:
          break;
      }
    });
  };

  // Render Recipes Rows
  recipes.forEach((recipe, rIdx) => {
    // Measure required height for this row
    const h1 = measureColumnContent(col1Elements, recipe, colWidths[0]);
    const h2 = measureColumnContent(col2Elements, recipe, colWidths[1]);
    const h3 = measureColumnContent(col3Elements, recipe, colWidths[2]);
    const h4 = measureColumnContent(col4Elements, recipe, colWidths[3]);
    const rowHeight = Math.max(h1, h2, h3, h4) + 5; // row height with padding

    // Check page break
    if (currentY + rowHeight > pageHeight - marginBottom) {
      doc.addPage();
      currentY = marginTop;
      drawHeader(true);
    }

    // Row background (alternating subtle tone)
    if (rIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, currentY, contentWidth, rowHeight, "F");
    }

    // Render cells in each column
    renderCellContent(col1Elements, recipe, colPositions[0], currentY, colWidths[0]);
    renderCellContent(col2Elements, recipe, colPositions[1], currentY, colWidths[1]);
    renderCellContent(col3Elements, recipe, colPositions[2], currentY, colWidths[2]);
    renderCellContent(col4Elements, recipe, colPositions[3], currentY, colWidths[3]);

    // Bottom border for row
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(marginX, currentY + rowHeight, marginX + contentWidth, currentY + rowHeight);

    currentY += rowHeight;
  });

  // Footer: page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${p} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  if (isPreview) {
    return doc.output("blob");
  }

  const safeTitle = (menuTitle || "Carta").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
  const fileName = `Carta_${safeTitle || "Platos"}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
