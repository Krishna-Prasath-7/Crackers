/**
 * PRANAV CRACKERS - Cart, Checkout, Order Tracking, Discount Request & WhatsApp Engine
 * Multilingual support for English, Tamil, Hindi, Telugu, Malayalam, and Kannada.
 */

class CartManager {
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
        App.showToast('Added to Cart');
    }

    static updateQuantity(itemId, qty) {
        const cart = this.getCart();
        if (qty <= 0) {
            delete cart[itemId];
            App.showToast('Removed from Cart');
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
            App.showToast('Removed from Cart');
        }
    }

    static clearCart() {
        localStorage.removeItem(STORAGE_KEYS.CART);
        this.updateCartBadges();
        this.renderCartDrawer();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {} } }));
        App.showToast('Cart Cleared');
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

        // Mobile Fixed Bottom Bar (Section 2 & 8)
        const cartStrip = document.getElementById('mobile-cart-strip');
        const contactStrip = document.getElementById('mobile-contact-strip');
        const mobileCountEl = document.getElementById('mobile-cart-count');
        const mobilePriceEl = document.getElementById('mobile-cart-price');

        if (cartStrip && contactStrip) {
            if (count > 0) {
                cartStrip.style.display = 'flex';
                contactStrip.style.display = 'none';
                if (mobileCountEl) mobileCountEl.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
                if (mobilePriceEl) mobilePriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;
            } else {
                cartStrip.style.display = 'none';
                contactStrip.style.display = 'flex';
            }
        }

        // Desktop Floating Cart Banner (if present)
        const banner = document.getElementById('floating-cart-banner');
        if (banner) {
            if (count > 0) {
                const countBadge = document.getElementById('floating-cart-items-count');
                const itemsText = document.getElementById('floating-items-text');
                const totalPriceEl = document.getElementById('floating-total-price');

                if (countBadge) countBadge.textContent = count;
                if (itemsText) itemsText.textContent = `${count} ${count === 1 ? 'Item' : 'Items'} in Cart`;
                if (totalPriceEl) totalPriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;
                banner.classList.add('visible');
            } else {
                banner.classList.remove('visible');
            }
        }
    }

    static getFullItemDetails(itemId) {
        const products = DataStore.getProducts();
        const giftBoxes = DataStore.getGiftBoxes();
        return products.find(p => p.id === itemId) || giftBoxes.find(g => g.id === itemId) || null;
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

    // --- 3. CART PAGE / DRAWER (Section 3) ---
    static renderCartDrawer() {
        const drawerBody = document.getElementById('cart-drawer-items');
        const summaryArea = document.getElementById('cart-drawer-summary');
        if (!drawerBody) return;

        const cart = this.getCart();
        const entries = Object.entries(cart);
        const lang = LanguageManager.getLanguage();

        if (entries.length === 0) {
            drawerBody.innerHTML = `
                <div class="empty-cart-state">
                    <p class="empty-cart-msg">Your Cart is currently empty.</p>
                    <button class="btn btn-primary btn-sm" onclick="App.closeCartDrawer(); App.scrollToSection('products')">
                        BROWSE PRODUCTS
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

            const name = item.city ? `${item.city} Gift Box` : DataStore.getLocalizedName(item, lang);
            let unitPriceNum = 0;
            if (item.price && item.price.includes('₹')) {
                unitPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            }
            const lineTotal = unitPriceNum * qty;
            totalEst += lineTotal;

            const priceDisplay = unitPriceNum > 0 ? `₹${unitPriceNum.toLocaleString('en-IN')}` : (item.price || 'Contact');
            const totalDisplay = unitPriceNum > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : 'Contact';

            html += `
                <div class="cart-item-card" data-id="${item.id}">
                    <div class="cart-item-header-row">
                        <span class="cart-item-name">${name}</span>
                        <button class="cart-remove-link" onclick="CartManager.removeFromCart('${item.id}')">Remove</button>
                    </div>
                    <div class="cart-item-calc-row">
                        <span class="cart-item-calc">${priceDisplay} × ${qty}</span>
                        <strong class="cart-item-total">${totalDisplay}</strong>
                    </div>
                    <div class="cart-item-stepper-row">
                        <div class="cart-qty-stepper">
                            <button class="cart-stepper-btn" onclick="CartManager.updateQuantity('${item.id}', ${qty - 1})" aria-label="Decrease quantity">−</button>
                            <span class="cart-stepper-val">${qty}</span>
                            <button class="cart-stepper-btn" onclick="CartManager.addToCart('${item.id}', 1)" aria-label="Increase quantity">+</button>
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
                        <button class="btn btn-secondary full-width btn-continue-shopping" onclick="App.closeCartDrawer()">
                            CONTINUE SHOPPING
                        </button>
                        <button class="btn btn-primary full-width btn-proceed-details" onclick="CartManager.openCheckoutModal()">
                            PROCEED TO DETAILS
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // --- 4 & 5. CUSTOMER DETAILS & PLACE REQUIREMENT MODAL ---
    static pendingDetails = null;

    static openCheckoutModal() {
        const cart = this.getCart();
        if (Object.keys(cart).length === 0) {
            App.showToast('Your Cart is empty');
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

    // Render Step 2: Order / Requirement Summary (Section 5)
    static renderOrderSummary() {
        const step1 = document.getElementById('checkout-step-details');
        const step2 = document.getElementById('checkout-step-summary');
        const summaryBody = document.getElementById('checkout-summary-body');
        if (!step2 || !summaryBody || !this.pendingDetails) return;

        const cart = this.getCart();
        const lang = LanguageManager.getLanguage();
        let totalCount = 0;
        let totalEst = 0;
        let itemsHtml = '';

        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (!item) continue;

            const name = item.city ? `${item.city} Gift Box` : DataStore.getLocalizedName(item, lang);
            let unitPriceNum = 0;
            if (item.price && item.price.includes('₹')) {
                unitPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            }
            const lineTotal = unitPriceNum * qty;
            totalEst += lineTotal;
            totalCount += qty;

            const lineTotalText = unitPriceNum > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : (item.price || 'Contact');

            itemsHtml += `
                <div class="summary-item-row">
                    <span class="summary-item-title">${name} × ${qty}</span>
                    <strong class="summary-item-amt">${lineTotalText}</strong>
                </div>
            `;
        }

        const d = this.pendingDetails;

        summaryBody.innerHTML = `
            <div class="requirement-summary-container">
                <div class="summary-count-badge">${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}</div>

                <div class="summary-items-box">
                    ${itemsHtml}
                </div>

                <div class="summary-total-strip">
                    <span class="summary-total-label">Estimated Total</span>
                    <strong class="summary-total-val">₹${totalEst.toLocaleString('en-IN')}</strong>
                </div>

                <div class="summary-delivery-box">
                    <span class="summary-deliver-caption">Deliver To:</span>
                    <strong class="summary-deliver-name">${d.name}</strong>
                    <div class="summary-deliver-addr">${d.address}, ${d.city}, ${d.state} – ${d.pincode}</div>
                    <div class="summary-deliver-phone">Phone: ${d.phone}</div>
                    ${d.notes ? `<div class="summary-deliver-notes">Notes: ${d.notes}</div>` : ''}
                </div>

                <div class="important-notice-box">
                    <div class="notice-badge">IMPORTANT MESSAGE</div>
                    <p class="notice-text">Product availability and final amount will be confirmed by PRANAV CRACKERS through WhatsApp or phone.</p>
                </div>

                <div class="summary-actions-col">
                    <button type="button" class="btn btn-whatsapp full-width btn-place-req" onclick="CartManager.placeRequirementAndContinueWhatsApp()">
                        <span>PLACE REQUIREMENT & CONTINUE TO WHATSAPP</span>
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

    // --- 6. PLACE REQUIREMENT & CONTINUE TO WHATSAPP ---
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

                let displayName = item.city ? `${item.city} Gift Box – ${item.itemCountNumber || 35} Items` : item.nameEn;

                items.push({
                    id: item.id,
                    name: displayName,
                    packSize: item.itemCount || item.packSize || '',
                    price: item.price || 'Contact for Price',
                    unitPriceNum,
                    quantity: qty,
                    lineTotalNum: lineTotal
                });
            }
        }

        // 2. Generate simple reference ID (Section 6: e.g. PC-REQ-1024)
        const refNumber = Math.floor(1000 + Math.random() * 9000);
        const refId = `PC-REQ-${refNumber}`;

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

        // 1. Save enquiry locally
        DataStore.saveOrder(newOrder);

        // Clear cart
        localStorage.removeItem(STORAGE_KEYS.CART);
        this.updateCartBadges();
        this.renderCartDrawer();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {} } }));

        // Close checkout modal
        this.closeCheckoutModal();

        // 3. Open WhatsApp with pre-filled message (Section 6)
        this.sendOrderToWhatsApp(refId);

        // 7. Show "Requirement Prepared" screen (Section 7)
        this.showRequirementPrepared(newOrder);
    }

    // --- 7. AFTER WHATSAPP ("Requirement Prepared" Screen) ---
    static showRequirementPrepared(order) {
        const modal = document.getElementById('order-confirmation-modal');
        const content = document.getElementById('order-confirmation-content');
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="requirement-prepared-view">
                <div class="prepared-check-circle">✓</div>
                <h3 class="prepared-title">Requirement Prepared</h3>

                <div class="prepared-ref-box">
                    <span class="prepared-ref-label">Reference ID:</span>
                    <strong class="prepared-ref-val">${order.id}</strong>
                </div>

                <p class="prepared-message">
                    Our team will contact you to confirm availability and the final amount.
                </p>

                <div class="prepared-actions-box">
                    <button class="btn btn-whatsapp full-width" onclick="CartManager.sendOrderToWhatsApp('${order.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle; margin-right:6px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c0 5.514-4.486 10-10 10-1.802 0-3.486-.481-4.945-1.32l-5.055 1.325 1.354-4.944c-.933-1.516-1.354-3.125-1.354-5.061 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                        <span>CONTACT ON WHATSAPP</span>
                    </button>
                    <a href="tel:7708532334" class="btn btn-secondary full-width">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:6px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span>CALL US</span>
                    </a>
                    <button class="btn btn-secondary full-width" onclick="CartManager.closeConfirmationModal()">
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

    // Pre-filled WhatsApp message exact format (Section 6)
    static sendOrderToWhatsApp(orderId) {
        const order = DataStore.getOrderById(orderId);
        if (!order) return;

        const settings = DataStore.getSettings();
        const phone = settings.whatsappPhoneRaw || '919385787363';

        const itemsFormatted = (order.items || []).map((it, idx) => {
            const unitPrice = it.unitPriceNum && it.unitPriceNum > 0 ? `₹${it.unitPriceNum}` : (it.price || 'Contact');
            const lineTotal = it.unitPriceNum && it.unitPriceNum > 0 ? `₹${it.unitPriceNum * it.quantity}` : 'Contact';
            return `${idx + 1}. ${it.name}\n${unitPrice} × ${it.quantity} = ${lineTotal}`;
        }).join('\n\n');

        const messageLines = [
            `NEW PRANAV CRACKERS REQUIREMENT`,
            ``,
            `Reference ID: ${order.id}`,
            ``,
            `Customer Details`,
            `Name: ${order.customerName}`,
            `Mobile: ${order.phone}`,
            `Address: ${order.address}`,
            `City: ${order.city}`,
            `State: ${order.state || 'Tamil Nadu'}`,
            `PIN Code: ${order.pincode}`,
            ``,
            `Selected Items`,
            ``,
            itemsFormatted,
            ``,
            `Estimated Catalogue Total: ₹${order.estimatedTotal.toLocaleString('en-IN')}`
        ];

        if (order.notes && order.notes.trim()) {
            messageLines.push(``);
            messageLines.push(`Notes:`);
            messageLines.push(order.notes.trim());
        }

        messageLines.push(``);
        messageLines.push(`Please confirm availability and final amount.`);

        const fullMsg = messageLines.join('\n');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(fullMsg)}`;
        window.open(url, '_blank');
    }

    // Direct WhatsApp order from Cart (no checkout form)
    static sendWhatsAppOrderDirect() {
        const cart = this.getCart();
        const settings = DataStore.getSettings();
        const phone = settings.whatsappPhoneRaw || '919385787363';
        const lang = LanguageManager.getLanguage();
        const itemLines = [];
        let grandTotal = 0;
        let hasUnpriced = false;

        let index = 1;
        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (item) {
                const name = item.city ? `${item.city} Gift Box – ${item.itemCount || ''}` : DataStore.getLocalizedName(item, lang);
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
                    } else {
                        hasUnpriced = true;
                    }
                } else {
                    hasUnpriced = true;
                }

                itemLines.push(`${index}. ${name}\n   ${unitPriceStr} × ${qty} = ${lineTotalStr}`);
                index++;
            }
        }

        if (itemLines.length === 0) {
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Hello PRANAV CRACKERS, I would like to enquire about crackers and gift boxes.')}`, '_blank');
            return;
        }

        const lines = [
            `NEW PRANAV CRACKERS REQUIREMENT`,
            ``,
            `Selected Items`,
            ``,
            itemLines.join('\n\n'),
            ``,
        ];

        if (grandTotal > 0) {
            const totalLabel = hasUnpriced
                ? `Estimated Catalogue Total: ₹${grandTotal.toLocaleString('en-IN')} (+ Enquiry items)`
                : `Estimated Catalogue Total: ₹${grandTotal.toLocaleString('en-IN')}`;
            lines.push(totalLabel);
            lines.push(``);
        }

        lines.push(`Please confirm product availability and final amount.`);

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
    }

    // --- Discount Request Modal ---
    static openDiscountModal(itemId = null) {
        const modal = document.getElementById('discount-modal');
        if (!modal) return;

        let prefilledItems = '';
        if (itemId) {
            const item = this.getFullItemDetails(itemId);
            if (item) prefilledItems = `${item.city ? 'Gift Box: ' + item.city : item.nameEn} (${item.price || 'Contact for Price'})`;
        } else {
            const cart = this.getCart();
            prefilledItems = Object.entries(cart).map(([id, qty]) => {
                const item = this.getFullItemDetails(id);
                return `${item ? (item.city || item.nameEn) : id} (Qty: ${qty})`;
            }).join(', ');
        }

        const itemsInput = document.getElementById('disc-items');
        if (itemsInput) itemsInput.value = prefilledItems;

        modal.classList.add('open');
    }

    static closeDiscountModal() {
        const modal = document.getElementById('discount-modal');
        if (modal) modal.classList.remove('open');
    }

    static handleDiscountSubmit(event) {
        event.preventDefault();
        const name = document.getElementById('disc-name').value.trim();
        const phone = document.getElementById('disc-phone').value.trim();
        const items = document.getElementById('disc-items').value.trim();
        const message = document.getElementById('disc-message').value.trim();

        if (!name || !phone || !items || !message) {
            alert('Please fill all fields to submit discount request.');
            return;
        }

        DataStore.saveDiscountRequest({
            customerName: name,
            phone: phone,
            items: items,
            message: message
        });

        this.closeDiscountModal();
        App.showToast(LanguageManager.t('toastDiscountSent'));
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
            resultContainer.innerHTML = `<p class="text-muted text-center">Please enter your Order Number or Mobile Number.</p>`;
            return;
        }

        const order = DataStore.getOrderById(query);
        if (!order) {
            resultContainer.innerHTML = `
                <div class="track-not-found">
                    <p>No order found matching "<strong>${query}</strong>".</p>
                    <small class="text-muted">Please double-check your Order Number (e.g. PC-2026-1001) or phone number.</small>
                </div>
            `;
            return;
        }

        const settings = DataStore.getSettings();
        const isConfirmed = order.status === 'CONFIRMED' || order.status === 'PAYMENT PENDING' || order.status === 'PAID' || order.status === 'PROCESSING' || order.status === 'READY' || order.status === 'COMPLETED';
        const isPaid = order.paymentStatus === 'Paid';

        resultContainer.innerHTML = `
            <div class="track-order-card">
                <div class="track-card-header">
                    <div>
                        <span class="text-muted">Order ID:</span>
                        <strong class="gold-text">${order.id}</strong>
                    </div>
                    <div class="order-status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</div>
                </div>

                <div class="track-details-grid">
                    <div><strong>Customer:</strong> ${order.customerName}</div>
                    <div><strong>Phone:</strong> ${order.phone}</div>
                    <div><strong>Delivery:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</div>
                    <div><strong>Payment Status:</strong> <span class="badge ${isPaid ? 'badge-paid' : 'badge-pending'}">${order.paymentStatus}</span></div>
                </div>

                <div class="track-items-box">
                    <h6>Order Items</h6>
                    ${order.items.map(it => `
                        <div class="track-item-row">
                            <span>${it.name} (${it.packSize}) × ${it.quantity}</span>
                            <strong>${it.price}</strong>
                        </div>
                    `).join('')}
                    <div class="track-total-row">
                        <span>Final Payable Amount:</span>
                        <strong class="gold-price">₹${(order.confirmedPayableAmount || order.estimatedTotal).toLocaleString('en-IN')}</strong>
                    </div>
                </div>

                <!-- Payment Block: Shown ONLY when confirmed by PRANAV CRACKERS -->
                ${isConfirmed && !isPaid ? `
                    <div class="payment-unlocked-box">
                        <h5>Order Confirmed - Payment Instructions</h5>
                        <p>PRANAV CRACKERS has confirmed your order. Please complete payment using the official UPI details below:</p>
                        
                        <div class="upi-details-card">
                            <div><strong>UPI ID:</strong> <code>${settings.upiId || 'pranavcrackers@upi'}</code></div>
                            <div><strong>Bank Details:</strong> <small>${settings.bankDetails || 'SBI Sivakasi'}</small></div>
                            <div><strong>Amount:</strong> <strong class="gold-text font-bold">₹${(order.confirmedPayableAmount || order.estimatedTotal).toLocaleString('en-IN')}</strong></div>
                        </div>

                        <div class="mt-3">
                            <button class="btn btn-whatsapp full-width btn-sm" onclick="CartManager.notifyPaymentWhatsApp('${order.id}')">
                                Notify Payment on WhatsApp
                            </button>
                        </div>
                    </div>
                ` : ''}

                ${!isConfirmed ? `
                    <div class="review-pending-notice">
                        <p>Your order is currently <strong>UNDER REVIEW</strong> by the PRANAV CRACKERS team. Once availability and final pricing are verified, payment details will appear here.</p>
                    </div>
                ` : ''}

                ${isPaid ? `
                    <div class="payment-complete-notice">
                        <p>Payment received and verified. Your order is being prepared for dispatch.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static notifyPaymentWhatsApp(orderId) {
        const order = DataStore.getOrderById(orderId);
        if (!order) return;
        const settings = DataStore.getSettings();
        const phone = settings.whatsappPhoneRaw || '919385787363';
        const msg = `Hello PRANAV CRACKERS,\n\nI have completed payment for Order: *${order.id}*.\nAmount: ₹${(order.confirmedPayableAmount || order.estimatedTotal).toLocaleString('en-IN')}\nCustomer: ${order.customerName}\n\nPlease verify and process my order.\n\nThank you.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
}

window.EnquiryManager = CartManager;
