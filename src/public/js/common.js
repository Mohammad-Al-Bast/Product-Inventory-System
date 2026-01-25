// Common utilities for pages

// Capitalize first letter
function capitalizeFirst(str) {
	return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

// Get initials from a name (up to 2 characters)
function getInitials(name) {
	if (!name) return "?";
	const words = name.trim().split(/\s+/);
	if (words.length === 1) {
		return words[0].substring(0, 2).toUpperCase();
	}
	return (words[0][0] + words[1][0]).toUpperCase();
}

// Generate a consistent color from a string (for avatars)
function getColorFromString(str) {
	const colors = [
		"#0F2854", // dark blue
		"#1C4D8D", // primary blue
		"#4988C4", // light blue
		"#2563eb", // bright blue
		"#7c3aed", // purple
		"#db2777", // pink
		"#059669", // green
		"#d97706", // amber
		"#dc2626", // red
		"#0891b2", // cyan
		"#4f46e5", // indigo
		"#7c2d12", // brown
	];

	if (!str) return colors[0];

	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length];
}

// Create an avatar HTML element with initials
function createInitialsAvatar(name, size = 40) {
	const initials = getInitials(name);
	const bgColor = getColorFromString(name);
	const fontSize = Math.floor(size * 0.4);

	return `
		<div class="initials-avatar" style="
			width: ${size}px;
			height: ${size}px;
			background-color: ${bgColor};
			color: white;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: ${fontSize}px;
			font-weight: 600;
			flex-shrink: 0;
		">${initials}</div>
	`;
}

// Toast Notification System
const Toast = {
	container: null,

	init() {
		if (this.container) return;
		this.container = document.createElement("div");
		this.container.id = "toast-container";
		this.container.className = "toast-container";
		document.body.appendChild(this.container);
	},

	show(message, type = "success", duration = 3000) {
		this.init();

		const toast = document.createElement("div");
		toast.className = `toast toast-${type}`;

		const icons = {
			success: "fa-check-circle",
			error: "fa-exclamation-circle",
			warning: "fa-exclamation-triangle",
			info: "fa-info-circle",
		};

		toast.innerHTML = `
			<div class="toast-icon">
				<i class="fas ${icons[type] || icons.info}"></i>
			</div>
			<div class="toast-content">
				<p class="toast-message">${message}</p>
			</div>
			<button class="toast-close" onclick="this.parentElement.remove()">
				<i class="fas fa-times"></i>
			</button>
		`;

		this.container.appendChild(toast);

		// Trigger animation
		requestAnimationFrame(() => {
			toast.classList.add("toast-show");
		});

		// Auto remove
		setTimeout(() => {
			toast.classList.remove("toast-show");
			toast.classList.add("toast-hide");
			setTimeout(() => toast.remove(), 300);
		}, duration);

		return toast;
	},

	success(message, duration) {
		return this.show(message, "success", duration);
	},

	error(message, duration) {
		return this.show(message, "error", duration);
	},

	warning(message, duration) {
		return this.show(message, "warning", duration);
	},

	info(message, duration) {
		return this.show(message, "info", duration);
	},
};

// Close delete modal
function closeDeleteModal() {
	const deleteModal = document.getElementById("deleteModal");
	if (deleteModal) deleteModal.classList.remove("active");
}

// Global click-outside handler to close any modal when clicking the overlay
window.addEventListener("click", function (event) {
	if (
		event.target &&
		event.target.classList &&
		event.target.classList.contains("modal")
	) {
		event.target.classList.remove("active");
	}
});

// Mobile Sidebar Toggle
document.addEventListener("DOMContentLoaded", function () {
	const mobileMenuToggle = document.getElementById("mobileMenuToggle");
	const sidebar = document.getElementById("sidebar");
	const sidebarOverlay = document.getElementById("sidebarOverlay");
	const sidebarClose = document.getElementById("sidebarClose");

	function openSidebar() {
		if (sidebar) sidebar.classList.add("active");
		if (sidebarOverlay) sidebarOverlay.classList.add("active");
		document.body.style.overflow = "hidden";
	}

	function closeSidebar() {
		if (sidebar) sidebar.classList.remove("active");
		if (sidebarOverlay) sidebarOverlay.classList.remove("active");
		document.body.style.overflow = "";
	}

	if (mobileMenuToggle) {
		mobileMenuToggle.addEventListener("click", openSidebar);
	}

	if (sidebarClose) {
		sidebarClose.addEventListener("click", closeSidebar);
	}

	if (sidebarOverlay) {
		sidebarOverlay.addEventListener("click", closeSidebar);
	}

	// Close sidebar when clicking a nav link (for mobile UX)
	const navLinks = document.querySelectorAll(".sidebar .nav-item");
	navLinks.forEach((link) => {
		link.addEventListener("click", function () {
			if (window.innerWidth <= 1024) {
				closeSidebar();
			}
		});
	});
});

// Header search handler (logs - pages can implement their own search logic separate from header)
document.addEventListener("DOMContentLoaded", function () {
	const headerSearch = document.querySelector(".search-box input");
	if (headerSearch) {
		headerSearch.addEventListener("input", function (e) {
			const term = e.target.value.toLowerCase();
			console.log("Header search:", term);
			// If you want the header search to trigger specific page search, we can dispatch a CustomEvent here.
		});
	}
});
