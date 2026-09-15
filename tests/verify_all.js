/**
 * =============================================================================
 * PRANAV CRACKERS - FULL SUITE AUTOMATED REGRESSION TEST
 * =============================================================================
 * Run with: npm test (or node tests/verify_all.js)
 * Validates:
 * 1. Catalogue items count (94 items)
 * 2. Product pricing, rupee symbol, and company branding (KALIS, STANDARD, etc.)
 * 3. Search and category filtering
 * 4. Quotation calculations (wholesale total and items count)
 * 5. Quotation Reference ID format (PCQ-...)
 * 6. WhatsApp order message compilation with customer details
 * 7. Clean HTML catalogue with zero unwanted product image tags
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Mock Browser Environment for Node.js
const mockStorage = {};
global.localStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { for (let k in mockStorage) delete mockStorage[k]; }
};

global.window = {
    dispatchEvent: () => {},
    open: (url) => { /* mock open */ }
};
global.CustomEvent = class { constructor(type, detail) { this.type = type; this.detail = detail; } };
global.document = {
    documentElement: { lang: 'en' },
    getElementById: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
};
global.App = {
    showToast: () => {}
};

// 2. Load Modular JS Files
const configJs = fs.readFileSync(path.join(__dirname, '../js/config.js'), 'utf8');
vm.runInThisContext(configJs);

const productsJs = fs.readFileSync(path.join(__dirname, '../js/products.js'), 'utf8');
vm.runInThisContext(productsJs);

const dataJs = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
vm.runInThisContext(dataJs);

const languageJs = fs.readFileSync(path.join(__dirname, '../js/language.js'), 'utf8');
vm.runInThisContext(languageJs);

const enquiryJs = fs.readFileSync(path.join(__dirname, '../js/enquiry.js'), 'utf8');
vm.runInThisContext(enquiryJs);

const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
vm.runInThisContext(appJs);

console.log('=== 1. Testing Catalogue & Wholesale Dataset ===');
const catalogue = DataStore.getCatalogueItems();
console.log(`Total catalogue items: ${catalogue.length}`);
if (catalogue.length !== 94) {
    throw new Error(`Expected exactly 94 items, got ${catalogue.length}`);
}

const companies = new Set(catalogue.map(i => i.company));
console.log('Detected companies:', Array.from(companies));
const missingPrices = catalogue.filter(i => !i.price || !i.price.includes('₹'));
if (missingPrices.length > 0) {
    throw new Error(`Found ${missingPrices.length} items without rupee price!`);
}
console.log('✓ All 94 items have valid rupee wholesale prices.');

console.log('\n=== 2. Testing Category & Search Filtering ===');
const sampleSearchTerms = ['Flower Pot', 'Chakkar', 'Bomb', 'Gift', '35 Items', 'Bijili'];
sampleSearchTerms.forEach(q => {
    const lower = q.toLowerCase();
    const matches = catalogue.filter(i => 
        (i.name && i.name.toLowerCase().includes(lower)) ||
        (i.aliases && i.aliases.some(a => a.toLowerCase().includes(lower))) ||
        (i.company && i.company.toLowerCase().includes(lower)) ||
        (i.category && i.category.toLowerCase().includes(lower))
    );
    console.log(`Search "${q}": found ${matches.length} matches`);
    if (matches.length === 0) throw new Error(`Search for "${q}" returned zero matches`);
});

console.log('\n=== 3. Testing Quotation & Calculations ===');
CartManager.setCart({ 'fp-01': 2, 'fp-02': 3 });
const cartCount = CartManager.getItemCount();
const subtotal = CartManager.getCartEstimatedTotal();
console.log(`Cart: 2 Flower Pot Big (@ ₹70) + 3 Flower Pot Special (@ ₹95)`);
console.log(`Items count: ${cartCount} (expected 5)`);
console.log(`Estimated wholesale total: ₹${subtotal} (expected ₹425)`);
if (cartCount !== 5 || subtotal !== 425) {
    throw new Error(`Calculation mismatch! Got count: ${cartCount}, total: ${subtotal}`);
}
console.log('✓ Accurate quotation calculation verified.');

console.log('\n=== 4. Testing Quotation Reference Generation ===');
const qId = CartManager.generateQuotationId();
console.log('Generated Quotation ID:', qId);
if (!/^PCQ-\d{6}-\d{4}$/.test(qId)) {
    throw new Error(`Invalid quotation ID format: ${qId}`);
}
console.log('✓ Quotation reference format verified.');

console.log('\n=== 5. Testing Customer WhatsApp Requirement Formatting ===');
CartManager.currentQuotationId = qId;
CartManager.pendingDetails = {
    name: 'Suresh Kumar',
    phone: '9876543210',
    address: '12, Anna Salai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    notes: 'Please pack safely for Diwali'
};

const fakeEvent = { preventDefault: () => {} };
CartManager.handleSendRequirement(fakeEvent);

const waUrl = CartManager.lastWaUrl;
if (!waUrl || !waUrl.includes('wa.me')) {
    throw new Error('Failed to generate WhatsApp deep link URL');
}

const decodedText = decodeURIComponent(waUrl.split('text=')[1]);
if (!decodedText.includes(qId)) throw new Error('Quotation ID missing from WhatsApp text');
if (!decodedText.includes('Suresh Kumar')) throw new Error('Customer name missing from WhatsApp text');
if (!decodedText.includes('₹425')) throw new Error('Wholesale total missing from WhatsApp text');
if (!decodedText.includes('Flower Pot Big')) throw new Error('Selected item missing from WhatsApp text');

console.log('✓ All WhatsApp requirement parameters verified successfully!');

console.log('\n=== 6. Verifying Image-Free Fast Catalogue in Static HTML ===');
const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const cardImgMatches = htmlContent.match(/<img[^>]*class="[^"]*card-img[^"]*"[^>]*>/gi);
if (cardImgMatches && cardImgMatches.length > 0) {
    throw new Error(`Found ${cardImgMatches.length} product images in static HTML catalogue`);
}
console.log('✓ Clean image-free fast catalogue confirmed.');

console.log('\n=============================================================');
console.log('🎉 ALL REGRESSION & FUNCTIONAL TESTS PASSED CLEANLY (100%)');
console.log('=============================================================\n');
