/* ===== CLUB RUN FRONTEND - MAIN APPLICATION ===== */

// Global state management
const AppState = {
  currentTab: 'dashboard',
  theme: localStorage.getItem('theme') || 'dark',
  user: null,
  venues: [],
  missions: [],
  chatOpen: false,
  sidebarOpen: false,
  notifications: []
};

// Utility functions
const Utils = {
  // DOM helpers
  $(selector) {
    return document.querySelector(selector);
  },
  
  $$(selector) {
    return document.querySelectorAll(selector);
  },
  
  // Event delegation
  delegate(element, eventType, selector, handler) {
    element.addEventListener(eventType, (event) => {
      const target = event.target.closest(selector);
      if (target && element.contains(target)) {
        handler.call(target, event);
      }
    });
  },
  
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">×</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Manual close
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    });
  }
};

// API service module
const API = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      Utils.showToast(`Error: ${error.message}`, 'error');
      throw error;
    }
  },
  
  // Auth endpoints
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  async register(email, password, name) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  },
  
  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  },
  
  // Data endpoints
  async getVenues() {
    return this.request('/api/venues');
  },
  
  async getMissions() {
    return this.request('/api/missions');
  },
  
  async getUserProfile() {
    return this.request('/api/user/profile');
  },
  
  async createCheckin(venueId) {
    return this.request('/api/checkins', {
      method: 'POST',
      body: JSON.stringify({ venueId })
    });
  },
  
  async logExpense(amount, description, venueId) {
    return this.request('/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ amount, description, venueId })
    });
  },
  
  async claimMission(missionId) {
    return this.request(`/api/missions/${missionId}/claim`, {
      method: 'POST'
    });
  },
  
  // Copilot chat
  async sendMessage(message) {
    return this.request('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },
  
  async getChatHistory() {
    return this.request('/api/chat/history');
  }
};

// Theme management
const ThemeManager = {
  init() {
    this.applyTheme(AppState.theme);
    this.bindEvents();
  },
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AppState.theme = theme;
    localStorage.setItem('theme', theme);
  },
  
  toggle() {
    const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  },
  
  bindEvents() {
    const themeToggle = Utils.$('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggle());
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      });
    }
  }
};

// Navigation and tab management
const Navigation = {
  init() {
    this.bindEvents();
    this.setActiveTab(AppState.currentTab);
  },
  
  setActiveTab(tabName) {
    // Update state
    AppState.currentTab = tabName;
    
    // Update navigation items
    Utils.$$('.nav-item, .mobile-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      }
    });
    
    // Show/hide content sections
    Utils.$$('.content-section').forEach(section => {
      section.classList.add('hidden');
    });
    
    const activeSection = Utils.$(`[data-section="${tabName}"]`);
    if (activeSection) {
      activeSection.classList.remove('hidden');
      activeSection.classList.add('fade-in');
    }
    
    // Update URL without page reload
    history.pushState({ tab: tabName }, '', `#${tabName}`);
  },
  
  bindEvents() {
    // Desktop navigation
    Utils.delegate(document, 'click', '.nav-item', (e) => {
      e.preventDefault();
      const tabName = this.dataset.tab;
      Navigation.setActiveTab(tabName);
    });
    
    // Mobile navigation
    Utils.delegate(document, 'click', '.mobile-nav-item', (e) => {
      e.preventDefault();
      const tabName = this.dataset.tab;
      Navigation.setActiveTab(tabName);
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.tab) {
        Navigation.setActiveTab(e.state.tab);
      }
    });
  }
};

// Sidebar management
const Sidebar = {
  init() {
    this.bindEvents();
    this.handleResize();
  },
  
  toggle() {
    AppState.sidebarOpen = !AppState.sidebarOpen;
    const sidebar = Utils.$('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open', AppState.sidebarOpen);
    }
  },
  
  close() {
    AppState.sidebarOpen = false;
    const sidebar = Utils.$('.sidebar');
    if (sidebar) {
      sidebar.classList.remove('open');
    }
  },
  
  bindEvents() {
    // Toggle button
    const toggleBtn = Utils.$('.sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    // Close on overlay click
    Utils.delegate(document, 'click', '.sidebar-overlay', () => {
      this.close();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && AppState.sidebarOpen) {
        this.close();
      }
    });
  },
  
  handleResize() {
    const resizeHandler = Utils.debounce(() => {
      if (window.innerWidth >= 1200) {
        this.close();
      }
    }, 250);
    
    window.addEventListener('resize', resizeHandler);
  }
};

