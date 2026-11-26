import jsPDF from "jspdf";
import { getAllergenIconDataUrl } from "@/lib/allergenIcons";
import { mergeVitrinaLabelConfig } from "@/components/VitrinaLabelConfigModal";

const formatDateTimeDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (e) {
    return dateStr;
  }
};

const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateStr;
  }
};

const formatPrice = (val, currency = "EUR") => {
  if (val === undefined || val === null || val === "") return "";
  const num = parseFloat(String(val).replace(',', '.'));
  if (isNaN(num)) return String(val);
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "€";
  return `${num.toFixed(2)} ${symbol}`;
};

export function generateVitrinaLabelPDF({
  elaboration,
  overrideConfig = null,
  profile = null,
  recipes = [],
  t = (key) => key,
  locale = "es",
  isPreview = false
}) {
  const config = overrideConfig ? mergeVitrinaLabelConfig(overrideConfig, profile) : mergeVitrinaLabelConfig(profile?.vitrinaLabelConfig, profile);

  const foundRecipe = (recipes || []).find(r => r.id === (elaboration?.recipeId || elaboration?.recipe?.id));
  const targetRecipe = {
    ...(foundRecipe || {}),
    ...(elaboration?.recipe || {}),
    useCustomLabelIngredients: (elaboration?.recipe?.useCustomLabelIngredients !== undefined 
      ? elaboration.recipe.useCustomLabelIngredients 
      : foundRecipe?.useCustomLabelIngredients) ?? false,
    customLabelIngredients: (elaboration?.recipe?.customLabelIngredients !== undefined
      ? elaboration.recipe.customLabelIngredients
      : foundRecipe?.customLabelIngredients) ?? "",
    name: elaboration?.recipe?.name || foundRecipe?.name || elaboration?.name || "Elaboración",
    allergens: elaboration?.recipe?.allergens || foundRecipe?.allergens || elaboration?.allergens || []
  };

  let storedWidth = parseInt(config.dimensions?.width, 10);
  let storedHeight = parseInt(config.dimensions?.height, 10);

  if (storedWidth && storedWidth < 30) storedWidth *= 10;
  if (storedHeight && storedHeight < 30) storedHeight *= 10;

  const docWidthMM = storedWidth || 100;
  const docHeightMM = storedHeight || 70;

  const doc = new jsPDF({
    orientation: docWidthMM > docHeightMM ? "l" : "p",
    unit: "mm",
    format: [docWidthMM, docHeightMM]
  });

  const mmFactor = 0.3528;
  const generalFontSize = config.generalFontSize || 11;
  const generalLineHeightMM = (generalFontSize + 2) * mmFactor;

  const margin = 5; // mm
  const availableWidth = docWidthMM - (margin * 2);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);

  let currentY = 5;

  // 1. Header Image (Logo) Centered with 20% horizontal padding
  if (config.headerImage) {
    try {
      const imgProps = doc.getImageProperties(config.headerImage);
      // Logo takes 60% of doc width, centered with 20% on each side
      const logoWidthMM = docWidthMM * 0.60;
      const logoX = docWidthMM * 0.20;
      const logoHeightMM = (imgProps.height * logoWidthMM) / imgProps.width;

      let fileType = "PNG";
      if (config.headerImage.startsWith("data:image/jpeg") || config.headerImage.startsWith("data:image/jpg")) {
        fileType = "JPEG";
      }

      // Constrain height if too tall for label
      const maxLogoHeight = docHeightMM * 0.28;
      let finalLogoW = logoWidthMM;
      let finalLogoH = logoHeightMM;
      let finalLogoX = logoX;

      if (logoHeightMM > maxLogoHeight) {
        finalLogoH = maxLogoHeight;
        finalLogoW = (imgProps.width * finalLogoH) / imgProps.height;
        finalLogoX = (docWidthMM - finalLogoW) / 2;
      }

      doc.addImage(config.headerImage, fileType, finalLogoX, currentY, finalLogoW, finalLogoH);
      currentY += finalLogoH + 3;
    } catch (e) {
      console.error("Error drawing vitrina label logo", e);
    }
  }

  // 2. Free text area (if provided)
  if (config.freeText && config.freeText.trim()) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(Math.max(8, generalFontSize - 1));
    doc.setTextColor(71, 85, 105);

    const splitFreeText = doc.splitTextToSize(config.freeText.trim(), availableWidth);
    doc.text(splitFreeText, docWidthMM / 2, currentY, { align: "center", maxWidth: availableWidth });
    currentY += (splitFreeText.length * (generalFontSize * mmFactor)) + 3;

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
  }

  // 3. Render ordered elements
  const elements = config.elements || ["recipeName", "unitPrice", "ingredientsList", "allergens"];

  elements.forEach((elKey) => {
    // Avoid rendering beyond bottom margin
    if (currentY > docHeightMM - 3) return;

    switch (elKey) {
      case "recipeName": {
        const recipeFontSize = config.recipeNameFontSize || 18;
        const recipeLineHeight = (recipeFontSize + 2) * mmFactor;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(recipeFontSize);
        doc.setTextColor(15, 23, 42);

        const displayName = targetRecipe.name || elaboration?.name || "Elaboración";
        const splitName = doc.splitTextToSize(displayName, availableWidth);
        doc.text(splitName, docWidthMM / 2, currentY + (recipeFontSize * mmFactor * 0.7), { align: "center", maxWidth: availableWidth });
        currentY += (splitName.length * recipeLineHeight) + 2;
        break;
      }

      case "unitPrice": {
        const priceVal = elaboration?.unitPrice;
        if (priceVal !== undefined && priceVal !== null && String(priceVal).trim() !== "") {
          const priceFontSize = config.priceFontSize || 24;
          const priceLineHeight = (priceFontSize + 2) * mmFactor;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(priceFontSize);
          doc.setTextColor(66, 98, 22); // Corp green

          const formatted = formatPrice(priceVal, profile?.currency || "EUR");
          const unitSuffix = elaboration?.quantityUnit ? ` / ${elaboration.quantityUnit}` : "";
          const priceText = `${formatted}${unitSuffix}`;

          doc.text(priceText, docWidthMM / 2, currentY + (priceFontSize * mmFactor * 0.7), { align: "center" });
          currentY += priceLineHeight + 2;
          doc.setTextColor(30, 41, 59);
        }
        break;
      }

      case "allergens": {
        const rawAllergens = targetRecipe.allergens || [];
        if (rawAllergens.length > 0) {
          if (config.showAllergenIcons) {
            // Render allergen circular pictogram badges
            const iconSizeMM = 7.5;
            const iconGapMM = 1.8;
            const totalWidth = (rawAllergens.length * iconSizeMM) + ((rawAllergens.length - 1) * iconGapMM);

            let rowStartX = totalWidth <= availableWidth
              ? (docWidthMM - totalWidth) / 2
              : margin;

            let iconX = rowStartX;
            let iconY = currentY;

            rawAllergens.forEach((aKey) => {
              if (iconX + iconSizeMM > docWidthMM - margin) {
                // Wrap to next line if row overflows
                iconX = margin;
                iconY += iconSizeMM + iconGapMM;
              }
              try {
                const iconDataUrl = getAllergenIconDataUrl(aKey, 120);
                if (iconDataUrl) {
                  doc.addImage(iconDataUrl, "PNG", iconX, iconY, iconSizeMM, iconSizeMM);
                }
              } catch (err) {
                console.error("Error drawing allergen icon in jsPDF:", err);
              }
              iconX += iconSizeMM + iconGapMM;
            });

            currentY = iconY + iconSizeMM + 3;
          } else {
            // Render textual allergen list
            doc.setFont("helvetica", "bold");
            doc.setFontSize(generalFontSize);
            doc.setTextColor(185, 28, 28); // Alert red tone for allergens

            const allergenNames = rawAllergens.map(a => t(`allergens.list.${a}`) || a).join(", ");
            const allergenText = `${t("allergens.prefix_label") || "Alérgenos: "}${allergenNames}`;
            const splitAllergens = doc.splitTextToSize(allergenText, availableWidth);

            doc.text(splitAllergens, docWidthMM / 2, currentY + (generalFontSize * mmFactor * 0.7), { align: "center", maxWidth: availableWidth });
            currentY += (splitAllergens.length * generalLineHeightMM) + 2;
            doc.setTextColor(30, 41, 59);
          }
        }
        break;
      }

      case "ingredientsList": {
        doc.setFontSize(generalFontSize);
        const isParagraph = config.ingredientOptions?.format === "paragraph";

        if (targetRecipe.useCustomLabelIngredients && targetRecipe.customLabelIngredients && targetRecipe.customLabelIngredients.trim()) {
          doc.setFont("helvetica", "bold");
          doc.text(`${t("modals.ingredients") || "Ingredientes"}:`, margin, currentY);
          currentY += generalLineHeightMM;
          doc.setFont("helvetica", "normal");

          const customText = targetRecipe.customLabelIngredients.trim();
          const splitText = doc.splitTextToSize(customText, availableWidth);
          doc.text(splitText, margin, currentY, { maxWidth: availableWidth, align: "left" });
          currentY += (splitText.length * generalLineHeightMM) + 2;
        } else if (elaboration?.ingredients && elaboration.ingredients.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.text(`${t("modals.ingredients") || "Ingredientes"}:`, margin, currentY);
          currentY += generalLineHeightMM;
          doc.setFont("helvetica", "normal");

          let paragraphParts = [];
          const seen = new Set();

          elaboration.ingredients.forEach((ing) => {
            let displayName = ing.name;
            if (targetRecipe?.ingredients) {
              const recipeIng = targetRecipe.ingredients.find(ri => 
                ri.name?.trim().toLowerCase() === ing.name?.trim().toLowerCase()
              );
              if (recipeIng?.expandItem && recipeIng?.expandedText) {
                displayName = recipeIng.expandedText;
              }
            }

            if (!config.ingredientOptions?.showLote && !config.ingredientOptions?.showAmount) {
              const cleanKey = displayName.trim().toLowerCase();
              if (seen.has(cleanKey)) return;
              seen.add(cleanKey);
            }

            let ingText = isParagraph ? displayName : `- ${displayName}`;
            if (config.ingredientOptions?.showLote && ing.lote) ingText += ` (${ing.lote})`;
            if (config.ingredientOptions?.showAmount) {
              ingText += isParagraph ? ` (${ing.realAmount}${ing.unit})` : `: ${ing.realAmount} ${ing.unit}`;
            }

            if (isParagraph) {
              paragraphParts.push(ingText);
            } else {
              const split = doc.splitTextToSize(ingText, availableWidth);
              doc.text(split, margin, currentY, { align: "left" });
              currentY += (split.length * generalLineHeightMM);
            }
          });

          if (isParagraph && paragraphParts.length > 0) {
            const fullParagraph = paragraphParts.join(", ") + ".";
            const splitP = doc.splitTextToSize(fullParagraph, availableWidth);
            doc.text(splitP, margin, currentY, { maxWidth: availableWidth, align: "justify" });
            currentY += (splitP.length * generalLineHeightMM) + 2;
          } else {
            currentY += 2;
          }
        }
        break;
      }

      case "elaborationDate": {
        if (elaboration?.date) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(generalFontSize);
          const dateStr = formatDateTimeDDMMYYYY(elaboration.date);
          const line = `${t("traceability_form.label_date") || "Fecha"}: ${dateStr}`;
          doc.text(line, margin, currentY);
          currentY += generalLineHeightMM + 1;
        }
        break;
      }

      case "lote": {
        if (elaboration?.name) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(generalFontSize);
          const line = `${t("dashboard.lote") || "Lote"}: ${elaboration.name}`;
          doc.text(line, margin, currentY);
          currentY += generalLineHeightMM + 1;
        }
        break;
      }

      case "elaborationInstructions": {
        if (targetRecipe?.elaborationInstructions && targetRecipe.elaborationInstructions.trim()) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(generalFontSize);
          doc.text(`${t("recipes.elaboration_tab") || "Elaboración"}:`, margin, currentY);
          currentY += generalLineHeightMM;
          doc.setFont("helvetica", "normal");
          const split = doc.splitTextToSize(targetRecipe.elaborationInstructions.trim(), availableWidth);
          doc.text(split, margin, currentY, { maxWidth: availableWidth });
          currentY += (split.length * generalLineHeightMM) + 2;
        }
        break;
      }

      case "conservationInstructions": {
        if (targetRecipe?.conservationInstructions && targetRecipe.conservationInstructions.trim()) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(generalFontSize);
          doc.text(`${t("recipes.conservation_label") || "Conservación"}:`, margin, currentY);
          currentY += generalLineHeightMM;
          doc.setFont("helvetica", "normal");
          const split = doc.splitTextToSize(targetRecipe.conservationInstructions.trim(), availableWidth);
          doc.text(split, margin, currentY, { maxWidth: availableWidth });
          currentY += (split.length * generalLineHeightMM) + 2;
        }
        break;
      }

      case "elaborationNotes": {
        if (elaboration?.extraInfo && elaboration.extraInfo.trim()) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(generalFontSize);
          doc.text(`${t("traceability_form.elaboration_notes") || "Notas"}:`, margin, currentY);
          currentY += generalLineHeightMM;
          doc.setFont("helvetica", "normal");
          const split = doc.splitTextToSize(elaboration.extraInfo.trim(), availableWidth);
          doc.text(split, margin, currentY, { maxWidth: availableWidth });
          currentY += (split.length * generalLineHeightMM) + 2;
        }
        break;
      }

      case "healthRegistry": {
        const hrVal = config.healthRegistry || config.sanitaryRegister || profile?.healthRegistry || profile?.rgs || (isPreview ? "R.S. 26.01234/B" : "");
        if (hrVal && String(hrVal).trim()) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(generalFontSize);
          doc.setTextColor(30, 41, 59);

          const hrLabel = t("vitrina_labels.element_health_registry") || t("modals.labels_health_registry") || "Registro sanitario";
          const lineText = `${hrLabel}: ${String(hrVal).trim()}`;
          const splitHR = doc.splitTextToSize(lineText, availableWidth);
          doc.text(splitHR, margin, currentY);
          currentY += (splitHR.length * generalLineHeightMM) + 1;
        }
        break;
      }

      default:
        break;
    }
  });

  if (isPreview) {
    return doc.output("blob");
  }

  doc.save(`Etiqueta_Vitrina_${elaboration?.name || "elaboracion"}.pdf`);
  return doc;
}
