// Dashboard JavaScript

// Sample data - loaded from server via window.dashboardData
const dashboardData = window.dashboardData || {
	totalProducts: 0,
	totalSuppliers: 0,
	lowStockItems: 0,
	inventoryValue: 0,
};

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
	// Data is already rendered server-side, but we can add animations
	console.log("Dashboard loaded with data:", dashboardData);
});
