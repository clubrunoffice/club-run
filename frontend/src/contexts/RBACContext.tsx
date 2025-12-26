import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './PrivyAuthContext';

// Role hierarchy with numeric levels for comparison
const ROLE_HIERARCHY = {
  GUEST: 0,
  RUNNER: 1,
  DJ: 2,
  VERIFIED_DJ: 3,
  CLIENT: 4,
  CURATOR: 5,
  OPERATIONS: 6,
  PARTNER: 7,
  ADMIN: 8
} as const;

// Role-specific color themes
const ROLE_THEMES = {
  GUEST: {
    primary: '#6b7280',
    secondary: '#9ca3af',
    accent: '#d1d5db',
    background: '#f9fafb',
    text: '#374151'
  },
  RUNNER: {
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    background: '#ecfdf5',
    text: '#047857'
  },
  DJ: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    background: '#eff6ff',
    text: '#1e40af'
  },
  VERIFIED_DJ: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#6ee7b7',
    background: '#ecfdf5',
    text: '#047857'
  },
  CLIENT: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#c4b5fd',
    background: '#f5f3ff',
    text: '#5b21b6'
  },
  CURATOR: {
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#fcd34d',
    background: '#fffbeb',
    text: '#92400e'
  },
  OPERATIONS: {
    primary: '#ef4444',
    secondary: '#f87171',
    accent: '#fca5a5',
    background: '#fef2f2',
    text: '#991b1b'
  },
  PARTNER: {
    primary: '#06b6d4',
    secondary: '#22d3ee',
    accent: '#67e8f9',
    background: '#ecfeff',
    text: '#0e7490'
  },
  ADMIN: {
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#f87171',
    background: '#fef2f2',
    text: '#7f1d1d'
  }
} as const;

// Base permissions for each role
const BASE_PERMISSIONS = {
  GUEST: [
    'public:read',
    'auth:login',
    'auth:register'
  ],
  RUNNER: [
    'public:read',
    'auth:login',
    'auth:register',
    'user:read',
    'user:update',
    'missions:read',
    'missions:apply',
    'missions:accept',
    'missions:complete',
    'checkins:create',
    'checkins:read',
    'expenses:create',
    'expenses:read',
    'chat:read',
    'chat:send',
    'p2p-missions:accept',
    'p2p-missions:complete',
    'payments:receive'
  ],
  DJ: [
    'public:read',
    'auth:login',
    'auth:register',
    'user:read',
    'user:update',
    'missions:read',
    'missions:apply',
    'missions:accept',
    'missions:complete',
    'checkins:create',
    'checkins:read',
    'chat:read',
    'chat:send',
    'p2p-missions:accept',
    'p2p-missions:complete',
    'payments:receive',
    'online-status:toggle'
  ],
  VERIFIED_DJ: [
    'serato:connect',
    'serato:verify'
  ],
  CLIENT: [
    'missions:create',
    'missions:update',
    'missions:delete',
    'p2p-missions:create',
    'p2p-missions:read',
    'p2p-missions:update',
    'p2p-missions:delete',
    'payments:send'
  ],
  CURATOR: [
    'teams:create',
    'teams:read',
    'teams:update',
    'teams:delete'
  ],
  OPERATIONS: [
    'user:verify',
    'user:delete',
    'missions:update',
    'missions:delete',
    'p2p-missions:update',
    'p2p-missions:delete',
    'teams:update',
    'teams:delete',
    'stats:read',
    'logs:read',
    'payments:read',
    'payments:process',
    'chat:moderate'
  ],
  PARTNER: [
    'missions:update',
    'p2p-missions:update',
    'teams:update',
    'stats:read',
    'payments:read'
  ],
  ADMIN: [
    '*:*' // All permissions
  ]
} as const;

// Role inheritance hierarchy
const ROLE_INHERITANCE = {
  GUEST: [],
  RUNNER: ['GUEST'],
  DJ: ['GUEST'],
  VERIFIED_DJ: ['DJ'],
  CLIENT: ['DJ'],
  CURATOR: ['CLIENT'],
  OPERATIONS: ['CLIENT'],
  PARTNER: ['CLIENT'],
  ADMIN: ['ALL']
} as const;

// Generate complete permissions with inheritance
const generateRolePermissions = () => {
  const completePermissions: Record<string, string[]> = {};
  
  Object.keys(ROLE_HIERARCHY).forEach(role => {
    let permissions = [...(BASE_PERMISSIONS[role as keyof typeof BASE_PERMISSIONS] || [])];
    
    // Add inherited permissions
    const inheritedRoles = ROLE_INHERITANCE[role as keyof typeof ROLE_INHERITANCE] || [];
    inheritedRoles.forEach(inheritedRole => {
      if (inheritedRole === 'ALL') {
        // Admin gets all permissions from all roles
        Object.values(BASE_PERMISSIONS).forEach(rolePerms => {
          permissions.push(...rolePerms);
        });
      } else if (BASE_PERMISSIONS[inheritedRole as keyof typeof BASE_PERMISSIONS]) {
        permissions.push(...BASE_PERMISSIONS[inheritedRole as keyof typeof BASE_PERMISSIONS]);
      }
    });
    
    // Remove duplicates
    completePermissions[role] = [...new Set(permissions)];
  });
  
  return completePermissions;
};

