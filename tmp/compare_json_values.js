const fs = require('fs');
const es = require('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/lib/i18n/locales/es.json');
const en = require('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/lib/i18n/locales/en.json');

const untranslated = [];

function checkKeys(esObj, enObj, path = '') {
  for (const key in esObj) {
    const fullPath = path ? `${path}.${key}` : key;
    if (typeof esObj[key] === 'object' && esObj[key] !== null) {
      if (enObj && enObj[key]) {
        checkKeys(esObj[key], enObj[key], fullPath);
      }
    } else if (typeof esObj[key] === 'string') {
      if (enObj && enObj[key] === esObj[key]) {
          // If it's a number like "3" or similar very short string, maybe it's fine. But let's log them all.
          untranslated.push({ path: fullPath, value: esObj[key] });
      }
    }
  }
}

checkKeys(es, en);

console.log(JSON.stringify(untranslated, null, 2));
