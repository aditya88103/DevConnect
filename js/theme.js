// ==================== THEME MANAGEMENT ====================
// Dark mode only — light theme has been removed.

function getCurrentTheme() {
    return 'dark';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('devconnect_theme', 'dark');
}

// Initialize on DOM load — always dark
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            document.documentElement.setAttribute('data-theme', 'dark');
        });
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}
