import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  MapPin,
  Trophy,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Guests', value: '1,247', icon: <Users className="w-5 h-5" />, color: 'text-tech-cyan' },
    { label: 'This Week', value: '342', icon: <TrendingUp className="w-5 h-5" />, color: 'text-tech-green' },
    { label: 'Revenue', value: '$12,450', icon: <DollarSign className="w-5 h-5" />, color: 'text-tech-purple' },
    { label: 'Active Clubs', value: '8', icon: <Activity className="w-5 h-5" />, color: 'text-tech-orange' }
  ];

  const recentClubRuns = [
    { date: 'Tonight', venue: 'Club Nova', guests: '156', revenue: '$2,340', status: 'Active' },
    { date: 'Last Night', venue: 'Pulse Lounge', guests: '89', revenue: '$1,670', status: 'Completed' },
    { date: '2 nights ago', venue: 'Echo Bar', guests: '203', revenue: '$3,120', status: 'Completed' }
  ];

  const achievements = [
    { name: 'First Club Run', description: 'Successfully organized your first club run', icon: <Trophy className="w-6 h-6" />, earned: true },
    { name: 'Capacity Master', description: 'Reach 200+ guests in a single night', icon: <Users className="w-6 h-6" />, earned: false },
    { name: 'Revenue Champion', description: 'Generate $5K+ in a single club run', icon: <DollarSign className="w-6 h-6" />, earned: false }
  ];

  return (
    <div className="min-h-screen bg-tech-black">
      {/* Header */}
      <header className="bg-tech-gray border-b border-white border-opacity-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Club Operations Dashboard</h1>
              <p className="text-text-secondary">Welcome back, Club Manager!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="tech-button-secondary">
                <Users className="w-4 h-4 mr-2" />
                Manage Venues
              </button>
              <button className="tech-button-primary">
                Create Club Run
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-text-secondary text-sm">{stat.label}</div>
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-tech-gray rounded-lg p-1">
          {['overview', 'club-runs', 'achievements', 'venues'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-tech-cyan text-tech-black'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Club Runs */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Club Runs
              </h3>
              <div className="space-y-4">
                {recentClubRuns.map((run, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-tech-input rounded-lg">
                    <div>
                      <div className="font-medium text-white">{run.venue}</div>
                      <div className="text-sm text-text-secondary flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {run.date} • {run.guests} guests
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-tech-cyan font-medium">{run.revenue}</div>
                      <div className={`text-sm px-2 py-1 rounded-full ${
                        run.status === 'Active' 
                          ? 'bg-tech-green bg-opacity-20 text-tech-green' 
                          : 'bg-text-secondary bg-opacity-20 text-text-secondary'
                      }`}>
                        {run.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Club Manager Achievements
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    achievement.earned 
                      ? 'border-tech-green bg-tech-green bg-opacity-10' 
                      : 'border-white border-opacity-20 bg-tech-input'
                  }`}>
                    <div className="flex items-center">
                      <div className={`mr-3 ${achievement.earned ? 'text-tech-green' : 'text-text-muted'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${achievement.earned ? 'text-tech-green' : 'text-white'}`}>
                          {achievement.name}
                        </div>
                        <div className="text-sm text-text-secondary">{achievement.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'club-runs' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-6">Club Run History</h3>
            <div className="space-y-4">
              {recentClubRuns.map((run, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-tech-input rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-tech-cyan bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-tech-cyan" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{run.venue}</div>
                      <div className="text-sm text-text-secondary">{run.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-tech-cyan font-medium">{run.revenue}</div>
                    <div className="text-sm text-text-secondary">{run.guests} guests</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-6">All Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  achievement.earned 
                    ? 'border-tech-green bg-tech-green bg-opacity-10' 
                    : 'border-white border-opacity-20 bg-tech-input'
                }`}>
                  <div className="flex items-center">
                    <div className={`mr-3 ${achievement.earned ? 'text-tech-green' : 'text-text-muted'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className={`font-medium ${achievement.earned ? 'text-tech-green' : 'text-white'}`}>
                        {achievement.name}
                      </div>
                      <div className="text-sm text-text-secondary">{achievement.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'venues' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-6">Venue Management</h3>
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-tech-cyan mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Manage Your Venues</h4>
              <p className="text-text-secondary mb-6">
                Add new venues, track performance, and manage club run locations.
              </p>
              <button className="tech-button-primary">
                Add New Venue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;