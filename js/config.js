/**
 * =============================================================================
 * PRANAV CRACKERS - BUSINESS CONFIGURATION & CONTACT SETTINGS
 * =============================================================================
 * 
 * HOW TO USE THIS FILE:
 * You can edit all business contact details, phone numbers, WhatsApp numbers,
 * email, physical address, and admin credentials directly in this file.
 * Any changes made here will automatically take effect across the entire website.
 * =============================================================================
 */

const APP_CONFIG = {
    // --- 1. BRAND & IDENTITY ---
    brandName: 'PRANAV CRACKERS',
    brandMessage: 'Celebrate • Enjoy • Shine',
    taglineEn: 'Celebrate Brighter with PRANAV CRACKERS',
    subtitleEn: 'Premium Fireworks • Sivakasi Wholesale',
    location: 'Sivakasi, Tamil Nadu, India',
    website: 'pranavcrackers.com',
    email: 'crackerspranav@gmail.com',

    // --- 2. PHONE NUMBERS ---
    // Display numbers (shown to users on the site):
    primaryPhone: '77085 32334',
    secondaryPhone: '97910 45933',
    // Raw numeric values for tel: links (country code + 10 digits):
    primaryPhoneRaw: '917708532334',
    secondaryPhoneRaw: '919791045933',

    // --- 3. WHATSAPP SIVAKASI ORDER DESK ---
    // Display WhatsApp number:
    whatsappPhone: '93857 87363',
    // Raw numeric WhatsApp number (with 91 country code, no symbols):
    whatsappPhoneRaw: '919385787363',

    // --- 4. CATALOGUE ASSETS & BROCHURE ---
    priceListPdfUrl: 'assets/pranav_crackers_price_list.pdf',

    // --- 5. ADMIN & PAYMENT DETAILS ---
    adminPin: 'pranav123',
    upiId: 'pranavcrackers@upi',
    bankDetails: 'Bank: SBI Sivakasi | A/C: 1234567890 | IFSC: SBIN0000123',

    // --- 6. LOCAL STORAGE SYSTEM KEYS (Do not modify unless resetting database) ---
    STORAGE_KEYS: {
        PRODUCTS: 'pranav_crackers_products_v11',
        GIFT_BOXES: 'pranav_crackers_giftboxes_v11',
        CATEGORIES: 'pranav_crackers_categories_v11',
        PRICE_LIST: 'pranav_crackers_pricelist_v11',
        SETTINGS: 'pranav_crackers_settings_v11',
        CART: 'pranav_crackers_cart_v11',
        ORDERS: 'pranav_crackers_orders_v11',
        DISCOUNTS: 'pranav_crackers_discounts_v11',
        LANGUAGE: 'pranav_crackers_language_v4'
    }
};

// Global backward-compatible aliases
const INITIAL_SETTINGS = APP_CONFIG;
const STORAGE_KEYS = APP_CONFIG.STORAGE_KEYS;

if (typeof window !== 'undefined') {
    window.APP_CONFIG = APP_CONFIG;
    window.INITIAL_SETTINGS = INITIAL_SETTINGS;
    window.STORAGE_KEYS = STORAGE_KEYS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG, INITIAL_SETTINGS, STORAGE_KEYS };
}
