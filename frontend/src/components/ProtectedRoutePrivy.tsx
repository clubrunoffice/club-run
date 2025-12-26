import React from 'react';
import { useAuth } from '../contexts/PrivyAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-400 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-6">
              Please sign in to access this page
            </p>
            <button
              onClick={login}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Sign In with Privy
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0 && user) {
    if (!requiredRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-400 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-400 mb-2">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500">
                Required role: {requiredRoles.join(' or ')}
              </p>
              <p className="text-sm text-gray-500">
                Your role: {user.role}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
