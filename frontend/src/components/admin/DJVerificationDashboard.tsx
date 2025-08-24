import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Clock, User, Mail, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface DJVerificationRequest {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  totalCheckIns: number;
  missionsCompleted: number;
  currentStreak: number;
  tokenBalance: number;
}

interface VerificationStats {
  totalRunners: number;
  verifiedDJs: number;
  pendingVerifications: number;
  recentVerifications: number;
  verificationRate: string;
}

export function RunnerVerificationDashboard() {
  const { user } = useAuth();
  const [verificationRequests, setVerificationRequests] = useState<DJVerificationRequest[]>([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<DJVerificationRequest | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user && ['OPERATIONS', 'ADMIN'].includes(user.role)) {
      loadVerificationRequests();
      loadStats();
    }
  }, [user]);

  const loadVerificationRequests = async () => {
    try {
      const response = await fetch('/api/admin/dj-verification-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationRequests(data.users);
      }
    } catch (error) {
      console.error('Failed to load verification requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/dj-verification-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const verifyDJ = async (userId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/verify-dj/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          verificationNotes: verificationNotes
        })
      });

      if (response.ok) {
        alert('DJ verified successfully!');
        setSelectedUser(null);
        setVerificationNotes('');
        loadVerificationRequests();
        loadStats();
      } else {
        const error = await response.json();
        alert(`Failed to verify DJ: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to verify DJ:', error);
      alert('Failed to verify DJ');
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectDJ = async (userId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/reject-dj/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason
        })
      });

      if (response.ok) {
        alert('DJ verification rejected');
        setSelectedUser(null);
        setRejectionReason('');
        loadVerificationRequests();
        loadStats();
      } else {
        const error = await response.json();
        alert(`Failed to reject DJ: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to reject DJ:', error);
      alert('Failed to reject DJ');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !['OPERATIONS', 'ADMIN'].includes(user.role)) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-red-800">
            Access Denied
          </h3>
        </div>
        <p className="mt-2 text-sm text-red-700">
          You don't have permission to access the DJ verification dashboard.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Runners</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRunners}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Verified DJs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedDJs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Recent (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentVerifications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Verification Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verificationRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            DJ Verification Requests ({verificationRequests.length})
          </h2>
          <p className="text-sm text-gray-500">
            Review and verify DJ accounts to grant access to Serato integration
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   DJ
                 </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {verificationRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.name}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Check-ins: {request.totalCheckIns}</div>
                      <div>Missions: {request.missionsCompleted}</div>
                      <div>Streak: {request.currentStreak} days</div>
                      <div>Balance: {request.tokenBalance} tokens</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.lastLoginAt ? new Date(request.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedUser(request)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {verificationRequests.length === 0 && (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              All DJ verification requests have been processed.
            </p>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
                             <h3 className="text-lg font-medium text-gray-900 mb-4">
                 Review DJ Verification
               </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>{selectedUser.name}</strong> ({selectedUser.email})
                </p>
                <p className="text-sm text-gray-500">
                  Check-ins: {selectedUser.totalCheckIns} | Missions: {selectedUser.missionsCompleted}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Notes (optional)
                  </label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add notes about this verification..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Reason for rejection..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                                 <button
                   onClick={() => verifyDJ(selectedUser.id)}
                   disabled={isProcessing}
                   className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                 >
                   {isProcessing ? 'Verifying...' : 'Verify DJ'}
                 </button>
                <button
                  onClick={() => rejectDJ(selectedUser.id)}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isProcessing ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setVerificationNotes('');
                    setRejectionReason('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
