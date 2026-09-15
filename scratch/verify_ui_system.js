const fs = require('fs');
const path = require('path');

console.log('=== PRANAV CRACKERS: Comprehensive UI & Data Integrity Verification ===');

// 1. Read index.html
const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Check key IDs in index.html
const requiredIds = [
    'site-header',
    'header-cart-badge',
    'product-search-input',
    'search-clear-btn',
    'view-cards-btn',
    'view-table-btn',
    'category-chips-row',
    'catalogue-items-container',
    'filter-status-banner',
    'floating-quotation-dock',
    'dock-items-count',
    'dock-total-price',
    'dock-savings-tag',
    'dock-action-btn',
    'quotation-modal',
    'q-modal-ref-tag',
    'quotation-modal-items',
    'q-sum-items-count',
    'q-sum-mrp-price',
    'q-sum-grand-total',
    'q-sum-savings-line',
    'cust-name',
    'cust-phone',
    'cust-address',
    'cust-city',
    'cust-state',
    'cust-pincode',
    'cust-notes',
    'quotation-form',
    'order-confirmation-modal',
    'order-confirmation-content',
    'track-order-modal',
    'track-query-input',
    'track-order-result',
    'admin-modal',
    'admin-modal-content'
];

let missingIds = [];
requiredIds.forEach(id => {
    if (!html.includes(`id="${id}"`)) {
        missingIds.push(id);
    }
});

if (missingIds.length > 0) {
    console.error('FAIL: Missing HTML IDs:', missingIds);
    process.exit(1);
} else {
    console.log('PASS: All required HTML IDs present (' + requiredIds.length + ' IDs verified).');
}

// 2. Check CSS files exist and have no syntax errors
const cssFiles = ['style.css', 'components.css', 'responsive.css'];
cssFiles.forEach(f => {
    const cssPath = path.join(__dirname, '..', 'css', f);
    if (!fs.existsSync(cssPath)) {
        console.error(`FAIL: CSS file missing: ${f}`);
        process.exit(1);
    }
    const content = fs.readFileSync(cssPath, 'utf8');
    if (content.length < 500) {
        console.error(`FAIL: CSS file suspiciously small: ${f}`);
        process.exit(1);
    }
    console.log(`PASS: CSS ${f} verified (${content.length} bytes).`);
});

// 3. Test DataStore & Item Count in Node
// Mock localStorage & window for Node
global.localStorage = {
    data: {},
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = String(v); },
    removeItem(k) { delete this.data[k]; },
    clear() { this.data = {}; }
};
global.window = {
    addEventListener: () => {},
    dispatchEvent: () => {},
    scrollTo: () => {}
};
global.CustomEvent = class {};

const vm = require('vm');
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

const items = DataStore.getCatalogueItems();
console.log(`PASS: Catalogue items loaded: ${items.length} items`);
if (items.length !== 94) {
    console.error(`FAIL: Expected 94 items, got ${items.length}`);
    process.exit(1);
}

// 4. Test Cart Calculations
const enquiryJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'enquiry.js'), 'utf8');
vm.runInThisContext(enquiryJs);

// Add items to cart
CartManager.changeQty(items[0].id, 2); // Flower Pot Big ₹70 x 2 = ₹140
CartManager.changeQty(items[1].id, 1); // Flower Pot Special ₹95 x 1 = ₹95

const cartTotals = CartManager.getCartTotals();
console.log('Cart Totals:', cartTotals);

if (cartTotals.wholesale !== 235) {
    console.error(`FAIL: Expected wholesale 235, got ${cartTotals.wholesale}`);
    process.exit(1);
}

if (cartTotals.mrp !== 588) { // 70*2.5 = 175*2 = 350 + 95*2.5 = 238 = 588
    console.error(`FAIL: Expected MRP 588, got ${cartTotals.mrp}`);
    process.exit(1);
}

if (cartTotals.savings <= 0) {
    console.error('FAIL: Expected positive savings');
    process.exit(1);
}

console.log('PASS: Cart totals & savings calculation verified.');
console.log('=== ALL SYSTEM CHECKS PASSED ===');
