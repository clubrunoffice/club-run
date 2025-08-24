// Export all RBAC UI components
export { PermissionGate, withRoleCheck, RoleAccessAlert } from './PermissionGate';
export { RoleBasedNavigation } from './RoleBasedNavigation';
export { RoleBasedDashboard } from './RoleBasedDashboard';

// Export RBAC context and hooks
export { RBACProvider, useRBAC } from '../../contexts/RBACContext';
export type { Role, Permission, Theme, User } from '../../contexts/RBACContext';