const ROLE_PERMISSIONS = generateRolePermissions();

// Types
type Role = keyof typeof ROLE_HIERARCHY;
type Permission = string;
type Theme = typeof ROLE_THEMES[Role];

interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
  avatar?: string;
}

interface RBACState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
  currentTheme: Theme;
  roleLevel: number;
}

interface RBACContextType extends RBACState {
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  hasRoleOrHigher: (role: Role) => boolean;
  getUserPermissions: () => Permission[];
  getCurrentTheme: () => Theme;
  getRoleLevel: () => number;
  updateUser: (user: User | null) => void;
  logout: () => void;
}

// Initial state
const initialState: RBACState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: [],
  currentTheme: ROLE_THEMES.GUEST,
  roleLevel: ROLE_HIERARCHY.GUEST
};

// Action types
type RBACAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' };

// Reducer
const rbacReducer = (state: RBACState, action: RBACAction): RBACState => {
  switch (action.type) {
    case 'SET_USER':
      const user = action.payload;
      if (!user) {
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          permissions: ROLE_PERMISSIONS.GUEST,
          currentTheme: ROLE_THEMES.GUEST,
          roleLevel: ROLE_HIERARCHY.GUEST,
          isLoading: false
        };
      }
      
      const userRole = user.role.toUpperCase() as Role;
      const permissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.GUEST;
      const theme = ROLE_THEMES[userRole] || ROLE_THEMES.GUEST;
      const roleLevel = ROLE_HIERARCHY[userRole] || ROLE_HIERARCHY.GUEST;
      
      return {
        ...state,
        user,
        isAuthenticated: true,
        permissions,
        currentTheme: theme,
        roleLevel,
        isLoading: false
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
      
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        permissions: ROLE_PERMISSIONS.GUEST,
        currentTheme: ROLE_THEMES.GUEST,
        roleLevel: ROLE_HIERARCHY.GUEST,
        isLoading: false
      };
      
    default:
      return state;
  }
};

// Create context
const RBACContext = createContext<RBACContextType | undefined>(undefined);

// Provider component
interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(rbacReducer, initialState);
  const { user: authUser, isAuthenticated: authIsAuthenticated, loading: authLoading } = useAuth();

  // Sync with AuthContext
  useEffect(() => {
    console.log('🔄 RBAC syncing with Privy auth:', { authUser, authIsAuthenticated, authLoading });
    
    if (authLoading) {
      dispatch({ type: 'SET_LOADING', payload: true });
      return;
    }

    if (authUser && authIsAuthenticated) {
      // Convert AuthContext user to RBAC user format
      const rbacUser: User = {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role.toUpperCase() as Role,
        name: authUser.name || authUser.email
      };
      console.log('✅ RBAC user set:', rbacUser);
      dispatch({ type: 'SET_USER', payload: rbacUser });
    } else {
      console.log('❌ RBAC user cleared');
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [authUser, authIsAuthenticated, authLoading]);

  // Permission checking functions
  const hasPermission = (resource: string, action: string): boolean => {
    const requiredPermission = `${resource}:${action}`;
    return state.permissions.includes('*:*') || state.permissions.includes(requiredPermission);
  };

  const hasRole = (role: Role): boolean => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => state.user?.role === role);
  };

  const hasRoleOrHigher = (role: Role): boolean => {
    const requiredLevel = ROLE_HIERARCHY[role];
    return state.roleLevel >= requiredLevel;
  };

  const getUserPermissions = (): Permission[] => {
    return [...state.permissions];
  };

  const getCurrentTheme = (): Theme => {
    return state.currentTheme;
  };

  const getRoleLevel = (): number => {
    return state.roleLevel;
  };

  const updateUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    // Use AuthContext logout
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue: RBACContextType = {
    ...state,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasRoleOrHigher,
    getUserPermissions,
    getCurrentTheme,
    getRoleLevel,
    updateUser,
    logout
  };

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

// Hook to use RBAC context
export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
};

// Export constants for use in components
export {
  ROLE_HIERARCHY,
  ROLE_THEMES,
  ROLE_PERMISSIONS,
  BASE_PERMISSIONS,
  ROLE_INHERITANCE
};

export type { Role, Permission, Theme, User };
