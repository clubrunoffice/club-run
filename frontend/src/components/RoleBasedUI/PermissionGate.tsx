import React, { ReactNode } from 'react';
import { useRBAC } from '../../contexts/RBACContext';

interface PermissionGateProps {
  resource?: string;
  action?: string;
  roles?: string[];
  fallback?: ReactNode;
  children: ReactNode;
  showFallback?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  resource,
  action,
  roles,
  fallback,
  children,
  showFallback = false
}) => {
  const { hasPermission, hasAnyRole, isAuthenticated } = useRBAC();

  // Check if user has access
  let hasAccess = false;

  if (resource && action) {
    hasAccess = hasPermission(resource, action);
  } else if (roles) {
    hasAccess = hasAnyRole(roles as any);
  } else {
    hasAccess = isAuthenticated;
  }

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If showFallback is true and fallback is provided, render fallback
  if (showFallback && fallback) {
    return <>{fallback}</>;
  }

  // Otherwise, render nothing
  return null;
};

// Higher-order component for role-based access control
export const withRoleCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles: string[],
  fallbackComponent?: React.ComponentType
) => {
  const WithRoleCheck: React.FC<P> = (props) => {
    const { hasAnyRole } = useRBAC();
    const hasAccess = hasAnyRole(requiredRoles as any);

    if (hasAccess) {
      return <WrappedComponent {...props} />;
    }

    if (fallbackComponent) {
      const FallbackComponent = fallbackComponent;
      return <FallbackComponent {...props} />;
    }

    return null;
  };

  WithRoleCheck.displayName = `withRoleCheck(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithRoleCheck;
};

// Role access alert component
export const RoleAccessAlert: React.FC<{
  requiredRoles?: string[];
  requiredPermission?: string;
  message?: string;
  className?: string;
}> = ({ 
  requiredRoles, 
  requiredPermission, 
  message = "You don't have permission to access this feature.",
  className = ""
}) => {
  const { user } = useRBAC();

  const getAlertMessage = () => {
    if (message) return message;
    
    if (requiredRoles) {
      return `This feature requires one of the following roles: ${requiredRoles.join(', ')}`;
    }
    
    if (requiredPermission) {
      return `This feature requires the permission: ${requiredPermission}`;
    }
    
    return "You don't have permission to access this feature.";
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Access Denied
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{getAlertMessage()}</p>
            {user && (
              <p className="mt-1">
                Your current role: <span className="font-medium">{user.role}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
