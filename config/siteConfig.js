/**
 * =============================================================================
 * PRANAV CRACKERS - BUSINESS CONFIGURATION & CONTACT SETTINGS
 * File: config/siteConfig.js
 * =============================================================================
 * 
 * HOW TO USE THIS FILE:
 * You can edit all business contact details, phone numbers, WhatsApp numbers,
 * email, physical address, and payment information directly in this file.
 * Any changes made here automatically take effect across the entire website.
 * =============================================================================
 */

const SITE_CONFIG = {
    // --- 1. BRAND & IDENTITY ---
    brandName: 'PRANAV CRACKERS',
    brandTagline: 'SPARKING HAPPINESS',
    brandMessage: 'Celebrate • Enjoy • Shine',
    location: 'Sivakasi, Tamil Nadu, India',
    website: 'pranavcrackers.com',
    email: 'crackerspranav@gmail.com',

    // --- 2. PHONE NUMBERS ---
    primaryPhone: '77085 32334',              // Display format
    secondaryPhone: '97910 45933',            // Display format
    primaryPhoneRaw: '917708532334',          // Numeric with country code for tel: links
    secondaryPhoneRaw: '919791045933',        // Numeric with country code for tel: links

    // --- 3. WHATSAPP SIVAKASI ORDER DESK ---
    whatsappPhone: '77085 32334',             // Display format
    whatsappPhoneRaw: '917708532334',         // Numeric with 91 country code (no + or spaces)

    // --- 4. CATALOGUE ASSETS ---
    priceListPdfUrl: 'assets/pranav_crackers_price_list.pdf',

    // --- 5. PAYMENT & ADMIN DETAILS ---
    adminPin: 'pranav123',
    upiId: 'pranavcrackers@upi',
    bankDetails: 'Bank: SBI Sivakasi | A/C: 1234567890 | IFSC: SBIN0000123',

    // --- 6. ORDER & DELIVERY SETTINGS ---
    minimumOrderAmount: 2000,                 // Minimum order in Rupees (0 for no limit)
    estimatedDispatchHours: 48,               // Sivakasi dispatch timeline in hours
    wholesaleDiscountText: 'Up to 80% Off Retail MRP',

    // --- 7. GOOGLE SHEET DATABASE SETTINGS ---
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1hsoJ_KDWGojkIMUJP0Rl5SfzAsYPjFHMC5J3POBV1XE/edit?usp=sharing',
    googleSheetId: '1hsoJ_KDWGojkIMUJP0Rl5SfzAsYPjFHMC5J3POBV1XE',
    googleAppsScriptUrl: '', // Deployed Web App URL (from google_apps_script.js)

    // --- 8. LOCAL STORAGE SYSTEM KEYS (Do not modify unless resetting database) ---
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

// Backward-compatibility aliases for existing modules
const APP_CONFIG = SITE_CONFIG;
const INITIAL_SETTINGS = SITE_CONFIG;
const STORAGE_KEYS = SITE_CONFIG.STORAGE_KEYS;

if (typeof window !== 'undefined') {
    window.SITE_CONFIG = SITE_CONFIG;
    window.APP_CONFIG = APP_CONFIG;
    window.INITIAL_SETTINGS = INITIAL_SETTINGS;
    window.STORAGE_KEYS = STORAGE_KEYS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, APP_CONFIG, INITIAL_SETTINGS, STORAGE_KEYS };
}
