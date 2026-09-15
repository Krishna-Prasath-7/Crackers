/**
 * PRANAV CRACKERS - Main Application Controller
 * High-Speed Festive Catalogue + Live Quotation Experience
 */

class App {
    static currentCategory = 'popular';
    static currentBudgetFilter = 'all';
    static searchQuery = '';
    static priceListSearchQuery = '';
    static priceListActiveCategory = 'all';
    static draftQuantities = {};

    static getDraftQty(id) {
        return this.draftQuantities[id] || 1;
    }

    static incrementDraftQty(id) {
        this.draftQuantities[id] = (this.draftQuantities[id] || 1) + 1;
        document.querySelectorAll(`.draft-qty-val-${id}`).forEach(el => {
            el.textContent = this.draftQuantities[id];
        });
    }

    static decrementDraftQty(id) {
        const current = this.draftQuantities[id] || 1;
        if (current > 1) {
            this.draftQuantities[id] = current - 1;
            document.querySelectorAll(`.draft-qty-val-${id}`).forEach(el => {
                el.textContent = this.draftQuantities[id];
            });
        }
    }

    static announce(message) {
        const announcer = document.getElementById('a11y-announcer');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    static addDraftToCart(id, btnElement) {
        const qty = this.draftQuantities[id] || 1;
        CartManager.addToCart(id, qty);
        this.draftQuantities[id] = 1;
        document.querySelectorAll(`.draft-qty-val-${id}`).forEach(el => {
            el.textContent = '1';
        });

        const item = CartManager.getFullItemDetails(id);
        const name = item ? (item.name || item.nameEn) : 'Item';
        this.announce(`${name} added to quotation`);

        // Micro-animation feedback on the button
        const btn = btnElement || document.getElementById(`add-btn-${id}`);
        if (btn) {
            const originalText = btn.innerHTML;
            btn.classList.add('btn-added-pulse');
            btn.innerHTML = '<span>✓ ADDED</span>';
            btn.disabled = true;
            setTimeout(() => {
                btn.classList.remove('btn-added-pulse');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 900);
        }

        // Update card in-cart indicator
        this.updateProductCardState(id);
    }

    static updateProductCardState(id) {
        const cart = CartManager.getCart();
        const inCartQty = cart[id] || 0;
        const card = document.getElementById(`prod-card-${id}`);
        if (card) {
            let badge = card.querySelector('.card-incart-tag');
            if (inCartQty > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'card-incart-tag';
                    const priceRow = card.querySelector('.card-price-row');
                    if (priceRow) priceRow.appendChild(badge);
                }
                badge.textContent = `${inCartQty} selected`;
            } else if (badge) {
                badge.remove();
            }
        }
    }

    static init() {
        // Initialize Language
        if (typeof LanguageManager !== 'undefined') {
            LanguageManager.setLanguage(LanguageManager.getLanguage());
        }

        // Initialize Cart Badges & Live Quotation Panel
        CartManager.updateCartBadges();
        CartManager.renderLiveQuotationPanel();
        CartManager.renderCartDrawer();

        // Render Fast Navigation & Catalogue
        this.renderFastCategoryNav();
        this.renderBudgetShortcuts();
        this.renderProductCatalog();
        this.renderPriceCategoryFilters();
        this.renderPriceListSection();

        // Setup Event Listeners
        this.setupEventListeners();

        // Check if direct admin URL hash requested
        if (window.location.hash === '#admin') {
            AdminManager.openAdminModal();
        }

        console.log('PRANAV CRACKERS Catalogue + Live Quotation Engine Initialized.');
    }

    static setupEventListeners() {
        // Global language changed listener
        window.addEventListener('languageChanged', () => {
            this.renderFastCategoryNav();
            this.renderProductCatalog();
            this.renderPriceCategoryFilters();
            this.renderPriceListSection();
            CartManager.renderLiveQuotationPanel();
            CartManager.renderCartDrawer();
            CartManager.updateCartBadges();
        });

        // Global cart updated listener
        window.addEventListener('cartUpdated', () => {
            CartManager.renderLiveQuotationPanel();
            CartManager.updateCartBadges();
            this.refreshAllCardStates();
        });

        // Search Input Listener for Products
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                const clearBtn = document.getElementById('search-clear-btn');
                if (clearBtn) clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
                this.renderProductCatalog();
            });
        }

        // Search Input Listener for Price List
        const priceSearchInput = document.getElementById('price-list-search');
        if (priceSearchInput) {
            priceSearchInput.addEventListener('input', (e) => {
                this.onPriceSearch(e.target.value);
            });
        }

        // Close modals with Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartDrawer();
                CartManager.closeCheckoutModal();
                CartManager.closeConfirmationModal();
                CartManager.closeTrackOrderModal();
                AdminManager.closeAdminModal();
            }
        });
    }

    static refreshAllCardStates() {
        const cart = CartManager.getCart();
        document.querySelectorAll('.product-card').forEach(card => {
            const id = card.id.replace('prod-card-', '');
            const inCartQty = cart[id] || 0;
            let badge = card.querySelector('.card-incart-tag');
            if (inCartQty > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'card-incart-tag';
                    const priceRow = card.querySelector('.card-price-row');
                    if (priceRow) priceRow.appendChild(badge);
                }
                badge.textContent = `${inCartQty} selected`;
            } else if (badge) {
                badge.remove();
            }
        });
    }

    // --- FAST CATEGORY NAVIGATION (Section 3) ---
    static fastCategories = [
        { id: 'popular', name: 'Popular', label: 'POPULAR' },
        { id: 'flower_pots', name: 'Flower Pots', label: 'FLOWER POTS' },
        { id: 'ground_chakkars', name: 'Ground Chakkars', label: 'GROUND CHAKKARS' },
        { id: 'sound_crackers', name: 'Sound Crackers', label: 'SOUND CRACKERS' },
        { id: 'bombs', name: 'Bombs', label: 'BOMBS' },
        { id: 'rockets', name: 'Rockets', label: 'ROCKETS' },
        { id: 'sky_shots', name: 'Sky Shots', label: 'SKY SHOTS' },
        { id: 'sparklers', name: 'Sparklers', label: 'SPARKLERS' },
        { id: 'fancy_items', name: 'Fancy Items', label: 'FANCY ITEMS' },
        { id: 'garlands', name: 'Garlands', label: 'GARLANDS' },
        { id: 'gift_boxes', name: 'Gift Boxes', label: 'GIFT BOXES' }
    ];

    static renderFastCategoryNav() {
        const navContainer = document.getElementById('fast-category-nav');
        if (!navContainer) return;

        let html = '';
        this.fastCategories.forEach(cat => {
            const isActive = this.currentCategory === cat.id;
            html += `
                <button type="button" 
                        class="category-nav-pill ${isActive ? 'active' : ''}" 
                        onclick="App.filterByCategory('${cat.id}')"
                        role="tab"
                        aria-selected="${isActive}">
                    <span>${cat.name}</span>
                </button>
            `;
        });

        navContainer.innerHTML = html;
    }

    static filterByCategory(catId) {
        this.currentCategory = catId;
        this.currentBudgetFilter = 'all'; // reset budget when explicitly selecting category
        this.renderFastCategoryNav();
        this.renderBudgetShortcuts();
        this.renderProductCatalog();

        const catalogArea = document.getElementById('catalogue-section');
        if (catalogArea) {
            const offset = 70;
            const top = catalogArea.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
    }

    // --- QUICK BUDGET DISCOVERY (Section 10) ---
    static budgetFilters = [
        { id: 'all', label: 'All Crackers' },
        { id: 'under_1000', label: 'Under ₹1,000' },
        { id: '1000_2500', label: '₹1,000 – ₹2,500' },
        { id: '2500_5000', label: '₹2,500 – ₹5,000' },
        { id: 'gift_boxes', label: 'Gift Boxes' }
    ];

    static renderBudgetShortcuts() {
        const container = document.getElementById('budget-shortcuts-bar');
        if (!container) return;

        let html = '';
        this.budgetFilters.forEach(b => {
            const isActive = (b.id === 'gift_boxes' && this.currentCategory === 'gift_boxes') ||
                             (b.id !== 'gift_boxes' && this.currentBudgetFilter === b.id && this.currentCategory !== 'gift_boxes');
            html += `
                <button type="button" 
                        class="budget-pill ${isActive ? 'active' : ''}" 
                        onclick="App.filterByBudget('${b.id}')">
                    <span>${b.label}</span>
                </button>
            `;
        });

        container.innerHTML = html;
    }

    static filterByBudget(budgetId) {
        if (budgetId === 'gift_boxes') {
            this.currentCategory = 'gift_boxes';
            this.currentBudgetFilter = 'all';
        } else {
            this.currentBudgetFilter = budgetId;
            if (this.currentCategory === 'gift_boxes') {
                this.currentCategory = 'popular';
            }
        }
        this.renderFastCategoryNav();
        this.renderBudgetShortcuts();
        this.renderProductCatalog();

        const catalogArea = document.getElementById('catalogue-section');
        if (catalogArea) {
            const offset = 70;
            const top = catalogArea.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
    }

    static clearSearchInput() {
        this.searchQuery = '';
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) searchInput.value = '';
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = 'none';
        this.renderProductCatalog();
        this.announce('Search cleared.');
        if (searchInput) searchInput.focus();
    }

    static resetFilters() {
        this.currentCategory = 'popular';
        this.currentBudgetFilter = 'all';
        this.clearSearchInput();
        this.renderFastCategoryNav();
        this.renderBudgetShortcuts();
        this.renderProductCatalog();
    }

    // Helper to get category label for display
    static getCategoryDisplayLabel(category) {
        switch (category) {
            case 'flower_pots': return 'FLOWER POTS';
            case 'ground_chakkars': return 'GROUND CHAKKARS';
            case 'one_sound':
            case 'bijili':
            case 'sound_crackers': return 'SOUND CRACKERS';
            case 'bombs':
            case 'paper_bomb': return 'BOMBS';
            case 'rockets':
            case 'sky_rockets': return 'ROCKETS';
            case 'sky_shots': return 'SKY SHOTS';
            case 'sparklers':
            case 'twinkling_star': return 'SPARKLERS';
            case 'fancy_items':
            case 'other_items': return 'FANCY ITEMS';
            case 'garlands': return 'GARLANDS';
            case 'gift_boxes': return 'GIFT BOXES';
            default: return (category || 'CRACKERS').toUpperCase().replace(/_/g, ' ');
        }
    }

    // --- PRODUCT CATALOG GRID (Section 4: Image-Free Product Cards) ---
    static renderProductCatalog() {
        const grid = document.getElementById('products-grid');
        const statusBar = document.getElementById('catalog-active-filter-bar');
        if (!grid) return;

        const allItems = DataStore.getCatalogueItems();
        const cart = CartManager.getCart();

        let filtered = allItems.filter(item => {
            // 1. Category filter
            if (this.currentCategory !== 'all') {
                if (this.currentCategory === 'popular') {
                    if (!item.isPopular) return false;
                } else if (this.currentCategory === 'sound_crackers') {
                    if (!['one_sound', 'bijili', 'sound_crackers'].includes(item.category)) return false;
                } else if (this.currentCategory === 'bombs') {
                    if (!['bombs', 'paper_bomb'].includes(item.category)) return false;
                } else if (this.currentCategory === 'rockets') {
                    if (!['rockets', 'sky_rockets'].includes(item.category)) return false;
                } else if (this.currentCategory === 'sparklers') {
                    if (!['sparklers', 'twinkling_star'].includes(item.category)) return false;
                } else if (this.currentCategory === 'fancy_items') {
                    if (!['fancy_items', 'other_items'].includes(item.category)) return false;
                } else if (item.category !== this.currentCategory) {
                    return false;
                }
            }

            // 2. Budget filter
            if (this.currentBudgetFilter !== 'all') {
                let num = 0;
                if (item.price && item.price.includes('₹')) {
                    num = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                }
                if (this.currentBudgetFilter === 'under_1000' && num >= 1000) return false;
                if (this.currentBudgetFilter === '1000_2500' && (num < 1000 || num > 2500)) return false;
                if (this.currentBudgetFilter === '2500_5000' && (num <= 2500 || num > 5000)) return false;
            }

            // 3. Search query filter (with standardized aliases)
            if (this.searchQuery) {
                const q = this.searchQuery;
                const normQ = q.replace(/[\.\s]/g, '');
                const name = (item.name || item.nameEn || '').toLowerCase();
                const comp = (item.company || '').toLowerCase();
                const cat = (item.category || '').toLowerCase();
                const price = (item.price || '').toLowerCase();

                let aliasMatch = false;
                if ((normQ === 'fp' || normQ.startsWith('fp')) && name.includes('flower pot')) aliasMatch = true;
                if ((normQ === 'gc' || normQ.startsWith('gc')) && name.includes('ground chakkar')) aliasMatch = true;
                if (normQ === 'ele' && name.includes('electric')) aliasMatch = true;
                if (normQ === 'col' && (name.includes('colour') || name.includes('color'))) aliasMatch = true;
                if (normQ === 'spl' && name.includes('special')) aliasMatch = true;
                if (normQ === 'dlx' && name.includes('deluxe')) aliasMatch = true;
                if (normQ === 'sdlx' && name.includes('super deluxe')) aliasMatch = true;
                if (normQ.includes('gaint') && name.includes('giant')) aliasMatch = true;
                if (normQ.includes('role') && name.includes('roll')) aliasMatch = true;
                if (normQ === 'bomb' && (cat.includes('bomb') || name.includes('bomb'))) aliasMatch = true;
                if (normQ === 'rocket' && (cat.includes('rocket') || name.includes('rocket'))) aliasMatch = true;
                if (normQ === 'sparkler' && (cat.includes('sparkler') || name.includes('sparkler'))) aliasMatch = true;
                if (normQ === 'box' && (cat.includes('box') || name.includes('box'))) aliasMatch = true;

                return aliasMatch || name.includes(q) || comp.includes(q) || cat.includes(q) || price.includes(q);
            }

            return true;
        });

        // Update status bar
        if (statusBar) {
            const catObj = this.fastCategories.find(c => c.id === this.currentCategory);
            const catLabel = catObj ? catObj.name : 'All Products';
            let desc = `Showing <strong>${filtered.length} products</strong> in <strong>${catLabel}</strong>`;
            if (this.currentBudgetFilter !== 'all') {
                const bObj = this.budgetFilters.find(b => b.id === this.currentBudgetFilter);
                if (bObj) desc += ` • <em>${bObj.label}</em>`;
            }
            if (this.searchQuery) {
                desc += ` matching "<em>${this.searchQuery}</em>"`;
            }

            statusBar.innerHTML = `
                <div class="active-filter-text">${desc}</div>
                <button type="button" class="btn-reset-filters" onclick="App.resetFilters()" aria-label="Reset filters">
                    ✕ Reset
                </button>
            `;
            statusBar.style.display = (this.currentCategory !== 'popular' || this.currentBudgetFilter !== 'all' || this.searchQuery) ? 'flex' : 'none';
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-results-state">
                    <p>No crackers found matching your criteria.</p>
                    <button type="button" class="btn btn-secondary" onclick="App.resetFilters()">
                        View All Crackers
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(item => {
            const inCartQty = cart[item.id] || 0;
            const draftQty = this.getDraftQty(item.id);
            const catLabel = this.getCategoryDisplayLabel(item.category);
            const company = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');
            const displayName = item.name || item.nameEn;

            html += `
                <div class="product-card" id="prod-card-${item.id}">
                    <div class="card-top-strip">
                        <span class="card-category-label">${catLabel}</span>
                        <span class="card-company-pill">${company}</span>
                    </div>

                    <div class="card-title-wrap">
                        <h3 class="card-product-name">${displayName}</h3>
                    </div>

                    <div class="card-price-row">
                        <span class="card-price-value">${item.price}</span>
                        ${inCartQty > 0 ? `<span class="card-incart-tag">${inCartQty} selected</span>` : ''}
                    </div>

                    <div class="card-controls-row">
                        <div class="card-stepper">
                            <button type="button" class="card-step-btn" onclick="App.decrementDraftQty('${item.id}')" aria-label="Decrease quantity">−</button>
                            <span class="card-step-val draft-qty-val-${item.id}">${draftQty}</span>
                            <button type="button" class="card-step-btn" onclick="App.incrementDraftQty('${item.id}')" aria-label="Increase quantity">+</button>
                        </div>
                        <button type="button" class="card-add-btn" id="add-btn-${item.id}" onclick="App.addDraftToCart('${item.id}', this)">
                            <span>ADD</span>
                        </button>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    static scrollToSection(id) {
        this.closeMobileMenu();
        const el = document.getElementById(id);
        if (el) {
            const offset = 70;
            const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
    }

    static openCartDrawer() {
        CartManager.openMobileQuotationDrawer();
    }

    static closeCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
    }

    static toggleMobileMenu() {
        const menu = document.getElementById('mobile-nav-menu');
        const toggleBtn = document.getElementById('mobile-menu-btn');
        if (menu) {
            const isOpen = menu.classList.contains('open');
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                menu.classList.add('open');
                if (toggleBtn) toggleBtn.classList.add('active');
            }
        }
    }

    static closeMobileMenu() {
        const menu = document.getElementById('mobile-nav-menu');
        const toggleBtn = document.getElementById('mobile-menu-btn');
        if (menu) menu.classList.remove('open');
        if (toggleBtn) toggleBtn.classList.remove('active');
    }

    // --- RATE SHEET PRICE LIST SECTION ---
    static renderPriceCategoryFilters() {
        const container = document.getElementById('price-cat-filters');
        if (!container || typeof PRICE_LIST_CATEGORIES === 'undefined') return;

        let html = '';
        PRICE_LIST_CATEGORIES.forEach(cat => {
            const isActive = (cat.id === this.priceListActiveCategory);
            html += `
                <button type="button" 
                        class="price-cat-pill ${isActive ? 'active' : ''}" 
                        onclick="App.setPriceCategoryFilter('${cat.id}')"
                        role="tab"
                        aria-selected="${isActive}">
                    ${cat.name}
                </button>
            `;
        });
        container.innerHTML = html;
    }

    static setPriceCategoryFilter(catId) {
        this.priceListActiveCategory = catId;
        this.renderPriceCategoryFilters();
        this.renderPriceListSection();
    }

    static onPriceSearch(val) {
        this.priceListSearchQuery = (val || '').toLowerCase().trim();
        const clearBtn = document.getElementById('price-search-clear');
        if (clearBtn) {
            clearBtn.style.display = this.priceListSearchQuery ? 'inline-flex' : 'none';
        }
        this.renderPriceListSection();
    }

    static clearPriceSearch() {
        const input = document.getElementById('price-list-search');
        if (input) input.value = '';
        this.onPriceSearch('');
    }

    static renderPriceListSection() {
        const container = document.getElementById('price-list-container');
        if (!container || typeof DataStore === 'undefined' || !DataStore.getPriceList) return;

        const allItems = DataStore.getPriceList();

        let filtered = allItems.filter(item => {
            if (this.priceListActiveCategory !== 'all' && item.category !== this.priceListActiveCategory) {
                return false;
            }
            if (this.priceListSearchQuery) {
                const rawQ = this.priceListSearchQuery;
                const normQ = rawQ.replace(/[\.\s]/g, '');
                const name = (item.name || '').toLowerCase();
                const company = (item.company || '').toLowerCase();
                const price = (item.price || '').toLowerCase();
                const cat = (item.category || '').toLowerCase();

                let aliasMatch = false;
                if ((normQ === 'fp' || normQ.startsWith('fp')) && name.includes('flower pot')) aliasMatch = true;
                if ((normQ === 'gc' || normQ.startsWith('gc')) && name.includes('ground chakkar')) aliasMatch = true;
                if (normQ === 'ele' && name.includes('electric')) aliasMatch = true;
                if (normQ === 'col' && (name.includes('colour') || name.includes('color'))) aliasMatch = true;
                if (normQ === 'spl' && name.includes('special')) aliasMatch = true;
                if (normQ === 'dlx' && name.includes('deluxe')) aliasMatch = true;

                return aliasMatch || name.includes(rawQ) || company.includes(rawQ) || price.includes(rawQ) || cat.includes(rawQ);
            }
            return true;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="price-list-empty">
                    <p>No products found matching your search.</p>
                </div>
            `;
            return;
        }

        const categoriesToRender = (typeof PRICE_LIST_CATEGORIES !== 'undefined' ? PRICE_LIST_CATEGORIES : []).filter(c => c.id !== 'all');
        let html = '';

        categoriesToRender.forEach(cat => {
            const catItems = filtered.filter(item => item.category === cat.id);
            if (catItems.length === 0) return;

            const categoryHeading = cat.title || cat.name.toUpperCase();

            html += `
                <div class="price-category-group" id="price-group-${cat.id}">
                    <div class="price-cat-banner">
                        <h4 class="price-cat-heading">${categoryHeading}</h4>
                        <span class="price-cat-badge">${catItems.length} items</span>
                    </div>
                    <div class="price-table-wrapper">
                        <table class="price-table">
                            <thead>
                                <tr>
                                    <th class="col-sno">#</th>
                                    <th class="col-item">Item Name</th>
                                    <th class="col-company">Company</th>
                                    <th class="col-price text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            catItems.forEach(item => {
                html += `
                    <tr>
                        <td class="col-sno">${item.sNo}</td>
                        <td class="col-item">
                            <span class="p-item-name">${item.name}</span>
                        </td>
                        <td class="col-company">${item.company}</td>
                        <td class="col-price text-right">
                            <span class="p-price-val">${item.price}</span>
                        </td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    static printPriceList() {
        const prevCat = this.priceListActiveCategory;
        const prevSearch = this.priceListSearchQuery;

        if (prevCat !== 'all' || prevSearch !== '') {
            this.priceListActiveCategory = 'all';
            this.priceListSearchQuery = '';
            const searchInput = document.getElementById('price-list-search');
            if (searchInput) searchInput.value = '';
            this.renderPriceCategoryFilters();
            this.renderPriceListSection();
        }

        setTimeout(() => {
            window.print();
            if (prevCat !== 'all' || prevSearch !== '') {
                this.priceListActiveCategory = prevCat;
                this.priceListSearchQuery = prevSearch;
                this.renderPriceCategoryFilters();
                this.renderPriceListSection();
            }
        }, 300);
    }

    // Toast Notification
    static showToast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 1800);
    }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
