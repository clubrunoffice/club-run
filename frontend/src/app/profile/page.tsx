'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  CalendarIcon,
  StarIcon,
  TrophyIcon,
  MapPinIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, userStats, theme, toggleTheme, settings, updateSettings } = useAppStore();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-3xl">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1 text-yellow-600">
                <StarIcon className="h-5 w-5" />
                <span className="font-semibold">{user.tokens} tokens</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <TrophyIcon className="h-5 w-5" />
                <span className="font-semibold">Level {user.level}</span>
              </div>
            </div>
          </div>
          <button className="btn-secondary">
            <CogIcon className="h-5 w-5 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Check-ins</p>
                      <p className="text-2xl font-bold text-gray-900">{userStats.totalCheckIns}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrophyIcon className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Missions Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{userStats.totalMissions}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <StarIcon className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                      <p className="text-2xl font-bold text-gray-900">{userStats.totalTokens}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
            
            {/* Theme Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? (
                    <MoonIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <SunIcon className="h-5 w-5 text-gray-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Theme</p>
                    <p className="text-sm text-gray-600">Light or Dark mode</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{
                    backgroundColor: theme === 'dark' ? '#3b82f6' : '#d1d5db'
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <BellIcon className="h-5 w-5" />
                  <span>Notifications</span>
                </h3>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => updateSettings({
                      notifications: { ...settings.notifications, email: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Email notifications</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => updateSettings({
                      notifications: { ...settings.notifications, push: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Push notifications</span>
                </label>
              </div>

              {/* Privacy */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Privacy</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updateSettings({
                      privacy: { ...settings.privacy, profileVisibility: e.target.value as any }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.privacy.locationSharing}
                    onChange={(e) => updateSettings({
                      privacy: { ...settings.privacy, locationSharing: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Share location for venue recommendations</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 