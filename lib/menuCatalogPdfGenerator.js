import jsPDF from "jspdf";
import { getAllergenIconDataUrl } from "./allergenIcons.js";

const formatPrice = (val, currency = "EUR") => {
  if (val === undefined || val === null || val === "" || val === false) return "—";
  const num = parseFloat(String(val).replace(",", "."));
  if (isNaN(num) || num <= 0) return "—";
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "€";
  const formattedNum = num.toFixed(2).replace(".", ",");
  return currency === "USD" ? `$${formattedNum}` : `${formattedNum} ${symbol}`;
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
  const JsPdfConstructor = jsPDF.jsPDF || jsPDF;
  const doc = new JsPdfConstructor({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const marginTop = 18;
  const marginBottom = 18;
  const contentWidth = pageWidth - marginX * 2; // exactly 182mm

  // Determine dynamic column widths based on contents
  const getColWeight = (elems) => {
    if (!elems || elems.length === 0) return 20;
    let weight = 0;
    if (elems.includes("recipeImage")) weight += 30;
    if (elems.includes("recipeName")) weight += 45;
    if (elems.includes("ingredientsList")) weight += 45;
    if (elems.includes("allergensIcons")) weight += 35;
    if (elems.includes("allergensText")) weight += 35;
    if (elems.includes("price")) weight += 28;
    if (elems.includes("elaborationInstructions")) weight += 40;
    if (elems.includes("conservationInstructions")) weight += 30;
    return Math.max(weight, 25);
  };

  const w1 = getColWeight(col1Elements);
  const w2 = getColWeight(col2Elements);
  const w3 = getColWeight(col3Elements);
  const w4 = getColWeight(col4Elements);
  const totalWeight = w1 + w2 + w3 + w4;

  const colWidths = [
    Math.round((w1 / totalWeight) * contentWidth * 10) / 10,
    Math.round((w2 / totalWeight) * contentWidth * 10) / 10,
    Math.round((w3 / totalWeight) * contentWidth * 10) / 10,
    0
  ];
  // Guarantee exact fit for Column 4 to reach contentWidth with zero overflow
  colWidths[3] = Math.round((contentWidth - (colWidths[0] + colWidths[1] + colWidths[2])) * 10) / 10;

  const colPositions = [
    marginX,
    marginX + colWidths[0],
    marginX + colWidths[0] + colWidths[1],
    marginX + colWidths[0] + colWidths[1] + colWidths[2]
  ];

  let currentY = marginTop;

  // Header drawing helper (NO green top bar)
  const drawHeader = (isContinuation = false) => {
    // Title
    if (menuTitle && menuTitle.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(30, 41, 59); // slate-800
      const displayTitle = isContinuation ? `${menuTitle.trim()} (cont.)` : menuTitle.trim();
      doc.text(displayTitle, pageWidth / 2, currentY + 6, { align: "center" });
      currentY += 10;
    }

    // Subtitle (from textarea, multiline, only on first page)
    if (!isContinuation && menuSubtitle && menuSubtitle.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139); // slate-500
      const lines = doc.splitTextToSize(menuSubtitle.trim(), contentWidth - 20);
      lines.forEach(line => {
        doc.text(line, pageWidth / 2, currentY + 3, { align: "center" });
        currentY += 4.5;
      });
      currentY += 2;
    }

    // Elegant divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(marginX, currentY + 2, marginX + contentWidth, currentY + 2);
    currentY += 6;
  };

  // Helper to get column header title
  const getColumnHeaderTitle = (elems, colIndex) => {
    if (!elems || elems.length === 0) return `${t("recipes.col_header_generic") || "Columna"} ${colIndex + 1}`;
    const labels = elems.map(e => {
      switch (e) {
        case "recipeImage": return t("recipes.col_header_photo") || "FOTO";
        case "recipeName": return t("recipes.col_header_dish") || "PLATO";
        case "ingredientsList": return t("recipes.col_header_ingredients") || "INGREDIENTES";
        case "allergensIcons":
        case "allergensText": return t("recipes.col_header_allergens") || "ALÉRGENOS";
        case "price": return t("recipes.col_header_price") || "PRECIO";
        case "elaborationInstructions": return t("recipes.col_header_elaboration") || "ELABORACIÓN";
        case "conservationInstructions": return t("recipes.col_header_conservation") || "CONSERVACIÓN";
        default: return "";
      }
    }).filter(Boolean);

    const unique = [...new Set(labels)];
    if (unique.length === 0) return `${t("recipes.col_header_generic") || "Columna"} ${colIndex + 1}`;
    return unique.join(" / ");
  };

  // Helper to draw the table header row
  const drawTableHeader = () => {
    const headerHeight = 8;
    // Header background fill
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(marginX, currentY, contentWidth, headerHeight, "F");

    // Header border top & bottom
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.4);
    doc.rect(marginX, currentY, contentWidth, headerHeight, "S");

    // Vertical dividers in header
    for (let c = 1; c < 4; c++) {
      doc.line(colPositions[c], currentY, colPositions[c], currentY + headerHeight);
    }

    // Column titles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85); // slate-700

    const colTitles = [
      getColumnHeaderTitle(col1Elements, 0),
      getColumnHeaderTitle(col2Elements, 1),
      getColumnHeaderTitle(col3Elements, 2),
      getColumnHeaderTitle(col4Elements, 3)
    ];

    for (let c = 0; c < 4; c++) {
      const title = colTitles[c].toUpperCase();
      const x = colPositions[c];
      const w = colWidths[c];
      const isCenter = (c === 0 && col1Elements.includes("recipeImage")) ||
                       (c === 3 && col4Elements.includes("price")) ||
                       (c === 2 && col3Elements.includes("allergensIcons"));
      if (isCenter) {
        doc.text(title, x + w / 2, currentY + 5.2, { align: "center" });
      } else {
        doc.text(title, x + 3, currentY + 5.2);
      }
    }

    currentY += headerHeight;
  };

  // Draw initial page header and table header
  drawHeader(false);
  drawTableHeader();

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
    const innerW = colW - 6;

    elements.forEach((elem) => {
      switch (elem) {
        case "recipeImage":
          height += 24; // 20mm image + 4mm margin
          break;
        case "recipeName": {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          const lines = doc.splitTextToSize(recipe.name || "", innerW);
          height += lines.length * 4.2 + paddingInternal;
          break;
        }
        case "ingredientsList": {
          const ings = recipe.ingredients || [];
          if (ings.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            const ingText = ings.map(i => `${i.name}${i.amount ? ` (${i.amount} ${i.unit || ""})`.trim() : ""}`).join(", ");
            const lines = doc.splitTextToSize(ingText, innerW);
            height += lines.length * 3.3 + paddingInternal;
          }
          break;
        }
        case "allergensIcons": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            height += 9; // icon badge row
          } else {
            height += 6;
          }
          break;
        }
        case "allergensText": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            const text = "Contiene: " + allg.map(getAllergenName).join(", ");
            const lines = doc.splitTextToSize(text, innerW);
            height += lines.length * 3.1 + paddingInternal;
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
            doc.setFontSize(7.5);
            const lines = doc.splitTextToSize(recipe.elaborationInstructions, innerW);
            height += lines.length * 3.2 + paddingInternal;
          }
          break;
        }
        case "conservationInstructions": {
          if (recipe.conservationInstructions) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.2);
            const lines = doc.splitTextToSize(recipe.conservationInstructions, innerW);
            height += lines.length * 3.1 + paddingInternal;
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
    const innerW = colW - 6;

    elements.forEach((elem) => {
      switch (elem) {
        case "recipeImage": {
          const imgSize = Math.min(20, colW - 6);
          const imgX = x + (colW - imgSize) / 2;
          if (recipe.imageUrl) {
            try {
              doc.addImage(recipe.imageUrl, "JPEG", imgX, curY, imgSize, imgSize);
              curY += imgSize + 2;
            } catch (e) {
              // Fallback placeholder box
              doc.setDrawColor(203, 213, 225);
              doc.setFillColor(248, 250, 252);
              doc.roundedRect(imgX, curY, imgSize, imgSize, 2, 2, "FD");
              curY += imgSize + 2;
            }
          } else {
            // Subtle placeholder
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(imgX, curY, imgSize, imgSize, 2, 2, "FD");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(6.5);
            doc.setTextColor(148, 163, 184);
            doc.text("Sin foto", x + colW / 2, curY + imgSize / 2 + 1, { align: "center" });
            curY += imgSize + 2;
          }
          break;
        }
        case "recipeName": {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          const lines = doc.splitTextToSize(recipe.name || "", innerW);
          doc.text(lines, x + 3, curY + 3.2);
          curY += lines.length * 4.2 + 1;
          break;
        }
        case "ingredientsList": {
          const ings = recipe.ingredients || [];
          if (ings.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            const ingText = ings.map(i => `${i.name}${i.amount ? ` (${i.amount} ${i.unit || ""})`.trim() : ""}`).join(", ");
            const lines = doc.splitTextToSize(ingText, innerW);
            doc.text(lines, x + 3, curY + 2.5);
            curY += lines.length * 3.3 + 1;
          }
          break;
        }
        case "allergensIcons": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            let iconX = x + 3;
            const iconSize = 6;
            allg.forEach((allergenKey) => {
              if (iconX + iconSize > x + colW - 3) return; // avoid cell overflow
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
          } else {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(148, 163, 184);
            doc.text("—", x + colW / 2, curY + 3.5, { align: "center" });
            curY += 6;
          }
          break;
        }
        case "allergensText": {
          const allg = recipe.allergens || [];
          if (allg.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(180, 83, 9); // amber tone
            const text = "Alérgenos: " + allg.map(getAllergenName).join(", ");
            const lines = doc.splitTextToSize(text, innerW);
            doc.text(lines, x + 3, curY + 2.5);
            curY += lines.length * 3.1 + 1;
          }
          break;
        }
        case "price": {
          // Resolve price: from menuConfig override, or recipe.price, or latest elaboration unitPrice
          const customPrice = menuConfig.recipePrices?.[recipe.id];
          const rawPrice = (customPrice !== undefined && customPrice !== "")
            ? customPrice
            : (recipe.price !== undefined && recipe.price !== null && recipe.price !== ""
                ? recipe.price
                : recipe.elaborations?.[0]?.unitPrice);

          const formatted = formatPrice(rawPrice, currency);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          if (formatted === "—") {
            doc.setTextColor(148, 163, 184); // muted gray for dash
          } else {
            doc.setTextColor(21, 128, 61); // green for price
          }
          doc.text(formatted, x + colW / 2, curY + 4, { align: "center" });
          curY += 7;
          break;
        }
        case "elaborationInstructions": {
          if (recipe.elaborationInstructions) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            const lines = doc.splitTextToSize(recipe.elaborationInstructions, innerW);
            doc.text(lines, x + 3, curY + 2.5);
            curY += lines.length * 3.2 + 1;
          }
          break;
        }
        case "conservationInstructions": {
          if (recipe.conservationInstructions) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.2);
            doc.setTextColor(100, 116, 139);
            const lines = doc.splitTextToSize(recipe.conservationInstructions, innerW);
            doc.text(lines, x + 3, curY + 2.5);
            curY += lines.length * 3.1 + 1;
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
      drawTableHeader();
    }

    // Row background (alternating subtle tone)
    if (rIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(marginX, currentY, contentWidth, rowHeight, "F");

    // Grid lines for this row:
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);

    // Left and right outer borders
    doc.line(marginX, currentY, marginX, currentY + rowHeight);
    doc.line(marginX + contentWidth, currentY, marginX + contentWidth, currentY + rowHeight);

    // Vertical column divider lines
    for (let c = 1; c < 4; c++) {
      doc.line(colPositions[c], currentY, colPositions[c], currentY + rowHeight);
    }

    // Row bottom border
    doc.line(marginX, currentY + rowHeight, marginX + contentWidth, currentY + rowHeight);

    // Render cells in each column
    renderCellContent(col1Elements, recipe, colPositions[0], currentY, colWidths[0]);
    renderCellContent(col2Elements, recipe, colPositions[1], currentY, colWidths[1]);
    renderCellContent(col3Elements, recipe, colPositions[2], currentY, colWidths[2]);
    renderCellContent(col4Elements, recipe, colPositions[3], currentY, colWidths[3]);

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
