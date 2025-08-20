'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Mission, MissionType, MissionCategory } from '@/types';
import { 
  TrophyIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  FireIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

// Mock data for missions
const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Weekend Warrior',
    description: 'Visit 3 different venues this weekend',
    type: MissionType.WEEKLY,
    category: MissionCategory.CHECK_IN,
    reward: 500,
    progress: 2,
    target: 3,
    timeLeft: '2 days',
    expiresAt: '2024-01-15T23:59:59Z',
    isCompleted: false,
    requirements: [
      { type: 'check_in', value: 'venue_visit', current: 2, target: 3 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Check in with 3 friends at the same venue',
    type: MissionType.DAILY,
    category: MissionCategory.SOCIAL,
    reward: 300,
    progress: 1,
    target: 3,
    timeLeft: '12 hours',
    expiresAt: '2024-01-10T23:59:59Z',
    isCompleted: false,
    requirements: [
      { type: 'social_check_in', value: 'friend_check_in', current: 1, target: 3 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Budget Master',
    description: 'Stay under $100 in expenses this week',
    type: MissionType.WEEKLY,
    category: MissionCategory.COLLECTION,
    reward: 400,
    progress: 65,
    target: 100,
    timeLeft: '5 days',
    expiresAt: '2024-01-15T23:59:59Z',
    isCompleted: false,
    requirements: [
      { type: 'expense_tracking', value: 'budget_limit', current: 65, target: 100 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Venue Explorer',
    description: 'Discover 5 new venues this month',
    type: MissionType.MONTHLY,
    category: MissionCategory.EXPLORATION,
    reward: 1000,
    progress: 3,
    target: 5,
    timeLeft: '20 days',
    expiresAt: '2024-01-31T23:59:59Z',
    isCompleted: false,
    requirements: [
      { type: 'venue_discovery', value: 'new_venues', current: 3, target: 5 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Early Bird',
    description: 'Check in before 9 PM at any venue',
    type: MissionType.DAILY,
    category: MissionCategory.CHECK_IN,
    reward: 150,
    progress: 1,
    target: 1,
    timeLeft: '6 hours',
    expiresAt: '2024-01-10T23:59:59Z',
    isCompleted: true,
    requirements: [
      { type: 'early_check_in', value: 'before_9pm', current: 1, target: 1 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export default function MissionsPage() {
  const { missions, setMissions, user } = useAppStore();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'expired'>('all');

  useEffect(() => {
    // Load mock data
    setMissions(mockMissions);
  }, [setMissions]);

  const getMissionTypeIcon = (type: MissionType) => {
    switch (type) {
      case MissionType.DAILY:
        return <CalendarIcon className="h-4 w-4" />;
      case MissionType.WEEKLY:
        return <ClockIcon className="h-4 w-4" />;
      case MissionType.MONTHLY:
        return <CalendarIcon className="h-4 w-4" />;
      case MissionType.SPECIAL:
        return <StarIcon className="h-4 w-4" />;
      case MissionType.EVENT:
        return <FireIcon className="h-4 w-4" />;
      default:
        return <TrophyIcon className="h-4 w-4" />;
    }
  };

  const getMissionTypeColor = (type: MissionType) => {
    switch (type) {
      case MissionType.DAILY:
        return 'text-blue-600 bg-blue-100';
      case MissionType.WEEKLY:
        return 'text-purple-600 bg-purple-100';
      case MissionType.MONTHLY:
        return 'text-green-600 bg-green-100';
      case MissionType.SPECIAL:
        return 'text-yellow-600 bg-yellow-100';
      case MissionType.EVENT:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMissionStatus = (mission: Mission) => {
    if (mission.isCompleted) return 'completed';
    if (new Date(mission.expiresAt) < new Date()) return 'expired';
    return 'active';
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
  };

  const handleClaimReward = (missionId: string) => {
    console.log('Claiming reward for mission:', missionId);
    // Add reward claiming logic here
  };

  const filteredMissions = missions.filter(mission => {
    const status = getMissionStatus(mission);
    if (filter === 'all') return true;
    return status === filter;
  });

  const activeMissions = missions.filter(m => getMissionStatus(m) === 'active');
  const completedMissions = missions.filter(m => getMissionStatus(m) === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
              <p className="text-sm text-gray-600">Complete challenges and earn rewards</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-yellow-600">
                <StarIcon className="h-5 w-5" />
                <span className="font-semibold">{user?.tokens || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Missions</p>
                <p className="text-2xl font-bold text-gray-900">{activeMissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedMissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                <p className="text-2xl font-bold text-gray-900">
                  {missions.reduce((sum, m) => sum + (m.isCompleted ? m.reward : 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <GiftIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All', count: missions.length },
              { key: 'active', label: 'Active', count: activeMissions.length },
              { key: 'completed', label: 'Completed', count: completedMissions.length },
              { key: 'expired', label: 'Expired', count: missions.filter(m => getMissionStatus(m) === 'expired').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                  ${filter === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => {
            const status = getMissionStatus(mission);
            const progressPercentage = getProgressPercentage(mission.progress, mission.target);
            
            return (
              <div
                key={mission.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Mission Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getMissionTypeColor(mission.type)}`}>
                        {getMissionTypeIcon(mission.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {mission.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <StarIcon className="h-4 w-4" />
                        <span className="font-semibold">{mission.reward}</span>
                      </div>
                      <p className="text-xs text-gray-500">tokens</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{mission.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{mission.progress}/{mission.target}</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === 'completed' 
                            ? 'bg-green-500' 
                            : status === 'expired'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status and Time */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      {status === 'completed' ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      ) : status === 'expired' ? (
                        <XCircleIcon className="h-4 w-4 text-red-600" />
                      ) : (
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className={
                        status === 'completed' ? 'text-green-600' :
                        status === 'expired' ? 'text-red-600' :
                        'text-yellow-600'
                      }>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-500">
                      <ClockIcon className="h-3 w-3" />
                      <span>{mission.timeLeft}</span>
                    </div>
                  </div>
                </div>

                {/* Mission Actions */}
                <div className="p-6">
                  {status === 'completed' ? (
                    <button
                      onClick={() => handleClaimReward(mission.id)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Claim Reward
                    </button>
                  ) : status === 'expired' ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed text-sm font-medium"
                    >
                      Expired
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedMission(mission)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Track Progress
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Missions */}
        {filteredMissions.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No missions found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'No missions available' : `No ${filter} missions`}
            </p>
          </div>
        )}
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${getMissionTypeColor(selectedMission.type)}`}>
                      {getMissionTypeIcon(selectedMission.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedMission.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {selectedMission.type.replace('_', ' ')} Mission
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMission(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{selectedMission.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {selectedMission.progress}/{selectedMission.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(selectedMission.progress, selectedMission.target)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Reward:</span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{selectedMission.reward} tokens</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Time Left:</span>
                      <span>{selectedMission.timeLeft}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="capitalize">{selectedMission.category.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={
                        getMissionStatus(selectedMission) === 'completed' ? 'text-green-600' :
                        getMissionStatus(selectedMission) === 'expired' ? 'text-red-600' :
                        'text-yellow-600'
                      }>
                        {getMissionStatus(selectedMission).charAt(0).toUpperCase() + getMissionStatus(selectedMission).slice(1)}
                      </span>
                    </div>
                  </div>

                  {selectedMission.requirements && selectedMission.requirements.length > 0 && (
                    <div>
                      <span className="text-gray-500 text-sm">Requirements:</span>
                      <div className="mt-2 space-y-2">
                        {selectedMission.requirements.map((req, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 capitalize">
                              {req.type.replace('_', ' ')}: {req.value.replace('_', ' ')}
                            </span>
                            <span className="text-gray-900">
                              {req.current}/{req.target}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {getMissionStatus(selectedMission) === 'completed' ? (
                  <button
                    onClick={() => handleClaimReward(selectedMission.id)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Claim Reward
                  </button>
                ) : (
                  <button
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Track Progress
                  </button>
                )}
                <button
                  onClick={() => setSelectedMission(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 