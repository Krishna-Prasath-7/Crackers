/**
 * =============================================================================
 * PRANAV CRACKERS - DATA STORE & STORAGE ENGINE
 * =============================================================================
 * 
 * ROLE OF THIS FILE:
 * This file contains the DataStore engine responsible for:
 * - Loading and persisting catalogue data in browser localStorage
 * - Looking up products, prices, and gift boxes
 * - Order submission, tracking, and management
 * - Product name normalization (e.g., expanding abbreviations like F.P -> Flower Pot)
 * 
 * NOTE FOR MAINTENANCE:
 * - To change Phone Numbers or WhatsApp numbers: Edit 'js/config.js'
 * - To change Cracker Prices or add new items: Edit 'js/products.js'
 * - To change Translations or Website copy: Edit 'js/language.js'
 * =============================================================================
 */

// Node.js test environment support (auto-loads dependencies if running in node)
if (typeof require === 'function') {
    if (typeof APP_CONFIG === 'undefined') {
        try { Object.assign(global, require('./config.js')); } catch (e) {}
    }
    if (typeof INITIAL_PRICE_LIST === 'undefined') {
        try { Object.assign(global, require('./products.js')); } catch (e) {}
    }
}

// Ensure global references are safely available
const _STORAGE_KEYS = (typeof STORAGE_KEYS !== 'undefined')
    ? STORAGE_KEYS
    : ((typeof APP_CONFIG !== 'undefined' && APP_CONFIG.STORAGE_KEYS)
        ? APP_CONFIG.STORAGE_KEYS
        : {
            PRODUCTS: 'pranav_crackers_products_v11',
            GIFT_BOXES: 'pranav_crackers_giftboxes_v11',
            CATEGORIES: 'pranav_crackers_categories_v11',
            PRICE_LIST: 'pranav_crackers_pricelist_v11',
            SETTINGS: 'pranav_crackers_settings_v11',
            CART: 'pranav_crackers_cart_v11',
            ORDERS: 'pranav_crackers_orders_v11',
            DISCOUNTS: 'pranav_crackers_discounts_v11',
            LANGUAGE: 'pranav_crackers_language_v4'
        });

const _INITIAL_SETTINGS = (typeof INITIAL_SETTINGS !== 'undefined')
    ? INITIAL_SETTINGS
    : ((typeof APP_CONFIG !== 'undefined') ? APP_CONFIG : {});

// Central DataStore Class
class DataStore {
    /**
     * Standardizes product names by expanding shorthand abbreviations,
     * correcting formatting, and ensuring clean display.
     */
    static standardizeProductName(name) {
        if (!name || typeof name !== 'string') return '';
        let s = name.trim();

        // 1. Expand F.P / FP abbreviations
        s = s.replace(/\bF\.P\.?\b/gi, 'Flower Pot');
        s = s.replace(/\bFP\b/g, 'Flower Pot');

        // 2. Expand G.C / GC abbreviations
        s = s.replace(/\bG\.C\.?\b/gi, 'Ground Chakkar');
        s = s.replace(/\bGC\b/g, 'Ground Chakkar');

        // 3. Sparklers abbreviations
        s = s.replace(/\b(\d+\s*CM)\s+ELE(?!\s*Sparkler)\b/gi, '$1 Electric Sparkler');
        s = s.replace(/\b(\d+\s*CM)\s+COL(?!\s*Sparkler)\b/gi, '$1 Colour Sparkler');
        s = s.replace(/\b(\d+\s*CM)\s+GREEN(?!\s*Sparkler)\b/gi, '$1 Green Sparkler');
        s = s.replace(/\b(\d+\s*CM)\s+RED(?!\s*Sparkler)\b/gi, '$1 Red Sparkler');
        s = s.replace(/\bELE(?!\s*Sparkler)\b/gi, 'Electric Sparkler');
        s = s.replace(/\bCOL(?!\s*Sparkler)\b/gi, 'Colour Sparkler');

        // 4. SDLX -> Super Deluxe, DLX -> Deluxe, SPL -> Special
        s = s.replace(/\bSDLX\b/gi, 'Super Deluxe');
        s = s.replace(/\bDLX\b/gi, 'Deluxe');
        s = s.replace(/\bSPL\b/gi, 'Special');

        // 5. Fix common typos
        s = s.replace(/\bGAINT\b/gi, 'Giant');
        s = s.replace(/\b(\d+K)\s+Role\b/gi, '$1 Roll');
        s = s.replace(/\bRole\s*\((Full Count)\)/gi, 'Roll ($1)');

        // 6. Units and consistency
        s = s.replace(/\b(\d+)\s*PCS\b/gi, '$1 Pcs');
        s = s.replace(/\b(\d+)\s*pcs\b/g, '$1 Pcs');
        s = s.replace(/\bMulti\s+Color\b/gi, 'Multi Colour');
        s = s.replace(/\(Multi Color\)/gi, 'Multi Colour');
        s = s.replace(/\(Multi Colour\)/gi, 'Multi Colour');

        // Clean up repeated spaces
        s = s.replace(/\s{2,}/g, ' ').trim();

        return s;
    }

