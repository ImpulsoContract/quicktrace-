const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../lib/i18n/locales');

const keysToAdd = {
  es: {
    final_elaboration_temp: "Temperatura de terminacion de la elaboración",
    cooling_time_under_10: "Tiempo que ha tardado en bajar a menos de 10 grados",
    cooling_time_under_10_help: "Debería ser inferior a 2 horas"
  },
  en: {
    final_elaboration_temp: "Final elaboration temperature",
    cooling_time_under_10: "Time taken to cool below 10 degrees",
    cooling_time_under_10_help: "Should be less than 2 hours"
  },
  fr: {
    final_elaboration_temp: "Température de fin d'élaboration",
    cooling_time_under_10: "Temps nécessaire pour descendre en dessous de 10 degrés",
    cooling_time_under_10_help: "Devrait être inférieur à 2 heures"
  },
  it: {
    final_elaboration_temp: "Temperatura di fine lavorazione",
    cooling_time_under_10: "Tempo impiegato per scendere sotto i 10 gradi",
    cooling_time_under_10_help: "Dovrebbe essere inferiore a 2 ore"
  },
  pt: {
    final_elaboration_temp: "Temperatura de finalização da elaboração",
    cooling_time_under_10: "Tempo que demorou a descer abaixo de 10 graus",
    cooling_time_under_10_help: "Deverá ser inferior a 2 horas"
  }
};

['es', 'en', 'fr', 'it', 'pt'].forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.traceability_form = {
    ...data.traceability_form,
    ...keysToAdd[lang]
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated traceability_form in ${lang}.json successfully.`);
});
