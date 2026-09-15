/**
 * PRANAV CRACKERS - Central Data Store & Management Layer
 * Multilingual support across English, Tamil, Hindi, Telugu, Malayalam, and Kannada.
 */

const STORAGE_KEYS = {
    PRODUCTS: 'pranav_crackers_products_v11',
    GIFT_BOXES: 'pranav_crackers_giftboxes_v11',
    CATEGORIES: 'pranav_crackers_categories_v11',
    PRICE_LIST: 'pranav_crackers_pricelist_v11',
    SETTINGS: 'pranav_crackers_settings_v11',
    CART: 'pranav_crackers_cart_v11',
    ORDERS: 'pranav_crackers_orders_v11',
    DISCOUNTS: 'pranav_crackers_discounts_v11',
    LANGUAGE: 'pranav_crackers_language_v4'
};

const PRICE_LIST_CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'flower_pots', name: 'Flowerpots', title: 'FLOWERPOTS' },
    { id: 'ground_chakkars', name: 'Chakkars', title: 'GROUND CHAKKARS' },
    { id: 'one_sound', name: 'One Sound', title: 'ONE SOUND CRACKERS' },
    { id: 'bijili', name: 'Bijili', title: 'BIJILI CRACKERS' },
    { id: 'twinkling_star', name: 'Twinkling Star', title: 'TWINKLING STAR' },
    { id: 'bombs', name: 'Bombs', title: 'BOMBS' },
    { id: 'rockets', name: 'Rockets', title: 'ROCKETS' },
    { id: 'paper_bomb', name: 'Paper Bomb', title: 'PAPER BOMB' },
    { id: 'sky_shots', name: 'Sky Shots', title: 'SKY SHOTS' },
    { id: 'fancy_items', name: 'Fancy Items', title: 'FANCY ITEMS' },
    { id: 'sparklers', name: 'Sparklers', title: 'SPARKLERS' },
    { id: 'garlands', name: 'Garlands', title: 'GARLANDS' },
    { id: 'gift_boxes', name: 'Gift Boxes', title: 'GIFT BOXES' },
    { id: 'other_items', name: 'Other Items', title: 'OTHER ITEMS' }
];

const INITIAL_PRICE_LIST = [
    // --- 1. FLOWERPOTS ---
    { sNo: 1, name: 'Flower Pot Big', company: 'KALIS', price: '₹70', category: 'flower_pots' },
    { sNo: 2, name: 'Flower Pot Special', company: 'KALIS', price: '₹95', category: 'flower_pots' },
    { sNo: 3, name: 'Flower Pot Ashoka', company: 'KALIS', price: '₹140', category: 'flower_pots' },
    { sNo: 4, name: 'Flower Pot Giant', company: 'KALIS', price: '₹170', category: 'flower_pots' },
    { sNo: 5, name: 'Flower Pot Deluxe (5 Pcs)', company: 'KALIS', price: '₹120', category: 'flower_pots' },
    { sNo: 6, name: 'Flower Pot Super Deluxe (2 Pcs)', company: 'KALIS', price: '₹150', category: 'flower_pots' },
    { sNo: 7, name: 'Flower Pot Small', company: 'KALIS', price: '₹50', category: 'flower_pots' },
    { sNo: 8, name: 'Colour Koti', company: 'KALIS', price: '₹200', category: 'flower_pots' },
    { sNo: 9, name: 'Colour Koti Deluxe', company: 'KALIS', price: '₹300', category: 'flower_pots' },
    { sNo: 10, name: 'Tri Colour Fountain', company: 'KALIS', price: '₹240', category: 'flower_pots' },

    // --- 2. GROUND CHAKKARS ---
    { sNo: 11, name: 'Ground Chakkar Big (10 Pcs)', company: 'KALIS', price: '₹40', category: 'ground_chakkars' },
    { sNo: 12, name: 'Ground Chakkar Special', company: 'KALIS', price: '₹70', category: 'ground_chakkars' },
    { sNo: 13, name: 'Ground Chakkar Deluxe', company: 'KALIS', price: '₹130', category: 'ground_chakkars' },
    { sNo: 14, name: 'Spinner Special', company: 'KALIS', price: '₹110', category: 'ground_chakkars' },
    { sNo: 15, name: 'Spinner Deluxe', company: 'KALIS', price: '₹140', category: 'ground_chakkars' },
    { sNo: 16, name: 'Ground Chakkar Special (Plastic)', company: 'KALIS', price: '₹160', category: 'ground_chakkars' },
    { sNo: 17, name: 'Disco Wheel', company: 'KALIS', price: '₹180', category: 'ground_chakkars' },
    { sNo: 18, name: 'Whirling Wheel (Red & Green)', company: 'KALIS', price: '₹150', category: 'ground_chakkars' },

    // --- 3. ONE SOUND CRACKERS ---
    { sNo: 19, name: '2 3/4" Kuruvi', company: 'STANDARD', price: '₹9', category: 'one_sound' },
    { sNo: 20, name: '3 1/2" Lakshmi', company: 'STANDARD', price: '₹18', category: 'one_sound' },
    { sNo: 21, name: '4" Deluxe Lakshmi', company: 'STANDARD', price: '₹28', category: 'one_sound' },
    { sNo: 22, name: '4" Gold Lakshmi', company: 'STANDARD', price: '₹36', category: 'one_sound' },
    { sNo: 23, name: '5" Mega Sound', company: 'KALIS', price: '₹55', category: 'one_sound' },
    { sNo: 24, name: '28 Chorsa', company: 'KALIS', price: '₹20', category: 'one_sound' },

    // --- 4. BIJILI CRACKERS ---
    { sNo: 25, name: 'Red Bijili (50 Pcs)', company: 'STANDARD', price: '₹20', category: 'bijili' },
    { sNo: 26, name: 'Red Bijili (100 Pcs)', company: 'STANDARD', price: '₹38', category: 'bijili' },
    { sNo: 27, name: 'Striped Bijili (50 Pcs)', company: 'STANDARD', price: '₹24', category: 'bijili' },
    { sNo: 28, name: 'Striped Bijili (100 Pcs)', company: 'STANDARD', price: '₹46', category: 'bijili' },

    // --- 5. TWINKLING STAR ---
    { sNo: 29, name: '1 1/2" Twinkling Star', company: 'KALIS', price: '₹35', category: 'twinkling_star' },
    { sNo: 30, name: '4" Twinkling Star', company: 'KALIS', price: '₹85', category: 'twinkling_star' },

    // --- 6. BOMBS ---
    { sNo: 31, name: 'Bullet Bomb', company: 'KALIS', price: '₹45', category: 'bombs' },
    { sNo: 32, name: 'Hydro Bomb', company: 'KALIS', price: '₹80', category: 'bombs' },
    { sNo: 33, name: 'King Bomb', company: 'KALIS', price: '₹120', category: 'bombs' },
    { sNo: 34, name: 'Classic Bomb', company: 'KALIS', price: '₹90', category: 'bombs' },
    { sNo: 35, name: 'Siren Bomb', company: 'KALIS', price: '₹110', category: 'bombs' },

    // --- 7. ROCKETS ---
    { sNo: 36, name: 'Baby Rocket', company: 'KALIS', price: '₹65', category: 'rockets' },
    { sNo: 37, name: 'Rocket Bomb', company: 'S.KALA', price: '₹70', category: 'rockets' },
    { sNo: 38, name: 'Lunik Rocket', company: 'KALIS', price: '₹110', category: 'rockets' },
    { sNo: 39, name: 'Whistling Rocket', company: 'KALIS', price: '₹130', category: 'rockets' },

    // --- 8. PAPER BOMB ---
    { sNo: 40, name: '1/4 Kg Paper Bomb', company: 'KALIS', price: '₹65', category: 'paper_bomb' },
    { sNo: 41, name: '1/2 Kg Paper Bomb', company: 'KALIS', price: '₹125', category: 'paper_bomb' },
    { sNo: 42, name: '1 Kg Paper Bomb', company: 'KALIS', price: '₹240', category: 'paper_bomb' },

    // --- 9. SKY SHOTS ---
    { sNo: 43, name: '6 Shot Multi Colour', company: 'KALIS', price: '₹100', category: 'sky_shots' },
    { sNo: 44, name: '7 Shot Repeater', company: 'KALIS', price: '₹120', category: 'sky_shots' },
    { sNo: 45, name: '12 Shot Multi Colour', company: 'KALIS', price: '₹220', category: 'sky_shots' },
    { sNo: 46, name: '12 Shot Aerial Cake', company: 'KALIS', price: '₹340', category: 'sky_shots' },
    { sNo: 47, name: '15 Shot Multi Colour', company: 'KALIS', price: '₹380', category: 'sky_shots' },
    { sNo: 48, name: '25 Shot Multi Colour Cake', company: 'KALIS', price: '₹680', category: 'sky_shots' },
    { sNo: 49, name: '30 Shot Multi Colour', company: 'KALIS', price: '₹850', category: 'sky_shots' },
    { sNo: 50, name: '50 Shot Galaxy Cake', company: 'KALIS', price: '₹1,450', category: 'sky_shots' },
    { sNo: 51, name: '60 Shot Multi Colour', company: 'KALIS', price: '₹1,650', category: 'sky_shots' },

    // --- 10. FANCY ITEMS ---
    { sNo: 52, name: '3 Pcs Fancy', company: 'KALIS', price: '₹130', category: 'fancy_items' },
    { sNo: 53, name: 'Colour Pops', company: 'KALIS', price: '₹90', category: 'fancy_items' },
    { sNo: 54, name: 'Peacock Feather', company: 'KALIS', price: '₹150', category: 'fancy_items' },
    { sNo: 55, name: 'Drone Butterfly', company: 'KALIS', price: '₹180', category: 'fancy_items' },
    { sNo: 56, name: 'Selfie Stick', company: 'KALIS', price: '₹160', category: 'fancy_items' },
    { sNo: 57, name: 'Helicopter Rotor', company: 'KALIS', price: '₹140', category: 'fancy_items' },
    { sNo: 58, name: 'Waterfall Fountain', company: 'KALIS', price: '₹190', category: 'fancy_items' },

    // --- 11. SPARKLERS ---
    { sNo: 59, name: '10 CM Electric Sparkler', company: 'KALIS', price: '₹20', category: 'sparklers' },
    { sNo: 60, name: '10 CM Colour Sparkler', company: 'KALIS', price: '₹24', category: 'sparklers' },
    { sNo: 61, name: '10 CM Green Sparkler', company: 'KALIS', price: '₹26', category: 'sparklers' },
    { sNo: 62, name: '10 CM Red Sparkler', company: 'KALIS', price: '₹28', category: 'sparklers' },
    { sNo: 63, name: '12 CM Electric Sparkler', company: 'KALIS', price: '₹30', category: 'sparklers' },
    { sNo: 64, name: '12 CM Colour Sparkler', company: 'KALIS', price: '₹36', category: 'sparklers' },
    { sNo: 65, name: '15 CM Electric Sparkler', company: 'KALIS', price: '₹48', category: 'sparklers' },
    { sNo: 66, name: '15 CM Colour Sparkler', company: 'KALIS', price: '₹55', category: 'sparklers' },
    { sNo: 67, name: '15 CM Green Sparkler', company: 'KALIS', price: '₹65', category: 'sparklers' },
    { sNo: 68, name: '30 CM Electric Sparkler', company: 'KALIS', price: '₹110', category: 'sparklers' },
    { sNo: 69, name: '30 CM Colour Sparkler', company: 'KALIS', price: '₹130', category: 'sparklers' },
    { sNo: 70, name: '50 CM Electric Sparkler', company: 'KALIS', price: '₹220', category: 'sparklers' },

    // --- 12. GARLANDS ---
    { sNo: 71, name: '50 Wala Garland', company: 'KALIS', price: '₹45', category: 'garlands' },
    { sNo: 72, name: '100 Wala Garland', company: 'KALIS', price: '₹95', category: 'garlands' },
    { sNo: 73, name: '300 Wala Garland', company: 'KALIS', price: '₹260', category: 'garlands' },
    { sNo: 74, name: '1K Roll (Full Count)', company: 'KALIS', price: '₹750', category: 'garlands' },
    { sNo: 75, name: '2K Roll (Full Count)', company: 'KALIS', price: '₹1,500', category: 'garlands' },
    { sNo: 76, name: '5K Roll (Full Count)', company: 'KALIS', price: '₹3,600', category: 'garlands' },
    { sNo: 77, name: '10K Roll (Full Count)', company: 'KALIS', price: '₹7,200', category: 'garlands' },

    // --- 13. GIFT BOXES ---
    { sNo: 78, name: '35 Items Gift Box', company: 'KALIS', price: '₹700', category: 'gift_boxes' },
    { sNo: 79, name: '40 Items Gift Box', company: 'KALIS', price: '₹850', category: 'gift_boxes' },
    { sNo: 80, name: '50 Items Gift Box', company: 'KALIS', price: '₹1,000', category: 'gift_boxes' },
    { sNo: 81, name: '60 Items Gift Box', company: 'KALIS', price: '₹1,250', category: 'gift_boxes' },
    { sNo: 82, name: '70 Items Gift Box', company: 'KALIS', price: '₹1,400', category: 'gift_boxes' },

    // --- 14. OTHER ITEMS ---
    { sNo: 83, name: 'Snake Tablets', company: 'KALIS', price: '₹25', category: 'other_items' },
    { sNo: 84, name: 'Photo Flash', company: 'KALIS', price: '₹80', category: 'other_items' },
    { sNo: 85, name: 'Colour Shower', company: 'KALIS', price: '₹110', category: 'other_items' },
    { sNo: 86, name: 'Colour Matches', company: 'KALIS', price: '₹60', category: 'other_items' },
    { sNo: 87, name: 'Pop Pop Snappers', company: 'KALIS', price: '₹30', category: 'other_items' },
    { sNo: 88, name: 'Pogo Crackers', company: 'KALIS', price: '₹85', category: 'other_items' },
    { sNo: 89, name: 'Magic Whip', company: 'KALIS', price: '₹95', category: 'other_items' }
];

