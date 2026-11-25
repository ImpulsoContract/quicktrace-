// Allergen icons generator for vitrina labels and PDF export
// Covers all 14 EU Regulation 1169/2011 allergens with crisp vector-rendered canvas badges

const ALLERGENS = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soy",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupins",
  "molluscs"
];

// Short badge codes for extra clarity
const ALLERGEN_CODES = {
  gluten: "GLU",
  crustaceans: "CRU",
  eggs: "HUE",
  fish: "PES",
  peanuts: "CAC",
  soy: "SOJ",
  milk: "LAC",
  nuts: "FRU",
  celery: "API",
  mustard: "MOS",
  sesame: "SES",
  sulphites: "SUL",
  lupins: "ALT",
  molluscs: "MOL"
};

/**
 * Draws an allergen pictogram on a 2D canvas context
 */
function drawAllergenIcon(ctx, key, size) {
  const center = size / 2;
  const radius = (size / 2) - 4;

  ctx.save();
  ctx.clearRect(0, 0, size, size);

  // Outer circle with clean border
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = Math.max(2, size * 0.045);
  ctx.strokeStyle = "#1e293b";
  ctx.stroke();

  // Internal scale for drawings (-1 to 1 space mapped to central area)
  const drawArea = size * 0.42;
  const s = drawArea;

  ctx.translate(center, center - (size * 0.05));
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = Math.max(1.5, size * 0.035);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (key) {
    case "gluten": {
      // Wheat ear
      ctx.beginPath();
      // Stem
      ctx.moveTo(0, s * 0.65);
      ctx.lineTo(0, -s * 0.55);
      ctx.stroke();
      // Grains
      for (let i = -2; i <= 2; i++) {
        const gy = i * (s * 0.22);
        // Left grain
        ctx.beginPath();
        ctx.ellipse(-s * 0.22, gy, s * 0.18, s * 0.09, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        // Right grain
        ctx.beginPath();
        ctx.ellipse(s * 0.22, gy, s * 0.18, s * 0.09, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case "crustaceans": {
      // Shrimp / Prawn
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.45, Math.PI * 0.7, Math.PI * 1.9);
      ctx.stroke();
      // Body segments
      ctx.beginPath();
      ctx.ellipse(s * 0.05, -s * 0.1, s * 0.35, s * 0.2, Math.PI / 3, 0, Math.PI * 2);
      ctx.fill();
      // Tail fan
      ctx.beginPath();
      ctx.moveTo(-s * 0.25, s * 0.3);
      ctx.lineTo(-s * 0.45, s * 0.45);
      ctx.lineTo(-s * 0.2, s * 0.48);
      ctx.fill();
      // Antennae
      ctx.beginPath();
      ctx.moveTo(s * 0.25, -s * 0.35);
      ctx.quadraticCurveTo(s * 0.5, -s * 0.55, s * 0.4, -s * 0.7);
      ctx.stroke();
      break;
    }

    case "eggs": {
      // Egg silhouette
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.bezierCurveTo(s * 0.45, -s * 0.5, s * 0.48, s * 0.45, 0, s * 0.55);
      ctx.bezierCurveTo(-s * 0.48, s * 0.45, -s * 0.45, -s * 0.5, 0, -s * 0.6);
      ctx.fill();
      // Inner shine
      ctx.beginPath();
      ctx.arc(-s * 0.12, -s * 0.15, s * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      break;
    }

    case "fish": {
      // Fish outline
      ctx.beginPath();
      ctx.moveTo(-s * 0.45, -s * 0.35);
      ctx.quadraticCurveTo(s * 0.1, s * 0.55, s * 0.5, 0);
      ctx.quadraticCurveTo(s * 0.1, -s * 0.55, -s * 0.45, s * 0.35);
      ctx.lineTo(-s * 0.3, 0);
      ctx.closePath();
      ctx.fill();
      // Eye
      ctx.beginPath();
      ctx.arc(s * 0.3, -s * 0.05, s * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      break;
    }

    case "peanuts": {
      // Peanut shell (figure 8)
      ctx.beginPath();
      ctx.arc(0, -s * 0.22, s * 0.24, 0, Math.PI * 2);
      ctx.arc(0, s * 0.22, s * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-s * 0.04, -s * 0.25, s * 0.08, s * 0.5);
      break;
    }

    case "soy": {
      // Soy pod with beans
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, -s * 0.45);
      ctx.quadraticCurveTo(s * 0.45, -s * 0.1, s * 0.3, s * 0.5);
      ctx.quadraticCurveTo(-s * 0.1, s * 0.2, -s * 0.35, -s * 0.45);
      ctx.fill();
      // 3 beans
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(-s * 0.05, -s * 0.18, s * 0.08, 0, Math.PI * 2);
      ctx.arc(0.05 * s, 0.05 * s, s * 0.09, 0, Math.PI * 2);
      ctx.arc(0.15 * s, 0.28 * s, s * 0.08, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "milk": {
      // Milk bottle
      ctx.beginPath();
      // Cap/Neck
      ctx.rect(-s * 0.12, -s * 0.55, s * 0.24, s * 0.18);
      // Body
      ctx.moveTo(-s * 0.12, -s * 0.37);
      ctx.lineTo(-s * 0.25, -s * 0.15);
      ctx.lineTo(-s * 0.25, s * 0.5);
      ctx.quadraticCurveTo(-s * 0.25, s * 0.58, -s * 0.15, s * 0.58);
      ctx.lineTo(s * 0.15, s * 0.58);
      ctx.quadraticCurveTo(s * 0.25, s * 0.58, s * 0.25, s * 0.5);
      ctx.lineTo(s * 0.25, -s * 0.15);
      ctx.lineTo(s * 0.12, -s * 0.37);
      ctx.closePath();
      ctx.fill();
      // Drop symbol inside
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, s * 0.2, s * 0.08, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "nuts": {
      // Hazelnut / Acorn
      ctx.beginPath();
      ctx.arc(0, s * 0.05, s * 0.38, 0, Math.PI);
      ctx.lineTo(0, s * 0.55);
      ctx.closePath();
      ctx.fill();
      // Cap
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.4, s * 0.22, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      // Stem
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.2);
      ctx.lineTo(0, -s * 0.45);
      ctx.stroke();
      break;
    }

    case "celery": {
      // Celery stalk with leaves
      ctx.beginPath();
      ctx.moveTo(-s * 0.1, s * 0.55);
      ctx.quadraticCurveTo(-s * 0.05, -s * 0.1, -s * 0.2, -s * 0.4);
      ctx.moveTo(0.1 * s, s * 0.55);
      ctx.quadraticCurveTo(0.05 * s, -s * 0.1, 0.2 * s, -s * 0.4);
      ctx.stroke();
      // Leaves at top
      ctx.beginPath();
      ctx.ellipse(-s * 0.2, -s * 0.45, s * 0.15, s * 0.1, -Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(0.2 * s, -s * 0.45, s * 0.15, s * 0.1, Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(0, -s * 0.5, s * 0.12, s * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "mustard": {
      // Mustard pot with spoon
      ctx.beginPath();
      ctx.arc(0, s * 0.1, s * 0.35, 0, Math.PI);
      ctx.lineTo(s * 0.35, -s * 0.15);
      ctx.lineTo(-s * 0.35, -s * 0.15);
      ctx.closePath();
      ctx.fill();
      // Spoon
      ctx.beginPath();
      ctx.moveTo(s * 0.05, -s * 0.1);
      ctx.lineTo(s * 0.25, -s * 0.55);
      ctx.stroke();
      break;
    }

    case "sesame": {
      // Sesame seeds cluster
      const seedPositions = [
        [-s * 0.15, -s * 0.2],
        [s * 0.15, -s * 0.15],
        [0, 0.05 * s],
        [-s * 0.2, 0.25 * s],
        [s * 0.18, 0.28 * s]
      ];
      seedPositions.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx, sy, s * 0.12, s * 0.07, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case "sulphites": {
      // Wine bottle & glass or SO2
      ctx.beginPath();
      // Wine glass
      ctx.arc(0, -s * 0.1, s * 0.22, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      // Stem & base
      ctx.beginPath();
      ctx.moveTo(0, s * 0.12);
      ctx.lineTo(0, s * 0.45);
      ctx.moveTo(-s * 0.18, s * 0.45);
      ctx.lineTo(s * 0.18, s * 0.45);
      ctx.stroke();
      break;
    }

    case "lupins": {
      // Lupin flower / butterfly leaf
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.3, s * 0.1, s * 0.22, 0, 0, Math.PI * 2);
      ctx.ellipse(-s * 0.22, -s * 0.1, s * 0.1, s * 0.2, -Math.PI / 3, 0, Math.PI * 2);
      ctx.ellipse(s * 0.22, -s * 0.1, s * 0.1, s * 0.2, Math.PI / 3, 0, Math.PI * 2);
      ctx.ellipse(-s * 0.15, s * 0.18, s * 0.1, s * 0.18, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(s * 0.15, s * 0.18, s * 0.1, s * 0.18, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "molluscs": {
      // Clam shell
      ctx.beginPath();
      ctx.arc(0, s * 0.1, s * 0.45, Math.PI, Math.PI * 2);
      ctx.lineTo(0, s * 0.4);
      ctx.closePath();
      ctx.fill();
      // Shell ribs
      ctx.beginPath();
      ctx.moveTo(0, s * 0.4);
      ctx.lineTo(-s * 0.3, -s * 0.2);
      ctx.moveTo(0, s * 0.4);
      ctx.lineTo(0, -s * 0.35);
      ctx.moveTo(0, s * 0.4);
      ctx.lineTo(s * 0.3, -s * 0.2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = Math.max(1, size * 0.025);
      ctx.stroke();
      break;
    }

    default: {
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  // Label text at bottom of circle
  ctx.restore();
  ctx.save();
  ctx.font = `bold ${Math.round(size * 0.16)}px sans-serif`;
  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const code = ALLERGEN_CODES[key] || key.slice(0, 3).toUpperCase();
  ctx.fillText(code, center, size - (size * 0.17));
  ctx.restore();
}

const ALLERGEN_ICON_CACHE = {};

/**
 * Returns a high-res PNG Data URL for an allergen icon (synchronous via in-memory canvas)
 */
export function getAllergenIconDataUrl(key, size = 120) {
  if (typeof document === "undefined") return null;
  const cacheKey = `${key}_${size}`;
  if (ALLERGEN_ICON_CACHE[cacheKey]) {
    return ALLERGEN_ICON_CACHE[cacheKey];
  }
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  drawAllergenIcon(ctx, key, size);
  const dataUrl = canvas.toDataURL("image/png");
  ALLERGEN_ICON_CACHE[cacheKey] = dataUrl;
  return dataUrl;
}

export { ALLERGENS, ALLERGEN_CODES, drawAllergenIcon };
