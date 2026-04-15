import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let level = 0;
const intervals = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 8473];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    level += opens - closes;
    
    if (intervals.includes(i + 1)) {
        console.log(`Line ${i + 1}: level ${level}`);
    }
}
