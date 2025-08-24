import React from 'react';
import { useRBAC } from '../contexts/RBACContext';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useRBAC();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Your Dashboard
            </h1>
            
            {isAuthenticated && user ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">
                    🎉 ChatGPT Integration is LIVE!
                  </h2>
                  <p className="text-blue-700">
                    Your role: <span className="font-semibold">{user.role}</span>
                  </p>
                  <p className="text-blue-700 mt-2">
                    Try the chat bot in the bottom right corner to test the AI integration!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      💬 Chat Bot Features
                    </h3>
                    <ul className="text-green-700 space-y-1">
                      <li>• Smart query routing (80% free, 20% ChatGPT)</li>
                      <li>• Role-based responses</li>
                      <li>• Cost control with daily limits</li>
                      <li>• Data sanitization for privacy</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      📊 Analytics Available
                    </h3>
                    <ul className="text-purple-700 space-y-1">
                      <li>• Real-time cost tracking</li>
                      <li>• Usage analytics by user</li>
                      <li>• ROI analysis</li>
                      <li>• Admin dashboard</li>
                    </ul>
                  </div>
                </div>

                {(user.role === 'ADMIN' || user.role === 'OPERATIONS') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                      🔧 Admin Features
                    </h3>
                    <p className="text-yellow-700 mb-3">
                      As a {user.role}, you have access to:
                    </p>
                    <div className="space-y-2">
                      <a 
                        href="/chatgpt-analytics" 
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        📊 View ChatGPT Analytics
                      </a>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🧪 Test the Integration
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Try these queries in the chat bot:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Local (FREE):</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• "Create mission"</li>
                        <li>• "Check in"</li>
                        <li>• "Show balance"</li>
                        <li>• "Help"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">ChatGPT (Paid):</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• "Plan a music festival"</li>
                        <li>• "Marketing strategy advice"</li>
                        <li>• "Team collaboration tips"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Please log in to access your dashboard and test the ChatGPT integration.
                </p>
                <a 
                  href="/auth" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;