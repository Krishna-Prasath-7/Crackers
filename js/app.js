/**
 * =============================================================================
 * PRANAV CRACKERS - FRONTEND APPLICATION CONTROLLER
 * =============================================================================
 * 
 * ROLE OF THIS FILE:
 * - Controls catalogue rendering (reference card layout & rate sheet view)
 * - Category carousel scrolling and filtering
 * - Search bar with live autocomplete
 * - Quantity steppers (+ / - buttons on product cards)
 * - Synchronizing desktop sidebar quotation and mobile bottom dock
 * - Fancy celebratory fireworks burst opening animation
 * =============================================================================
 */

class FancyFireworks {
    static animationId = null;

    static start(canvasId = 'opening-fireworks-canvas', overlayId = 'opening-fireworks-overlay') {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;
        const canvas = document.getElementById(canvasId);
        const overlay = document.getElementById(overlayId);
        if (!canvas || !overlay || typeof canvas.getContext !== 'function') return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        overlay.style.display = 'block';
        overlay.style.opacity = '1';

        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;

        const particles = [];
        const rockets = [];
        const colors = [
            '#F59E0B', '#FBBF24', '#FCD34D', // Festive Gold
            '#2563EB', '#1D4ED8', '#60A5FA', // Royal & Sky Blue
            '#10B981', '#34D399',             // Emerald Savings Green
            '#EF4444', '#F87171'              // Sivakasi Flame
        ];

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                const angle = Math.random() * Math.PI * 2;
                const speed = 2.5 + Math.random() * 6.5;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = 0.016 + Math.random() * 0.018;
                this.size = 2 + Math.random() * 2.5;
            }
            update() {
                this.vx *= 0.96;
                this.vy *= 0.96;
                this.vy += 0.09; // subtle gravity
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        class Rocket {
            constructor(startX, targetX, targetY) {
                this.x = startX;
                this.y = height;
                this.targetX = targetX;
                this.targetY = targetY;
                this.speed = 11 + Math.random() * 4;
                const angle = Math.atan2(targetY - height, targetX - startX);
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
                this.exploded = false;
                this.trail = [];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.trail.push({ x: this.x, y: this.y, alpha: 0.8 });
                if (this.trail.length > 8) this.trail.shift();
                if (this.y <= this.targetY || Math.abs(this.x - this.targetX) < 8) {
                    this.explode();
                }
            }
            explode() {
                this.exploded = true;
                const count = 50 + Math.floor(Math.random() * 30);
                const baseColor = colors[Math.floor(Math.random() * colors.length)];
                for (let i = 0; i < count; i++) {
                    const c = Math.random() > 0.4 ? baseColor : colors[Math.floor(Math.random() * colors.length)];
                    particles.push(new Particle(this.x, this.y, c));
                }
            }
            draw(ctx) {
                ctx.save();
                ctx.fillStyle = '#FCD34D';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#F59E0B';
                this.trail.forEach(t => {
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const launchRocket = () => {
            const startX = width * 0.2 + Math.random() * (width * 0.6);
            const targetX = width * 0.15 + Math.random() * (width * 0.7);
            const targetY = height * 0.18 + Math.random() * (height * 0.35);
            rockets.push(new Rocket(startX, targetX, targetY));
        };

        // Sequential multi-rocket launch
        for (let i = 0; i < 5; i++) {
            setTimeout(launchRocket, i * 350);
        }

        const startTime = Date.now();
        const duration = 2800;

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = rockets.length - 1; i >= 0; i--) {
                const r = rockets[i];
                r.update();
                r.draw(ctx);
                if (r.exploded) rockets.splice(i, 1);
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.alpha <= 0) particles.splice(i, 1);
            }

            if (Date.now() - startTime < duration || particles.length > 0 || rockets.length > 0) {
                FancyFireworks.animationId = requestAnimationFrame(animate);
            } else {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    ctx.clearRect(0, 0, width, height);
                }, 800);
            }
        }