const INITIAL_CATEGORIES = [
    { 
        id: 'all', 
        nameEn: 'All Fireworks', 
        nameTa: 'அனைத்து வெடிகள்', 
        nameHi: 'सभी पटाखे', 
        nameTe: 'అన్ని బాణసంచా', 
        nameMl: 'എല്ലാ പടക്കങ്ങളും', 
        nameKn: 'ಎಲ್ಲಾ ಪಟಾಕಿಗಳು', 
        descEn: 'Full Sivakasi certified collection', 
        descTa: 'சிவகாசி நேரடி விற்பனை விலை', 
        descHi: 'शिवकाशी का संपूर्ण संग्रह',
        descTe: 'శివకాశి పూర్తి సేకరణ',
        descMl: 'ശിവകാശി പടക്കങ്ങൾ',
        descKn: 'ಶಿವಕಾಶಿ ಪಟಾಕಿಗಳು',
        image: 'assets/images/hero_fireworks.jpg' 
    },
    { 
        id: 'flower_pots', 
        nameEn: 'Flowerpots', 
        nameTa: 'பூந்தொட்டி (Flowerpots)', 
        nameHi: 'अनार (Flowerpots)', 
        nameTe: 'చిచ్చుబుడ్లు (Flowerpots)', 
        nameMl: 'പൂക്കുറ്റി (Flowerpots)', 
        nameKn: 'ಹೂಕುಂಡ (Flowerpots)', 
        descEn: 'Big, Special, Ashoka, Giant, Deluxe & Colour Koti', 
        descTa: 'பிக், ஸ்பெஷல், அசோகா, ஜயண்ட் மற்றும் கலர் கோட்டி', 
        descHi: 'बिग, स्पेशल, अशोका और डीलक्स अनार',
        descTe: 'బిగ్, స్పెషల్, అశోక మరియు డీలక్స్ చిచ్చుబుడ్లు',
        descMl: 'ബിഗ്, സ്പെഷ്യൽ, അശോക പൂക്കുറ്റികൾ',
        descKn: 'ಬಿಗ್, ಸ್ಪೆಷಲ್, ಅಶೋಕ ಹೂಕುಂಡಗಳು',
        image: 'assets/images/flower_pots.jpg' 
    },
    { 
        id: 'ground_chakkars', 
        nameEn: 'Chakkars', 
        nameTa: 'தரைச்சக்கரம் (Chakkars)', 
        nameHi: 'चकरी (Chakkars)', 
        nameTe: 'భూచక్రాలు (Chakkars)', 
        nameMl: 'ചക്രം (Chakkars)', 
        nameKn: 'ನೆಲಚಕ್ರ (Chakkars)', 
        descEn: 'Big, Special, Deluxe, Spinners & Whirling Wheels', 
        descTa: 'பிக், ஸ்பெஷல், டீலக்ஸ் மற்றும் சுழலும் சக்கரங்கள்', 
        descHi: 'स्पेशल, डीलक्स और प्लास्टिक व्हील चकरी',
        descTe: 'స్పెషల్, డీలక్స్ మరియు స్పిన్నర్ చక్రాలు',
        descMl: 'സ്പെഷ്യൽ, ഡീലക്സ് ചക്രങ്ങൾ',
        descKn: 'ಸ್ಪೆಷಲ್, ಡೀಲಕ್ಸ್ ನೆಲಚಕ್ರಗಳು',
        image: 'assets/images/ground_chakkars.jpg' 
    },
    { 
        id: 'one_sound', 
        nameEn: 'One Sound', 
        nameTa: 'ஒரு வெடி (One Sound)', 
        nameHi: 'एक आवाज पटाखे (One Sound)', 
        nameTe: 'వన్ సౌండ్ క్రాకర్స్', 
        nameMl: 'സിംഗിൾ വെടി (One Sound)', 
        nameKn: 'ಸಿಂಗಲ್ ಸೌಂಡ್ ಪಟಾಕಿ', 
        descEn: '2¾" Kuruvi, 3½" Lakshmi, 4" Deluxe & 5" Mega Sound', 
        descTa: 'குருவி வெடி, லக்ஷ்மி வெடி, மெகா சவுண்ட் மற்றும் சோரசா', 
        descHi: 'कुरुवी, लक्ष्मी, और मेगा साउंड पटाखे',
        descTe: 'కురువి, లక్ష్మి మరియు మెగా సౌండ్ టపాసులు',
        descMl: 'കുരുവി, ലക്ഷ്മി, മെഗാ സൗണ്ട് പടക്കങ്ങൾ',
        descKn: 'ಕುರುವಿ, ಲಕ್ಷ್ಮಿ ಮತ್ತು ಮೆಗಾ ಸೌಂಡ್ ಪಟಾಕಿಗಳು',
        image: 'assets/images/sound_crackers.jpg' 
    },
    { 
        id: 'bijili', 
        nameEn: 'Bijili Crackers', 
        nameTa: 'பிஜிலி வெடி', 
        nameHi: 'बिजली पटाखे', 
        nameTe: 'బిజిలీ టపాసులు', 
        nameMl: 'ബിജിലി പടക്കം', 
        nameKn: 'ಬಿಜಿಲಿ ಪಟಾಕಿ', 
        descEn: 'Red & Striped Bijili (50 & 100 Pieces)', 
        descTa: 'சிவப்பு மற்றும் வரி பிஜிலி (50 & 100 எண்ணிக்கை)', 
        descHi: 'लाल और स्ट्राइप्ड बिजली पटाखे',
        descTe: 'రెడ్ మరియు స్ట్రైప్డ్ బిజిలీ టపాసులు',
        descMl: 'റെഡ്, സ്ട്രൈപ്ഡ് ബിജിലി പടക്കങ്ങൾ',
        descKn: 'ಕೆಂಪು ಮತ್ತು ಪಟ್ಟೆ ಬಿಜಿಲಿ ಪಟಾಕಿ',
        image: 'assets/images/sound_crackers.jpg' 
    },
    { 
        id: 'twinkling_star', 
        nameEn: 'Twinkling Star', 
        nameTa: 'மின்னும் நட்சத்திரம்', 
        nameHi: 'टिमटिमाते तारे', 
        nameTe: 'మిణుకు మిణుకు నక్షత్రం', 
        nameMl: 'ടിങ്കിളിങ് സ്റ്റാർ', 
        nameKn: 'ಮಿನುಗುವ ನಕ್ಷತ್ರ',
        descEn: '1½ & 4" Twinkling Star sparklers', 
        descTa: 'பல்வேறு அளவுகளில் மின்னும் நட்சத்திர மத்தாப்பு', 
        descHi: 'विभिन्न आकारों में टिमटिमाते तारे',
        descTe: 'వివిధ పరిమాణాలలో మిణుకు నక్షత్రాలు',
        descMl: 'വിവിധ വലുപ്പത്തിലുള്ള ടിങ്കിളിങ് സ്റ്റാർ',
        descKn: 'ವಿವಿಧ ಗಾತ್ರಗಳಲ್ಲಿ ಮಿನುಗುವ ನಕ್ಷತ್ರ',
        image: 'assets/images/sparklers.jpg' 
    },
    { 
        id: 'bombs', 
        nameEn: 'Bombs', 
        nameTa: 'பாம்ஸ்', 
        nameHi: 'बम', 
        nameTe: 'బాంబులు', 
        nameMl: 'ബോംബ്', 
        nameKn: 'ಬಾಂಬ್‌ಗಳು',
        descEn: 'Bullet Bomb, Hydro Bomb, Siren Bomb, King Bomb', 
        descTa: 'புல்லட் பாம், ஹைட்ரோ பாம், சைரன் பாம், கிங் பாம்', 
        descHi: 'बुलेट बम, हाइड्रो बम, सायरन बम, किंग बम',
        descTe: 'బుల్లెట్ బాంబ్, హైడ్రో బాంబ్, సైరన్ బాంబ్, కింగ్ బాంబ్',
        descMl: 'ബുള്ളറ്റ് ബോംബ്, ഹൈഡ്രോ ബോംബ്, സൈറൺ ബോംബ്, കിംഗ് ബോംബ്',
        descKn: 'ಬುಲೆಟ್ ಬಾಂಬ್, ಹೈಡ್ರೋ ಬಾಂಬ್, ಸೈರನ್ ಬಾಂಬ್, ಕಿಂಗ್ ಬಾಂಬ್',
        image: 'assets/images/sound_crackers.jpg' 
    },
    { 
        id: 'rockets', 
        nameEn: 'Rockets', 
        nameTa: 'ராக்கெட்', 
        nameHi: 'रॉकेट', 
        nameTe: 'రాకెట్లు', 
        nameMl: 'റോക്കറ്റുകൾ', 
        nameKn: 'ರಾಕೆಟ್‌ಗಳು',
        descEn: 'Baby, Lunik & Whistling Aerial Rockets', 
        descTa: 'பேபி, லுனிக் மற்றும் விசிலிங் ராக்கெட்', 
        descHi: 'ऊंची उड़ान भरने वाले व्हिसलिंग रॉकेट',
        descTe: 'ఆకాశంలోకి దూసుకెళ్లే రాకెట్లు',
        descMl: 'ആകാശത്തേക്ക് കുതിച്ചുയരുന്ന റോക്കറ്റുകൾ',
        descKn: 'ಆಕಾಶಕ್ಕೆ ಚಿಮ್ಮುವ ರಾಕೆಟ್‌ಗಳು',
        image: 'assets/images/sky_rockets.jpg' 
    },
    { 
        id: 'paper_bomb', 
        nameEn: 'Paper Bomb', 
        nameTa: 'காகித பாம்', 
        nameHi: 'पेपर बम', 
        nameTe: 'పేపర్ బాంబ్', 
        nameMl: 'പേപ്പർ ബോംബ്', 
        nameKn: 'ಪೇಪರ್ ಬಾಂಬ್',
        descEn: '1/4 Kg, 1/2 Kg & 1 Kg classic paper bombs', 
        descTa: '1/4 கிலோ, 1/2 கிலோ மற்றும் 1 கிலோ காகித பாம்', 
        descHi: 'क्लासिक पेपर बम',
        descTe: 'క్లాసిక్ పేపర్ బాంబ్',
        descMl: 'ക്ലാസിക് പേപ്പർ ബോംബ്',
        descKn: 'ಕ್ಲಾಸಿಕ್ ಪೇಪರ್ ಬಾಂಬ್',
        image: 'assets/images/sound_crackers.jpg' 
    },
    { 
        id: 'sky_shots', 
        nameEn: 'Sky Shots', 
        nameTa: 'வானவேடிக்கை', 
        nameHi: 'स्काई शॉट्स', 
        nameTe: 'స్కై షాట్స్', 
        nameMl: 'ആകാശ വിസ്மയം (Sky Shots)', 
        nameKn: 'ಆಕಾಶ ಚಿಮ್ಮುಗೆಗಳು',
        descEn: '7, 12 & 25 Multi-Colour Aerial Cakes', 
        descTa: '7, 12 மற்றும் 25 ஷாட்ஸ் வான்வேடிக்கை', 
        descHi: 'रंगबिरंगी आतिशबाजी वाले 7, 12 व 25 शॉट्स',
        descTe: '7, 12 మరియు 25 షాట్స్ రంగుల బాణసంచా',
        descMl: '7, 12, 25 ഷോട്സ് വർണ്ണ വിസ്മയങ്ങൾ',
        descKn: '7, 12 ಮತ್ತು 25 ಶಾಟ್ಸ್ ಬಣ್ಣದ ಆಕಾಶ ಪಟಾಕಿ',
        image: 'assets/images/sky_shots.jpg' 
    },
    { 
        id: 'fancy_items', 
        nameEn: 'Fancy Items', 
        nameTa: 'ஃபேன்சி ஐட்டம்ஸ்', 
        nameHi: 'फैंसी आइटम्स', 
        nameTe: 'ఫ్యాన్సీ ఐటమ్స్', 
        nameMl: 'ഫാൻസി ഐറ്റംസ്', 
        nameKn: 'ಫ್ಯಾನ್ಸಿ ಐಟಂಗಳು',
        descEn: 'Selfie Stick, Peacock Feather, Colour Pops & Drone Butterfly', 
        descTa: 'செல்ஃபி ஸ்டிக், மயில் இறகு, கலர் பாப்ஸ், ட்ரோன் பட்டாம்பூச்சி', 
        descHi: 'सेल्फी स्टिक, मोर पंख, कलर पॉप्स, ड्रोन बटरफ्लाई',
        descTe: 'సెల్ఫీ స్టిక్, పీకాక్ ఫెదర్, కలర్ పాప్స్, డ్రోన్ బటర్‌ఫ్లై',
        descMl: 'സെൽഫി സ്റ്റിക്, പീക്കോക്ക് ഫെദർ, കളർ പോപ്സ്, ഡ്രോൺ ബട്ടർഫ്ലൈ',
        descKn: 'ಸೆಲ್ಫಿ ಸ್ಟಿಕ್, ನವಿಲು ಗರಿ, ಕಲರ್ ಪಾಪ್ಸ್, ಡ್ರೋನ್ ಬಟರ್‌ಫ್ಲೈ',
        image: 'assets/images/sparklers.jpg' 
    },
    { 
        id: 'sparklers', 
        nameEn: 'Sparklers', 
        nameTa: 'மத்தாப்பு', 
        nameHi: 'फुलझड़ी (Sparklers)', 
        nameTe: 'కాకరపువ్వొత్తులు', 
        nameMl: 'പൂത്തിരി', 
        nameKn: 'ಸುರುಸುರು ಬತ್ತಿ',
        descEn: '10cm, 12cm, 15cm & 30cm Giant Sparklers', 
        descTa: '10 செ.மீ, 12 செ.மீ, 15 செ.மீ மற்றும் 30 செ.மீ மத்தாப்பு', 
        descHi: 'इलेक्ट्रिक, कलर और ग्रीन फुलझड़ियां',
        descTe: 'ఎలక్ట్రిక్, కలర్ మరియు గ్రీన్ రకాలు',
        descMl: 'ഇലക്ട്രിക്, കളർ, ഗ്രീൻ പൂത്തിരികൾ',
        descKn: 'ಎಲೆಕ್ಟ್ರಿಕ್ ಮತ್ತು ಕಲರ್ ಸುರುಸುರು ಬತ್ತಿಗಳು',
        image: 'assets/images/sparklers.jpg' 
    },
    { 
        id: 'garlands', 
        nameEn: 'Garlands', 
        nameTa: 'சரவெடி மாலை', 
        nameHi: 'लड़ी (Garlands)', 
        nameTe: 'లడీలు (Garlands)', 
        nameMl: 'മാല പടക്കങ്ങൾ', 
        nameKn: 'ಸರಮಾಲೆ ಪಟಾಕಿ', 
        descEn: '50 Wala, 100 Wala & 1000 Wala Garlands', 
        descTa: '50 வாலா, 100 வாலா மற்றும் 1000 வாலா சரவெடி', 
        descHi: '50 वाला, 100 वाला और 1000 वाला लड़ी',
        descTe: '50 వాలా, 100 వాలా మరియు 1000 వాలా లడీలు',
        descMl: '50 വാല, 100 വാല, 1000 വാല മാലകൾ',
        descKn: '50 ವಾಲಾ, 100 ವಾಲಾ ಮತ್ತು 1000 ವಾಲಾ ಸರಮಾಲೆ',
        image: 'assets/images/sound_crackers.jpg' 
    },
    { 
        id: 'gift_boxes', 
        nameEn: 'Gift Boxes', 
        nameTa: 'கிஃப்ட் பாக்ஸ்கள்', 
        nameHi: 'गिफ्ट बॉक्स', 
        nameTe: 'గిఫ్ట్ బాక్స్‌లు', 
        nameMl: 'ഗിഫ്റ്റ് ബോക്സുകൾ', 
        nameKn: 'ಗಿಫ್ಟ್ ಬಾಕ್ಸ್‌ಗಳು', 
        descEn: 'Italy (35), Singapore (40), Dubai (50), Paris (60), Germany (70)', 
        descTa: 'இத்தாலி, சிங்கப்பூர், துபாய், பாரிஸ், ஜெர்மனி', 
        descHi: '5 गिफ्ट बॉक्स: इटली, सिंगापुर, दुबई, पेरिस, जर्मनी', 
        descTe: '5 గిఫ్ట్ బాక్స్‌లు: ఇటలీ, సింగపూర్, దుబాయ్, ప్యారిస్, జర్మనీ', 
        descMl: '5 ഗിഫ്റ്റ് ബോക്സുകൾ: ഇറ്റലി, സിംഗപ്പൂർ, ദുബായ്, പാരീസ്, ജർമ്മനി', 
        descKn: '5 ಗಿಫ್ಟ್ ಬಾಕ್ಸ್‌ಗಳು: ಇಟಲಿ, ಸಿಂಗಾಪುರ, ದುಬೈ, ಪ್ಯಾರಿಸ್, ಜರ್ಮನಿ', 
        image: 'assets/images/gift_box.jpg' 
    },
    { 
        id: 'other_items', 
        nameEn: 'Other Items', 
        nameTa: 'மற்ற ஐட்டம்ஸ்', 
        nameHi: 'अन्य आइटम्स', 
        nameTe: 'ఇతర ఐటమ్స్', 
        nameMl: 'മറ്റ് ഐറ്റംസ്', 
        nameKn: 'ಇತರ ಐಟಂಗಳು', 
        descEn: 'Colour Shower, Photo Flash, Pogo, Snake Tablets & Novelties', 
        descTa: 'கலர் ஷவர், போட்டோ ஃபிளாஷ், போகோ, பாம்பு மாத்திரை', 
        descHi: 'कलर शॉवर, फोटो फ्लैश, पोगो, स्नेक और अन्य', 
        descTe: 'కలర్ షవర్, ఫోటో ఫ్లాష్, పొగో, స్నేక్ మరియు మరిన్ని', 
        descMl: 'കളർ ഷവർ, ഫോട്ടോ ഫ്ലാഷ്, പൊഗോ, സ്നേക്ക്', 
        descKn: 'ಕಲರ್ ಶವರ್, ಫೋಟೋ ಫ್ಲ್ಯಾಶ್, ಪೊಗೊ, ಸ್ನೇಕ್', 
        image: 'assets/images/sparklers.jpg' 
    }
];

