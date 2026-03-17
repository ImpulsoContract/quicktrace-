/**
 * Validates if a string is a valid EAN-13 barcode.
 * It must be exactly 13 digits long and the checksum must match.
 * @param {string} barcode 
 * @returns {boolean}
 */
export function isValidEAN13(barcode) {
  if (!barcode || typeof barcode !== 'string') return false;
  
  // Must be composed of exactly 13 digits
  if (!/^\d{13}$/.test(barcode)) return false;

  const digits = barcode.split('').map(Number);
  const dataDigits = digits.slice(0, 12);
  const checksumDigit = digits[12];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += dataDigits[i] * (i % 2 === 0 ? 1 : 3);
  }

  const remainder = sum % 10;
  const expectedChecksum = remainder === 0 ? 0 : 10 - remainder;

  return checksumDigit === expectedChecksum;
}

/**
 * Generates a random valid EAN-13 barcode string.
 * @returns {string}
 */
export function generateRandomEAN13() {
  // EAN-13 usually has a country code, company code, and item code.
  // For internal use, we can just generate 12 random digits and calculate the 13th.
  let data = '';
  // Let's start with '20' which is often used for in-store/internal barcodes
  data += '20';
  for (let i = 0; i < 10; i++) {
    data += Math.floor(Math.random() * 10).toString();
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(data[i]) * (i % 2 === 0 ? 1 : 3);
  }

  const remainder = sum % 10;
  const checksum = remainder === 0 ? 0 : 10 - remainder;

  return data + checksum.toString();
}
