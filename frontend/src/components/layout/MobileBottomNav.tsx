'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { 
  HomeIcon, 
  MapPinIcon, 
  TrophyIcon, 
  UserIcon,
  CheckIcon,
  QrCodeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { TabName } from '@/types';

const navigationItems = [
  { name: 'dashboard' as TabName, label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
  { name: 'venues' as TabName, label: 'Venues', icon: MapPinIcon, href: '/venues' },
  { name: 'missions' as TabName, label: 'Missions', icon: TrophyIcon, href: '/missions' },
  { name: 'profile' as TabName, label: 'Profile', icon: UserIcon, href: '/profile' },
];

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const { 
    activeTab, 
    setActiveTab, 
    toggleCopilot,
    mobileMenuOpen,
    toggleMobileMenu 
  } = useAppStore();

  const handleNavigation = (tab: TabName, href: string) => {
    setActiveTab(tab);
    router.push(href);
  };

  const handleQuickActions = () => {
    // Toggle quick actions overlay
    console.log('Quick actions opened');
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <ul className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            
            return (
              <li key={item.name} className="flex-1">
                <button
                  onClick={() => handleNavigation(item.name, item.href)}
                  className={`
                    w-full flex flex-col items-center py-2 px-1 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
          
          {/* Quick Check-in Button (Center) */}
          <li className="flex-1">
            <button
              onClick={handleQuickActions}
              className="w-full flex flex-col items-center py-2 px-1 rounded-lg text-green-600 hover:text-green-700 transition-colors"
            >
              <div className="relative">
                <CheckIcon className="h-6 w-6 mb-1" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-xs font-medium">Check In</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Quick Actions Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <QrCodeIcon className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Scan QR</span>
              </button>
              
              <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <MagnifyingGlassIcon className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Find Venue</span>
              </button>
              
              <button 
                onClick={toggleCopilot}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">AI Copilot</span>
              </button>
              
              <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Emergency</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 