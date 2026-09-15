/**
 * =============================================================================
 * PRANAV CRACKERS - FRONTEND APPLICATION CONTROLLER
 * =============================================================================
 * 
 * ROLE OF THIS FILE:
 * - Controls catalogue rendering (cards grid & table rate sheet view)
 * - Category filtering tabs and live search bar
 * - Quantity steppers (+ / - buttons on product cards)
 * - Synchronizing bottom dock and cart count badges
 * - Initializing event listeners on page load
 * =============================================================================
 */

class App {
    static currentCategory = 'all';
    static searchQuery = '';
    static viewMode = 'cards'; // 'cards' or 'table'

    static categoryGroups = [
        { key: 'all', title: 'All Crackers', icon: '🎆' },
        { key: 'flower_pots', title: 'Flower Pots', icon: '🪔' },
        { key: 'ground_chakkars', title: 'Ground Chakkars', icon: '🌀' },
        { key: 'sound_crackers', title: 'Sound Crackers', icon: '💥' },
        { key: 'bombs', title: 'Bombs', icon: '💣' },
        { key: 'rockets', title: 'Rockets', icon: '🚀' },
        { key: 'sky_shots', title: 'Sky Shots', icon: '✨' },
        { key: 'sparklers', title: 'Sparklers', icon: '🪄' },
        { key: 'fancy_items', title: 'Fancy Items', icon: '🎉' },
        { key: 'garlands', title: 'Garlands', icon: '🎇' },
        { key: 'gift_boxes', title: 'Gift Boxes', icon: '🎁' }
    ];

    static mapToGroupKey(cat) {
        switch (cat) {
            case 'flower_pots': return 'flower_pots';
            case 'ground_chakkars': return 'ground_chakkars';
            case 'one_sound':
            case 'bijili':
            case 'sound_crackers': return 'sound_crackers';
            case 'bombs':
            case 'paper_bomb': return 'bombs';
            case 'rockets':
            case 'sky_rockets': return 'rockets';
            case 'sky_shots': return 'sky_shots';
            case 'sparklers':
            case 'twinkling_star': return 'sparklers';
            case 'fancy_items':
            case 'other_items': return 'fancy_items';
            case 'garlands': return 'garlands';
            case 'gift_boxes': return 'gift_boxes';
            default: return 'fancy_items';
        }
    }

    static getCategoryTitle(catKey) {
        const keyMap = {
            all: 'catAll',
            flower_pots: 'catFlowerPots',
            ground_chakkars: 'catGroundChakkars',
            sound_crackers: 'catSoundCrackers',
            bombs: 'catBombs',
            rockets: 'catRockets',
            sky_shots: 'catSkyShots',
            sparklers: 'catSparklers',
            fancy_items: 'catFancyItems',
            garlands: 'catGarlands',
            gift_boxes: 'catGiftBoxes'
        };
        if (typeof LanguageManager !== 'undefined' && keyMap[catKey]) {
            const fallback = (this.categoryGroups.find(g => g.key === catKey) || {}).title || catKey;
            return LanguageManager.t(keyMap[catKey], fallback);
        }
        const grp = this.categoryGroups.find(g => g.key === catKey);
        return grp ? grp.title : catKey;
    }

    static calculateMRP(priceNum) {
        // Authentic Sivakasi factory direct wholesale is ~60% off standard retail MRP
        return Math.round(priceNum * 2.5);
    }

    static init() {
        this.renderCategoryChips();
        this.renderCatalogue();
        this.setupEventListeners();
        CartManager.updateCartBadges();

        // Direct admin check via URL hash
        if (window.location.hash === '#admin') {
            AdminManager.openAdminModal();
        }

        console.log('PRANAV CRACKERS: Modern Catalogue & Rate Sheet Controller Initialized.');
    }

