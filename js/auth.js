// ==================== AUTHENTICATION FUNCTIONS ====================

// Get current logged-in user
function getCurrentUser() {
    const userJson = sessionStorage.getItem('devconnect_current_user');
    return userJson ? JSON.parse(userJson) : null;
}

// Login user
function login(user) {
    sessionStorage.setItem('devconnect_current_user', JSON.stringify(user));
    return user;
}

// Logout user
function logout() {
    sessionStorage.removeItem('devconnect_current_user');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Require authentication (redirect if not logged in)
function requireAuth(requiredRole = null) {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = 'login.html';
        return false;
    }

    if (requiredRole && user.role !== requiredRole) {
        alert('Access denied. Wrong user role.');
        logout();
        return false;
    }

    return true;
}

// Update current user session
function updateCurrentUserSession(updates) {
    const user = getCurrentUser();
    if (user) {
        const updatedUser = { ...user, ...updates };
        sessionStorage.setItem('devconnect_current_user', JSON.stringify(updatedUser));
        return updatedUser;
    }
    return null;
}

// ==================== AUTO-REDIRECT LOGIC ====================

// Redirect authenticated users from auth pages
function redirectIfAuthenticated() {
    const user = getCurrentUser();

    if (user) {
        if (user.role === 'freelancer') {
            window.location.href = 'freelancer-dashboard.html';
        } else if (user.role === 'client') {
            window.location.href = 'owner-dashboard.html';
        }
    }
}

// ==================== INITIALIZATION ====================

// Initialize auth on page load
if (typeof window !== 'undefined') {
    // Add logout functionality to logout buttons
    document.addEventListener('DOMContentLoaded', function () {
        const logoutBtns = document.querySelectorAll('.logout-btn, [data-action="logout"]');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    logout();
                }
            });
        });

        // Premium Logout Animation
        const premiumLogoutBtns = document.querySelectorAll('.logoutButton, [data-action="logout-premium"]');
        premiumLogoutBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                // Don't double-trigger
                if (btn.classList.contains('falling')) return;

                // Add .falling — gate stays open, person falls spinning
                btn.classList.add('falling');

                // 1000ms fall + 100ms delay + 250ms fade + 150ms buffer = 1500ms
                setTimeout(() => {
                    logout();
                }, 1500);
            });
        });
    });
}
