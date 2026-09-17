/**
 * =============================================================================
 * PRANAV CRACKERS - WEBSITE EDITABLE CONTENT & COPY
 * File: data/siteContent/siteContent.js
 * =============================================================================
 * 
 * HOW TO USE THIS FILE:
 * Edit any visible website headlines, marketing slogans, trust assurances,
 * or announcements in this file.
 * =============================================================================
 */

const SITE_CONTENT = {
    // --- 1. TOP ANNOUNCEMENT BAR ---
    announcement: {
        badge: '💥 DIWALI 2026',
        text: 'Direct Sivakasi Factory Wholesale • Up to 80% Off Retail MRP • Safe All-India Transport',
        contactDesk: '📞 Sivakasi Desk: +91 77085 32334'
    },

    // --- 2. HERO BANNER SECTION ---
    hero: {
        liveBadge: '✨ SIVAKASI DIRECT WHOLESALE • DIWALI 2026 LIVE',
        titlePart1: 'Direct Sivakasi Fireworks',
        titleHighlight: 'at Factory Wholesale Rates',
        description: 'Certified green crackers direct from Sivakasi manufacturing hubs. Instant live quotation calculator, zero middleman commissions, and doorstep transport logistics.',
        primaryCtaText: 'Browse Wholesale Rate Sheet',
        secondaryCtaText: 'Burst Fireworks ✨',
        showcaseHamperTitle: 'Premium Celebration Hamper',
        showcaseHamperSubtitle: 'Festival of Lights',
        stats: {
            varieties: '94+',
            wholesaleDiscount: '80%',
            dispatch: 'Direct Sivakasi Hub'
        },
        trustPills: [
            { icon: '⚡', text: 'Instant Live Quotation' },
            { icon: '🌿', text: 'CSIR-NEERI Green Certified' },
            { icon: '🚚', text: 'Direct Sivakasi Transport' }
        ]
    },

    // --- 3. 4-PILLAR QUICK LIVE METRIC TICKER (Below Hero) ---
    tickerPillars: [
        {
            title: 'Direct Factory Wholesale',
            desc: 'Zero middleman commissions'
        },
        {
            title: 'CSIR-NEERI Green Certified',
            desc: 'Low emission, safe crackers'
        },
        {
            title: 'Instant Live Quotation',
            desc: '30-second WhatsApp checkout'
        },
        {
            title: 'All-India Safe Transport',
            desc: 'Safe cardboard box packing'
        }
    ],

    // --- 4. CATALOGUE HEADER ---
    catalogueHeader: {
        superTag: 'OFFICIAL 2026 FACTORY PRICE LIST',
        title: 'Wholesale Rate Sheet & Live Quotation',
        subtitle: 'Select quantities using + to calculate your live quotation and send via WhatsApp'
    },

    // --- 5. BOTTOM CUSTOMER MEMORY & TRUST QUOTE ---
    bottomQuote: {
        quote: '“Bringing genuine Sivakasi fireworks directly to families across India with complete safety, authentic green certificates, and honest factory prices since 2018.”',
        author: 'PRANAV CRACKERS • SIVAKASI TRADITION'
    },

    // --- 6. LEGAL NOTICE ---
    legalNotice: '⚠️ Legal Notice: In strict compliance with Supreme Court of India directives and CSIR-NEERI green fireworks guidelines, this platform functions as a digital price estimation tool. Products are supplied directly from licensed Sivakasi manufacturers.'
};

if (typeof window !== 'undefined') {
    window.SITE_CONTENT = SITE_CONTENT;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONTENT };
}