        if (FancyFireworks.animationId) cancelAnimationFrame(FancyFireworks.animationId);
        animate();
    }
}

class App {
    static currentCategory = 'all';
    static searchQuery = '';
    static viewMode = 'table'; // Rate Sheet only (cards removed per user request)

    static categoryGroups = [
        { key: 'all', title: 'All Products', image: 'assets/images/gift_box.jpg' },
        { key: 'sparklers', title: 'Sparklers', image: 'assets/images/sparklers.jpg' },
        { key: 'flower_pots', title: 'Flower Pots', image: 'assets/images/flower_pots.jpg' },
        { key: 'ground_chakkars', title: 'Ground Chakkars', image: 'assets/images/ground_chakkars.jpg' },
        { key: 'sound_crackers', title: 'Sound Crackers', image: 'assets/images/sound_crackers.jpg' },
        { key: 'bombs', title: 'Bombs', image: 'assets/images/bombs.jpg' },
        { key: 'rockets', title: 'Rockets', image: 'assets/images/sky_rockets.jpg' },
        { key: 'sky_shots', title: 'Sky Shots', image: 'assets/images/sky_shots.jpg' },
        { key: 'fancy_items', title: 'Novelties', image: 'assets/images/fancy_items.jpg' },
        { key: 'garlands', title: 'Garlands', image: 'assets/images/garlands.jpg' },
        { key: 'gift_boxes', title: 'Gift Boxes', image: 'assets/images/gift_box.jpg' }
    ];

