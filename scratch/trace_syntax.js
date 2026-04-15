import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');

const lines = content.split('\n');
let level = 0;
let divLevel = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    divLevel += opens - closes;
    
    const braceOpens = (line.match(/{/g) || []).length;
    const braceCloses = (line.match(/}/g) || []).length;
    level += braceOpens - braceCloses;

    if (divLevel < 0 || level < 0) {
        console.log(`Line ${i + 1}: Negative level! divLevel=${divLevel}, level=${level}`);
    }
}

console.log(`Final levels: divLevel=${divLevel}, level=${level}`);
