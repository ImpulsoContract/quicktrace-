const { toTitleCase } = require("./lib/utils.js");

const tests = [
  { input: "arroz", expected: "Arroz" },
  { input: "ArRoz", expected: "Arroz" },
  { input: "harina de trigo", expected: "Harina De Trigo" },
  { input: "ACEITE DE OLIVA VIRGEN", expected: "Aceite De Oliva Virgen" },
  { input: "  espárragos   trigueros  ", expected: "Espárragos Trigueros" },
  { input: "pavo", expected: "Pavo" }
];

let failed = false;
tests.forEach(test => {
  const result = toTitleCase(test.input);
  if (result === test.expected) {
    console.log(`PASS: "${test.input}" -> "${result}"`);
  } else {
    console.error(`FAIL: "${test.input}" -> expected "${test.expected}", got "${result}"`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log("All utility tests passed!");
}
