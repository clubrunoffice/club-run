import React, { useState } from 'react';
import { useRBAC } from '../../contexts/RBACContext';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface ExpenseLog {
  id: string;
  category: 'Parking' | 'Gas' | 'Food' | 'Venue Cover';
  amount: number;
  description: string;
  missionId: string;
  missionTitle: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  agentId: string;
  agentName: string;
  agentRole: string;
  isWithinPerDiem: boolean;
  perDiemRemaining: number;
}

interface ExpenseLoggerProps {
  onExpenseLogged?: (expense: ExpenseLog) => void;
  missionId?: string;
  missionTitle?: string;
  perDiemBudget?: number;
}

const ExpenseLogger: React.FC<ExpenseLoggerProps> = ({ 
  onExpenseLogged, 
  missionId = 'mission-1', 
  missionTitle = 'Current Mission',
  perDiemBudget = 100 
}) => {
  const { user } = useRBAC();
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: 'Parking' as const,
    amount: '',
    description: ''
  });
  const [isLogging, setIsLogging] = useState(false);

  const expenseCategories = [
    { value: 'Parking', label: '🅿️ Parking', description: 'Parking fees at venue' },
    { value: 'Gas', label: '⛽ Gas Money', description: 'Fuel for travel to/from venue' },
    { value: 'Food', label: '🍕 Food', description: 'Meals during mission' },
    { value: 'Venue Cover', label: '🎫 Venue Cover', description: 'Entry fee for venue' }
  ];

  const handleLogExpense = async () => {
    if (!newExpense.amount || !newExpense.description) {
      alert('Please fill in all fields');
      return;
    }

    setIsLogging(true);

    // Simulate API call
    setTimeout(() => {
      const expense: ExpenseLog = {
        id: `expense-${Date.now()}`,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        missionId,
        missionTitle,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        agentId: user?.id || 'agent-1',
        agentName: user?.name || 'Current User',
        agentRole: user?.role || 'RUNNER',
        isWithinPerDiem: parseFloat(newExpense.amount) <= perDiemBudget,
        perDiemRemaining: perDiemBudget - parseFloat(newExpense.amount)
      };

      setExpenses(prev => [expense, ...prev]);
      setNewExpense({ category: 'Parking', amount: '', description: '' });
      setIsLogging(false);

      // Notify parent component
      if (onExpenseLogged) {
        onExpenseLogged(expense);
      }

      // Agent response simulation
      simulateAgentResponse(expense);
    }, 1000);
  };

  const simulateAgentResponse = (expense: ExpenseLog) => {
    const responses = {
      'Parking': '✅ Parking expense logged. Standard venue parking fee approved.',
      'Gas': '⛽ Gas expense logged. Travel costs within per diem limits.',
      'Food': '🍕 Food expense logged. Meal allowance approved for mission duration.',
      'Venue Cover': '🎫 Venue cover charge logged. Entry fee approved for performance.'
    };

    const response = responses[expense.category];
    console.log(`Agent Response: ${response}`);
    
    // In a real implementation, this would trigger agent notifications
    // and update the expense status based on agent review
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mission Expense Logger</h3>
      
      {/* Mission Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">Current Mission</h4>
        <div className="text-sm text-blue-800">
          <p><strong>Mission:</strong> {missionTitle}</p>
          <p><strong>Per Diem Budget:</strong> ${perDiemBudget}</p>
          <p><strong>Agent:</strong> {user?.name} ({user?.role})</p>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Essential Mission Expenses:</h4>
        <div className="grid grid-cols-2 gap-3">
          {expenseCategories.map((category) => (
            <div
              key={category.value}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                newExpense.category === category.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setNewExpense(prev => ({ ...prev, category: category.value as any }))}
            >
              <div className="text-lg mb-1">{category.label}</div>
              <div className="text-sm text-gray-600">{category.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={newExpense.amount}
            onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={newExpense.description}
            onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe the expense (e.g., Parking at Downtown Convention Center)"
          />
        </div>

        <button
          onClick={handleLogExpense}
          disabled={isLogging || !newExpense.amount || !newExpense.description}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLogging ? 'Logging Expense...' : 'Log Expense'}
        </button>
      </div>

      {/* Recent Expenses */}
      {expenses.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recent Expenses</h4>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {expenseCategories.find(c => c.value === expense.category)?.label.split(' ')[0]}
                    </span>
                    <span className="font-medium">{expense.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">${expense.amount}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(expense.status)}`}>
                      {getStatusIcon(expense.status)}
                      <span className="ml-1">{expense.status}</span>
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{expense.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Submitted: {new Date(expense.submittedAt).toLocaleString()}</span>
                  <span className={expense.isWithinPerDiem ? 'text-green-600' : 'text-red-600'}>
                    {expense.isWithinPerDiem ? 'Within Per Diem' : 'Exceeds Per Diem'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseLogger;
