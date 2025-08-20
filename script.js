// Club Run - Main JavaScript File

// Global variables
let currentAuthMode = 'login';
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    initializeCharts();
    setupSmoothScrolling();
});

// Initialize the application
function initializeApp() {
    console.log('Club Run - AI-Powered Nightlife Operations Platform');
    
    // Add loading animation to page
    document.body.classList.add('loaded');
    
    // Initialize any stored data
    loadStoredData();
    
    // Update dashboard metrics
    updateDashboardMetrics();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close auth modal when clicking outside
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    // Form submissions
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
    
    // Dashboard refresh
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }
    
    // Time filter change
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => {
            updateTimeFilter(e.target.value);
        });
    }
}

// Mobile menu functionality
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    
    if (navToggle) {
        navToggle.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    if (navToggle) {
        navToggle.classList.remove('active');
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Authentication modal functions
function openAuthModal(mode = 'login') {
    currentAuthMode = mode;
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authTitle');
    const toggle = document.getElementById('authToggle');
    const form = document.getElementById('authForm');
    
    if (modal && title && toggle && form) {
        if (mode === 'signup') {
            title.textContent = 'Sign Up';
            toggle.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>';
            
            // Add name field for signup
            if (!form.querySelector('input[name="name"]')) {
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.name = 'name';
                nameInput.placeholder = 'Full Name';
                nameInput.required = true;
                form.insertBefore(nameInput, form.firstChild);
            }
        } else {
            title.textContent = 'Login';
            toggle.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>';
            
            // Remove name field for login
            const nameInput = form.querySelector('input[name="name"]');
            if (nameInput) {
                nameInput.remove();
            }
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('authForm');
        if (form) {
            form.reset();
        }
    }
}

function toggleAuthMode() {
    if (currentAuthMode === 'login') {
        openAuthModal('signup');
    } else {
        openAuthModal('login');
    }
}

// Handle authentication form submission
function handleAuth(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        if (currentAuthMode === 'signup') {
            // Handle signup
            showNotification('Account created successfully! Welcome to Club Run! 🎉', 'success');
        } else {
            // Handle login
            showNotification('Welcome back! 🎉', 'success');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeAuthModal();
        
        // Update UI for logged in state
        updateAuthUI(true);
        
    }, 1500);
}

// Update authentication UI
function updateAuthUI(isLoggedIn) {
    const authButtons = document.querySelector('.nav-auth');
    
    if (isLoggedIn && authButtons) {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="logout()">Logout</button>
        `;
    }
}

// Logout function
function logout() {
    showNotification('Logged out successfully', 'info');
    updateAuthUI(false);
    
    // Reset auth buttons
    const authButtons = document.querySelector('.nav-auth');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="openAuthModal()">Login</button>
            <button class="btn-signup" onclick="openAuthModal('signup')">Sign Up</button>
        `;
    }
}

// Contact form submission
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Dashboard functionality
function refreshDashboard() {
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.textContent = 'Refreshing...';
        refreshBtn.disabled = true;
    }
    
    // Simulate data refresh
    setTimeout(() => {
        updateDashboardMetrics();
        
        if (refreshBtn) {
            refreshBtn.textContent = 'Refresh';
            refreshBtn.disabled = false;
        }
        
        showNotification('Dashboard updated! 📊', 'success');
    }, 1000);
}

function updateTimeFilter(filter) {
    console.log('Time filter changed to:', filter);
    
    // Update metrics based on filter
    updateDashboardMetrics(filter);
    
    // Update charts
    updateCharts(filter);
    
    showNotification(`Showing data for ${filter} 📈`, 'info');
}

function updateDashboardMetrics(timeFilter = 'today') {
    // Simulate real-time data updates
    const metrics = {
        today: {
            guestCount: 247,
            revenue: 12450,
            avgSpend: 50.40,
            capacity: 78
        },
        week: {
            guestCount: 1247,
            revenue: 62450,
            avgSpend: 50.10,
            capacity: 82
        },
        month: {
            guestCount: 5247,
            revenue: 262450,
            avgSpend: 50.00,
            capacity: 85
        }
    };
    
    const data = metrics[timeFilter] || metrics.today;
    
    // Update metric displays
    const guestCountEl = document.querySelector('.dashboard-card:nth-child(1) .metric-large');
    const revenueEl = document.querySelector('.dashboard-card:nth-child(2) .metric-large');
    const avgSpendEl = document.querySelector('.dashboard-card:nth-child(3) .metric-large');
    const capacityEl = document.querySelector('.dashboard-card:nth-child(4) .metric-large');
    const capacityFillEl = document.querySelector('.capacity-fill');
    
    if (guestCountEl) guestCountEl.textContent = data.guestCount.toLocaleString();
    if (revenueEl) revenueEl.textContent = `$${data.revenue.toLocaleString()}`;
    if (avgSpendEl) avgSpendEl.textContent = `$${data.avgSpend}`;
    if (capacityEl) capacityEl.textContent = `${data.capacity}%`;
    if (capacityFillEl) capacityFillEl.style.width = `${data.capacity}%`;
    
    // Add animation to metrics
    animateMetrics();
}

function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-large');
    metrics.forEach(metric => {
        metric.style.transform = 'scale(1.1)';
        setTimeout(() => {
            metric.style.transform = 'scale(1)';
        }, 200);
    });
}

