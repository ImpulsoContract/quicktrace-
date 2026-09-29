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
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

