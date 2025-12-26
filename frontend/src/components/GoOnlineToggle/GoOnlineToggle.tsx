import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../contexts/RBACContext';
import { usePrivy } from '@privy-io/react-auth';

interface GoOnlineToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  variant?: 'pill' | 'standard';
}

export const GoOnlineToggle: React.FC<GoOnlineToggleProps> = ({ 
  size = 'md',
  showLabel = true,
  className = '',
  variant = 'pill'
}) => {
  const { user } = useRBAC();
  const { getAccessToken } = usePrivy();
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

  // Only show for RUNNER, DJ, VERIFIED_DJ
  const canGoOnline = user?.role && ['RUNNER', 'DJ', 'VERIFIED_DJ'].includes(user.role);

  console.log('GoOnlineToggle Debug:', {
    userRole: user?.role,
    canGoOnline,
    isOnline,
    isLoading
  });

  // Load online status from backend on mount
  useEffect(() => {
    if (canGoOnline && user?.id) {
      fetchOnlineStatus();
    }
  }, [user?.id, canGoOnline]);

  const fetchOnlineStatus = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/auth/online-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsOnline(data.isOnline || false);
      }
    } catch (error) {
      console.error('Error fetching online status:', error);
    }
  };

  const handleToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newStatus = !isOnline;
    
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/auth/online-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isOnline: newStatus }),
      });

      if (response.ok) {
        setIsOnline(newStatus);
        console.log(`${user?.role} is now ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
      } else {
        console.error('Failed to update online status');
      }
    } catch (error) {
      console.error('Error updating online status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canGoOnline) return null;

  const sizes = {
    sm: { toggle: 'w-9 h-5', ball: 'w-4 h-4', translate: 'translate-x-4', text: 'text-xs' },
    md: { toggle: 'w-11 h-6', ball: 'w-5 h-5', translate: 'translate-x-5', text: 'text-sm' },
    lg: { toggle: 'w-14 h-7', ball: 'w-6 h-6', translate: 'translate-x-7', text: 'text-base' }
  };

  const containerClass = variant === 'pill' 
    ? `bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg ${isOnline ? 'ring-2 ring-green-400' : ''}`
    : '';

  return (
    <label className={`flex items-center cursor-pointer ${containerClass} ${className} transition-all duration-300`}>
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={isOnline}
          onChange={handleToggle}
          disabled={isLoading}
        />
        <div className={`${sizes[size].toggle} rounded-full shadow-inner transition-all duration-300 ease-in-out ${
          isOnline ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-green-200' : 'bg-gray-400'
        } ${isLoading ? 'opacity-50' : ''}`}></div>
        <div className={`absolute left-0.5 top-0.5 bg-white ${sizes[size].ball} rounded-full transition-all duration-300 ease-in-out ${
          isOnline ? `${sizes[size].translate} shadow-lg scale-110` : 'translate-x-0 scale-100'
        }`}></div>
      </div>
      {showLabel && (
        <span className={`ml-3 ${sizes[size].text} font-bold whitespace-nowrap transition-all duration-300 ${
          isOnline ? 'text-green-700 scale-105' : 'text-gray-600'
        }`}>
          {isOnline ? '🟢 ONLINE' : 'Go Online'}
        </span>
      )}
    </label>
  );
};
