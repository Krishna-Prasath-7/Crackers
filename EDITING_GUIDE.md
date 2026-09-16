# PRANAV CRACKERS — Quick & Easy Website Editing Guide 🎆

Welcome to your website maintenance guide! Everything has been organized into clear, dedicated data folders so you can add products, change prices, update WhatsApp numbers, or edit offers in seconds **without touching any complicated code**.

---

## 📁 Where Everything is Located (Folder Cheatsheet)

| What You Want to Edit | File to Open | Notes |
| :--- | :--- | :--- |
| **All Crackers & Prices** | `data/crackers/crackers.js` | Contains all 94 crackers, wholesale rates, MRP, availability & images |
| **WhatsApp & Phone Numbers** | `config/siteConfig.js` | Phone numbers, WhatsApp desk number, UPI & shop address |
| **Categories & Category Tabs** | `data/categories/categories.js` | Sparklers, Flower Pots, Ground Chakkars, Bombs, etc. |
| **Marketing & Website Text** | `data/siteContent/siteContent.js` | Announcement bar, hero headlines, trust badges & disclaimers |
| **Festival Offers & Slabs** | `data/offers/offers.js` | Early-bird discounts and bulk delivery perks |
| **Cracker Images** | `assets/crackers/` | Organized into subfolders by category |

---

## 1. How to Change a Cracker's Price 💰

1. Open `data/crackers/crackers.js`.
2. Press `Ctrl + F` and search for the cracker's name or serial number (`sNo`).
3. Change the `sellingPrice` and `originalPrice`:
   ```javascript
   {
       "id": "fp-01",
       "sNo": 1,
       "name": "Flower Pot Big",
       "category": "flower_pots",
       "originalPrice": 175,    // Retail MRP (shown crossed out)
       "sellingPrice": 70,      // Factory Wholesale Price (customer pays this)
       "discount": "60%",
       ...
   }
   ```
4. Save the file (`Ctrl + S`). Refresh your browser — the new price is live immediately!

---

## 2. How to Temporarily Hide an Out-of-Stock Cracker 🚫

You do **not** need to delete a product when it goes out of stock!

1. Open `data/crackers/crackers.js`.
2. Find the cracker.
3. Change `"availability": true` to `"availability": false`:
   ```javascript
   "availability": false,
   ```
4. Save the file. The cracker is immediately hidden from the website.
5. When stock arrives, change it back to `"availability": true`.

---

## 3. How to Add a New Cracker ➕

Adding a new product takes just 4 easy steps:

1. **Upload your image**: Put your image in `assets/crackers/<category>/` (e.g. `assets/crackers/flower-pots/golden-shower.jpg`).
2. **Open** `data/crackers/crackers.js`.
3. **Copy any existing product block**, paste it at the end of the list (before `];`), and customize it:
   ```javascript
   {
       "id": "fp-95",
       "sNo": 95,
       "name": "Golden Shower Mega Fountain",
       "category": "flower_pots",
       "originalPrice": 250,
       "sellingPrice": 100,
       "discount": "60%",
       "image": "assets/crackers/flower-pots/golden-shower.jpg",
       "description": "Golden Shower Mega Fountain - Sivakasi Green Cracker",
       "availability": true,
       "displayOrder": 95,
       "isGreen": true,
       "isPopular": true
   },
   ```
4. **Save the file**. That's it! The new cracker automatically appears in its category with live pricing and cart quantity steppers.

---

## 4. How to Update WhatsApp & Phone Numbers 📞

1. Open `config/siteConfig.js`.
2. Update the phone and WhatsApp numbers:
   ```javascript
   // Phone numbers shown to customers:
   primaryPhone: '77085 32334',
   secondaryPhone: '97910 45933',

   // WhatsApp order desk:
   whatsappPhone: '93857 87363',
   whatsappPhoneRaw: '919385787363', // Note: Country code (91) + 10 digits without '+' or spaces
   ```
3. Save the file. All "Call" and "Send on WhatsApp" links update automatically.

---

## 5. Where to Upload Product Images 🖼️

Put product images in the dedicated category folders inside `assets/crackers/`:

* `assets/crackers/sparklers/`
* `assets/crackers/flower-pots/`
* `assets/crackers/ground-chakkars/`
* `assets/crackers/sound-crackers/`
* `assets/crackers/bombs/`
* `assets/crackers/rockets/`
* `assets/crackers/sky-shots/`
* `assets/crackers/fancy-items/`
* `assets/crackers/garlands/`
* `assets/crackers/gift-boxes/`

**Tip**: Use clear names like `10cm-electric-sparkler.jpg` or `flower-pot-giant.jpg` rather than random numbers.

---

## 6. How to Edit Website Headlines & Marketing Text ✍️

1. Open `data/siteContent/siteContent.js`.
2. Here you can edit:
   - Top announcement banner (`announcement.text`)
   - Hero title and description (`hero.titlePart1`, `hero.titleHighlight`, `hero.description`)
   - The 4 trust pillars below the hero banner (`tickerPillars`)
   - The bottom tradition quote (`bottomQuote`)
3. Save the file and refresh.

---

## 7. How to Edit Festival Offers 🎁

1. Open `data/offers/offers.js`.
2. Edit `currentSeason`, `flatDiscountRate`, or add/change minimum order perks under `bulkDiscountTiers`.

---

## 8. ⚠️ Files You Should NOT Normally Touch

To keep the website running safely, do not modify these core application files unless you are making architectural code changes:

- ❌ `js/app.js` (Cart calculation engine & page controller)
- ❌ `js/enquiry.js` (WhatsApp order message builder & checkout)
- ❌ `js/data.js` (Storage and data-binding engine)
- ❌ `css/` (Website design and styling sheets)
- ❌ `server.js` (Local web server)

---

## Need Help?
All product entries and settings in `data/` and `config/` are standard JavaScript objects. As long as quotation marks `"` and commas `,` are kept in place, you can modify any value freely!
