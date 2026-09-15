const fs = require('fs');
const vm = require('vm');

// Create a DOM mock environment
const store = {};
global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; }
};

const domElements = {};
function createMockElement(id, tag = 'div') {
    const el = {
        id,
        tagName: tag.toUpperCase(),
        innerHTML: '',
        value: '',
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false
        },
        querySelectorAll: () => [],
        style: {}
    };
    domElements[id] = el;
    return el;
}

global.document = {
    getElementById: (id) => domElements[id] || createMockElement(id),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => createMockElement('dyn_' + Math.random(), tag),
    addEventListener: () => {},
    body: createMockElement('body')
};

global.window = {
    addEventListener: () => {},
    dispatchEvent: () => {},
    localStorage: global.localStorage
};

// Evaluate scripts in order
vm.runInThisContext(fs.readFileSync('js/language.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/data.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/app.js', 'utf8'));

// Test Price List Render
console.log("=== SIMULATING APP.RENDERPRICELISTSECTION() ===");
App.renderPriceListSection();
const priceListHtml = domElements['price-list-container'].innerHTML;

// Check for any forbidden patterns in rendered HTML
const forbiddenPatterns = [
    /\bF\.P\b/i,
    /\bG\.C\b/i,
    /\b\d+\s*CM\s+ELE\b/i,
    /\b\d+\s*CM\s+COL\b/i,
    /\bSPL\b/,
    /\bDLX\b/,
    /\bGAINT\b/i,
    /\bRole\b/i,
    /\bPCS\b/
];

let issues = 0;
forbiddenPatterns.forEach(pattern => {
    if (pattern.test(priceListHtml)) {
        console.error(`Rendered HTML matched forbidden pattern: ${pattern}`);
        issues++;
    }
});

console.log(`Rendered HTML Forbidden Pattern Issues: ${issues}`);
console.log(`Rendered HTML Length: ${priceListHtml.length} characters`);

// Verify specific sample items in rendered HTML
const expectedStrings = [
    'Flower Pot Big',
    'Flower Pot Special',
    'Flower Pot Ashoka',
    'Flower Pot Giant',
    'Flower Pot Deluxe (5 Pcs)',
    'Flower Pot Super Deluxe (2 Pcs)',
    'Ground Chakkar Big (10 Pcs)',
    'Ground Chakkar Special',
    'Ground Chakkar Deluxe',
    'Spinner Special',
    'Spinner Deluxe',
    '10 CM Electric Sparkler',
    '10 CM Colour Sparkler',
    '10 CM Green Sparkler',
    '10 CM Red Sparkler',
    '15 CM Electric Sparkler',
    '15 CM Colour Sparkler',
    '30 CM Electric Sparkler',
    '50 CM Electric Sparkler',
    '3 Pcs Fancy',
    '6 Shot Multi Colour',
    '12 Shot Multi Colour',
    '15 Shot Multi Colour',
    '30 Shot Multi Colour',
    '60 Shot Multi Colour',
    '1K Roll (Full Count)',
    '2K Roll (Full Count)',
    '5K Roll (Full Count)',
    '10K Roll (Full Count)'
];

let missing = 0;
expectedStrings.forEach(s => {
    if (!priceListHtml.includes(s)) {
        console.error(`Missing expected standardized string in rendered HTML: "${s}"`);
        missing++;
    }
});

console.log(`Sample strings verified: ${expectedStrings.length - missing} / ${expectedStrings.length}`);

// Test search filter with aliases
console.log("\n=== TESTING SEARCH INTERACTIONS ===");
App.priceListSearchQuery = 'fp';
App.renderPriceListSection();
let searchHtml = domElements['price-list-container'].innerHTML;
const fpMatches = (searchHtml.match(/Flower Pot/g) || []).length;
console.log(`Searching "fp" rendered ${fpMatches} Flower Pot occurrences.`);

App.priceListSearchQuery = 'gc';
App.renderPriceListSection();
searchHtml = domElements['price-list-container'].innerHTML;
const gcMatches = (searchHtml.match(/Ground Chakkar/g) || []).length;
console.log(`Searching "gc" rendered ${gcMatches} Ground Chakkar occurrences.`);

App.priceListSearchQuery = '1k role';
App.renderPriceListSection();
searchHtml = domElements['price-list-container'].innerHTML;
const roleMatches = (searchHtml.match(/1K Roll/g) || []).length;
console.log(`Searching "1k role" rendered ${roleMatches} 1K Roll occurrences.`);

if (issues === 0 && missing === 0 && fpMatches > 0 && gcMatches > 0 && roleMatches > 0) {
    console.log("\n>>> ALL RENDERED HTML CHECKS AND SEARCH INTERACTION TESTS PASSED! <<<");
} else {
    process.exit(1);
}
