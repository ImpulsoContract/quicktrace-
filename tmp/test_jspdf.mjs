import { jsPDF } from 'jspdf';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: [100, 50]
});

doc.setFont("helvetica", "normal");
doc.setFontSize(14);

const text = "Sal, Pimienta Negra Molida, Aceite de Oliva Virgen Extra, Ajo en Polvo, Cebolla Deshidratada, Mix de Especias (Pimentón, Comino, Orégano), Agua purificada.";

// Test splitTextToSize with columnWidth 90
const splitRes1 = doc.splitTextToSize(text, 90);
console.log("splitTextToSize(90) returned array of lines:", splitRes1.length);
console.log(splitRes1);

// Test splitTextToSize with columnWidth * 3
const splitRes2 = doc.splitTextToSize(text, 270);
console.log("splitTextToSize(270) returned array of lines:", splitRes2.length);

// What if string has no spaces but commas?
const nospace = "Sal,Pimienta,Aceite,Agua";
console.log("nospace:", doc.splitTextToSize(nospace, 30).length);

// Test if doc.text with array works correctly
doc.text(splitRes1, 5, 10);
console.log("Array printed via doc.text");

