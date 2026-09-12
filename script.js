// Global Password for Store Owner
const ADMIN_PASSWORD = "messa123";

// LocalStorage Controller
function getStoredProducts() {
    const saved = localStorage.getItem('messa_products_v3');
    return saved ? JSON.parse(saved) : [];
}

function saveProducts(products) {
    localStorage.setItem('messa_products_v3', JSON.stringify(products));
}

// Tab Switching Mechanism
function switchTab(tabId) {
    // Update active nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });

    // Update visible page section
    document.querySelectorAll('.page-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Render Catalog Items
let currentFilter = 'All';

function filterCategory(category) {
    currentFilter = category;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.trim() === category || (category === 'All' && btn.innerText.includes('All'))) {
            btn.classList.add('active');
        }
    });
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let products = getStoredProducts();

    if (currentFilter !== 'All') {
        products = products.filter(p => p.category === currentFilter);
    }

    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
                <i class="fas fa-couch" style="font-size: 40px; color: #c5a059; margin-bottom: 15px;"></i>
                <h3 style="font-family: 'Cinzel', serif;">No Products Found</h3>
                <p style="color: #9aa0a6; font-size: 14px; margin-top: 5px;">Use "Owner Access" at top right to publish products to this section.</p>
            </div>
        `;
        return;
    }

    products.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="image-container">
                <img src="${prod.image}" alt="${prod.title}">
                <span class="category-tag">${prod.category}</span>
            </div>
            <div class="product-details">
                <h3>${prod.title}</h3>
                <div class="product-specs">
                    ${prod.material ? `<div><i class="fas fa-layer-group"></i> ${prod.material}</div>` : ''}
                    ${prod.size ? `<div><i class="fas fa-ruler-combined"></i> ${prod.size}</div>` : ''}
                </div>
                <p class="product-desc">${prod.desc}</p>
                <div class="product-bottom">
                    <div class="price">${prod.price}</div>
                    <button class="btn-delete-item" onclick="deleteProduct(${index})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Delete Item Function
function deleteProduct(index) {
    if (confirm("Are you sure you want to delete this furniture item?")) {
        let products = getStoredProducts();
        products.splice(index, 1);
        saveProducts(products);
        renderProducts();
    }
}

// Owner Panel Actions
function openOwnerPanel() {
    const pass = prompt("Enter Owner Security Password:");
    if (pass === ADMIN_PASSWORD) {
        const modal = document.getElementById('admin-modal');
        if (modal) modal.classList.remove('hidden');
    } else if (pass !== null) {
        alert("Incorrect Security Password!");
    }
}

function closeOwnerPanel() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.add('hidden');
}

// Initial Events Binding
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadBranding();

    // Add Product Form Listener
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newProduct = {
                title: document.getElementById('prod-title').value,
                category: document.getElementById('prod-category').value,
                price: document.getElementById('prod-price').value,
                material: document.getElementById('prod-material').value,
                size: document.getElementById('prod-size').value,
                image: document.getElementById('prod-image').value,
                desc: document.getElementById('prod-desc').value
            };

            const products = getStoredProducts();
            products.unshift(newProduct);
            saveProducts(products);

            renderProducts();
            alert("New Product published to Store Catalogue!");
            addForm.reset();
            closeOwnerPanel();
            switchTab('products');
        });
    }

    // Branding Settings Form Listener
    const brandForm = document.getElementById('brand-settings-form');
    if (brandForm) {
        brandForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const logoUrl = document.getElementById('brand-logo-url').value;
            const aboutText = document.getElementById('brand-about-text').value;

            if (logoUrl) localStorage.setItem('messa_logo_url_v3', logoUrl);
            if (aboutText) localStorage.setItem('messa_about_text_v3', aboutText);

            loadBranding();
            alert("Brand settings saved!");
            closeOwnerPanel();
        });
    }
});

// Load Custom Branding
function loadBranding() {
    const savedLogo = localStorage.getItem('messa_logo_url_v3');
    const savedAbout = localStorage.getItem('messa_about_text_v3');

    if (savedLogo) {
        const container = document.getElementById('main-logo-container');
        if (container) {
            container.innerHTML = `<img src="${savedLogo}" alt="M ESSA Logo" style="max-height: 40px;">`;
        }
    }

    if (savedAbout) {
        const aboutBody = document.getElementById('about-content-body');
        if (aboutBody) {
            aboutBody.innerHTML = `<p>${savedAbout}</p>`;
        }
    }
}