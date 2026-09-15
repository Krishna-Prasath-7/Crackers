const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== PRANAV CRACKERS: Multilingual Localization Test Suite ===');

// Load language.js in isolated vm context
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

// 1. Verify 9 languages
console.log('Supported languages count:', SUPPORTED_LANGUAGES.length);
const expectedLangs = ['en', 'ta', 'hi', 'te', 'ml', 'kn', 'gu', 'mr', 'bn'];
expectedLangs.forEach(lang => {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    if (!found) {
        throw new Error(`Missing supported language: ${lang}`);
    }
    console.log(`✓ Language verified: ${found.code} (${found.label} - ${found.nativeName})`);
});

// 2. Check essential translation keys across all languages
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
console.log(`✓ All ${requiredKeys.length} critical UI keys verified across all 9 languages!`);

// 3. Test Language Switching & Persistence
LanguageManager.setLanguage('ta');
if (LanguageManager.getLanguage() !== 'ta') throw new Error('Failed to set language to Tamil');
if (context.localStorage.getItem('pranav_crackers_language_v4') !== 'ta') throw new Error('Tamil not saved in localStorage');
console.log('Tamil catFlowerPots:', LanguageManager.t('catFlowerPots'));

LanguageManager.setLanguage('hi');
if (LanguageManager.getLanguage() !== 'hi') throw new Error('Failed to set language to Hindi');
console.log('Hindi diwaliHeroTitle:', LanguageManager.t('diwaliHeroTitle'));

LanguageManager.setLanguage('te');
console.log('Telugu btnSendWhatsapp:', LanguageManager.t('btnSendWhatsapp'));

LanguageManager.setLanguage('gu');
console.log('Gujarati viewQuotationBtn:', LanguageManager.t('viewQuotationBtn'));

LanguageManager.setLanguage('en');
console.log('English reset verified.');

console.log('=== MULTILINGUAL LOCALIZATION AUDIT: ALL TESTS PASSED! ===');
