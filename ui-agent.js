// UI Agent - Dynamic UI/UX Management System
// This agent monitors other agents and user interactions to optimize the interface
// Now with full role-based UI optimization

class UIAgent {
    constructor() {
        this.agentStatus = 'ACTIVE';
        this.efficiency = '96%';
        this.lastUpdate = new Date();
        this.currentRole = this.detectUserRole(); // Auto-detect or get from session
        this.userPreferences = this.loadUserPreferences();
        this.interfaceState = {
            theme: 'auto',
            layout: 'default',
            animations: true,
            accessibility: false,
            performance: 'balanced'
        };
        this.agentObservations = {
            researchAgent: { activity: 'normal', priority: 'medium' },
            budgetAgent: { activity: 'high', priority: 'high' },
            reportingAgent: { activity: 'normal', priority: 'medium' }
        };
        this.performanceMetrics = {
            loadTime: 0,
            interactionDelay: 0,
            memoryUsage: 0
        };
        
        // Role-specific configurations
        this.roleConfigs = {
            runner: {
                primaryColor: '#3b82f6', // Blue
                accentColor: '#1d4ed8',
                priorityAgents: ['researchAgent', 'budgetAgent'],
                defaultLayout: 'compact',
                quickActions: ['checkin', 'expense', 'missions', 'venues'],
                features: ['venueResearch', 'expenseTracking', 'routeOptimization'],
                dashboardLayout: 'grid-2x2'
            },
            client: {
                primaryColor: '#8b5cf6', // Purple
                accentColor: '#7c3aed',
                priorityAgents: ['reportingAgent'],
                defaultLayout: 'default',
                quickActions: ['bookings', 'preferences', 'analytics', 'support'],
                features: ['bookingAnalytics', 'preferenceAnalysis', 'serviceOptimization'],
                dashboardLayout: 'grid-1x3'
            },
            operations: {
                primaryColor: '#10b981', // Green
                accentColor: '#059669',
                priorityAgents: ['reportingAgent', 'budgetAgent'],
                defaultLayout: 'default',
                quickActions: ['staff', 'inventory', 'metrics', 'reports'],
                features: ['staffManagement', 'inventoryTracking', 'performanceMetrics'],
                dashboardLayout: 'grid-3x2'
            }
        };
    }

    // Detect user role from various sources
    detectUserRole() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const roleParam = urlParams.get('role');
        if (roleParam && ['runner', 'client', 'operations'].includes(roleParam)) {
            return roleParam;
        }

        // Check localStorage for saved role
        const savedRole = localStorage.getItem('clubRunUserRole');
        if (savedRole && ['runner', 'client', 'operations'].includes(savedRole)) {
            return savedRole;
        }

        // Check for role indicators in the page
        const roleIndicators = {
            runner: ['venue', 'expense', 'checkin', 'mission'],
            client: ['booking', 'preference', 'analytics', 'service'],
            operations: ['staff', 'inventory', 'metric', 'report']
        };

        const pageContent = document.body.textContent.toLowerCase();
        for (const [role, indicators] of Object.entries(roleIndicators)) {
            if (indicators.some(indicator => pageContent.includes(indicator))) {
                return role;
            }
        }

