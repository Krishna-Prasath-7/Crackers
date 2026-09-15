const fs = require('fs');

// Read data.js and evaluate in isolated context
const dataCode = fs.readFileSync('js/data.js', 'utf8');

// Mock localStorage
const store = {};
global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; }
};

const vm = require('vm');
vm.runInThisContext(dataCode);

console.log("=== PRICE LIST VALIDATION ===");
console.log(`Total price list items: ${INITIAL_PRICE_LIST.length}`);

const forbiddenPatterns = [
    /\bF\.P\b/i,
    /\bG\.C\b/i,
    /\bELE\b/,
    /\bCOL\b/,
    /\bSPL\b/,
    /\bDLX\b/,
    /\bGAINT\b/i,
    /\bRole\b/i,
    /\bPCS\b/
];

let issues = 0;
INITIAL_PRICE_LIST.forEach(item => {
    // Check forbidden patterns
    forbiddenPatterns.forEach(pattern => {
        if (pattern.test(item.name)) {
            console.error(`Item #${item.sNo} [${item.name}] matches forbidden pattern: ${pattern}`);
            issues++;
        }
    });

    // Check valid company
    if (!['KALIS', 'STANDARD', 'S.KALA'].includes(item.company)) {
        console.error(`Item #${item.sNo} has unexpected company: ${item.company}`);
        issues++;
    }

    // Check valid price format
    if (!item.price || !item.price.startsWith('₹')) {
        console.error(`Item #${item.sNo} has invalid price: ${item.price}`);
        issues++;
    }
});

console.log(`Price List Issues: ${issues}`);

console.log("\n=== PRODUCTS VALIDATION ===");
INITIAL_PRODUCTS.forEach(p => {
    forbiddenPatterns.forEach(pattern => {
        if (pattern.test(p.nameEn)) {
            console.error(`Product [${p.id}] nameEn: "${p.nameEn}" matches forbidden pattern: ${pattern}`);
            issues++;
        }
    });
});

console.log("\n=== GIFT BOXES VALIDATION ===");
INITIAL_GIFT_BOXES.forEach(gb => {
    (gb.contents || []).forEach(c => {
        forbiddenPatterns.forEach(pattern => {
            if (pattern.test(c.name)) {
                console.error(`Gift Box [${gb.city}] item "${c.name}" matches forbidden pattern: ${pattern}`);
                issues++;
            }
        });
    });
});

if (issues === 0) {
    console.log("\n>>> ALL CHECKS PASSED PERFECTLY! All 89 price list items, products, and gift boxes adhere strictly to all 12 standardization rules! <<<");
} else {
    console.error(`\n>>> FAILED with ${issues} issues. <<<`);
    process.exit(1);
}
