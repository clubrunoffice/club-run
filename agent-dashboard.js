// Agent Dashboard JavaScript

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAgentDashboard();
    setupEventListeners();
    startAgentUpdates();
});

// Initialize the agent dashboard
function initializeAgentDashboard() {
    console.log('Agent Dashboard initialized');
    
    // Add animation classes to agent cards
    const agentCards = document.querySelectorAll('.agent-card');
    agentCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in');
    });
    
    // Add animation to quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach((btn, index) => {
        btn.style.animationDelay = `${(index + 3) * 0.1}s`;
        btn.classList.add('fade-in');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Quick action button event listeners
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Agent card hover effects
    document.querySelectorAll('.agent-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Start periodic agent updates
function startAgentUpdates() {
    // Update agent status every 30 seconds
    setInterval(updateAgentStatus, 30000);
    
    // Update agent efficiency every 60 seconds
    setInterval(updateAgentEfficiency, 60000);
    
    // Update agent messages every 45 seconds
    setInterval(updateAgentMessages, 45000);
}

// Update agent status
function updateAgentStatus() {
    const statusElements = document.querySelectorAll('.agent-status');
    statusElements.forEach(status => {
        // Simulate status changes (in real app, this would come from backend)
        if (Math.random() > 0.95) {
            status.textContent = 'UPDATING';
            status.className = 'agent-status updating';
            setTimeout(() => {
                status.textContent = 'ACTIVE';
                status.className = 'agent-status active';
            }, 2000);
        }
    });
}

// Update agent efficiency
function updateAgentEfficiency() {
    const efficiencyValues = document.querySelectorAll('.efficiency-value');
    efficiencyValues.forEach(efficiency => {
        const currentValue = parseInt(efficiency.textContent);
        const newValue = Math.max(85, Math.min(99, currentValue + (Math.random() > 0.5 ? 1 : -1)));
        efficiency.textContent = newValue + '%';
        
        // Add a subtle animation
        efficiency.style.transform = 'scale(1.1)';
        efficiency.style.color = newValue > currentValue ? '#22c55e' : '#f97316';
        setTimeout(() => {
            efficiency.style.transform = 'scale(1)';
            efficiency.style.color = '#22c55e';
        }, 500);
    });
}

// Update agent messages
function updateAgentMessages() {
    const updateMessages = [
        {
            research: [
                "529 Bar trending up - expect higher crowd tonight.",
                "New venue opening nearby - monitoring impact.",
                "Social media sentiment analysis complete.",
                "Crowd prediction model updated."
            ],
            budget: [
                "$15 under budget this week - great job!",
                "Vendor payment processed successfully.",
                "Weekly expense report generated.",
                "Budget allocation optimized."
            ],
            reporting: [
                "All recent check-ins verified successfully.",
                "Daily report compiled and sent.",
                "Data integrity check completed.",
                "Performance metrics updated."
            ]
        }
    ];
    
    const updateBoxes = document.querySelectorAll('.update-box p');
    updateBoxes.forEach((box, index) => {
        if (Math.random() > 0.7) {
            const agentType = index === 0 ? 'research' : index === 1 ? 'budget' : 'reporting';
            const messages = updateMessages[0][agentType];
            const newMessage = messages[Math.floor(Math.random() * messages.length)];
            
            // Fade out effect
            box.style.opacity = '0';
            setTimeout(() => {
                box.textContent = newMessage;
                box.style.opacity = '1';
            }, 300);
        }
    });
}

// Quick Check-In function
function quickCheckIn() {
    showToast('Quick Check-In initiated', 'info');
    
    // Simulate check-in process
    setTimeout(() => {
        showToast('Check-in completed successfully!', 'success');
    }, 1500);
}

// Log Expense function
function logExpense() {
    showToast('Opening expense log form...', 'info');
    
    // In a real app, this would open a modal or form
    setTimeout(() => {
        showToast('Expense logged: $45.00', 'success');
    }, 2000);
}

// View Missions function
function viewMissions() {
    showToast('Loading missions...', 'info');
    
    // Simulate loading missions
    setTimeout(() => {
        showToast('3 active missions found', 'success');
    }, 1500);
}

// Open Chat function
function openChat() {
    showToast('Opening chat interface...', 'info');
    
    // In a real app, this would open the chat widget
    if (typeof openChatWidget === 'function') {
        openChatWidget();
    } else {
        setTimeout(() => {
            showToast('Chat interface ready', 'success');
        }, 1000);
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    if (typeof Toastify === 'undefined') {
        console.log(`Toast: ${message}`);
        return;
    }
    
    const backgroundColor = type === 'success' ? '#22c55e' : 
                           type === 'error' ? '#ef4444' : 
                           type === 'warning' ? '#f97316' : '#3b82f6';
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: backgroundColor,
        stopOnFocus: true,
        style: {
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500'
        }
    }).showToast();
}

// Auth modal functions (reused from main dashboard)
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
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
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
    showToast('Authentication feature coming soon!', 'info');
    closeAuthModal();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (!event.target.closest('.nav-menu') && !event.target.closest('.nav-toggle')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .agent-status.updating {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
        border-color: rgba(245, 158, 11, 0.3);
    }
    
    .update-box {
        transition: all 0.3s ease;
    }
    
    .update-box p {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.quickCheckIn = quickCheckIn;
window.logExpense = logExpense;
window.viewMissions = viewMissions;
window.openChat = openChat;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthMode = toggleAuthMode;
window.handleAuth = handleAuth;
window.toggleMobileMenu = toggleMobileMenu; 