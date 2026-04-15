import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let stack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Simple parser for <div and </div
    // This is approximate but should catch most
    let pos = 0;
    while (true) {
        let openPos = line.indexOf('<div', pos);
        let closePos = line.indexOf('</div', pos);
        
        if (openPos === -1 && closePos === -1) break;
        
        if (openPos !== -1 && (closePos === -1 || openPos < closePos)) {
            stack.push(i + 1);
            pos = openPos + 4;
        } else {
            stack.pop();
            pos = closePos + 5;
        }
    }
}

console.log('Unclosed divs started at lines:', stack);