// Copilot chat functionality
const CopilotChat = {
  init() {
    this.bindEvents();
    this.loadChatHistory();
  },
  
  toggle() {
    AppState.chatOpen = !AppState.chatOpen;
    const chatSection = Utils.$('.copilot-section');
    if (chatSection) {
      chatSection.classList.toggle('hidden', !AppState.chatOpen);
      if (AppState.chatOpen) {
        chatSection.classList.add('slide-in-right');
        this.scrollToBottom();
        this.focusInput();
      }
    }
  },
  
  async sendMessage(message) {
    if (!message.trim()) return;
    
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Clear input
    const input = Utils.$('.copilot-input input');
    if (input) input.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Send to API
      const response = await API.sendMessage(message);
      
      // Remove typing indicator
      this.hideTypingIndicator();
      
      // Add assistant response
      this.addMessage(response.message || response.response, 'assistant');
      
      // Handle actionable responses
      this.handleActionableResponse(response);
      
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    }
  },
  
  addMessage(content, sender) {
    const messagesContainer = Utils.$('.copilot-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
      <div class="message-content">${content}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  },
  
  showTypingIndicator() {
    const messagesContainer = Utils.$('.copilot-messages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  },
  
  hideTypingIndicator() {
    const typingIndicator = Utils.$('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  },
  
  scrollToBottom() {
    const messagesContainer = Utils.$('.copilot-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  },
  
  focusInput() {
    const input = Utils.$('.copilot-input input');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  },
  
  async loadChatHistory() {
    try {
      const history = await API.getChatHistory();
      history.forEach(msg => {
        this.addMessage(msg.content, msg.sender);
      });
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  },
  
  handleActionableResponse(response) {
    if (response.action) {
      switch (response.action.type) {
        case 'checkin':
          VenueManager.handleCheckin(response.action.venueId);
          break;
        case 'claim_mission':
          MissionManager.claimMission(response.action.missionId);
          break;
        case 'show_venue':
          Navigation.setActiveTab('venues');
          break;
        case 'show_missions':
          Navigation.setActiveTab('missions');
          break;
      }
    }
  },
  
  bindEvents() {
    // Toggle button
    const toggleBtn = Utils.$('.copilot-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    // Send message
    const sendBtn = Utils.$('.copilot-send');
    const input = Utils.$('.copilot-input input');
    
    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => {
        this.sendMessage(input.value);
      });
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage(input.value);
        }
      });
    }
    
    // Close button
    const closeBtn = Utils.$('.copilot-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggle());
    }
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && AppState.chatOpen) {
        this.toggle();
      }
    });
  }
};

// Venue management
const VenueManager = {
  init() {
    this.loadVenues();
    this.bindEvents();
  },
  
  async loadVenues() {
    try {
      const venues = await API.getVenues();
      AppState.venues = venues;
      this.renderVenues();
    } catch (error) {
      console.error('Failed to load venues:', error);
    }
  },
  
  renderVenues() {
    const container = Utils.$('.venues-grid');
    if (!container) return;
    
    container.innerHTML = AppState.venues.map(venue => `
      <div class="venue-card" data-venue-id="${venue.id}">
        <div class="venue-image" style="background-image: url('${venue.image || ''}')"></div>
        <div class="venue-content">
          <h3 class="venue-name">${venue.name}</h3>
          <p class="venue-description">${venue.description}</p>
          <div class="venue-meta">
            <span class="venue-location">${venue.location}</span>
            <div class="venue-rating">
              <span>★</span>
              <span>${venue.rating || '4.5'}</span>
            </div>
          </div>
          <button class="btn btn-primary venue-checkin" data-venue-id="${venue.id}">
            Check In
          </button>
        </div>
      </div>
    `).join('');
  },
  
  async handleCheckin(venueId) {
    try {
      const result = await API.createCheckin(venueId);
      Utils.showToast(`Successfully checked in! +${result.tokensEarned} tokens earned`, 'success');
      
      // Update user stats
      if (AppState.user) {
        AppState.user.tokens += result.tokensEarned;
        AppState.user.checkins += 1;
        Dashboard.updateStats();
      }
      
      // Show confetti effect
      this.showConfetti();
      
    } catch (error) {
      Utils.showToast('Failed to check in. Please try again.', 'error');
    }
  },
  
  showConfetti() {
    // Simple confetti effect
    const colors = ['#00E5FF', '#8B5CF6', '#FFD700'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${Math.random() * window.innerWidth}px;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          animation: confetti-fall 3s linear forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 50);
    }
  },
  
  bindEvents() {
    Utils.delegate(document, 'click', '.venue-checkin', (e) => {
      e.preventDefault();
      const venueId = this.dataset.venueId;
      this.handleCheckin(venueId);
    });
  }
};

