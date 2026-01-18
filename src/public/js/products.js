// Products Page JavaScript

let products = [
    {
        id: 1,
        name: 'Wireless Mouse',
        sku: 'WM-001',
        category: 'electronics',
        price: 29.99,
        quantity: 5,
        supplier: 'Tech Supplies Co.',
        status: 'low-stock',
        description: ''
    },
    {
        id: 2,
        name: 'USB-C Hub',
        sku: 'UH-022',
        category: 'accessories',
        price: 49.99,
        quantity: 45,
        supplier: 'ElectroParts Ltd.',
        status: 'in-stock',
        description: ''
    }
];

let currentProductId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }

    // Product form submit
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    // Search functionality
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const supplierFilter = document.getElementById('supplierFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilter);
    }

    if (supplierFilter) {
        supplierFilter.addEventListener('change', handleFilter);
    }

    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Load products into table
function loadProducts(filteredProducts = null) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    const productsToDisplay = filteredProducts || products;

    tbody.innerHTML = productsToDisplay.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="https://via.placeholder.com/40x40/4f46e5/ffffff?text=P" alt="Product">
                    <span>${product.name}</span>
                </div>
            </td>
            <td>${product.sku}</td>
            <td><span class="category-badge ${product.category}">${capitalizeFirst(product.category)}</span></td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="quantity-badge ${product.quantity < 20 ? 'low' : 'good'}">${product.quantity}</span></td>
            <td>${product.supplier}</td>
            <td><span class="status-badge ${product.status}">${product.status.replace('-', ' ')}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Search products
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
    );
    loadProducts(filtered);
}

// Filter products
function handleFilter() {
    const categoryFilter = (document.getElementById('categoryFilter') || {}).value || '';
    const supplierFilter = (document.getElementById('supplierFilter') || {}).value || '';

    let filtered = products;

    if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (supplierFilter) {
        const supplierName = getSupplierName(supplierFilter);
        filtered = filtered.filter(p => p.supplier === supplierName);
    }

    loadProducts(filtered);
}

// Clear filters
function clearFilters() {
    const categoryEl = document.getElementById('categoryFilter');
    const supplierEl = document.getElementById('supplierFilter');
    const searchEl = document.getElementById('productSearch');

    if (categoryEl) categoryEl.value = '';
    if (supplierEl) supplierEl.value = '';
    if (searchEl) searchEl.value = '';

    loadProducts();
}

// Open add product modal
function openAddProductModal() {
    currentProductId = null;
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = 'Add New Product';
    const productForm = document.getElementById('productForm');
    if (productForm) productForm.reset();
    const deleteBtn = document.getElementById('deleteProductBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';
    const productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.add('active');
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProductId = id;
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productSKU').value = product.sku;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productSupplier').value = getSupplierValue(product.supplier);
    document.getElementById('productDescription').value = product.description || '';
    const deleteBtn = document.getElementById('deleteProductBtn');
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';
    const productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.add('active');
}

// Delete product
function deleteProduct(id) {
    currentProductId = id;
    const deleteModalEl = document.getElementById('deleteModal');
    if (deleteModalEl) deleteModalEl.classList.add('active');
}

// Handle product form submit
function handleProductSubmit(e) {
    e.preventDefault();

    const id = currentProductId || Date.now();
    const name = (document.getElementById('productName') || {}).value || '';
    const sku = (document.getElementById('productSKU') || {}).value || '';
    const category = (document.getElementById('productCategory') || {}).value || '';
    const price = parseFloat((document.getElementById('productPrice') || {}).value || 0);
    const quantity = parseInt((document.getElementById('productQuantity') || {}).value || '0', 10);
    const supplier = getSupplierName((document.getElementById('productSupplier') || {}).value || '');

    const formData = {
        id,
        name,
        sku,
        category,
        price,
        quantity,
        supplier,
        status: quantity < 20 ? 'low-stock' : 'in-stock',
        description: (document.getElementById('productDescription') || {}).value || ''
    };

    if (currentProductId) {
        const index = products.findIndex(p => p.id === currentProductId);
        if (index !== -1) products[index] = formData;
    } else {
        products.push(formData);
    }

    loadProducts();
    closeProductModal();
}

// Confirm delete product
function confirmDeleteProduct() {
    const productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.remove('active');
    const deleteModalEl = document.getElementById('deleteModal');
    if (deleteModalEl) deleteModalEl.classList.add('active');
}

// Confirm delete
function confirmDelete() {
    if (currentProductId) {
        products = products.filter(p => p.id !== currentProductId);
        loadProducts();
    }
    closeDeleteModal();
}

// Close product modal
function closeProductModal() {
    const productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.remove('active');
    currentProductId = null;
}

// Helper functions (page-specific)
function getSupplierName(value) {
    const suppliers = {
        'tech-supplies': 'Tech Supplies Co.',
        'electroparts': 'ElectroParts Ltd.',
        'keyboard-masters': 'KeyBoard Masters',
        'vision-tech': 'Vision Tech'
    };
    return suppliers[value] || value;
}

function getSupplierValue(name) {
    const suppliers = {
        'Tech Supplies Co.': 'tech-supplies',
        'ElectroParts Ltd.': 'electroparts',
        'KeyBoard Masters': 'keyboard-masters',
        'Vision Tech': 'vision-tech'
    };
    return suppliers[name] || '';
} 