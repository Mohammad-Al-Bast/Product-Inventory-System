// Suppliers Page JavaScript

let suppliers = [];
let currentSupplierId = null;

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
	// Load suppliers from server data
	if (window.suppliersData) {
		suppliers = window.suppliersData;
	}
	initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
	// Add supplier button
	const addSupplierBtn = document.getElementById("addSupplierBtn");
	if (addSupplierBtn) {
		addSupplierBtn.addEventListener("click", openAddSupplierModal);
	}

	// Supplier form submit
	const supplierForm = document.getElementById("supplierForm");
	if (supplierForm) {
		supplierForm.addEventListener("submit", handleSupplierSubmit);
	}

	// Search functionality
	const supplierSearch = document.getElementById("supplierSearch");
	if (supplierSearch) {
		supplierSearch.addEventListener("input", handleSearch);
	}

	// Filter functionality
	const cityFilter = document.getElementById("cityFilter");
	if (cityFilter) {
		cityFilter.addEventListener("change", handleFilter);
	}

	// Clear filters
	const clearFiltersBtn = document.getElementById("clearFilters");
	if (clearFiltersBtn) {
		clearFiltersBtn.addEventListener("click", clearFilters);
	}
}

// Load suppliers into grid (for client-side filtering)
function loadSuppliers(filteredSuppliers = null) {
	const grid = document.getElementById("suppliersGrid");
	if (!grid) return;

	const suppliersToDisplay = filteredSuppliers || suppliers;

	if (suppliersToDisplay.length === 0) {
		grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-building"></i>
                <p>No suppliers found. Add your first supplier to get started!</p>
            </div>
        `;
		return;
	}

	grid.innerHTML = suppliersToDisplay
		.map(
			(supplier) => `
        <div class="supplier-card" data-supplier-id="${supplier.id}">
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
                ${
					supplier.website
						? `
                <div class="supplier-detail">
                    <i class="fas fa-globe"></i>
                    <span><a href="${supplier.website}" target="_blank">${supplier.website}</a></span>
                </div>
                `
						: ""
				}
                <div class="supplier-stats">
                    <div class="stat-item">
                        <span class="stat-value">${supplier.country}</span>
                        <span class="stat-label">Country</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value active">Active</span>
                        <span class="stat-label">Status</span>
                    </div>
                </div>
            </div>
        </div>
    `,
		)
		.join("");
}

// Search suppliers
function handleSearch(e) {
	const searchTerm = e.target.value.toLowerCase();
	const filtered = suppliers.filter(
		(supplier) =>
			supplier.name.toLowerCase().includes(searchTerm) ||
			supplier.email.toLowerCase().includes(searchTerm),
	);
	loadSuppliers(filtered);
}

// Filter suppliers
function handleFilter() {
	const cityFilter =
		(document.getElementById("cityFilter") || {}).value || "";

	if (!cityFilter) {
		loadSuppliers();
		return;
	}

	const cityName = getCityName(cityFilter);
	const filtered = suppliers.filter((s) => s.city === cityName);
	loadSuppliers(filtered);
}

// Clear filters
function clearFilters() {
	const cityEl = document.getElementById("cityFilter");
	const searchEl = document.getElementById("supplierSearch");

	if (cityEl) cityEl.value = "";
	if (searchEl) searchEl.value = "";

	loadSuppliers();
}

// Open add supplier modal
function openAddSupplierModal() {
	currentSupplierId = null;
	const modalTitle = document.getElementById("modalTitle");
	if (modalTitle) modalTitle.textContent = "Add New Supplier";
	const supplierForm = document.getElementById("supplierForm");
	if (supplierForm) supplierForm.reset();
	const deleteBtn = document.getElementById("deleteSupplierBtn");
	if (deleteBtn) deleteBtn.style.display = "none";
	const supplierModal = document.getElementById("supplierModal");
	if (supplierModal) supplierModal.classList.add("active");
}

// Edit supplier
function editSupplier(id) {
	const supplier = suppliers.find((s) => s.id === id);
	if (!supplier) return;

	currentSupplierId = id;
	const modalTitle = document.getElementById("modalTitle");
	if (modalTitle) modalTitle.textContent = "Edit Supplier";
	document.getElementById("supplierName").value = supplier.name;
	document.getElementById("supplierEmail").value = supplier.email;
	document.getElementById("supplierPhone").value = supplier.phone;
	document.getElementById("supplierWebsite").value = supplier.website || "";
	document.getElementById("supplierAddress").value = supplier.address;
	document.getElementById("supplierCity").value = supplier.city;
	document.getElementById("supplierState").value = supplier.state;
	document.getElementById("supplierZip").value = supplier.zip;
	document.getElementById("supplierCountry").value = supplier.country;
	document.getElementById("supplierNotes").value = supplier.notes || "";
	const deleteBtn = document.getElementById("deleteSupplierBtn");
	if (deleteBtn) deleteBtn.style.display = "inline-flex";
	const supplierModal = document.getElementById("supplierModal");
	if (supplierModal) supplierModal.classList.add("active");
}

// Delete supplier
function deleteSupplier(id) {
	currentSupplierId = id;
	const deleteModalEl = document.getElementById("deleteModal");
	if (deleteModalEl) deleteModalEl.classList.add("active");
}

// Handle supplier form submit
function handleSupplierSubmit(e) {
	e.preventDefault();

	const formData = new FormData();
	formData.append(
		"supplierName",
		document.getElementById("supplierName").value,
	);
	formData.append(
		"supplierEmail",
		document.getElementById("supplierEmail").value,
	);
	formData.append(
		"supplierPhone",
		document.getElementById("supplierPhone").value,
	);
	formData.append(
		"supplierWebsite",
		document.getElementById("supplierWebsite").value,
	);
	formData.append(
		"supplierAddress",
		document.getElementById("supplierAddress").value,
	);
	formData.append(
		"supplierCity",
		document.getElementById("supplierCity").value,
	);
	formData.append(
		"supplierState",
		document.getElementById("supplierState").value,
	);
	formData.append(
		"supplierZip",
		document.getElementById("supplierZip").value,
	);
	formData.append(
		"supplierCountry",
		document.getElementById("supplierCountry").value,
	);
	formData.append(
		"supplierNotes",
		document.getElementById("supplierNotes").value,
	);

	const url = currentSupplierId
		? `/suppliers/update/${currentSupplierId}`
		: "/suppliers/add";

	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			supplierName: document.getElementById("supplierName").value,
			supplierEmail: document.getElementById("supplierEmail").value,
			supplierPhone: document.getElementById("supplierPhone").value,
			supplierWebsite: document.getElementById("supplierWebsite").value,
			supplierAddress: document.getElementById("supplierAddress").value,
			supplierCity: document.getElementById("supplierCity").value,
			supplierState: document.getElementById("supplierState").value,
			supplierZip: document.getElementById("supplierZip").value,
			supplierCountry: document.getElementById("supplierCountry").value,
			supplierNotes: document.getElementById("supplierNotes").value,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				window.location.reload();
			}
		})
		.catch((error) => {
			console.error("Error saving supplier:", error);
			alert("Error saving supplier. Please try again.");
		});
}

// Confirm delete supplier
function confirmDeleteSupplier() {
	const supplierModal = document.getElementById("supplierModal");
	if (supplierModal) supplierModal.classList.remove("active");
	const deleteModalEl = document.getElementById("deleteModal");
	if (deleteModalEl) deleteModalEl.classList.add("active");
}

// Confirm delete
function confirmDelete() {
	if (currentSupplierId) {
		fetch(`/suppliers/delete/${currentSupplierId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					window.location.reload();
				}
			})
			.catch((error) => {
				console.error("Error deleting supplier:", error);
				alert("Error deleting supplier. Please try again.");
			});
	}
	closeDeleteModal();
}

// Close supplier modal
function closeSupplierModal() {
	const supplierModal = document.getElementById("supplierModal");
	if (supplierModal) supplierModal.classList.remove("active");
	currentSupplierId = null;
}

// Helper functions (page-specific)
function getCityName(value) {
	const cities = {
		"new-york": "New York",
		"los-angeles": "Los Angeles",
		chicago: "Chicago",
		houston: "Houston",
		miami: "Miami",
	};
	return cities[value] || value;
}
