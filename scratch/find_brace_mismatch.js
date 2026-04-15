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

let globalBrace = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let sep of separators) {
        if (i === sep.start) sep.startBrace = globalBrace;
        if (i === sep.end) sep.endBrace = globalBrace;
    }
    
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    globalBrace += opens - closes;
}

for (let sep of separators) {
    if (sep.startBrace !== undefined) {
        console.log(`Tab ${sep.name}: ${sep.startBrace} -> ${sep.endBrace} (diff: ${sep.endBrace - sep.startBrace})`);
    }
}
