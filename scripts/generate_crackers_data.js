const fs = require('fs');
const path = require('path');

global.APP_CONFIG = require('../js/config.js').APP_CONFIG;
global.STORAGE_KEYS = APP_CONFIG.STORAGE_KEYS;
Object.assign(global, require('../js/products.js'));
const { DataStore } = require('../js/data.js');
const items = DataStore.getCatalogueItems();

const categoryImageMap = {
    sparklers: 'assets/images/sparklers.jpg',
    flower_pots: 'assets/images/flower_pots.jpg',
    ground_chakkars: 'assets/images/ground_chakkars.jpg',
    sound_crackers: 'assets/images/sound_crackers.jpg',
    one_sound: 'assets/images/sound_crackers.jpg',
    bijili: 'assets/images/sound_crackers.jpg',
    bombs: 'assets/images/bombs.jpg',
    paper_bomb: 'assets/images/bombs.jpg',
    rockets: 'assets/images/sky_rockets.jpg',
    sky_shots: 'assets/images/sky_shots.jpg',
    fancy_items: 'assets/images/fancy_items.jpg',
    other_items: 'assets/images/fancy_items.jpg',
    garlands: 'assets/images/garlands.jpg',
    gift_boxes: 'assets/images/gift_box.jpg'
};

const entries = items.map((it, idx) => {
    const priceNum = parseFloat(String(it.price).replace(/[^0-9.]/g, '')) || 0;
    const mrp = Math.round(priceNum * 2.5);
    const discountPct = mrp > 0 ? Math.round(((mrp - priceNum) / mrp) * 100) + '%' : '60%';
    const imgPath = categoryImageMap[it.category] || 'assets/images/gift_box.jpg';
    const sNo = it.sNo || (idx + 1);
    const desc = it.category === 'gift_boxes'
        ? (it.nameEn || it.name)
        : (it.name + ' - Certified Green Cracker direct from Sivakasi');

    return {
        id: it.id,
        sNo: sNo,
        name: it.name,
        category: it.category,
        originalPrice: mrp,
        sellingPrice: priceNum,
        discount: discountPct,
        image: imgPath,
        description: desc,
        availability: true,
        displayOrder: sNo,
        isGreen: true,
        isPopular: !!it.isPopular
    };
});

const content = `/**
 * =============================================================================
 * PRANAV CRACKERS - MASTER PRODUCT CATALOGUE
 * File: data/crackers/crackers.js
 * =============================================================================
 *
 * HOW TO USE THIS FILE:
 * 
 * 1. TO EDIT A CRACKER'S PRICE:
 *    Find the item and change 'sellingPrice':
 *      sellingPrice: 85,
 * 
 * 2. TO TEMPORARILY HIDE A CRACKER (OUT OF STOCK):
 *    Change 'availability' to false:
 *      availability: false,
 *    The cracker will automatically disappear from the website.
 *    Set it back to true to make it visible again.
 * 
 * 3. TO ADD A NEW CRACKER:
 *    Copy an existing product block, paste it, and edit:
 *      - id: unique ID (e.g. 'pl-95')
 *      - sNo: serial number (e.g. 95)
 *      - name: product name
 *      - category: category key (sparklers, flower_pots, ground_chakkars, sound_crackers, bombs, rockets, sky_shots, fancy_items, garlands, gift_boxes)
 *      - originalPrice: Retail MRP in Rupees (e.g. 350)
 *      - sellingPrice: Wholesale Rate in Rupees (e.g. 140)
 *      - discount: savings text (e.g. '60%')
 *      - image: path to image (e.g. 'assets/images/flower_pots.jpg')
 *      - availability: true
 *    Save the file and refresh your browser!
 * =============================================================================
 */

const CRACKERS_DATA = ${JSON.stringify(entries, null, 4)};

if (typeof window !== 'undefined') {
    window.CRACKERS_DATA = CRACKERS_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CRACKERS_DATA };
}
`;

const targetDir = path.join(__dirname, '../data/crackers');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}
fs.writeFileSync(path.join(targetDir, 'crackers.js'), content, 'utf8');
console.log('Successfully generated data/crackers/crackers.js with', entries.length, 'products');
