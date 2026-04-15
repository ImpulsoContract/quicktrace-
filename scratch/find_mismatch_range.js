import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

let divLevel = 0;
let lastZeroLevelLine = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    const prevLevel = divLevel;
    divLevel += opens - closes;
    
    if (divLevel === 0 && prevLevel !== 0) {
        lastZeroLevelLine = i + 1;
    }
}

console.log(`Last time divLevel was 0: line ${lastZeroLevelLine}`);
console.log(`Current divLevel: ${divLevel}`);

// Check from lastZeroLevelLine to end
for (let i = lastZeroLevelLine; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;
    if (opens !== 0 || closes !== 0) {
        console.log(`Line ${i + 1}: <div=${opens}, </div=${closes}`);
    }
}
