import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Role types - now matching backend enum
export type UserRole = 'GUEST' | 'RUNNER' | 'CLIENT' | 'OPERATIONS' | 'PARTNER' | 'ADMIN';

// Role configurations
export interface RoleConfig {
  primaryColor: string;
  accentColor: string;
  priorityAgents: string[];
  defaultLayout: string;
  quickActions: string[];
  features: string[];
  dashboardLayout: string;
  displayName: string;
  description: string;
}

// User preferences
export interface UserPreferences {
  theme: 'auto' | 'light' | 'dark';
  layout: 'default' | 'compact';
  animations: boolean;
  accessibility: boolean;
  compactMode: boolean;
  colorBlindness: boolean;
  fontSize: 'small' | 'medium' | 'large';
  frequentElements?: Record<string, number>;
}

// Agent observations
export interface AgentObservation {
  activity: 'low' | 'normal' | 'high';
  priority: 'low' | 'medium' | 'high';
}

// Performance metrics
export interface PerformanceMetrics {
  loadTime: number;
  interactionDelay: number;
  memoryUsage: number;
}

// UI Agent state
export interface UIAgentState {
  agentStatus: string;
  efficiency: string;
  lastUpdate: Date;
  currentRole: UserRole;
  userPreferences: UserPreferences;
  agentObservations: Record<string, AgentObservation>;
  performanceMetrics: PerformanceMetrics;
  roleConfigs: Record<UserRole, RoleConfig>;
}

// UI Agent context type
interface UIAgentContextType {
  state: UIAgentState;
  setTheme: (theme: UserPreferences['theme']) => void;
  setLayout: (layout: UserPreferences['layout']) => void;
  setAnimations: (enabled: boolean) => void;
  setAccessibility: (enabled: boolean) => void;
  getRoleConfig: () => RoleConfig;
  updateAgentObservation: (agentName: string, observation: AgentObservation) => void;
  handleQuickAction: (action: string) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  // Removed setUserRole - roles are now managed by backend
}

// Create context
const UIAgentContext = createContext<UIAgentContextType | null>(null);

// Role configurations - updated to match backend roles
const roleConfigs: Record<UserRole, RoleConfig> = {
  GUEST: {
    primaryColor: '#6b7280',
    accentColor: '#4b5563',
    priorityAgents: [],
    defaultLayout: 'default',
    quickActions: ['signup', 'login', 'features', 'contact'],
    features: ['publicFeatures', 'demoAccess', 'limitedPreview'],
    dashboardLayout: 'grid-1x2',
    displayName: '👤 Guest',
    description: 'Public access and limited preview'
  },
  RUNNER: {
    primaryColor: '#3b82f6',
    accentColor: '#1d4ed8',
    priorityAgents: ['researchAgent', 'budgetAgent'],
    defaultLayout: 'compact',
    quickActions: ['checkin', 'expense', 'missions', 'venues'],
    features: ['venueResearch', 'expenseTracking', 'routeOptimization'],
    dashboardLayout: 'grid-2x2',
    displayName: '🏃 Runner',
    description: 'Venue operations and expense tracking'
  },
  CLIENT: {
    primaryColor: '#8b5cf6',
    accentColor: '#7c3aed',
    priorityAgents: ['reportingAgent'],
    defaultLayout: 'default',
    quickActions: ['bookings', 'preferences', 'analytics', 'support'],
    features: ['bookingAnalytics', 'preferenceAnalysis', 'serviceOptimization'],
    dashboardLayout: 'grid-1x3',
    displayName: '👑 Client',
    description: 'Booking analytics and service optimization'
  },
  OPERATIONS: {
    primaryColor: '#10b981',
    accentColor: '#059669',
    priorityAgents: ['reportingAgent', 'budgetAgent'],
    defaultLayout: 'default',
    quickActions: ['staff', 'inventory', 'metrics', 'reports'],
    features: ['staffManagement', 'inventoryTracking', 'performanceMetrics'],
    dashboardLayout: 'grid-3x2',
    displayName: '⚙️ Operations',
    description: 'Staff management and performance metrics'
  },
  PARTNER: {
    primaryColor: '#f59e0b',
    accentColor: '#d97706',
    priorityAgents: ['reportingAgent'],
    defaultLayout: 'default',
    quickActions: ['partnerships', 'analytics', 'support', 'resources'],
    features: ['partnershipAnalytics', 'resourceManagement', 'collaborationTools'],
    dashboardLayout: 'grid-2x2',
    displayName: '🤝 Partner',
    description: 'Partnership management and collaboration'
  },
  ADMIN: {
    primaryColor: '#ef4444',
    accentColor: '#dc2626',
    priorityAgents: ['reportingAgent', 'budgetAgent', 'researchAgent'],
    defaultLayout: 'default',
    quickActions: ['users', 'roles', 'logs', 'settings'],
    features: ['userManagement', 'roleManagement', 'systemLogs', 'adminTools'],
    dashboardLayout: 'grid-3x3',
    displayName: '🔧 Admin',
    description: 'System administration and user management'
  }
};

