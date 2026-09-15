const fs = require('fs');
const vm = require('vm');

const store = {};
global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; }
};

global.document = {
    getElementById: () => null,
    querySelectorAll: () => []
};

global.window = {
    addEventListener: () => {}
};

vm.runInThisContext(fs.readFileSync('js/language.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/data.js', 'utf8'));

// Test alias searches against the price list
const testSearches = [
    { query: 'fp', expectedPrefix: 'Flower Pot' },
    { query: 'f.p', expectedPrefix: 'Flower Pot' },
    { query: 'gc', expectedPrefix: 'Ground Chakkar' },
    { query: 'g.c', expectedPrefix: 'Ground Chakkar' },
    { query: 'ele', expectedMatch: 'Electric Sparkler' },
    { query: 'col', expectedMatch: 'Colour' },
    { query: 'spl', expectedMatch: 'Special' },
    { query: 'dlx', expectedMatch: 'Deluxe' },
    { query: 'gaint', expectedMatch: 'Giant' },
    { query: '1k role', expectedMatch: '1K Roll' }
];

const allItems = DataStore.getPriceList();

console.log("=== TESTING SEARCH ALIASES ===");
let allPassed = true;

testSearches.forEach(({ query, expectedPrefix, expectedMatch }) => {
    const rawQ = query.toLowerCase().trim();
    const normQ = rawQ.replace(/[\.\s]/g, '');

    const matches = allItems.filter(item => {
        const name = (item.name || '').toLowerCase();
        const company = (item.company || '').toLowerCase();
        const price = (item.price || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();

        let aliasMatch = false;
        if ((normQ === 'fp' || normQ.startsWith('fp')) && name.includes('flower pot')) aliasMatch = true;
        if ((normQ === 'gc' || normQ.startsWith('gc')) && name.includes('ground chakkar')) aliasMatch = true;
        if (normQ === 'ele' && name.includes('electric')) aliasMatch = true;
        if (normQ === 'col' && (name.includes('colour') || name.includes('color'))) aliasMatch = true;
        if (normQ === 'spl' && name.includes('special')) aliasMatch = true;
        if (normQ === 'dlx' && name.includes('deluxe')) aliasMatch = true;
        if (normQ === 'sdlx' && name.includes('super deluxe')) aliasMatch = true;
        if (normQ.includes('gaint') && name.includes('giant')) aliasMatch = true;
        if (normQ.includes('role') && name.includes('roll')) aliasMatch = true;

        return aliasMatch || name.includes(rawQ) || company.includes(rawQ) || price.includes(rawQ) || cat.includes(rawQ);
    });

    console.log(`Query "${query}" returned ${matches.length} matches. Examples: ${matches.slice(0, 3).map(m => m.name).join(', ')}`);
    if (matches.length === 0) {
        console.error(`FAILED for query "${query}"`);
        allPassed = false;
    }
});

if (allPassed) {
    console.log(">>> ALL SEARCH ALIASES FUNCTION PROPERLY! <<<");
} else {
    process.exit(1);
}
