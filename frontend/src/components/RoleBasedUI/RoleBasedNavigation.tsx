import React, { useState } from 'react';
import { useRBAC, ROLE_THEMES } from '../../contexts/RBACContext';
import { PermissionGate } from './PermissionGate';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  roles?: string[];
  permission?: {
    resource: string;
    action: string;
  };
  children?: NavigationItem[];
}

const NavigationItem: React.FC<{
  item: NavigationItem;
  isActive?: boolean;
  onClick?: () => void;
  theme: any;
}> = ({ item, isActive, onClick, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="relative">
      <a
        href={item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
          onClick?.();
        }}
        className={`
          flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
          ${isActive 
            ? `text-white bg-${theme.primary} shadow-sm` 
            : `text-gray-700 hover:text-${theme.primary} hover:bg-${theme.background}`
          }
        `}
        style={{
          backgroundColor: isActive ? theme.primary : 'transparent',
          color: isActive ? 'white' : theme.text
        }}
      >
        {item.icon && <span className="mr-3">{item.icon}</span>}
        {item.label}
        {hasChildren && (
          <svg
            className={`ml-auto h-4 w-4 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </a>
      
      {hasChildren && isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children.map((child, index) => (
            <PermissionGate
              key={index}
              roles={child.roles}
              resource={child.permission?.resource}
              action={child.permission?.action}
            >
              <a
                href={child.href}
                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                {child.icon && <span className="mr-2">{child.icon}</span>}
                {child.label}
              </a>
            </PermissionGate>
          ))}
        </div>
      )}
    </div>
  );
};

export const RoleBasedNavigation: React.FC = () => {
  try {
    const { user, isAuthenticated, getCurrentTheme, logout } = useRBAC();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const theme = getCurrentTheme();

    // Debug logging
    console.log('RBAC Navigation Debug:', {
      user,
      isAuthenticated,
      theme,
      isLoading: false
    });

    // Error handling - fallback to default theme if there's an issue
    const safeTheme = theme || ROLE_THEMES.GUEST;

  const navigationItems: NavigationItem[] = [
    // Public navigation items (always visible)
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Features',
      href: '/features',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    // Dashboard - always visible (guests will be prompted to login)
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    // Authenticated user navigation items (only show when logged in)
    ...(isAuthenticated ? [
      {
        label: 'Missions',
        href: '/missions',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        permission: { resource: 'missions', action: 'read' }
      },
      {
        label: 'P2P Missions',
        href: '/p2p-missions',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        permission: { resource: 'p2p-missions', action: 'read' }
      },
      {
        label: 'Teams',
        href: '/teams',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        permission: { resource: 'teams', action: 'read' }
      },
      {
        label: 'Expenses',
        href: '/expenses',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        permission: { resource: 'expenses', action: 'read' }
      },

      {
        label: 'Admin',
        href: '/admin',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        roles: ['OPERATIONS', 'ADMIN'],
        children: [
          {
            label: 'User Management',
            href: '/admin/users',
            permission: { resource: 'user', action: 'read' }
          },
          {
            label: 'System Stats',
            href: '/admin/stats',
            permission: { resource: 'stats', action: 'read' }
          },
          {
            label: 'System Logs',
            href: '/admin/logs',
            permission: { resource: 'logs', action: 'read' }
          }
        ]
      }
    ] : [])
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Club Run"
              />
              <span className="ml-2 text-xl font-bold" style={{ color: safeTheme.primary }}>
                Club Run
              </span>
              <span className="ml-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                v3.5
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => {
              // Public navigation items (Home, Features, Contact, Dashboard) should always be visible
              const isPublicItem = ['Home', 'Features', 'Contact', 'Dashboard'].includes(item.label);
              
              if (isPublicItem) {
                return (
                  <NavigationItem
                    key={index}
                    item={item}
                    theme={theme}
                  />
                );
              }
              
              // For authenticated items, use PermissionGate
              return (
                <PermissionGate
                  key={index}
                  roles={item.roles}
                  resource={item.permission?.resource}
                  action={item.permission?.action}
                >
                  <NavigationItem
                    item={item}
                    theme={theme}
                  />
                </PermissionGate>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Role Badge */}
                <div 
                  className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm border border-white border-opacity-20"
                  style={{ backgroundColor: safeTheme.primary }}
                >
                  <span className="flex items-center">
                    <span className="mr-1">👤</span>
                    {user.role}
                  </span>
                </div>
                
                {/* User Avatar */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name || user.email} className="h-8 w-8 rounded-full" />
                      ) : (
                        <span className="text-sm font-medium text-gray-700">
                          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span>{user.name || user.email}</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigationItems.map((item, index) => {
              // Public navigation items (Home, Features, Contact, Dashboard) should always be visible
              const isPublicItem = ['Home', 'Features', 'Contact', 'Dashboard'].includes(item.label);
              
              if (isPublicItem) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </a>
                );
              }
              
              // For authenticated items, use PermissionGate
              return (
                <PermissionGate
                  key={index}
                  roles={item.roles}
                  resource={item.permission?.resource}
                  action={item.permission?.action}
                >
                  <a
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </a>
                </PermissionGate>
              );
            })}
            
            {isAuthenticated && user && (
              <>
                {/* Mobile Role Badge */}
                <div className="px-3 py-2 border-b border-gray-200">
                  <div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: safeTheme.primary }}
                  >
                    <span className="mr-2">👤</span>
                    {user.role}
                  </div>
                </div>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
  } catch (error) {
    console.error('Navigation Error:', error);
    // Fallback navigation
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Club Run</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="/features" className="text-gray-700 hover:text-gray-900">Features</a>
              <a href="/contact" className="text-gray-700 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
};
