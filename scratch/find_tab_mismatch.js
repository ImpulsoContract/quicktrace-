import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

const separators = [
    { name: 'historial', start: 3218, end: 3613 },
    { name: 'entradas', start: 3613, end: 4000 },
    { name: 'limpieza', start: 4000, end: 4211 },
    { name: 'temperaturas', start: 4211, end: 4371 },
    { name: 'agua', start: 4371, end: 4458 },
    { name: 'trabajadores', start: 4458, end: 4537 },
    { name: 'gestionar-recetas', start: 4537, end: 4695 },
    { name: 'afiliados', start: 4695, end: 4932 },
    { name: 'elaboraciones', start: 4932, end: 5156 }
];

let globalLevel = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let sep of separators) {
        if (i === sep.start) {
            console.log(`Tab ${sep.name} START: line ${i + 1}, level ${globalLevel}`);
            sep.startLevel = globalLevel;
        }
        if (i === sep.end) {
            console.log(`Tab ${sep.name} END: line ${i + 1}, level ${globalLevel}`);
            sep.endLevel = globalLevel;
        }
    }
    
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    globalLevel += opens - closes;
}
