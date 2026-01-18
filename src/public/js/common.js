// Common utilities for pages

// Capitalize first letter
function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// Close delete modal
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) deleteModal.classList.remove('active');
}

// Global click-outside handler to close any modal when clicking the overlay
window.addEventListener('click', function(event) {
    if (event.target && event.target.classList && event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// Header search handler (logs - pages can implement their own search logic separate from header)
document.addEventListener('DOMContentLoaded', function() {
    const headerSearch = document.querySelector('.search-box input');
    if (headerSearch) {
        headerSearch.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            console.log('Header search:', term);
            // If you want the header search to trigger specific page search, we can dispatch a CustomEvent here.
        });
    }
});