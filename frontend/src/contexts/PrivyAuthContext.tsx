import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import axios from 'axios';
import { RoleSelectionModal } from '../components/auth/RoleSelectionModal';

interface User {
  id: string;
  privyId: string;
  email: string;
  name: string;
  role: string;
  walletAddress?: string;
  phone?: string;
  badges?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  accessToken: string | null;
  updateRole: (userId: string, newRole: string) => Promise<void>;
  requestRoleUpgrade: (requestedRole: string, reason: string) => Promise<void>;
  createEmbeddedWallet: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const PrivyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    ready, 
    authenticated, 
    login: privyLogin, 
    logout: privyLogout, 
    getAccessToken,
    user: privyUser 
  } = usePrivy();
  
  const { wallets, ready: walletsReady } = useWallets();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Fetch user data from backend
  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ User data fetched from backend:', response.data);
      setUser(response.data);
      
      // ENTERPRISE LOGIC: DB role is single source of truth
      // Show role selection ONLY if user role is GUEST
      if (response.data.role === 'GUEST') {
        console.log('👤 User is GUEST - showing role selection');
        setIsNewUser(true);
        setShowRoleSelection(true);
      } else {
        console.log(`✅ User has role: ${response.data.role} - skipping role selection`);
        setIsNewUser(false);
        setShowRoleSelection(false);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching user data:', error);
      
      // If user doesn't exist yet (404), wait for webhook sync
      if (error.response?.status === 404) {
        console.log('⏳ User not found in backend, waiting for webhook sync...');
        // Wait 3 seconds for webhook to create user
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Retry fetching user data
        try {
          const retryResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(retryResponse.data);
          if (retryResponse.data.role === 'GUEST') {
            setIsNewUser(true);
            setShowRoleSelection(true);
          }
          return retryResponse.data;
        } catch (retryError) {
          console.error('❌ Retry failed:', retryError);
          setUser(null);
          return null;
        }
      }
      
      setUser(null);
      return null;
    }
  };

  // Update access token and fetch user when authenticated
  useEffect(() => {
    const updateAuth = async () => {
      if (!ready) {
        console.log('⏳ Privy not ready yet...');
        return;
      }

      console.log('🔐 Privy auth state:', { authenticated, privyUser: privyUser?.id });

      if (authenticated && privyUser) {
        try {
          const token = await getAccessToken();
          if (!token) {
            console.error('❌ Failed to get access token');
            return;
          }
          console.log('✅ Got access token');
          setAccessToken(token);
          
          // Set default axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          await fetchUserData(token);
          
          // Update wallet address if available
          if (walletsReady && wallets.length > 0) {
            const primaryWallet = wallets[0];
            console.log('💼 Updating wallet address:', primaryWallet.address || '');
            await axios.post(
              `${API_URL}/auth/update-wallet`,
              { walletAddress: primaryWallet.address || '' },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }

          // Redirect to dashboard after successful login (only if not on homepage)
          if (window.location.pathname !== '/' && window.location.pathname !== '/features' && window.location.pathname !== '/contact') {
            // Only redirect if on auth-related pages
            if (window.location.pathname === '/auth') {
              console.log('➡️ Redirecting to dashboard...');
              window.location.href = '/dashboard';
            }
          }
        } catch (error) {
          console.error('❌ Error updating auth:', error);
        }
      } else {
        console.log('🚪 User not authenticated, clearing state');
        setAccessToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }

      setLoading(false);
    };

    updateAuth();
  }, [ready, authenticated, privyUser, walletsReady, wallets]);

  // Login handler
  const login = () => {
    console.log('🔐 Login button clicked!');
    console.log('📊 Privy state:', { ready, authenticated });
    console.log('🔑 privyLogin function:', typeof privyLogin);
    
    if (!ready) {
      console.warn('⚠️ Privy not ready yet');
      return;
    }
    
    try {
      console.log('✅ Calling privyLogin()...');
      privyLogin();
    } catch (error) {
      console.error('❌ Error triggering login:', error);
    }
  };

  // Logout handler - Clean state management
  const logout = async () => {
    console.log('🚪 Logging out...');
    await privyLogout();
    setUser(null);
    setAccessToken(null);
    setShowRoleSelection(false);
    setIsNewUser(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Handle role selection - Enterprise-grade with proper state management
  const handleRoleSelection = async (selectedRole: string) => {
    if (!accessToken) {
      console.error('❌ No access token available');
      return;
    }

    try {
      console.log('🎯 Selecting role:', selectedRole);
      
      // Update role in backend using self-service endpoint
      const response = await axios.post(
        `${API_URL}/auth/select-role`,
        { newRole: selectedRole },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log('✅ Role updated successfully:', response.data);
      
      // Update local state immediately
      setUser(response.data.user);
      setShowRoleSelection(false);
      setIsNewUser(false);
      
      // Redirect to dashboard
      console.log('➡️ Redirecting to dashboard...');
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('❌ Error selecting role:', error);
      
      // If user is not GUEST anymore (already selected), just close modal
      if (error.response?.status === 403) {
        console.log('ℹ️ Role already selected, closing modal');
        setShowRoleSelection(false);
        setIsNewUser(false);
        // Refresh user data to get current role
        await fetchUserData(accessToken);
        window.location.href = '/dashboard';
      } else {
        // For other errors, show user-friendly message
        alert('Failed to set role. Please try again or contact support.');
      }
    }
  };

  // Handle skipping role selection - Keep user as GUEST
  const handleSkipRoleSelection = () => {
    console.log('⏭️ User skipped role selection, staying as GUEST');
    setShowRoleSelection(false);
    setIsNewUser(false);
    window.location.href = '/dashboard';
  };

  // Update user role (admin/operations only)
  const updateRole = async (userId: string, newRole: string) => {
    if (!accessToken) throw new Error('Not authenticated');
    
    try {
      await axios.post(
        `${API_URL}/auth/update-role`,
        { userId, newRole },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      
      // Refresh user data if updating own role
      if (user && user.id === userId) {
        await fetchUserData(accessToken);
      }
    } catch (error) {
      console.error('❌ Error updating role:', error);
      throw error;
    }
  };

  // Request role upgrade
  const requestRoleUpgrade = async (requestedRole: string, reason: string) => {
    if (!accessToken) throw new Error('Not authenticated');
    
    try {
      await axios.post(
        `${API_URL}/auth/request-role-upgrade`,
        { requestedRole, reason },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (error) {
      console.error('❌ Error requesting role upgrade:', error);
      throw error;
    }
  };

  // Create embedded wallet
  const createEmbeddedWallet = async (): Promise<string | null> => {
    if (!authenticated) {
      console.error('User must be authenticated to create wallet');
      return null;
    }

    try {
      // Privy automatically creates an embedded wallet for the user
      // We just need to wait for it to be available
      if (wallets.length > 0) {
        const wallet = wallets[0];
        console.log('✅ Embedded wallet created:', wallet.address);
        
        // Update backend with wallet address
        if (accessToken) {
          await axios.post(
            `${API_URL}/auth/update-wallet`,
            { walletAddress: wallet.address },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        }
        
        return wallet.address;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error creating embedded wallet:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: authenticated && !!user,
    accessToken,
    updateRole,
    requestRoleUpgrade,
    createEmbeddedWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <RoleSelectionModal
        isOpen={showRoleSelection}
        onSelectRole={handleRoleSelection}
        onSkip={handleSkipRoleSelection}
      />
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a PrivyAuthProvider');
  }
  return context;
};