const INITIAL_PRODUCTS = [
    // --- Flowerpots ---
    {
        id: 'fp-01',
        nameEn: 'Flower Pot Big',
        nameTa: 'பூந்தொட்டி பிக் (Flower Pot Big)',
        nameHi: 'बड़ा अनार (Flower Pot Big)',
        nameTe: 'ఫ్లవర్ పాట్స్ బిగ్ (Flower Pot Big)',
        nameMl: 'ഫ്ലവർ പോട്സ് ബിഗ് (Flower Pot Big)',
        nameKn: 'ಹೂಕುಂಡ ಬಿಗ್ (Flower Pot Big)',
        company: 'KALIS',
        category: 'flower_pots',
        price: '₹70',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/flower_pots.jpg',
        descriptionEn: 'Classic high golden fountain shooting 6 to 8 feet high into the sky.',
        descriptionTa: 'தங்க மழை போல் உயரமாக பீறிட்டு எரியும் பூந்தொட்டி.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'fp-02',
        nameEn: 'Flower Pot Special',
        nameTa: 'பூந்தொட்டி ஸ்பெஷல் (Flower Pot Special)',
        nameHi: 'स्पेशल अनार (Flower Pot Special)',
        nameTe: 'ఫ్లవర్ పాట్స్ స్పెషల్ (Flower Pot Special)',
        nameMl: 'ഫ്ലവർ പോട്സ് സ്പെഷ്യൽ (Flower Pot Special)',
        nameKn: 'ಹೂಕುಂಡ ಸ್ಪೆಷಲ್ (Flower Pot Special)',
        company: 'KALIS',
        category: 'flower_pots',
        price: '₹95',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/flower_pots.jpg',
        descriptionEn: 'Dense silver and golden sparkle fountain with higher reach.',
        descriptionTa: 'அழகான வெள்ளி மற்றும் தங்க நிறத்தில் உயர்ந்து எரியும் பூந்தொட்டி.',
        isFeatured: false,
        isAvailable: true
    },
    {
        id: 'fp-03',
        nameEn: 'Flower Pot Ashoka',
        nameTa: 'பூந்தொட்டி அசோகா (Flower Pot Ashoka)',
        nameHi: 'अशोका अनार (Flower Pot Ashoka)',
        nameTe: 'అశోక చిచ్చుబుడ్లు (Flower Pot Ashoka)',
        nameMl: 'അശോക ഫ്ലവർ പോട്സ് (Flower Pot Ashoka)',
        nameKn: 'ಅಶೋಕ ಹೂಕುಂಡ (Flower Pot Ashoka)',
        company: 'KALIS',
        category: 'flower_pots',
        price: '₹140',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/flower_pots.jpg',
        descriptionEn: 'Multi-coloured shower fountain with impressive spread and duration.',
        descriptionTa: 'பல வண்ணங்களில் வானுயர பீறிடும் ஸ்பெஷல் அசோகா பூந்தொட்டி.',
        isFeatured: true,
        isAvailable: true
    },

    // --- Ground Chakkars ---
    {
        id: 'gc-01',
        nameEn: 'Ground Chakkar Big (10 Pcs)',
        nameTa: 'தரைச்சக்கரம் பிக் (10 Pcs)',
        nameHi: 'बड़ी चकरी (Ground Chakkar Big)',
        nameTe: 'గ్రౌండ్ చక్కర్ బిగ్ (Ground Chakkar Big)',
        nameMl: 'ഗ്രൗണ്ട് ചക്രം ബിഗ് (Ground Chakkar Big)',
        nameKn: 'ನೆಲಚಕ್ರ ಬಿಗ್ (Ground Chakkar Big)',
        company: 'KALIS',
        category: 'ground_chakkars',
        price: '₹40',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/ground_chakkars.jpg',
        descriptionEn: 'High-speed spinning wheel producing a circular ring of golden fire.',
        descriptionTa: 'தரையில் அதிவேகமாக சுழன்று வட்ட வடிவ தங்க ஒளி வளையத்தை உருவாக்கும்.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'rkt-rb',
        nameEn: 'Rocket Bomb',
        nameTa: 'ராக்கெட் பாம் (Rocket Bomb)',
        nameHi: 'रॉकेट बम (Rocket Bomb)',
        nameTe: 'రాకెట్ బాంబ్ (Rocket Bomb)',
        nameMl: 'റോക്കറ്റ് ബോംബ് (Rocket Bomb)',
        nameKn: 'ರಾಕೆಟ್ ಬಾಂಬ್ (Rocket Bomb)',
        company: 'S.KALA',
        category: 'sky_rockets',
        price: '₹70',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/sky_rockets.jpg',
        descriptionEn: 'Classic high-altitude whistle rocket with a crisp explosive sound aloft.',
        descriptionTa: 'வானத்தில் சீறிப்பாய்ந்து பலத்த சத்தத்துடன் வெடிக்கும் ராக்கெட் பாம்.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'spk-10ele',
        nameEn: '10 CM Electric Sparkler',
        nameTa: '10 செ.மீ எலெக்ட்ரிக் மத்தாப்பு (10 CM Electric Sparkler)',
        nameHi: '10 सेमी इलेक्ट्रिक फुलझड़ी (10 CM Electric Sparkler)',
        nameTe: '10 సెం.மீ ఎలెక్ట్రిక్ (10 CM Electric Sparkler)',
        nameMl: '10 സെ.മീ ഇലക്ട്രിക് (10 CM Electric Sparkler)',
        nameKn: '10 ಸೆಂ.ಮೀ ಎಲೆಕ್ಟ್ರಿಕ್ (10 CM Electric Sparkler)',
        company: 'KALIS',
        category: 'sparklers',
        price: '₹20',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/sparklers.jpg',
        descriptionEn: 'Bright golden and silver electric sparklers safe for families and children.',
        descriptionTa: 'குழந்தைகள் பாதுகாப்பாக பிடித்து விளையாடக்கூடிய சிவகாசி எலெக்ட்ரிக் மத்தாப்பு.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'os-kuruvi',
        nameEn: '2 3/4" Kuruvi',
        nameTa: '2 ¾ குருவி வெடி (2 3/4" Kuruvi)',
        nameHi: '2 ¾ कुरुवी पटाखे (2 3/4" Kuruvi)',
        nameTe: '2 ¾ కురువి టపాసులు (2 3/4" Kuruvi)',
        nameMl: '2 ¾ കുരുവി പടക്കം (2 3/4" Kuruvi)',
        nameKn: '2 ¾ ಕುರುವಿ ಪಟಾಕಿ (2 3/4" Kuruvi)',
        company: 'STANDARD',
        category: 'one_sound',
        price: '₹9',
        packSize: '1 Pkt (5 Pcs)',
        packSizeTa: '1 பாக்கெட் (5 வெடிகள்)',
        image: 'assets/images/sound_crackers.jpg',
        descriptionEn: 'Traditional pocket sound cracker with a sharp, crisp morning bang.',
        descriptionTa: 'தீபாவளி காலை வழிபாட்டிற்குரிய பாரம்பரிய சிவகாசி குருவி வெடி.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'snd-28chorsa',
        nameEn: '28 Chorsa',
        nameTa: '28 சோரசா பாரம்பரிய வெடி (28 Chorsa)',
        nameHi: '28 चोर्सा पटाखे (28 Chorsa)',
        nameTe: '28 చోర్సా టపాసులు (28 Chorsa)',
        nameMl: '28 ചോർസ പടക്കം (28 Chorsa)',
        nameKn: '28 ಚೋರ್ಸಾ ಪಟಾಕಿ (28 Chorsa)',
        company: 'KALIS',
        category: 'one_sound',
        price: '₹20',
        packSize: '1 Pkt (28 Pcs)',
        packSizeTa: '1 பாக்கெட் (28 வெடிகள்)',
        image: 'assets/images/sound_crackers.jpg',
        descriptionEn: 'Traditional 28-piece red cracker string for auspicious morning festivities.',
        descriptionTa: 'தீபாவளி அதிகாலை பூஜைக்குரிய 28 வெடிகள் கொண்ட பாரம்பரிய சரவெடி.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'bj-red',
        nameEn: 'Red Bijili (50 Pcs)',
        nameTa: 'சிவப்பு பிஜிலி (Red Bijili 50 Pcs)',
        nameHi: 'लाल बिजली (Red Bijili 50 Pcs)',
        nameTe: 'రెడ్ బిజిలీ (Red Bijili 50 Pcs)',
        nameMl: 'ചുവന്ന ബിജിലി (Red Bijili 50 Pcs)',
        nameKn: 'ಕೆಂಪು ಬಿಜಿಲಿ (Red Bijili 50 Pcs)',
        company: 'STANDARD',
        category: 'bijili',
        price: '₹20',
        packSize: '1 Pkt (50 Pcs)',
        packSizeTa: '1 பாக்கெட் (50 வெடிகள்)',
        image: 'assets/images/sound_crackers.jpg',
        descriptionEn: 'Fast-firing classic red bijili crackers with energetic crackling rhythm.',
        descriptionTa: 'வேகமாக வெடிக்கும் பாரம்பரிய சிவகாசி சிவப்பு பிஜிலி வெடிகள்.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'sky-7shot',
        nameEn: '7 Shot Repeater',
        nameTa: '7 ஷாட்ஸ் ரிபீட்டர் (7 Shot Repeater)',
        nameHi: '7-शॉट्स स्काई रिपीटर (7 Shot Repeater)',
        nameTe: '7 షాట్స్ స్కై రిపీటర్ (7 Shot Repeater)',
        nameMl: '7 ഷോട്ട്സ് സ്കൈ റിപ്പീറ്റർ (7 Shot Repeater)',
        nameKn: '7 ಶಾಟ್ಸ್ ಸ್ಕೈ ರಿಪೀಟರ್ (7 Shot Repeater)',
        company: 'KALIS',
        category: 'sky_shots',
        price: '₹120',
        packSize: '1 Piece (7 Shots)',
        packSizeTa: '1 பீஸ் (7 ஷாட்ஸ்)',
        image: 'assets/images/sky_shots.jpg',
        descriptionEn: 'Fires 7 high-altitude coloured shots sequentially into the night sky.',
        descriptionTa: 'ஒன்றன் பின் ஒன்றாக 7 வண்ண வெடிகள் வானில் சென்று விரியும்.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'gc-02',
        nameEn: 'Ground Chakkar Special (Deluxe)',
        nameTa: 'தரைச்சக்கரம் ஸ்பெஷல் (டீலக்ஸ்)',
        nameHi: 'स्पेशल डीलक्स चकरी',
        nameTe: 'గ్రౌండ్ చక్కర్ స్పెషల్',
        nameMl: 'ഗ്രൗണ്ട് ചക്രം സ്പെഷ്യൽ',
        nameKn: 'ನೆಲಚಕ್ರ ಸ್ಪೆಷಲ್',
        company: 'KALIS',
        category: 'ground_chakkars',
        price: '₹110',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/ground_chakkars.jpg',
        descriptionEn: 'Longer spinning duration with wide circular spark spread.',
        descriptionTa: 'அதிக நேரம் சுழன்று பரவலான வண்ண ஒளியை வீசும் டீலக்ஸ் சக்கரம்.',
        isFeatured: false,
        isAvailable: true
    },
    {
        id: 'gc-03',
        nameEn: 'Plastic Whirling Wheel (Red & Green)',
        nameTa: 'பிளாஸ்டிக் சுழல் சக்கரம் (சிவப்பு & பச்சை)',
        nameHi: 'प्लास्टिक व्हीलिंग चकरी (लाल व हरा)',
        nameTe: 'ప్లాస్టిక్ స్పిన్నింగ్ చక్రం',
        nameMl: 'പ്ലാസ്റ്റിക് വീലിംഗ് ചക്രം',
        nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಸ್ಪಿನ್ನಿಂಗ್ ನೆಲಚಕ್ರ',
        company: 'KALIS',
        category: 'ground_chakkars',
        price: '₹150',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/ground_chakkars.jpg',
        descriptionEn: 'Ultra-smooth spin encased in safety plastic casing with dual colour glow.',
        descriptionTa: 'பிளாஸ்டிக் பேக்கிங்கில் சிவப்பு மற்றும் பச்சை நிறத்தில் சுழலும் நவீன சக்கரம்.',
        isFeatured: false,
        isAvailable: true
    },

    // --- Rockets & Sky Flyers ---
    {
        id: 'rkt-01',
        nameEn: 'Baby Rocket',
        nameTa: 'பேபி ராக்கெட்',
        nameHi: 'बेबी रॉकेट (Baby Rocket)',
        nameTe: 'బేబీ రాకెట్',
        nameMl: 'ബേബി റോക്കറ്റ്',
        nameKn: 'ಬೇಬಿ ರಾಕೆಟ್',
        company: 'KALIS',
        category: 'sky_rockets',
        price: '₹65',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/sky_rockets.jpg',
        descriptionEn: 'Shoots straight into the sky with a sharp whizz and single bang.',
        descriptionTa: 'நேராக வானில் பாய்ந்து சென்று வெடிக்கும் கிளாசிக் பேபி ராக்கெட்.',
        isFeatured: false,
        isAvailable: true
    },
    {
        id: 'rkt-02',
        nameEn: 'Lunik / Whistling Rocket',
        nameTa: 'விசிலிங் ராக்கெட்',
        nameHi: 'विसलिंग रॉकेट (Whistling Rocket)',
        nameTe: 'విజిల్ రాకెట్',
        nameMl: 'വിസിലിംഗ് റോക്കറ്റ്',
        nameKn: 'ವಿಸ್ಲಿಂಗ್ ರಾಕೆಟ್',
        company: 'KALIS',
        category: 'sky_rockets',
        price: '₹130',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/sky_rockets.jpg',
        descriptionEn: 'Ascends with a loud, melodious whistle ending with a vibrant star burst.',
        descriptionTa: 'விசில் சத்தத்துடன் சீறிப்பாய்ந்து வானில் வண்ண நட்சத்திரமாய் வெடிக்கும்.',
        isFeatured: true,
        isAvailable: true
    },

    // --- Sound & Garland Crackers ---
    {
        id: 'snd-01',
        nameEn: '28 Chorsa Traditional Crackers',
        nameTa: '28 சோரசா பாரம்பரிய வெடி',
        nameHi: '28 चोर्सा पारंपरिक पटाखे',
        nameTe: '28 చోర్సా సాంప్రదాయ టపాసులు',
        nameMl: '28 ചോർസ പരമ്പരാഗത പടക്കം',
        nameKn: '28 ಚೋರ್ಸಾ ಸಾಂಪ್ರದಾಯಿಕ ಪಟಾಕಿ',
        company: 'KALIS',
        category: 'sound_crackers',
        price: '₹35',
        packSize: '1 Pkt (28 Pcs)',
        packSizeTa: '1 பாக்கெட் (28 வெடிகள்)',
        image: 'assets/images/sound_crackers.jpg',
        descriptionEn: 'Traditional 28-piece red cracker string for auspicious morning festivities.',
        descriptionTa: 'தீபாவளி அதிகாலை பூஜைக்குரிய 28 வெடிகள் கொண்ட பாரம்பரிய சரவெடி.',
        isFeatured: false,
        isAvailable: true
    },
    {
        id: 'snd-02',
        nameEn: '100 Wala Red Garland (Wala Saram)',
        nameTa: '100 வாலா சரவெடி மாலை',
        nameHi: '100 वाला लड़ी (Wala Garland)',
        nameTe: '100 వాలా లడీ (మాల)',
        nameMl: '100 വാല മാല പടക്കം',
        nameKn: '100 ವಾಲಾ ಪಟಾಕಿ ಸರ',
        company: 'KALIS',
        category: 'sound_crackers',
        price: '₹95',
        packSize: '1 Roll',
        packSizeTa: '1 ரோல்',
        image: 'assets/images/sound_crackers.jpg',
        descriptionEn: 'Continuous 100-shot rhythmic cracker string with loud concluding cracker.',
        descriptionTa: 'தொடர்ந்து 100 முறை வெடித்து அதிரவைக்கும் சிவகாசி தரமான சரவெடி.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'snd-03',
        nameEn: 'Hydro Bomb (Green / Red)',
        nameTa: 'ஹைட்ரோ பாம் (பச்சை / சிவப்பு)',
        nameHi: 'हाइड्रो बम (धमाकेदार)',
        nameTe: 'హైడ్రో బాంబ్ (భారీ శబ్దం)',
        nameMl: 'ഹൈഡ്രോ ബോംബ്',
        nameKn: 'ಹೈಡ್ರೋ ಬಾಂಬ್',
        company: 'KALIS',
        category: 'sound_crackers',
        price: '₹80',
        packSize: '1 Box (10 Pcs)',
        packSizeTa: '1 பாக்ஸ் (10 எண்ணிக்கைகள்)',
        image: 'assets/images/sound_crackers.jpg',
        descriptionEn: 'Heavy bass, intense reverberating sound for powerful celebration impact.',
        descriptionTa: 'அதிர வைக்கும் பலத்த சத்தத்தை தரும் சிவகாசி ஹைட்ரோ பாம்.',
        isFeatured: true,
        isAvailable: true
    },

    // --- Sky Shots & Cakes ---
    {
        id: 'sky-01',
        nameEn: '7-Shot Multi-Colour Sky Repeater',
        nameTa: '7 ஷாட்ஸ் வண்ண வான்வேடிக்கை',
        nameHi: '7-शॉट्स रंगीन स्काई रिपीटर',
        nameTe: '7 షాట్స్ కలర్ స్కై రిపీటర్',
        nameMl: '7 ഷോട്ട്സ് കളർ സ്കൈ റിപ്പീറ്റർ',
        nameKn: '7 ಶಾಟ್ಸ್ ಬಣ್ಣದ ಸ್ಕೈ ರಿಪೀಟರ್',
        company: 'KALIS',
        category: 'sky_shots',
        price: '₹175',
        packSize: '1 Piece (7 Shots)',
        packSizeTa: '1 பீஸ் (7 ஷாட்ஸ்)',
        image: 'assets/images/sky_shots.jpg',
        descriptionEn: 'Fires 7 high-altitude coloured shots sequentially into the night sky.',
        descriptionTa: 'ஒன்றன் பின் ஒன்றாக 7 வண்ண வெடிகள் வானில் சென்று விரியும்.',
        isFeatured: false,
        isAvailable: true
    },
    {
        id: 'sky-02',
        nameEn: '12-Shot Aerial Cake Multi-Effect',
        nameTa: '12 ஷாட்ஸ் வான்வேடிக்கை கேக்',
        nameHi: '12-शॉट्स एरियल केक',
        nameTe: '12 షాట్స్ ఏరియల్ కేక్',
        nameMl: '12 ഷോട്ട്സ് ഏരിയൽ കേക്ക്',
        nameKn: '12 ಶಾಟ್ಸ್ ಏರಿಯಲ್ ಕೇಕ್',
        company: 'KALIS',
        category: 'sky_shots',
        price: '₹340',
        packSize: '1 Box Cake (12 Shots)',
        packSizeTa: '1 பாக்ஸ் (12 ஷாட்ஸ்)',
        image: 'assets/images/sky_shots.jpg',
        descriptionEn: 'Single-fuse automatic 12-shot aerial show with golden brocade and palms.',
        descriptionTa: 'ஒரே திரியில் வானில் 12 முறை வண்ணமயமாக பூக்கும் இரவு வான்வேடிக்கை கேக்.',
        isFeatured: true,
        isAvailable: true
    },
    {
        id: 'sky-03',
        nameEn: '25-Shot Grand Sky Symphony Cake',
        nameTa: '25 ஷாட்ஸ் கிராண்ட் ஸ்கை சிம்பொனி',
        nameHi: '25-शॉट्स ग्रैंड स्काई सिम्फनी',
        nameTe: '25 షాట్స్ గ్రాండ్ స్కై సింఫనీ',
        nameMl: '25 ഷോട്ട്സ് ഗ്രാൻഡ് സ്കൈ സിംഫണി',
        nameKn: '25 ಶಾಟ್ಸ್ ಗ್ರಾಂಡ್ ಸ್ಕೈ ಸಿಂಫನಿ',
        company: 'KALIS',
        category: 'sky_shots',
        price: '₹680',
        packSize: '1 Box Cake (25 Shots)',
        packSizeTa: '1 பாக்ஸ் (25 ஷாட்ஸ்)',
        image: 'assets/images/sky_shots.jpg',
        descriptionEn: 'Professional-grade 25-shot aerial spectacle with multi-colour bouquets and willow tails.',
        descriptionTa: 'வானத்தை வண்ணமயமாக்கும் 25 ஷாட்ஸ் கொண்ட பிரம்மாண்ட வானவேடிக்கை தொகுப்பு.',
        isFeatured: true,
        isAvailable: true
    }
];