// Quick action configurations
const quickActionConfigs = {
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

// Load user preferences from localStorage
const loadUserPreferences = (defaultRole: UserRole): UserPreferences => {
  const stored = localStorage.getItem('clubRunUIPreferences');
  const defaultPrefs: UserPreferences = {
    theme: 'auto',
    layout: roleConfigs[defaultRole].defaultLayout as 'default' | 'compact',
    animations: true,
    accessibility: false,
    compactMode: false,
    colorBlindness: false,
    fontSize: 'medium'
  };
  return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
};

// Get user role from backend - this will be called by the provider
const getUserRoleFromBackend = async (): Promise<UserRole> => {
  try {
    const token = localStorage.getItem('clubRunToken');
    if (!token) {
      return 'GUEST'; // Default to GUEST for unauthenticated users
    }

    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.user.role || 'GUEST';
    }
  } catch (error) {
    console.error('Failed to get user role from backend:', error);
  }
  
  return 'GUEST'; // Default fallback
};

// Provider component
interface UIAgentProviderProps {
  children: ReactNode;
}

export const UIAgentProvider: React.FC<UIAgentProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('GUEST');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => 
    loadUserPreferences('GUEST')
  );
  const [agentObservations, setAgentObservations] = useState<Record<string, AgentObservation>>({
    researchAgent: { activity: 'normal', priority: 'medium' },
    budgetAgent: { activity: 'high', priority: 'high' },
    reportingAgent: { activity: 'normal', priority: 'medium' }
  });
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    interactionDelay: 0,
    memoryUsage: 0
  });

  // State object
  const state: UIAgentState = {
    agentStatus: 'ACTIVE',
    efficiency: '96%',
    lastUpdate: new Date(),
    currentRole,
    userPreferences,
    agentObservations,
    performanceMetrics,
    roleConfigs
  };

  // Save user preferences
  const saveUserPreferences = (prefs: UserPreferences) => {
    localStorage.setItem('clubRunUIPreferences', JSON.stringify(prefs));
    setUserPreferences(prefs);
  };

  // Update agent priorities based on role
  const updateAgentPriorities = (role: UserRole) => {
    const config = roleConfigs[role];
    const newObservations = { ...agentObservations };
    
    // Reset all priorities
    Object.keys(newObservations).forEach(agent => {
      newObservations[agent].priority = 'medium';
    });
    
    // Set high priority for role-specific agents
    config.priorityAgents.forEach(agent => {
      if (newObservations[agent]) {
        newObservations[agent].priority = 'high';
      }
    });
    
    setAgentObservations(newObservations);
  };

  // Set theme
  const setTheme = (theme: UserPreferences['theme']) => {
    const newPrefs = { ...userPreferences, theme };
    saveUserPreferences(newPrefs);
    showNotification(`Theme set to ${theme}`, 'info');
  };

  // Set layout
  const setLayout = (layout: UserPreferences['layout']) => {
    const newPrefs = { ...userPreferences, layout };
    saveUserPreferences(newPrefs);
    showNotification(`Layout switched to ${layout}`, 'info');
  };

  // Set animations
  const setAnimations = (enabled: boolean) => {
    const newPrefs = { ...userPreferences, animations: enabled };
    saveUserPreferences(newPrefs);
    showNotification(`Animations ${enabled ? 'enabled' : 'disabled'}`, 'info');
  };

  // Set accessibility
  const setAccessibility = (enabled: boolean) => {
    const newPrefs = { ...userPreferences, accessibility: enabled };
    saveUserPreferences(newPrefs);
    showNotification(`Accessibility mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
  };

  // Get current role configuration
  const getRoleConfig = (): RoleConfig => {
    return roleConfigs[currentRole];
  };

  // Update agent observation
  const updateAgentObservation = (agentName: string, observation: AgentObservation) => {
    setAgentObservations(prev => ({
      ...prev,
      [agentName]: observation
    }));
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    const roleMessages = {
      GUEST: {
        signup: 'Create a new account to access full features',
        login: 'Sign in to your existing account',
        features: 'Explore our powerful features',
        contact: 'Get in touch with our support team'
      },
      RUNNER: {
        checkin: 'Check-in system optimized for venue operations',
        expense: 'Expense tracking focused on operational costs',
        missions: 'Mission dashboard showing venue assignments',
        venues: 'Venue research with crowd intelligence'
      },
      CLIENT: {
        bookings: 'Booking analytics with preference optimization',
        preferences: 'Service preference management',
        analytics: 'Client-focused performance metrics',
        support: 'VIP support system activated'
      },
      OPERATIONS: {
        staff: 'Staff management with performance tracking',
        inventory: 'Inventory management with real-time updates',
        metrics: 'Operational performance dashboard',
        reports: 'Comprehensive reporting system'
      },
      PARTNER: {
        partnerships: 'Partnership management dashboard',
        analytics: 'Collaboration analytics and insights',
        support: 'Partner support system',
        resources: 'Resource allocation and sharing'
      },
      ADMIN: {
        users: 'User management system',
        roles: 'Role and permission management',
        logs: 'System logs and audit trail',
        settings: 'System configuration and settings'
      }
    };

    const messages = roleMessages[currentRole];
    const message = messages[action as keyof typeof messages] || `${action} action executed`;
    showNotification(message, 'info');
  };

  // Show notification
  const showNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `ui-agent-notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, ${roleConfigs[currentRole].primaryColor}, ${roleConfigs[currentRole].accentColor});
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem;">🎯</span>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // Remove notification
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // Initialize role from backend on mount
  useEffect(() => {
    const initializeRole = async () => {
      const role = await getUserRoleFromBackend();
      setCurrentRole(role);
      
      // Update preferences with role-specific defaults
      const newPrefs = {
        ...userPreferences,
        layout: roleConfigs[role].defaultLayout as 'default' | 'compact'
      };
      saveUserPreferences(newPrefs);
      
      // Update agent priorities
      updateAgentPriorities(role);
    };

    initializeRole();
  }, []);

  // Monitor performance
  useEffect(() => {
    const measurePerformance = () => {
      if (performance.timing) {
        setPerformanceMetrics(prev => ({
          ...prev,
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
        }));
      }
      
      // Check if performance.memory is available (Chrome only)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setPerformanceMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize
        }));
      }
    };

    measurePerformance();
    
    // Monitor performance every 30 seconds
    const interval = setInterval(measurePerformance, 30000);
    return () => clearInterval(interval);
  }, []);

  // Monitor agent activities
  useEffect(() => {
    const monitorAgents = () => {
      const agents = ['researchAgent', 'budgetAgent', 'reportingAgent'];
      const newObservations = { ...agentObservations };
      
      agents.forEach(agentName => {
        const activity = Math.random();
        const priority = Math.random();
        
        newObservations[agentName] = {
          activity: activity > 0.7 ? 'high' : activity > 0.3 ? 'normal' : 'low',
          priority: priority > 0.8 ? 'high' : priority > 0.4 ? 'medium' : 'low'
        };
      });
      
      setAgentObservations(newObservations);
    };

    // Monitor agents every 10 seconds
    const interval = setInterval(monitorAgents, 10000);
    return () => clearInterval(interval);
  }, [agentObservations]);

  // Apply theme to document
  useEffect(() => {
    const currentHour = new Date().getHours();
    let theme = userPreferences.theme;

    if (theme === 'auto') {
      theme = currentHour >= 18 || currentHour < 6 ? 'dark' : 'light';
    }

    document.body.setAttribute('data-theme', theme);
    document.body.classList.remove('role-runner', 'role-client', 'role-operations', 'role-partner', 'role-admin');
    document.body.classList.add(`role-${currentRole.toLowerCase()}`);
    
    // Apply role-specific CSS variables
    const root = document.documentElement;
    const config = roleConfigs[currentRole];
    root.style.setProperty('--ui-agent-primary', config.primaryColor);
    root.style.setProperty('--ui-agent-secondary', config.accentColor);
  }, [userPreferences.theme, currentRole]);

  // Apply accessibility features
  useEffect(() => {
    if (userPreferences.accessibility) {
      document.body.classList.add('high-contrast');
      document.body.style.fontSize = '1.1em';
    } else {
      document.body.classList.remove('high-contrast');
      document.body.style.fontSize = '';
    }
  }, [userPreferences.accessibility]);

  // Apply animations
  useEffect(() => {
    if (userPreferences.animations) {
      document.body.classList.remove('no-animations');
    } else {
      document.body.classList.add('no-animations');
    }
  }, [userPreferences.animations]);

  const contextValue: UIAgentContextType = {
    state,
    setTheme,
    setLayout,
    setAnimations,
    setAccessibility,
    getRoleConfig,
    updateAgentObservation,
    handleQuickAction,
    showNotification
  };

  return (
    <UIAgentContext.Provider value={contextValue}>
      {children}
    </UIAgentContext.Provider>
  );
};

// Hook to use UI Agent context
export const useUIAgent = (): UIAgentContextType => {
  const context = useContext(UIAgentContext);
  if (!context) {
    throw new Error('useUIAgent must be used within a UIAgentProvider');
  }
  return context;
};

// Export quick action configs
export { quickActionConfigs }; 