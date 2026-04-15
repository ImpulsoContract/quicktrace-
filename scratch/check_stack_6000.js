import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let stack = [];
for (let i = 0; i < 6000; i++) {
    if (i >= lines.length) break;
    const line = lines[i].trim();
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    
    for (let k = 0; k < opens; k++) stack.push(i + 1);
    for (let k = 0; k < closes; k++) stack.pop();
}

console.log('Unclosed divs at line 6000:', stack);
