const fs = require('fs');
const path = require('path');

// Run scratch/update_data.js first if needed or restore from update_data.js
// Let's check update_data.js
const updateScript = fs.readFileSync(path.join(__dirname, 'update_data.js'), 'utf8');

// Let's modify update_data.js logic or create a clean builder for data.js
const dataPath = path.join(__dirname, '../js/data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Let's run update_data.js to get a known clean state
require('./update_data.js');

// Now re-read data.js
dataContent = fs.readFileSync(dataPath, 'utf8');

// 1. Update STORAGE_KEYS to v11
dataContent = dataContent.replace(/_v10/g, '_v11');

// 2. Ensure each product in INITIAL_PRODUCTS has company set to 'KALIS' if missing
// Products needing company: 'KALIS':
// gc-02, gc-03, rkt-01, rkt-02, snd-01, snd-02, snd-03, sky-01, sky-02, sky-03
const idsToFix = ['gc-02', 'gc-03', 'rkt-01', 'rkt-02', 'snd-01', 'snd-02', 'snd-03', 'sky-01', 'sky-02', 'sky-03'];

idsToFix.forEach(id => {
    // find { id: '...', and before category: add company: 'KALIS',
    const regex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?)(category:\\s*)`, 'm');
    dataContent = dataContent.replace(regex, (match, p1, p2) => {
        if (p1.includes('company:')) return match;
        return `${p1}company: 'KALIS',\n        ${p2}`;
    });
});

// 3. Add standardizeProductName to DataStore class
const standardizeMethod = `
    static standardizeProductName(name) {
        if (!name || typeof name !== 'string') return '';
        let s = name.trim();

        // 1. Expand F.P / FP abbreviations
        s = s.replace(/\\bF\\.P\\.?\\b/gi, 'Flower Pot');
        s = s.replace(/\\bFP\\b/g, 'Flower Pot');

        // 2. Expand G.C / GC abbreviations
        s = s.replace(/\\bG\\.C\\.?\\b/gi, 'Ground Chakkar');
        s = s.replace(/\\bGC\\b/g, 'Ground Chakkar');

        // 3. Sparklers abbreviations (e.g. 10 CM ELE, 15 CM COL, 10 CM GREEN, 10 CM RED)
        s = s.replace(/\\b(\\d+\\s*CM)\\s+ELE(?!\\s*Sparkler)\\b/gi, '$1 Electric Sparkler');
        s = s.replace(/\\b(\\d+\\s*CM)\\s+COL(?!\\s*Sparkler)\\b/gi, '$1 Colour Sparkler');
        s = s.replace(/\\b(\\d+\\s*CM)\\s+GREEN(?!\\s*Sparkler)\\b/gi, '$1 Green Sparkler');
        s = s.replace(/\\b(\\d+\\s*CM)\\s+RED(?!\\s*Sparkler)\\b/gi, '$1 Red Sparkler');
        s = s.replace(/\\bELE(?!\\s*Sparkler)\\b/gi, 'Electric Sparkler');
        s = s.replace(/\\bCOL(?!\\s*Sparkler)\\b/gi, 'Colour Sparkler');

        // 4. SDLX -> Super Deluxe, DLX -> Deluxe, SPL -> Special
        s = s.replace(/\\bSDLX\\b/gi, 'Super Deluxe');
        s = s.replace(/\\bDLX\\b/gi, 'Deluxe');
        s = s.replace(/\\bSPL\\b/gi, 'Special');

        // 5. Fix common typos
        s = s.replace(/\\bGAINT\\b/gi, 'Giant');
        s = s.replace(/\\b(\\d+K)\\s+Role\\b/gi, '$1 Roll');
        s = s.replace(/\\bRole\\s*\\((Full Count)\\)/gi, 'Roll ($1)');

        // 6. Units and consistency
        s = s.replace(/\\b(\\d+)\\s*PCS\\b/gi, '$1 Pcs');
        s = s.replace(/\\b(\\d+)\\s*pcs\\b/g, '$1 Pcs');
        s = s.replace(/\\bMulti\\s+Color\\b/gi, 'Multi Colour');
        s = s.replace(/\\(Multi Color\\)/gi, 'Multi Colour');
        s = s.replace(/\\(Multi Colour\\)/gi, 'Multi Colour');

        // Clean up repeated spaces
        s = s.replace(/\\s{2,}/g, ' ').trim();

        return s;
    }
`;

// Insert standardizeMethod into DataStore class right after `class DataStore {`
dataContent = dataContent.replace('class DataStore {', `class DataStore {${standardizeMethod}`);

// 4. Update getPriceList and getProducts in DataStore to apply standardizeProductName
dataContent = dataContent.replace(
    `    static getPriceList() {
        const data = localStorage.getItem(STORAGE_KEYS.PRICE_LIST);
        if (!data) {
            this.setPriceList(INITIAL_PRICE_LIST);
            return INITIAL_PRICE_LIST;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return INITIAL_PRICE_LIST;
        }
    }`,
    `    static getPriceList() {
        const data = localStorage.getItem(STORAGE_KEYS.PRICE_LIST);
        if (!data) {
            this.setPriceList(INITIAL_PRICE_LIST);
            return INITIAL_PRICE_LIST;
        }
        try {
            const list = JSON.parse(data);
            return list.map(item => ({
                ...item,
                name: this.standardizeProductName(item.name)
            }));
        } catch (e) {
            return INITIAL_PRICE_LIST;
        }
    }`
);

dataContent = dataContent.replace(
    `    static getProducts() {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (!data) {
            this.setProducts(INITIAL_PRODUCTS);
            return INITIAL_PRODUCTS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return INITIAL_PRODUCTS;
        }
    }`,
    `    static getProducts() {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (!data) {
            this.setProducts(INITIAL_PRODUCTS);
            return INITIAL_PRODUCTS;
        }
        try {
            const prods = JSON.parse(data);
            return prods.map(p => ({
                ...p,
                nameEn: this.standardizeProductName(p.nameEn),
                company: p.company || 'KALIS'
            }));
        } catch (e) {
            return INITIAL_PRODUCTS;
        }
    }`
);

fs.writeFileSync(dataPath, dataContent, 'utf8');
console.log("Successfully updated js/data.js with standardizer, company fields, and v11 storage keys!");
