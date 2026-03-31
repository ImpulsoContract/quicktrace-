import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Users/usuario/.gemini/antigravity/scratch/quicktrace/lib/i18n/locales';
const sourceFile = path.join(localesDir, 'es.json');
const targetFiles = ['it.json', 'fr.json', 'en.json'];

const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const sourceKeys = getKeys(sourceData);

targetFiles.forEach(file => {
  const targetPath = path.join(localesDir, file);
  if (!fs.existsSync(targetPath)) {
    console.log(`File ${file} is missing.`);
    return;
  }
  const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  const targetKeys = getKeys(targetData);
  
  const missingKeys = sourceKeys.filter(k => !targetKeys.includes(k));
  if (missingKeys.length > 0) {
    console.log(`\n--- Missing keys in ${file} ---`);
    missingKeys.forEach(k => console.log(k));
  } else {
    console.log(`\n--- ${file} is up to date with es.json ---`);
  }
});