    /**
     * Retrieves all catalogue items including both individual crackers and gift boxes.
     * Consumes centralized CRACKERS_DATA (from data/crackers/crackers.js) when available,
     * and filters out any item with availability === false so items can be easily hidden.
     */
    static getCatalogueItems() {
        if (typeof CRACKERS_DATA !== 'undefined' && Array.isArray(CRACKERS_DATA)) {
            return CRACKERS_DATA
                .filter(it => it.availability !== false)
                .map(it => {
                    const cleanName = this.standardizeProductName(it.name);
                    const formattedPrice = (typeof it.sellingPrice === 'number')
                        ? `₹${it.sellingPrice}`
                        : (typeof it.price === 'string' ? it.price : `₹${it.sellingPrice || 0}`);
                    return {
                        id: it.id,
                        sNo: it.sNo,
                        name: cleanName,
                        nameEn: cleanName,
                        company: it.company || (it.category === 'gift_boxes' ? 'PRANAV' : 'KALIS'),
                        price: formattedPrice,
                        sellingPrice: it.sellingPrice,
                        originalPrice: it.originalPrice,
                        discount: it.discount || '60%',
                        image: it.image,
                        description: it.description,
                        category: it.category,
                        isAvailable: it.availability !== false,
                        isPopular: (it.isPopular !== undefined) ? it.isPopular : [1, 2, 11, 12, 19, 24, 25, 31, 37, 44, 60, 67, 72].includes(it.sNo),
                        isGreen: it.isGreen !== false,
                        itemCount: it.itemCount || (it.category === 'gift_boxes' ? (it.description || '35 Items') : undefined)
                    };
                });
        }

        const priceList = this.getPriceList();
        const giftBoxes = this.getGiftBoxes();
        const prods = this.getProducts();

        const items = priceList.map(pl => {
            const matchedProd = prods.find(p => p.nameEn.toLowerCase() === pl.name.toLowerCase() || p.sNo === pl.sNo);
            return {
                id: matchedProd ? matchedProd.id : `pl-${pl.sNo}`,
                sNo: pl.sNo,
                name: pl.name,
                nameEn: pl.name,
                company: pl.company || 'KALIS',
                price: pl.price,
                category: pl.category,
                isAvailable: true,
                isPopular: [1, 2, 11, 12, 19, 24, 25, 31, 37, 44, 60, 67, 72].includes(pl.sNo)
            };
        });

        giftBoxes.forEach(gb => {
            items.push({
                id: gb.id,
                name: `${gb.city} Gift Box`,
                nameEn: `${gb.city} Gift Box (${gb.itemCountNumber || 35} Items)`,
                company: 'PRANAV',
                price: gb.price,
                category: 'gift_boxes',
                isAvailable: true,
                isPopular: true,
                itemCount: gb.itemCount
            });
        });

        return items;
    }

    static getProducts() {
        if (typeof localStorage === 'undefined') return (typeof INITIAL_PRODUCTS !== 'undefined') ? INITIAL_PRODUCTS : [];
        const data = localStorage.getItem(_STORAGE_KEYS.PRODUCTS);
        if (!data) {
            this.setProducts(INITIAL_PRODUCTS);
            return INITIAL_PRODUCTS;
        }
        try {
            const prods = JSON.parse(data);
            return prods.map(p => ({
                ...p,
                nameEn: this.standardizeProductName(p.nameEn),
                company: p.company || 'KALIS'
            }));
        } catch (e) {
            return INITIAL_PRODUCTS;
        }
    }

