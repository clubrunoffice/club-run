'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { 
  HomeIcon, 
  MapPinIcon, 
  TrophyIcon, 
  UserIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { TabName } from '@/types';

const navigationItems = [
  { name: 'dashboard' as TabName, label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
  { name: 'venues' as TabName, label: 'Venues', icon: MapPinIcon, href: '/venues' },
  { name: 'missions' as TabName, label: 'Missions', icon: TrophyIcon, href: '/missions' },
  { name: 'profile' as TabName, label: 'Profile', icon: UserIcon, href: '/profile' },
  { name: 'community' as TabName, label: 'Community', icon: UsersIcon, href: '/community' },
];

export const DesktopSidebar: React.FC = () => {
  const router = useRouter();
  const { 
    user, 
    activeTab, 
    sidebarOpen, 
    theme, 
    toggleTheme, 
    unreadNotifications,
    setActiveTab 
  } = useAppStore();

  const handleNavigation = (tab: TabName, href: string) => {
    setActiveTab(tab);
    router.push(href);
  };

  return (
    <>
      {/* Desktop Sidebar (1200px+) */}
      <aside className={`
        hidden lg:flex fixed left-0 top-0 h-full w-80 z-50
        glass-sidebar backdrop-blur-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300
      `}>
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
              <span className="text-xl font-bold text-white">Club Run</span>
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-white" />
              ) : (
                <MoonIcon className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user.username}</p>
                  <p className="text-gray-400 text-sm">Level {user.level}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-sm">🪙 {user.tokens}</span>
                  <div className="relative">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.name, item.href)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                        transition-all duration-200 group
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-white/20' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Settings */}
          <div className="p-6 border-t border-white/10">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Tablet Collapsible Sidebar (768px-1199px) */}
      <aside className={`
        hidden md:flex lg:hidden fixed left-0 top-0 h-full w-64 z-50
        glass-sidebar backdrop-blur-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300
      `}>
        <div className="flex flex-col w-full">
          {/* Compact Logo */}
          <div className="flex items-center justify-center p-4 border-b border-white/10">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
          </div>

          {/* Compact Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.name, item.href)}
                      className={`
                        w-full flex items-center justify-center p-3 rounded-lg
                        transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }
                      `}
                      title={item.label}
                    >
                      <Icon className="h-5 w-5" />
                      {isActive && (
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Compact Settings */}
          <div className="p-4 border-t border-white/10">
            <Link
              href="/settings"
              className="flex items-center justify-center p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}; 