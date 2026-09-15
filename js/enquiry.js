/**
 * PRANAV CRACKERS - Cart, Live Quotation & WhatsApp Engine
 * Ultra-fast digital price list quotation flow.
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
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    }

    static changeQty(itemId, delta) {
        const cart = this.getCart();
        const current = cart[itemId] || 0;
        const next = Math.max(0, current + delta);
        if (next === 0) {
            delete cart[itemId];
        } else {
            cart[itemId] = next;
        }
        this.setCart(cart);
        return next;
    }

    static clearCart() {
        localStorage.removeItem(STORAGE_KEYS.CART);
        this.updateCartBadges();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {} } }));
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

    static getFullItemDetails(itemId) {
        if (!itemId) return null;
        if (typeof DataStore !== 'undefined' && DataStore.getCatalogueItems) {
            const catItems = DataStore.getCatalogueItems();
            const found = catItems.find(i => i.id === itemId);
            if (found) return found;
        }
        if (typeof DataStore !== 'undefined') {
            const products = DataStore.getProducts();
            const giftBoxes = DataStore.getGiftBoxes();
            return products.find(p => p.id === itemId) || giftBoxes.find(g => g.id === itemId) || null;
        }
        return null;
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

        // Header Quotation Badge
        const headerCount = document.getElementById('header-q-count');
        if (headerCount) {
            headerCount.textContent = count;
            if (count > 0) {
                headerCount.classList.add('visible');
            } else {
                headerCount.classList.remove('visible');
            }
        }

        // Sticky Bottom Quotation Bar (Section 8)
        const barItemsCount = document.getElementById('bar-items-count');
        const barTotalAmount = document.getElementById('bar-total-amount');
        const btnViewQuotation = document.getElementById('btn-bar-view-quotation');

        if (barItemsCount) {
            barItemsCount.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
        }
        if (barTotalAmount) {
            barTotalAmount.textContent = `₹${total.toLocaleString('en-IN')}`;
        }
        if (btnViewQuotation) {
            if (count > 0) {
                btnViewQuotation.disabled = false;
                btnViewQuotation.classList.remove('disabled');
            } else {
                btnViewQuotation.disabled = true;
                btnViewQuotation.classList.add('disabled');
            }
        }

        // Live update in open modal if visible
        const modalCount = document.getElementById('q-modal-items-count');
        const modalGrand = document.getElementById('q-modal-grand-amount');
        if (modalCount) modalCount.textContent = count;
        if (modalGrand) modalGrand.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    // --- 7. UNIFIED QUOTATION MODAL (Section 9) ---
    static openQuotationModal() {
        const count = this.getItemCount();
        if (count === 0) {
            alert('Your quotation is currently empty. Please select crackers to view quotation.');
            return;
        }

        this.renderQuotationModal();
        const modal = document.getElementById('quotation-modal');
        if (modal) {
            modal.classList.add('open');
            if (document.body) document.body.style.overflow = 'hidden';
        }
    }

    static closeQuotationModal() {
        const modal = document.getElementById('quotation-modal');
        if (modal) {
            modal.classList.remove('open');
            if (document.body) document.body.style.overflow = '';
        }
    }

    static renderQuotationModal() {
        const itemsContainer = document.getElementById('quotation-modal-items');
        if (!itemsContainer) return;

        const cart = this.getCart();
        const entries = Object.entries(cart);
        const count = this.getItemCount();
        const total = this.getCartEstimatedTotal();

        this.updateCartBadges();

        if (entries.length === 0) {
            itemsContainer.innerHTML = `
                <div class="q-modal-empty">
                    <p>Your quotation is empty. Please select crackers from the price list.</p>
                    <button type="button" class="btn btn-secondary mt-2" onclick="CartManager.closeQuotationModal()">Browse Crackers</button>
                </div>
            `;
            return;
        }

        let html = '';
        entries.forEach(([id, qty]) => {
            const item = this.getFullItemDetails(id);
            if (!item) return;

            const name = item.name || item.nameEn;
            const comp = item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS');
            const unitPriceNum = (item.price && item.price.includes('₹'))
                ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
                : 0;
            const lineSubtotal = unitPriceNum * qty;

            html += `
                <div class="q-modal-row" id="qmodal-row-${id}">
                    <div class="q-row-info">
                        <span class="q-row-name">${name}</span>
                        <span class="q-row-comp">${comp}</span>
                    </div>
                    <div class="q-row-stepper">
                        <button type="button" class="stepper-btn minus" onclick="App.changeQty('${id}', -1)">−</button>
                        <span class="stepper-val">${qty}</span>
                        <button type="button" class="stepper-btn plus" onclick="App.changeQty('${id}', 1)">+</button>
                    </div>
                    <div class="q-row-pricing">
                        <span class="q-row-calc">₹${unitPriceNum.toLocaleString('en-IN')} × ${qty}</span>
                        <strong class="q-row-subtotal">₹${lineSubtotal.toLocaleString('en-IN')}</strong>
                    </div>
                </div>
            `;
        });

        itemsContainer.innerHTML = html;
    }

    // --- 8. SEND REQUIREMENT ON WHATSAPP (Section 9) ---
    static handleSendRequirement(event) {
        if (event) event.preventDefault();

        const count = this.getItemCount();
        if (count === 0) {
            alert('Your quotation is empty.');
            return;
        }

        // Validate form fields
        const name = (document.getElementById('cust-name').value || '').trim();
        const phone = (document.getElementById('cust-phone').value || '').trim();
        const address = (document.getElementById('cust-address').value || '').trim();
        const city = (document.getElementById('cust-city').value || '').trim();
        const state = (document.getElementById('cust-state').value || '').trim() || 'Tamil Nadu';
        const pincode = (document.getElementById('cust-pincode').value || '').trim();
        const notes = (document.getElementById('cust-notes').value || '').trim();

        if (!name || !phone || !address || !city || !pincode) {
            alert('Please fill in all required customer details (*).');
            return;
        }

        const phoneClean = phone.replace(/[^0-9]/g, '');
        if (phoneClean.length < 10) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }

        // Compile items
        const cart = this.getCart();
        const items = [];
        let grandTotal = 0;
        let totalItems = 0;

        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (item) {
                let unitPriceNum = 0;
                if (item.price && item.price.includes('₹')) {
                    unitPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                }
                const lineTotal = unitPriceNum * qty;
                grandTotal += lineTotal;
                totalItems += qty;

                items.push({
                    id: item.id,
                    name: item.name || item.nameEn,
                    company: item.company || (item.category === 'gift_boxes' ? 'PRANAV' : 'KALIS'),
                    price: item.price || 'Contact',
                    unitPriceNum: unitPriceNum,
                    quantity: qty,
                    lineTotalNum: lineTotal
                });
            }
        }

        // Generate Quotation Reference
        const quotationId = this.generateQuotationId();

        const order = {
            id: quotationId,
            customerName: name,
            phone: phoneClean,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            notes: notes,
            items: items,
            itemsCount: totalItems,
            estimatedTotal: grandTotal,
            confirmedPayableAmount: grandTotal,
            status: 'UNDER REVIEW',
            createdAt: new Date().toISOString()
        };

        // Save into local data store
        DataStore.saveOrder(order);

        // Build WhatsApp pre-filled message (Section 9)
        const settings = DataStore.getSettings();
        const waNumber = settings.whatsappPhoneRaw || '919385787363';

        const itemLines = items.map((it, idx) => {
            const unitText = `₹${it.unitPriceNum.toLocaleString('en-IN')}`;
            const subtotalText = `₹${it.lineTotalNum.toLocaleString('en-IN')}`;
            return `${idx + 1}. ${it.name}\n   ${it.company}\n   ${unitText} × ${it.quantity} = ${subtotalText}`;
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
            `State: ${order.state}`,
            `PIN Code: ${order.pincode}`,
            ``,
            `SELECTED CRACKERS`,
            ``,
            itemLines,
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
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMsg)}`;

        // Clear cart
        this.clearCart();

        // Close Quotation Modal
        this.closeQuotationModal();

        // Open WhatsApp
        window.open(waUrl, '_blank');

        // Show Requirement Prepared confirmation screen
        this.showRequirementPrepared(order);
    }

    static showRequirementPrepared(order) {
        const modal = document.getElementById('order-confirmation-modal');
        const content = document.getElementById('order-confirmation-content');
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="confirmation-box">
                <div class="confirmation-icon">✓</div>
                <h3 class="confirmation-title">Requirement Prepared</h3>
                <div class="confirmation-ref-box">
                    <span class="ref-label">Quotation Reference:</span>
                    <strong class="ref-val">${order.id}</strong>
                </div>
                <p class="confirmation-msg">
                    Your estimated quotation requirement has been opened in WhatsApp. Please press <strong>Send</strong> inside WhatsApp so our Sivakasi desk can confirm product availability and final amount.
                </p>
                <div class="confirmation-actions">
                    <button type="button" class="btn btn-secondary full-width" onclick="CartManager.closeConfirmationModal()">
                        Continue Browsing Crackers
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('open');
        if (document.body) document.body.style.overflow = 'hidden';
    }

    static closeConfirmationModal() {
        const modal = document.getElementById('order-confirmation-modal');
        if (modal) {
            modal.classList.remove('open');
            if (document.body) document.body.style.overflow = '';
        }
    }

    // --- 9. TRACK QUOTATION / REQUIREMENT ---
    static openTrackOrderModal(initialId = '') {
        const modal = document.getElementById('track-order-modal');
        if (!modal) return;
        modal.classList.add('open');
        if (document.body) document.body.style.overflow = 'hidden';

        const input = document.getElementById('track-query-input');
        if (input) {
            input.value = initialId;
            if (initialId) this.lookupOrder(initialId);
        }
    }

    static closeTrackOrderModal() {
        const modal = document.getElementById('track-order-modal');
        if (modal) {
            modal.classList.remove('open');
            if (document.body) document.body.style.overflow = '';
        }
    }

    static handleTrackLookup(event) {
        if (event) event.preventDefault();
        const query = (document.getElementById('track-query-input').value || '').trim();
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
                    <small class="text-muted">Please double-check your Reference Number (e.g. PCQ-260915-1042) or mobile number.</small>
                </div>
            `;
            return;
        }

        resultContainer.innerHTML = `
            <div class="track-order-card">
                <div class="track-card-header">
                    <div>
                        <span class="text-muted">Quotation ID:</span>
                        <strong class="gold-text">${order.id}</strong>
                    </div>
                    <div class="order-status-pill">${order.status}</div>
                </div>

                <div class="track-details-grid">
                    <div><strong>Customer:</strong> ${order.customerName}</div>
                    <div><strong>Phone:</strong> ${order.phone}</div>
                    <div><strong>Address:</strong> ${order.address}, ${order.city} – ${order.pincode}</div>
                    <div><strong>Total:</strong> <strong class="gold-price">₹${order.estimatedTotal.toLocaleString('en-IN')}</strong></div>
                </div>

                <div class="track-items-box">
                    <div class="track-items-title">Selected Crackers (${order.itemsCount} items)</div>
                    ${(order.items || []).map(it => `
                        <div class="track-item-row">
                            <span>${it.name} (${it.company || 'KALIS'}) × ${it.quantity}</span>
                            <strong>₹${(it.lineTotalNum || 0).toLocaleString('en-IN')}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Window global assignment
window.CartManager = CartManager;
window.EnquiryManager = CartManager;
