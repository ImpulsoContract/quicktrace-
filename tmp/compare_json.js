const fs = require('fs');
const es = require('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/lib/i18n/locales/es.json');
const en = require('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/lib/i18n/locales/en.json');

const missing = [];

function checkKeys(esObj, enObj, path = '') {
  for (const key in esObj) {
    const fullPath = path ? `${path}.${key}` : key;
    if (!(key in enObj)) {
      missing.push({ path: fullPath, esValue: esObj[key], enObjPath: path, keyName: key });
    } else if (typeof esObj[key] === 'object' && esObj[key] !== null) {
      checkKeys(esObj[key], enObj[key], fullPath);
    }
  }
}

checkKeys(es, en);

console.log(JSON.stringify(missing, null, 2));
