/**
 * PRANAV CRACKERS - Main Application Controller
 * Multilingual UI support for English, Tamil, Hindi, Telugu, Malayalam, and Kannada.
 */

class App {
    static currentCategory = 'all';
    static currentGiftBoxFilter = 'all';
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
        const name = item ? item.nameEn : 'Item';
        this.announce(`${name} added to cart`);

        // Temporary button text feedback to "ADDED"
        const btn = btnElement || document.getElementById(`add-btn-${id}`);
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.classList.add('btn-added-state');
            btn.innerHTML = '<span>ADDED</span>';
            btn.disabled = true;
            setTimeout(() => {
                btn.classList.remove('btn-added-state');
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }, 1200);
        }
    }

    static init() {
        // Initialize Language
        LanguageManager.setLanguage(LanguageManager.getLanguage());

        // Initialize Cart Badges & Drawer
        CartManager.updateCartBadges();
        CartManager.renderCartDrawer();

        // Render Page Sections
        this.renderPopularProducts();
        this.renderCategoriesSection();
        this.renderProductCatalog();
        this.renderGiftBoxesSection();
        this.renderPriceCategoryFilters();
        this.renderPriceListSection();
        this.renderGiftBoxCompareSection();

        // Setup Event Listeners
        this.setupEventListeners();

        // Check if direct admin URL hash requested
        if (window.location.hash === '#admin') {
            AdminManager.openAdminModal();
        }

        console.log('PRANAV CRACKERS App Initialized with Multilingual Support.');
    }

    static setupEventListeners() {
        // Global language changed listener
        window.addEventListener('languageChanged', () => {
            this.renderPopularProducts();
            this.renderCategoriesSection();
            this.renderProductCatalog();
            this.renderGiftBoxesSection();
            this.renderPriceCategoryFilters();
            this.renderPriceListSection();
            this.renderGiftBoxCompareSection();
            CartManager.renderCartDrawer();
            CartManager.updateCartBadges();
        });

        // Global cart updated listener
        window.addEventListener('cartUpdated', () => {
            this.updateProductCardStates();
            this.updatePriceListStates();
            CartManager.updateCartBadges();
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

        // Enable horizontal mouse wheel scrolling for desktop nav and filter pills
        const desktopNav = document.querySelector('.desktop-nav');
        if (desktopNav) {
            desktopNav.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    desktopNav.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }

        const filterPills = document.getElementById('category-filter-pills');
        if (filterPills) {
            filterPills.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    filterPills.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }

        // Close modals with Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProductModal();
                this.closeCartDrawer();
                CartManager.closeCheckoutModal();
                CartManager.closeConfirmationModal();
                CartManager.closeDiscountModal();
                CartManager.closeTrackOrderModal();
                AdminManager.closeAdminModal();
            }
        });
    }

    static refreshCatalog() {
        this.renderPopularProducts();
        this.renderCategoriesSection();
        this.renderProductCatalog();
        this.renderGiftBoxesSection();
        this.renderPriceListSection();
        this.renderGiftBoxCompareSection();
        CartManager.renderCartDrawer();
        CartManager.updateCartBadges();
    }

    // --- 0. Popular Products Showcase (Immediate Value Below Hero) ---
    static renderPopularProducts() {
        const grid = document.getElementById('popular-products-grid');
        if (!grid) return;

        const popularIds = ['fp-01', 'gc-01', 'rkt-rb', 'spk-10ele', 'os-kuruvi', 'snd-28chorsa', 'bj-red', 'sky-7shot'];
        const allProducts = DataStore.getProducts();
        const cart = CartManager.getCart();
        const lang = LanguageManager.getLanguage();

        const popularProducts = [];
        popularIds.forEach(id => {
            const p = allProducts.find(item => item.id === id);
            if (p) popularProducts.push(p);
        });

        let html = '';
        popularProducts.forEach(p => {
            const name = DataStore.getLocalizedName(p, lang);
            const subName = lang === 'en' ? '' : (p.nameEn !== name ? p.nameEn : '');
            const pack = lang === 'ta' && p.packSizeTa ? p.packSizeTa : p.packSize;
            const price = (p.price && p.price.trim() !== '') ? p.price : LanguageManager.t('contactForPrice');
            const inCartQty = cart[p.id] || 0;
            const isAvailable = p.isAvailable !== false;
            const draftQty = this.getDraftQty(p.id);
            const company = p.company || 'KALIS';

            html += `
                <div class="product-card popular-card" id="pop-card-${p.id}">
                    <div class="product-img-box" onclick="App.openProductModal('${p.id}')">
                        <img src="${p.image || 'assets/images/sparklers.jpg'}" alt="${name}" class="product-img" loading="lazy">
                    </div>

                    <div class="product-info">
                        <div class="product-info-top">
                            <span class="product-company-badge">${company}</span>
                            ${!isAvailable ? `<span class="stock-tag-inline out-stock">${LanguageManager.t('outOfStockLabel')}</span>` : ''}
                        </div>
                        <h3 class="product-name" onclick="App.openProductModal('${p.id}')">${name}</h3>
                        ${subName ? `<div class="product-subname">${subName}</div>` : ''}
                        <div class="product-pack-badge">${pack}</div>
                        
                        <div class="product-price-row">
                            <div>
                                <span class="price-caption">${LanguageManager.t('wholesalePriceTag')}</span>
                                <div class="product-price">${price}</div>
                            </div>
                            <button class="btn-info-circle" onclick="App.openProductModal('${p.id}')" title="${LanguageManager.t('viewDetailsBtn')}" aria-label="Details">
                                i
                            </button>
                        </div>

                        <div class="product-card-actions">
                            ${isAvailable ? `
                                <div class="product-stepper-row">
                                    <div class="inline-qty-stepper">
                                        <button class="inline-stepper-btn" onclick="App.decrementDraftQty('${p.id}')" aria-label="Decrease quantity">−</button>
                                        <span class="inline-stepper-val draft-qty-val-${p.id}">${draftQty}</span>
                                        <button class="inline-stepper-btn" onclick="App.incrementDraftQty('${p.id}')" aria-label="Increase quantity">+</button>
                                    </div>
                                    ${inCartQty > 0 ? `<span class="in-cart-pill">${inCartQty} in cart</span>` : ''}
                                </div>
                                <button class="btn btn-add-cart full-width" id="add-btn-pop-${p.id}" onclick="App.addDraftToCart('${p.id}', this)">
                                    <span>ADD TO CART</span>
                                </button>
                            ` : `
                                <button class="btn btn-disabled full-width" disabled>
                                    <span>${LanguageManager.t('outOfStockLabel')}</span>
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    // --- 1. Quick Action & Category Cards ---
    static renderCategoriesSection() {
        const container = document.getElementById('categories-grid');
        if (!container) return;

        const categories = DataStore.getCategories().filter(c => c.id !== 'all');
        const products = DataStore.getProducts();
        const giftBoxes = DataStore.getGiftBoxes();
        const lang = LanguageManager.getLanguage();

        let html = '';
        categories.forEach(cat => {
            const count = cat.id === 'gift_boxes' 
                ? giftBoxes.length 
                : products.filter(p => p.category === cat.id).length;

            if (count === 0) return;

            const name = DataStore.getLocalizedName(cat, lang);
            const desc = DataStore.getLocalizedDesc(cat, lang);
            const img = cat.image || 'assets/images/sparklers.jpg';

            const onClickAction = cat.id === 'gift_boxes' 
                ? "App.scrollToSection('gift-boxes')" 
                : `App.filterByCategory('${cat.id}')`;

            html += `
                <div class="category-card" onclick="${onClickAction}">
                    <div class="cat-img-wrapper">
                        <img src="${img}" alt="${name}" class="cat-img" loading="lazy">
                        <div class="cat-badge-count">${count} ${LanguageManager.t('tableHeaderPackSize')}</div>
                    </div>
                    <div class="cat-content">
                        <h3 class="cat-title">${name}</h3>
                        <p class="cat-desc">${desc}</p>
                        <button class="btn btn-cat-link">
                            <span>${LanguageManager.t('viewProductsBtn')}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.renderCategoryFilterPills();
    }

    // Hero quick search handler
    static handleHeroSearch(val) {
        this.searchQuery = (val || '').toLowerCase().trim();
        const catalogInput = document.getElementById('product-search-input');
        if (catalogInput) catalogInput.value = val;
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
        this.renderProductCatalog();
        if (this.searchQuery) {
            const section = document.getElementById('products');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    static clearSearchInput() {
        this.searchQuery = '';
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) searchInput.value = '';
        const heroInput = document.getElementById('hero-quick-search');
        if (heroInput) heroInput.value = '';
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = 'none';
        this.renderProductCatalog();
        this.announce('Search cleared. Showing all products in current category.');
        if (searchInput) searchInput.focus();
    }

    static focusCatalogSearch() {
        const section = document.getElementById('products');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const searchInput = document.getElementById('product-search-input');
            if (searchInput) searchInput.focus();
        }
    }

    // --- 2. Category Filter Pills ---
    static renderCategoryFilterPills() {
        const filterContainer = document.getElementById('category-filter-pills');
        if (!filterContainer) return;

        const categories = DataStore.getCategories();
        const products = DataStore.getProducts();
        const giftBoxes = DataStore.getGiftBoxes();
        const lang = LanguageManager.getLanguage();

        const catIcons = {
            'all': '💥',
            'gift_boxes': '🎁',
            'sparklers': '✨',
            'flower_pots': '🎆',
            'ground_chakkars': '🔄',
            'one_sound': '💥',
            'bijili': '⚡',
            'twinkling_star': '⭐',
            'bombs': '💣',
            'rockets': '🚀',
            'paper_bomb': '📜',
            'sky_shots': '🌟',
            'fancy_items': '🎉',
            'garlands': '🎇',
            'other_items': '✨'
        };

        let html = '';
        categories.forEach(cat => {
            if (cat.id !== 'all') {
                const count = cat.id === 'gift_boxes' 
                    ? giftBoxes.length 
                    : products.filter(p => p.category === cat.id).length;
                if (count === 0) return;
            }

            const name = DataStore.getLocalizedName(cat, lang);
            const icon = catIcons[cat.id] || '✨';
            const isActive = this.currentCategory === cat.id ? 'active' : '';

            html += `
                <button class="filter-pill ${isActive}" onclick="App.filterByCategory('${cat.id}')">
                    <span class="pill-icon">${icon}</span>
                    <span>${name}</span>
                </button>
            `;
        });

        filterContainer.innerHTML = html;
    }

    static filterByCategory(catId) {
        if (catId === 'gift_boxes') {
            this.scrollToSection('gift-boxes');
            return;
        }

        this.currentCategory = catId;
        this.renderCategoryFilterPills();
        this.renderProductCatalog();
        
        const section = document.getElementById('products');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // --- 3. Product Catalog Grid ---
    static renderProductCatalog() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const allProducts = DataStore.getProducts();
        const cart = CartManager.getCart();
        const lang = LanguageManager.getLanguage();

        let filtered = allProducts.filter(p => {
            const matchesCat = this.currentCategory === 'all' || p.category === this.currentCategory;
            
            if (!this.searchQuery) return matchesCat;

            const nameEn = (p.nameEn || '').toLowerCase();
            const nameTa = (p.nameTa || '').toLowerCase();
            const nameHi = (p.nameHi || '').toLowerCase();
            const nameTe = (p.nameTe || '').toLowerCase();
            const nameMl = (p.nameMl || '').toLowerCase();
            const nameKn = (p.nameKn || '').toLowerCase();
            const descEn = (p.descriptionEn || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();

            const q = this.searchQuery;
            const normQ = q.replace(/[\.\s]/g, '');
            let aliasMatch = false;
            if ((normQ === 'fp' || normQ.startsWith('fp')) && nameEn.includes('flower pot')) aliasMatch = true;
            if ((normQ === 'gc' || normQ.startsWith('gc')) && nameEn.includes('ground chakkar')) aliasMatch = true;
            if (normQ === 'ele' && nameEn.includes('electric')) aliasMatch = true;
            if (normQ === 'col' && (nameEn.includes('colour') || nameEn.includes('color'))) aliasMatch = true;
            if (normQ === 'spl' && nameEn.includes('special')) aliasMatch = true;
            if (normQ === 'dlx' && nameEn.includes('deluxe')) aliasMatch = true;

            const matchesSearch = aliasMatch ||
                                  nameEn.includes(q) ||
                                  nameTa.includes(q) ||
                                  nameHi.includes(q) ||
                                  nameTe.includes(q) ||
                                  nameMl.includes(q) ||
                                  nameKn.includes(q) ||
                                  descEn.includes(q) ||
                                  cat.includes(q);

            return matchesCat && matchesSearch;
        });

        // Update Active Filter & Results Status Bar
        const activeFilterBar = document.getElementById('catalog-active-filter-bar');
        const isFiltered = this.currentCategory !== 'all' || this.searchQuery !== '';
        if (activeFilterBar) {
            if (isFiltered) {
                const catObj = DataStore.getCategories().find(c => c.id === this.currentCategory);
                const catName = catObj ? DataStore.getLocalizedName(catObj, lang) : '';
                let filterDesc = '';
                if (this.currentCategory !== 'all' && this.searchQuery) {
                    filterDesc = `Showing <strong>${filtered.length} products</strong> in <strong>${catName}</strong> matching "<em>${this.searchQuery}</em>"`;
                } else if (this.currentCategory !== 'all') {
                    filterDesc = `Showing <strong>${filtered.length} products</strong> in <strong>${catName}</strong>`;
                } else {
                    filterDesc = `Showing <strong>${filtered.length} products</strong> matching "<em>${this.searchQuery}</em>"`;
                }
                activeFilterBar.innerHTML = `
                    <div class="active-filter-text">${filterDesc}</div>
                    <button type="button" class="btn-reset-filters" onclick="App.resetSearchAndCategory()" aria-label="Reset filters and show all products">
                        ✕ Reset Filters
                    </button>
                `;
                activeFilterBar.style.display = 'flex';
            } else {
                activeFilterBar.style.display = 'none';
            }
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-results-state">
                    <p>${LanguageManager.t('noProductsFound')}</p>
                    <button class="btn btn-secondary" onclick="App.resetSearchAndCategory()">
                        ${LanguageManager.t('filterAll')}
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(p => {
            const name = DataStore.getLocalizedName(p, lang);
            const subName = lang === 'en' ? '' : (p.nameEn !== name ? p.nameEn : '');
            const pack = lang === 'ta' && p.packSizeTa ? p.packSizeTa : p.packSize;
            const desc = DataStore.getLocalizedDesc(p, lang);
            const price = (p.price && p.price.trim() !== '') ? p.price : LanguageManager.t('contactForPrice');
            const inCartQty = cart[p.id] || 0;
            const isAvailable = p.isAvailable !== false;
            const draftQty = this.getDraftQty(p.id);
            const company = p.company || 'KALIS';

            html += `
                <div class="product-card" id="prod-card-${p.id}">
                    <div class="product-img-box" onclick="App.openProductModal('${p.id}')">
                        <img src="${p.image || 'assets/images/sparklers.jpg'}" alt="${name}" class="product-img" loading="lazy">
                    </div>

                    <div class="product-info">
                        <div class="product-info-top">
                            <span class="product-company-badge">${company}</span>
                            ${!isAvailable ? `<span class="stock-tag-inline out-stock">${LanguageManager.t('outOfStockLabel')}</span>` : ''}
                        </div>
                        <h3 class="product-name" onclick="App.openProductModal('${p.id}')">${name}</h3>
                        ${subName ? `<div class="product-subname">${subName}</div>` : ''}
                        <div class="product-pack-badge">${pack}</div>
                        <p class="product-desc">${desc}</p>
                        
                        <div class="product-price-row">
                            <div>
                                <span class="price-caption">${LanguageManager.t('wholesalePriceTag')}</span>
                                <div class="product-price">${price}</div>
                            </div>
                            <button class="btn-info-circle" onclick="App.openProductModal('${p.id}')" title="${LanguageManager.t('viewDetailsBtn')}" aria-label="Details">
                                i
                            </button>
                        </div>

                        <div class="product-card-actions">
                            ${isAvailable ? `
                                <div class="product-stepper-row">
                                    <div class="inline-qty-stepper">
                                        <button class="inline-stepper-btn" onclick="App.decrementDraftQty('${p.id}')" aria-label="Decrease quantity">−</button>
                                        <span class="inline-stepper-val draft-qty-val-${p.id}" id="draft-qty-${p.id}">${draftQty}</span>
                                        <button class="inline-stepper-btn" onclick="App.incrementDraftQty('${p.id}')" aria-label="Increase quantity">+</button>
                                    </div>
                                    ${inCartQty > 0 ? `<span class="in-cart-pill">${inCartQty} in cart</span>` : ''}
                                </div>
                                <button class="btn btn-add-cart full-width" id="add-btn-${p.id}" onclick="App.addDraftToCart('${p.id}', this)">
                                    <span>ADD TO CART</span>
                                </button>
                            ` : `
                                <button class="btn btn-disabled full-width" disabled>
                                    <span>${LanguageManager.t('outOfStockLabel')}</span>
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    static updateProductCardStates() {
        this.renderPopularProducts();
        this.renderProductCatalog();
        this.renderGiftBoxesSection();
    }

    static resetSearchAndCategory() {
        this.currentCategory = 'all';
        this.searchQuery = '';
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) searchInput.value = '';
        const heroInput = document.getElementById('hero-quick-search');
        if (heroInput) heroInput.value = '';
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = 'none';
        this.renderCategoryFilterPills();
        this.renderProductCatalog();
        this.announce('Filters reset. Showing all fireworks products.');
    }

    // --- 4. Official 5 ECHO Gift Boxes Showcase ---
    static setGiftBoxFilter(filterGroup) {
        this.currentGiftBoxFilter = filterGroup;
        const buttons = document.querySelectorAll('.gb-filter-btn');
        buttons.forEach(btn => {
            if (btn.dataset.filter === filterGroup) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        this.renderGiftBoxesSection();
    }

    static renderGiftBoxesSection() {
        const grid = document.getElementById('gift-boxes-grid');
        if (!grid) return;

        let giftBoxes = DataStore.getGiftBoxes();
        const cart = CartManager.getCart();
        const lang = LanguageManager.getLanguage();

        if (this.currentGiftBoxFilter === '35-50') {
            giftBoxes = giftBoxes.filter(gb => (gb.itemCountNumber || 0) >= 35 && (gb.itemCountNumber || 0) <= 50);
        } else if (this.currentGiftBoxFilter === '60-70') {
            giftBoxes = giftBoxes.filter(gb => (gb.itemCountNumber || 0) >= 60 && (gb.itemCountNumber || 0) <= 70);
        }

        let html = '';
        giftBoxes.forEach(gb => {
            const cityName = gb.city || gb.nameEn;
            const displayName = DataStore.getLocalizedName(gb, lang);
            const subName = lang === 'en' ? '' : (gb.nameEn !== displayName ? gb.nameEn : '');
            const count = lang === 'ta' && gb.itemCountTa ? gb.itemCountTa : gb.itemCount;
            const desc = DataStore.getLocalizedDesc(gb, lang);
            const price = (gb.price && gb.price.trim() !== '') ? gb.price : LanguageManager.t('contactForPrice');
            const inCartQty = cart[gb.id] || 0;
            const isAvailable = gb.isAvailable !== false;
            const draftQty = this.getDraftQty(gb.id);
            const company = gb.company || 'ECHO';

            html += `
                <div class="gift-box-card" id="gb-card-${gb.id}">
                    <div class="gift-box-header">
                        <span class="gift-box-badge">${count}</span>
                        <div class="gift-box-status-tag ${isAvailable ? 'available' : 'unavailable'}">
                            ${isAvailable ? (gb.price && gb.price.trim() !== '' ? gb.price : LanguageManager.t('inStockLabel')) : LanguageManager.t('outOfStockLabel')}
                        </div>
                    </div>

                    <div class="gift-box-img-container" onclick="App.openProductModal('${gb.id}')">
                        <img src="${gb.image || 'assets/images/gift_box.jpg'}" alt="${cityName} Gift Box" class="gift-box-img" loading="lazy">
                    </div>

                    <div class="gift-box-body">
                        <span class="product-company-badge">${company}</span>
                        <div class="gift-box-title-row">
                            <h3 class="gift-box-title" onclick="App.openProductModal('${gb.id}')">${displayName}</h3>
                            <span class="gift-box-item-pill">${gb.itemCountNumber} ITEMS</span>
                        </div>
                        ${subName ? `<div class="product-subname">${subName}</div>` : ''}
                        
                        <p class="gift-box-desc">${desc}</p>

                        <div class="gift-box-price-row">
                            <span class="price-caption">${LanguageManager.t('wholesalePriceTag')}</span>
                            <strong class="gift-box-price">${price}</strong>
                        </div>

                        <div class="gift-box-preview-snippet" onclick="App.openProductModal('${gb.id}')">
                            <span class="snippet-label">${LanguageManager.t('boxContainsLabel')}</span>
                            <div class="snippet-items-preview">
                                ${(gb.contents || []).slice(0, 3).map(c => `<span class="snippet-tag">${c.name}</span>`).join('')}
                                ${(gb.contents && gb.contents.length > 3) ? `<span class="snippet-tag more">+ ${gb.contents.length - 3} more...</span>` : ''}
                            </div>
                        </div>

                        <div class="gift-box-actions">
                            <button class="btn btn-secondary full-width" onclick="App.openProductModal('${gb.id}')">
                                ${LanguageManager.t('viewContentsBtn')}
                            </button>

                            ${isAvailable ? `
                                <div class="product-stepper-row full-width">
                                    <div class="inline-qty-stepper full-width">
                                        <button class="inline-stepper-btn" onclick="App.decrementDraftQty('${gb.id}')" aria-label="Decrease quantity">−</button>
                                        <span class="inline-stepper-val" id="draft-qty-${gb.id}">${draftQty}</span>
                                        <button class="inline-stepper-btn" onclick="App.incrementDraftQty('${gb.id}')" aria-label="Increase quantity">+</button>
                                    </div>
                                    ${inCartQty > 0 ? `<span class="in-cart-pill">${inCartQty} in cart</span>` : ''}
                                </div>
                                <button class="btn btn-add-cart full-width" id="add-btn-${gb.id}" onclick="App.addDraftToCart('${gb.id}', this)">
                                    <span>ADD TO CART</span>
                                </button>
                            ` : `
                                <button class="btn btn-disabled full-width" disabled>
                                    ${LanguageManager.t('outOfStockLabel')}
                                </button>
                            `}

                            <button class="btn btn-whatsapp-subtle full-width" onclick="CartManager.sendGiftBoxWhatsApp('${cityName}', '${gb.itemCountNumber}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c0 5.514-4.486 10-10 10-1.802 0-3.486-.481-4.945-1.32l-5.055 1.325 1.354-4.944c-.933-1.516-1.354-3.125-1.354-5.061 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                                <span>WhatsApp Enquiry</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    // --- 5. Compare Gift Boxes Section ---
    static renderGiftBoxCompareSection() {
        const tableBody = document.getElementById('gb-compare-tbody');
        if (!tableBody) return;

        let giftBoxes = DataStore.getGiftBoxes();
        giftBoxes.sort((a, b) => (a.itemCountNumber || 0) - (b.itemCountNumber || 0));

        const lang = LanguageManager.getLanguage();
        const cart = CartManager.getCart();

        let html = '';
        giftBoxes.forEach((gb, idx) => {
            const cityName = gb.city || gb.nameEn;
            const displayName = DataStore.getLocalizedName(gb, lang);
            const price = gb.price && gb.price.trim() !== '' ? gb.price : LanguageManager.t('contactForPrice');
            const topHighlights = (gb.contents || []).slice(0, 3).map(c => c.name).join(', ');
            const inCartQty = cart[gb.id] || 0;

            html += `
                <tr>
                    <td class="td-num">0${idx + 1}</td>
                    <td>
                        <div class="table-product-cell">
                            <img src="${gb.image || 'assets/images/gift_box.jpg'}" class="table-thumb" alt="${cityName}">
                            <div>
                                <strong class="table-prod-name">${displayName}</strong>
                                <div class="table-prod-sub">${cityName}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge badge-gold font-bold">${gb.itemCountNumber} ITEMS</span></td>
                    <td><small class="text-secondary">${topHighlights}...</small></td>
                    <td><strong class="gold-text font-bold">${price}</strong></td>
                    <td class="text-right">
                        ${inCartQty > 0 ? `
                            <button class="btn btn-sm btn-secondary" onclick="App.openCartDrawer()">
                                ${inCartQty} ${LanguageManager.t('inCartLabel')}
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-primary" onclick="CartManager.addToCart('${gb.id}', 1)">
                                ${LanguageManager.t('addToCartBtn')}
                            </button>
                        `}
                        <button class="btn btn-sm btn-secondary" onclick="App.openProductModal('${gb.id}')">
                            ${LanguageManager.t('viewContentsBtn')}
                        </button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
    }

    // --- 6. Official Rate Sheet Price List Section ---
    static renderPriceCategoryFilters() {
        const container = document.getElementById('price-cat-filters');
        if (!container) return;

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
        if (!container) return;

        const allItems = DataStore.getPriceList();

        // 1. Filter items based on active category and search query
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

                // Aliases for common user search shortcuts
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

                return aliasMatch || name.includes(rawQ) || company.includes(rawQ) || price.includes(rawQ) || cat.includes(rawQ);
            }
            return true;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="price-list-empty">
                    <p>${LanguageManager.t('noProductsFound') || 'No products found matching your search.'}</p>
                </div>
            `;
            return;
        }

        // 2. Group filtered items by category maintaining PRICE_LIST_CATEGORIES order
        const categoriesToRender = PRICE_LIST_CATEGORIES.filter(c => c.id !== 'all');
        let html = '';

        categoriesToRender.forEach(cat => {
            const catItems = filtered.filter(item => item.category === cat.id);
            if (catItems.length === 0) return;

            const categoryHeading = cat.title || cat.name.toUpperCase();

            html += `
                <div class="price-category-group" id="price-group-${cat.id}">
                    <div class="price-cat-banner">
                        <h3 class="price-cat-heading">${categoryHeading}</h3>
                        <span class="price-cat-badge">${catItems.length} items</span>
                    </div>
                    <div class="price-table-wrapper">
                        <table class="price-table">
                            <thead>
                                <tr>
                                    <th class="col-sno">${LanguageManager.t('tableHeaderSNo')}</th>
                                    <th class="col-item">${LanguageManager.t('tableHeaderItemName')}</th>
                                    <th class="col-company">${LanguageManager.t('tableHeaderCompany')}</th>
                                    <th class="col-price text-right">${LanguageManager.t('tableHeaderPrice')}</th>
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
                            <span class="p-mobile-company">${item.company}</span>
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
        }, 150);
    }

    static updatePriceListStates() {
        this.renderPriceListSection();
    }

    // --- 7. Product & Gift Box Detail Modal ---
    static openProductModal(itemId) {
        const item = CartManager.getFullItemDetails(itemId);
        if (!item) return;

        const modal = document.getElementById('product-detail-modal');
        const content = document.getElementById('product-modal-body');
        if (!modal || !content) return;

        const cart = CartManager.getCart();
        const inCartQty = cart[item.id] || 0;
        const lang = LanguageManager.getLanguage();

        const isGiftBox = item.category === 'gift_boxes';
        const cityName = item.city || item.nameEn;
        const name = DataStore.getLocalizedName(item, lang);
        const subName = lang === 'en' ? '' : (item.nameEn !== name ? item.nameEn : '');
        const pack = isGiftBox ? (lang === 'ta' && item.itemCountTa ? item.itemCountTa : item.itemCount) : (item.packSize || '');
        const desc = DataStore.getLocalizedDesc(item, lang);
        const catObj = DataStore.getCategories().find(c => c.id === item.category);
        const catName = catObj ? DataStore.getLocalizedName(catObj, lang) : item.category;
        const price = (item.price && item.price.trim() !== '') ? item.price : LanguageManager.t('contactForPrice');
        const isAvailable = item.isAvailable !== false;

        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = isGiftBox ? `${cityName} Gift Box — ${pack}` : `${name}`;
        }

        let contentsHtml = '';
        if (isGiftBox && item.contents && item.contents.length > 0) {
            contentsHtml = `
                <div class="modal-contents-wrapper">
                    <div class="modal-contents-header">
                        <h3 class="whats-inside-title">${LanguageManager.t('whatsInsideHeading')}</h3>
                        <span class="total-items-badge">${item.contents.length} Items</span>
                    </div>

                    <div class="giftbox-items-table-grid">
                        ${item.contents.map(c => `
                            <div class="giftbox-item-row-card">
                                <span class="gb-item-no">${c.no}</span>
                                <div class="gb-item-details">
                                    <strong class="gb-item-name">${c.name}</strong>
                                    <span class="gb-item-qty">Qty: <strong>${c.qty}</strong></span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        content.innerHTML = `
            <div class="modal-product-grid ${isGiftBox ? 'modal-giftbox-layout' : ''}">
                <div class="modal-img-col">
                    <img src="${item.image || 'assets/images/gift_box.jpg'}" alt="${name}" class="modal-product-img">
                    ${isGiftBox ? `<div class="modal-img-city-badge">${cityName} — ${pack}</div>` : ''}
                </div>
                <div class="modal-details-col">
                    <div class="modal-cat-tag">${catName}</div>
                    <h2 class="modal-prod-title">${name}</h2>
                    ${subName ? `<div class="modal-prod-sub">${subName}</div>` : ''}
                    
                    <div class="modal-meta-grid">
                        <div class="meta-item">
                            <span class="meta-label">${isGiftBox ? 'Collection' : LanguageManager.t('modalPackSizeLabel')}</span>
                            <span class="meta-val">${pack}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">${LanguageManager.t('modalPriceLabel')}</span>
                            <span class="meta-val gold-text font-bold">${price}</span>
                        </div>
                    </div>

                    <div class="modal-desc-box">
                        <span class="meta-label">${LanguageManager.t('modalDescriptionLabel')}</span>
                        <p class="modal-desc-text">${desc}</p>
                    </div>

                    ${contentsHtml}

                    <div class="modal-safety-alert">
                        ${LanguageManager.t('modalSafetyTip')}
                    </div>

                    <div class="modal-actions-box">
                        ${isAvailable ? `
                            <div class="modal-buttons-row">
                                <button class="btn btn-primary flex-1" onclick="CartManager.addToCart('${item.id}', 1); App.closeProductModal();">
                                    ${LanguageManager.t('modalAddToCartBtn')} ${inCartQty > 0 ? `(${inCartQty})` : ''}
                                </button>
                                <button class="btn btn-secondary" onclick="App.quickBuyItem('${item.id}')">
                                    ${LanguageManager.t('modalOrderNowBtn')}
                                </button>
                            </div>
                        ` : `
                            <button class="btn btn-disabled full-width" disabled>${LanguageManager.t('outOfStockLabel')}</button>
                        `}

                        <div class="modal-buttons-row mt-2">
                            ${isGiftBox ? `
                                <button class="btn btn-whatsapp flex-1" onclick="CartManager.sendGiftBoxWhatsApp('${cityName}', '${item.itemCountNumber}')">
                                    ${LanguageManager.t('modalWhatsAppEnquiryBtn')}
                                </button>
                            ` : `
                                <button class="btn btn-whatsapp flex-1" onclick="App.sendItemWhatsAppDirect('${item.id}')">
                                    ${LanguageManager.t('modalWhatsAppEnquiryBtn')}
                                </button>
                            `}
                            <button class="btn btn-gold-outline" onclick="App.closeProductModal(); CartManager.openDiscountModal('${item.id}');">
                                <span data-i18n="modalRequestDiscountBtn">${LanguageManager.t('modalRequestDiscountBtn')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('open');
    }

    static closeProductModal() {
        const modal = document.getElementById('product-detail-modal');
        if (modal) modal.classList.remove('open');
    }

    static quickBuyItem(itemId) {
        CartManager.addToCart(itemId, 1);
        this.closeProductModal();
        CartManager.openCheckoutModal();
    }

    static sendItemWhatsAppDirect(itemId) {
        const item = CartManager.getFullItemDetails(itemId);
        if (!item) return;

        if (item.category === 'gift_boxes') {
            CartManager.sendGiftBoxWhatsApp(item.city || item.nameEn, item.itemCountNumber || 16);
            return;
        }

        const settings = DataStore.getSettings();
        const phone = settings.whatsappPhoneRaw || '919385787363';
        const lang = LanguageManager.getLanguage();
        const name = DataStore.getLocalizedName(item, lang);
        const pack = item.packSize || item.itemCount || '';

        const message = `Hello PRANAV CRACKERS,\n\nI would like to enquire about:\n\n• ${name} (${pack})\n\nPlease confirm availability and wholesale order details.\n\nThank you.`;
        
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // --- 8. Cart Drawer & Navigation Utilities ---
    static openCartDrawer() {
        CartManager.renderCartDrawer();
        const drawer = document.getElementById('cart-drawer') || document.getElementById('enquiry-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer) drawer.classList.add('open');
        if (overlay) overlay.classList.add('open');
    }

    static closeCartDrawer() {
        const drawer = document.getElementById('cart-drawer') || document.getElementById('enquiry-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
    }

    static openEnquiryDrawer() { this.openCartDrawer(); }
    static closeEnquiryDrawer() { this.closeCartDrawer(); }

    static toggleMobileMenu() {
        const menu = document.getElementById('mobile-nav-menu');
        const toggleBtn = document.getElementById('mobile-menu-btn');
        if (menu) {
            menu.classList.toggle('open');
            if (toggleBtn) {
                toggleBtn.classList.toggle('active');
            }
        }
    }

    static closeMobileMenu() {
        const menu = document.getElementById('mobile-nav-menu');
        const toggleBtn = document.getElementById('mobile-menu-btn');
        if (menu) menu.classList.remove('open');
        if (toggleBtn) toggleBtn.classList.remove('active');
    }

    static scrollToSection(id) {
        this.closeMobileMenu();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
        }, 2200);
    }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
