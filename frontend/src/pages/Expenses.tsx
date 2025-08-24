import React, { useState, useEffect } from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { PermissionGate } from '../components/RoleBasedUI';

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  missionId?: string;
  receipt?: string;
}

export const Expenses: React.FC = () => {
  const { user, isAuthenticated, hasPermission, getCurrentTheme } = useRBAC();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = getCurrentTheme();

  // Mock data for demonstration
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        title: 'Equipment Rental',
        description: 'Rented professional speakers for corporate event',
        amount: 150,
        category: 'Equipment',
        status: 'approved',
        submittedAt: '2024-01-15',
        missionId: 'mission-1'
      },
      {
        id: '2',
        title: 'Transportation',
        description: 'Uber rides to and from venue',
        amount: 45,
        category: 'Transportation',
        status: 'pending',
        submittedAt: '2024-01-16',
        missionId: 'mission-2'
      },
      {
        id: '3',
        title: 'Music Licensing',
        description: 'Licensed music for wedding reception',
        amount: 75,
        category: 'Licensing',
        status: 'approved',
        submittedAt: '2024-01-14',
        missionId: 'mission-3'
      }
    ];

    setTimeout(() => {
      setExpenses(mockExpenses);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'equipment':
        return '🎵';
      case 'transportation':
        return '🚗';
      case 'licensing':
        return '📜';
      case 'food':
        return '🍕';
      default:
        return '💰';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view expenses.</p>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(expense => expense.status === 'pending');
  const approvedExpenses = expenses.filter(expense => expense.status === 'approved');

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Expenses</h1>
              <p className="text-xl text-gray-300">
                Track and manage your mission expenses
              </p>
            </div>
            <PermissionGate resource="expenses" action="create">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                <span>Submit Expense</span>
              </button>
            </PermissionGate>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-500 bg-opacity-20">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">Total Expenses</p>
                    <p className="text-2xl font-semibold text-white">${totalExpenses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-yellow-500 bg-opacity-20">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">Pending</p>
                    <p className="text-2xl font-semibold text-white">{pendingExpenses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-500 bg-opacity-20">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">Approved</p>
                    <p className="text-2xl font-semibold text-white">{approvedExpenses.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Content */}
      <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                <p className="mt-4 text-gray-300">Loading expenses...</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">Recent Expenses</h3>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="px-6 py-4 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-white">{expense.title}</h4>
                            <p className="text-sm text-gray-300">{expense.description}</p>
                            <div className="flex items-center mt-1">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-600 bg-opacity-20 text-gray-300 rounded-full">
                                {expense.category}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                {new Date(expense.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-blue-400">${expense.amount}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            expense.status === 'approved' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                            expense.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                            'bg-red-500 bg-opacity-20 text-red-400'
                          }`}>
                            {expense.status}
                          </span>
                          <PermissionGate resource="expenses" action="read">
                            <button className="text-sm text-blue-400 hover:text-blue-300">
                              View
                            </button>
                          </PermissionGate>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
    </div>
  );
};