    static PRODUCT_IMAGES = {
        'fp-01': 'assets/products/fp-01.jpg',
        'fp-02': 'assets/products/fp-02.jpg',
        'fp-03': 'assets/products/fp-03.jpg',
        'pl-4': 'assets/products/pl-4.jpg',
        'pl-5': 'assets/products/pl-5.jpg',
        'pl-6': 'assets/products/pl-6.jpg',
        'pl-7': 'assets/products/pl-7.jpg',
        'pl-8': 'assets/products/pl-8.jpg',
        'pl-9': 'assets/products/pl-9.jpg',
        'pl-10': 'assets/products/pl-10.jpg',
        'gc-01': 'assets/products/gc-01.jpg',
        'pl-12': 'assets/products/pl-12.jpg',
        'pl-13': 'assets/products/pl-13.jpg',
        'pl-14': 'assets/products/pl-14.jpg',
        'pl-15': 'assets/products/pl-15.jpg',
        'pl-16': 'assets/products/pl-16.jpg',
        'pl-17': 'assets/products/pl-17.jpg',
        'pl-18': 'assets/products/pl-18.jpg',
        'os-kuruvi': 'assets/products/os-kuruvi.jpg',
        'pl-20': 'assets/products/pl-20.jpg',
        'pl-21': 'assets/products/pl-21.jpg',
        'pl-22': 'assets/products/pl-22.jpg',
        'pl-23': 'assets/products/pl-23.jpg',
        'snd-28chorsa': 'assets/products/snd-28chorsa.jpg',
        'bj-red': 'assets/products/bj-red.jpg',
        'pl-26': 'assets/products/pl-26.jpg',
        'pl-27': 'assets/products/pl-27.jpg',
        'pl-28': 'assets/products/pl-28.jpg',
        'pl-29': 'assets/products/pl-29.jpg',
        'pl-30': 'assets/products/pl-30.jpg',
        'pl-31': 'assets/products/pl-31.jpg',
        'pl-32': 'assets/products/pl-32.jpg',
        'pl-33': 'assets/products/pl-33.jpg',
        'pl-34': 'assets/products/pl-34.jpg',
        'pl-35': 'assets/products/pl-35.jpg',
        'rkt-01': 'assets/products/rkt-01.jpg',
        'rkt-rb': 'assets/products/rkt-rb.jpg',
        'pl-38': 'assets/products/pl-38.jpg',
        'pl-39': 'assets/products/pl-39.jpg',
        'pl-40': 'assets/products/pl-40.jpg',
        'pl-41': 'assets/products/pl-41.jpg',
        'pl-42': 'assets/products/pl-42.jpg',
        'pl-43': 'assets/products/pl-43.jpg',
        'sky-7shot': 'assets/products/sky-7shot.jpg',
        'pl-45': 'assets/products/pl-45.jpg',
        'pl-46': 'assets/products/pl-46.jpg',
        'pl-47': 'assets/products/pl-47.jpg',
        'pl-48': 'assets/products/pl-48.jpg',
        'pl-49': 'assets/products/pl-49.jpg',
        'pl-50': 'assets/products/pl-50.jpg',
        'pl-51': 'assets/products/pl-51.jpg',
        'pl-52': 'assets/products/pl-52.jpg',
        'pl-53': 'assets/products/pl-53.jpg',
        'pl-54': 'assets/products/pl-54.jpg',
        'pl-55': 'assets/products/pl-55.jpg',
        'pl-56': 'assets/products/pl-56.jpg',
        'pl-57': 'assets/products/pl-57.jpg',
        'pl-58': 'assets/products/pl-58.jpg',
        'spk-10ele': 'assets/products/spk-10ele.jpg',
        'pl-60': 'assets/products/pl-60.jpg',
        'pl-61': 'assets/products/pl-61.jpg',
        'pl-62': 'assets/products/pl-62.jpg',
        'pl-63': 'assets/products/pl-63.jpg',
        'pl-64': 'assets/products/pl-64.jpg',
        'pl-65': 'assets/products/pl-65.jpg',
        'pl-66': 'assets/products/pl-66.jpg',
        'pl-67': 'assets/products/pl-67.jpg',
        'pl-68': 'assets/products/pl-68.jpg',
        'pl-69': 'assets/products/pl-69.jpg',
        'pl-70': 'assets/products/pl-70.jpg',
        'pl-71': 'assets/products/pl-71.jpg',
        'pl-72': 'assets/products/pl-72.jpg',
        'pl-73': 'assets/products/pl-73.jpg',
        'pl-74': 'assets/products/pl-74.jpg',
        'pl-75': 'assets/products/pl-75.jpg',
        'pl-76': 'assets/products/pl-76.jpg',
        'pl-77': 'assets/products/pl-77.jpg',
        'pl-78': 'assets/products/pl-78.jpg',
        'pl-79': 'assets/products/pl-79.jpg',
        'pl-80': 'assets/products/pl-80.jpg',
        'pl-81': 'assets/products/pl-81.jpg',
        'pl-82': 'assets/products/pl-82.jpg',
        'gb-italy': 'assets/products/gb-italy.jpg',
        'gb-singapore': 'assets/products/gb-singapore.jpg',
        'gb-dubai': 'assets/products/gb-dubai.jpg',
        'gb-paris': 'assets/products/gb-paris.jpg',
        'gb-germany': 'assets/products/gb-germany.jpg',
        'pl-83': 'assets/products/pl-83.jpg',
        'pl-84': 'assets/products/pl-84.jpg',
        'pl-85': 'assets/products/pl-85.jpg',
        'pl-86': 'assets/products/pl-86.jpg',
        'pl-87': 'assets/products/pl-87.jpg',
        'pl-88': 'assets/products/pl-88.jpg',
        'pl-89': 'assets/products/pl-89.jpg'
    };

    static GENERATED_PRODUCT_IMAGES = {
        // Active AI-generated studio images in assets/products/generated/
    };