// Mission management
const MissionManager = {
  init() {
    this.loadMissions();
    this.bindEvents();
  },
  
  async loadMissions() {
    try {
      const missions = await API.getMissions();
      AppState.missions = missions;
      this.renderMissions();
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  },
  
  renderMissions() {
    const container = Utils.$('.missions-grid');
    if (!container) return;
    
    container.innerHTML = AppState.missions.map(mission => `
      <div class="mission-card" data-mission-id="${mission.id}">
        <div class="mission-header">
          <h3 class="mission-title">${mission.title}</h3>
          <span class="mission-reward">+${mission.reward} tokens</span>
        </div>
        <p class="mission-description">${mission.description}</p>
        <div class="mission-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${mission.progress}%"></div>
          </div>
          <div class="progress-text">${mission.progress}/${mission.target}</div>
        </div>
        ${mission.completed ? 
          '<button class="btn btn-primary mission-claim" disabled>Completed</button>' :
          '<button class="btn btn-secondary mission-claim">Claim Reward</button>'
        }
      </div>
    `).join('');
  },
  
  async claimMission(missionId) {
    try {
      const result = await API.claimMission(missionId);
      Utils.showToast(`Mission completed! +${result.tokensEarned} tokens earned`, 'success');
      
      // Update mission state
      const mission = AppState.missions.find(m => m.id === missionId);
      if (mission) {
        mission.completed = true;
        this.renderMissions();
      }
      
      // Update user stats
      if (AppState.user) {
        AppState.user.tokens += result.tokensEarned;
        Dashboard.updateStats();
      }
      
    } catch (error) {
      Utils.showToast('Failed to claim mission reward.', 'error');
    }
  },
  
  bindEvents() {
    Utils.delegate(document, 'click', '.mission-claim', (e) => {
      e.preventDefault();
      if (!this.disabled) {
        const missionId = this.closest('.mission-card').dataset.missionId;
        this.claimMission(missionId);
      }
    });
  }
};

// Dashboard functionality
const Dashboard = {
  init() {
    this.loadUserData();
    this.bindEvents();
  },
  
  async loadUserData() {
    try {
      const userData = await API.getUserProfile();
      AppState.user = userData;
      this.updateStats();
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
  
  updateStats() {
    if (!AppState.user) return;
    
    // Update stat cards
    const statElements = {
      tokens: Utils.$('.stat-tokens .stat-value'),
      checkins: Utils.$('.stat-checkins .stat-value'),
      missions: Utils.$('.stat-missions .stat-value'),
      expenses: Utils.$('.stat-expenses .stat-value')
    };
    
    if (statElements.tokens) statElements.tokens.textContent = AppState.user.tokens || 0;
    if (statElements.checkins) statElements.checkins.textContent = AppState.user.checkins || 0;
    if (statElements.missions) statElements.missions.textContent = AppState.user.completedMissions || 0;
    if (statElements.expenses) statElements.expenses.textContent = `$${AppState.user.totalExpenses || 0}`;
  },
  
  bindEvents() {
    // Quick action buttons
    Utils.delegate(document, 'click', '.quick-checkin', () => {
      ModalManager.open('checkin');
    });
    
    Utils.delegate(document, 'click', '.quick-expense', () => {
      ModalManager.open('expense');
    });
  }
};

// Modal management
const ModalManager = {
  init() {
    this.bindEvents();
  },
  
  open(modalType) {
    const modal = Utils.$(`[data-modal="${modalType}"]`);
    if (!modal) return;
    
    modal.classList.remove('hidden');
    modal.classList.add('fade-in');
    
    // Focus first input
    const firstInput = modal.querySelector('input, button');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
    
    // Trap focus
    this.trapFocus(modal);
  },
  
  close(modalType) {
    const modal = Utils.$(`[data-modal="${modalType}"]`);
    if (!modal) return;
    
    modal.classList.add('fade-out');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('fade-out');
    }, 300);
  },
  
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    modal.addEventListener('keydown', handleTabKey);
    
    // Store for cleanup
    modal._tabHandler = handleTabKey;
  },
  
  bindEvents() {
    // Close on overlay click
    Utils.delegate(document, 'click', '.modal-overlay', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('[data-modal]');
        if (modal) {
          this.close(modal.dataset.modal);
        }
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = Utils.$('[data-modal]:not(.hidden)');
        if (openModal) {
          this.close(openModal.dataset.modal);
        }
      }
    });
    
    // Close buttons
    Utils.delegate(document, 'click', '.modal-close', (e) => {
      const modal = this.closest('[data-modal]');
      if (modal) {
        this.close(modal.dataset.modal);
      }
    });
    
    // Form submissions
    Utils.delegate(document, 'submit', '.modal form', (e) => {
      e.preventDefault();
      this.handleFormSubmit(e.target);
    });
  },
  
  async handleFormSubmit(form) {
    const formData = new FormData(form);
    const modalType = form.closest('[data-modal]').dataset.modal;
    
    try {
      switch (modalType) {
        case 'checkin':
          const venueId = formData.get('venueId');
          await VenueManager.handleCheckin(venueId);
          break;
          
        case 'expense':
          const amount = parseFloat(formData.get('amount'));
          const description = formData.get('description');
          const expenseVenueId = formData.get('venueId');
          
          await API.logExpense(amount, description, expenseVenueId);
          Utils.showToast('Expense logged successfully!', 'success');
          break;
      }
      
      this.close(modalType);
      form.reset();
      
    } catch (error) {
      Utils.showToast('Failed to submit form. Please try again.', 'error');
    }
  }
};

