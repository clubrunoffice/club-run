import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, Zap, Shield, CheckCircle } from 'lucide-react';

interface PayoutData {
  id: string;
  amount: number;
  method: 'instant' | 'weekly';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  missionIds: string[];
  fees: number;
  netAmount: number;
}

interface PayoutMethod {
  id: string;
  type: 'bank' | 'card';
  name: string;
  last4: string;
  isDefault: boolean;
  isVerified: boolean;
}

interface DynamicPayoutSystemProps {
  userId: string;
  onPayoutRequested: (payout: PayoutData) => void;
}

const DynamicPayoutSystem: React.FC<DynamicPayoutSystemProps> = ({ onPayoutRequested }) => {
  const [availableBalance, setAvailableBalance] = useState(1250.00);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [payoutHistory, setPayoutHistory] = useState<PayoutData[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  // Mock data - replace with API calls
  useEffect(() => {
    setPayoutMethods([
      {
        id: 'bank-1',
        type: 'bank',
        name: 'Chase Bank',
        last4: '1234',
        isDefault: true,
        isVerified: true
      },
      {
        id: 'card-1',
        type: 'card',
        name: 'Visa Debit',
        last4: '5678',
        isDefault: false,
        isVerified: true
      }
    ]);

    setPayoutHistory([
      {
        id: 'payout-1',
        amount: 450.00,
        method: 'instant',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        missionIds: ['mission-1', 'mission-2'],
        fees: 2.50,
        netAmount: 447.50
      },
      {
        id: 'payout-2',
        amount: 800.00,
        method: 'weekly',
        status: 'completed',
        timestamp: new Date(Date.now() - 604800000).toISOString(),
        missionIds: ['mission-3', 'mission-4', 'mission-5'],
        fees: 0,
        netAmount: 800.00
      }
    ]);

    setSelectedMethod('bank-1');
  }, []);

  const instantPayoutFee = 2.50;
  const weeklyPayoutFee = 0;

  const calculateFees = (method: 'instant' | 'weekly') => {
    return method === 'instant' ? instantPayoutFee : weeklyPayoutFee;
  };

  const calculateNetAmount = (amount: number, method: 'instant' | 'weekly') => {
    return amount - calculateFees(method);
  };

  const handlePayoutRequest = async (method: 'instant' | 'weekly') => {
    if (payoutAmount <= 0 || payoutAmount > availableBalance) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPayout: PayoutData = {
        id: `payout-${Date.now()}`,
        amount: payoutAmount,
        method,
        status: method === 'instant' ? 'processing' : 'pending',
        timestamp: new Date().toISOString(),
        missionIds: [], // Would be populated from completed missions
        fees: calculateFees(method),
        netAmount: calculateNetAmount(payoutAmount, method)
      };

      setPayoutHistory(prev => [newPayout, ...prev]);
      setAvailableBalance(prev => prev - payoutAmount);
      setPayoutAmount(0);


      onPayoutRequested(newPayout);
    } catch (error) {
      console.error('Payout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <Shield className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payout Center</h2>
            <p className="text-gray-600 mt-1">Manage your earnings and withdrawals</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(availableBalance)}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Payout Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Instant Payout */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Instant Payout</h3>
                  <p className="text-sm text-gray-600">Get paid immediately</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Fee</p>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(instantPayoutFee)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Enter amount"
                value={payoutAmount || ''}
                onChange={(e) => setPayoutAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="10"
                max={availableBalance}
              />
              
              {payoutAmount > 0 && (
                <div className="bg-white rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Amount:</span>
                    <span>{formatCurrency(payoutAmount)}</span>
                  </div>
                                       <div className="flex justify-between mb-1">
                       <span>Fee:</span>
                       <span>-{formatCurrency(calculateFees('instant'))}</span>
                     </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>You'll receive:</span>
                    <span className="text-green-600">{formatCurrency(calculateNetAmount(payoutAmount, 'instant'))}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => handlePayoutRequest('instant')}
                disabled={payoutAmount <= 0 || payoutAmount > availableBalance || isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Instant Payout</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Weekly Payout */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                       <CreditCard className="w-6 h-6 text-green-600" />
                     </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Payout</h3>
                  <p className="text-sm text-gray-600">Free bank transfer</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Fee</p>
                <p className="text-lg font-semibold text-green-600">Free</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span>Available:</span>
                  <span>{formatCurrency(availableBalance)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Fee:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>You'll receive:</span>
                  <span className="text-green-600">{formatCurrency(availableBalance)}</span>
                </div>
              </div>

              <button
                onClick={() => handlePayoutRequest('weekly')}
                disabled={availableBalance <= 0 || isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                                         <CreditCard className="w-5 h-5" />
                    <span>Weekly Payout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Payout Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Methods</h3>
          <div className="space-y-3">
            {payoutMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      method.type === 'bank' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                                             {method.type === 'bank' ? (
                         <CreditCard className="w-4 h-4 text-green-600" />
                       ) : (
                         <CreditCard className="w-4 h-4 text-blue-600" />
                       )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-600">•••• {method.last4}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isVerified && (
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout History</h3>
          <div className="space-y-3">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                       payout.method === 'instant' ? 'bg-blue-100' : 'bg-green-100'
                     }`}>
                       {payout.method === 'instant' ? (
                         <Zap className="w-5 h-5 text-blue-600" />
                       ) : (
                         <CreditCard className="w-5 h-5 text-green-600" />
                       )}
                     </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {payout.method === 'instant' ? 'Instant Payout' : 'Weekly Payout'}
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(payout.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(payout.netAmount)}</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                      <span className="ml-1 capitalize">{payout.status}</span>
                    </div>
                  </div>
                </div>
                {payout.fees > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Fee: {formatCurrency(payout.fees)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPayoutSystem;
