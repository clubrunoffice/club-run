// Dashboard JavaScript for Club Run
let revenueChart, guestChart;
let currentTimeFilter = 'today';

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupEventListeners();
    updateDashboardData();
    
    // Auto-refresh every 30 seconds
    setInterval(updateDashboardData, 30000);
});

// Setup event listeners
function setupEventListeners() {
    // Chart period buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.dataset.period;
            const chartContainer = this.closest('.chart-container');
            
            // Update active state
            chartContainer.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data based on period
            updateChartData(period, chartContainer.querySelector('h3').textContent);
        });
    });
}

// Initialize charts
function initializeCharts() {
    const revenueCtx = document.getElementById('revenueChart');
    const guestCtx = document.getElementById('guestChart');
    
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1800, 2400, 3200, 4800, 7200, 9600, 8400, 6400],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
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
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    if (guestCtx) {
        guestChart = new Chart(guestCtx, {
            type: 'line',
            data: {
                labels: ['6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM'],
                datasets: [{
                    label: 'Guests',
                    data: [45, 68, 89, 120, 156, 198, 247, 220, 180],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
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
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
}

// Update dashboard data
function updateDashboardData() {
    // Simulate real-time data updates
    const guestCount = Math.floor(Math.random() * 50) + 220;
    const revenue = Math.floor(Math.random() * 2000) + 14000;
    const capacity = Math.floor(Math.random() * 20) + 70;
    
    // Update metrics
    document.querySelector('.dashboard-card:nth-child(1) .metric-large').textContent = guestCount;
    document.querySelector('.dashboard-card:nth-child(2) .metric-large').textContent = '$' + revenue.toLocaleString();
    document.querySelector('.dashboard-card:nth-child(3) .metric-large').textContent = capacity + '%';
    document.querySelector('.dashboard-card:nth-child(3) .capacity-fill').style.width = capacity + '%';
    
    // Update trends
    updateTrends();
    
    // Update activity feed
    addActivityItem();
}

// Update trends
function updateTrends() {
    const trends = [
        '+12% from yesterday',
        '+8% from yesterday',
        '+15% from yesterday',
        '+5% from yesterday'
    ];
    
    document.querySelectorAll('.metric-trend.positive').forEach((trend, index) => {
        if (index < trends.length) {
            trend.textContent = trends[index];
        }
    });
}

// Add activity item
function addActivityItem() {
    const activities = [
        { icon: '🎉', title: 'Peak hour reached', time: '1 minute ago' },
        { icon: '💰', title: 'VIP table booked', time: '3 minutes ago' },
        { icon: '👥', title: 'Group of 6 arrived', time: '5 minutes ago' },
        { icon: '🍾', title: 'Bottle service ordered', time: '7 minutes ago' },
        { icon: '🎵', title: 'DJ set started', time: '10 minutes ago' }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">${randomActivity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${randomActivity.title}</div>
                <div class="activity-time">${randomActivity.time}</div>
            </div>
        `;
        
        // Add to beginning of list
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Remove oldest item if more than 4
        if (activityList.children.length > 4) {
            activityList.removeChild(activityList.lastChild);
        }
    }
}

// Refresh dashboard
function refreshDashboard() {
    const refreshBtn = document.querySelector('.btn-refresh');
    refreshBtn.innerHTML = '<span class="refresh-icon">🔄</span> Refreshing...';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        updateDashboardData();
        refreshBtn.innerHTML = '<span class="refresh-icon">🔄</span> Refresh';
        refreshBtn.disabled = false;
        
        // Show success message
        showToast('Dashboard refreshed successfully!', 'success');
    }, 1000);
}

// Update time filter
function updateTimeFilter(filter) {
    currentTimeFilter = filter;
    
    // Update chart data based on filter
    if (revenueChart) {
        updateChartDataForFilter(revenueChart, filter, 'revenue');
    }
    if (guestChart) {
        updateChartDataForFilter(guestChart, filter, 'guests');
    }
    
    showToast(`Data updated for ${filter}`, 'info');
}

// Update chart data for filter
function updateChartDataForFilter(chart, filter, type) {
    let labels, data;
    
    switch (filter) {
        case 'today':
            labels = ['6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM'];
            data = type === 'revenue' 
                ? [1200, 1800, 2400, 3200, 4800, 7200, 9600, 8400, 6400]
                : [45, 68, 89, 120, 156, 198, 247, 220, 180];
            break;
        case 'week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = type === 'revenue'
                ? [8500, 9200, 7800, 8900, 12400, 16400, 11800]
                : [120, 135, 110, 125, 180, 247, 165];
            break;
        case 'month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = type === 'revenue'
                ? [45000, 52000, 48000, 55000]
                : [650, 720, 680, 750];
            break;
        case 'quarter':
            labels = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
            data = type === 'revenue'
                ? [180000, 220000, 240000, 280000]
                : [2500, 3000, 3200, 3800];
            break;
    }
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Export data
function exportData() {
    const exportBtn = document.querySelector('.btn-export');
    exportBtn.innerHTML = '<span class="export-icon">📊</span> Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate export
        const data = {
            timestamp: new Date().toISOString(),
            timeFilter: currentTimeFilter,
            metrics: {
                guestCount: document.querySelector('.dashboard-card:nth-child(1) .metric-large').textContent,
                revenue: document.querySelector('.dashboard-card:nth-child(2) .metric-large').textContent,
                capacity: document.querySelector('.dashboard-card:nth-child(3) .metric-large').textContent,
                staffOnDuty: document.querySelector('.dashboard-card:nth-child(4) .metric-large').textContent
            }
        };
        
        // Create download link
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `club-run-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        exportBtn.innerHTML = '<span class="export-icon">📊</span> Export';
        exportBtn.disabled = false;
        
        showToast('Dashboard data exported successfully!', 'success');
    }, 1500);
}

// Show toast notification
function showToast(message, type = 'info') {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'success' ? "#10B981" : type === 'error' ? "#EF4444" : "#3B82F6",
            stopOnFocus: true
        }).showToast();
    }
}

// Auth modal functions (shared with main page)
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authTitle');
    const toggle = document.getElementById('authToggle');
    
    if (mode === 'signup') {
        title.textContent = 'Sign Up';
        toggle.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>';
    } else {
        title.textContent = 'Login';
        toggle.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>';
    }
    
    modal.classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function toggleAuthMode() {
    const title = document.getElementById('authTitle');
    const toggle = document.getElementById('authToggle');
    
    if (title.textContent === 'Login') {
        title.textContent = 'Sign Up';
        toggle.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>';
    } else {
        title.textContent = 'Login';
        toggle.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>';
    }
}

function handleAuth(event) {
    event.preventDefault();
    // Add authentication logic here
    showToast('Authentication feature coming soon!', 'info');
    closeAuthModal();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navAuth = document.querySelector('.nav-auth');
    
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    navAuth.style.display = navAuth.style.display === 'flex' ? 'none' : 'flex';
} 