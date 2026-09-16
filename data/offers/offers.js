/**
 * =============================================================================
 * PRANAV CRACKERS - FESTIVAL OFFERS & DISCOUNT TIERS
 * File: data/offers/offers.js
 * =============================================================================
 * 
 * HOW TO USE THIS FILE:
 * Edit festival promotional offers, bulk order discount slabs, or gifts here.
 * =============================================================================
 */

const FESTIVAL_OFFERS = {
    currentSeason: 'Diwali 2026 Early Bird Special',
    flatDiscountRate: '80%',
    bulkDiscountTiers: [
        {
            minAmount: 5000,
            label: 'Orders above ₹5,000',
            perk: 'Free Delivery to Nearest Transport Hub'
        },
        {
            minAmount: 10000,
            label: 'Orders above ₹10,000',
            perk: 'Extra Free Gift Box + Priority Sivakasi Dispatch'
        },
        {
            minAmount: 25000,
            label: 'Orders above ₹25,000 (Bulk/Community)',
            perk: 'Special Wholesale Rate + Dedicated Logistics Support'
        }
    ]
};

if (typeof window !== 'undefined') {
    window.FESTIVAL_OFFERS = FESTIVAL_OFFERS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FESTIVAL_OFFERS };
}
