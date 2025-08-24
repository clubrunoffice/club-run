import { 
  Search, 
  DollarSign, 
  BarChart3,
  Music,
  Users,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRBAC } from '../contexts/RBACContext';
import './AgentDashboard.css';

const AgentDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user, hasRole, getCurrentTheme } = useRBAC();
  const theme = getCurrentTheme();

  // Role-based agents
  const getRoleAgents = () => {
    if (!isAuthenticated || !user) {
      return [
        {
          id: 'previewAgent',
          title: 'Preview Agent',
          icon: <Search className="w-6 h-6" />,
          iconBg: 'bg-gray-500',
          efficiency: 'Preview',
          status: 'PREVIEW',
          description: 'Preview: Explore Club Run platform features',
          latestUpdate: 'Preview: Sign up to access real AI agents',
          borderColor: 'border-l-gray-500'
        }
      ];
    }

    switch (user.role) {
      case 'DJ':
        return [
          {
            id: 'musicAgent',
            title: 'Music Curation Agent',
            icon: <Music className="w-6 h-6" />,
            iconBg: 'bg-blue-500',
            efficiency: '95%',
            status: 'ACTIVE',
            description: 'Analyzing music submissions and trends',
            latestUpdate: '24 new submissions received - 3 high priority',
            borderColor: 'border-l-blue-500'
          },
          {
            id: 'playlistAgent',
            title: 'Playlist Agent',
            icon: <BarChart3 className="w-6 h-6" />,
            iconBg: 'bg-purple-500',
            efficiency: '98%',
            status: 'ACTIVE',
            description: 'Managing playlist recommendations',
            latestUpdate: '12 playlists created - 5 trending',
            borderColor: 'border-l-purple-500'
          },
          {
            id: 'libraryAgent',
            title: 'Library Agent',
            icon: <DollarSign className="w-6 h-6" />,
            iconBg: 'bg-green-500',
            efficiency: '99%',
            status: 'ACTIVE',
            description: 'Organizing music library and metadata',
            latestUpdate: 'Library updated - 1,247 tracks organized',
            borderColor: 'border-l-green-500'
          }
        ];
      
      case 'CLIENT':
        return [
          {
            id: 'missionAgent',
            title: 'Mission Agent',
            icon: <Search className="w-6 h-6" />,
            iconBg: 'bg-purple-500',
            efficiency: '92%',
            status: 'ACTIVE',
            description: 'Managing mission creation and tracking',
            latestUpdate: '8 missions created - 3 active',
            borderColor: 'border-l-purple-500'
          },
          {
            id: 'p2pAgent',
            title: 'P2P Agent',
            icon: <Users className="w-6 h-6" />,
            iconBg: 'bg-blue-500',
            efficiency: '88%',
            status: 'ACTIVE',
            description: 'Coordinating P2P collaborations',
            latestUpdate: '2 P2P missions active - 1 new collaboration',
            borderColor: 'border-l-blue-500'
          },
          {
            id: 'budgetAgent',
            title: 'Budget Agent',
            icon: <DollarSign className="w-6 h-6" />,
            iconBg: 'bg-green-500',
            efficiency: '99%',
            status: 'ACTIVE',
            description: 'Tracking mission expenses and payments',
            latestUpdate: '$2,450 spent - 95% success rate',
            borderColor: 'border-l-green-500'
          }
        ];
      
      case 'CURATOR':
        return [
          {
            id: 'teamAgent',
            title: 'Team Management Agent',
            icon: <Users className="w-6 h-6" />,
            iconBg: 'bg-amber-500',
            efficiency: '94%',
            status: 'ACTIVE',
            description: 'Managing team coordination and projects',
            latestUpdate: '5 teams active - 28 collaborations',
            borderColor: 'border-l-amber-500'
          },
          {
            id: 'collabAgent',
            title: 'Collaboration Agent',
            icon: <BarChart3 className="w-6 h-6" />,
            iconBg: 'bg-purple-500',
            efficiency: '96%',
            status: 'ACTIVE',
            description: 'Optimizing collaboration workflows',
            latestUpdate: '12 P2P missions - $8,450 revenue',
            borderColor: 'border-l-purple-500'
          },
          {
            id: 'projectAgent',
            title: 'Project Agent',
            icon: <Settings className="w-6 h-6" />,
            iconBg: 'bg-blue-500',
            efficiency: '91%',
            status: 'ACTIVE',
            description: 'Coordinating project timelines',
            latestUpdate: '3 projects in progress - 2 completed',
            borderColor: 'border-l-blue-500'
          }
        ];
      
      case 'OPERATIONS':
      case 'ADMIN':
        return [
          {
            id: 'userAgent',
            title: 'User Management Agent',
            icon: <Users className="w-6 h-6" />,
            iconBg: 'bg-red-500',
            efficiency: '99%',
            status: 'ACTIVE',
            description: 'Managing user verification and roles',
            latestUpdate: '15 users verified - 3 pending',
            borderColor: 'border-l-red-500'
          },
          {
            id: 'systemAgent',
            title: 'System Health Agent',
            icon: <Settings className="w-6 h-6" />,
            iconBg: 'bg-green-500',
            efficiency: '99.9%',
            status: 'ACTIVE',
            description: 'Monitoring platform performance',
            latestUpdate: 'System health: 99.9% - All systems operational',
            borderColor: 'border-l-green-500'
          },
          {
            id: 'analyticsAgent',
            title: 'Analytics Agent',
            icon: <BarChart3 className="w-6 h-6" />,
            iconBg: 'bg-blue-500',
            efficiency: '97%',
            status: 'ACTIVE',
            description: 'Processing system analytics',
            latestUpdate: '1,247 users - $45,670 revenue',
            borderColor: 'border-l-blue-500'
          }
        ];
      
      default:
        return [
          {
            id: 'generalAgent',
            title: 'General Agent',
            icon: <Search className="w-6 h-6" />,
            iconBg: 'bg-gray-500',
            efficiency: '85%',
            status: 'ACTIVE',
            description: 'Managing general platform activities',
            latestUpdate: 'Platform overview - All systems normal',
            borderColor: 'border-l-gray-500'
          }
        ];
    }
  };

  const agents = getRoleAgents();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {!isAuthenticated || !user ? 'AI Agent Dashboard' : `${user.role} AI Agents`}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              {!isAuthenticated || !user ? 'AI-Powered Platform Operations' :
               user.role === 'DJ' ? 'AI-Powered Music Curation' :
               user.role === 'CLIENT' ? 'AI-Powered Mission Management' :
               user.role === 'CURATOR' ? 'AI-Powered Team Management' :
               user.role === 'OPERATIONS' || user.role === 'ADMIN' ? 'AI-Powered System Management' :
               'AI-Powered Operations'}
            </p>
            <p className="text-gray-400 text-lg">
              {!isAuthenticated || !user ? 'Sign up to access personalized AI agents' :
               'Role-based AI agents optimized for your workflow'}
            </p>
          
            {/* Sign-up prompt for guests */}
            {!isAuthenticated && (
              <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 border border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Experience the Full Power</h3>
                    <p className="text-blue-100 mb-4">
                      You're viewing a preview of the Agent Dashboard. Sign up to access real-time data, 
                      personalized insights, and full AI agent functionality.
                    </p>
                    <div className="flex gap-4">
                      <Link
                        to="/auth"
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Sign Up Now
                      </Link>
                      <Link
                        to="/"
                        className="text-white border border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">Preview Mode</div>
                    <div className="text-blue-100 text-sm">Limited functionality</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Agent Cards Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              AI Agent Overview
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your personalized AI agents are working behind the scenes to optimize your workflow.
            </p>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-700 cursor-pointer hover:scale-105"
              >
                <div className={`mb-4 flex justify-center ${
                  index === 0 ? 'text-blue-400' : 
                  index === 1 ? 'text-green-400' : 'text-purple-400'
                }`}>
                  <div className={`p-3 rounded-lg ${
                    index === 0 ? 'bg-blue-500 bg-opacity-20' : 
                    index === 1 ? 'bg-green-500 bg-opacity-20' : 'bg-purple-500 bg-opacity-20'
                  }`}>
                    {agent.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{agent.title}</h3>
                <div className="mb-3">
                  <span className="inline-block text-white text-xs px-2 py-1 rounded font-medium bg-green-600">
                    {agent.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{agent.description}</p>
                <div className="text-blue-400 font-medium mb-2">{agent.efficiency} Efficiency</div>
                <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-white text-sm">{agent.latestUpdate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          {isAuthenticated ? (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Check-in', 'Expense', 'Missions', 'Reports'].map((action) => (
                  <button
                    key={action}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <p className="text-gray-300 mb-4">Sign up to access powerful quick actions and shortcuts.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Check-in', 'Expense', 'Missions', 'Reports'].map((action) => (
                  <div key={action} className="bg-gray-700 rounded-lg p-4 text-center opacity-50">
                    <div className="text-gray-500 text-sm">{action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Role Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Role-Specific Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get personalized features based on your role and permissions.
            </p>
          </div>
          {isAuthenticated ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {['Runner', 'Client', 'Operations'].map((role, index) => (
                <div key={role} className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-700 cursor-pointer hover:scale-105">
                  <div className={`mb-4 flex justify-center ${
                    index === 0 ? 'text-blue-400' : 
                    index === 1 ? 'text-green-400' : 'text-purple-400'
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      index === 0 ? 'bg-blue-500 bg-opacity-20' : 
                      index === 1 ? 'bg-green-500 bg-opacity-20' : 'bg-purple-500 bg-opacity-20'
                    }`}>
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{role} Features</h3>
                  <p className="text-gray-300">Access role-specific tools and capabilities</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {['Runner', 'Client', 'Operations'].map((role, index) => (
                <div key={role} className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 opacity-50">
                  <div className={`mb-4 flex justify-center ${
                    index === 0 ? 'text-gray-400' : 
                    index === 1 ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    <div className="p-3 rounded-lg bg-gray-600 bg-opacity-20">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-400">{role} Features</h3>
                  <p className="text-gray-500">Sign up to access role-specific tools</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AgentDashboard; 