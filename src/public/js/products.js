// Products Page JavaScript

let products = window.__PRODUCTS__ || [];
let categories = window.__CATEGORIES__ || [];
let suppliers = window.__SUPPLIERS__ || [];

let currentProductId = null;

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
	populateDropdowns();
	loadProducts();
	initializeEventListeners();
});

// Populate category and supplier dropdowns dynamically
function populateDropdowns() {
	// Populate category dropdown in modal
	const productCategorySelect = document.getElementById("productCategory");
	if (productCategorySelect) {
		productCategorySelect.innerHTML =
			'<option value="">Select Category</option>';
		categories.forEach((category) => {
			const option = document.createElement("option");
			option.value = category.name;
			option.textContent = category.name;
			productCategorySelect.appendChild(option);
		});
	}

	// Populate supplier dropdown in modal
	const productSupplierSelect = document.getElementById("productSupplier");
	if (productSupplierSelect) {
		productSupplierSelect.innerHTML =
			'<option value="">Select Supplier</option>';
		suppliers.forEach((supplier) => {
			const option = document.createElement("option");
			option.value = supplier.name;
			option.textContent = supplier.name;
			productSupplierSelect.appendChild(option);
		});
	}
}

// Initialize event listeners
function initializeEventListeners() {
	const addProductBtn = document.getElementById("addProductBtn");
	if (addProductBtn)
		addProductBtn.addEventListener("click", openAddProductModal);

	const productForm = document.getElementById("productForm");
	if (productForm)
		productForm.addEventListener("submit", handleProductSubmit);

	const productSearch = document.getElementById("productSearch");
	if (productSearch) productSearch.addEventListener("input", handleSearch);

	const categoryFilter = document.getElementById("categoryFilter");
	const supplierFilter = document.getElementById("supplierFilter");

	if (categoryFilter) categoryFilter.addEventListener("change", handleFilter);
	if (supplierFilter) supplierFilter.addEventListener("change", handleFilter);

	const clearFiltersBtn = document.getElementById("clearFilters");
	if (clearFiltersBtn)
		clearFiltersBtn.addEventListener("click", clearFilters);
}

// Helper function to get category color (returns faded background and solid text color)
function getCategoryColor(categoryName) {
	const category = categories.find((c) => c.name === categoryName);
	const color = category ? category.color : "#6b7280";
	return { bgColor: hexToRgba(color, 0.15), textColor: color };
}

// Helper function to convert hex to rgba with opacity
function hexToRgba(hex, opacity) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		const r = parseInt(result[1], 16);
		const g = parseInt(result[2], 16);
		const b = parseInt(result[3], 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
	return `rgba(107, 114, 128, ${opacity})`;
}

