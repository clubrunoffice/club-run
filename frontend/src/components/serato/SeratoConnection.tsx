import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SeratoConnectionStatus {
  connected: boolean;
  isExpired: boolean;
  profile?: {
    seratoUsername: string;
    seratoDisplayName: string;
    connectedAt: string;
  };
  message: string;
}

export function SeratoConnection() {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<SeratoConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/serato/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const status = await response.json();
        setConnectionStatus(status);
      } else {
        console.error('Failed to check Serato connection status');
      }
    } catch (error) {
      console.error('Error checking Serato connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectSerato = async () => {
    try {
      setIsConnecting(true);
      const response = await fetch('/api/serato/connect', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Serato OAuth
        window.location.href = data.authUrl;
      } else {
        const error = await response.json();
        alert(`Failed to initiate Serato connection: ${error.message}`);
      }
    } catch (error) {
      console.error('Error connecting to Serato:', error);
      alert('Failed to connect to Serato');
    } finally {
      setIsConnecting(false);
    }
  };

  const refreshConnection = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/serato/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await checkConnectionStatus();
        alert('Serato connection refreshed successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to refresh connection: ${error.message}`);
      }
    } catch (error) {
      console.error('Error refreshing Serato connection:', error);
      alert('Failed to refresh Serato connection');
    } finally {
      setIsRefreshing(false);
    }
  };

  const disconnectSerato = async () => {
    if (!confirm('Are you sure you want to disconnect your Serato account? This will disable automatic mission verification.')) {
      return;
    }

    try {
      setIsDisconnecting(true);
      const response = await fetch('/api/serato/disconnect', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await checkConnectionStatus();
        alert('Serato account disconnected successfully');
      } else {
        const error = await response.json();
        alert(`Failed to disconnect: ${error.message}`);
      }
    } catch (error) {
      console.error('Error disconnecting Serato:', error);
      alert('Failed to disconnect Serato account');
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Checking Serato connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Serato Integration
        </h2>
        <p className="text-gray-600">
          Connect your Serato account for seamless mission verification
        </p>
      </div>

      {!connectionStatus?.connected ? (
        <div className="text-center">
          {user?.role === 'RUNNER' ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Verification Required
              </h3>
              <p className="text-red-700 mb-4">
                Your account must be verified by operations before you can connect Serato. 
                Please complete your profile and wait for verification approval.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Verification Process:</h4>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Complete your profile and add a profile picture</li>
                  <li>• Operations team reviews your account (24-48 hours)</li>
                  <li>• You'll receive an email when verified</li>
                  <li>• Return here to connect your Serato account</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.href = '/profile'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Complete Profile
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Serato Account Not Connected
              </h3>
              <p className="text-yellow-700 mb-4">
                Connect your Serato account to enable automatic mission verification. 
                Once connected, you can focus on playing music while Club Run handles all verification and payments automatically.
              </p>
              <button
                onClick={connectSerato}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect Serato Account'
                )}
              </button>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">✨ Benefits of Connecting:</h4>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Automatic mission verification - no manual check-ins needed</li>
              <li>• Instant payment processing when missions are completed</li>
              <li>• Professional proof logging for your DJ resume</li>
              <li>• Seamless experience - just play music as usual</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`border rounded-lg p-6 ${connectionStatus.isExpired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center mb-4">
              {connectionStatus.isExpired ? (
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <div className="ml-3">
                <h3 className={`text-lg font-semibold ${connectionStatus.isExpired ? 'text-red-800' : 'text-green-800'}`}>
                  Serato Account Connected
                </h3>
                <p className={`text-sm ${connectionStatus.isExpired ? 'text-red-700' : 'text-green-700'}`}>
                  {connectionStatus.message}
                </p>
              </div>
            </div>

            {connectionStatus.profile && (
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-medium text-gray-900 mb-2">Connected Account:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Username:</strong> {connectionStatus.profile.seratoUsername}</p>
                  <p><strong>Display Name:</strong> {connectionStatus.profile.seratoDisplayName}</p>
                  <p><strong>Connected:</strong> {new Date(connectionStatus.profile.connectedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            {connectionStatus.isExpired && (
              <button
                onClick={refreshConnection}
                disabled={isRefreshing}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Connection'}
              </button>
            )}
            
            <button
              onClick={disconnectSerato}
              disabled={isDisconnecting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 How It Works:</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>1.</strong> Accept a mission with automatic verification enabled</p>
              <p><strong>2.</strong> Play your set normally in Serato (no extra steps needed)</p>
              <p><strong>3.</strong> Club Run automatically checks your play history</p>
              <p><strong>4.</strong> If the required track is found, you're automatically paid</p>
              <p><strong>5.</strong> Professional proof is logged to your DJ resume</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
