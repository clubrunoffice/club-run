import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, CheckCircle, XCircle, AlertCircle, Music } from 'lucide-react';

interface VerificationStatus {
  role: string;
  isVerified: boolean;
  verificationDate?: string;
  verificationNotes?: string;
}

export function RunnerVerificationStatus() {
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setVerificationStatus({
        role: user.role,
        isVerified: user.role === 'VERIFIED_DJ'
      });
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!verificationStatus || !['DJ', 'VERIFIED_DJ'].includes(verificationStatus.role)) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Music className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">
          Runner Verification Status
        </h2>
      </div>

      {verificationStatus.role === 'DJ' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-yellow-800">
                Pending Verification
              </h3>
            </div>
            <p className="mt-2 text-sm text-yellow-700">
              Your account is currently being reviewed by our operations team. 
              Once verified, you'll gain access to automatic Serato verification for seamless mission completion.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">What happens during verification?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Operations team reviews your profile and activity</li>
              <li>• Verification typically takes 24-48 hours</li>
              <li>• You'll receive an email notification when verified</li>
              <li>• Once verified, you can connect your Serato account</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What you can do while waiting:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete your profile and add a profile picture</li>
              <li>• Browse available missions and venues</li>
              <li>• Read the platform guidelines and FAQ</li>
              <li>• Contact support if you have questions</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@clubrun.com" className="text-blue-600 hover:text-blue-500">
                support@clubrun.com
              </a>
            </p>
          </div>
        </div>
      )}

      {verificationStatus.role === 'VERIFIED_DJ' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-green-800">
                Verified DJ
              </h3>
            </div>
            <p className="mt-2 text-sm text-green-700">
              Congratulations! Your account has been verified. You now have access to automatic Serato verification for seamless mission completion.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Your verified runner benefits:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Connect your Serato account for automatic verification</li>
              <li>• Automatic mission completion and payment processing</li>
              <li>• Professional proof logging for your resume</li>
              <li>• Priority support and exclusive features</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Next steps:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Connect your Serato account for seamless verification</li>
              <li>• Accept missions and let automatic verification handle the rest</li>
              <li>• Set up your payment preferences</li>
              <li>• Complete your DJ profile and portfolio</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/serato-connection'}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Connect Serato Account
            </button>
            <button
              onClick={() => window.location.href = '/p2p-missions'}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Browse Missions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
