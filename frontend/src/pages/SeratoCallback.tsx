import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const SeratoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Serato authorization was cancelled or failed.');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received from Serato.');
          return;
        }

        // Exchange code for tokens
        const response = await fetch('/api/serato/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Serato account connected successfully! You can now complete your VERIFIED_DJ registration.');
          
          // Store Serato verification status in session storage
          sessionStorage.setItem('seratoVerified', 'true');
          sessionStorage.setItem('seratoProfile', JSON.stringify(data.profile));
          
          // Redirect back to signup after a delay
          setTimeout(() => {
            navigate('/signup?seratoVerified=true');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to connect Serato account.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred during Serato connection.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connecting to Serato...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your Serato account.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Serato Connected Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">What's Next?</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Complete your VERIFIED_DJ registration</li>
                  <li>• Access advanced mission features</li>
                  <li>• Enable automatic verification</li>
                  <li>• Get priority access to missions</li>
                </ul>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connection Failed
              </h2>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Troubleshooting:</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Make sure you're logged into Serato</li>
                  <li>• Check your internet connection</li>
                  <li>• Try connecting again</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/signup')}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Signup
          </button>
          
          {status === 'error' && (
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
