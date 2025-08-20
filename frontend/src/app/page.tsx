'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPinIcon, 
  ClockIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  UsersIcon, 
  TrophyIcon, 
  StarIcon,
  CurrencyDollarIcon,
  FireIcon,
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
  HomeIcon,
  BuildingOfficeIcon,
  FlagIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { CopilotChat } from '@/components/copilot/CopilotChat';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';

type ViewType = 'landing' | 'dashboard' | 'agents' | 'venues' | 'missions' | 'profile';

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

interface Agent {
  id: string;
  name: string;
  displayName: string;
  status: 'active' | 'inactive' | 'maintenance';
  confidence: number;
  task: string;
  insight: string;
  icon: React.ReactNode;
  color: string;
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [user] = useState({
    username: 'Alex Johnson',
    level: 8,
    tokens: 2450,
    checkIns: 47,
    missions: 12
  });

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
    }
  ]);

  const [agents] = useState<Agent[]>([
    {
      id: '1',
      name: 'research',
      displayName: 'Research Agent',
      status: 'active',
      confidence: 85,
      task: 'Analyzing venue crowd reports',
      insight: '529 Bar trending up - expect higher crowd tonight.',
      icon: <MapPinIcon className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: '2',
      name: 'budget',
      displayName: 'Budget Agent',
      status: 'active',
      confidence: 99,
      task: 'Tracking weekly expenses',
      insight: '$15 under budget this week - great job!',
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      color: 'green'
    },
    {
      id: '3',
      name: 'reporting',
      displayName: 'Reporting Agent',
      status: 'active',
      confidence: 98,
      task: 'Processing check-in verifications',
      insight: 'All recent check-ins verified successfully.',
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: 'purple'
    },
    {
      id: '4',
      name: 'copilot',
      displayName: 'AI Copilot',
      status: 'active',
      confidence: 90,
      task: 'Ready for voice commands',
      insight: 'Ask me about tonight\'s venue recommendations!',
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      color: 'teal'
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

  const getAgentColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      teal: 'bg-teal-100 text-teal-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Navigation component
  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2 ml-4 lg:ml-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
              <span className="text-xl font-bold text-gray-900">Club Run</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('landing')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'landing' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChartBarIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('agents')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'agents' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UsersIcon className="h-4 w-4" />
              <span>Agents</span>
            </button>
            <button
              onClick={() => setCurrentView('venues')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'venues' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>Venues</span>
            </button>
            <button
              onClick={() => setCurrentView('missions')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'missions' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FlagIcon className="h-4 w-4" />
              <span>Missions</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCopilotOpen(!copilotOpen)}
              className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Landing View
  const LandingView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Run with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Purpose
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join the sustainable running community. Track your runs, connect with fellow runners, 
              and contribute to environmental conservation with every step you take.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-blue-500 hover:to-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
              >
                Launch Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('agents')}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              >
                View AI Agents <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by runners worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Join thousands of runners making a positive impact
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Active Runners</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">50K+</dd>
              </div>
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Runs Completed</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">2.5M+</dd>
              </div>
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">CO₂ Saved</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">150K kg</dd>
              </div>
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Trees Planted</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">25K+</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Sustainable Running</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to run sustainably
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Track your runs, connect with the community, and make a positive impact on the environment 
            with our comprehensive running platform.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <MapPinIcon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                Smart Route Planning
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Discover eco-friendly running routes that minimize your environmental impact while 
                  maximizing your running experience.
                </p>
                <p className="mt-6">
                  <button 
                    onClick={() => setCurrentView('venues')}
                    className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Explore routes <span aria-hidden="true">→</span>
                  </button>
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <ClockIcon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                Progress Tracking
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Monitor your running progress with detailed analytics, including carbon footprint 
                  reduction and sustainability metrics.
                </p>
                <p className="mt-6">
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    View analytics <span aria-hidden="true">→</span>
                  </button>
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <HeartIcon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                Community Impact
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Connect with like-minded runners, participate in sustainability challenges, 
                  and contribute to environmental conservation projects.
                </p>
                <p className="mt-6">
                  <button 
                    onClick={() => setCurrentView('missions')}
                    className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Join community <span aria-hidden="true">→</span>
                  </button>
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  // Dashboard View
  const DashboardView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
        <p className="text-gray-600 mt-2">Level {user.level} • {user.checkIns} check-ins</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Token Balance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Token Balance</p>
              <p className="text-2xl font-bold text-gray-900">{user.tokens.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{user.checkIns}</p>
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
              <p className="text-2xl font-bold text-gray-900">{user.missions}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Missions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Missions</h2>
              <button 
                onClick={() => setCurrentView('missions')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
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
          
          <button 
            onClick={() => setCurrentView('missions')}
            className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">View Missions</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('agents')}
            className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">AI Agents</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Agents View
  const AgentsView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Agents Dashboard</h1>
        <p className="text-gray-600 mt-2">Your AI agents are working to optimize your nightlife operations.</p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${getAgentColorClasses(agent.color)} rounded-lg flex items-center justify-center`}>
                  {agent.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.displayName}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{agent.confidence}%</div>
                <div className="text-sm text-gray-500">Efficiency</div>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{agent.task}</p>
            <div className={`bg-${agent.color}-50 border-l-4 border-${agent.color}-400 p-3 rounded-r-lg`}>
              <p className={`text-sm text-${agent.color}-800`}>{agent.insight}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Copilot Section with Chat Integration */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Copilot</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                LISTENING
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">90%</div>
            <div className="text-sm text-gray-500">Efficiency</div>
          </div>
        </div>
        <p className="text-gray-600 mb-3">Ready for voice commands and chat assistance.</p>
        <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded-r-lg mb-4">
          <p className="text-sm text-teal-800">Ask me about tonight's venue recommendations or chat with me directly!</p>
        </div>
        
        {/* Chat Interface */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-gray-900">Chat with AI Copilot</h4>
            <button
              onClick={() => setCopilotOpen(!copilotOpen)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
              Open Chat
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              Click "Open Chat" to start a conversation with your AI Copilot. I can help you with venue recommendations, 
              mission tracking, check-ins, and more!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Quick Check-In</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Log Expense</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('missions')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">View Missions</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Venues View
  const VenuesView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Venues</h1>
        <p className="text-gray-600 mt-2">Discover and explore amazing venues in your area.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="text-center py-12">
          <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Venue Discovery</h3>
          <p className="text-gray-600 mb-4">
            Find the best venues for your nightlife adventures. Coming soon with full venue listings, 
            reviews, and check-in functionality.
          </p>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // Missions View
  const MissionsView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
        <p className="text-gray-600 mt-2">Complete missions to earn tokens and level up.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Missions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Missions</h2>
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

        {/* Mission Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Mission Categories</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Daily Missions</h3>
                  <p className="text-sm text-gray-600">Complete daily challenges</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">3 available</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Weekly Missions</h3>
                  <p className="text-sm text-gray-600">Longer-term objectives</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 available</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Special Missions</h3>
                  <p className="text-sm text-gray-600">Limited time events</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Profile View
  const ProfileView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user.username.charAt(0)}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{user.username}</h3>
          <p className="text-gray-600 mb-4">Level {user.level} • {user.checkIns} check-ins</p>
          <div className="flex justify-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'agents':
        return <AgentsView />;
      case 'venues':
        return <VenuesView />;
      case 'missions':
        return <MissionsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        {renderCurrentView()}
      </main>

      {/* AI Copilot Chat */}
      {copilotOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setCopilotOpen(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <CopilotChat onClose={() => setCopilotOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
} 