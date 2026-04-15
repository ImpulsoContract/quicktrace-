import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let output = '';
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    
    if (opens > 0 || closes > 0) {
        output += `Line ${i + 1}: +${opens} -${closes} | ${line.trim()}\n`;
    }
}
fs.writeFileSync('scratch/div_map.txt', output);
