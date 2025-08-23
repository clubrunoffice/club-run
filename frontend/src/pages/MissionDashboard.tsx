import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MissionBoard from '../components/missions/MissionBoard';
import MissionCreationWizard from '../components/missions/MissionCreationWizard';
import { Plus, MapPin, DollarSign, Clock, Star, CheckCircle } from 'lucide-react';

const MissionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const [activeTab, setActiveTab] = useState<'discover' | 'my-missions' | 'completed'>('discover');

  const userRole = user?.role || 'RUNNER';

  const handleCreateMission = (missionData: any) => {
    console.log('Creating mission:', missionData);
    // TODO: Implement API call to create mission
    setShowCreateWizard(false);
    // Show success message and refresh mission list
  };

  const handleMissionSelect = (mission: any) => {
    // TODO: Navigate to mission detail view or open modal
    console.log('Selected mission:', mission);
  };

  const renderClientDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Music Services Dashboard</h1>
            <p className="text-gray-600 mt-1">Find and manage music services for your events</p>
          </div>
          <button
            onClick={() => setShowCreateWizard(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Mission
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Missions</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">$2,450</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discover Services
            </button>
            <button
              onClick={() => setActiveTab('my-missions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-missions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Missions
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'discover' && (
            <MissionBoard 
              userRole="CLIENT" 
              onMissionSelect={handleMissionSelect}
            />
          )}
          {activeTab === 'my-missions' && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Clock className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active missions
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first mission to get started.
              </p>
              <button
                onClick={() => setShowCreateWizard(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Mission
              </button>
            </div>
          )}
          {activeTab === 'completed' && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No completed missions yet
              </h3>
              <p className="text-gray-500">
                Your completed missions will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRunnerDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mission Dashboard</h1>
            <p className="text-gray-600 mt-1">Find missions and earn money as a music runner</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">$1,250</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Available Missions</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">$8,750</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.9</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discover Missions
            </button>
            <button
              onClick={() => setActiveTab('my-missions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-missions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Missions
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'discover' && (
            <MissionBoard 
              userRole="RUNNER" 
              onMissionSelect={handleMissionSelect}
            />
          )}
          {activeTab === 'my-missions' && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Clock className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active missions
              </h3>
              <p className="text-gray-500">
                Accept missions from the discover tab to get started.
              </p>
            </div>
          )}
          {activeTab === 'completed' && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No completed missions yet
              </h3>
              <p className="text-gray-500">
                Your completed missions will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {userRole === 'CLIENT' ? renderClientDashboard() : renderRunnerDashboard()}
      </div>

      {/* Mission Creation Wizard Modal */}
      {showCreateWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MissionCreationWizard
              onComplete={handleCreateMission}
              onCancel={() => setShowCreateWizard(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionDashboard;
