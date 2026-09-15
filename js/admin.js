/**
 * PRANAV CRACKERS - Owner Admin Management Panel
 * Separate, secure management view for Orders, Discounts, Products, Gift Boxes, Prices, and Settings.
 */

class AdminManager {
    static isAuthenticated() {
        return sessionStorage.getItem('pranav_admin_authenticated') === 'true';
    }

    static authenticate(pin) {
        const settings = DataStore.getSettings();
        if (pin === settings.adminPin || pin === 'pranav123') {
            sessionStorage.setItem('pranav_admin_authenticated', 'true');
            return true;
        }
        return false;
    }

    static logout() {
        sessionStorage.removeItem('pranav_admin_authenticated');
        this.renderPanel();
    }

    static openAdminModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.classList.add('open');
            this.renderPanel();
        }
    }

    static closeAdminModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.classList.remove('open');
        }
    }

    static renderPanel() {
        const container = document.getElementById('admin-modal-content');
        if (!container) return;

        if (!this.isAuthenticated()) {
            container.innerHTML = `
                <div class="admin-auth-box">
                    <h3>PRANAV CRACKERS - Admin Login</h3>
                    <p>Enter your passcode to access orders, discount requests, and catalogue prices.</p>
                    <form id="admin-login-form" onsubmit="event.preventDefault(); AdminManager.handleLogin();">
                        <div class="form-group">
                            <label for="admin-pin-input">Passcode</label>
                            <input type="password" id="admin-pin-input" class="form-control" placeholder="Enter PIN (Default: pranav123)" required autofocus>
                        </div>
                        <div id="admin-auth-error" class="auth-error-msg" style="display:none;">Incorrect passcode. Please try again.</div>
                        <button type="submit" class="btn btn-primary full-width mt-2">Unlock Dashboard</button>
                    </form>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="admin-dashboard-layout">
                <div class="admin-header">
                    <div>
                        <h3>PRANAV CRACKERS Admin Portal</h3>
                        <p class="text-muted">Manage customer orders, discount requests, pricing, and gift boxes.</p>
                    </div>
                    <div class="admin-header-actions">
                        <button class="btn btn-sm btn-secondary" onclick="AdminManager.resetDefaults()">Reset Defaults</button>
                        <button class="btn btn-sm btn-danger-outline" onclick="AdminManager.logout()">Logout</button>
                    </div>
                </div>

                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="orders" onclick="AdminManager.switchTab('orders')">Orders (${DataStore.getOrders().length})</button>
                    <button class="admin-tab" data-tab="discounts" onclick="AdminManager.switchTab('discounts')">Discounts (${DataStore.getDiscountRequests().length})</button>
                    <button class="admin-tab" data-tab="giftboxes" onclick="AdminManager.switchTab('giftboxes')">Gift Boxes (9)</button>
                    <button class="admin-tab" data-tab="products" onclick="AdminManager.switchTab('products')">Products</button>
                    <button class="admin-tab" data-tab="prices" onclick="AdminManager.switchTab('prices')">Quick Prices</button>
                    <button class="admin-tab" data-tab="settings" onclick="AdminManager.switchTab('settings')">Settings</button>
                </div>

                <div id="admin-tab-body" class="admin-tab-content">
                    <!-- Dynamic Tab Body -->
                </div>
            </div>
        `;

        this.switchTab('orders');
    }

    static handleLogin() {
        const pinInput = document.getElementById('admin-pin-input');
        const errEl = document.getElementById('admin-auth-error');
        if (pinInput && this.authenticate(pinInput.value.trim())) {
            this.renderPanel();
        } else {
            if (errEl) errEl.style.display = 'block';
        }
    }

    static switchTab(tabName) {
        document.querySelectorAll('.admin-tab').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
        });

        const body = document.getElementById('admin-tab-body');
        if (!body) return;

        switch (tabName) {
            case 'orders':
                this.renderOrdersTab(body);
                break;
            case 'discounts':
                this.renderDiscountsTab(body);
                break;
            case 'giftboxes':
                this.renderGiftBoxesTab(body);
                break;
            case 'products':
                this.renderProductsTab(body);
                break;
            case 'prices':
                this.renderPricesTab(body);
                break;
            case 'settings':
                this.renderSettingsTab(body);
                break;
        }
    }

    // --- 1. Orders Management Tab ---
    static renderOrdersTab(container) {
        const orders = DataStore.getOrders();

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="admin-empty-box">
                    <p class="text-muted">No customer orders placed yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="admin-section-header">
                <h4>Customer Orders (${orders.length})</h4>
            </div>

            <div class="admin-orders-list">
                ${orders.map(order => `
                    <div class="admin-order-card" id="admin-ord-${order.id}">
                        <div class="admin-order-header">
                            <div>
                                <strong class="gold-text font-bold">${order.id}</strong>
                                <span class="text-muted"> • ${new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <div class="admin-order-status-group">
                                <span class="order-status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
                                <span class="badge ${order.paymentStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}">${order.paymentStatus}</span>
                            </div>
                        </div>

                        <div class="admin-order-customer-row">
                            <div><strong>Customer:</strong> ${order.customerName}</div>
                            <div><strong>Phone:</strong> <a href="tel:${order.phone}" class="link-phone">${order.phone}</a></div>
                            <div><strong>Delivery Address:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</div>
                            ${order.notes ? `<div><strong>Notes:</strong> <span class="text-warning">${order.notes}</span></div>` : ''}
                        </div>

                        <div class="admin-order-items-table-wrapper">
                            <table class="admin-order-items-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Pack</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(it => `
                                        <tr>
                                            <td><strong>${it.name}</strong></td>
                                            <td>${it.packSize}</td>
                                            <td><strong>${it.quantity}</strong></td>
                                            <td>${it.price}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="admin-order-footer">
                            <div class="admin-order-totals">
                                <span>Estimated: ₹${order.estimatedTotal.toLocaleString('en-IN')}</span> |
                                <strong>Confirmed Payable: ₹${(order.confirmedPayableAmount || order.estimatedTotal).toLocaleString('en-IN')}</strong>
                            </div>

                            <div class="admin-order-action-buttons">
                                <button class="btn btn-sm btn-whatsapp" onclick="AdminManager.contactCustomerWhatsApp('${order.id}')">
                                    WhatsApp Customer
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="AdminManager.promptConfirmOrder('${order.id}')">
                                    Confirm / Adjust Price
                                </button>
                                <select class="form-control form-control-sm" onchange="AdminManager.updateOrderStatus('${order.id}', this.value)" style="width:auto; display:inline-block;">
                                    <option value="UNDER REVIEW" ${order.status === 'UNDER REVIEW' ? 'selected' : ''}>UNDER REVIEW</option>
                                    <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                                    <option value="PAYMENT PENDING" ${order.status === 'PAYMENT PENDING' ? 'selected' : ''}>PAYMENT PENDING</option>
                                    <option value="PAID" ${order.paymentStatus === 'Paid' ? 'selected' : ''}>PAID</option>
                                    <option value="PROCESSING" ${order.status === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
                                    <option value="READY" ${order.status === 'READY' ? 'selected' : ''}>READY</option>
                                    <option value="COMPLETED" ${order.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                                    <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    static promptConfirmOrder(orderId) {
        const order = DataStore.getOrderById(orderId);
        if (!order) return;

        const currentAmt = order.confirmedPayableAmount || order.estimatedTotal || 0;
        const input = prompt(`Enter final confirmed payable amount for Order ${order.id}:`, currentAmt);
        if (input === null) return;

        const cleanAmt = parseFloat(input.replace(/[^0-9.]/g, '')) || currentAmt;

        DataStore.updateOrder(order.id, {
            confirmedPayableAmount: cleanAmt,
            status: 'CONFIRMED',
            paymentStatus: 'Payment Pending'
        });

        this.renderOrdersTab(document.getElementById('admin-tab-body'));
        App.showToast(`Order ${order.id} confirmed for ₹${cleanAmt.toLocaleString('en-IN')}`);
    }

    static updateOrderStatus(orderId, newStatus) {
        const updateFields = { status: newStatus };
        if (newStatus === 'PAID') {
            updateFields.paymentStatus = 'Paid';
            updateFields.status = 'PROCESSING';
        }

        DataStore.updateOrder(orderId, updateFields);
        this.renderOrdersTab(document.getElementById('admin-tab-body'));
        App.showToast(`Order status updated to ${newStatus}`);
    }

    static contactCustomerWhatsApp(orderId) {
        const order = DataStore.getOrderById(orderId);
        if (!order) return;

        const rawPhone = order.phone.replace(/[^0-9]/g, '');
        const targetPhone = rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone;
        const msg = `Hello ${order.customerName},\n\nRegarding your PRANAV CRACKERS Order *${order.id}*:\nFinal Amount: ₹${(order.confirmedPayableAmount || order.estimatedTotal).toLocaleString('en-IN')}\nStatus: ${order.status}\n\nWe are pleased to confirm your order details.`;
        window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    // --- 2. Discount Requests Tab ---
    static renderDiscountsTab(container) {
        const discounts = DataStore.getDiscountRequests();

        if (discounts.length === 0) {
            container.innerHTML = `<div class="admin-empty-box"><p class="text-muted">No discount requests received yet.</p></div>`;
            return;
        }

        container.innerHTML = `
            <div class="admin-section-header">
                <h4>Customer Discount Requests (${discounts.length})</h4>
            </div>

            <div class="admin-orders-list">
                ${discounts.map(d => `
                    <div class="admin-order-card">
                        <div class="admin-order-header">
                            <div><strong>${d.customerName}</strong> (${d.phone})</div>
                            <span class="order-status-pill status-${(d.status || 'pending').toLowerCase()}">${d.status}</span>
                        </div>
                        <div class="p-2">
                            <div><strong>Requested Products:</strong> ${d.items}</div>
                            <div><strong>Message / Target:</strong> ${d.message}</div>
                            ${d.approvedPrice ? `<div><strong>Approved Offer Price:</strong> <strong class="gold-text">${d.approvedPrice}</strong></div>` : ''}
                        </div>
                        <div class="admin-order-footer">
                            <span class="text-muted">${new Date(d.createdAt).toLocaleString()}</span>
                            <div class="admin-order-action-buttons">
                                <button class="btn btn-sm btn-whatsapp" onclick="window.open('https://wa.me/91${d.phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hello ' + d.customerName + ', regarding your discount request on PRANAV CRACKERS...')}', '_blank')">
                                    Chat
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="AdminManager.approveDiscount('${d.id}')">
                                    Approve Special Price
                                </button>
                                <button class="btn btn-sm btn-danger-outline" onclick="AdminManager.rejectDiscount('${d.id}')">
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    static approveDiscount(reqId) {
        const price = prompt('Enter approved special price / discount details:');
        if (!price) return;

        DataStore.updateDiscountRequest(reqId, {
            status: 'APPROVED',
            approvedPrice: price.trim()
        });

        this.renderDiscountsTab(document.getElementById('admin-tab-body'));
        App.showToast('Discount request approved with custom price');
    }

    static rejectDiscount(reqId) {
        DataStore.updateDiscountRequest(reqId, { status: 'REJECTED' });
        this.renderDiscountsTab(document.getElementById('admin-tab-body'));
        App.showToast('Discount request rejected');
    }

    // --- 3. Gift Boxes Tab ---
    static renderGiftBoxesTab(container) {
        const boxes = DataStore.getGiftBoxes();
        boxes.sort((a, b) => (a.itemCountNumber || 0) - (b.itemCountNumber || 0));

        container.innerHTML = `
            <div class="admin-section-header">
                <h4>Official Gift Boxes (${boxes.length})</h4>
                <button class="btn btn-sm btn-primary" onclick="AdminManager.showGiftBoxForm()">+ Add New Gift Box</button>
            </div>

            <div id="giftbox-form-container" class="admin-form-card" style="display:none;">
                <h5 id="giftbox-form-title">Edit Gift Box</h5>
                <form id="giftbox-crud-form" onsubmit="event.preventDefault(); AdminManager.saveGiftBox();">
                    <input type="hidden" id="gb-id">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>City / Name (English)*</label>
                            <input type="text" id="gb-name-en" class="form-control" required placeholder="e.g. ITALY">
                        </div>
                        <div class="form-group">
                            <label>City / Name (Tamil)*</label>
                            <input type="text" id="gb-name-ta" class="form-control" required placeholder="e.g. இத்தாலி">
                        </div>
                        <div class="form-group">
                            <label>Total Items Count (Number)*</label>
                            <input type="number" id="gb-count-num" class="form-control" required placeholder="e.g. 35">
                        </div>
                        <div class="form-group">
                            <label>Wholesale Selling Price (e.g. ₹700 or blank for Contact for Price)</label>
                            <input type="text" id="gb-price" class="form-control" placeholder="e.g. ₹700">
                        </div>
                        <div class="form-group">
                            <label>Filter Range Group</label>
                            <select id="gb-filter-group" class="form-control">
                                <option value="16-30">16–30 Items</option>
                                <option value="35-50">35–50 Items</option>
                                <option value="60-70">60–70 Items</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Availability</label>
                            <select id="gb-available" class="form-control">
                                <option value="true">Available</option>
                                <option value="false">Currently Unavailable</option>
                            </select>
                        </div>
                        <div class="form-group full-width">
                            <label>Included Contents Breakdown (Format: <code>01 | Flower Pot Big (5 Pcs) | 1 Box</code>)</label>
                            <textarea id="gb-items-list" class="form-control" rows="6"></textarea>
                        </div>
                    </div>
                    <div class="form-actions mt-3">
                        <button type="submit" class="btn btn-primary">Save Gift Box</button>
                        <button type="button" class="btn btn-secondary" onclick="AdminManager.hideGiftBoxForm()">Cancel</button>
                    </div>
                </form>
            </div>

            <div class="admin-table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>Items Count</th>
                            <th>Current Price</th>
                            <th>Availability</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${boxes.map(g => `
                            <tr>
                                <td><strong>${g.city || g.nameEn}</strong><br><small class="text-muted">${g.nameTa || ''}</small></td>
                                <td><span class="badge badge-gold">${g.itemCountNumber} ITEMS</span></td>
                                <td><strong class="gold-text">${g.price ? g.price : 'Contact for Price'}</strong></td>
                                <td><span class="status-pill ${g.isAvailable !== false ? 'in-stock' : 'out-stock'}">${g.isAvailable !== false ? 'Available' : 'Unavailable'}</span></td>
                                <td>
                                    <button class="btn-action-edit" onclick="AdminManager.editGiftBox('${g.id}')">Edit</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    static showGiftBoxForm(gb = null) {
        const formBox = document.getElementById('giftbox-form-container');
        if (!formBox) return;
        formBox.style.display = 'block';

        if (gb) {
            document.getElementById('giftbox-form-title').textContent = 'Edit Gift Box: ' + (gb.city || gb.nameEn);
            document.getElementById('gb-id').value = gb.id;
            document.getElementById('gb-name-en').value = gb.city || gb.nameEn;
            document.getElementById('gb-name-ta').value = gb.nameTa || '';
            document.getElementById('gb-count-num').value = gb.itemCountNumber || 16;
            document.getElementById('gb-price').value = gb.price || '';
            document.getElementById('gb-filter-group').value = gb.filterGroup || '16-30';
            document.getElementById('gb-available').value = gb.isAvailable !== false ? 'true' : 'false';
            
            const contentsText = (gb.contents || []).map(c => `${c.no} | ${c.name} | ${c.qty}`).join('\n');
            document.getElementById('gb-items-list').value = contentsText;
        } else {
            document.getElementById('giftbox-form-title').textContent = 'Add Gift Box';
            document.getElementById('gb-id').value = '';
            document.getElementById('giftbox-crud-form').reset();
        }
        formBox.scrollIntoView({ behavior: 'smooth' });
    }

    static hideGiftBoxForm() {
        const formBox = document.getElementById('giftbox-form-container');
        if (formBox) formBox.style.display = 'none';
    }

    static saveGiftBox() {
        const id = document.getElementById('gb-id').value || 'gb-' + Date.now();
        const cityName = document.getElementById('gb-name-en').value.trim().toUpperCase();
        const nameTa = document.getElementById('gb-name-ta').value.trim();
        const itemCountNum = parseInt(document.getElementById('gb-count-num').value, 10) || 16;
        const price = document.getElementById('gb-price').value.trim();
        const filterGroup = document.getElementById('gb-filter-group').value;
        const isAvailable = document.getElementById('gb-available').value === 'true';
        const itemsRaw = document.getElementById('gb-items-list').value.split('\n').filter(s => s.trim());

        const parsedContents = itemsRaw.map((line, idx) => {
            const parts = line.split('|').map(p => p.trim());
            return {
                no: parts[0] || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`),
                name: DataStore.standardizeProductName(parts[1] || parts[0]),
                qty: parts[2] ? parts[2].replace(/\bBOX\b/gi, 'Box').replace(/\bPCS\b/gi, 'Pcs').replace(/\bPKT\b/gi, 'Pkt').replace(/\bROLL\b/gi, 'Roll') : '1 Box'
            };
        });

        let boxes = DataStore.getGiftBoxes();
        const idx = boxes.findIndex(g => g.id === id);

        const newBox = {
            id,
            city: cityName,
            nameEn: cityName,
            nameTa: nameTa || cityName,
            itemCountNumber: itemCountNum,
            itemCount: `${itemCountNum} Items`,
            itemCountTa: `${itemCountNum} பொருட்கள்`,
            filterGroup,
            category: 'gift_boxes',
            price,
            descriptionEn: `${itemCountNum}-item special festive gift box.`,
            descriptionTa: `${itemCountNum} ரகங்கள் கொண்ட சிறப்பு தீபாவளி கிஃப்ட் பாக்ஸ்.`,
            image: 'assets/images/gift_box.jpg',
            contents: parsedContents,
            isAvailable
        };

        if (idx >= 0) {
            boxes[idx] = newBox;
        } else {
            boxes.push(newBox);
        }

        DataStore.setGiftBoxes(boxes);
        this.hideGiftBoxForm();
        this.renderGiftBoxesTab(document.getElementById('admin-tab-body'));
        App.refreshCatalog();
        App.showToast('Gift Box saved');
    }

    static editGiftBox(id) {
        const gb = DataStore.getGiftBoxes().find(g => g.id === id);
        if (gb) this.showGiftBoxForm(gb);
    }

    // --- 4. Products Tab ---
    static renderProductsTab(container) {
        const products = DataStore.getProducts();

        container.innerHTML = `
            <div class="admin-section-header">
                <h4>Fireworks Products (${products.length})</h4>
                <button class="btn btn-sm btn-primary" onclick="AdminManager.showProductForm()">+ Add New Product</button>
            </div>

            <div id="product-form-container" class="admin-form-card" style="display:none;">
                <h5 id="product-form-title">Edit Product</h5>
                <form id="product-crud-form" onsubmit="event.preventDefault(); AdminManager.saveProduct();">
                    <input type="hidden" id="prod-id">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Product Name (English)*</label>
                            <input type="text" id="prod-name-en" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Product Name (Tamil)*</label>
                            <input type="text" id="prod-name-ta" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Wholesale Price (e.g. ₹85)*</label>
                            <input type="text" id="prod-price" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Pack Size*</label>
                            <input type="text" id="prod-pack-en" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Availability</label>
                            <select id="prod-available" class="form-control">
                                <option value="true">Available</option>
                                <option value="false">Currently Unavailable</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions mt-3">
                        <button type="submit" class="btn btn-primary">Save Product</button>
                        <button type="button" class="btn btn-secondary" onclick="AdminManager.hideProductForm()">Cancel</button>
                    </div>
                </form>
            </div>

            <div class="admin-table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Pack Size</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(p => `
                            <tr>
                                <td><strong>${p.nameEn}</strong><br><small class="text-muted">${p.nameTa || ''}</small></td>
                                <td><span class="badge badge-cat">${p.category}</span></td>
                                <td>${p.packSize}</td>
                                <td><strong class="gold-text">${p.price}</strong></td>
                                <td><span class="status-pill ${p.isAvailable !== false ? 'in-stock' : 'out-stock'}">${p.isAvailable !== false ? 'Available' : 'Unavailable'}</span></td>
                                <td>
                                    <button class="btn-action-edit" onclick="AdminManager.editProduct('${p.id}')">Edit</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    static showProductForm(prod = null) {
        const formBox = document.getElementById('product-form-container');
        if (!formBox) return;
        formBox.style.display = 'block';

        if (prod) {
            document.getElementById('product-form-title').textContent = 'Edit Product: ' + prod.nameEn;
            document.getElementById('prod-id').value = prod.id;
            document.getElementById('prod-name-en').value = prod.nameEn || '';
            document.getElementById('prod-name-ta').value = prod.nameTa || '';
            document.getElementById('prod-price').value = prod.price || '';
            document.getElementById('prod-pack-en').value = prod.packSize || '';
            document.getElementById('prod-available').value = prod.isAvailable !== false ? 'true' : 'false';
        } else {
            document.getElementById('product-form-title').textContent = 'Add Product';
            document.getElementById('prod-id').value = '';
            document.getElementById('product-crud-form').reset();
        }
    }

    static hideProductForm() {
        const formBox = document.getElementById('product-form-container');
        if (formBox) formBox.style.display = 'none';
    }

    static saveProduct() {
        const id = document.getElementById('prod-id').value || 'prod-' + Date.now();
        const rawNameEn = document.getElementById('prod-name-en').value.trim();
        const nameEn = DataStore.standardizeProductName(rawNameEn);
        const nameTa = document.getElementById('prod-name-ta').value.trim();
        const price = document.getElementById('prod-price').value.trim();
        const packSize = document.getElementById('prod-pack-en').value.trim().replace(/\bPCS\b/gi, 'Pcs');
        const isAvailable = document.getElementById('prod-available').value === 'true';

        let products = DataStore.getProducts();
        const idx = products.findIndex(p => p.id === id);

        if (idx >= 0) {
            products[idx] = { ...products[idx], nameEn, nameTa, price, packSize, isAvailable };
        }

        DataStore.setProducts(products);
        this.hideProductForm();
        this.renderProductsTab(document.getElementById('admin-tab-body'));
        App.refreshCatalog();
        App.showToast('Product updated');
    }

    static editProduct(id) {
        const prod = DataStore.getProducts().find(p => p.id === id);
        if (prod) this.showProductForm(prod);
    }

    // --- 5. Quick Prices Tab ---
    static renderPricesTab(container) {
        const products = DataStore.getProducts();
        const giftBoxes = DataStore.getGiftBoxes();

        container.innerHTML = `
            <div class="admin-section-header">
                <h4>Quick Price Manager</h4>
                <p class="text-muted">Live update wholesale rates for customer visibility.</p>
            </div>

            <form id="bulk-price-form" onsubmit="event.preventDefault(); AdminManager.saveBulkPrices();">
                <div class="admin-table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Type</th>
                                <th>Current Price</th>
                                <th>New Price (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${giftBoxes.map(g => `
                                <tr>
                                    <td><strong>Gift Box: ${g.city || g.nameEn} (${g.itemCount})</strong></td>
                                    <td><span class="badge badge-gold">Gift Box</span></td>
                                    <td>${g.price || 'Contact for Price'}</td>
                                    <td><input type="text" name="price_gb_${g.id}" class="form-control form-control-sm" value="${g.price || ''}" placeholder="e.g. ₹700" style="max-width:140px;"></td>
                                </tr>
                            `).join('')}
                            ${products.map(p => `
                                <tr>
                                    <td><strong>${p.nameEn}</strong></td>
                                    <td><span class="badge badge-cat">${p.category}</span></td>
                                    <td>${p.price}</td>
                                    <td><input type="text" name="price_prod_${p.id}" class="form-control form-control-sm" value="${p.price}" style="max-width:140px;"></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="mt-3">
                    <button type="submit" class="btn btn-primary">SAVE ALL PRICES</button>
                </div>
            </form>
        `;
    }

    static saveBulkPrices() {
        const form = document.getElementById('bulk-price-form');
        const formData = new FormData(form);

        let products = DataStore.getProducts();
        let giftBoxes = DataStore.getGiftBoxes();

        giftBoxes.forEach(g => {
            const val = formData.get(`price_gb_${g.id}`);
            if (val !== null) g.price = val.trim();
        });

        products.forEach(p => {
            const val = formData.get(`price_prod_${p.id}`);
            if (val !== null) p.price = val.trim();
        });

        DataStore.setGiftBoxes(giftBoxes);
        DataStore.setProducts(products);
        App.refreshCatalog();
        App.showToast('All customer prices updated successfully');
    }

    // --- 6. Settings Tab ---
    static renderSettingsTab(container) {
        const settings = DataStore.getSettings();

        container.innerHTML = `
            <div class="admin-section-header">
                <h4>Website & Payment Settings</h4>
            </div>

            <form id="admin-settings-form" onsubmit="event.preventDefault(); AdminManager.saveSettings();">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Primary Phone Number</label>
                        <input type="text" id="set-phone1" class="form-control" value="${settings.primaryPhone}">
                    </div>
                    <div class="form-group">
                        <label>Secondary Phone Number</label>
                        <input type="text" id="set-phone2" class="form-control" value="${settings.secondaryPhone}">
                    </div>
                    <div class="form-group">
                        <label>UPI ID (For Post-Confirmation Payments)</label>
                        <input type="text" id="set-upi" class="form-control" value="${settings.upiId || 'pranavcrackers@upi'}">
                    </div>
                    <div class="form-group">
                        <label>Admin Login Passcode</label>
                        <input type="text" id="set-pin" class="form-control" value="${settings.adminPin || 'pranav123'}">
                    </div>
                    <div class="form-group full-width">
                        <label>Bank Transfer Details</label>
                        <input type="text" id="set-bank" class="form-control" value="${settings.bankDetails || ''}">
                    </div>
                </div>
                <div class="mt-3">
                    <button type="submit" class="btn btn-primary">SAVE SETTINGS</button>
                </div>
            </form>
        `;
    }

    static saveSettings() {
        const settings = DataStore.getSettings();
        settings.primaryPhone = document.getElementById('set-phone1').value.trim();
        settings.secondaryPhone = document.getElementById('set-phone2').value.trim();
        settings.upiId = document.getElementById('set-upi').value.trim();
        settings.adminPin = document.getElementById('set-pin').value.trim();
        settings.bankDetails = document.getElementById('set-bank').value.trim();

        DataStore.setSettings(settings);
        App.showToast('Settings saved');
    }

    static resetDefaults() {
        if (!confirm('Reset all catalog prices and settings to default?')) return;
        DataStore.resetAll();
        this.renderPanel();
        App.refreshCatalog();
        App.showToast('Reset to default');
    }
}
