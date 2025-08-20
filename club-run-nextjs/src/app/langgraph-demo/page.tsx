'use client';

import React, { useState } from 'react';
import { CopilotProvider } from '@/components/copilot/CopilotProvider';
import { ChatWidget } from '@/components/copilot/ChatWidget';

export default function LangGraphDemoPage() {
  const [selectedRole, setSelectedRole] = useState<'runner' | 'client' | 'operations'>('runner');
  const [userId] = useState('demo-user-123');

  return (
    <div className="min-h-screen bg-gray-50">
      <CopilotProvider userId={userId} userRole={selectedRole}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Club Run LangGraph Multi-Agent Workflow
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the power of AI-driven multi-agent workflows for nightlife operations. 
              Each agent specializes in different aspects: research, budget analysis, and analytics.
            </p>
          </div>

          {/* Role Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Select Your Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedRole('runner')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'runner'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold mb-2">Runner</h3>
                <p className="text-sm text-gray-600">
                  Venue research, expense tracking, and operational insights
                </p>
              </button>
              
              <button
                onClick={() => setSelectedRole('client')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'client'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold mb-2">Client</h3>
                <p className="text-sm text-gray-600">
                  Booking analytics, preference analysis, and service optimization
                </p>
              </button>
              
              <button
                onClick={() => setSelectedRole('operations')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'operations'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold mb-2">Operations</h3>
                <p className="text-sm text-gray-600">
                  Staff management, inventory tracking, and performance metrics
                </p>
              </button>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Multi-Agent Workflow</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-wrap justify-center items-center space-x-4 space-y-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                  Data Collection
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                  Agent Processing
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium">
                  Insight Generation
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-medium">
                  Action Execution
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-medium">
                  Dashboard Update
                </div>
              </div>
            </div>
          </div>

          {/* Agent Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Research Agent</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Specializes in venue research, market analysis, and competitive insights.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Venue recommendations</li>
                <li>• Market analysis</li>
                <li>• Competitive insights</li>
                <li>• Growth opportunities</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Budget Agent</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Focuses on financial analysis, expense tracking, and budget optimization.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Budget optimization</li>
                <li>• Cost-saving opportunities</li>
                <li>• Expense tracking</li>
                <li>• Financial forecasting</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Analytics Agent</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Provides operational insights, performance metrics, and efficiency analysis.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Performance metrics</li>
                <li>• Operational efficiency</li>
                <li>• Revenue optimization</li>
                <li>• Customer behavior</li>
              </ul>
            </div>
          </div>

          {/* Demo Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Try the AI Assistant</h2>
            <p className="text-blue-800 mb-4">
              Click the chat button in the bottom right corner to interact with the multi-agent AI system. 
              Try asking questions like:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">For Runners:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• "Find me the best venues in downtown"</li>
                  <li>• "Analyze my expense report"</li>
                  <li>• "What are the trending nightlife spots?"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">For Clients & Operations:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• "Show me booking analytics"</li>
                  <li>• "Analyze staff performance"</li>
                  <li>• "What are our revenue trends?"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Widget */}
        <ChatWidget />
      </CopilotProvider>
    </div>
  );
} 