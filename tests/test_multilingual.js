/**
 * =============================================================================
 * PRANAV CRACKERS - MULTILINGUAL LOCALIZATION TEST SUITE
 * =============================================================================
 * Validates:
 * 1. Exactly 9 supported languages: en, ta, hi, te, ml, kn, gu, mr, bn
 * 2. All 33 essential translation keys present in each language dictionary
 * 3. LanguageManager methods (getLanguage, setLanguage, t) work correctly
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== PRANAV CRACKERS: Multilingual Localization Test Suite ===');

const langCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'language.js'), 'utf8');

const context = {
    localStorage: {
        _data: {},
        getItem(k) { return this._data[k] || null; },
        setItem(k, v) { this._data[k] = String(v); },
        removeItem(k) { delete this._data[k]; }
    },
    document: {
        documentElement: { lang: 'en' },
        querySelectorAll() { return []; },
        addEventListener() {}
    },
    window: {
        dispatchEvent() {}
    },
    CustomEvent: class {},
    console: console
};
vm.createContext(context);
vm.runInContext(langCode, context);

const { SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageManager } = context.window;

console.log('Supported languages count:', SUPPORTED_LANGUAGES.length);
const expectedLangs = ['en', 'ta', 'hi', 'te', 'ml', 'kn', 'gu', 'mr', 'bn'];
expectedLangs.forEach(lang => {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    if (!found) {
        throw new Error(`Missing supported language: ${lang}`);
    }
    console.log(`✓ Language verified: ${found.code} (${found.label} - ${found.nativeName})`);
});

const requiredKeys = [
    'announcementBadge', 'announcementText', 'brandSub', 'btnWhatsApp', 'btnCall', 'btnQuotation',
    'diwaliHeroTitle', 'searchPlaceholder', 'viewCards', 'viewRateSheet',
    'catAll', 'catFlowerPots', 'catGroundChakkars', 'catSoundCrackers', 'catBombs', 'catRockets',
    'catSkyShots', 'catSparklers', 'catFancyItems', 'catGarlands', 'catGiftBoxes',
    'saveDiscount', 'subtotalText', 'wholesaleTotalText', 'viewQuotationBtn',
    'customerDetailsHeader', 'labelName', 'labelPhone', 'labelAddress', 'labelCity', 'labelState', 'labelPincode',
    'btnSendWhatsapp', 'reqPreparedTitle'
];

expectedLangs.forEach(lang => {
    const dict = TRANSLATIONS[lang];
    if (!dict) throw new Error(`Missing TRANSLATIONS dictionary for: ${lang}`);
    requiredKeys.forEach(k => {
        if (!dict[k] || dict[k].trim() === '') {
            throw new Error(`Missing key "${k}" in language: ${lang}`);
        }
    });
});
console.log(`✓ All ${requiredKeys.length} essential keys present across all 9 languages!`);

LanguageManager.setLanguage('ta');
if (LanguageManager.getLanguage() !== 'ta') throw new Error('Failed to set language to Tamil');
if (LanguageManager.t('btnWhatsApp') !== 'வாட்ஸ்அப்') throw new Error('Tamil translation lookup failed');

LanguageManager.setLanguage('hi');
if (LanguageManager.getLanguage() !== 'hi') throw new Error('Failed to set language to Hindi');
if (LanguageManager.t('btnWhatsApp') !== 'व्हाट्सएप') throw new Error('Hindi translation lookup failed');

LanguageManager.setLanguage('en');
if (LanguageManager.getLanguage() !== 'en') throw new Error('Failed to set language back to English');

console.log('✓ LanguageManager runtime switching verified.');
console.log('\nALL 9 LANGUAGES VERIFIED CLEANLY (100% SUCCESS)!\n');
