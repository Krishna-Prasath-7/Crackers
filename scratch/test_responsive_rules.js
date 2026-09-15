// Responsive layout audit script
const fs = require('fs');
const path = require('path');

const responsiveCss = fs.readFileSync(path.join(__dirname, '../css/responsive.css'), 'utf8');
const componentsCss = fs.readFileSync(path.join(__dirname, '../css/components.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

console.log('=== Responsive Layout Audit ===');

// Check overflow-x
if (!responsiveCss.includes('overflow-x: hidden') && !styleCss.includes('overflow-x: hidden')) {
    throw new Error('Missing overflow-x: hidden');
}
console.log('✓ Global anti-overflow rules present in CSS');

// Check mobile product row rules
if (!responsiveCss.includes('.product-row') || !responsiveCss.includes('flex-direction: column')) {
    throw new Error('Missing mobile product row stacked rules');
}
console.log('✓ Mobile stacked product row rules present');

// Check 320px ultra-compact rules
if (!responsiveCss.includes('max-width: 350px')) {
    throw new Error('Missing ultra-compact breakpoint <= 350px');
}
console.log('✓ Ultra-compact phone breakpoint (<= 350px / 320px) present');

// Check bottom bar rules
if (!componentsCss.includes('.bottom-quotation-bar') || !responsiveCss.includes('.bottom-quotation-bar')) {
    throw new Error('Missing bottom quotation bar styles');
}
console.log('✓ Bottom quotation bar desktop & mobile styles verified');

// Check modal rules
if (!componentsCss.includes('.modal-window') || !responsiveCss.includes('.modal-window')) {
    throw new Error('Missing modal responsive styles');
}
console.log('✓ Quotation modal responsive styles verified');

console.log('\nALL RESPONSIVE AUDIT CHECKS PASSED!');
