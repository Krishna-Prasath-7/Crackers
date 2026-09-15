const fs = require('fs');
const path = require('path');

const patterns = [
    { name: 'F.P abbreviation', re: /\bF\.P\b/gi },
    { name: 'G.C abbreviation', re: /\bG\.C\b/gi },
    { name: 'ELE abbreviation', re: /\b\d+\s*CM\s+ELE\b/gi },
    { name: 'COL abbreviation', re: /\b\d+\s*CM\s+COL\b/gi },
    { name: 'SPL abbreviation', re: /\bSPL\b/g },
    { name: 'DLX abbreviation', re: /\bDLX\b/g },
    { name: 'SDLX abbreviation', re: /\bSDLX\b/g },
    { name: 'GAINT typo', re: /\bGAINT\b/gi },
    { name: 'Role typo', re: /\b\d+K\s+Role\b/gi },
    { name: 'Multi Color vs Colour', re: /\bMulti\s+Color\b/gi },
    { name: 'Uppercase PCS', re: /\b\d+\s*PCS\b/g }
];

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (filePath.includes('scratch') || filePath.includes('node_modules')) return;
        patterns.forEach(p => {
            const matches = line.match(p.re);
            if (matches) {
                // If it's a search alias check e.g. alias === 'fp', skip
                if (line.includes('aliasMatch') || line.includes('normQ')) return;
                console.log(`[${p.name}] ${filePath}:${idx + 1} -> ${line.trim()}`);
            }
        });
    });
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') walk(full);
        } else if (file.endsWith('.js') || file.endsWith('.html')) {
            scanFile(full);
        }
    });
}

walk('.');
console.log('--- Scan completed ---');
