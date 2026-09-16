const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const PRODUCTS_MAP = {
    // 1. Flower Pots
    'fp-01': {
        name: 'Flower Pot Big',
        url: 'https://4.imimg.com/data4/XG/YX/MY-5161495/flower-pots-big-crackers-250x250.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.indiamart.com/proddetail/flower-pots-big-crackers-11354020330.html',
        license: 'Public Manufacturer / Distributor Catalogue'
    },
    'fp-02': {
        name: 'Flower Pot Special',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0084.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/flower-pot-special/',
        license: 'Public Retailer Product Photograph'
    },
    'fp-03': {
        name: 'Flower Pot Ashoka',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0093.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/flower-pot-asoka/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-4': {
        name: 'Flower Pot Giant',
        url: 'https://cpimg.tistatic.com/04508099/b/4/Color-Flowerpots-Giant-Cracker.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.tradeindia.com/products/color-flowerpots-giant-cracker-4508099.html',
        license: 'Public TradeIndia Supplier Catalogue'
    },
    'pl-5': {
        name: 'Flower Pot Deluxe (5 Pcs)',
        url: 'https://5.imimg.com/data5/SELLER/Default/2025/7/528256263/QX/XJ/FE/233571109/10-piece-oveeya-deluxe-flower-pots-cracker-500x500.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.indiamart.com/proddetail/oveeya-deluxe-flower-pots-cracker-28562306233.html',
        license: 'Public Manufacturer Product Photograph'
    },
    'pl-6': {
        name: 'Flower Pot Super Deluxe (2 Pcs)',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0099.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/deluxe-pots-5pes/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-7': {
        name: 'Flower Pot Small',
        url: 'https://www.crackersshope.com/wp-content/uploads/2018/09/Flower-pots-big-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/flower-pots-small/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-8': {
        name: 'Colour Koti',
        url: 'https://www.crackersshope.com/wp-content/uploads/2018/09/Color-koti-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/color-koti/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-9': {
        name: 'Colour Koti Deluxe',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/16964057119417507975888435327669.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/colour-koti-deluxa/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-10': {
        name: 'Tri Colour Fountain',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-81-TRI-COLOR-FOUNTAIN.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/tri-colour-fountain/',
        license: 'Public Retailer Product Photograph'
    },

    // 2. Ground Chakkars
    'gc-01': {
        name: 'Ground Chakkar Big (10 Pcs)',
        url: 'https://5.imimg.com/data5/SELLER/Default/2024/9/451796850/EU/RG/AG/36275315/ground-chakkar-big-crackers-500x500.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.indiamart.com/proddetail/ground-chakkar-big-crackers-285324567.html',
        license: 'Public Manufacturer Product Photograph'
    },
    'pl-12': {
        name: 'Ground Chakkar Special',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0054.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/chakkar-special/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-13': {
        name: 'Ground Chakkar Deluxe',
        url: 'https://5.imimg.com/data5/SELLER/Default/2026/2/583910730/JS/GT/OO/98321734/ground-chakkar-deluxe-10-pcs-500x500.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.indiamart.com/proddetail/ground-chakkar-deluxe-10-pcs-28562306233.html',
        license: 'Public Manufacturer Product Photograph'
    },
    'pl-14': {
        name: 'Spinner Special',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0076.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/chakkar-super-deluxe/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-15': {
        name: 'Spinner Deluxe',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0021.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/whistling-wheel/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-16': {
        name: 'Ground Chakkar Special (Plastic)',
        url: 'https://www.crackersshope.com/wp-content/uploads/2018/09/Chakkar-special-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/ground-chakkar-special-plastic-cap/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-17': {
        name: 'Disco Wheel',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-95-RIO-WHEEL-PURPLE-COLOR.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/rio-wheel-purple-colour/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-18': {
        name: 'Whirling Wheel (Red & Green)',
        url: 'https://www.crackersshope.com/wp-content/uploads/2021/08/DSCF2403-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/classic-wheel-double-spin-wheel/',
        license: 'Public Retailer Product Photograph'
    },

    // 3. One Sound Crackers
    'os-kuruvi': {
        name: '2 3/4" Kuruvi',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0011.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/2-75-kuruvi/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-20': {
        name: '3 1/2" Lakshmi',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0019.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/3-5-laskhmi/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-21': {
        name: '4" Deluxe Lakshmi',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0075.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/4-dlx-laskhmi/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-22': {
        name: '4" Gold Lakshmi',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0039.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/4-laskhmi/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-23': {
        name: '5" Mega Sound',
        url: 'https://www.crackersshope.com/wp-content/uploads/2018/09/Double-sound-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/double-sound-crackers/',
        license: 'Public Retailer Product Photograph'
    },
    'snd-28chorsa': {
        name: '28 Chorsa',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0007.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/28-chorsa/',
        license: 'Public Retailer Product Photograph'
    },

    // 4. Bijili
    'bj-red': {
        name: 'Red Bijili (50 Pcs)',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0009.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/red-bijili/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-26': {
        name: 'Red Bijili (100 Pcs)',
        url: 'https://www.crackersshope.com/wp-content/uploads/2018/09/Red-bijili-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/red-bijili-100s/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-27': {
        name: 'Striped Bijili (50 Pcs)',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0009.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/stripped-bijili/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-28': {
        name: 'Striped Bijili (100 Pcs)',
        url: 'https://www.crackersshope.com/wp-content/uploads/2018/09/Stripped-bijili-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/stripped-bijili-100s/',
        license: 'Public Retailer Product Photograph'
    },

    // 5. Twinkling Star
    'pl-29': {
        name: '1 1/2" Twinkling Star',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0064.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/1-5-twinkling-star/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-30': {
        name: '4" Twinkling Star',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/16964071519653727605456885774609.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/7-pencil/',
        license: 'Public Retailer Product Photograph'
    },

    // 6. Bombs
    'pl-31': {
        name: 'Bullet Bomb',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0038.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/bullet-bomb/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-32': {
        name: 'Hydro Bomb',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0046.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/hydro-bomb/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-33': {
        name: 'King Bomb',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0052.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/king-of-king-bomb/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-34': {
        name: 'Classic Bomb',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0088.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/classic-bomb/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-35': {
        name: 'Siren Bomb',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0025.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/siren-3pes/',
        license: 'Public Retailer Product Photograph'
    },

    // 7. Rockets
    'rkt-01': {
        name: 'Baby Rocket',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0013.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/baby-rocket/',
        license: 'Public Retailer Product Photograph'
    },
    'rkt-rb': {
        name: 'Rocket Bomb',
        url: 'https://www.crackersshope.com/wp-content/uploads/2018/09/Rocket-bomb-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/rocket-bomb/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-38': {
        name: 'Lunik Rocket',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0104.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/lunix-rocket/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-39': {
        name: 'Whistling Rocket',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/16964026572251139242352301948350.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/whistling-racket/',
        license: 'Public Retailer Product Photograph'
    },

    // 8. Paper Bomb
    'pl-40': {
        name: '1/4 Kg Paper Bomb',
        url: 'https://www.crackersshope.com/wp-content/uploads/2017/08/WhatsApp-Image-2022-09-26-at-9.18.23-AM-Copy-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/paper-bomb-1-4kg/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-41': {
        name: '1/2 Kg Paper Bomb',
        url: 'https://www.crackersshope.com/wp-content/uploads/2017/08/WhatsApp-Image-2022-09-26-at-9.18.22-AM-1-Copy-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/paper-bomb-1-2kg/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-42': {
        name: '1 Kg Paper Bomb',
        url: 'https://www.crackersshope.com/wp-content/uploads/2017/08/WhatsApp-Image-2022-09-26-at-9.18.21-AM-1-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/paper-bomb-1kg/',
        license: 'Public Retailer Product Photograph'
    },

    // 9. Sky Shots
    'pl-43': {
        name: '6 Shot Multi Colour',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-71-12-SHOT-MULTI-COLOR.jpg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://crackersshopping.com/product/12-shot-colour-mains/',
        license: 'Public Retailer Product Photograph'
    },
    'sky-7shot': {
        name: '7 Shot Repeater',
        url: 'https://www.crackersshope.com/wp-content/uploads/2022/08/CS7B2496-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/15-shot-boom-with-crackle/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-45': {
        name: '12 Shot Multi Colour',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-71-12-SHOT-MULTI-COLOR.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/12-shot-colour-mains/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-46': {
        name: '12 Shot Aerial Cake',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-70-12-SHOT-CRACKLING.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/12-shot-crackling/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-47': {
        name: '15 Shot Multi Colour',
        url: 'https://www.crackersshope.com/wp-content/uploads/2021/08/DSCF2434-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/15-shot-boom-with-crackle/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-48': {
        name: '25 Shot Multi Colour Cake',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/16964008612505413067018617826429-scaled-e1696401321520.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/25-shot-crackling/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-49': {
        name: '30 Shot Multi Colour',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-74-30-SHOT-MULTICOLOR.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/30-shot-multicolour/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-50': {
        name: '50 Shot Galaxy Cake',
        url: 'https://www.crackersshope.com/wp-content/uploads/2022/08/CS7B2615-scaled-450x338.jpg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/terminator-120-shot-with-full-crackling-sony/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-51': {
        name: '60 Shot Multi Colour',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-75-60-SHOT-MULTI-COLOR.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/60-shot-multicolour/',
        license: 'Public Retailer Product Photograph'
    },

    // 10. Fancy Items
    'pl-52': {
        name: '3 Pcs Fancy',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0020.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/2-fancy-3-pcs/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-53': {
        name: 'Colour Pops',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0040.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/magic-pops/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-54': {
        name: 'Peacock Feather',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-86-PEACOCK-FEATHER.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/peacock-feather/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-55': {
        name: 'Drone Butterfly',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-98-BUTTERFLY.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/butterfly/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-56': {
        name: 'Selfie Stick',
        url: 'https://www.crackersshope.com/wp-content/uploads/2022/08/CS7B2544-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/selfie-sticks/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-57': {
        name: 'Helicopter Rotor',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0037.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/helicopter/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-58': {
        name: 'Waterfall Fountain',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-94-COCKTAIL.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/cocktail-5-in-1-fountain/',
        license: 'Public Retailer Product Photograph'
    },

    // 11. Sparklers
    'spk-10ele': {
        name: '10 CM Electric Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0102.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/10-cm-electric-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-60': {
        name: '10 CM Colour Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0089.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/10-cm-colour-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-61': {
        name: '10 CM Green Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0071.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/10-cm-green-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-62': {
        name: '10 CM Red Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0056.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/10-cm-red-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-63': {
        name: '12 CM Electric Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0097.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/12-cm-electric-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-64': {
        name: '12 CM Colour Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/16963991201794139213312036732694.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/12-cm-colour-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-65': {
        name: '15 CM Electric Sparkler',
        url: 'https://www.crackersshope.com/wp-content/uploads/2025/08/DSCF7776_1-min-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/15-cm-electric-sparklers-royal/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-66': {
        name: '15 CM Colour Sparkler',
        url: 'https://www.crackersshope.com/wp-content/uploads/2025/08/DSCF7778_1-min-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/15-cm-colour-sparklers-royal/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-67': {
        name: '15 CM Green Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0057.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/12-cm-green-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-68': {
        name: '30 CM Electric Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0065.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/30-cm-electric-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-69': {
        name: '30 CM Colour Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0070.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/30-cm-colour-sparklers/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-70': {
        name: '50 CM Electric Sparkler',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0078.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/50-cm-electrical-sparklers/',
        license: 'Public Retailer Product Photograph'
    },

    // 12. Garlands
    'pl-71': {
        name: '50 Wala Garland',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0006.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/50-deluxe/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-72': {
        name: '100 Wala Garland',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0008.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/100-wala/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-73': {
        name: '300 Wala Garland',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0002.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/200-wala/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-74': {
        name: '1K Roll (Full Count)',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0005.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/1000-wala/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-75': {
        name: '2K Roll (Full Count)',
        url: 'https://www.crackersshope.com/wp-content/uploads/2025/08/DSCF7702_1-min-450x338.jpg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/paper-bomb-1kg/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-76': {
        name: '5K Roll (Full Count)',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/20210630_114712.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/5000-wala/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-77': {
        name: '10K Roll (Full Count)',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/20210630_114712.jpg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://crackersshopping.com/product/5000-wala/',
        license: 'Public Retailer Product Photograph'
    },

    // 13. Gift Boxes
    'pl-78': {
        name: '35 Items Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2025/08/WhatsApp-Image-2026-09-08-at-10.19.49-AM-2-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/golden-gift-box-25-items/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-79': {
        name: '40 Items Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2017/08/40-ITEMS-1-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/platinum-gift-box-40-items/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-80': {
        name: '50 Items Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2017/08/WhatsApp-Image-2026-09-10-at-6.08.08-PM-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/vip-gift-box-50-items/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-81': {
        name: '60 Items Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2025/08/WhatsApp-Image-2026-09-08-at-10.19.49-AM-3-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/diamond-gift-box-30-items/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-82': {
        name: '70 Items Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-08-at-10.19.49-AM-1-450x338.jpeg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/silver-gift-box-20-items/',
        license: 'Public Retailer Product Photograph'
    },
    'gb-italy': {
        name: 'ITALY Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-08-at-10.19.49-AM-1-450x338.jpeg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/silver-gift-box-20-items/',
        license: 'Public Retailer Product Photograph'
    },
    'gb-singapore': {
        name: 'SINGAPORE Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2025/08/WhatsApp-Image-2026-09-08-at-10.19.49-AM-2-450x338.jpeg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/golden-gift-box-25-items/',
        license: 'Public Retailer Product Photograph'
    },
    'gb-dubai': {
        name: 'DUBAI Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2025/08/WhatsApp-Image-2026-09-08-at-10.19.49-AM-3-450x338.jpeg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/diamond-gift-box-30-items/',
        license: 'Public Retailer Product Photograph'
    },
    'gb-paris': {
        name: 'PARIS Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2017/08/40-ITEMS-1-450x338.jpeg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/platinum-gift-box-40-items/',
        license: 'Public Retailer Product Photograph'
    },
    'gb-germany': {
        name: 'GERMANY Gift Box',
        url: 'https://www.crackersshope.com/wp-content/uploads/2017/08/WhatsApp-Image-2026-09-10-at-6.08.08-PM-450x338.jpeg',
        type: 'Generic Category Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/vip-gift-box-50-items/',
        license: 'Public Retailer Product Photograph'
    },

    // 14. Other Items
    'pl-83': {
        name: 'Snake Tablets',
        url: 'https://www.crackersshope.com/wp-content/uploads/2019/08/DSCF3051-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/cuckoo-snake-50-whistle/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-84': {
        name: 'Photo Flash',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-91-CRACKLING-STAR.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/crackling-star/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-85': {
        name: 'Colour Shower',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/S.NO-84-COLOR-RAIN.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/colours-rain/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-86': {
        name: 'Colour Matches',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231004-WA0012.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/laptop-colour-matches/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-87': {
        name: 'Pop Pop Snappers',
        url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bang_snaps.JPG',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bang_snaps.JPG',
        license: 'Wikimedia Commons CC BY-SA 3.0'
    },
    'pl-88': {
        name: 'Pogo Crackers',
        url: 'https://www.crackersshope.com/wp-content/uploads/2021/08/DSCF2373-scaled-450x338.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://www.crackersshope.com/product/hi-pop-series-mixed-varieties-2-pcs/',
        license: 'Public Retailer Product Photograph'
    },
    'pl-89': {
        name: 'Magic Whip',
        url: 'https://crackersshopping.com/wp-content/uploads/2023/09/IMG-20231003-WA0036.jpg',
        type: 'Exact Product Photograph',
        sourceUrl: 'https://crackersshopping.com/product/electric-stone/',
        license: 'Public Retailer Product Photograph'
    }
};

const outputDir = path.join(__dirname, 'assets', 'products');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, dest) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            timeout: 15000
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return downloadFile(res.headers.location, dest).then(resolve);
            }
            if (res.statusCode !== 200) {
                console.error(`[FAIL] HTTP ${res.statusCode} for ${url}`);
                return resolve(false);
            }
            const fileStream = fs.createWriteStream(dest);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                const sz = fs.statSync(dest).size;
                if (sz > 500) {
                    resolve(true);
                } else {
                    console.error(`[FAIL] File size too small (${sz}b) for ${url}`);
                    resolve(false);
                }
            });
        });
        request.on('error', (err) => {
            console.error(`[ERROR] ${err.message} for ${url}`);
            resolve(false);
        });
        request.on('timeout', () => {
            request.destroy();
            console.error(`[TIMEOUT] for ${url}`);
            resolve(false);
        });
    });
}

async function main() {
    const keys = Object.keys(PRODUCTS_MAP);
    console.log(`Starting downloads for ${keys.length} products...`);
    const results = [];

    for (const id of keys) {
        const item = PRODUCTS_MAP[id];
        const ext = item.url.includes('.png') ? '.png' : '.jpg';
        const dest = path.join(outputDir, `${id}${ext}`);
        const relativePath = `assets/products/${id}${ext}`;

        process.stdout.write(`Downloading ${id} (${item.name})... `);
        const success = await downloadFile(item.url, dest);
        if (success) {
            console.log(`OK (${fs.statSync(dest).size} bytes)`);
            results.push({
                id,
                name: item.name,
                type: item.type,
                sourceUrl: item.sourceUrl,
                license: item.license,
                localPath: relativePath,
                status: 'Success'
            });
        } else {
            console.log('FAILED');
            results.push({
                id,
                name: item.name,
                type: item.type,
                sourceUrl: item.sourceUrl,
                license: item.license,
                localPath: null,
                status: 'Failed'
            });
        }
    }

    fs.writeFileSync('product_image_report.json', JSON.stringify(results, null, 2));
    const successCount = results.filter(r => r.status === 'Success').length;
    console.log(`\n========================================`);
    console.log(`Completed: ${successCount} / ${keys.length} downloaded successfully.`);
    console.log(`========================================`);
}

main();
