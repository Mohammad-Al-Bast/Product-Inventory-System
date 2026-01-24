// Categories Page JavaScript

let categories = [];
let currentCategoryId = null;

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
	// Load categories from server data
	if (window.categoriesData) {
		categories = window.categoriesData;
	}
	initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
	// Add category button
	const addCategoryBtn = document.getElementById("addCategoryBtn");
	if (addCategoryBtn) {
		addCategoryBtn.addEventListener("click", openAddCategoryModal);
	}

	// Category form submit
	const categoryForm = document.getElementById("categoryForm");
	if (categoryForm) {
		categoryForm.addEventListener("submit", handleCategorySubmit);
	}

	// Search functionality
	const categorySearch = document.getElementById("categorySearch");
	if (categorySearch) {
		categorySearch.addEventListener("input", handleSearch);
	}

	// Filter functionality
	const statusFilter = document.getElementById("statusFilter");
	if (statusFilter) {
		statusFilter.addEventListener("change", handleFilter);
	}

	// Clear filters
	const clearFiltersBtn = document.getElementById("clearFilters");
	if (clearFiltersBtn) {
		clearFiltersBtn.addEventListener("click", clearFilters);
	}
}

// Load categories into grid (for client-side filtering)
function loadCategories(filteredCategories = null) {
	const grid = document.getElementById("categoriesGrid");
	if (!grid) return;

	const categoriesToDisplay = filteredCategories || categories;

	if (categoriesToDisplay.length === 0) {
		grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tags"></i>
                <p>No categories found. Add your first category to get started!</p>
            </div>
        `;
		return;
	}

	grid.innerHTML = categoriesToDisplay
		.map(
			(category) => `
        <div class="category-card" data-category-id="${category.id}">
            <div class="category-header" style="background-color: ${category.color || "#3498db"}">
                <div class="category-icon">
                    <i class="fas ${category.icon || "fa-tag"}"></i>
                </div>
                <div class="category-actions">
                    <button class="btn-icon edit" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="category-body">
                <h3>${category.name}</h3>
                ${category.description ? `<p class="category-description">${category.description}</p>` : ""}
                <div class="category-stats">
                    <div class="stat-item">
                        <span class="stat-value ${category.status === "active" ? "active" : "inactive"}">
                            ${category.status ? category.status.charAt(0).toUpperCase() + category.status.slice(1) : "Active"}
                        </span>
                        <span class="stat-label">Status</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${new Date(category.createdAt).toLocaleDateString()}</span>
                        <span class="stat-label">Created</span>
                    </div>
                </div>
            </div>
        </div>
    `,
		)
		.join("");
}

// Search categories
function handleSearch(e) {
	const searchTerm = e.target.value.toLowerCase();
	const filtered = categories.filter(
		(category) =>
			category.name.toLowerCase().includes(searchTerm) ||
			(category.description &&
				category.description.toLowerCase().includes(searchTerm)),
	);
	loadCategories(filtered);
}

// Filter categories
function handleFilter() {
	const statusFilter =
		(document.getElementById("statusFilter") || {}).value || "";

	if (!statusFilter) {
		loadCategories();
		return;
	}

	const filtered = categories.filter((c) => c.status === statusFilter);
	loadCategories(filtered);
}

// Clear filters
function clearFilters() {
	const statusEl = document.getElementById("statusFilter");
	const searchEl = document.getElementById("categorySearch");

	if (statusEl) statusEl.value = "";
	if (searchEl) searchEl.value = "";

	loadCategories();
}

// Open add category modal
function openAddCategoryModal() {
	currentCategoryId = null;
	const modalTitle = document.getElementById("modalTitle");
	if (modalTitle) modalTitle.textContent = "Add New Category";
	const categoryForm = document.getElementById("categoryForm");
	if (categoryForm) categoryForm.reset();
	// Reset color to default
	const colorInput = document.getElementById("categoryColor");
	if (colorInput) colorInput.value = "#3498db";
	const deleteBtn = document.getElementById("deleteCategoryBtn");
	if (deleteBtn) deleteBtn.style.display = "none";
	const categoryModal = document.getElementById("categoryModal");
	if (categoryModal) categoryModal.classList.add("active");
}

// Edit category
function editCategory(id) {
	const category = categories.find((c) => c.id === id);
	if (!category) return;

	currentCategoryId = id;
	const modalTitle = document.getElementById("modalTitle");
	if (modalTitle) modalTitle.textContent = "Edit Category";
	document.getElementById("categoryName").value = category.name;
	document.getElementById("categoryDescription").value =
		category.description || "";
	document.getElementById("categoryColor").value =
		category.color || "#3498db";
	document.getElementById("categoryIcon").value = category.icon || "fa-tag";
	document.getElementById("categoryStatus").value =
		category.status || "active";
	const deleteBtn = document.getElementById("deleteCategoryBtn");
	if (deleteBtn) deleteBtn.style.display = "inline-flex";
	const categoryModal = document.getElementById("categoryModal");
	if (categoryModal) categoryModal.classList.add("active");
}

// Delete category
function deleteCategory(id) {
	currentCategoryId = id;
	const deleteModalEl = document.getElementById("deleteModal");
	if (deleteModalEl) {
		deleteModalEl.classList.add("active");
	}
}

// Close category modal
function closeCategoryModal() {
	const categoryModal = document.getElementById("categoryModal");
	if (categoryModal) categoryModal.classList.remove("active");
	currentCategoryId = null;
}

// Handle category form submit
async function handleCategorySubmit(e) {
	e.preventDefault();

	const formData = new FormData(e.target);
	const data = Object.fromEntries(formData.entries());

	try {
		let response;
		if (currentCategoryId) {
			// Update existing category
			response = await fetch(`/categories/update/${currentCategoryId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(data),
			});
		} else {
			// Create new category
			response = await fetch("/categories/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(data),
			});
		}

		const result = await response.json();
		if (result.success) {
			closeCategoryModal();
			// Reload page to show updated data
			window.location.reload();
		} else {
			alert("Error saving category. Please try again.");
		}
	} catch (error) {
		console.error("Error:", error);
		alert("Error saving category. Please try again.");
	}
}

// Confirm delete from modal
function confirmDeleteCategory() {
	if (currentCategoryId) {
		deleteCategory(currentCategoryId);
		closeCategoryModal();
	}
}

// Confirm delete action (called from delete modal)
async function confirmDelete() {
	if (!currentCategoryId) return;

	try {
		const response = await fetch(
			`/categories/delete/${currentCategoryId}`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
				},
			},
		);

		const result = await response.json();
		if (result.success) {
			closeDeleteModal();
			window.location.reload();
		} else {
			alert("Error deleting category. Please try again.");
		}
	} catch (error) {
		console.error("Error:", error);
		alert("Error deleting category. Please try again.");
	}
}

// Close delete modal
function closeDeleteModal() {
	const deleteModal = document.getElementById("deleteModal");
	if (deleteModal) deleteModal.classList.remove("active");
}
