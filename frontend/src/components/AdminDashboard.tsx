import React, { useState, useEffect } from 'react';
import { useUIAgent } from '../contexts/UIAgentContext';
import { UserRole } from '../contexts/UIAgentContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalCheckIns: number;
  totalExpenses: number;
  roleDistribution: Record<UserRole, number>;
}

interface SystemLog {
  id: string;
  level: string;
  message: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  metadata?: any;
}

const AdminDashboard: React.FC = () => {
  const { state, showNotification } = useUIAgent();
  const { currentRole } = state;
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Only show admin dashboard for ADMIN role
  if (currentRole !== 'ADMIN') {
    return null;
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('clubRunToken');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showNotification('Failed to fetch users', 'error');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('clubRunToken');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      showNotification('Failed to fetch system statistics', 'error');
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('clubRunToken');
      const response = await fetch('/api/admin/logs?limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      showNotification('Failed to fetch system logs', 'error');
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const token = localStorage.getItem('clubRunToken');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        showNotification('User role updated successfully', 'success');
        fetchUsers(); // Refresh user list
        setShowRoleModal(false);
        setSelectedUser(null);
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to update user role', 'error');
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      showNotification('Failed to update user role', 'error');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchStats(), fetchLogs()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const roleColors = {
    GUEST: 'bg-gray-100 text-gray-800',
    RUNNER: 'bg-blue-100 text-blue-800',
    CLIENT: 'bg-purple-100 text-purple-800',
    OPERATIONS: 'bg-green-100 text-green-800',
    PARTNER: 'bg-yellow-100 text-yellow-800',
    ADMIN: 'bg-red-100 text-red-800'
  };

  const roleDisplayNames = {
    GUEST: '👤 Guest',
    RUNNER: '🏃 Runner',
    CLIENT: '👑 Client',
    OPERATIONS: '⚙️ Operations',
    PARTNER: '🤝 Partner',
    ADMIN: '🔧 Admin'
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard bg-gray-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔧 Admin Dashboard</h1>
        <p className="text-gray-400">System administration and user management</p>
      </div>

      {/* System Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-400">{stats.activeUsers}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Check-ins</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.totalCheckIns}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.totalExpenses}</p>
          </div>
        </div>
      )}

      {/* Role Distribution */}
      {stats && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Role Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.roleDistribution).map(([role, count]) => (
              <div key={role} className="text-center">
                <div className="text-2xl font-bold text-blue-400">{count}</div>
                <div className="text-sm text-gray-400">{roleDisplayNames[role as UserRole]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Management */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Last Login</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${roleColors[user.role]}`}>
                      {roleDisplayNames[user.role]}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2 text-sm text-gray-400">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRoleModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Recent System Logs</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-4 p-2 bg-gray-700 rounded">
              <span className={`px-2 py-1 rounded text-xs ${
                log.level === 'error' ? 'bg-red-100 text-red-800' :
                log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {log.level.toUpperCase()}
              </span>
              <span className="flex-1">{log.message}</span>
              <span className="text-sm text-gray-400">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Change User Role</h3>
            <p className="text-gray-400 mb-4">
              Change role for <strong>{selectedUser.name}</strong> ({selectedUser.email})
            </p>
            
            <div className="space-y-2 mb-6">
              {Object.entries(roleDisplayNames).map(([role, displayName]) => (
                <button
                  key={role}
                  onClick={() => updateUserRole(selectedUser.id, role as UserRole)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedUser.role === role
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {displayName}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 