    static getItemImage(item) {
        if (!item) return 'assets/images/gift_box.jpg';

        // 1. High-Priority AI-Generated Clean Studio Product Image if present
        if (item.id && this.GENERATED_PRODUCT_IMAGES[item.id]) {
            return this.GENERATED_PRODUCT_IMAGES[item.id];
        }

        const name = (item.name || '').toLowerCase();
        const cat = item.category || '';

        // Clean Unbranded AI Category Images (Zero Third-Party Branded Packaging)
        if (name.includes('sparkler') || name.includes('twinkling') || cat.includes('sparkler')) return 'assets/images/sparklers.jpg';
        if (name.includes('flower pot') || name.includes('colour koti') || name.includes('anar') || cat.includes('flower_pot')) return 'assets/images/flower_pots.jpg';
        if (name.includes('chakkar') || name.includes('spinner') || name.includes('wheel') || name.includes('disco') || cat.includes('ground_chakkar')) return 'assets/images/ground_chakkars.jpg';
        if (name.includes('bomb') || cat.includes('bomb')) return 'assets/images/bombs.jpg';
        if (name.includes('rocket') || cat.includes('rocket')) return 'assets/images/sky_rockets.jpg';
        if (name.includes('shot') || name.includes('cake') || name.includes('galaxy') || name.includes('repeater') || name.includes('aerial') || cat.includes('sky_shot')) return 'assets/images/sky_shots.jpg';
        if (name.includes('garland') || name.includes('wala') || name.includes('roll') || cat.includes('garland')) return 'assets/images/garlands.jpg';
        if (name.includes('gift box') || name.includes('hamper') || cat.includes('gift_box')) return 'assets/images/gift_box.jpg';
        if (name.includes('bijili') || name.includes('sound') || name.includes('lakshmi') || name.includes('kuruvi') || name.includes('mega') || name.includes('chorsa') || cat.includes('sound')) return 'assets/images/sound_crackers.jpg';

        // Fallback to clean unbranded AI category image
        const grpKey = this.mapToGroupKey(cat);
        const grp = this.categoryGroups.find(g => g.key === grpKey);
        return (grp && grp.image) ? grp.image : 'assets/images/gift_box.jpg';
    }

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
        return Math.round(priceNum * 2.5);
    }

    static init() {
        this.renderCategoryChips();
        this.renderCatalogue();
        this.setupEventListeners();
        CartManager.updateCartBadges();

        // Trigger celebratory opening cracker burst
        setTimeout(() => {
            FancyFireworks.start();
        }, 150);

        // Dismiss Ground Chakkra loader smoothly
        setTimeout(() => {
            this.hideChakkraLoader();
        }, 350);

        console.log('PRANAV CRACKERS: Reference Layout & Royal Blue Engine Initialized.');
    }

    static showChakkraLoader(msg = 'Gathering genuine Sivakasi wholesale rates', heading = 'Lighting up your celebration...') {
        const loader = document.getElementById('ground-chakkra-loader');
        const headingEl = document.getElementById('chakkra-heading');
        const statusEl = document.getElementById('chakkra-status-text');
        const retryBox = document.getElementById('chakkra-retry-box');
        if (headingEl && heading) headingEl.textContent = heading;
        if (statusEl && msg) statusEl.textContent = msg;
        if (retryBox) retryBox.style.display = 'none';
        if (loader) {
            loader.classList.remove('fade-out');
        }
    }

    static hideChakkraLoader() {
        const loader = document.getElementById('ground-chakkra-loader');
        if (loader) {
            loader.classList.add('fade-out');
        }
    }

    static triggerBurst() {
        FancyFireworks.start();
    }

    static scrollCategories(direction) {
        const row = document.getElementById('category-chips-row');
        if (row) {
            row.scrollBy({ left: direction * 220, behavior: 'smooth' });
        }
    }

    static toggleMobileMenu() {
        const drawer = document.getElementById('mobile-nav-drawer');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        if (!drawer || !backdrop) return;

        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            drawer.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            backdrop.classList.add('open');
            backdrop.setAttribute('aria-hidden', 'false');
            if (toggleBtn) {
                toggleBtn.classList.add('active');
                toggleBtn.setAttribute('aria-expanded', 'true');
            }
            document.body.style.overflow = 'hidden';
            this.syncDrawerLangChips();
        }
    }

    static closeMobileMenu() {
        const drawer = document.getElementById('mobile-nav-drawer');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        if (drawer) {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
        }
        if (backdrop) {
            backdrop.classList.remove('open');
            backdrop.setAttribute('aria-hidden', 'true');
        }
        if (toggleBtn) {
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    static syncDrawerLangChips() {
        if (typeof LanguageManager === 'undefined') return;
        const currentLang = LanguageManager.currentLang || 'en';
        document.querySelectorAll('.drawer-lang-chip').forEach(chip => {
            const onclickAttr = chip.getAttribute('onclick') || '';
            if (onclickAttr.includes(`'${currentLang}'`)) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    static handleDrawerSearch(val) {
        this.searchQuery = (val || '').toLowerCase().trim();
        ['product-search-input', 'header-search-input'].forEach(id => {
            const inp = document.getElementById(id);
            if (inp) inp.value = val;
        });
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
        this.renderCatalogue();
    }

    static setupEventListeners() {
        // Online / Offline Network Monitoring with Ground Chakkra
        if (typeof window !== 'undefined') {
            window.addEventListener('offline', () => {
                this.showChakkraLoader(
                    'Network connection paused. Spinning the Chakkra while reconnecting to Sivakasi server...',
                    'Reconnecting to Sivakasi Server...'
                );
                const retryBox = document.getElementById('chakkra-retry-box');
                if (retryBox) retryBox.style.display = 'flex';
            });

            window.addEventListener('online', () => {
                this.showChakkraLoader(
                    'Connected! Restoring live rates...',
                    'Welcome Back!'
                );
                setTimeout(() => {
                    this.hideChakkraLoader();
                }, 700);
            });
        }

        // Search Input Listeners (Support top, header, and drawer search inputs)
        const setupSearch = (id) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value.toLowerCase().trim();
                    const drawerInp = document.getElementById('drawer-search-input');
                    if (drawerInp && id !== 'drawer-search-input') drawerInp.value = e.target.value;
                    const clearBtn = document.getElementById('search-clear-btn');
                    if (clearBtn) clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
                    this.renderCatalogue();
                });
            }
        };

        setupSearch('product-search-input');
        setupSearch('header-search-input');
        setupSearch('drawer-search-input');

        // Global cartUpdated listener
        if (typeof window !== 'undefined') {
            window.addEventListener('cartUpdated', () => {
                CartManager.updateCartBadges();
                this.syncAllSteppers();
            });

            window.addEventListener('languageChanged', () => {
                this.renderCategoryChips();
                this.renderCatalogue();
                this.syncDrawerLangChips();
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                    CartManager.closeQuotationModal();
                    CartManager.closeConfirmationModal();
                    CartManager.closeTrackOrderModal();
                }
            });
        }
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

        let html = '';
        this.categoryGroups.forEach(grp => {
            const isActive = this.currentCategory === grp.key;
            const title = this.getCategoryTitle(grp.key);
            html += `
                <button type="button" 
                        class="cat-chip-btn cat-pill-card ${isActive ? 'active' : ''}" 
                        data-cat="${grp.key}" 
                        onclick="App.filterCategory('${grp.key}')" 
                        role="tab" 
                        aria-selected="${isActive}">
                    <div class="cat-icon-circle" aria-hidden="true">
                        <img src="${grp.image}" alt="${title}" class="cat-pill-thumb">
                    </div>
                    <span class="cat-pill-name">${title}</span>
                </button>
            `;
        });

        chipsContainer.innerHTML = html;
    }

    static filterCategory(catKey) {
        this.currentCategory = catKey;
        if (typeof document === 'undefined') return;

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

        const headingEl = document.getElementById('section-category-title');
        if (headingEl) {
            headingEl.textContent = catKey === 'all' ? 'Featured Products' : this.getCategoryTitle(catKey);
        }

        this.renderCatalogue();
    }

    static clearSearch() {
        ['product-search-input', 'header-search-input'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        this.searchQuery = '';
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = 'none';
        this.renderCatalogue();
    }

    static resetView() {
        this.clearSearch();
        this.filterCategory('all');
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    static changeQty(itemId, delta) {
        const nextQty = CartManager.changeQty(itemId, delta);

        // Update DOM for matching elements
        if (typeof document !== 'undefined') {
            document.querySelectorAll(`.stepper-val-${itemId}`).forEach(el => {
                el.textContent = nextQty;
            });

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
                        subEl.style.display = 'block';
                        subEl.textContent = `${subLbl}: ₹ ${subtotal.toLocaleString('en-IN')}`;
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
                    if (subRowEl) subRowEl.textContent = `₹ ${subtotal.toLocaleString('en-IN')}`;
                } else {
                    rowEl.classList.remove('is-selected');
                    const subRowEl = rowEl.querySelector('.table-subtotal-val');
                    if (subRowEl) subRowEl.textContent = '₹ 0';
                }
            }

            // Quotation modal if currently open
            const modal = document.getElementById('quotation-modal');
            if (modal && modal.classList && modal.classList.contains && modal.classList.contains('open')) {
                CartManager.renderQuotationModal();
            }
        }

        return nextQty;
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

            document.querySelectorAll(`.stepper-val-${item.id}`).forEach(el => {
                el.textContent = qty;
            });

            const cardEl = document.getElementById(`pcard-${item.id}`);
            if (cardEl && cardEl.querySelector) {
                if (qty > 0) {
                    cardEl.classList.add('is-selected');
                    const subEl = cardEl.querySelector('.card-subtotal-tag');
                    if (subEl) {
                        const subLbl = typeof LanguageManager !== 'undefined' ? LanguageManager.t('subtotalText') : 'Subtotal';
                        subEl.style.display = 'block';
                        subEl.textContent = `${subLbl}: ₹ ${subtotal.toLocaleString('en-IN')}`;
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
                    if (subRowEl) subRowEl.textContent = `₹ ${subtotal.toLocaleString('en-IN')}`;
                } else {
                    rowEl.classList.remove('is-selected');
                    const subRowEl = rowEl.querySelector('.table-subtotal-val');
                    if (subRowEl) subRowEl.textContent = '₹ 0';
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

        const grouped = {};
        this.categoryGroups.forEach(grp => {
            if (grp.key !== 'all') grouped[grp.key] = [];
        });

        let totalMatched = 0;

        allItems.forEach(item => {
            const grpKey = this.mapToGroupKey(item.category);
            if (!grouped[grpKey]) grouped[grpKey] = [];

            if (activeCat !== 'all' && grpKey !== activeCat) return;

            if (query) {
                const nameMatch = (item.name || '').toLowerCase().includes(query);
                const compMatch = (item.company || '').toLowerCase().includes(query);
                const catMatch = (item.category || '').toLowerCase().includes(query);
                if (!nameMatch && !compMatch && !catMatch) return;
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
                    <h3 style="font-size: 1.25rem; font-weight:800; color:#0F172A; margin-bottom: 0.5rem;">${emptyTitle} "${query}"</h3>
                    <p style="color:#64748B; font-size: 0.9rem; max-width: 420px; margin: 0 auto 1.25rem;">${emptyDesc}</p>
                    <button type="button" class="hero-shop-btn" onclick="App.clearSearch()">${clearBtnText}</button>
                </div>
            `;
            return;
        }

        // Always render Rate Sheet Table View (Cards removed per user directive)
        this.renderTableView(container, grouped, cart);
    }

    static renderCardsView(container, grouped, cart) {
        let html = '';
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
                    <div class="category-group-heading-bar" style="display:flex; justify-content:space-between; align-items:center; padding-bottom:0.5rem; border-bottom:1.5px solid #E2E8F0; margin-bottom:0.85rem;">
                        <h3 class="group-title" style="font-size:1.05rem; font-weight:900; color:var(--blue-dark); text-transform:uppercase; display:flex; align-items:center; gap:0.5rem;">
                            <img src="${grp.image}" alt="${grpTitle}" class="group-title-thumb" style="width:24px; height:24px; border-radius:4px; object-fit:cover;">
                            <span>${grpTitle}</span>
                        </h3>
                        <span class="group-item-count" style="font-size:0.75rem; color:#64748B; font-weight:700;">${items.length} ${itemWord}</span>
                    </div>

                    <div class="product-cards-grid">
            `;

            items.forEach(item => {
                const qty = cart[item.id] || 0;
                const isSelected = qty > 0;
                const itemImg = this.getItemImage(item);
                const priceNum = (item.price && item.price.includes('₹'))
                    ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
                    : 0;
                const mrp = this.calculateMRP(priceNum);
                const subtotal = priceNum * qty;

                html += `
                    <div class="cracker-card ${isSelected ? 'is-selected' : ''}" id="pcard-${item.id}">
                        <div class="card-image-wrap">
                            <img src="${itemImg}" alt="${item.name}" class="product-thumb-img" loading="lazy">
                        </div>
                        <h4 class="card-name" title="${item.name}">${item.name}</h4>

                        <div class="card-price-container">
                            <strong class="wholesale-price">₹ ${priceNum.toLocaleString('en-IN')}</strong>
                            <span class="mrp-strike">₹ ${mrp.toLocaleString('en-IN')}</span>
                        </div>
                        <span class="card-subtotal-tag" style="${isSelected ? 'display:block;' : 'display:none;'}">${subtotalWord}: ₹ ${subtotal.toLocaleString('en-IN')}</span>

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
                            <th style="width: 48px;" class="text-center">#</th>
                            <th>Cracker Item Description</th>
                            <th class="text-right" style="width: 105px;">${thMrp}</th>
                            <th class="text-right" style="width: 135px;">${thRate}</th>
                            <th class="text-center" style="width: 140px;">${thQty}</th>
                            <th class="text-right" style="width: 125px;">${thSub}</th>
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
                <tr class="table-group-header-row" id="cat-group-${grp.key}">
                    <td colspan="6">
                        <div class="table-group-header-flex">
                            <div class="table-group-title-group">
                                <span class="table-group-bullet"></span>
                                <strong class="table-group-header-title">${grpTitle}</strong>
                            </div>
                            <span class="table-group-count-pill">${items.length} ${itemWord}</span>
                        </div>
                    </td>
                </tr>
            `;

            items.forEach(item => {
                const qty = cart[item.id] || 0;
                const isSelected = qty > 0;
                const itemImg = this.getItemImage(item);
                const priceNum = (item.price && item.price.includes('₹'))
                    ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
                    : 0;
                const mrp = this.calculateMRP(priceNum);
                const subtotal = priceNum * qty;

                html += `
                    <tr class="rate-sheet-row ${isSelected ? 'is-selected' : ''}" id="prow-${item.id}">
                        <td class="text-center row-num-cell">${rowCounter++}</td>
                        <td class="table-prod-desc-cell">
                            <div class="table-prod-flex">
                                <div class="table-thumb-wrap">
                                    <img src="${itemImg}" alt="${item.name}" class="table-prod-thumb" loading="lazy">
                                </div>
                                <div class="table-prod-info">
                                    <strong class="table-item-name" title="${item.name}">${item.name}</strong>
                                    <div class="table-prod-subline">
                                        <span class="table-green-tag">🌿 Green Cracker</span>
                                        <span class="table-batch-pill">2026 Batch</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="text-right mrp-strike">₹ ${mrp.toLocaleString('en-IN')}</td>
                        <td class="text-right">
                            <strong class="table-wholesale-rate">₹ ${priceNum.toLocaleString('en-IN')}</strong>
                        </td>
                        <td class="text-center">
                            <div class="card-stepper-control table-stepper">
                                <button type="button" class="stepper-btn minus" onclick="App.changeQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                                <span class="stepper-val stepper-val-${item.id}">${qty}</span>
                                <button type="button" class="stepper-btn plus" onclick="App.changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
                            </div>
                        </td>
                        <td class="text-right">
                            <strong class="table-subtotal-val">₹ ${subtotal.toLocaleString('en-IN')}</strong>
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
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
}

if (typeof window !== 'undefined') {
    window.App = App;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App };
}
