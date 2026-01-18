// Dashboard JavaScript

// Sample data - Replace with actual API calls
const dashboardData = {
    totalProducts: 1234,
    totalSuppliers: 87,
    lowStockItems: 23,
    inventoryValue: 456789
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadAlerts();
    loadSuggestedItems();
    loadRecentTransactions();
});

// Load dashboard statistics
function loadDashboardStats() {
    // Animate numbers
    animateValue('totalProducts', 0, dashboardData.totalProducts, 1000);
    animateValue('totalSuppliers', 0, dashboardData.totalSuppliers, 1000);
    animateValue('lowStockItems', 0, dashboardData.lowStockItems, 1000);

    // Format inventory value
    const valueElement = document.getElementById('inventoryValue');
    if (valueElement) {
        animateCurrency('inventoryValue', 0, dashboardData.inventoryValue, 1000);
    }
}

// Animate number values
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Animate currency values
function animateCurrency(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = '$' + Math.floor(current).toLocaleString();
    }, 16);
}

// Load low stock alerts
function loadAlerts() {
    // This would normally fetch from an API
    console.log('Alerts loaded');
}

// Load suggested items
function loadSuggestedItems() {
    // This would normally fetch from an API
    console.log('Suggested items loaded');
}

// Load recent transactions
function loadRecentTransactions() {
    // This would normally fetch from an API
    console.log('Recent transactions loaded');
}