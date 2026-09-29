export function toTitleCase(str) {
  if (!str) return str;
  return str
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function normalizeProviderName(str) {
  if (!str) return "";
  let s = str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Remove dots so abbreviations match: S.L. -> sl, S.A. -> sa, S.L.U. -> slu
  s = s.replace(/\./g, "");
  // Replace remaining punctuation with space
  s = s.replace(/[,;:\-_/\\|()"'`´]/g, " ");
  // Collapse whitespace
  s = s.replace(/\s+/g, " ").trim();

  // Normalize spaces between single letters of common legal abbreviations
  s = s.replace(/\b(s)\s+(l)\s+(u)\b/g, "$1$2$3");
  s = s.replace(/\b(s)\s+(a)\s+(u)\b/g, "$1$2$3");
  s = s.replace(/\b(s)\s+(l)\b/g, "$1$2");
  s = s.replace(/\b(s)\s+(a)\b/g, "$1$2");
  s = s.replace(/\b(c)\s+(b)\b/g, "$1$2");
  s = s.replace(/\b(s)\s+(c)\b/g, "$1$2");

  return s;
}

export function stripCorporateSuffix(str) {
  if (!str) return "";
  return str
    .replace(/\b(sl|slu|sa|sau|cb|sc|scp|sal|sll|sociedad limitada|sociedad anonima)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchProviderNames(name1, name2) {
  if (!name1 || !name2) return false;
  const norm1 = normalizeProviderName(name1);
  const norm2 = normalizeProviderName(name2);
  if (!norm1 || !norm2) return false;
  if (norm1 === norm2) return true;

  const stripped1 = stripCorporateSuffix(norm1);
  const stripped2 = stripCorporateSuffix(norm2);
  if (stripped1 && stripped2 && stripped1.length >= 2 && stripped1 === stripped2) {
    return true;
  }

  return false;
}
