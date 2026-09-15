/**
 * PRANAV CRACKERS - Cart, Live Quotation & WhatsApp Engine
 * Ultra-fast digital price list quotation flow with instant tactile updates and accurate Sivakasi savings calculation.
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

    static addToCart(itemId, qty = 1) {
        return this.changeQty(itemId, qty);
    }

    static clearCart() {
        localStorage.removeItem(STORAGE_KEYS.CART);
        this.updateCartBadges();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {} } }));
        if (typeof App !== 'undefined' && App.syncAllSteppers) {
            App.syncAllSteppers();
        }
    }

    static getItemCount() {
        const cart = this.getCart();
        return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
    }

    static getCartTotals() {
        const cart = this.getCart();
        let totalWholesale = 0;
        let totalMRP = 0;

        for (const [id, qty] of Object.entries(cart)) {
            const item = this.getFullItemDetails(id);
            if (item && item.price && item.price.includes('₹')) {
                const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                const mrp = (typeof App !== 'undefined' && App.calculateMRP) 
                    ? App.calculateMRP(priceNum) 
                    : Math.round(priceNum * 2.5);
                totalWholesale += priceNum * qty;
                totalMRP += mrp * qty;
            }
        }

        const savings = Math.max(0, totalMRP - totalWholesale);

        return {
            wholesale: totalWholesale,
            mrp: totalMRP,
            savings: savings
        };
    }

    static getCartEstimatedTotal() {
        return this.getCartTotals().wholesale;
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
        if (typeof document === 'undefined') return;
        const count = this.getItemCount();
        const { wholesale, mrp, savings } = this.getCartTotals();

        // 1. Header Quotation Badge
        const headerBadge = document.getElementById('header-cart-badge') || document.getElementById('header-q-count');
        if (headerBadge) {
            headerBadge.textContent = count;
            if (count > 0) {
                headerBadge.classList.add('visible');
            } else {
                headerBadge.classList.remove('visible');
            }
        }

        // 2. Floating Quotation Dock
        const dockCount = document.getElementById('dock-items-count');
        const dockPrice = document.getElementById('dock-total-price');
        const dockSavings = document.getElementById('dock-savings-tag');
        const dockBtn = document.getElementById('dock-action-btn');

        const itemLabel = count === 1 
            ? (typeof LanguageManager !== 'undefined' ? LanguageManager.t('itemText') : 'Item') 
            : (typeof LanguageManager !== 'undefined' ? LanguageManager.t('itemsText') : 'Items');

        if (dockCount) {
            dockCount.textContent = `${count} ${itemLabel}`;
        }
        if (dockPrice) {
            dockPrice.textContent = `₹${wholesale.toLocaleString('en-IN')}`;
        }
        if (dockSavings) {
            if (count > 0 && savings > 0) {
                const saveWord = typeof LanguageManager !== 'undefined' ? LanguageManager.t('saveText') : 'Save';
                dockSavings.style.display = 'inline-block';
                dockSavings.textContent = `${saveWord} ₹${savings.toLocaleString('en-IN')} (60% OFF)`;
            } else {
                dockSavings.style.display = 'none';
            }
        }
        if (dockBtn) {
            if (count > 0) {
                dockBtn.disabled = false;
                dockBtn.classList.remove('disabled');
            } else {
                dockBtn.disabled = true;
                dockBtn.classList.add('disabled');
            }
        }

        // 3. Backward-compatible fallback for legacy bar elements
        const legacyItems = document.getElementById('bar-items-count');
        const legacyTotal = document.getElementById('bar-total-amount');
        const legacyBtn = document.getElementById('btn-bar-view-quotation');
        if (legacyItems) legacyItems.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
        if (legacyTotal) legacyTotal.textContent = `₹${wholesale.toLocaleString('en-IN')}`;
        if (legacyBtn) legacyBtn.disabled = (count === 0);

        // 4. Quotation Modal Totals (if currently open)
        const qSumCount = document.getElementById('q-sum-items-count');
        const qSumMrp = document.getElementById('q-sum-mrp-price');
        const qSumGrand = document.getElementById('q-sum-grand-total');
        const qSumSavingsLine = document.getElementById('q-sum-savings-line');

        if (qSumCount) qSumCount.textContent = count;
        if (qSumMrp) qSumMrp.textContent = `₹${mrp.toLocaleString('en-IN')}`;
        if (qSumGrand) qSumGrand.textContent = `₹${wholesale.toLocaleString('en-IN')}`;
        if (qSumSavingsLine) {
            qSumSavingsLine.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // --- Unified Quotation Modal ---
    static openQuotationModal() {
        const count = this.getItemCount();
        if (count === 0) {
            alert('Your quotation is currently empty. Please select crackers from the catalogue first.');
            return;
        }

        if (!this.currentQuotationId) {
            this.currentQuotationId = this.generateQuotationId();
        }

        const refTag = document.getElementById('q-modal-ref-tag');
        if (refTag) {
            refTag.textContent = `Ref: ${this.currentQuotationId}`;
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
        this.updateCartBadges();

        if (entries.length === 0) {
            itemsContainer.innerHTML = `
                <div class="q-modal-empty" style="text-align:center; padding: 2rem 1rem; color:#64748B;">
                    <p style="font-size:1rem; margin-bottom:0.75rem;">Your quotation is currently empty.</p>
                    <button type="button" class="btn btn-secondary" style="background:#0F1B2F; color:#FFFFFF; padding:0.5rem 1rem; border-radius:6px; font-weight:700; border:none; cursor:pointer;" onclick="CartManager.closeQuotationModal()">Browse Crackers</button>
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
                        <strong class="q-row-name">${name}</strong>
                        <span class="q-row-comp">${comp}</span>
                    </div>
                    <div class="q-row-stepper">
                        <button type="button" class="stepper-btn minus" onclick="App.changeQty('${id}', -1)" aria-label="Decrease">−</button>
                        <span class="stepper-val stepper-val-${id}">${qty}</span>
                        <button type="button" class="stepper-btn plus" onclick="App.changeQty('${id}', 1)" aria-label="Increase">+</button>
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

    // --- Send Requirement on WhatsApp ---
    static placeRequirementAndContinueWhatsApp(event) {
        return this.handleSendRequirement(event);
    }

    static handleSendRequirement(event) {
        if (event) event.preventDefault();

        const count = this.getItemCount();
        if (count === 0) {
            alert('Your quotation is empty. Please select crackers first.');
            return;
        }

        // Validate form fields
        const pending = CartManager.pendingDetails || {};
        const nameInput = document.getElementById('cust-name');
        const name = (nameInput && nameInput.value ? nameInput.value : pending.name || '').trim();
        const phoneInput = document.getElementById('cust-phone');
        const phone = (phoneInput && phoneInput.value ? phoneInput.value : pending.phone || '').trim();
        const addrInput = document.getElementById('cust-address');
        const address = (addrInput && addrInput.value ? addrInput.value : pending.address || '').trim();
        const cityInput = document.getElementById('cust-city');
        const city = (cityInput && cityInput.value ? cityInput.value : pending.city || '').trim();
        const stateInput = document.getElementById('cust-state');
        const state = (stateInput && stateInput.value ? stateInput.value : pending.state || 'Tamil Nadu').trim() || 'Tamil Nadu';
        const pinInput = document.getElementById('cust-pincode');
        const pincode = (pinInput && pinInput.value ? pinInput.value : pending.pincode || '').trim();
        const notesInput = document.getElementById('cust-notes');
        const notes = (notesInput && notesInput.value ? notesInput.value : pending.notes || '').trim();

        if (!name) {
            alert('Please enter your Full Name.');
            if (nameInput) { nameInput.focus(); nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            return;
        }

        const phoneClean = phone.replace(/[^0-9]/g, '');
        if (!phoneClean || phoneClean.length < 10) {
            alert('Please enter a valid 10-digit mobile number.');
            if (phoneInput) { phoneInput.focus(); phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            return;
        }

        if (!address) {
            alert('Please enter your Delivery Address.');
            if (addrInput) { addrInput.focus(); addrInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            return;
        }

        if (!city) {
            alert('Please enter your City / Town.');
            if (cityInput) { cityInput.focus(); cityInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            return;
        }

        if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
            alert('Please enter a valid 6-digit PIN Code.');
            if (pinInput) { pinInput.focus(); pinInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            return;
        }

        // Compile items and calculations
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

        // Use active quotation reference or generate one
        const quotationId = this.currentQuotationId || this.generateQuotationId();

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

        // Save order in local storage
        DataStore.saveOrder(order);

        // Build WhatsApp message
        const settings = DataStore.getSettings();
        const waNumber = settings.whatsappPhoneRaw || '919385787363';

        const itemLines = items.map((it, idx) => {
            const unitText = `₹${it.unitPriceNum.toLocaleString('en-IN')}`;
            const subtotalText = `₹${it.lineTotalNum.toLocaleString('en-IN')}`;
            return `${idx + 1}. ${it.name}\n   Brand: ${it.company}\n   ${unitText} × ${it.quantity} = ${subtotalText}`;
        }).join('\n\n');

        const messageLines = [
            `NEW PRANAV CRACKERS REQUIREMENT`,
            ``,
            `Quotation: ${order.id}`,
            ``,
            `CUSTOMER DETAILS:`,
            `Name: ${order.customerName}`,
            `Mobile: ${order.phone}`,
            `Address: ${order.address}`,
            `City: ${order.city}`,
            `State: ${order.state}`,
            `PIN Code: ${order.pincode}`,
            ``,
            `SELECTED CRACKERS:`,
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

        // Save last WhatsApp URL
        this.lastWaUrl = waUrl;

        // Clear cart and reset reference
        this.clearCart();
        this.currentQuotationId = null;

        // Close Quotation Modal
        this.closeQuotationModal();

        // Show Requirement Prepared confirmation screen first so user is never stranded
        this.showRequirementPrepared(order, waUrl);

        // Open WhatsApp: direct deep-link redirect on mobile, popup with fallback on desktop
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        let opened = false;
        if (!isMobile) {
            try {
                const win = window.open(waUrl, '_blank');
                if (win && !win.closed && typeof win.closed !== 'undefined') {
                    opened = true;
                }
            } catch (e) {
                opened = false;
            }
        }
        if (!opened) {
            try {
                if (typeof window !== 'undefined' && window.location) {
                    window.location.href = waUrl;
                }
            } catch (e) {
                // Fallback for sandboxed or test environments
            }
        }
    }

    static showRequirementPrepared(order, waUrl) {
        const modal = document.getElementById('order-confirmation-modal');
        const content = document.getElementById('order-confirmation-content');
        if (!modal || !content) return;

        const targetWaUrl = waUrl || this.lastWaUrl || `https://wa.me/${(DataStore.getSettings().whatsappPhoneRaw || '919385787363')}`;

        const title = typeof LanguageManager !== 'undefined' ? LanguageManager.t('reqPreparedTitle') : 'Requirement Prepared!';
        const refLabel = typeof LanguageManager !== 'undefined' ? LanguageManager.t('reqPreparedRef') : 'Quotation Reference:';
        const msg = typeof LanguageManager !== 'undefined' ? LanguageManager.t('reqPreparedMsg') : 'Your estimated quotation has been prepared and opened in WhatsApp. Please press <strong>Send</strong> inside WhatsApp to confirm your requirement with our Sivakasi desk.';
        const btnText = typeof LanguageManager !== 'undefined' ? LanguageManager.t('continueBrowsing') : 'Continue Browsing';

        content.innerHTML = `
            <div class="confirmation-box">
                <div class="confirmation-icon">✓</div>
                <h3 class="confirmation-title">${title}</h3>
                <div class="confirmation-ref-box">
                    <span class="ref-label">${refLabel}</span>
                    <strong class="ref-val">${order.id}</strong>
                </div>
                <p class="confirmation-msg">
                    ${msg}
                </p>
                <div class="confirmation-actions" style="display:flex; flex-direction:column; gap:0.75rem; width:100%; margin-top:1rem;">
                    <a href="${targetWaUrl}" target="_blank" class="btn-whatsapp-submit full-width" style="background:#25D366 !important; background-color:#25D366 !important; color:#FFFFFF !important; text-decoration:none; padding:14px 20px; font-weight:900; border-radius:8px; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 18px rgba(37,211,102,0.45);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="color:#FFFFFF !important; flex-shrink:0;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c0 5.514-4.486 10-10 10-1.802 0-3.486-.481-4.945-1.32l-5.055 1.325 1.354-4.944c-.933-1.516-1.354-3.125-1.354-5.061 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                        <span>OPEN IN WHATSAPP TO SEND</span>
                    </a>
                    <button type="button" class="btn btn-secondary full-width" onclick="CartManager.closeConfirmationModal()">
                        ${btnText}
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

    // --- Track Quotation / Requirement ---
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
                <div class="track-not-found" style="text-align:center; padding:1.5rem; background:#FFF5F5; border-radius:8px; border:1px solid #FED7D7;">
                    <p style="color:#C53030; font-weight:700; margin-bottom:0.4rem;">No quotation found matching "${query}"</p>
                    <small style="color:#718096;">Please check your Reference Number (e.g. PCQ-260915-1042) or 10-digit mobile number.</small>
                </div>
            `;
            return;
        }

        resultContainer.innerHTML = `
            <div class="track-order-card" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:1.25rem;">
                <div class="track-card-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #EDF2F7; padding-bottom:0.75rem;">
                    <div>
                        <span style="font-size:0.75rem; color:#64748B; display:block;">Quotation ID</span>
                        <strong style="color:#0F1B2F; font-size:1.1rem;">${order.id}</strong>
                    </div>
                    <div class="order-status-pill" style="background:#FEF3C7; color:#92400E; font-weight:800; font-size:0.75rem; padding:4px 10px; border-radius:9999px;">${order.status}</div>
                </div>

                <div class="track-details-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.85rem; margin-bottom:1rem;">
                    <div><strong>Customer:</strong> ${order.customerName}</div>
                    <div><strong>Phone:</strong> ${order.phone}</div>
                    <div style="grid-column:span 2;"><strong>Address:</strong> ${order.address}, ${order.city} – ${order.pincode}</div>
                    <div><strong>Total Items:</strong> ${order.itemsCount}</div>
                    <div><strong>Wholesale Total:</strong> <strong style="color:#B45309;">₹${order.estimatedTotal.toLocaleString('en-IN')}</strong></div>
                </div>

                <div class="track-items-box" style="background:#F8FAFC; border-radius:8px; padding:0.75rem;">
                    <div style="font-weight:700; font-size:0.82rem; margin-bottom:0.5rem; color:#334155;">Selected Crackers</div>
                    ${(order.items || []).map(it => `
                        <div style="display:flex; justify-content:space-between; font-size:0.82rem; padding:0.25rem 0; border-bottom:1px dashed #E2E8F0;">
                            <span>${it.name} (${it.company || 'KALIS'}) × ${it.quantity}</span>
                            <strong>₹${(it.lineTotalNum || 0).toLocaleString('en-IN')}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Window global assignments
window.CartManager = CartManager;
window.EnquiryManager = CartManager;

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('languageChanged', () => {
        CartManager.updateCartBadges();
    });
}