// Official ECHO Gift Boxes – City Series (5 boxes as per PRANAV CRACKERS advertisement)
const INITIAL_GIFT_BOXES = [
    {
        id: 'gb-italy',
        city: 'ITALY',
        nameEn: 'ITALY',
        nameTa: 'இத்தாலி (Italy)',
        nameHi: 'इटली (Italy)',
        nameTe: 'ఇటలీ (Italy)',
        nameMl: 'ഇറ്റലി (Italy)',
        nameKn: 'ಇಟಲಿ (Italy)',
        itemCountNumber: 35,
        itemCount: '35 Items',
        itemCountTa: '35 பொருட்கள்',
        filterGroup: '35-50',
        category: 'gift_boxes',
        price: '₹700', // Verified PRANAV Price
        descriptionEn: '35-item deluxe assortment featuring Special Pots, Deluxe Chakkars, Drone Butterfly and Siren Bombs.',
        descriptionTa: '35 பிரத்யேக ரகங்கள் அடங்கிய டீலக்ஸ் கிஃப்ட் பாக்ஸ்.',
        image: 'assets/images/gift_box.jpg',
        isAvailable: true,
        contents: [
            { no: '01', name: 'Flower Pot Big (5 Pcs)', qty: '1 Box' },
            { no: '02', name: 'Flower Pot Special (5 Pcs)', qty: '1 Box' },
            { no: '03', name: 'Flower Pot Ashoka (5 Pcs)', qty: '1 Box' },
            { no: '04', name: 'Ground Chakkar Big (5 Pcs)', qty: '1 Box' },
            { no: '05', name: 'Ground Chakkar Special (5 Pcs)', qty: '1 Box' },
            { no: '06', name: 'Ground Chakkar Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '07', name: '7 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '08', name: '7 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '09', name: '7 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '10', name: '10 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '11', name: '10 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '12', name: '10 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '13', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '14', name: 'Pogo (5 Pcs)', qty: '1 Box' },
            { no: '15', name: 'Red Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '16', name: 'Striped Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '17', name: 'Kuruvi (5 Pcs)', qty: '1 Pkt' },
            { no: '18', name: 'Bullet Bomb (10 Pcs)', qty: '1 Box' },
            { no: '19', name: 'Hydro Bomb (5 Pcs)', qty: '1 Box' },
            { no: '20', name: 'Siren Bomb (5 Pcs)', qty: '1 Box' },
            { no: '21', name: 'Colour Shower (5 Pcs)', qty: '1 Box' },
            { no: '22', name: 'Photo Flash (5 Pcs)', qty: '1 Box' },
            { no: '23', name: 'Selfie Stick (10 Pcs)', qty: '1 Box' },
            { no: '24', name: 'Peacock Feather (5 Pcs)', qty: '1 Box' },
            { no: '25', name: 'Cartoon (10 Pcs)', qty: '1 Box' },
            { no: '26', name: 'Colour Pops (10 Pcs)', qty: '1 Box' },
            { no: '27', name: 'Drone Butterfly (5 Pcs)', qty: '1 Box' },
            { no: '28', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '29', name: '2 3/4" One Sound Cracker (5 Pcs)', qty: '1 Pkt' },
            { no: '30', name: '28 Giant Crackers', qty: '1 Pkt' },
            { no: '31', name: '28 Chorsa Crackers', qty: '1 Pkt' },
            { no: '32', name: '50 Wala Garland', qty: '1 Roll' },
            { no: '33', name: 'Baby Rocket (10 Pcs)', qty: '1 Box' },
            { no: '34', name: 'Lunik Rocket (10 Pcs)', qty: '1 Box' },
            { no: '35', name: '7 Shot Repeater (1 Pc)', qty: '1 Box' }
        ]
    },
    {
        id: 'gb-singapore',
        city: 'SINGAPORE',
        nameEn: 'SINGAPORE',
        nameTa: 'சிங்கப்பூர் (Singapore)',
        nameHi: 'सिंगापुर (Singapore)',
        nameTe: 'సింగపూర్ (Singapore)',
        nameMl: 'സിംഗപ്പൂർ (Singapore)',
        nameKn: 'ಸಿಂಗಾಪುರ (Singapore)',
        itemCountNumber: 40,
        itemCount: '40 Items',
        itemCountTa: '40 பொருட்கள்',
        filterGroup: '35-50',
        category: 'gift_boxes',
        price: '₹850', // Verified PRANAV Price
        descriptionEn: '40-item luxury selection with 12cm Sparklers, Lunik Rockets, 2" Flower Pots and 50 Wala Garland.',
        descriptionTa: '40 வகை பட்டாசுகள் கொண்ட பிரம்மாண்ட கிஃப்ட் பாக்ஸ்.',
        image: 'assets/images/gift_box.jpg',
        isAvailable: true,
        contents: [
            { no: '01', name: 'Flower Pot Big (5 Pcs)', qty: '1 Box' },
            { no: '02', name: 'Flower Pot Special (5 Pcs)', qty: '1 Box' },
            { no: '03', name: 'Flower Pot Ashoka (5 Pcs)', qty: '1 Box' },
            { no: '04', name: 'Flower Pot 2" Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '05', name: 'Ground Chakkar Big (5 Pcs)', qty: '1 Box' },
            { no: '06', name: 'Ground Chakkar Special (5 Pcs)', qty: '1 Box' },
            { no: '07', name: 'Ground Chakkar Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '08', name: '7 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '09', name: '7 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '10', name: '7 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '11', name: '10 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '12', name: '10 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '13', name: '10 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '14', name: '12 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '15', name: '12 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '16', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '17', name: 'Pogo (5 Pcs)', qty: '1 Box' },
            { no: '18', name: 'Red Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '19', name: 'Striped Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '20', name: 'Kuruvi (5 Pcs)', qty: '1 Pkt' },
            { no: '21', name: 'Bullet Bomb (10 Pcs)', qty: '1 Box' },
            { no: '22', name: 'Hydro Bomb (5 Pcs)', qty: '1 Box' },
            { no: '23', name: 'Siren Bomb (5 Pcs)', qty: '1 Box' },
            { no: '24', name: 'Colour Shower (5 Pcs)', qty: '1 Box' },
            { no: '25', name: 'Photo Flash (5 Pcs)', qty: '1 Box' },
            { no: '26', name: 'Selfie Stick (10 Pcs)', qty: '1 Box' },
            { no: '27', name: 'Peacock Feather (5 Pcs)', qty: '1 Box' },
            { no: '28', name: 'Cartoon (10 Pcs)', qty: '1 Box' },
            { no: '29', name: 'Colour Pops (10 Pcs)', qty: '1 Box' },
            { no: '30', name: 'Drone Butterfly (5 Pcs)', qty: '1 Box' },
            { no: '31', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '32', name: '2 3/4" One Sound Cracker (5 Pcs)', qty: '1 Pkt' },
            { no: '33', name: '28 Giant Crackers', qty: '1 Pkt' },
            { no: '34', name: '28 Chorsa Crackers', qty: '1 Pkt' },
            { no: '35', name: '50 Wala Garland', qty: '1 Roll' },
            { no: '36', name: 'Baby Rocket (10 Pcs)', qty: '1 Box' },
            { no: '37', name: 'Lunik Rocket (10 Pcs)', qty: '1 Box' },
            { no: '38', name: 'Whistling Rocket (10 Pcs)', qty: '1 Box' },
            { no: '39', name: '7 Shot Repeater (1 Pc)', qty: '1 Box' },
            { no: '40', name: 'Popping Candy Novelty (10 Pcs)', qty: '1 Box' }
        ]
    },
    {
        id: 'gb-dubai',
        city: 'DUBAI',
        nameEn: 'DUBAI',
        nameTa: 'துபாய் (Dubai)',
        nameHi: 'दुबई (Dubai)',
        nameTe: 'దుబాయ్ (Dubai)',
        nameMl: 'ദുബായ് (Dubai)',
        nameKn: 'ದುಬೈ (Dubai)',
        itemCountNumber: 50,
        itemCount: '50 Items',
        itemCountTa: '50 பொருட்கள்',
        filterGroup: '35-50',
        category: 'gift_boxes',
        price: '₹1,000', // Verified PRANAV Price
        descriptionEn: '50-item grand collection with 15cm Sparklers, 7-Shot Sky Repeaters, Whistling Rockets, and 100 Wala Garland.',
        descriptionTa: '50 அதிநவீன வெடிகள் அடங்கிய பிரம்மாண்ட தீபாவளி கிஃப்ட் பாக்ஸ்.',
        image: 'assets/images/gift_box.jpg',
        isAvailable: true,
        contents: [
            { no: '01', name: 'Flower Pot Big (5 Pcs)', qty: '1 Box' },
            { no: '02', name: 'Flower Pot Special (5 Pcs)', qty: '1 Box' },
            { no: '03', name: 'Flower Pot Ashoka (5 Pcs)', qty: '1 Box' },
            { no: '04', name: 'Flower Pot 2" Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '05', name: 'Flower Pot Colour (5 Pcs)', qty: '1 Box' },
            { no: '06', name: 'Ground Chakkar Big (5 Pcs)', qty: '1 Box' },
            { no: '07', name: 'Ground Chakkar Special (5 Pcs)', qty: '1 Box' },
            { no: '08', name: 'Ground Chakkar Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '09', name: 'Ground Chakkar Plastic Wheel (5 Pcs)', qty: '1 Box' },
            { no: '10', name: '7 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '11', name: '7 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '12', name: '7 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '13', name: '10 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '14', name: '10 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '15', name: '10 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '16', name: '12 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '17', name: '12 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '18', name: '15 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '19', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '20', name: 'Pogo (5 Pcs)', qty: '1 Box' },
            { no: '21', name: 'Red Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '22', name: 'Striped Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '23', name: 'Kuruvi (5 Pcs)', qty: '1 Pkt' },
            { no: '24', name: 'Bullet Bomb (10 Pcs)', qty: '1 Box' },
            { no: '25', name: 'Hydro Bomb (5 Pcs)', qty: '1 Box' },
            { no: '26', name: 'Siren Bomb (5 Pcs)', qty: '1 Box' },
            { no: '27', name: 'King Bomb (5 Pcs)', qty: '1 Box' },
            { no: '28', name: 'Colour Shower (5 Pcs)', qty: '1 Box' },
            { no: '29', name: 'Photo Flash (5 Pcs)', qty: '1 Box' },
            { no: '30', name: 'Selfie Stick (10 Pcs)', qty: '1 Box' },
            { no: '31', name: 'Peacock Feather (5 Pcs)', qty: '1 Box' },
            { no: '32', name: 'Cartoon (10 Pcs)', qty: '1 Box' },
            { no: '33', name: 'Colour Pops (10 Pcs)', qty: '1 Box' },
            { no: '34', name: 'Drone Butterfly (5 Pcs)', qty: '1 Box' },
            { no: '35', name: 'Magic Whip (10 Pcs)', qty: '1 Box' },
            { no: '36', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '37', name: '2 3/4" One Sound Cracker (5 Pcs)', qty: '1 Pkt' },
            { no: '38', name: '28 Giant Crackers', qty: '1 Pkt' },
            { no: '39', name: '28 Chorsa Crackers', qty: '1 Pkt' },
            { no: '40', name: '50 Wala Garland', qty: '1 Roll' },
            { no: '41', name: '100 Wala Garland', qty: '1 Roll' },
            { no: '42', name: 'Baby Rocket (10 Pcs)', qty: '1 Box' },
            { no: '43', name: 'Lunik Rocket (10 Pcs)', qty: '1 Box' },
            { no: '44', name: 'Whistling Rocket (10 Pcs)', qty: '1 Box' },
            { no: '45', name: 'Parachute Rocket (5 Pcs)', qty: '1 Box' },
            { no: '46', name: '7 Shot Repeater (1 Pc)', qty: '1 Box' },
            { no: '47', name: '12 Shot Sky Cake (1 Pc)', qty: '1 Box' },
            { no: '48', name: 'Popping Candy Novelty (10 Pcs)', qty: '1 Box' },
            { no: '49', name: 'Smoke Fountain (5 Pcs)', qty: '1 Box' },
            { no: '50', name: 'Tri Colour Fountain (5 Pcs)', qty: '1 Box' }
        ]
    },
    {
        id: 'gb-paris',
        city: 'PARIS',
        nameEn: 'PARIS',
        nameTa: 'பாரிஸ் (Paris)',
        nameHi: 'पेरिस (Paris)',
        nameTe: 'ప్యారిస్ (Paris)',
        nameMl: 'പാരീസ് (Paris)',
        nameKn: 'ಪ್ಯಾರಿಸ್ (Paris)',
        itemCountNumber: 60,
        itemCount: '60 Items',
        itemCountTa: '60 பொருட்கள்',
        filterGroup: '60-70',
        category: 'gift_boxes',
        price: '₹1,250', // Verified PRANAV Price
        descriptionEn: '60-item royal festive assortment including 12-Shot Aerial Cake, Parachute Rockets, 30cm Giant Sparklers and 200 Wala Garland.',
        descriptionTa: '60 ரகங்கள் கொண்ட பிரம்மாண்ட ராயல் தீபாவளி கிஃப்ட் பாக்ஸ்.',
        image: 'assets/images/gift_box.jpg',
        isAvailable: true,
        contents: [
            { no: '01', name: 'Flower Pot Big (5 Pcs)', qty: '1 Box' },
            { no: '02', name: 'Flower Pot Special (5 Pcs)', qty: '1 Box' },
            { no: '03', name: 'Flower Pot Ashoka (5 Pcs)', qty: '1 Box' },
            { no: '04', name: 'Flower Pot 2" Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '05', name: 'Flower Pot Colour (5 Pcs)', qty: '1 Box' },
            { no: '06', name: 'Ground Chakkar Big (5 Pcs)', qty: '1 Box' },
            { no: '07', name: 'Ground Chakkar Special (5 Pcs)', qty: '1 Box' },
            { no: '08', name: 'Ground Chakkar Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '09', name: 'Ground Chakkar Plastic Wheel (5 Pcs)', qty: '1 Box' },
            { no: '10', name: '7 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '11', name: '7 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '12', name: '7 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '13', name: '10 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '14', name: '10 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '15', name: '10 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '16', name: '12 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '17', name: '12 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '18', name: '15 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '19', name: '30 CM Giant Sparkler (5 Pcs)', qty: '1 Box' },
            { no: '20', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '21', name: 'Pogo (5 Pcs)', qty: '1 Box' },
            { no: '22', name: 'Red Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '23', name: 'Striped Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '24', name: 'Kuruvi (5 Pcs)', qty: '1 Pkt' },
            { no: '25', name: 'Bullet Bomb (10 Pcs)', qty: '1 Box' },
            { no: '26', name: 'Hydro Bomb (5 Pcs)', qty: '1 Box' },
            { no: '27', name: 'Siren Bomb (5 Pcs)', qty: '1 Box' },
            { no: '28', name: 'King Bomb (5 Pcs)', qty: '1 Box' },
            { no: '29', name: 'Mega Atom Bomb (5 Pcs)', qty: '1 Box' },
            { no: '30', name: 'Colour Shower (5 Pcs)', qty: '1 Box' },
            { no: '31', name: 'Photo Flash (5 Pcs)', qty: '1 Box' },
            { no: '32', name: 'Selfie Stick (10 Pcs)', qty: '1 Box' },
            { no: '33', name: 'Peacock Feather (5 Pcs)', qty: '1 Box' },
            { no: '34', name: 'Cartoon (10 Pcs)', qty: '1 Box' },
            { no: '35', name: 'Colour Pops (10 Pcs)', qty: '1 Box' },
            { no: '36', name: 'Drone Butterfly (5 Pcs)', qty: '1 Box' },
            { no: '37', name: 'Magic Whip (10 Pcs)', qty: '1 Box' },
            { no: '38', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '39', name: '2 3/4" One Sound Cracker (5 Pcs)', qty: '1 Pkt' },
            { no: '40', name: '3 1/2" One Sound Cracker (5 Pcs)', qty: '1 Pkt' },
            { no: '41', name: '28 Giant Crackers', qty: '1 Pkt' },
            { no: '42', name: '28 Chorsa Crackers', qty: '1 Pkt' },
            { no: '43', name: '50 Wala Garland', qty: '1 Roll' },
            { no: '44', name: '100 Wala Garland', qty: '1 Roll' },
            { no: '45', name: '200 Wala Garland', qty: '1 Roll' },
            { no: '46', name: 'Baby Rocket (10 Pcs)', qty: '1 Box' },
            { no: '47', name: 'Lunik Rocket (10 Pcs)', qty: '1 Box' },
            { no: '48', name: 'Whistling Rocket (10 Pcs)', qty: '1 Box' },
            { no: '49', name: 'Parachute Rocket (5 Pcs)', qty: '1 Box' },
            { no: '50', name: '7 Shot Repeater (1 Pc)', qty: '1 Box' },
            { no: '51', name: '12 Shot Sky Cake (1 Pc)', qty: '1 Box' },
            { no: '52', name: 'Popping Candy Novelty (10 Pcs)', qty: '1 Box' },
            { no: '53', name: 'Smoke Fountain (5 Pcs)', qty: '1 Box' },
            { no: '54', name: 'Tri Colour Fountain (5 Pcs)', qty: '1 Box' },
            { no: '55', name: 'Meteor Shower (5 Pcs)', qty: '1 Box' },
            { no: '56', name: 'Waterfall Fountain (2 Pcs)', qty: '1 Box' },
            { no: '57', name: 'Helicopter Rotor (5 Pcs)', qty: '1 Box' },
            { no: '58', name: 'Colour Matches (10 Boxes)', qty: '1 Pkt' },
            { no: '59', name: 'Golden Spinner (5 Pcs)', qty: '1 Box' },
            { no: '60', name: 'Special Aerial Peacock (1 Pc)', qty: '1 Box' }
        ]
    },
    {
        id: 'gb-germany',
        city: 'GERMANY',
        nameEn: 'GERMANY',
        nameTa: 'ஜெர்மனி (Germany)',
        nameHi: 'जर्मनी (Germany)',
        nameTe: 'జర్మనీ (Germany)',
        nameMl: 'ജർമ്മനി (Germany)',
        nameKn: 'ಜರ್ಮನಿ (Germany)',
        itemCountNumber: 70,
        itemCount: '70 Items',
        itemCountTa: '70 பொருட்கள்',
        filterGroup: '60-70',
        category: 'gift_boxes',
        price: '₹1,400', // Verified PRANAV Price
        descriptionEn: 'The supreme 70-item mega VIP collection featuring 25-Shot Grand Sky Symphony, Helicopter Flyers, 500 Wala Garland, and full festive assortments.',
        descriptionTa: '70 அதிநவீன மாஸ்டர் ரகங்கள் கொண்ட முழுமையான வி.ஐ.பி தீபாவளி கிஃப்ட் பாக்ஸ்.',
        image: 'assets/images/gift_box.jpg',
        isAvailable: true,
        contents: [
            { no: '01', name: 'Flower Pot Big (5 Pcs)', qty: '1 Box' },
            { no: '02', name: 'Flower Pot Special (5 Pcs)', qty: '1 Box' },
            { no: '03', name: 'Flower Pot Ashoka (5 Pcs)', qty: '1 Box' },
            { no: '04', name: 'Flower Pot 2" Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '05', name: 'Flower Pot Colour (5 Pcs)', qty: '1 Box' },
            { no: '06', name: 'Flower Pot Super Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '07', name: 'Ground Chakkar Big (5 Pcs)', qty: '1 Box' },
            { no: '08', name: 'Ground Chakkar Special (5 Pcs)', qty: '1 Box' },
            { no: '09', name: 'Ground Chakkar Deluxe (5 Pcs)', qty: '1 Box' },
            { no: '10', name: 'Ground Chakkar Plastic Wheel (5 Pcs)', qty: '1 Box' },
            { no: '11', name: '7 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '12', name: '7 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '13', name: '7 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '14', name: '10 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '15', name: '10 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '16', name: '10 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '17', name: '12 CM Electric Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '18', name: '12 CM Colour Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '19', name: '15 CM Green Sparkler (10 Pcs)', qty: '1 Box' },
            { no: '20', name: '30 CM Giant Sparkler (5 Pcs)', qty: '1 Box' },
            { no: '21', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '22', name: 'Pogo (5 Pcs)', qty: '1 Box' },
            { no: '23', name: 'Red Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '24', name: 'Striped Bijili (50 Pcs)', qty: '1 Pkt' },
            { no: '25', name: 'Kuruvi (5 Pcs)', qty: '1 Pkt' },
            { no: '26', name: 'Bullet Bomb (10 Pcs)', qty: '1 Box' },
            { no: '27', name: 'Hydro Bomb (5 Pcs)', qty: '1 Box' },
            { no: '28', name: 'Siren Bomb (5 Pcs)', qty: '1 Box' },
            { no: '29', name: 'King Bomb (5 Pcs)', qty: '1 Box' },
            { no: '30', name: 'Mega Atom Bomb (5 Pcs)', qty: '1 Box' },
            { no: '31', name: 'Colour Shower (5 Pcs)', qty: '1 Box' },
            { no: '32', name: 'Photo Flash (5 Pcs)', qty: '1 Box' },
            { no: '33', name: 'Selfie Stick (10 Pcs)', qty: '1 Box' },
            { no: '34', name: 'Peacock Feather (5 Pcs)', qty: '1 Box' },
            { no: '35', name: 'Cartoon (10 Pcs)', qty: '1 Box' },
            { no: '36', name: 'Colour Pops (10 Pcs)', qty: '1 Box' },
            { no: '37', name: 'Drone Butterfly (5 Pcs)', qty: '1 Box' },
            { no: '38', name: 'Magic Whip (10 Pcs)', qty: '1 Box' },
            { no: '39', name: '1 1/2" Twinkling Star (10 Pcs)', qty: '1 Box' },
            { no: '40', name: '2 3/4" One Sound Cracker (5 Pcs)', qty: '1 Pkt' },
            { no: '41', name: '3 1/2" One Sound Cracker (5 Pcs)', qty: '1 Pkt' },
            { no: '42', name: '28 Giant Crackers', qty: '1 Pkt' },
            { no: '43', name: '28 Chorsa Crackers', qty: '1 Pkt' },
            { no: '44', name: '50 Wala Garland', qty: '1 Roll' },
            { no: '45', name: '100 Wala Garland', qty: '1 Roll' },
            { no: '46', name: '200 Wala Garland', qty: '1 Roll' },
            { no: '47', name: '500 Wala Garland', qty: '1 Roll' },
            { no: '48', name: 'Baby Rocket (10 Pcs)', qty: '1 Box' },
            { no: '49', name: 'Lunik Rocket (10 Pcs)', qty: '1 Box' },
            { no: '50', name: 'Whistling Rocket (10 Pcs)', qty: '1 Box' },
            { no: '51', name: 'Parachute Rocket (5 Pcs)', qty: '1 Box' },
            { no: '52', name: '7 Shot Repeater (1 Pc)', qty: '1 Box' },
            { no: '53', name: '12 Shot Sky Cake (1 Pc)', qty: '1 Box' },
            { no: '54', name: '25 Shot Grand Sky Symphony (1 Pc)', qty: '1 Box' },
            { no: '55', name: 'Popping Candy Novelty (10 Pcs)', qty: '1 Box' },
            { no: '56', name: 'Smoke Fountain (5 Pcs)', qty: '1 Box' },
            { no: '57', name: 'Tri Colour Fountain (5 Pcs)', qty: '1 Box' },
            { no: '58', name: 'Meteor Shower (5 Pcs)', qty: '1 Box' },
            { no: '59', name: 'Waterfall Fountain (2 Pcs)', qty: '1 Box' },
            { no: '60', name: 'Helicopter Rotor (5 Pcs)', qty: '1 Box' },
            { no: '61', name: 'Colour Matches (10 Boxes)', qty: '1 Pkt' },
            { no: '62', name: 'Golden Spinner (5 Pcs)', qty: '1 Box' },
            { no: '63', name: 'Special Aerial Peacock (1 Pc)', qty: '1 Box' },
            { no: '64', name: 'Colour Snake Eggs (10 Pcs)', qty: '1 Box' },
            { no: '65', name: 'Flashing Diamonds (5 Pcs)', qty: '1 Box' },
            { no: '66', name: 'Electric Whistle Bomb (5 Pcs)', qty: '1 Box' },
            { no: '67', name: '3" Rainbow Fountain (2 Pcs)', qty: '1 Box' },
            { no: '68', name: 'Mega Chorsa Garland (1 Roll)', qty: '1 Roll' },
            { no: '69', name: 'Golden Shower Fountain (5 Pcs)', qty: '1 Box' },
            { no: '70', name: 'Diwali Night Sky Finale (1 Pc)', qty: '1 Box' }
        ]
    }
];

const INITIAL_SETTINGS = {
    brandName: 'PRANAV CRACKERS',
    brandMessage: 'Celebrate • Enjoy • Shine',
    taglineEn: 'Celebrate Brighter with PRANAV CRACKERS',
    subtitleEn: 'Premium Fireworks • Wholesale',
    location: 'Sivakasi, Tamil Nadu, India',
    website: 'pranavcrackers.com',
    email: 'crackerspranav@gmail.com',
    primaryPhone: '77085 32334',
    secondaryPhone: '97910 45933',
    primaryPhoneRaw: '917708532334',
    secondaryPhoneRaw: '919791045933',
    // TEST PHASE: WhatsApp number routes to test number only.
    // Switch to primaryPhoneRaw after testing is complete.
    whatsappPhone: '93857 87363',
    whatsappPhoneRaw: '919385787363',
    priceListPdfUrl: 'assets/pranav_crackers_price_list.pdf',
    adminPin: 'pranav123',
    upiId: 'pranavcrackers@upi',
    bankDetails: 'Bank: SBI Sivakasi | A/C: 1234567890 | IFSC: SBIN0000123'
};

class DataStore {
    static standardizeProductName(name) {
        if (!name || typeof name !== 'string') return '';
        let s = name.trim();

        // 1. Expand F.P / FP abbreviations
        s = s.replace(/\bF\.P\.?\b/gi, 'Flower Pot');
        s = s.replace(/\bFP\b/g, 'Flower Pot');

        // 2. Expand G.C / GC abbreviations
        s = s.replace(/\bG\.C\.?\b/gi, 'Ground Chakkar');
        s = s.replace(/\bGC\b/g, 'Ground Chakkar');

        // 3. Sparklers abbreviations (e.g. 10 CM ELE, 15 CM COL, 10 CM GREEN, 10 CM RED)
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

    static getCatalogueItems() {
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
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
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
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    static getGiftBoxes() {
        const data = localStorage.getItem(STORAGE_KEYS.GIFT_BOXES);
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
        localStorage.setItem(STORAGE_KEYS.GIFT_BOXES, JSON.stringify(giftBoxes));
    }

    static getCategories() {
        const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
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
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    static getSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!data) {
            this.setSettings(INITIAL_SETTINGS);
            return INITIAL_SETTINGS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return INITIAL_SETTINGS;
        }
    }

    static setSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
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
        const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
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
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
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
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            return orders[idx];
        }
        return null;
    }

    // --- Discount Requests Management ---
    static getDiscountRequests() {
        const data = localStorage.getItem(STORAGE_KEYS.DISCOUNTS);
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
        localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(requests));
        return req;
    }

    static updateDiscountRequest(requestId, updateFields) {
        const requests = this.getDiscountRequests();
        const idx = requests.findIndex(r => r.id === requestId);
        if (idx !== -1) {
            requests[idx] = { ...requests[idx], ...updateFields, updatedAt: new Date().toISOString() };
            localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(requests));
            return requests[idx];
        }
        return null;
    }

    static getPriceList() {
        const data = localStorage.getItem(STORAGE_KEYS.PRICE_LIST);
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
        localStorage.setItem(STORAGE_KEYS.PRICE_LIST, JSON.stringify(list));
    }

    static resetAll() {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.GIFT_BOXES);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        localStorage.removeItem(STORAGE_KEYS.PRICE_LIST);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.CART);
        localStorage.removeItem(STORAGE_KEYS.ORDERS);
        localStorage.removeItem(STORAGE_KEYS.DISCOUNTS);
        this.getProducts();
        this.getGiftBoxes();
        this.getCategories();
        this.getPriceList();
        this.getSettings();
    }
}
