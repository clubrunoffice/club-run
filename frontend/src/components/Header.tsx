import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, Trophy, Users, Settings } from 'lucide-react';
import { useUIAgent } from '../contexts/UIAgentContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { state } = useUIAgent();
  const { currentRole } = state;

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { href: '/agent-dashboard', label: 'Agent Dashboard', icon: <Activity className="w-4 h-4" /> },
    { href: '/features', label: 'Features', icon: <Trophy className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <Users className="w-4 h-4" /> }
  ];

  // Add admin navigation for ADMIN role
  if (currentRole === 'ADMIN') {
    navItems.push({ href: '/admin', label: 'Admin', icon: <Settings className="w-4 h-4" /> });
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
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-600">
              <span className="text-sm">{getRoleIcon()}</span>
              <span className="text-sm text-gray-300">{getRoleDisplayName()}</span>
              <div className={`w-2 h-2 rounded-full ${getRoleColor()}`}></div>
            </div>
            
            <button className="text-gray-300 hover:text-white text-sm">
              Sign In
            </button>
            <button className="text-gray-300 hover:text-white text-sm">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;