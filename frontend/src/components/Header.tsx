import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, Trophy, Users, Settings, Menu, X, BarChart3 } from 'lucide-react';
import { useUIAgent } from '../contexts/UIAgentContext';
import { useRBAC } from '../contexts/RBACContext';
import { useAuth } from '../contexts/PrivyAuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { state } = useUIAgent();
  const { currentRole } = state;
  const { login, logout, isAuthenticated, user } = useAuth(); // Add logout and user
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Debug auth state
  useEffect(() => {
    console.log('🔍 Header Auth State:', { isAuthenticated, hasUser: !!user, userEmail: user?.email });
  }, [isAuthenticated, user]);

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { href: '/features', label: 'Features', icon: <Trophy className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <Users className="w-4 h-4" /> }
  ];

  // Add agent dashboard for authenticated users only
  if (currentRole && currentRole !== 'GUEST') {
    navItems.push(
      { href: '/agent-dashboard', label: 'Agent Dashboard', icon: <Activity className="w-4 h-4" /> }
    );
  }

  // Add admin navigation for ADMIN role
  if (currentRole === 'ADMIN') {
    navItems.push(
      { href: '/admin', label: 'Admin', icon: <Settings className="w-4 h-4" /> },
      { href: '/chatgpt-analytics', label: 'ChatGPT Analytics', icon: <BarChart3 className="w-4 h-4" /> }
    );
  }

  // Add ChatGPT Analytics for OPERATIONS role too
  if (currentRole === 'OPERATIONS') {
    navItems.push({ href: '/chatgpt-analytics', label: 'ChatGPT Analytics', icon: <BarChart3 className="w-4 h-4" /> });
  }

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'GUEST':
        return '👤';
      case 'RUNNER':
        return '🏃';
      case 'CLIENT':
        return '👑';
      case 'OPERATIONS':
        return '⚙️';
      case 'PARTNER':
        return '🤝';
      case 'ADMIN':
        return '🔧';
      default:
        return '👤';
    }
  };

  const getRoleColor = () => {
    switch (currentRole) {
      case 'GUEST':
        return 'bg-gray-600';
      case 'RUNNER':
        return 'bg-blue-600';
      case 'CLIENT':
        return 'bg-purple-600';
      case 'OPERATIONS':
        return 'bg-green-600';
      case 'PARTNER':
        return 'bg-yellow-600';
      case 'ADMIN':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRoleDisplayName = () => {
    switch (currentRole) {
      case 'GUEST':
        return 'Guest';
      case 'RUNNER':
        return 'Runner';
      case 'CLIENT':
        return 'Client';
      case 'OPERATIONS':
        return 'Operations';
      case 'PARTNER':
        return 'Partner';
      case 'ADMIN':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Club Run</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'text-blue-400 bg-blue-400 bg-opacity-10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Role Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-600">
              <span className="text-sm">{getRoleIcon()}</span>
              <span className="text-sm text-gray-300">{getRoleDisplayName()}</span>
              <div className={`w-2 h-2 rounded-full ${getRoleColor()}`}></div>
            </div>
            
            {isAuthenticated && user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <span className="text-sm text-gray-300">
                    {user.email?.includes('privy.generated') 
                      ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
                      : (user.email?.split('@')[0] || user.name)
                    }
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">
                        {user.email?.includes('privy.generated') ? 'Wallet User' : user.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        console.log('🚪 Logging out...');
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => {
                    console.log('🔵 Sign In button clicked in Header');
                    console.log('📊 isAuthenticated:', isAuthenticated);
                    console.log('🔑 login function:', typeof login);
                    login();
                  }}
                  className="text-gray-300 hover:text-white text-sm font-medium hover:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    console.log('🟣 Sign Up button clicked in Header');
                    login();
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'text-blue-400 bg-blue-400 bg-opacity-10'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Role Indicator */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <span className="text-sm">{getRoleIcon()}</span>
                <span className="text-sm text-gray-300">{getRoleDisplayName()}</span>
                <div className={`w-2 h-2 rounded-full ${getRoleColor()}`}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;