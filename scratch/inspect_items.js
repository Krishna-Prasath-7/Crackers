const fs = require('fs');
const vm = require('vm');
const dataCode = fs.readFileSync('js/data.js', 'utf8');

const store = {};
global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; }
};
global.window = {};
global.document = {};

vm.runInThisContext(dataCode);

console.log('=== ALL 89 PRICE LIST ITEMS ===');
INITIAL_PRICE_LIST.forEach(item => {
    console.log(`#${item.sNo.toString().padStart(2, ' ')} | ${item.name.padEnd(38, ' ')} | ${item.company.padEnd(10, ' ')} | ${item.price.padEnd(7, ' ')} | ${item.category}`);
});

console.log('\n=== ALL PRODUCTS ===');
INITIAL_PRODUCTS.forEach(p => {
    console.log(`[${p.id}] ${p.nameEn.padEnd(35, ' ')} | ${p.company} | ${p.packSize || ''}`);
});

console.log('\n=== ALL GIFT BOXES CONTENTS ===');
INITIAL_GIFT_BOXES.forEach(gb => {
    console.log(`\nGift Box: ${gb.city} (${gb.itemCount}) - ₹${gb.price}`);
    (gb.contents || []).forEach(c => {
        console.log(`   - ${c.name} (${c.qty})`);
    });
});