// Authentication management
const AuthManager = {
  init() {
    this.checkAuthStatus();
    this.bindEvents();
  },
  
  async checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const userData = await API.getUserProfile();
        AppState.user = userData;
        Dashboard.updateStats();
      } catch (error) {
        this.logout();
      }
    } else {
      this.showLoginForm();
    }
  },
  
  async login(email, password) {
    try {
      const response = await API.login(email, password);
      localStorage.setItem('authToken', response.token);
      AppState.user = response.user;
      
      Utils.showToast('Welcome back!', 'success');
      this.hideLoginForm();
      Dashboard.updateStats();
      
    } catch (error) {
      Utils.showToast('Login failed. Please check your credentials.', 'error');
    }
  },
  
  async register(email, password, name) {
    try {
      const response = await API.register(email, password, name);
      localStorage.setItem('authToken', response.token);
      AppState.user = response.user;
      
      Utils.showToast('Account created successfully!', 'success');
      this.hideLoginForm();
      Dashboard.updateStats();
      
    } catch (error) {
      Utils.showToast('Registration failed. Please try again.', 'error');
    }
  },
  
  async logout() {
    try {
      await API.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('authToken');
    AppState.user = null;
    this.showLoginForm();
    Utils.showToast('Logged out successfully', 'info');
  },
  
  showLoginForm() {
    const loginSection = Utils.$('.login-section');
    if (loginSection) {
      loginSection.classList.remove('hidden');
    }
  },
  
  hideLoginForm() {
    const loginSection = Utils.$('.login-section');
    if (loginSection) {
      loginSection.classList.add('hidden');
    }
  },
  
  bindEvents() {
    // Login form
    Utils.delegate(document, 'submit', '.login-form', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      this.login(email, password);
    });
    
    // Register form
    Utils.delegate(document, 'submit', '.register-form', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      const name = formData.get('name');
      this.register(email, password, name);
    });
    
    // Logout button
    Utils.delegate(document, 'click', '.logout-btn', () => {
      this.logout();
    });
  }
};

// Main application initialization
const App = {
  init() {
    // Initialize all modules
    ThemeManager.init();
    Navigation.init();
    Sidebar.init();
    CopilotChat.init();
    VenueManager.init();
    MissionManager.init();
    Dashboard.init();
    ModalManager.init();
    AuthManager.init();
    
    // Add CSS for confetti animation
    this.addConfettiCSS();
    
    console.log('Club Run app initialized successfully!');
  },
  
  addConfettiCSS() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
      
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        z-index: var(--z-tooltip);
        max-width: 300px;
        box-shadow: var(--shadow-lg);
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-sm);
      }
      
      .toast-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .toast-close:hover {
        color: var(--text-primary);
      }
      
      .fade-out {
        animation: fadeOut 0.3s ease-in-out forwards;
      }
      
      @keyframes fadeOut {
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    App,
    AppState,
    Utils,
    API,
    ThemeManager,
    Navigation,
    Sidebar,
    CopilotChat,
    VenueManager,
    MissionManager,
    Dashboard,
    ModalManager,
    AuthManager
  };
} 