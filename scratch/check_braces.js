import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let stack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{') {
            stack.push({ line: i + 1, char: '{' });
        } else if (char === '}') {
            if (stack.length === 0) {
                console.log(`Extra } at line ${i + 1}`);
            } else {
                stack.pop();
            }
        }
    }
}

if (stack.length > 0) {
    console.log('Unclosed braces at lines:', stack);
} else {
    console.log('All braces balanced');
}