    static setupEventListeners() {
        // Search Input Listener
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                const clearBtn = document.getElementById('search-clear-btn');
                if (clearBtn) clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
                this.renderCatalogue();
            });
        }

        // Global cartUpdated listener
        window.addEventListener('cartUpdated', () => {
            CartManager.updateCartBadges();
            this.syncAllSteppers();
        });

        // Global languageChanged listener
        window.addEventListener('languageChanged', () => {
            this.renderCategoryChips();
            this.renderCatalogue();
        });

        // Close modals with Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                CartManager.closeQuotationModal();
                CartManager.closeConfirmationModal();
                CartManager.closeTrackOrderModal();
                AdminManager.closeAdminModal();
            }
        });
    }

    static setViewMode(mode) {
        if (mode !== 'cards' && mode !== 'table') return;
        this.viewMode = mode;

        const cardsBtn = document.getElementById('view-cards-btn');
        const tableBtn = document.getElementById('view-table-btn');
        const container = document.getElementById('catalogue-items-container');

        if (cardsBtn && tableBtn) {
            if (mode === 'cards') {
                cardsBtn.classList.add('active');
                tableBtn.classList.remove('active');
                if (container) {
                    container.classList.add('view-cards');
                    container.classList.remove('view-table');
                }
            } else {
                tableBtn.classList.add('active');
                cardsBtn.classList.remove('active');
                if (container) {
                    container.classList.add('view-table');
                    container.classList.remove('view-cards');
                }
            }
        }

        this.renderCatalogue();
    }

    static renderCategoryChips() {
        const chipsContainer = document.getElementById('category-chips-row');
        if (!chipsContainer) return;

        const allItems = DataStore.getCatalogueItems();

        // Calculate counts per category
        const counts = { all: allItems.length };
        this.categoryGroups.forEach(grp => {
            if (grp.key !== 'all') counts[grp.key] = 0;
        });

        allItems.forEach(item => {
            const grpKey = this.mapToGroupKey(item.category);
            if (counts[grpKey] !== undefined) {
                counts[grpKey]++;
            }
        });

        let html = '';
        this.categoryGroups.forEach(grp => {
            const isActive = this.currentCategory === grp.key;
            const count = counts[grp.key] || 0;
            const title = this.getCategoryTitle(grp.key);
            html += `
                <button type="button" 
                        class="cat-chip-btn ${isActive ? 'active' : ''}" 
                        data-cat="${grp.key}" 
                        onclick="App.filterCategory('${grp.key}')" 
                        role="tab" 
                        aria-selected="${isActive}">
                    <span class="chip-icon">${grp.icon}</span>
                    <span class="chip-title">${title}</span>
                    <span class="chip-count">${count}</span>
                </button>
            `;
        });

        chipsContainer.innerHTML = html;
    }

    static filterCategory(catKey) {
        this.currentCategory = catKey;
        document.querySelectorAll('.cat-chip-btn').forEach(chip => {
            if (chip.dataset.cat === catKey) {
                chip.classList.add('active');
                chip.setAttribute('aria-selected', 'true');
                chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                chip.classList.remove('active');
                chip.setAttribute('aria-selected', 'false');
            }
        });
        this.renderCatalogue();
    }

    static clearSearch() {
        const input = document.getElementById('product-search-input');
        if (input) {
            input.value = '';
            this.searchQuery = '';
            const clearBtn = document.getElementById('search-clear-btn');
            if (clearBtn) clearBtn.style.display = 'none';
            this.renderCatalogue();
            input.focus();
        }
    }

    static resetView() {
        this.clearSearch();
        this.filterCategory('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    static changeQty(itemId, delta) {
        const nextQty = CartManager.changeQty(itemId, delta);
        
        // Instant tactile update in DOM for any matching element
        document.querySelectorAll(`.stepper-val-${itemId}`).forEach(el => {
            el.textContent = nextQty;
        });

        // Update Card / Row state and subtotal
        const item = CartManager.getFullItemDetails(itemId);
        const priceNum = item && item.price && item.price.includes('₹')
            ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
            : 0;
        const subtotal = priceNum * nextQty;

        // Card view update
        const cardEl = document.getElementById(`pcard-${itemId}`);
        if (cardEl && cardEl.querySelector) {
            if (nextQty > 0) {
                cardEl.classList.add('is-selected');
                const subEl = cardEl.querySelector('.card-subtotal-tag');
                if (subEl) {
                    const subLbl = typeof LanguageManager !== 'undefined' ? LanguageManager.t('subtotalText') : 'Subtotal';
                    subEl.style.display = 'inline-block';
                    subEl.textContent = `${subLbl}: ₹${subtotal.toLocaleString('en-IN')}`;
                }
            } else {
                cardEl.classList.remove('is-selected');
                const subEl = cardEl.querySelector('.card-subtotal-tag');
                if (subEl) subEl.style.display = 'none';
            }
        }

        // Table view update
        const rowEl = document.getElementById(`prow-${itemId}`);
        if (rowEl && rowEl.querySelector) {
            if (nextQty > 0) {
                rowEl.classList.add('is-selected');
                const subRowEl = rowEl.querySelector('.table-subtotal-val');
                if (subRowEl) subRowEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
            } else {
                rowEl.classList.remove('is-selected');
                const subRowEl = rowEl.querySelector('.table-subtotal-val');
                if (subRowEl) subRowEl.textContent = '₹0';
            }
        }

        // If quotation modal is currently open, re-render it
        const modal = document.getElementById('quotation-modal');
        if (modal && modal.classList && modal.classList.contains && modal.classList.contains('open')) {
            CartManager.renderQuotationModal();
        }
    }

    static syncAllSteppers() {
        if (typeof document === 'undefined') return;
        const cart = CartManager.getCart();
        const items = DataStore.getCatalogueItems();
        items.forEach(item => {
            const qty = cart[item.id] || 0;
            const priceNum = (item.price && item.price.includes('₹'))
                ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
                : 0;
            const subtotal = priceNum * qty;

            if (document.querySelectorAll) {
                document.querySelectorAll(`.stepper-val-${item.id}`).forEach(el => {
                    el.textContent = qty;
                });
            }

            const cardEl = document.getElementById(`pcard-${item.id}`);
            if (cardEl && cardEl.querySelector) {
                if (qty > 0) {
                    cardEl.classList.add('is-selected');
                    const subEl = cardEl.querySelector('.card-subtotal-tag');
                    if (subEl) {
                        const subLbl = typeof LanguageManager !== 'undefined' ? LanguageManager.t('subtotalText') : 'Subtotal';
                        subEl.style.display = 'inline-block';
                        subEl.textContent = `${subLbl}: ₹${subtotal.toLocaleString('en-IN')}`;
                    }
                } else {
                    cardEl.classList.remove('is-selected');
                    const subEl = cardEl.querySelector('.card-subtotal-tag');
                    if (subEl) subEl.style.display = 'none';
                }
            }

            const rowEl = document.getElementById(`prow-${item.id}`);
            if (rowEl && rowEl.querySelector) {
                if (qty > 0) {
                    rowEl.classList.add('is-selected');
                    const subRowEl = rowEl.querySelector('.table-subtotal-val');
                    if (subRowEl) subRowEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
                } else {
                    rowEl.classList.remove('is-selected');
                    const subRowEl = rowEl.querySelector('.table-subtotal-val');
                    if (subRowEl) subRowEl.textContent = '₹0';
                }
            }
        });
    }

    static renderCatalogue() {
        const container = document.getElementById('catalogue-items-container');
        const statusBanner = document.getElementById('filter-status-banner');
        if (!container) return;

        const allItems = DataStore.getCatalogueItems();
        const cart = CartManager.getCart();
        const query = this.searchQuery;
        const activeCat = this.currentCategory;

        // Group items
        const grouped = {};
        this.categoryGroups.forEach(grp => {
            if (grp.key !== 'all') grouped[grp.key] = [];
        });

        let totalMatched = 0;

        allItems.forEach(item => {
            const grpKey = this.mapToGroupKey(item.category);
            if (!grouped[grpKey]) grouped[grpKey] = [];

            // Category filter check
            if (activeCat !== 'all' && grpKey !== activeCat) {
                return;
            }

            // Search filter check
            if (query) {
                const nameMatch = (item.name || '').toLowerCase().includes(query);
                const compMatch = (item.company || '').toLowerCase().includes(query);
                const catMatch = (item.category || '').toLowerCase().includes(query);
                if (!nameMatch && !compMatch && !catMatch) {
                    return;
                }
            }

            grouped[grpKey].push(item);
            totalMatched++;
        });

        // Filter status banner
        if (statusBanner) {
            if (query || activeCat !== 'all') {
                statusBanner.style.display = 'flex';
                let filterText = '';
                if (activeCat !== 'all') {
                    const title = this.getCategoryTitle(activeCat);
                    filterText += `Category: <strong>${title}</strong> `;
                }
                if (query) {
                    filterText += `Search: "<strong>${query}</strong>" `;
                }
                filterText += `(${totalMatched} crackers found)`;
                const showAllText = typeof LanguageManager !== 'undefined' ? LanguageManager.t('showAllBtn') : 'Show All Crackers';
                statusBanner.innerHTML = `
                    <div class="status-banner-text">${filterText}</div>
                    <button type="button" class="btn-reset-filter" onclick="App.resetView()">${showAllText}</button>
                `;
            } else {
                statusBanner.style.display = 'none';
            }
        }

        // Empty state
        if (totalMatched === 0) {
            const emptyTitle = typeof LanguageManager !== 'undefined' ? LanguageManager.t('emptySearchTitle') : 'No crackers found matching';
            const emptyDesc = typeof LanguageManager !== 'undefined' ? LanguageManager.t('emptySearchDesc') : 'Try searching for popular crackers like Flower Pot, Chakkar, 12 Shot, Sparklers, or Gift Box.';
            const clearBtnText = typeof LanguageManager !== 'undefined' ? LanguageManager.t('clearSearchBtn') : 'Clear Search';
            container.innerHTML = `
                <div class="empty-catalogue-box" style="text-align:center; padding: 3rem 1.5rem; background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0; margin: 1rem 0;">
                    <span style="font-size: 3rem; display:block; margin-bottom: 0.75rem;">🔍</span>
                    <h3 style="font-size: 1.25rem; font-weight:800; color:#0F1B2F; margin-bottom: 0.5rem;">${emptyTitle} "${query}"</h3>
                    <p style="color:#64748B; font-size: 0.9rem; max-width: 420px; margin: 0 auto 1.25rem;">${emptyDesc}</p>
                    <button type="button" class="btn-reset-filter" style="background:#0F1B2F; color:#FFFFFF; padding: 0.6rem 1.25rem; border-radius:6px; font-weight:700;" onclick="App.clearSearch()">${clearBtnText}</button>
                </div>
            `;
            return;
        }

        if (this.viewMode === 'cards') {
            this.renderCardsView(container, grouped, cart);
        } else {
            this.renderTableView(container, grouped, cart);
        }
    }

    static renderCardsView(container, grouped, cart) {
        let html = '';
        const discountTag = typeof LanguageManager !== 'undefined' ? LanguageManager.t('saveDiscount') : 'SAVE 60%';
        const subtotalWord = typeof LanguageManager !== 'undefined' ? LanguageManager.t('subtotalText') : 'Subtotal';

        this.categoryGroups.forEach(grp => {
            if (grp.key === 'all') return;
            const items = grouped[grp.key];
            if (!items || items.length === 0) return;

            const grpTitle = this.getCategoryTitle(grp.key);
            const itemWord = items.length === 1 
                ? (typeof LanguageManager !== 'undefined' ? LanguageManager.t('itemText') : 'item')
                : (typeof LanguageManager !== 'undefined' ? LanguageManager.t('itemsText') : 'items');

            html += `
                <section class="category-group-block" id="cat-group-${grp.key}">
                    <div class="category-group-heading-bar">
                        <h3 class="group-title">
                            <span>${grp.icon}</span>
                            <span>${grpTitle}</span>
                        </h3>
                        <span class="group-item-count">${items.length} ${itemWord}</span>
                    </div>

                    <div class="product-cards-grid">
            `;

            items.forEach(item => {
                const qty = cart[item.id] || 0;
                const isSelected = qty > 0;
                const company = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');
                const priceNum = (item.price && item.price.includes('₹'))
                    ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
                    : 0;
                const mrp = this.calculateMRP(priceNum);
                const subtotal = priceNum * qty;

                html += `
                    <div class="cracker-card ${isSelected ? 'is-selected' : ''}" id="pcard-${item.id}">
                        <div class="card-badge-row">
                            <span class="card-brand-badge">${company}</span>
                            <span class="card-discount-badge">${discountTag}</span>
                        </div>

                        <h4 class="card-name" title="${item.name}">${item.name}</h4>

                        <div class="card-pricing-block">
                            <div class="price-box">
                                <span class="mrp-strike">₹${mrp.toLocaleString('en-IN')}</span>
                                <strong class="wholesale-price">₹${priceNum.toLocaleString('en-IN')}</strong>
                            </div>
                            <span class="card-subtotal-tag" style="${isSelected ? 'display:inline-block;' : 'display:none;'}">${subtotalWord}: ₹${subtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div class="card-stepper-control">
                            <button type="button" class="stepper-btn minus" onclick="App.changeQty('${item.id}', -1)" aria-label="Decrease quantity for ${item.name}">−</button>
                            <span class="stepper-val stepper-val-${item.id}">${qty}</span>
                            <button type="button" class="stepper-btn plus" onclick="App.changeQty('${item.id}', 1)" aria-label="Increase quantity for ${item.name}">+</button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </section>
            `;
        });

        container.innerHTML = html;
    }

    static renderTableView(container, grouped, cart) {
        const thMrp = typeof LanguageManager !== 'undefined' ? LanguageManager.t('mrpText') : 'Retail MRP';
        const thRate = typeof LanguageManager !== 'undefined' ? LanguageManager.t('wholesaleRateText') : 'Wholesale Rate';
        const thQty = typeof LanguageManager !== 'undefined' ? LanguageManager.t('quantityText') : 'Quantity';
        const thSub = typeof LanguageManager !== 'undefined' ? LanguageManager.t('subtotalText') : 'Subtotal';

        let html = `
            <div class="rate-sheet-table-wrapper">
                <table class="rate-sheet-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;" class="text-center">#</th>
                            <th>Cracker Item & Brand</th>
                            <th class="text-right" style="width: 100px;">${thMrp}</th>
                            <th class="text-right" style="width: 130px;">${thRate}</th>
                            <th class="text-center" style="width: 140px;">${thQty}</th>
                            <th class="text-right" style="width: 120px;">${thSub}</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let rowCounter = 1;

        this.categoryGroups.forEach(grp => {
            if (grp.key === 'all') return;
            const items = grouped[grp.key];
            if (!items || items.length === 0) return;

            const grpTitle = this.getCategoryTitle(grp.key);
            const itemWord = items.length === 1 
                ? (typeof LanguageManager !== 'undefined' ? LanguageManager.t('itemText') : 'item')
                : (typeof LanguageManager !== 'undefined' ? LanguageManager.t('itemsText') : 'items');

            html += `
                <tr class="table-group-header-row" style="background:#1E2E4B; color:#FCD34D;">
                    <td colspan="6" style="padding: 0.65rem 0.85rem; font-weight:800; font-size:0.85rem; letter-spacing:0.04em;">
                        ${grp.icon} ${grpTitle} (${items.length} ${itemWord})
                    </td>
                </tr>
            `;

            items.forEach(item => {
                const qty = cart[item.id] || 0;
                const isSelected = qty > 0;
                const company = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');
                const priceNum = (item.price && item.price.includes('₹'))
                    ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
                    : 0;
                const mrp = this.calculateMRP(priceNum);
                const subtotal = priceNum * qty;

                html += `
                    <tr class="rate-sheet-row ${isSelected ? 'is-selected' : ''}" id="prow-${item.id}">
                        <td class="text-center" style="color:#64748B; font-weight:600;">${rowCounter++}</td>
                        <td>
                            <strong style="color:#0F172A; display:block; font-size:0.92rem;">${item.name}</strong>
                            <span style="font-size:0.72rem; color:#92400E; background:#FEF3C7; padding:1px 5px; border-radius:3px; font-weight:700;">${company}</span>
                        </td>
                        <td class="text-right mrp-strike">₹${mrp.toLocaleString('en-IN')}</td>
                        <td class="text-right">
                            <strong style="color:#B45309; font-size:1.05rem;">₹${priceNum.toLocaleString('en-IN')}</strong>
                        </td>
                        <td class="text-center">
                            <div class="card-stepper-control" style="width: 120px; margin: 0 auto; height: 32px;">
                                <button type="button" class="stepper-btn minus" onclick="App.changeQty('${item.id}', -1)" aria-label="Decrease">−</button>
                                <span class="stepper-val stepper-val-${item.id}">${qty}</span>
                                <button type="button" class="stepper-btn plus" onclick="App.changeQty('${item.id}', 1)" aria-label="Increase">+</button>
                            </div>
                        </td>
                        <td class="text-right">
                            <strong class="table-subtotal-val" style="color:#15803D; font-size:0.95rem;">₹${subtotal.toLocaleString('en-IN')}</strong>
                        </td>
                    </tr>
                `;
            });
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
