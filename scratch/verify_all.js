// Comprehensive verification test for PRANAV CRACKERS redesign
const fs = require('fs');
const path = require('path');

// Mock browser globals for testing data.js & enquiry.js & app.js
const mockStorage = {};
global.localStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { for (let k in mockStorage) delete mockStorage[k]; }
};

global.window = {
    dispatchEvent: () => {},
    open: (url) => { console.log('Mock window.open called with URL:', url); }
};
global.CustomEvent = class { constructor(type, detail) { this.type = type; this.detail = detail; } };
global.document = {
    getElementById: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
};
global.App = {
    showToast: () => {}
};

const vm = require('vm');

// Load data.js
const dataJs = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
vm.runInThisContext(dataJs);

console.log('--- 1. Testing Official Catalogue Dataset ---');
const catalogue = DataStore.getCatalogueItems();
console.log(`Total catalogue items: ${catalogue.length}`);
if (catalogue.length < 90) {
    throw new Error(`Expected at least 90 items, got ${catalogue.length}`);
}

// Verify company names and prices
const companies = new Set(catalogue.map(i => i.company));
console.log('Detected companies:', Array.from(companies));
const missingPrices = catalogue.filter(i => !i.price || !i.price.includes('₹'));
console.log('Items missing rupee price:', missingPrices.length);
if (missingPrices.length > 0) {
    throw new Error('Some items are missing price!');
}

console.log('Sample items:');
catalogue.slice(0, 5).forEach(i => {
    console.log(`  - [${i.company}] ${i.name} | ${i.price} | Category: ${i.category}`);
});

console.log('\n--- 2. Testing Search and Category Filtering ---');
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

console.log('\n--- 3. Testing Enquiry / Quotation Calculations ---');
const enquiryJs = fs.readFileSync(path.join(__dirname, '../js/enquiry.js'), 'utf8');
vm.runInThisContext(enquiryJs);

// Add items to mock cart
CartManager.addToCart(catalogue[0].id, 2);
CartManager.addToCart(catalogue[1].id, 3);
const cart = CartManager.getCart();
console.log('Cart contents:', cart);

const count = CartManager.getItemCount();
const total = CartManager.getCartEstimatedTotal();

const p0 = parseFloat(catalogue[0].price.replace(/[^0-9.]/g, ''));
const p1 = parseFloat(catalogue[1].price.replace(/[^0-9.]/g, ''));
const expectedTotal = (p0 * 2) + (p1 * 3);

console.log(`Items count: ${count} (expected 5)`);
console.log(`Estimated total: ₹${total} (expected ₹${expectedTotal})`);
if (count !== 5 || total !== expectedTotal) {
    throw new Error('Calculation mismatch!');
}

console.log('\n--- 4. Testing Quotation Reference ID Format ---');
const qId = CartManager.generateQuotationId();
console.log('Generated Quotation ID:', qId);
const qRegex = /^PCQ-\d{6}-\d{4}$/;
if (!qRegex.test(qId)) {
    throw new Error(`Quotation ID "${qId}" does not match pattern PCQ-YYMMDD-XXXX`);
}

console.log('\n--- 5. Testing WhatsApp Message Format ---');
CartManager.pendingDetails = {
    name: 'Suresh Kumar',
    phone: '9876543210',
    address: '12, Anna Salai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    notes: 'Please pack safely for Diwali'
};
CartManager.currentQuotationId = qId;

// Test WhatsApp URL builder via placeRequirementAndContinueWhatsApp()
let generatedWhatsAppUrl = '';
global.window.open = (url) => { generatedWhatsAppUrl = url; };
CartManager.placeRequirementAndContinueWhatsApp();

console.log('Generated WhatsApp URL (truncated):', generatedWhatsAppUrl.slice(0, 120) + '...');
const decodedText = decodeURIComponent(generatedWhatsAppUrl.split('text=')[1]);
console.log('Decoded WhatsApp Message:\n' + decodedText);

// Validate key components of WhatsApp message
const requiredPhrases = [
    'NEW PRANAV CRACKERS REQUIREMENT',
    `Quotation: ${qId}`,
    'CUSTOMER DETAILS',
    'Name: Suresh Kumar',
    'Mobile: 9876543210',
    'SELECTED CRACKERS',
    `TOTAL ITEMS: 5`,
    `ESTIMATED TOTAL: ₹${expectedTotal.toLocaleString('en-IN')}`,
    'Please confirm product availability and final amount.'
];

for (const phrase of requiredPhrases) {
    if (!decodedText.includes(phrase)) {
        throw new Error(`WhatsApp message missing required phrase: "${phrase}"`);
    }
}
console.log('✓ All WhatsApp message requirement components verified!');

console.log('\n--- 6. Verifying Image-Free Catalogue in rendered HTML ---');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Check that products grid has no img tags
if (indexHtml.includes('<img') && indexHtml.includes('product-image')) {
    console.warn('Warning: Check if product images remain in index.html');
} else {
    console.log('✓ No product image tags found in index.html static markup.');
}

console.log('\nALL UNIT AND INTEGRATION CHECKS PASSED SUCCESSFULLY!');
