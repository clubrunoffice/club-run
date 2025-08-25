import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Types
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, role?: string, seratoVerified?: boolean) => Promise<{ success: boolean; error?: string; needsApproval?: boolean; role?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  error: string | null;
  apiRequest: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL - use the same configuration as environment.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Mock data for when API is not available
const MOCK_USER = {
  id: 'mock-user-1',
  email: 'demo@clubrun.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'admin',
  verified: true
};

const MOCK_TOKEN = 'mock-jwt-token-12345';

// Check if we're in production and API is not available
const isProduction = import.meta.env.PROD;
const useMockData = isProduction && !import.meta.env.VITE_API_BASE_URL;

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimeout, setRefreshTimeout] = useState<number | null>(null);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!accessToken;

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // Use mock data in production if no API is configured
      if (useMockData) {
        // Mock successful token refresh
        return true;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setUser(data.user);
        return true;
      } else {
        // Refresh failed, clear auth state
        setUser(null);
        setAccessToken(null);
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      setAccessToken(null);
      return false;
    }
  }, [useMockData]);

  // API request helper with automatic token refresh
  const apiRequest = useCallback(async (
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    // Use mock data in production if no API is configured
    if (useMockData) {
      // Return a mock response
      return new Response(JSON.stringify({ success: true, data: 'mock' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for refresh tokens
    };

    // Add access token if available
    if (accessToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
    }

    const response = await fetch(url, config);

    // If token is expired, try to refresh
    if (response.status === 401 && accessToken) {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        // Retry the original request with new token
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${accessToken}`,
        };
        return fetch(url, config);
      }
    }

    return response;
  }, [accessToken, refreshToken, useMockData]);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }

    // Refresh token 5 minutes before expiration (assuming 15-minute tokens)
    const refreshTime = 10 * 60 * 1000; // 10 minutes
    const timeout = window.setTimeout(() => {
      refreshToken();
    }, refreshTime);

    setRefreshTimeout(timeout);
  }, [refreshToken, refreshTimeout]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Use mock data in production if no API is configured
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful login for demo purposes
        if (email === 'demo@clubrun.com' && password === 'demo123') {
          setUser(MOCK_USER);
          setAccessToken(MOCK_TOKEN);
          // Store in localStorage for persistence
          localStorage.setItem('authToken', MOCK_TOKEN);
          localStorage.setItem('authUser', JSON.stringify(MOCK_USER));
          scheduleTokenRefresh();
          return { success: true };
        } else {
          setError('Invalid credentials. Use demo@clubrun.com / demo123');
          return { success: false, error: 'Invalid credentials' };
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update authentication state
        setUser(data.user);
        setAccessToken(data.accessToken);
        // Store in localStorage for persistence
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        scheduleTokenRefresh();
        return { success: true };
      } else {
        setError(data.error || 'Login failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [scheduleTokenRefresh, useMockData]);

  // Signup function
  const signup = useCallback(async (email: string, password: string, firstName: string, lastName: string, role?: string, seratoVerified?: boolean) => {
    try {
      setError(null);
      setIsLoading(true);

      // Use mock data in production if no API is configured
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful signup
        return { success: true };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName, role, seratoVerified }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if this is a CURATOR application that needs approval
        if (data.needsApproval && data.role === 'CURATOR') {
          return { success: true, needsApproval: true, role: 'CURATOR' };
        }
        return { success: true };
      } else {
        setError(data.error || 'Registration failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [useMockData]);

  // Forgot password function
  const forgotPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Use mock data in production if no API is configured
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful password reset email
        return { success: true };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        setError(data.error || 'Failed to send reset email');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [useMockData]);

  // Reset password function
  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Use mock data in production if no API is configured
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful password reset
        return { success: true };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        setError(data.error || 'Password reset failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [useMockData]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear authentication state function
  const clearAuthState = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setError(null);
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
      setRefreshTimeout(null);
    }
  }, [refreshTimeout]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Use mock data in production if no API is configured
      if (!useMockData) {
        // Call logout endpoint
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      clearAuthState();
    }
  }, [clearAuthState, useMockData]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have stored auth data
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setUser(user);
            setAccessToken(storedToken);
            scheduleTokenRefresh();
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
            // Clear invalid stored data
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [scheduleTokenRefresh]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [refreshTimeout]);

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signup,
    forgotPassword,
    resetPassword,
    refreshToken,
    clearError,
    error,
    apiRequest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 