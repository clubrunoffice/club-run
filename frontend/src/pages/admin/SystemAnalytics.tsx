import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../contexts/RBACContext';
import { Shield, TrendingUp, Users, DollarSign, Music, Activity, BarChart3, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalMissions: number;
  completedMissions: number;
  musicSubmissions: number;
  p2pMissions: number;
}

export const SystemAnalytics: React.FC = () => {
  const { user, hasRole } = useRBAC();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Check admin access
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'OPERATIONS' || user?.role === 'PARTNER';
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <Shield className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">Admin, Operations, or Partner role required.</p>
          <Link to="/dashboard" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Load mock statistics
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalRevenue: 45670,
        totalMissions: 156,
        completedMissions: 98,
        musicSubmissions: 342,
        p2pMissions: 67
      });
      setLoading(false);
    }, 500);
  }, [timeRange]);

  const StatCard = ({ title, value, icon, change, color }: any) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-cyan-400" />
              System Analytics
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-300">Platform statistics and performance metrics</p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={stats?.totalUsers.toLocaleString()}
                icon={<Users className="w-6 h-6 text-blue-400" />}
                change={12}
                color="bg-blue-500/20"
              />
              <StatCard
                title="Active Users"
                value={stats?.activeUsers.toLocaleString()}
                icon={<Activity className="w-6 h-6 text-green-400" />}
                change={8}
                color="bg-green-500/20"
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats?.totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
                change={25}
                color="bg-emerald-500/20"
              />
              <StatCard
                title="Music Submissions"
                value={stats?.musicSubmissions.toLocaleString()}
                icon={<Music className="w-6 h-6 text-purple-400" />}
                change={15}
                color="bg-purple-500/20"
              />
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Missions"
                value={stats?.totalMissions.toLocaleString()}
                icon={<TrendingUp className="w-6 h-6 text-orange-400" />}
                change={18}
                color="bg-orange-500/20"
              />
              <StatCard
                title="Completed Missions"
                value={stats?.completedMissions.toLocaleString()}
                icon={<Shield className="w-6 h-6 text-cyan-400" />}
                change={22}
                color="bg-cyan-500/20"
              />
              <StatCard
                title="P2P Missions"
                value={stats?.p2pMissions.toLocaleString()}
                icon={<Users className="w-6 h-6 text-pink-400" />}
                change={35}
                color="bg-pink-500/20"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* User Growth Chart Placeholder */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <p className="text-gray-400">Chart: User growth over time</p>
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Revenue Trends</h3>
                <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <p className="text-gray-400">Chart: Revenue trends</p>
                </div>
              </div>
            </div>

            {/* Mission Completion Rate */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Mission Completion Rate</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Completed</span>
                    <span>{stats && Math.round((stats.completedMissions / stats.totalMissions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all"
                      style={{ width: `${stats && (stats.completedMissions / stats.totalMissions) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>In Progress</span>
                    <span>37%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full" style={{ width: '37%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Open</span>
                    <span>26%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full" style={{ width: '26%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SystemAnalytics;
