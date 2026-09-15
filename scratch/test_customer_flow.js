// Test customer flow for PRANAV CRACKERS Digital Price List
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mock browser environment
const storage = {};
global.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear: () => { for (let k in storage) delete storage[k]; }
};

global.window = {
    dispatchEvent: () => {},
    open: (url) => { global.lastOpenedUrl = url; },
    location: { hash: '' }
};
global.CustomEvent = class { constructor(type, detail) { this.type = type; this.detail = detail; } };
global.document = {
    getElementById: (id) => ({
        value: '',
        textContent: '',
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        style: {},
        addEventListener: () => {}
    }),
    querySelectorAll: () => [],
    addEventListener: () => {}
};

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
vm.runInThisContext(dataJs);

console.log('=== 1. Checking Catalogue Items ===');
const items = DataStore.getCatalogueItems();
console.log(`Total catalogue items: ${items.length}`);
if (items.length !== 94) {
    throw new Error(`Expected exactly 94 items, found ${items.length}`);
}

// Locate the specific products requested:
// 2 Flower Pot Big, 3 Ground Chakkar Special, 1 Gift Box
const fpBig = items.find(i => i.name.toLowerCase().includes('flower pot big'));
const gcSpecial = items.find(i => i.name.toLowerCase().includes('ground chakkar special'));
const giftBox = items.find(i => i.category === 'gift_boxes');

if (!fpBig) throw new Error('Flower Pot Big not found in catalogue');
if (!gcSpecial) throw new Error('Ground Chakkar Special not found in catalogue');
if (!giftBox) throw new Error('Gift Box not found in catalogue');

console.log(`Found: [${fpBig.company}] ${fpBig.name} @ ${fpBig.price}`);
console.log(`Found: [${gcSpecial.company}] ${gcSpecial.name} @ ${gcSpecial.price}`);
console.log(`Found: [${giftBox.company}] ${giftBox.name} @ ${giftBox.price}`);

// 2. Load enquiry.js & app.js
const enquiryJs = fs.readFileSync(path.join(__dirname, '../js/enquiry.js'), 'utf8');
vm.runInThisContext(enquiryJs);

const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
vm.runInThisContext(appJs);

console.log('\n=== 2. Testing Customer Flow: Adding with + and − ===');
// Start with 0
let cart = CartManager.getCart();
console.log('Initial cart:', cart);
if (CartManager.getItemCount() !== 0) throw new Error('Initial cart not empty');

// Customer taps + twice for Flower Pot Big
CartManager.changeQty(fpBig.id, 1);
CartManager.changeQty(fpBig.id, 1);

// Customer taps + four times for Ground Chakkar Special, then taps - once (ends at 3)
CartManager.changeQty(gcSpecial.id, 1);
CartManager.changeQty(gcSpecial.id, 1);
CartManager.changeQty(gcSpecial.id, 1);
CartManager.changeQty(gcSpecial.id, 1);
CartManager.changeQty(gcSpecial.id, -1); // decreased to 3

// Customer taps + once for Gift Box
CartManager.changeQty(giftBox.id, 1);

cart = CartManager.getCart();
console.log('Cart after customer selections:', cart);
if (cart[fpBig.id] !== 2) throw new Error(`Expected 2 Flower Pot Big, got ${cart[fpBig.id]}`);
if (cart[gcSpecial.id] !== 3) throw new Error(`Expected 3 Ground Chakkar Special, got ${cart[gcSpecial.id]}`);
if (cart[giftBox.id] !== 1) throw new Error(`Expected 1 Gift Box, got ${cart[giftBox.id]}`);

const totalItems = CartManager.getItemCount();
const estimatedTotal = CartManager.getCartEstimatedTotal();

const pFp = parseFloat(fpBig.price.replace(/[^0-9.]/g, ''));
const pGc = parseFloat(gcSpecial.price.replace(/[^0-9.]/g, ''));
const pGb = parseFloat(giftBox.price.replace(/[^0-9.]/g, ''));

const expectedEst = (pFp * 2) + (pGc * 3) + (pGb * 1);

console.log(`Total Items: ${totalItems} (Expected 6)`);
console.log(`Estimated Total: ₹${estimatedTotal} (Expected ₹${expectedEst})`);

if (totalItems !== 6) throw new Error(`Expected 6 items, got ${totalItems}`);
if (estimatedTotal !== expectedEst) throw new Error(`Expected ₹${expectedEst}, got ₹${estimatedTotal}`);

console.log('\n=== 3. Testing Quotation Reference Generation ===');
const qId = CartManager.generateQuotationId();
console.log('Quotation Reference ID:', qId);
if (!/^PCQ-\d{6}-\d{4}$/.test(qId)) {
    throw new Error(`Quotation ID "${qId}" does not match required format PCQ-YYMMDD-XXXX`);
}

console.log('\n=== 4. Testing Customer Form & WhatsApp Message Compilation ===');
// Mock the form values
const mockForm = {
    'cust-name': 'Muthu Krishnan',
    'cust-phone': '9876543210',
    'cust-address': '14, Gandhi Road, Anna Nagar',
    'cust-city': 'Madurai',
    'cust-state': 'Tamil Nadu',
    'cust-pincode': '625020',
    'cust-notes': 'Please deliver before Deepavali eve'
};

global.document.getElementById = (id) => {
    return {
        value: mockForm[id] || '',
        textContent: '',
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        style: {}
    };
};

CartManager.handleSendRequirement({ preventDefault: () => {} });

if (!global.lastOpenedUrl) {
    throw new Error('WhatsApp URL was not generated!');
}

console.log('Generated WhatsApp URL (truncated):', global.lastOpenedUrl.slice(0, 100) + '...');
const fullWaMessage = decodeURIComponent(global.lastOpenedUrl.split('text=')[1]);
console.log('\n--- Decoded WhatsApp Message ---');
console.log(fullWaMessage);
console.log('--------------------------------\n');

// Verify all required elements are present in the WhatsApp text
const requiredSnippets = [
    'NEW PRANAV CRACKERS REQUIREMENT',
    'CUSTOMER DETAILS',
    'Name: Muthu Krishnan',
    'Mobile: 9876543210',
    'Address: 14, Gandhi Road, Anna Nagar',
    'City: Madurai',
    'State: Tamil Nadu',
    'PIN Code: 625020',
    'SELECTED CRACKERS',
    fpBig.name,
    gcSpecial.name,
    giftBox.name,
    `TOTAL ITEMS: 6`,
    `ESTIMATED TOTAL: ₹${expectedEst.toLocaleString('en-IN')}`,
    'NOTES:\nPlease deliver before Deepavali eve',
    'Please confirm product availability and final amount.'
];

for (const snip of requiredSnippets) {
    if (!fullWaMessage.includes(snip)) {
        throw new Error(`Missing expected snippet in WhatsApp message: "${snip}"`);
    }
}
console.log('✓ All WhatsApp quotation content verified successfully!');

console.log('\n=== 5. Verifying Zero Images in HTML Catalogue ===');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
if (indexHtml.includes('<img') && !indexHtml.includes('brand-logo-img')) {
    // Only brand logo if any, no product images
    throw new Error('Unexpected img tags in index.html');
}
console.log('✓ No product or category images found in HTML.');

console.log('\nALL CUSTOMER JOURNEY TESTS PASSED CLEANLY!');
