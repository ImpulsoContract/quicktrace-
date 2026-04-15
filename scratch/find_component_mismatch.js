import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

const separators = [
    { name: 'Dashboard', start: 258, end: 5986 },
    { name: 'CleaningModal', start: 5988, end: 6072 },
    { name: 'BusinessConfig', start: 6074, end: 6407 },
    { name: 'IngredientCost', start: 6409, end: 6523 },
    { name: 'GoodsReceipt', start: 6525, end: 7215 },
    { name: 'PlanUsage', start: 6966, end: 7004 },
];

let globalLevel = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let sep of separators) {
        if (i === sep.start) {
            sep.startLevel = globalLevel;
        }
        if (i === sep.end) {
            sep.endLevel = globalLevel;
        }
    }
    
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    globalLevel += opens - closes;
}

for (let sep of separators) {
    if (sep.startLevel !== undefined) {
        console.log(`Func ${sep.name}: ${sep.startLevel} -> ${sep.endLevel} (diff: ${sep.endLevel - sep.startLevel})`);
    }
}
