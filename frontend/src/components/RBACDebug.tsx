import React from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { useAuth } from '../contexts/AuthContext';

export const RBACDebug: React.FC = () => {
  const rbac = useRBAC();
  const auth = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🔍 RBAC Debug Info</h3>
      
      <div className="text-xs space-y-1">
        <div><strong>Auth Context:</strong></div>
        <div>• isAuthenticated: {auth.isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div>• User: {auth.user ? auth.user.email : 'None'}</div>
        <div>• Role: {auth.user ? auth.user.role : 'None'}</div>
        
        <div className="mt-2"><strong>RBAC Context:</strong></div>
        <div>• isAuthenticated: {rbac.isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div>• User: {rbac.user ? rbac.user.email : 'None'}</div>
        <div>• Role: {rbac.user ? rbac.user.role : 'None'}</div>
        <div>• Theme: {rbac.currentTheme ? rbac.currentTheme.primary : 'None'}</div>
        <div>• Permissions: {rbac.permissions.length} total</div>
        
        <div className="mt-2"><strong>Sample Permissions:</strong></div>
        <div className="text-xs max-h-20 overflow-y-auto">
          {rbac.permissions.slice(0, 5).map((perm, i) => (
            <div key={i}>• {perm}</div>
          ))}
          {rbac.permissions.length > 5 && <div>... and {rbac.permissions.length - 5} more</div>}
        </div>
      </div>
      
      <button 
        onClick={() => console.log('Full RBAC State:', rbac)}
        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Log to Console
      </button>
    </div>
  );
};
