/**
 * PRANAV CRACKERS - Cart, Live Quotation, Order Tracking & WhatsApp Engine
 * Multilingual support for English, Tamil, Hindi, Telugu, Malayalam, and Kannada.
 */

class CartManager {
    static currentQuotationId = null;

    static getCart() {
        const saved = localStorage.getItem(STORAGE_KEYS.CART);
        if (!saved) return {};
        try {
            return JSON.parse(saved);
        } catch (e) {
            return {};
        }
    }

    static setCart(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        this.updateCartBadges();
        this.renderLiveQuotationPanel();
        this.renderCartDrawer();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    }

    static addToCart(itemId, count = 1) {
        const item = this.getFullItemDetails(itemId);
        if (item && item.isAvailable === false) {
            App.showToast('Currently Unavailable');
            return;
        }

        const cart = this.getCart();
        cart[itemId] = (cart[itemId] || 0) + count;
        if (cart[itemId] <= 0) {
            delete cart[itemId];
        }
        this.setCart(cart);
        App.showToast('Added to Quotation');
    }

    static updateQuantity(itemId, qty) {
        const cart = this.getCart();
        if (qty <= 0) {
            delete cart[itemId];
            App.showToast('Removed from Quotation');
        } else {
            cart[itemId] = qty;
        }
        this.setCart(cart);
    }

    static removeFromCart(itemId) {
        const cart = this.getCart();
        if (cart[itemId]) {
            delete cart[itemId];
            this.setCart(cart);
            App.showToast('Removed from Quotation');
        }
    }

