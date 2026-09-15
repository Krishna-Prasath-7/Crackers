function standardizeProductName(name) {
    if (!name || typeof name !== 'string') return '';
    let s = name.trim();

    // 1. Expand F.P / FP abbreviations
    s = s.replace(/\bF\.P\.?\b/gi, 'Flower Pot');
    s = s.replace(/\bFP\b/gi, 'Flower Pot');

    // 2. Expand G.C / GC abbreviations
    s = s.replace(/\bG\.C\.?\b/gi, 'Ground Chakkar');
    s = s.replace(/\bGC\b/gi, 'Ground Chakkar');

    // 3. Sparklers abbreviations (e.g. 10 CM ELE, 15 CM COL, 10 CM GREEN, 10 CM RED)
    s = s.replace(/\b(\d+\s*CM)\s+ELE\b/gi, '$1 Electric Sparkler');
    s = s.replace(/\b(\d+\s*CM)\s+COL\b/gi, '$1 Colour Sparkler');
    s = s.replace(/\b(\d+\s*CM)\s+GREEN\b/gi, '$1 Green Sparkler');
    s = s.replace(/\b(\d+\s*CM)\s+RED\b/gi, '$1 Red Sparkler');
    s = s.replace(/\bELE(?:\s+SPARKLER)?\b/gi, 'Electric Sparkler');
    s = s.replace(/\bCOL(?:\s+SPARKLER)?\b/gi, 'Colour Sparkler');

    // 4. SDLX -> Super Deluxe, DLX -> Deluxe, SPL -> Special
    s = s.replace(/\bSDLX\b/gi, 'Super Deluxe');
    s = s.replace(/\bDLX\b/gi, 'Deluxe');
    s = s.replace(/\bSPL\b/gi, 'Special');

    // 5. Fix common typos
    s = s.replace(/\bGAINT\b/gi, 'Giant');
    s = s.replace(/\b(\d+K)\s+Role\b/gi, '$1 Roll');
    s = s.replace(/\bRole\s*\((Full Count)\)/gi, 'Roll ($1)');

    // 6. Units and consistency
    s = s.replace(/\b(\d+)\s*PCS\b/gi, '$1 Pcs');
    s = s.replace(/\b(\d+)\s*pcs\b/g, '$1 Pcs');
    s = s.replace(/\bMulti\s+Color\b/gi, 'Multi Colour');
    s = s.replace(/\(Multi Color\)/gi, 'Multi Colour');
    s = s.replace(/\(Multi Colour\)/gi, 'Multi Colour');

    // 7. Title case conversion while preserving specific terms, measurements, quotes
    const preserveMap = {
        'cm': 'CM',
        'k': 'K',
        'kg': 'Kg',
        'pcs': 'Pcs',
        'pc': 'Pc',
        'pkt': 'Pkt',
        'box': 'Box',
        'boxes': 'Boxes',
        'roll': 'Roll'
    };

    s = s.replace(/[a-zA-Z0-9'"]+/g, (word) => {
        const lower = word.toLowerCase();
        if (preserveMap[lower]) return preserveMap[lower];
        if (/^\d+k$/i.test(word)) return word.toUpperCase();
        if (/^\d+(\/\d+)?\"?$/.test(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Clean up repeated spaces
    s = s.replace(/\s{2,}/g, ' ').trim();

    return s;
}

const examples = [
    ['F.P BIG', 'Flower Pot Big'],
    ['F.P SPL', 'Flower Pot Special'],
    ['F.P ASHOKA', 'Flower Pot Ashoka'],
    ['F.P GAINT', 'Flower Pot Giant'],
    ['F.P DLX (5PCS)', 'Flower Pot Deluxe (5 Pcs)'],
    ['F.P SDLX (2PCS)', 'Flower Pot Super Deluxe (2 Pcs)'],
    ['G.C BIG (10PCS)', 'Ground Chakkar Big (10 Pcs)'],
    ['G.C SPL', 'Ground Chakkar Special'],
    ['G.C DLX', 'Ground Chakkar Deluxe'],
    ['SPINNER SPL', 'Spinner Special'],
    ['SPINNER DLX', 'Spinner Deluxe'],
    ['10 CM ELE', '10 CM Electric Sparkler'],
    ['10 CM COL', '10 CM Colour Sparkler'],
    ['10 CM GREEN', '10 CM Green Sparkler'],
    ['10 CM RED', '10 CM Red Sparkler'],
    ['15 CM ELE', '15 CM Electric Sparkler'],
    ['15 CM COL', '15 CM Colour Sparkler'],
    ['30 CM ELE', '30 CM Electric Sparkler'],
    ['50 CM ELE', '50 CM Electric Sparkler'],
    ['3 PCS FANCY', '3 Pcs Fancy'],
    ['6 SHOT (Multi Color)', '6 Shot Multi Colour'],
    ['12 SHOT (Multi Color)', '12 Shot Multi Colour'],
    ['15 SHOT (Multi Color)', '15 Shot Multi Colour'],
    ['30 SHOT (Multi Color)', '30 Shot Multi Colour'],
    ['60 SHOT (Multi Color)', '60 Shot Multi Colour'],
    ['1K Role (Full Count)', '1K Roll (Full Count)'],
    ['2K Role (Full Count)', '2K Roll (Full Count)'],
    ['5K Role (Full Count)', '5K Roll (Full Count)'],
    ['10K Role (Full Count)', '10K Roll (Full Count)']
];

let failed = 0;
examples.forEach(([input, expected]) => {
    const actual = standardizeProductName(input);
    if (actual !== expected) {
        console.error(`FAIL: "${input}" -> actual: "${actual}" != expected: "${expected}"`);
        failed++;
    } else {
        console.log(`PASS: "${input}" -> "${actual}"`);
    }
});

console.log(`\nResult: ${examples.length - failed} / ${examples.length} passed. Failed: ${failed}`);
