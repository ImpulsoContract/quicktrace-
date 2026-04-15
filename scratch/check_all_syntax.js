import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');

let brace = 0;
let paren = 0;
let bracket = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') brace++;
    if (char === '}') brace--;
    if (char === '(') paren++;
    if (char === ')') paren--;
    if (char === '[') bracket++;
    if (char === ']') bracket--;
}

console.log(`Braces: ${brace}`);
console.log(`Parens: ${paren}`);
console.log(`Brackets: ${bracket}`);
