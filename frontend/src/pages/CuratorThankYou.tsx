import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Mail, Home, Info } from 'lucide-react';

const CuratorThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-purple-100 mb-8">
            <Shield className="h-12 w-12 text-purple-600" />
          </div>

          {/* Main Content */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Curator Application Submitted!
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Thank you for applying to become a Club Run Curator. Your application has been received and is under review.
          </p>

          {/* Status Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-500">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-yellow-400" />
              <span className="text-lg font-semibold text-white">Application Status: Pending Review</span>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Your application will be reviewed within 24-48 hours</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>You'll receive an email notification once approved</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Approved curators can access the curator dashboard</span>
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white bg-opacity-5 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">1</span>
                </div>
                <p>Review Process</p>
                <p className="text-xs text-gray-400">We'll review your background and experience</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">2</span>
                </div>
                <p>Email Notification</p>
                <p className="text-xs text-gray-400">You'll receive approval or feedback via email</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">3</span>
                </div>
                <p>Access Granted</p>
                <p className="text-xs text-gray-400">Approved curators get full platform access</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => {
                // Scroll to curator info section or show modal
                window.location.href = '/#curator-info';
              }}
              className="inline-flex items-center justify-center px-6 py-3 border border-purple-500 text-base font-medium rounded-md text-white bg-transparent hover:bg-purple-500 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">
              Questions about your application?
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <span>Contact us at: curator-support@clubrun.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuratorThankYou;
