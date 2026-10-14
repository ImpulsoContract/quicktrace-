const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../lib/i18n/locales');

const keysToAdd = {
  es: {
    observations: "Observaciones",
    observations_placeholder: "Observaciones sobre la retirada...",
    table_observations: "Observaciones"
  },
  en: {
    observations: "Observations",
    observations_placeholder: "Observations on collection...",
    table_observations: "Observations"
  },
  fr: {
    observations: "Observations",
    observations_placeholder: "Observations sur l'enlèvement...",
    table_observations: "Observations"
  },
  it: {
    observations: "Osservazioni",
    observations_placeholder: "Osservazioni sul ritiro...",
    table_observations: "Osservazioni"
  },
  pt: {
    observations: "Observações",
    observations_placeholder: "Observações sobre a recolha...",
    table_observations: "Observações"
  }
};

['es', 'en', 'fr', 'it', 'pt'].forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.waste = {
    ...data.waste,
    ...keysToAdd[lang]
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated waste in ${lang}.json successfully.`);
});
