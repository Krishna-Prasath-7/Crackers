/**
 * PRANAV CRACKERS - Modern Digital Crackers Price List Controller
 * Core UX: Find Cracker -> Press + -> See Estimated Total -> View Quotation -> Enter Details -> Send to WhatsApp
 */

class App {
    static currentCategory = 'all';
    static searchQuery = '';

    static categoryGroups = [
        { key: 'flower_pots', title: 'FLOWER POTS' },
        { key: 'ground_chakkars', title: 'GROUND CHAKKARS' },
        { key: 'sound_crackers', title: 'SOUND CRACKERS' },
        { key: 'bombs', title: 'BOMBS' },
        { key: 'rockets', title: 'ROCKETS' },
        { key: 'sky_shots', title: 'SKY SHOTS' },
        { key: 'sparklers', title: 'SPARKLERS' },
        { key: 'fancy_items', title: 'FANCY ITEMS' },
        { key: 'garlands', title: 'GARLANDS' },
        { key: 'gift_boxes', title: 'GIFT BOXES' }
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

    static init() {
        this.renderPriceList();
        this.setupEventListeners();
        CartManager.updateCartBadges();

        // Direct admin check via URL hash
        if (window.location.hash === '#admin') {
            AdminManager.openAdminModal();
        }

        console.log('PRANAV CRACKERS Digital Price List Initialized.');
    }

    static setupEventListeners() {
        // Search Input Listener
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                const clearBtn = document.getElementById('search-clear-btn');
                if (clearBtn) clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
                this.renderPriceList();
            });
        }

        // Global cartUpdated listener
        window.addEventListener('cartUpdated', () => {
            CartManager.updateCartBadges();
            this.syncAllRowSteppers();
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

    static clearSearch() {
        const input = document.getElementById('product-search-input');
        if (input) {
            input.value = '';
            this.searchQuery = '';
            const clearBtn = document.getElementById('search-clear-btn');
            if (clearBtn) clearBtn.style.display = 'none';
            this.renderPriceList();
            input.focus();
        }
    }

    static resetView() {
        this.clearSearch();
        this.filterCategory('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    static filterCategory(catKey) {
        this.currentCategory = catKey;
        document.querySelectorAll('.cat-chip').forEach(chip => {
            if (chip.dataset.cat === catKey) {
                chip.classList.add('active');
                chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                chip.classList.remove('active');
            }
        });
        this.renderPriceList();
    }

    static changeQty(itemId, delta) {
        const nextQty = CartManager.changeQty(itemId, delta);
        
        // Instant row UI update
        const qtyEl = document.getElementById(`qty-${itemId}`);
        if (qtyEl) qtyEl.textContent = nextQty;

        const rowEl = document.getElementById(`prow-${itemId}`);
        if (rowEl) {
            if (nextQty > 0) {
                rowEl.classList.add('is-selected');
            } else {
                rowEl.classList.remove('is-selected');
            }
        }

        // If quotation modal is currently open, re-render it
        const modal = document.getElementById('quotation-modal');
        if (modal && modal.classList.contains('open')) {
            CartManager.renderQuotationModal();
        }
    }

    static syncAllRowSteppers() {
        const cart = CartManager.getCart();
        const items = DataStore.getCatalogueItems();
        items.forEach(item => {
            const qty = cart[item.id] || 0;
            const qtyEl = document.getElementById(`qty-${item.id}`);
            if (qtyEl) qtyEl.textContent = qty;
            const rowEl = document.getElementById(`prow-${item.id}`);
            if (rowEl) {
                if (qty > 0) {
                    rowEl.classList.add('is-selected');
                } else {
                    rowEl.classList.remove('is-selected');
                }
            }
        });
    }

    static renderPriceList() {
        const container = document.getElementById('price-list-rows');
        const statusBar = document.getElementById('filter-status-bar');
        if (!container) return;

        const allItems = DataStore.getCatalogueItems();
        const cart = CartManager.getCart();
        const query = this.searchQuery;
        const activeCat = this.currentCategory;

        // Group items
        const grouped = {};
        this.categoryGroups.forEach(grp => {
            grouped[grp.key] = [];
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
                const aliasMatch = (item.aliases || []).some(a => a.toLowerCase().includes(query));
                const catMatch = (item.category || '').toLowerCase().includes(query);
                if (!nameMatch && !compMatch && !aliasMatch && !catMatch) {
                    return;
                }
            }

            grouped[grpKey].push(item);
            totalMatched++;
        });

        // Filter status bar
        if (statusBar) {
            if (query || activeCat !== 'all') {
                statusBar.style.display = 'flex';
                let filterText = '';
                if (activeCat !== 'all') {
                    const grp = this.categoryGroups.find(g => g.key === activeCat);
                    filterText += `Category: <strong>${grp ? grp.title : activeCat}</strong> `;
                }
                if (query) {
                    filterText += `Search: "<strong>${query}</strong>" `;
                }
                filterText += `(${totalMatched} crackers found)`;
                statusBar.innerHTML = `
                    <div class="status-text">${filterText}</div>
                    <button type="button" class="btn-clear-filters" onclick="App.resetView()">Show All</button>
                `;
            } else {
                statusBar.style.display = 'none';
            }
        }

        // Empty state
        if (totalMatched === 0) {
            container.innerHTML = `
                <div class="empty-results-box">
                    <p class="empty-title">No crackers found matching "${query}"</p>
                    <p class="empty-sub">Try searching for generic names like Flower Pot, Chakkar, Sparkler, or 35 Items.</p>
                    <button type="button" class="btn-reset-search" onclick="App.clearSearch()">Clear Search</button>
                </div>
            `;
            return;
        }

        let html = '';

        this.categoryGroups.forEach(grp => {
            const items = grouped[grp.key];
            if (!items || items.length === 0) return;

            html += `
                <section class="price-category-group" id="grp-${grp.key}">
                    <h3 class="category-group-header">${grp.title}</h3>
                    <div class="category-rows-list">
            `;

            items.forEach(item => {
                const qty = cart[item.id] || 0;
                const isSelected = qty > 0;
                const company = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');
                const price = item.price || 'Contact';

                html += `
                    <div class="product-row ${isSelected ? 'is-selected' : ''}" id="prow-${item.id}">
                        <div class="row-main">
                            <span class="row-name">${item.name}</span>
                            <span class="row-company">${company}</span>
                        </div>
                        <div class="row-controls">
                            <span class="row-price">${price}</span>
                            <div class="row-stepper">
                                <button type="button" class="stepper-btn minus" onclick="App.changeQty('${item.id}', -1)" aria-label="Decrease quantity for ${item.name}">−</button>
                                <span class="stepper-val" id="qty-${item.id}">${qty}</span>
                                <button type="button" class="stepper-btn plus" onclick="App.changeQty('${item.id}', 1)" aria-label="Increase quantity for ${item.name}">+</button>
                            </div>
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
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
