import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');

function count(char) {
    return content.split(char).length - 1;
}

console.log('Braces: { =', count('{'), ', } =', count('}'));
console.log('Parens: ( =', count('('), ', ) =', count(')'));
console.log('Brackets: [ =', count('['), ', ] =', count(']'));
console.log('Divs: <div =', count('<div'), ', </div =', count('</div'));
console.log('Single quotes:', count("'"));
console.log('Double quotes:', count('"'));
console.log('Backticks:', count('`'));