// Chart initialization and management
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [8500, 9200, 7800, 10500, 12450, 15800, 14200],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Guest Flow Chart
    const guestCtx = document.getElementById('guestChart');
    if (guestCtx) {
        charts.guest = new Chart(guestCtx, {
            type: 'bar',
            data: {
                labels: ['6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM'],
                datasets: [{
                    label: 'Guests',
                    data: [45, 78, 120, 180, 220, 195, 150],
                    backgroundColor: 'rgba(124, 58, 237, 0.8)',
                    borderColor: '#7C3AED',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

function updateCharts(timeFilter = 'today') {
    // Update chart data based on time filter
    const chartData = {
        today: {
            revenue: [8500, 9200, 7800, 10500, 12450, 15800, 14200],
            guests: [45, 78, 120, 180, 220, 195, 150]
        },
        week: {
            revenue: [8500, 9200, 7800, 10500, 12450, 15800, 14200],
            guests: [45, 78, 120, 180, 220, 195, 150]
        },
        month: {
            revenue: [8500, 9200, 7800, 10500, 12450, 15800, 14200],
            guests: [45, 78, 120, 180, 220, 195, 150]
        }
    };
    
    const data = chartData[timeFilter] || chartData.today;
    
    // Update revenue chart
    if (charts.revenue) {
        charts.revenue.data.datasets[0].data = data.revenue;
        charts.revenue.update();
    }
    
    // Update guest chart
    if (charts.guest) {
        charts.guest.data.datasets[0].data = data.guests;
        charts.guest.update();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: getNotificationColor(type),
            stopOnFocus: true,
            style: {
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif'
            }
        }).showToast();
    } else {
        // Fallback notification
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#10B981';
        case 'error':
            return '#EF4444';
        case 'warning':
            return '#F59E0B';
        default:
            return '#3B82F6';
    }
}

// Data management
function loadStoredData() {
    // Load any stored user preferences or data
    const storedTheme = localStorage.getItem('clubrun_theme');
    if (storedTheme) {
        document.body.setAttribute('data-theme', storedTheme);
    }
}

function saveStoredData() {
    // Save user preferences
    const theme = document.body.getAttribute('data-theme') || 'light';
    localStorage.setItem('clubrun_theme', theme);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .dashboard-card, .chart-container');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }
}

// Error handling
function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('JavaScript error:', event.error);
        showNotification('An error occurred. Please refresh the page.', 'error');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showNotification('An error occurred. Please try again.', 'error');
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    setupIntersectionObserver();
    monitorPerformance();
    setupErrorHandling();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feature-card,
        .dashboard-card,
        .chart-container {
            opacity: 0;
            transform: translateY(30px);
        }
    `;
    document.head.appendChild(style);
});

// Export functions for global access
window.ClubRun = {
    openAuthModal,
    closeAuthModal,
    refreshDashboard,
    updateTimeFilter,
    scrollToSection,
    showNotification
};

// Make functions globally accessible
window.scrollToSection = scrollToSection;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthMode = toggleAuthMode;
window.handleAuth = handleAuth;
window.submitContactForm = submitContactForm;
window.refreshDashboard = refreshDashboard;
window.updateTimeFilter = updateTimeFilter;
window.toggleMobileMenu = toggleMobileMenu;
window.logout = logout;
window.openContactForm = openContactForm;

// Contact form handler
function openContactForm() {
    // For now, just show a toast message
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: "Contact form coming soon! You can reach us at hello@clubrun.ai",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "#3B82F6",
            stopOnFocus: true
        }).showToast();
    } else {
        alert("Contact form coming soon! You can reach us at hello@clubrun.ai");
    }
} 