// Load products into table
function loadProducts(filteredProducts = null) {
	const tbody = document.getElementById("productsTableBody");
	if (!tbody) return;

	const productsToDisplay = filteredProducts || products;

	tbody.innerHTML = productsToDisplay
		.map((product) => {
			const categoryColors = getCategoryColor(product.category);
			return `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="https://via.placeholder.com/40x40/4f46e5/ffffff?text=P" alt="Product">
                    <span>${escapeHtml(product.name)}</span>
                </div>
            </td>
            <td>${escapeHtml(product.sku || "")}</td>
            <td><span class="category-badge" style="background-color: ${categoryColors.bgColor}; color: ${categoryColors.textColor};">${capitalizeFirst(product.category || "")}</span></td>
            <td>$${(Number(product.price) || 0).toFixed(2)}</td>
            <td><span class="quantity-badge ${Number(product.quantity) < 20 ? "low" : "good"}">${escapeHtml(String(product.quantity || 0))}</span></td>
            <td>${escapeHtml(product.supplier || "")}</td>
            <td><span class="status-badge ${escapeHtml(product.status || "")}">${(product.status || "").replace("-", " ")}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit" onclick="editProduct('${String(product.id).replace(/'/g, "\\'")}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteProduct('${String(product.id).replace(/'/g, "\\'")}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
		})
		.join("");
}

// Search products
function handleSearch(e) {
	const searchTerm = (e.target.value || "").toLowerCase();
	const filtered = products.filter(
		(product) =>
			String(product.name || "")
				.toLowerCase()
				.includes(searchTerm) ||
			String(product.sku || "")
				.toLowerCase()
				.includes(searchTerm),
	);
	loadProducts(filtered);
}

// Filter products
function handleFilter() {
	const categoryFilter =
		(document.getElementById("categoryFilter") || {}).value || "";
	const supplierFilter =
		(document.getElementById("supplierFilter") || {}).value || "";

	let filtered = products;

	if (categoryFilter)
		filtered = filtered.filter((p) => p.category === categoryFilter);

	if (supplierFilter) {
		filtered = filtered.filter((p) => p.supplier === supplierFilter);
	}

	loadProducts(filtered);
}

// Clear filters
function clearFilters() {
	const categoryEl = document.getElementById("categoryFilter");
	const supplierEl = document.getElementById("supplierFilter");
	const searchEl = document.getElementById("productSearch");

	if (categoryEl) categoryEl.value = "";
	if (supplierEl) supplierEl.value = "";
	if (searchEl) searchEl.value = "";

	loadProducts();
}

// Open add product modal
function openAddProductModal() {
	currentProductId = null;
	const modalTitle = document.getElementById("modalTitle");
	if (modalTitle) modalTitle.textContent = "Add New Product";
	const productForm = document.getElementById("productForm");
	if (productForm) productForm.reset();
	const deleteBtn = document.getElementById("deleteProductBtn");
	if (deleteBtn) deleteBtn.style.display = "none";
	const productModal = document.getElementById("productModal");
	if (productModal) productModal.classList.add("active");
}

// Edit product
function editProduct(id) {
	try {
		const product = products.find((p) => String(p.id) === String(id));
		if (!product) return;

		currentProductId = String(id);
		const modalTitle = document.getElementById("modalTitle");
		if (modalTitle) modalTitle.textContent = "Edit Product";
		document.getElementById("productId").value = product.id || "";
		document.getElementById("productName").value = product.name || "";
		document.getElementById("productSKU").value = product.sku || "";
		document.getElementById("productCategory").value =
			product.category || "";
		document.getElementById("productPrice").value = product.price || 0;
		document.getElementById("productQuantity").value =
			product.quantity || 0;
		document.getElementById("productSupplier").value =
			product.supplier || "";
		document.getElementById("productDescription").value =
			product.description || "";
		const deleteBtn = document.getElementById("deleteProductBtn");
		if (deleteBtn) deleteBtn.style.display = "inline-flex";
		const productModal = document.getElementById("productModal");
		if (productModal) productModal.classList.add("active");
	} catch (err) {
		console.error("Error editing product:", err);
		alert("Failed to edit product. Please try again.");
	}
}

// Delete product (open confirm)
function deleteProduct(id) {
	currentProductId = String(id);
	const deleteModalEl = document.getElementById("deleteModal");
	if (deleteModalEl) deleteModalEl.classList.add("active");
}

// Handle product form submit
async function handleProductSubmit(e) {
	e.preventDefault();

	const id =
		(document.getElementById("productId") || {}).value ||
		currentProductId ||
		Date.now().toString();
	const name = (document.getElementById("productName") || {}).value || "";
	const sku = (document.getElementById("productSKU") || {}).value || "";
	const category =
		(document.getElementById("productCategory") || {}).value || "";
	const price = parseFloat(
		(document.getElementById("productPrice") || {}).value || 0,
	);
	const quantity = parseInt(
		(document.getElementById("productQuantity") || {}).value || "0",
		10,
	);
	const supplierValue =
		(document.getElementById("productSupplier") || {}).value || "";
	const description =
		(document.getElementById("productDescription") || {}).value || "";

	const payload = new URLSearchParams();
	payload.append("id", id);
	payload.append("productName", name);
	payload.append("productSKU", sku);
	payload.append("productCategory", category);
	payload.append("productPrice", price);
	payload.append("productQuantity", quantity);
	payload.append("productSupplier", supplierValue);
	payload.append("productDescription", description);

	try {
		if (currentProductId) {
			// update
			const resp = await fetch(
				`/products/update/${encodeURIComponent(currentProductId)}`,
				{
					method: "POST",
					body: payload,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);
			const data = await resp.json();
			if (data && data.success && data.product) {
				replaceOrAddLocalProduct(data.product);
			}
		} else {
			// create
			const resp = await fetch(`/products/add`, {
				method: "POST",
				body: payload,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});
			const data = await resp.json();
			if (data && data.success && data.product) {
				replaceOrAddLocalProduct(data.product);
			}
		}
	} catch (err) {
		console.error(err);
		alert("Failed to save product. Please try again.");
	}

	loadProducts();
	closeProductModal();
}

// Confirm delete product -> actually open delete modal (used by Save/Delete UI)
function confirmDeleteProduct() {
	const productModal = document.getElementById("productModal");
	if (productModal) productModal.classList.remove("active");
	const deleteModalEl = document.getElementById("deleteModal");
	if (deleteModalEl) deleteModalEl.classList.add("active");
}

// Confirm delete action
async function confirmDelete() {
	if (!currentProductId) return;

	try {
		const resp = await fetch(
			`/products/delete/${encodeURIComponent(currentProductId)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ id: currentProductId }),
			},
		);
		const data = await resp.json();
		if (data && data.success) {
			products = products.filter(
				(p) => String(p.id) !== String(currentProductId),
			);
			loadProducts();
		}
	} catch (err) {
		console.error(err);
	}
	closeDeleteModal();
}

// Close product modal
function closeProductModal() {
	const productModal = document.getElementById("productModal");
	if (productModal) productModal.classList.remove("active");
	currentProductId = null;
	const productForm = document.getElementById("productForm");
	if (productForm) productForm.reset();
}

// Close delete modal
function closeDeleteModal() {
	const deleteModalEl = document.getElementById("deleteModal");
	if (deleteModalEl) deleteModalEl.classList.remove("active");
	currentProductId = null;
}

// Helper: add/update local products array
function replaceOrAddLocalProduct(product) {
	const normalized = {
		id:
			product.id ||
			product._id ||
			product._doc?.id ||
			product._doc?._id ||
			product._id,
		name: product.name || "",
		sku: product.sku || "",
		category: product.category || "",
		price: Number(product.price) || 0,
		quantity: Number(product.quantity) || 0,
		supplier: product.supplier || "",
		status: Number(product.quantity) < 20 ? "low-stock" : "in-stock",
		description: product.description || "",
	};
	const idx = products.findIndex(
		(p) => String(p.id) === String(normalized.id),
	);
	if (idx !== -1) products[idx] = normalized;
	else products.push(normalized);
}

// Helper functions (page-specific)
function capitalizeFirst(str) {
	if (!str) return "";
	return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

// Minimal HTML-escaping to avoid injecting raw markup into table cells
function escapeHtml(str) {
	if (str === undefined || str === null) return "";
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
