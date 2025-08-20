'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Bars3Icon, 
  BellIcon, 
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

export const MobileHeader: React.FC = () => {
  const { 
    user, 
    theme, 
    toggleTheme, 
    unreadNotifications,
    toggleMobileMenu 
  } = useAppStore();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
          <span className="text-lg font-bold text-gray-900">Club Run</span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <BellIcon className="h-5 w-5 text-gray-600" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Avatar */}
          {user && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">Level {user.level}</p>
              </div>
            </div>
          )}

          {/* Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}; 