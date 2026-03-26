/**
 * Diagnostic script to verify PDF generation logic
 */
const DEFAULT_LABEL_CONFIG = {
  headerImage: null,
  showFields: {
    lote: true,
    person: false,
    date: true,
    expiration: true
  },
  ingredientOptions: {
    showLote: false,
    showAmount: false,
    format: 'list'
  },
  fontSize: 14,
  columnsCount: 1,
  columns: {
    col1: ["recipeName", "lote", "elaborationDate", "expirationDate", "ingredientsList"],
    col2: []
  }
};

const mergeLabelConfig = (rawConfig) => {
  let config = rawConfig;
  if (typeof rawConfig === "string") {
    try {
      config = JSON.parse(rawConfig);
    } catch (e) {
      config = {};
    }
  }

  if (!config || Object.keys(config).length === 0) return DEFAULT_LABEL_CONFIG;
  
  let mergedCols = config.columns || DEFAULT_LABEL_CONFIG.columns;
  return {
    ...DEFAULT_LABEL_CONFIG,
    ...config,
    columns: mergedCols,
    ingredientOptions: { ...DEFAULT_LABEL_CONFIG.ingredientOptions, ...(config.ingredientOptions || {}) },
    dimensions: { 
        width: parseInt(config.dimensions?.width) || 100, 
        height: parseInt(config.dimensions?.height) || 50 
    },
    columnsCount: parseInt(config.columnsCount) || 1,
    fontSize: parseInt(config.fontSize) || 14
  };
};

// Simulate a user config with strings (which might come from inputs)
const userConfig = {
    dimensions: { width: "110", height: "60" },
    columnsCount: "2",
    columns: {
        col1: ["recipeName", "lote"],
        col2: ["ingredientsList"]
    }
};

const merged = mergeLabelConfig(userConfig);
console.log("Merged Config Dimensions:", merged.dimensions);
console.log("Merged Config ColumnsCount:", merged.columnsCount, typeof merged.columnsCount);

// Test dimension calculation logic in generateLabelPDF
let storedWidth = merged.dimensions?.width;
let storedHeight = merged.dimensions?.height;

if (storedWidth && storedWidth < 30) storedWidth *= 10; 
if (storedHeight && storedHeight < 30) storedHeight *= 10;

const docWidthMM = storedWidth || 100;
const docHeightMM = storedHeight || 50;

console.log(`PDF Dimensions: ${docWidthMM}x${docHeightMM}`);

const x = 5;
const horizontalMidpoint = docWidthMM / 2;
const columnWidth = merged.columnsCount === 2 
    ? (docWidthMM / 2) - x - 5 
    : docWidthMM - (x * 2);

console.log(`Column Width: ${columnWidth}`);

const isTwoCols = merged.columnsCount === 2;
const pWidth = isTwoCols ? ((docWidthMM / 2) - 10) : (docWidthMM - 10);
console.log(`Paragraph Width (pWidth): ${pWidth}`);