        // Default to runner if no role detected
        return 'runner';
    }

    // Set user role
    setUserRole(role) {
        if (['runner', 'client', 'operations'].includes(role)) {
            this.currentRole = role;
            localStorage.setItem('clubRunUserRole', role);
            this.applyRoleBasedOptimizations();
            this.updateUIAgentMessage(`Role switched to ${role}`);
        }
    }

    // Get current role configuration
    getRoleConfig() {
        return this.roleConfigs[this.currentRole] || this.roleConfigs.runner;
    }

    // Initialize the UI Agent
    initialize() {
        console.log(`🎨 UI Agent initialized for ${this.currentRole} role - Monitoring interface optimization`);
        this.setupEventListeners();
        this.startMonitoring();
        this.applyRoleBasedOptimizations();
        this.updateInterface();
        this.displayStatus();
    }

    // Load user preferences from localStorage
    loadUserPreferences() {
        const stored = localStorage.getItem('clubRunUIPreferences');
        const defaultPrefs = {
            theme: 'auto',
            layout: this.getRoleConfig().defaultLayout,
            animations: true,
            accessibility: false,
            compactMode: false,
            colorBlindness: false,
            fontSize: 'medium'
        };
        return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
    }

    // Save user preferences
    saveUserPreferences() {
        localStorage.setItem('clubRunUIPreferences', JSON.stringify(this.userPreferences));
    }

    // Apply role-based optimizations
    applyRoleBasedOptimizations() {
        const config = this.getRoleConfig();
        
        // Update CSS variables for role-specific theming
        const root = document.documentElement;
        root.style.setProperty('--ui-agent-primary', config.primaryColor);
        root.style.setProperty('--ui-agent-secondary', config.accentColor);
        
        // Apply role-specific layout
        this.applyRoleBasedLayout();
        
        // Update agent priorities
        this.updateAgentPriorities();
        
        // Update quick actions
        this.updateQuickActions();
        
        // Apply role-specific features
        this.applyRoleSpecificFeatures();
    }

    // Apply role-based layout
    applyRoleBasedLayout() {
        const config = this.getRoleConfig();
        const agentGrid = document.querySelector('.agent-grid');
        
        if (agentGrid) {
            switch (config.dashboardLayout) {
                case 'grid-1x3':
                    agentGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    agentGrid.style.gap = '1rem';
                    break;
                case 'grid-2x2':
                    agentGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    agentGrid.style.gap = '1.5rem';
                    break;
                case 'grid-3x2':
                    agentGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    agentGrid.style.gap = '1rem';
                    break;
                default:
                    agentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
                    agentGrid.style.gap = '1.5rem';
            }
        }
    }

    // Update agent priorities based on role
    updateAgentPriorities() {
        const config = this.getRoleConfig();
        
        // Reset all agent priorities
        Object.keys(this.agentObservations).forEach(agent => {
            this.agentObservations[agent].priority = 'medium';
        });
        
        // Set high priority for role-specific agents
        config.priorityAgents.forEach(agent => {
            if (this.agentObservations[agent]) {
                this.agentObservations[agent].priority = 'high';
            }
        });
    }

    // Update quick actions based on role
    updateQuickActions() {
        const config = this.getRoleConfig();
        const quickActionsGrid = document.querySelector('.quick-actions-grid');
        
        if (quickActionsGrid) {
            quickActionsGrid.innerHTML = '';
            
            config.quickActions.forEach(action => {
                const button = this.createQuickActionButton(action);
                quickActionsGrid.appendChild(button);
            });
        }
    }

    // Create quick action button
    createQuickActionButton(action) {
        const button = document.createElement('button');
        button.className = 'quick-action-btn';
        button.onclick = () => this.handleQuickAction(action);
        
        const actionConfig = this.getQuickActionConfig(action);
        button.innerHTML = `
            <div class="quick-action-icon">${actionConfig.icon}</div>
            <span>${actionConfig.label}</span>
        `;
        
        return button;
    }

    // Get quick action configuration
    getQuickActionConfig(action) {
        const actionConfigs = {
            // Runner actions
            checkin: { icon: '📱', label: 'Quick Check-In' },
            expense: { icon: '💰', label: 'Log Expense' },
            missions: { icon: '🎯', label: 'View Missions' },
            venues: { icon: '🏢', label: 'Venue Research' },
            
            // Client actions
            bookings: { icon: '📅', label: 'My Bookings' },
            preferences: { icon: '⭐', label: 'Preferences' },
            analytics: { icon: '📊', label: 'Analytics' },
            support: { icon: '🆘', label: 'Support' },
            
            // Operations actions
            staff: { icon: '👥', label: 'Staff Management' },
            inventory: { icon: '📦', label: 'Inventory' },
            metrics: { icon: '📈', label: 'Performance' },
            reports: { icon: '📋', label: 'Reports' }
        };
        
        return actionConfigs[action] || { icon: '⚙️', label: action };
    }

    // Handle quick actions
    handleQuickAction(action) {
        const role = this.currentRole;
        const config = this.getRoleConfig();
        
        // Role-specific action handling
        switch (role) {
            case 'runner':
                this.handleRunnerAction(action);
                break;
            case 'client':
                this.handleClientAction(action);
                break;
            case 'operations':
                this.handleOperationsAction(action);
                break;
        }
    }

    // Handle runner-specific actions
    handleRunnerAction(action) {
        const messages = {
            checkin: 'Check-in system optimized for venue operations',
            expense: 'Expense tracking focused on operational costs',
            missions: 'Mission dashboard showing venue assignments',
            venues: 'Venue research with crowd intelligence'
        };
        
        this.showRoleSpecificNotification(messages[action] || 'Runner action executed');
    }

    // Handle client-specific actions
    handleClientAction(action) {
        const messages = {
            bookings: 'Booking analytics with preference optimization',
            preferences: 'Service preference management',
            analytics: 'Client-focused performance metrics',
            support: 'VIP support system activated'
        };
        
        this.showRoleSpecificNotification(messages[action] || 'Client action executed');
    }

    // Handle operations-specific actions
    handleOperationsAction(action) {
        const messages = {
            staff: 'Staff management with performance tracking',
            inventory: 'Inventory management with real-time updates',
            metrics: 'Operational performance dashboard',
            reports: 'Comprehensive reporting system'
        };
        
        this.showRoleSpecificNotification(messages[action] || 'Operations action executed');
    }

    // Show role-specific notification
    showRoleSpecificNotification(message) {
        const config = this.getRoleConfig();
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'ui-agent-notification';
        notification.style.background = `linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor})`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">🎯</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Apply role-specific features
    applyRoleSpecificFeatures() {
        const config = this.getRoleConfig();
        
        // Add role-specific CSS classes
        document.body.classList.remove('role-runner', 'role-client', 'role-operations');
        document.body.classList.add(`role-${this.currentRole}`);
        
        // Apply role-specific styling
        this.applyRoleSpecificStyling();
        
        // Update agent descriptions
        this.updateAgentDescriptions();
    }

    // Apply role-specific styling
    applyRoleSpecificStyling() {
        const config = this.getRoleConfig();
        
        // Create role-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .role-${this.currentRole} .ui-agent-card {
                background: linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor});
            }
            
            .role-${this.currentRole} .quick-action-btn:hover {
                background: ${config.primaryColor}20;
                border-color: ${config.primaryColor};
            }
            
            .role-${this.currentRole} .agent-card[data-agent="${config.priorityAgents[0]}"] {
                border-color: ${config.primaryColor};
                box-shadow: 0 0 20px ${config.primaryColor}30;
            }
        `;
        
        // Remove existing role styles
        const existingStyle = document.getElementById('role-specific-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'role-specific-styles';
        document.head.appendChild(style);
    }

    // Update agent descriptions based on role
    updateAgentDescriptions() {
        const roleDescriptions = {
            runner: {
                researchAgent: 'Analyzing venue crowd reports and trends',
                budgetAgent: 'Tracking operational expenses and costs',
                reportingAgent: 'Processing check-in verifications'
            },
            client: {
                researchAgent: 'Analyzing service preferences and trends',
                budgetAgent: 'Tracking booking costs and budgets',
                reportingAgent: 'Generating client analytics reports'
            },
            operations: {
                researchAgent: 'Analyzing operational efficiency metrics',
                budgetAgent: 'Tracking overall business performance',
                reportingAgent: 'Generating comprehensive operational reports'
            }
        };
        
        const descriptions = roleDescriptions[this.currentRole];
        if (descriptions) {
            Object.entries(descriptions).forEach(([agent, description]) => {
                const agentCard = document.querySelector(`[data-agent="${agent}"]`);
                if (agentCard) {
                    const descElement = agentCard.querySelector('.agent-description');
                    if (descElement) {
                        descElement.textContent = description;
                    }
                }
            });
        }
    }

    // Setup event listeners for user interactions
    setupEventListeners() {
        // Monitor user interactions
        document.addEventListener('click', (e) => this.trackInteraction(e, 'click'));
        document.addEventListener('scroll', (e) => this.trackInteraction(e, 'scroll'));
        document.addEventListener('keydown', (e) => this.trackInteraction(e, 'keyboard'));
        
        // Monitor performance
        window.addEventListener('load', () => this.measurePerformance());
        
        // Monitor agent updates
        this.setupAgentMonitoring();
        
        // Add role switcher if not present
        this.addRoleSwitcher();
    }

    // Add role switcher to the interface
    addRoleSwitcher() {
        if (!document.querySelector('.role-switcher')) {
            const switcher = document.createElement('div');
            switcher.className = 'role-switcher';
            switcher.innerHTML = `
                <div class="role-switcher-header">
                    <span>🎭 Role: ${this.currentRole}</span>
                    <button onclick="uiAgent.toggleRoleSwitcher()">Switch</button>
                </div>
                <div class="role-switcher-options" style="display: none;">
                    <button onclick="uiAgent.setUserRole('runner')" class="${this.currentRole === 'runner' ? 'active' : ''}">
                        🏃 Runner
                    </button>
                    <button onclick="uiAgent.setUserRole('client')" class="${this.currentRole === 'client' ? 'active' : ''}">
                        👑 Client
                    </button>
                    <button onclick="uiAgent.setUserRole('operations')" class="${this.currentRole === 'operations' ? 'active' : ''}">
                        ⚙️ Operations
                    </button>
                </div>
            `;
            
            // Insert after navigation
            const nav = document.querySelector('.navbar');
            if (nav) {
                nav.parentNode.insertBefore(switcher, nav.nextSibling);
            }
        }
    }

    // Toggle role switcher visibility
    toggleRoleSwitcher() {
        const options = document.querySelector('.role-switcher-options');
        if (options) {
            options.style.display = options.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Track user interactions for optimization
    trackInteraction(event, type) {
        const target = event.target;
        const interaction = {
            type,
            target: target.tagName,
            className: target.className,
            timestamp: Date.now(),
            path: window.location.pathname,
            role: this.currentRole
        };

        // Analyze interaction patterns
        this.analyzeInteractionPattern(interaction);
    }

    // Analyze interaction patterns for UI optimization
    analyzeInteractionPattern(interaction) {
        // Track frequently used elements
        if (!this.userPreferences.frequentElements) {
            this.userPreferences.frequentElements = {};
        }

        const elementKey = `${interaction.target}.${interaction.className}`;
        this.userPreferences.frequentElements[elementKey] = 
            (this.userPreferences.frequentElements[elementKey] || 0) + 1;

        // Role-specific optimization
        this.optimizeInterfaceForRole();
    }

    // Optimize interface for current role
    optimizeInterfaceForRole() {
        const config = this.getRoleConfig();
        
        // Prioritize role-specific elements
        config.features.forEach(feature => {
            const elements = document.querySelectorAll(`[data-feature="${feature}"]`);
            elements.forEach(el => {
                el.style.order = '-1';
                el.style.opacity = '1';
            });
        });
    }

    // Start monitoring other agents and system performance
    startMonitoring() {
        // Monitor agent activities every 10 seconds
        setInterval(() => this.monitorAgentActivities(), 10000);
        
        // Monitor performance every 30 seconds
        setInterval(() => this.monitorPerformance(), 30000);
        
        // Update interface every 15 seconds
        setInterval(() => this.updateInterface(), 15000);
    }

    // Monitor other agents' activities
    monitorAgentActivities() {
        // Simulate monitoring other agents (in real app, this would connect to agent APIs)
        const agents = ['researchAgent', 'budgetAgent', 'reportingAgent'];
        
        agents.forEach(agentName => {
            const activity = Math.random();
            const priority = Math.random();
            
            this.agentObservations[agentName] = {
                activity: activity > 0.7 ? 'high' : activity > 0.3 ? 'normal' : 'low',
                priority: priority > 0.8 ? 'high' : priority > 0.4 ? 'medium' : 'low'
            };
        });

        // Update interface based on agent priorities
        this.updateInterfaceBasedOnAgents();
    }

    // Update interface based on agent activities
    updateInterfaceBasedOnAgents() {
        const config = this.getRoleConfig();
        const highPriorityAgents = Object.entries(this.agentObservations)
            .filter(([_, data]) => data.priority === 'high')
            .map(([name, _]) => name);

        // Highlight high-priority agents with role-specific styling
        highPriorityAgents.forEach(agentName => {
            const agentCard = document.querySelector(`[data-agent="${agentName}"]`);
            if (agentCard) {
                agentCard.classList.add('priority-highlight');
                agentCard.style.borderColor = config.primaryColor;
                setTimeout(() => {
                    agentCard.classList.remove('priority-highlight');
                    agentCard.style.borderColor = '';
                }, 3000);
            }
        });

        // Adjust layout based on agent activity
        if (highPriorityAgents.length > 1) {
            this.optimizeLayoutForMultipleAgents();
        }
    }

    // Optimize layout for multiple active agents
    optimizeLayoutForMultipleAgents() {
        const container = document.querySelector('.agent-grid');
        if (container) {
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            container.style.gap = '1.5rem';
        }
    }

    // Monitor system performance
    monitorPerformance() {
        // Measure page load time
        if (performance.timing) {
            this.performanceMetrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        }

        // Measure memory usage (if available)
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
        }

        // Optimize based on performance
        this.optimizeForPerformance();
    }

    // Optimize interface for performance
    optimizeForPerformance() {
        if (this.performanceMetrics.loadTime > 3000) {
            // Reduce animations for better performance
            this.userPreferences.animations = false;
            this.applyPerformanceOptimizations();
        }
    }

    // Apply performance optimizations
    applyPerformanceOptimizations() {
        const style = document.createElement('style');
        style.textContent = `
            .performance-mode * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            .performance-mode .agent-card {
                backdrop-filter: none;
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('performance-mode');
    }

    // Update the interface based on current state
    updateInterface() {
        this.updateTheme();
        this.updateLayout();
        this.updateAccessibility();
        this.updateAnimations();
        this.updateStatus();
    }

    // Update theme based on user preference and time
    updateTheme() {
        const currentHour = new Date().getHours();
        let theme = this.userPreferences.theme;

        if (theme === 'auto') {
            theme = currentHour >= 18 || currentHour < 6 ? 'dark' : 'light';
        }

        // Apply theme
        document.body.setAttribute('data-theme', theme);
        
        // Update CSS variables for theme
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#1a1a1a');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--card-bg', '#2d2d2d');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--text-primary', '#1a1a1a');
            root.style.setProperty('--card-bg', '#f8f9fa');
        }
    }

    // Update layout based on screen size and user preference
    updateLayout() {
        const screenWidth = window.innerWidth;
        const layout = this.userPreferences.layout;

        if (screenWidth < 768) {
            this.applyMobileLayout();
        } else if (layout === 'compact') {
            this.applyCompactLayout();
        } else {
            this.applyDefaultLayout();
        }
    }

    // Apply mobile-optimized layout
    applyMobileLayout() {
        const agentGrid = document.querySelector('.agent-grid');
        if (agentGrid) {
            agentGrid.style.gridTemplateColumns = '1fr';
            agentGrid.style.gap = '1rem';
        }

        // Optimize navigation for mobile
        const nav = document.querySelector('.nav-menu');
        if (nav) {
            nav.classList.add('mobile-optimized');
        }
    }

    // Apply compact layout
    applyCompactLayout() {
        const agentGrid = document.querySelector('.agent-grid');
        if (agentGrid) {
            agentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            agentGrid.style.gap = '0.75rem';
        }

        // Reduce padding and margins
        document.body.classList.add('compact-mode');
    }

    // Apply default layout
    applyDefaultLayout() {
        const agentGrid = document.querySelector('.agent-grid');
        if (agentGrid) {
            agentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
            agentGrid.style.gap = '1.5rem';
        }

        document.body.classList.remove('compact-mode');
    }

    // Update accessibility features
    updateAccessibility() {
        if (this.userPreferences.accessibility) {
            this.enableAccessibilityFeatures();
        } else {
            this.disableAccessibilityFeatures();
        }
    }

    // Enable accessibility features
    enableAccessibilityFeatures() {
        // Increase contrast
        document.body.classList.add('high-contrast');
        
        // Increase font size
        document.body.style.fontSize = '1.1em';
        
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 3px solid #007bff !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Disable accessibility features
    disableAccessibilityFeatures() {
        document.body.classList.remove('high-contrast');
        document.body.style.fontSize = '';
    }

    // Update animations based on user preference
    updateAnimations() {
        if (this.userPreferences.animations) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    // Update UI Agent status display
    updateStatus() {
        const statusElement = document.querySelector('.ui-agent-status');
        if (statusElement) {
            statusElement.textContent = this.agentStatus;
            statusElement.className = `ui-agent-status ${this.agentStatus.toLowerCase()}`;
        }

        const efficiencyElement = document.querySelector('.ui-agent-efficiency');
        if (efficiencyElement) {
            efficiencyElement.textContent = this.efficiency;
        }
    }

    // Display UI Agent status in the interface
    displayStatus() {
        // Create UI Agent status card if it doesn't exist
        if (!document.querySelector('.ui-agent-card')) {
            this.createUIAgentCard();
        }
    }

    // Create UI Agent status card
    createUIAgentCard() {
        const agentGrid = document.querySelector('.agent-grid');
        if (!agentGrid) return;

        const config = this.getRoleConfig();
        const uiAgentCard = document.createElement('div');
        uiAgentCard.className = 'agent-card ui-agent-card';
        uiAgentCard.setAttribute('data-agent', 'uiAgent');
        
        uiAgentCard.innerHTML = `
            <div class="agent-header">
                <div class="agent-icon ui-agent-icon">🎨</div>
                <div class="agent-status ui-agent-status active">${this.agentStatus}</div>
            </div>
            <div class="agent-info">
                <h3>UI Agent (${this.currentRole})</h3>
                <div class="agent-efficiency">
                    <span class="efficiency-label">Efficiency:</span>
                    <span class="efficiency-value ui-agent-efficiency">${this.efficiency}</span>
                </div>
                <p class="agent-description">Optimizing interface for ${this.currentRole} role</p>
            </div>
            <div class="agent-update">
                <div class="update-box ui-agent-update">
                    <div class="update-border ui-agent-border"></div>
                    <p class="ui-agent-message">Interface optimized for ${this.currentRole} workflow</p>
                </div>
            </div>
            <div class="ui-agent-controls">
                <button class="ui-agent-btn" onclick="uiAgent.toggleTheme()">Toggle Theme</button>
                <button class="ui-agent-btn" onclick="uiAgent.toggleLayout()">Toggle Layout</button>
                <button class="ui-agent-btn" onclick="uiAgent.toggleAnimations()">Toggle Animations</button>
                <button class="ui-agent-btn" onclick="uiAgent.toggleRoleSwitcher()">Switch Role</button>
            </div>
        `;

        agentGrid.appendChild(uiAgentCard);
    }

    // Toggle theme
    toggleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.userPreferences.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.userPreferences.theme = themes[nextIndex];
        this.saveUserPreferences();
        this.updateTheme();
        this.updateUIAgentMessage(`Theme switched to ${this.userPreferences.theme}`);
    }

    // Toggle layout
    toggleLayout() {
        const layouts = ['default', 'compact'];
        const currentIndex = layouts.indexOf(this.userPreferences.layout);
        const nextIndex = (currentIndex + 1) % layouts.length;
        this.userPreferences.layout = layouts[nextIndex];
        this.saveUserPreferences();
        this.updateLayout();
        this.updateUIAgentMessage(`Layout switched to ${this.userPreferences.layout}`);
    }

    // Toggle animations
    toggleAnimations() {
        this.userPreferences.animations = !this.userPreferences.animations;
        this.saveUserPreferences();
        this.updateAnimations();
        this.updateUIAgentMessage(`Animations ${this.userPreferences.animations ? 'enabled' : 'disabled'}`);
    }

    // Update UI Agent message
    updateUIAgentMessage(message) {
        const messageElement = document.querySelector('.ui-agent-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.animation = 'fadeIn 0.5s ease-in-out';
            setTimeout(() => {
                messageElement.style.animation = '';
            }, 500);
        }
    }

    // Setup monitoring for other agents
    setupAgentMonitoring() {
        // Listen for agent status changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    this.analyzeAgentChanges(mutation);
                }
            });
        });

        // Observe agent cards for changes
        const agentCards = document.querySelectorAll('.agent-card');
        agentCards.forEach(card => {
            observer.observe(card, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    // Analyze changes in agent cards
    analyzeAgentChanges(mutation) {
        const target = mutation.target;
        
        // Check if agent status changed
        if (target.classList && target.classList.contains('agent-status')) {
            const status = target.textContent;
            const agentCard = target.closest('.agent-card');
            
            if (agentCard && status === 'UPDATING') {
                // Optimize interface for agent updates
                this.optimizeForAgentUpdate(agentCard);
            }
        }
    }

    // Optimize interface for agent updates
    optimizeForAgentUpdate(agentCard) {
        const config = this.getRoleConfig();
        
        // Add visual feedback for agent updates
        agentCard.style.boxShadow = `0 0 20px ${config.primaryColor}50`;
        agentCard.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            agentCard.style.boxShadow = '';
            agentCard.style.transform = '';
        }, 2000);
    }

    // Get UI Agent statistics
    getStats() {
        return {
            status: this.agentStatus,
            efficiency: this.efficiency,
            lastUpdate: this.lastUpdate,
            currentRole: this.currentRole,
            userPreferences: this.userPreferences,
            agentObservations: this.agentObservations,
            performanceMetrics: this.performanceMetrics
        };
    }

    // Export UI Agent configuration
    exportConfig() {
        return {
            userPreferences: this.userPreferences,
            interfaceState: this.interfaceState,
            currentRole: this.currentRole,
            timestamp: new Date().toISOString()
        };
    }

    // Import UI Agent configuration
    importConfig(config) {
        if (config.userPreferences) {
            this.userPreferences = { ...this.userPreferences, ...config.userPreferences };
            this.saveUserPreferences();
        }
        
        if (config.interfaceState) {
            this.interfaceState = { ...this.interfaceState, ...config.interfaceState };
        }
        
        if (config.currentRole) {
            this.setUserRole(config.currentRole);
        }
        
        this.updateInterface();
        this.updateUIAgentMessage('Configuration imported successfully');
    }

    // Set theme method for settings panel
    setTheme(theme) {
        this.userPreferences.theme = theme;
        this.saveUserPreferences();
        this.updateTheme();
        this.updateUIAgentMessage(`Theme set to ${theme}`);
    }

    // Set layout method for settings panel
    setLayout(layout) {
        this.userPreferences.layout = layout;
        this.saveUserPreferences();
        this.updateLayout();
        this.updateUIAgentMessage(`Layout switched to ${layout}`);
    }

    // Set animations method for settings panel
    setAnimations(enabled) {
        this.userPreferences.animations = enabled;
        this.saveUserPreferences();
        this.updateAnimations();
        this.updateUIAgentMessage(`Animations ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Set accessibility method for settings panel
    setAccessibility(enabled) {
        this.userPreferences.accessibility = enabled;
        this.saveUserPreferences();
        this.updateAccessibility();
        this.updateUIAgentMessage(`Accessibility mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Measure performance method
    measurePerformance() {
        if (performance.timing) {
            this.performanceMetrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        }
        
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
        }
        
        console.log('Performance metrics:', this.performanceMetrics);
    }

    // Optimize interface method
    optimizeInterface() {
        // Analyze frequent elements and optimize layout
        if (this.userPreferences.frequentElements) {
            const mostUsed = Object.entries(this.userPreferences.frequentElements)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);
            
            if (mostUsed.length > 0) {
                this.updateUIAgentMessage(`Optimizing for most used elements: ${mostUsed.map(([key]) => key).join(', ')}`);
            }
        }
    }
}

// Initialize UI Agent when DOM is loaded
let uiAgent;
document.addEventListener('DOMContentLoaded', function() {
    uiAgent = new UIAgent();
    uiAgent.initialize();
    
    // Add UI Agent to global scope for debugging
    window.uiAgent = uiAgent;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIAgent;
} 