import React, { useState } from 'react';
import { useRBAC } from '../../contexts/RBACContext';
import { useAuth } from '../../contexts/PrivyAuthContext';

export const RoleBasedNavigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useRBAC();
  const auth = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm z-50">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <a href="/" className="flex items-center flex-shrink-0">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
              Club Run
            </span>
          </a>

          {/* User Menu - Right */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            {/* Home Button - Always visible */}
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-md hover:bg-white/90 transition-colors shadow-md"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Home</span>
            </a>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-white/80 backdrop-blur-md hover:bg-white/90 transition-colors shadow-md"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.email?.includes('privy.generated') ? user.role : (user.email?.split('@')[0] || user.name)}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 py-1">
                    <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/80">Dashboard</a>
                    <a href="/missions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/80">Missions</a>
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/80">Profile</a>
                    {(user.role === 'RUNNER' || user.role?.includes('RUNNER')) && (
                      <a href="/expenses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/80">Expenses</a>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        auth?.logout();
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100/80"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => auth?.login()}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-shadow whitespace-nowrap shadow-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
