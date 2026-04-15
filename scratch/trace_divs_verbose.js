import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let level = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    const oldLevel = level;
    level += opens - closes;
    if (level !== oldLevel) {
        console.log(`Line ${i + 1}: level ${oldLevel} -> ${level} (${line.trim().substring(0, 50)})`);
    }
}
