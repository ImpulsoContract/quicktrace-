import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let stack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Simplistic matchers for open and close
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    
    for (let k = 0; k < opens; k++) {
        stack.push({ line: i + 1, content: line });
    }
    for (let k = 0; k < closes; k++) {
        if (stack.length > 0) {
            stack.pop();
        }
    }
}

console.log('Final unclosed stack (count):', stack.length);
console.log('Top of stack (last 10):');
stack.slice(-10).forEach(s => console.log(`${s.line}: ${s.content}`));