    static clearCart() {
        localStorage.removeItem(STORAGE_KEYS.CART);
        this.updateCartBadges();
        this.renderLiveQuotationPanel();
        this.renderCartDrawer();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {} } }));
        App.showToast('Quotation Cleared');
    }

    static getItemCount() {
        const cart = this.getCart();
        return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
    }

    static getCartEstimatedTotal() {
        const cart = this.getCart();
        let total = 0;
        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (item && item.price && item.price.includes('₹')) {
                const num = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                if (!isNaN(num)) total += num * qty;
            }
        }
        return total;
    }

    static generateQuotationId() {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `PCQ-${yy}${mm}${dd}-${rand}`;
    }

    static updateCartBadges() {
        const count = this.getItemCount();
        const total = this.getCartEstimatedTotal();

        // Update header & global counters
        document.querySelectorAll('.cart-badge-count, .enquiry-badge-count, #header-cart-count').forEach(el => {
            el.textContent = count;
            if (count > 0) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        });

        // Desktop Quotation Panel Counters
        const badgeCountEl = document.getElementById('quotation-badge-count');
        const totalItemsEl = document.getElementById('quotation-total-items-count');
        const totalPriceEl = document.getElementById('quotation-total-price');
        const panelFooter = document.getElementById('quotation-panel-footer');

        if (badgeCountEl) badgeCountEl.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
        if (totalItemsEl) totalItemsEl.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
        if (totalPriceEl) {
            totalPriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;
            totalPriceEl.classList.remove('pulse-update');
            void totalPriceEl.offsetWidth; // trigger reflow
            totalPriceEl.classList.add('pulse-update');
        }

        if (panelFooter) {
            panelFooter.style.display = count > 0 ? 'block' : 'none';
        }

        // Mobile Fixed Bottom Bar (Section 6)
        const mobileBar = document.getElementById('mobile-quotation-bar');
        const mobileCountEl = document.getElementById('mobile-bar-count');
        const mobilePriceEl = document.getElementById('mobile-bar-total');

        if (mobileBar) {
            if (count > 0) {
                mobileBar.style.display = 'flex';
                if (mobileCountEl) mobileCountEl.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
                if (mobilePriceEl) mobilePriceEl.textContent = `Est. ₹${total.toLocaleString('en-IN')}`;
            } else {
                mobileBar.style.display = 'none';
            }
        }
    }

    static getFullItemDetails(itemId) {
        if (!itemId) return null;
        if (typeof DataStore !== 'undefined' && DataStore.getCatalogueItems) {
            const catItems = DataStore.getCatalogueItems();
            const foundCat = catItems.find(i => i.id === itemId);
            if (foundCat) return foundCat;
        }
        if (typeof DataStore !== 'undefined') {
            const products = DataStore.getProducts();
            const giftBoxes = DataStore.getGiftBoxes();
            return products.find(p => p.id === itemId) || giftBoxes.find(g => g.id === itemId) || null;
        }
        return null;
    }

    // --- DESKTOP STICKY LIVE QUOTATION PANEL (Section 5) ---
    static renderLiveQuotationPanel() {
        const container = document.getElementById('quotation-items-list');
        const footer = document.getElementById('quotation-panel-footer');
        if (!container) return;

        const cart = this.getCart();
        const entries = Object.entries(cart);
        const count = this.getItemCount();
        const total = this.getCartEstimatedTotal();

        this.updateCartBadges();

        if (entries.length === 0) {
            container.innerHTML = `
                <div class="quotation-empty-state">
                    <div class="q-empty-icon">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </div>
                    <p class="quotation-empty-title">Your Quotation is Empty</p>
                    <p class="quotation-empty-desc">Click <strong>ADD</strong> on any cracker to build your live requirement.</p>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }

        if (footer) footer.style.display = 'block';

        let html = '';
        entries.forEach(([id, qty]) => {
            const item = this.getFullItemDetails(id);
            if (!item) return;

            let unitPriceNum = 0;
            if (item.price && item.price.includes('₹')) {
                unitPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            }
            const lineTotal = unitPriceNum * qty;
            const priceDisplay = unitPriceNum > 0 ? `₹${unitPriceNum.toLocaleString('en-IN')}` : (item.price || 'Contact');
            const totalDisplay = unitPriceNum > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : 'Contact';
            const company = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');
            const displayName = item.name || item.nameEn;

            html += `
                <div class="quotation-item-row" data-id="${item.id}">
                    <div class="quotation-item-header">
                        <span class="q-item-name">${displayName}</span>
                        <button type="button" class="q-item-remove" onclick="CartManager.removeFromCart('${item.id}')" title="Remove item" aria-label="Remove item">✕</button>
                    </div>
                    <div class="quotation-item-company">${company}</div>
                    <div class="quotation-item-footer">
                        <div class="quotation-stepper">
                            <button type="button" class="q-step-btn" onclick="CartManager.updateQuantity('${item.id}', ${qty - 1})" aria-label="Decrease quantity">−</button>
                            <span class="q-step-val">${qty}</span>
                            <button type="button" class="q-step-btn" onclick="CartManager.addToCart('${item.id}', 1)" aria-label="Increase quantity">+</button>
                        </div>
                        <div class="quotation-calc">
                            <span class="q-calc-math">${qty} × ${priceDisplay}</span>
                            <strong class="q-calc-total">= ${totalDisplay}</strong>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Direct Gift Box WhatsApp Enquiry
    static sendGiftBoxWhatsApp(city, itemCount) {
        const settings = DataStore.getSettings();
        const phone = settings.whatsappPhoneRaw || '919385787363';
        
        const message = [
            `NEW PRANAV CRACKERS REQUIREMENT`,
            ``,
            `Gift Box Enquiry: ${city} Gift Box – ${itemCount} Items`,
            ``,
            `Please confirm availability and current wholesale price.`,
            ``,
            `Thank you.`
        ].join('\n');

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // --- MOBILE DRAWER / BOTTOM SHEET (Section 6) ---
    static openMobileQuotationDrawer() {
        this.renderCartDrawer();
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer) drawer.classList.add('open');
        if (overlay) overlay.classList.add('open');
    }

    static renderCartDrawer() {
        const drawerBody = document.getElementById('cart-drawer-items');
        const summaryArea = document.getElementById('cart-drawer-summary');
        if (!drawerBody) return;

        const cart = this.getCart();
        const entries = Object.entries(cart);

        if (entries.length === 0) {
            drawerBody.innerHTML = `
                <div class="empty-cart-state">
                    <p class="empty-cart-msg">Your Quotation is currently empty.</p>
                    <button class="btn btn-primary btn-sm" onclick="App.closeCartDrawer(); App.scrollToSection('catalogue-section')">
                        BROWSE CRACKERS
                    </button>
                </div>
            `;
            if (summaryArea) summaryArea.style.display = 'none';
            return;
        }

        let html = '';
        let totalEst = 0;

        entries.forEach(([id, qty]) => {
            const item = this.getFullItemDetails(id);
            if (!item) return;

            const name = item.name || item.nameEn;
            let unitPriceNum = 0;
            if (item.price && item.price.includes('₹')) {
                unitPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            }
            const lineTotal = unitPriceNum * qty;
            totalEst += lineTotal;

            const priceDisplay = unitPriceNum > 0 ? `₹${unitPriceNum.toLocaleString('en-IN')}` : (item.price || 'Contact');
            const totalDisplay = unitPriceNum > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : 'Contact';
            const company = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');

            html += `
                <div class="cart-item-card" data-id="${item.id}">
                    <div class="cart-item-header-row">
                        <div>
                            <span class="cart-item-name">${name}</span>
                            <div class="cart-item-company">${company}</div>
                        </div>
                        <button type="button" class="cart-remove-link" onclick="CartManager.removeFromCart('${item.id}')">Remove</button>
                    </div>
                    <div class="cart-item-calc-row">
                        <span class="cart-item-calc">${priceDisplay} × ${qty}</span>
                        <strong class="cart-item-total">${totalDisplay}</strong>
                    </div>
                    <div class="cart-item-stepper-row">
                        <div class="cart-qty-stepper">
                            <button type="button" class="cart-stepper-btn" onclick="CartManager.updateQuantity('${item.id}', ${qty - 1})" aria-label="Decrease quantity">−</button>
                            <span class="cart-stepper-val">${qty}</span>
                            <button type="button" class="cart-stepper-btn" onclick="CartManager.addToCart('${item.id}', 1)" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                </div>
            `;
        });

        drawerBody.innerHTML = html;

        if (summaryArea) {
            summaryArea.style.display = 'block';
            summaryArea.innerHTML = `
                <div class="cart-drawer-footer-content">
                    <div class="cart-drawer-total-box">
                        <span class="cart-drawer-total-label">Estimated Total:</span>
                        <strong class="cart-drawer-total-val">₹${totalEst.toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="cart-drawer-actions">
                        <button type="button" class="btn btn-secondary full-width btn-continue-shopping" onclick="App.closeCartDrawer()">
                            CONTINUE SHOPPING
                        </button>
                        <button type="button" class="btn btn-primary full-width btn-proceed-details" onclick="CartManager.openCheckoutModal()">
                            VIEW / COMPLETE QUOTATION
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // --- 7 & 8. CUSTOMER DETAILS & ESTIMATED QUOTATION MODAL ---
    static pendingDetails = null;

    static openCheckoutModal() {
        const cart = this.getCart();
        if (Object.keys(cart).length === 0) {
            App.showToast('Your Quotation is empty');
            return;
        }

        App.closeCartDrawer();
        const modal = document.getElementById('checkout-modal');
        if (!modal) return;

        // Reset to Step 1: Details
        const step1 = document.getElementById('checkout-step-details');
        const step2 = document.getElementById('checkout-step-summary');
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';

        // Pre-generate quotation reference ID for this session
        if (!this.currentQuotationId) {
            this.currentQuotationId = this.generateQuotationId();
        }

        modal.classList.add('open');
    }

    static closeCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) modal.classList.remove('open');
    }

    static handleDetailsSubmit(event) {
        event.preventDefault();

        const name = (document.getElementById('cust-name')?.value || '').trim();
        const phone = (document.getElementById('cust-phone')?.value || '').trim();
        const address = (document.getElementById('cust-address')?.value || '').trim();
        const city = (document.getElementById('cust-city')?.value || '').trim();
        const state = (document.getElementById('cust-state')?.value || 'Tamil Nadu').trim();
        const pincode = (document.getElementById('cust-pincode')?.value || '').trim();
        const notes = (document.getElementById('cust-notes')?.value || '').trim();

        if (!name || !phone || !address || !city || !state || !pincode) {
            alert('Please fill all required fields marked with * (Full Name, Mobile Number, Address, City, State, PIN Code).');
            return;
        }

        this.pendingDetails = { name, phone, address, city, state, pincode, notes };
        this.renderOrderSummary();
    }

    static backToDetails() {
        const step1 = document.getElementById('checkout-step-details');
        const step2 = document.getElementById('checkout-step-summary');
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
    }

    // Render Step 2: Estimated Quotation Preview (Section 8)
    static renderOrderSummary() {
        const step1 = document.getElementById('checkout-step-details');
        const step2 = document.getElementById('checkout-step-summary');
        const summaryBody = document.getElementById('checkout-summary-body');
        if (!step2 || !summaryBody || !this.pendingDetails) return;

        const cart = this.getCart();
        let totalCount = 0;
        let totalEst = 0;
        let tableRowsHtml = '';
        let cardsHtml = '';

        if (!this.currentQuotationId) {
            this.currentQuotationId = this.generateQuotationId();
        }
        const qId = this.currentQuotationId;

        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (!item) continue;

            const name = item.name || item.nameEn;
            const comp = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');
            let unitPriceNum = 0;
            if (item.price && item.price.includes('₹')) {
                unitPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            }
            const lineTotal = unitPriceNum * qty;
            totalEst += lineTotal;
            totalCount += qty;

            const unitPriceText = unitPriceNum > 0 ? `₹${unitPriceNum.toLocaleString('en-IN')}` : (item.price || 'Contact');
            const lineTotalText = unitPriceNum > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : 'Contact';

            // Desktop / Tablet table row
            tableRowsHtml += `
                <tr>
                    <td><strong>${name}</strong></td>
                    <td><span class="q-table-comp">${comp}</span></td>
                    <td class="text-right">${unitPriceText} × ${qty}</td>
                    <td class="text-right font-bold">${lineTotalText}</td>
                </tr>
            `;

            // Mobile responsive quotation card
            cardsHtml += `
                <div class="quotation-preview-card-item">
                    <div class="q-card-item-title-row">
                        <span class="q-card-item-title">${name}</span>
                        <strong class="q-card-item-subtotal">${lineTotalText}</strong>
                    </div>
                    <div class="q-card-item-meta-row">
                        <span class="q-card-item-comp">${comp}</span>
                        <span class="q-card-item-math">${unitPriceText} × ${qty}</span>
                    </div>
                </div>
            `;
        }

        const d = this.pendingDetails;

        summaryBody.innerHTML = `
            <div class="quotation-preview-container">
                <div class="quotation-preview-header">
                    <div class="q-header-brand">PRANAV CRACKERS</div>
                    <h3 class="q-header-main-title">ESTIMATED QUOTATION</h3>
                    <div class="q-header-ref-box">
                        <span class="q-ref-label">Quotation:</span>
                        <strong class="q-ref-val">${qId}</strong>
                    </div>
                </div>

                <div class="quotation-customer-box">
                    <div class="q-cust-title">CUSTOMER INFORMATION</div>
                    <div class="q-cust-grid">
                        <div><span class="text-muted">Name:</span> <strong>${d.name}</strong></div>
                        <div><span class="text-muted">Mobile:</span> <strong>${d.phone}</strong></div>
                        <div class="q-cust-full"><span class="text-muted">Address:</span> ${d.address}, ${d.city}, ${d.state} – ${d.pincode}</div>
                        ${d.notes ? `<div class="q-cust-full"><span class="text-muted">Notes:</span> <em>${d.notes}</em></div>` : ''}
                    </div>
                </div>

                <div class="quotation-items-section">
                    <div class="q-section-title">SELECTED ITEMS</div>
                    
                    <!-- Responsive Table for Tablet/Desktop -->
                    <div class="quotation-table-wrapper">
                        <table class="quotation-preview-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Company</th>
                                    <th class="text-right">Unit Price × Qty</th>
                                    <th class="text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>

                    <!-- Compact Card Rows for Mobile Screens (320px+) -->
                    <div class="quotation-cards-wrapper">
                        ${cardsHtml}
                    </div>
                </div>

                <div class="quotation-totals-strip">
                    <div class="q-total-row">
                        <span>Total Items:</span>
                        <strong>${totalCount}</strong>
                    </div>
                    <div class="q-total-row highlight">
                        <span>ESTIMATED TOTAL:</span>
                        <strong class="q-grand-price">₹${totalEst.toLocaleString('en-IN')}</strong>
                    </div>
                </div>

                <div class="quotation-disclaimer-card">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p class="q-disclaimer-text">This is an estimated quotation based on the current catalogue prices. Final availability and amount will be confirmed by PRANAV CRACKERS.</p>
                </div>

                <div class="quotation-action-buttons">
                    <button type="button" class="btn btn-whatsapp full-width btn-send-quotation" onclick="CartManager.placeRequirementAndContinueWhatsApp()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle; margin-right:8px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c0 5.514-4.486 10-10 10-1.802 0-3.486-.481-4.945-1.32l-5.055 1.325 1.354-4.944c-.933-1.516-1.354-3.125-1.354-5.061 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                        <span>SEND QUOTATION TO PRANAV CRACKERS</span>
                    </button>
                    <button type="button" class="btn btn-secondary full-width btn-edit-details" onclick="CartManager.backToDetails()">
                        <span>Edit Details</span>
                    </button>
                </div>
            </div>
        `;

        if (step1) step1.style.display = 'none';
        step2.style.display = 'block';
    }

    // --- 9. SEND QUOTATION TO PRANAV CRACKERS (WhatsApp Integration) ---
    static placeRequirementAndContinueWhatsApp() {
        const d = this.pendingDetails;
        if (!d) return;

        const cart = this.getCart();
        const items = [];
        let estimatedTotal = 0;
        let totalCount = 0;

        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (item) {
                let unitPriceNum = 0;
                if (item.price && item.price.includes('₹')) {
                    unitPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                }
                const lineTotal = unitPriceNum * qty;
                estimatedTotal += lineTotal;
                totalCount += qty;

                items.push({
                    id: item.id,
                    name: item.name || item.nameEn,
                    company: item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS'),
                    price: item.price || 'Contact for Price',
                    unitPriceNum,
                    quantity: qty,
                    lineTotalNum: lineTotal
                });
            }
        }

        const refId = this.currentQuotationId || this.generateQuotationId();

        const newOrder = {
            id: refId,
            customerName: d.name,
            phone: d.phone,
            address: d.address,
            city: d.city,
            state: d.state,
            pincode: d.pincode,
            notes: d.notes,
            items: items,
            itemsCount: totalCount,
            estimatedTotal: estimatedTotal,
            confirmedPayableAmount: estimatedTotal,
            status: 'UNDER REVIEW',
            createdAt: new Date().toISOString()
        };

        // Save enquiry locally
        DataStore.saveOrder(newOrder);

        // Clear cart and quotation
        localStorage.removeItem(STORAGE_KEYS.CART);
        this.updateCartBadges();
        this.renderLiveQuotationPanel();
        this.renderCartDrawer();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {} } }));

        // Close checkout modal
        this.closeCheckoutModal();

        // Open WhatsApp with pre-filled message (Section 9)
        this.sendOrderToWhatsApp(refId);

        // Show "Requirement Prepared" screen
        this.showRequirementPrepared(newOrder);

        // Reset current quotation ID
        this.currentQuotationId = null;
    }

    // --- AFTER WHATSAPP ("Requirement Prepared" Screen) ---
    static showRequirementPrepared(order) {
        const modal = document.getElementById('order-confirmation-modal');
        const content = document.getElementById('order-confirmation-content');
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="requirement-prepared-view">
                <div class="prepared-check-circle">✓</div>
                <h3 class="prepared-title">Quotation Prepared</h3>

                <div class="prepared-ref-box">
                    <span class="prepared-ref-label">Quotation Reference:</span>
                    <strong class="prepared-ref-val">${order.id}</strong>
                </div>

                <p class="prepared-message">
                    Your quotation requirement has been compiled. Please press <strong>Send</strong> in WhatsApp so our Sivakasi desk can confirm product availability and final amount.
                </p>

                <div class="prepared-actions-box">
                    <button type="button" class="btn btn-whatsapp full-width" onclick="CartManager.sendOrderToWhatsApp('${order.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle; margin-right:6px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c0 5.514-4.486 10-10 10-1.802 0-3.486-.481-4.945-1.32l-5.055 1.325 1.354-4.944c-.933-1.516-1.354-3.125-1.354-5.061 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                        <span>RE-OPEN WHATSAPP</span>
                    </button>
                    <a href="tel:7708532334" class="btn btn-secondary full-width">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:6px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span>CALL SIVAKASI DESK</span>
                    </a>
                    <button type="button" class="btn btn-secondary full-width" onclick="CartManager.closeConfirmationModal()">
                        <span>CONTINUE SHOPPING</span>
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('open');
    }

    static closeConfirmationModal() {
        const modal = document.getElementById('order-confirmation-modal');
        if (modal) modal.classList.remove('open');
    }

    // Exact pre-filled WhatsApp quotation message format (Section 9)
    static sendOrderToWhatsApp(orderId) {
        const order = DataStore.getOrderById(orderId);
        if (!order) return;

        const settings = DataStore.getSettings();
        const phone = settings.whatsappPhoneRaw || '919385787363';

        const itemsFormatted = (order.items || []).map((it, idx) => {
            const unitPrice = it.unitPriceNum && it.unitPriceNum > 0 ? `₹${it.unitPriceNum}` : (it.price || 'Contact');
            const lineTotal = it.unitPriceNum && it.unitPriceNum > 0 ? `₹${it.unitPriceNum * it.quantity}` : 'Contact';
            const company = it.company || 'KALIS';
            return `${idx + 1}. ${it.name}\n   ${company}\n   ${unitPrice} × ${it.quantity} = ${lineTotal}`;
        }).join('\n\n');

        const messageLines = [
            `NEW PRANAV CRACKERS REQUIREMENT`,
            ``,
            `Quotation: ${order.id}`,
            ``,
            `CUSTOMER DETAILS`,
            ``,
            `Name: ${order.customerName}`,
            `Mobile: ${order.phone}`,
            `Address: ${order.address}`,
            `City: ${order.city}`,
            `State: ${order.state || 'Tamil Nadu'}`,
            `PIN Code: ${order.pincode}`,
            ``,
            `SELECTED CRACKERS`,
            ``,
            itemsFormatted,
            ``,
            `TOTAL ITEMS: ${order.itemsCount}`,
            `ESTIMATED TOTAL: ₹${order.estimatedTotal.toLocaleString('en-IN')}`
        ];

        if (order.notes && order.notes.trim()) {
            messageLines.push(``);
            messageLines.push(`NOTES:`);
            messageLines.push(order.notes.trim());
        }

        messageLines.push(``);
        messageLines.push(`Please confirm product availability and final amount.`);

        const fullMsg = messageLines.join('\n');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(fullMsg)}`;
        window.open(url, '_blank');
    }

    // Direct WhatsApp order from Cart (no checkout form)
    static sendWhatsAppOrderDirect() {
        const cart = this.getCart();
        const settings = DataStore.getSettings();
        const phone = settings.whatsappPhoneRaw || '919385787363';
        const itemLines = [];
        let grandTotal = 0;
        let totalCount = 0;

        let index = 1;
        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (item) {
                const name = item.name || item.nameEn;
                const company = item.company || 'KALIS';
                let unitPriceNum = 0;
                let unitPriceStr = 'Contact for Price';
                let lineTotalStr = 'Contact for Price';

                if (item.price && item.price.includes('₹')) {
                    const cleanPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                    if (!isNaN(cleanPrice) && cleanPrice > 0) {
                        unitPriceNum = cleanPrice;
                        unitPriceStr = `₹${cleanPrice.toLocaleString('en-IN')}`;
                        const rowAmt = cleanPrice * qty;
                        grandTotal += rowAmt;
                        lineTotalStr = `₹${rowAmt.toLocaleString('en-IN')}`;
                    }
                }
                totalCount += qty;
                itemLines.push(`${index}. ${name}\n   ${company}\n   ${unitPriceStr} × ${qty} = ${lineTotalStr}`);
                index++;
            }
        }

        if (itemLines.length === 0) {
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Hello PRANAV CRACKERS, I would like to enquire about crackers and gift boxes.')}`, '_blank');
            return;
        }

        const qId = this.generateQuotationId();
        const lines = [
            `NEW PRANAV CRACKERS REQUIREMENT`,
            ``,
            `Quotation: ${qId}`,
            ``,
            `SELECTED CRACKERS`,
            ``,
            itemLines.join('\n\n'),
            ``,
            `TOTAL ITEMS: ${totalCount}`,
            `ESTIMATED TOTAL: ₹${grandTotal.toLocaleString('en-IN')}`,
            ``,
            `Please confirm product availability and final amount.`
        ];

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
    }

    // --- Order Tracking Modal ---
    static openTrackOrderModal(initialId = '') {
        const modal = document.getElementById('track-order-modal');
        if (!modal) return;
        modal.classList.add('open');

        const input = document.getElementById('track-query-input');
        if (input) {
            input.value = initialId;
            if (initialId) this.lookupOrder(initialId);
        }
    }

    static closeTrackOrderModal() {
        const modal = document.getElementById('track-order-modal');
        if (modal) modal.classList.remove('open');
    }

    static handleTrackLookup(event) {
        if (event) event.preventDefault();
        const query = document.getElementById('track-query-input').value.trim();
        this.lookupOrder(query);
    }

    static lookupOrder(query) {
        const resultContainer = document.getElementById('track-order-result');
        if (!resultContainer) return;

        if (!query) {
            resultContainer.innerHTML = `<p class="text-muted text-center">Please enter your Quotation Reference or Mobile Number.</p>`;
            return;
        }

        const order = DataStore.getOrderById(query);
        if (!order) {
            resultContainer.innerHTML = `
                <div class="track-not-found">
                    <p>No quotation found matching "<strong>${query}</strong>".</p>
                    <small class="text-muted">Please double-check your Reference Number (e.g. PCQ-260915-1042) or phone number.</small>
                </div>
            `;
            return;
        }

        const isConfirmed = order.status === 'CONFIRMED' || order.status === 'PAYMENT PENDING' || order.status === 'PAID' || order.status === 'PROCESSING' || order.status === 'READY' || order.status === 'COMPLETED';
        const isPaid = order.paymentStatus === 'Paid';

        resultContainer.innerHTML = `
            <div class="track-order-card">
                <div class="track-card-header">
                    <div>
                        <span class="text-muted">Quotation ID:</span>
                        <strong class="gold-text">${order.id}</strong>
                    </div>
                    <div class="order-status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</div>
                </div>

                <div class="track-details-grid">
                    <div><strong>Customer:</strong> ${order.customerName}</div>
                    <div><strong>Phone:</strong> ${order.phone}</div>
                    <div><strong>Delivery:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</div>
                    <div><strong>Status:</strong> <span class="badge ${isPaid ? 'badge-paid' : 'badge-pending'}">${order.paymentStatus || 'Quotation Under Review'}</span></div>
                </div>

                <div class="track-items-box">
                    <h6>Quotation Items</h6>
                    ${order.items.map(it => `
                        <div class="track-item-row">
                            <span>${it.name} × ${it.quantity}</span>
                            <strong>${it.price}</strong>
                        </div>
                    `).join('')}
                    <div class="track-total-row">
                        <span>Estimated Total:</span>
                        <strong class="gold-price">₹${(order.confirmedPayableAmount || order.estimatedTotal).toLocaleString('en-IN')}</strong>
                    </div>
                </div>
            </div>
        `;
    }
}

window.EnquiryManager = CartManager;
