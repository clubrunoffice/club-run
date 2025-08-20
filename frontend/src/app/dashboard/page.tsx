'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface RecentActivity {
  id: string;
  type: 'checkin' | 'mission' | 'expense';
  title: string;
  description: string;
  timestamp: string;
  venue?: string;
  amount?: number;
  tokens?: number;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

export default function DashboardPage() {
  const { user, userStats } = useAppStore();
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'checkin',
      title: 'Checked in at 529 Bar',
      description: 'Great crowd tonight!',
      timestamp: '2 hours ago',
      venue: '529 Bar',
      tokens: 50
    },
    {
      id: '2',
      type: 'mission',
      title: 'Completed "Weekend Warrior"',
      description: 'Visited 3 venues this weekend',
      timestamp: '1 day ago',
      tokens: 200
    },
    {
      id: '3',
      type: 'expense',
      title: 'Logged expense',
      description: 'Drinks at Club XYZ',
      timestamp: '2 days ago',
      amount: 45
    },
    {
      id: '4',
      type: 'checkin',
      title: 'Checked in at The Basement',
      description: 'Amazing DJ set!',
      timestamp: '3 days ago',
      venue: 'The Basement',
      tokens: 75
    }
  ]);

  const [activeMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Venue Explorer',
      description: 'Visit 5 different venues this month',
      reward: 500,
      progress: 3,
      maxProgress: 5,
      completed: false
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Check in with 3 friends',
      reward: 300,
      progress: 1,
      maxProgress: 3,
      completed: false
    },
    {
      id: '3',
      title: 'Budget Master',
      description: 'Stay under $100 this week',
      reward: 400,
      progress: 65,
      maxProgress: 100,
      completed: false
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <MapPinIcon className="w-5 h-5 text-green-600" />;
      case 'mission':
        return <TrophyIcon className="w-5 h-5 text-yellow-600" />;
      case 'expense':
        return <CurrencyDollarIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username || 'User'}!</h1>
        <p className="text-gray-600 mt-2">Level {userStats.currentLevel} • {userStats.totalCheckIns} check-ins</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Token Balance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Token Balance</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalTokens.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">7 days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FireIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Total Check-ins */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalCheckIns}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Missions Completed */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Missions Completed</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalMissions}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Level Progress</h2>
          <span className="text-sm text-gray-600">Level {userStats.currentLevel}</span>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{userStats.totalTokens} XP</span>
            <span>{userStats.totalTokens + userStats.experienceToNextLevel} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(userStats.totalTokens / (userStats.totalTokens + userStats.experienceToNextLevel)) * 100}%` }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-600">{userStats.experienceToNextLevel} XP to next level</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Missions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Missions</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {activeMissions.map((mission) => (
                <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{mission.title}</h3>
                    <span className="text-sm font-medium text-blue-600">{mission.reward} tokens</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{mission.progress}/{mission.maxProgress}</span>
                      <span>{getProgressPercentage(mission.progress, mission.maxProgress).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(mission.progress, mission.maxProgress)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    {activity.venue && (
                      <p className="text-xs text-gray-500 mt-1">📍 {activity.venue}</p>
                    )}
                    {activity.amount && (
                      <p className="text-xs text-red-600 mt-1">💸 ${activity.amount}</p>
                    )}
                    {activity.tokens && (
                      <p className="text-xs text-yellow-600 mt-1">⭐ +{activity.tokens} tokens</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Check In</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Log Expense</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">View Missions</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
} 