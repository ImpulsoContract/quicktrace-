import fs from 'fs';

const content = fs.readFileSync('C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js', 'utf8');
const lines = content.split('\n');

const patterns = ["div style={{ overflowX: 'auto' }}", "div className=\"glass-card\" style={{ background: 'white', overflow: 'hidden' }}"];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("div style={{ overflowX: 'auto' }}")) {
        console.log(`Found open div at line ${i + 1}`);
        // Now find its closing div by tracking levels locally
        let divLevel = 1;
        let found = false;
        for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j];
            const opens = (nextLine.match(/<div/g) || []).length;
            const closes = (nextLine.match(/<\/div/g) || []).length;
            divLevel += opens - closes;
            if (divLevel === 0) {
                console.log(`  Closed at line ${j + 1}`);
                found = true;
                break;
            }
        }
        if (!found) {
            console.log(`  NOT CLOSED! Current divLevel=${divLevel}`);
        }
    }
}
