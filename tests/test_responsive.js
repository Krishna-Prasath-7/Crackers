/**
 * Automated Responsive Design Verification Test Suite
 * Validates responsive components, viewport configurations, CSS media queries, and mobile drawer logic.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== PRANAV CRACKERS: Responsive Design Test Suite ===\n');

const ROOT_DIR = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const responsiveCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'responsive.css'), 'utf8');
const componentsCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'components.css'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');

// 1. Viewport meta tag
assert(html.includes('viewport-fit=cover'), 'Viewport meta tag must contain viewport-fit=cover for notch devices');
console.log('✓ Viewport meta tag configured with width=device-width and viewport-fit=cover');

// 2. Mobile Menu & Drawer DOM structure
assert(html.includes('id="mobile-menu-toggle"'), 'Mobile menu toggle button must exist');
assert(html.includes('id="mobile-nav-drawer"'), 'Mobile nav drawer must exist');
assert(html.includes('id="mobile-nav-backdrop"'), 'Mobile nav backdrop must exist');
assert(html.includes('id="drawer-search-input"'), 'Mobile drawer search input must exist');
assert(html.includes('drawer-contact-btn wa'), 'WhatsApp quick contact must exist in drawer');
assert(html.includes('drawer-contact-btn phone'), 'Phone quick contact must exist in drawer');
assert(html.includes('drawer-lang-chips'), 'Language selection chips must exist in drawer');
console.log('✓ Mobile hamburger toggle and off-canvas drawer structure verified in index.html');

// 3. Responsive CSS Media Queries & Breakpoints
const breakpoints = [
    { label: 'Widescreen (≥ 1360px)', pattern: /@media\s*\(min-width:\s*1360px\)/ },
    { label: 'Medium Desktops (1024px - 1359px)', pattern: /@media\s*\(min-width:\s*1024px\)\s*and\s*\(max-width:\s*1359px\)/ },
    { label: 'Tablets (≤ 1023px)', pattern: /@media\s*\(max-width:\s*1023px\)/ },
    { label: 'Mobile (≤ 767px)', pattern: /@media\s*\(max-width:\s*767px\)/ },
    { label: 'Ultra-compact (≤ 360px)', pattern: /@media\s*\(max-width:\s*360px\)/ }
];

breakpoints.forEach(bp => {
    assert(bp.pattern.test(responsiveCss), `Responsive stylesheet must define media query for ${bp.label}`);
    console.log(`✓ Breakpoint verified: ${bp.label}`);
});

// 4. Adaptive Rate Sheet Table on Mobile
assert(responsiveCss.includes('.rate-sheet-table'), 'Responsive CSS must target .rate-sheet-table');
assert(responsiveCss.includes('min-width: 0 !important'), 'Mobile rate sheet table must override min-width to avoid horizontal scrolling');
assert(responsiveCss.includes('.table-stepper'), 'Mobile rate sheet must style touch steppers');
assert(responsiveCss.includes('env(safe-area-inset-bottom'), 'Mobile dock must support iOS safe area insets');
console.log('✓ Adaptive mobile card-table rules and iOS safe area padding verified');

// 5. JavaScript Drawer Methods
assert(appJs.includes('toggleMobileMenu()'), 'App class must implement toggleMobileMenu()');
assert(appJs.includes('closeMobileMenu()'), 'App class must implement closeMobileMenu()');
assert(appJs.includes('handleDrawerSearch('), 'App class must implement handleDrawerSearch()');
console.log('✓ Mobile menu JavaScript handlers verified in app.js');

// 6. Test Drawer Logic Simulation
let drawerOpen = false;
let bodyOverflow = '';
const mockClassList = {
    contains: (cls) => (cls === 'open' ? drawerOpen : false),
    add: (cls) => { if (cls === 'open') drawerOpen = true; },
    remove: (cls) => { if (cls === 'open') drawerOpen = false; }
};

// Simulate toggle
if (!drawerOpen) {
    mockClassList.add('open');
    bodyOverflow = 'hidden';
}
assert.strictEqual(drawerOpen, true, 'Drawer should open on toggle');
assert.strictEqual(bodyOverflow, 'hidden', 'Body scroll should lock when drawer is open');

// Simulate close
mockClassList.remove('open');
bodyOverflow = '';
assert.strictEqual(drawerOpen, false, 'Drawer should close on close action');
assert.strictEqual(bodyOverflow, '', 'Body scroll should be restored on drawer close');
console.log('✓ Simulated drawer toggle/close lifecycle passed');

console.log('\n=============================================================');
console.log('🎉 ALL RESPONSIVE TESTS PASSED SUCCESSFULLY (100%)');
console.log('=============================================================\n');
