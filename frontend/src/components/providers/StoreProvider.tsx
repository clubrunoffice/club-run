'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const { theme, setUser } = useAppStore();

  useEffect(() => {
    // Initialize theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Mock user data for demo
    setUser({
      id: '1',
      username: 'Alex Johnson',
      email: 'alex@example.com',
      tokens: 2450,
      level: 8,
      experience: 7500,
      checkIns: 156,
      missionsCompleted: 23,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    });
  }, [theme, setUser]);

  return <>{children}</>;
}; 