    static setProducts(products) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        }
    }

    static getGiftBoxes() {
        if (typeof localStorage === 'undefined') return (typeof INITIAL_GIFT_BOXES !== 'undefined') ? INITIAL_GIFT_BOXES : [];
        const data = localStorage.getItem(_STORAGE_KEYS.GIFT_BOXES);
        if (!data) {
            this.setGiftBoxes(INITIAL_GIFT_BOXES);
            return INITIAL_GIFT_BOXES;
        }
        try {
            const boxes = JSON.parse(data);
            return boxes.map(gb => ({
                ...gb,
                contents: (gb.contents || []).map(c => ({
                    ...c,
                    name: this.standardizeProductName(c.name)
                }))
            }));
        } catch (e) {
            return INITIAL_GIFT_BOXES;
        }
    }

    static setGiftBoxes(giftBoxes) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(_STORAGE_KEYS.GIFT_BOXES, JSON.stringify(giftBoxes));
        }
    }

    static getCategories() {
        if (typeof localStorage === 'undefined') return (typeof INITIAL_CATEGORIES !== 'undefined') ? INITIAL_CATEGORIES : [];
        const data = localStorage.getItem(_STORAGE_KEYS.CATEGORIES);
        if (!data) {
            this.setCategories(INITIAL_CATEGORIES);
            return INITIAL_CATEGORIES;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return INITIAL_CATEGORIES;
        }
    }

    static setCategories(categories) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        }
    }

    static getSettings() {
        if (typeof localStorage === 'undefined') return _INITIAL_SETTINGS;
        const data = localStorage.getItem(_STORAGE_KEYS.SETTINGS);
        if (!data) {
            this.setSettings(_INITIAL_SETTINGS);
            return _INITIAL_SETTINGS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return _INITIAL_SETTINGS;
        }
    }

    static setSettings(settings) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        }
    }

    // Helper for localized product/category names
    static getLocalizedName(obj, lang) {
        if (!obj) return '';
        const cap = lang.charAt(0).toUpperCase() + lang.slice(1);
        return obj['name' + cap] || obj.nameEn || obj.city || '';
    }

    static getLocalizedDesc(obj, lang) {
        if (!obj) return '';
        const cap = lang.charAt(0).toUpperCase() + lang.slice(1);
        return obj['desc' + cap] || obj['description' + cap] || obj.descEn || obj.descriptionEn || '';
    }

    // --- Orders Management ---
    static getOrders() {
        if (typeof localStorage === 'undefined') return [];
        const data = localStorage.getItem(_STORAGE_KEYS.ORDERS);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    static saveOrder(order) {
        const orders = this.getOrders();
        order.id = order.id || `PC-REQ-${orders.length + 1024}`;
        order.createdAt = order.createdAt || new Date().toISOString();
        order.status = order.status || 'UNDER REVIEW';
        order.paymentStatus = order.paymentStatus || 'Payment Pending';
        orders.unshift(order);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        }
        return order;
    }

    static getOrderById(orderId) {
        if (!orderId) return null;
        const cleanId = orderId.trim().toUpperCase();
        const orders = this.getOrders();
        return orders.find(o => o.id.toUpperCase() === cleanId || o.phone.includes(cleanId)) || null;
    }

    static updateOrder(orderId, updateFields) {
        const orders = this.getOrders();
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            orders[idx] = { ...orders[idx], ...updateFields, updatedAt: new Date().toISOString() };
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            }
            return orders[idx];
        }
        return null;
    }

    // --- Discount Requests Management ---
    static getDiscountRequests() {
        if (typeof localStorage === 'undefined') return [];
        const data = localStorage.getItem(_STORAGE_KEYS.DISCOUNTS);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    static saveDiscountRequest(req) {
        const requests = this.getDiscountRequests();
        req.id = 'DR-' + Date.now();
        req.createdAt = new Date().toISOString();
        req.status = 'PENDING';
        requests.unshift(req);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(_STORAGE_KEYS.DISCOUNTS, JSON.stringify(requests));
        }
        return req;
    }

    static updateDiscountRequest(requestId, updateFields) {
        const requests = this.getDiscountRequests();
        const idx = requests.findIndex(r => r.id === requestId);
        if (idx !== -1) {
            requests[idx] = { ...requests[idx], ...updateFields, updatedAt: new Date().toISOString() };
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(_STORAGE_KEYS.DISCOUNTS, JSON.stringify(requests));
            }
            return requests[idx];
        }
        return null;
    }

    static getPriceList() {
        if (typeof localStorage === 'undefined') return (typeof INITIAL_PRICE_LIST !== 'undefined') ? INITIAL_PRICE_LIST : [];
        const data = localStorage.getItem(_STORAGE_KEYS.PRICE_LIST);
        if (!data) {
            this.setPriceList(INITIAL_PRICE_LIST);
            return INITIAL_PRICE_LIST;
        }
        try {
            const list = JSON.parse(data);
            return list.map(item => ({
                ...item,
                name: this.standardizeProductName(item.name)
            }));
        } catch (e) {
            return INITIAL_PRICE_LIST;
        }
    }

    static setPriceList(list) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(_STORAGE_KEYS.PRICE_LIST, JSON.stringify(list));
        }
    }

    static resetAll() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(_STORAGE_KEYS.PRODUCTS);
            localStorage.removeItem(_STORAGE_KEYS.GIFT_BOXES);
            localStorage.removeItem(_STORAGE_KEYS.CATEGORIES);
            localStorage.removeItem(_STORAGE_KEYS.PRICE_LIST);
            localStorage.removeItem(_STORAGE_KEYS.SETTINGS);
            localStorage.removeItem(_STORAGE_KEYS.CART);
            localStorage.removeItem(_STORAGE_KEYS.ORDERS);
            localStorage.removeItem(_STORAGE_KEYS.DISCOUNTS);
        }
        this.getProducts();
        this.getGiftBoxes();
        this.getCategories();
        this.getPriceList();
        this.getSettings();
    }
}

// Global window & module assignments
if (typeof window !== 'undefined') {
    window.DataStore = DataStore;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataStore };
}
