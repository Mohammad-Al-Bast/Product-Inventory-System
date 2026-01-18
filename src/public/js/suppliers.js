// Suppliers Page JavaScript

let suppliers = [
    {
        id: 1,
        name: 'Tech Supplies Co.',
        email: 'contact@techsupplies.com',
        phone: '+1 (555) 123-4567',
        website: 'https://techsupplies.com',
        address: '123 Tech Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        products: 24,
        status: 'active',
        notes: ''
    },
    {
        id: 2,
        name: 'ElectroParts Ltd.',
        email: 'info@electroparts.com',
        phone: '+1 (555) 234-5678',
        website: 'https://electroparts.com',
        address: '456 Electronic Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA',
        products: 18,
        status: 'active',
        notes: ''
    }
];

let currentSupplierId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadSuppliers();
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    // Add supplier button
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    if (addSupplierBtn) {
        addSupplierBtn.addEventListener('click', openAddSupplierModal);
    }

    // Supplier form submit
    const supplierForm = document.getElementById('supplierForm');
    if (supplierForm) {
        supplierForm.addEventListener('submit', handleSupplierSubmit);
    }

    // Search functionality
    const supplierSearch = document.getElementById('supplierSearch');
    if (supplierSearch) {
        supplierSearch.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        cityFilter.addEventListener('change', handleFilter);
    }

    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Load suppliers into grid
function loadSuppliers(filteredSuppliers = null) {
    const grid = document.getElementById('suppliersGrid');
    if (!grid) return;

    const suppliersToDisplay = filteredSuppliers || suppliers;

    grid.innerHTML = suppliersToDisplay.map(supplier => `
        <div class="supplier-card">
            <div class="supplier-header">
                <div class="supplier-avatar">
                    <i class="fas fa-building"></i>
                </div>
                <div class="supplier-actions">
                    <button class="btn-icon edit" onclick="editSupplier(${supplier.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteSupplier(${supplier.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="supplier-body">
                <h3>${supplier.name}</h3>
                <div class="supplier-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${supplier.address}, ${supplier.city}, ${supplier.state} ${supplier.zip}</span>
                </div>
                <div class="supplier-detail">
                    <i class="fas fa-phone"></i>
                    <span>${supplier.phone}</span>
                </div>
                <div class="supplier-detail">
                    <i class="fas fa-envelope"></i>
                    <span>${supplier.email}</span>
                </div>
                <div class="supplier-stats">
                    <div class="stat-item">
                        <span class="stat-value">${supplier.products}</span>
                        <span class="stat-label">Products</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value active">${capitalizeFirst(supplier.status)}</span>
                        <span class="stat-label">Status</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Search suppliers
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm)
    );
    loadSuppliers(filtered);
}

// Filter suppliers
function handleFilter() {
    const cityFilter = (document.getElementById('cityFilter') || {}).value || '';

    if (!cityFilter) {
        loadSuppliers();
        return;
    }

    const cityName = getCityName(cityFilter);
    const filtered = suppliers.filter(s => s.city === cityName);
    loadSuppliers(filtered);
}

// Clear filters
function clearFilters() {
    const cityEl = document.getElementById('cityFilter');
    const searchEl = document.getElementById('supplierSearch');

    if (cityEl) cityEl.value = '';
    if (searchEl) searchEl.value = '';

    loadSuppliers();
}

// Open add supplier modal
function openAddSupplierModal() {
    currentSupplierId = null;
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = 'Add New Supplier';
    const supplierForm = document.getElementById('supplierForm');
    if (supplierForm) supplierForm.reset();
    const deleteBtn = document.getElementById('deleteSupplierBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';
    const supplierModal = document.getElementById('supplierModal');
    if (supplierModal) supplierModal.classList.add('active');
}

// Edit supplier
function editSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;

    currentSupplierId = id;
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = 'Edit Supplier';
    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('supplierEmail').value = supplier.email;
    document.getElementById('supplierPhone').value = supplier.phone;
    document.getElementById('supplierWebsite').value = supplier.website || '';
    document.getElementById('supplierAddress').value = supplier.address;
    document.getElementById('supplierCity').value = supplier.city;
    document.getElementById('supplierState').value = supplier.state;
    document.getElementById('supplierZip').value = supplier.zip;
    document.getElementById('supplierCountry').value = supplier.country;
    document.getElementById('supplierNotes').value = supplier.notes || '';
    const deleteBtn = document.getElementById('deleteSupplierBtn');
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';
    const supplierModal = document.getElementById('supplierModal');
    if (supplierModal) supplierModal.classList.add('active');
}

// Delete supplier
function deleteSupplier(id) {
    currentSupplierId = id;
    const deleteModalEl = document.getElementById('deleteModal');
    if (deleteModalEl) deleteModalEl.classList.add('active');
}

// Handle supplier form submit
function handleSupplierSubmit(e) {
    e.preventDefault();

    const id = currentSupplierId || Date.now();
    const formData = {
        id,
        name: (document.getElementById('supplierName') || {}).value || '',
        email: (document.getElementById('supplierEmail') || {}).value || '',
        phone: (document.getElementById('supplierPhone') || {}).value || '',
        website: (document.getElementById('supplierWebsite') || {}).value || '',
        address: (document.getElementById('supplierAddress') || {}).value || '',
        city: (document.getElementById('supplierCity') || {}).value || '',
        state: (document.getElementById('supplierState') || {}).value || '',
        zip: (document.getElementById('supplierZip') || {}).value || '',
        country: (document.getElementById('supplierCountry') || {}).value || 'USA',
        notes: (document.getElementById('supplierNotes') || {}).value || '',
        products: currentSupplierId ? suppliers.find(s => s.id === currentSupplierId).products : 0,
        status: 'active'
    };

    if (currentSupplierId) {
        const index = suppliers.findIndex(s => s.id === currentSupplierId);
        if (index !== -1) suppliers[index] = formData;
    } else {
        suppliers.push(formData);
    }

    loadSuppliers();
    closeSupplierModal();
}

// Confirm delete supplier
function confirmDeleteSupplier() {
    const supplierModal = document.getElementById('supplierModal');
    if (supplierModal) supplierModal.classList.remove('active');
    const deleteModalEl = document.getElementById('deleteModal');
    if (deleteModalEl) deleteModalEl.classList.add('active');
}

// Confirm delete
function confirmDelete() {
    if (currentSupplierId) {
        suppliers = suppliers.filter(s => s.id !== currentSupplierId);
        loadSuppliers();
    }
    closeDeleteModal();
}

// Close supplier modal
function closeSupplierModal() {
    const supplierModal = document.getElementById('supplierModal');
    if (supplierModal) supplierModal.classList.remove('active');
    currentSupplierId = null;
}

// Helper functions (page-specific)
function getCityName(value) {
    const cities = {
        'new-york': 'New York',
        'los-angeles': 'Los Angeles',
        'chicago': 'Chicago',
        'houston': 'Houston',
        'miami': 'Miami'
    };
    return cities[value] || value;
}