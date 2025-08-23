import { 
  Search, 
  DollarSign, 
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AgentDashboard.css';

const AgentDashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const agents = [
    {
      id: 'researchAgent',
      title: 'Research Agent',
      icon: <Search className="w-6 h-6" />,
      iconBg: 'bg-blue-500',
      efficiency: '85%',
      status: 'ACTIVE',
      description: isAuthenticated 
        ? 'Analyzing venue crowd reports and trends'
        : 'Preview: Analyzing venue crowd reports and trends',
      latestUpdate: isAuthenticated
        ? '529 Bar trending up - expect higher crowd tonight.'
        : 'Preview: 529 Bar trending up - expect higher crowd tonight.',
      borderColor: 'border-l-blue-500'
    },
    {
      id: 'budgetAgent',
      title: 'Budget Agent',
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: 'bg-green-500',
      efficiency: '99%',
      status: 'ACTIVE',
      description: isAuthenticated
        ? 'Tracking operational expenses and costs'
        : 'Preview: Tracking operational expenses and costs',
      latestUpdate: isAuthenticated
        ? '$15 under budget this week - great job!'
        : 'Preview: $15 under budget this week - great job!',
      borderColor: 'border-l-green-500'
    },
    {
      id: 'reportingAgent',
      title: 'Reporting Agent',
      icon: <BarChart3 className="w-6 h-6" />,
      iconBg: 'bg-purple-500',
      efficiency: '98%',
      status: 'ACTIVE',
      description: isAuthenticated
        ? 'Processing check-in verifications'
        : 'Preview: Processing check-in verifications',
      latestUpdate: isAuthenticated
        ? 'All recent check-ins verified successfully.'
        : 'Preview: All recent check-ins verified successfully.',
      borderColor: 'border-l-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Agent Dashboard</h1>
          <p className="text-gray-400">AI-Powered Nightlife Operations</p>
          <p className="text-gray-500 text-sm mt-1">Role automatically assigned by system administrator</p>
          
          {/* Sign-up prompt for guests */}
          {!isAuthenticated && (
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 border border-blue-400">
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

        {/* Agent Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 transition-all duration-300 hover:border-gray-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${agent.iconBg} p-3 rounded-lg`}>
                  {agent.icon}
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{agent.efficiency}</div>
                  <div className="text-xs text-gray-400">Efficiency</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{agent.title}</h3>
              
              <div className="mb-3">
                <span className="inline-block text-white text-xs px-2 py-1 rounded font-medium bg-green-600">
                  {agent.status}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{agent.description}</p>
              
              <div className={`bg-gray-700 rounded-lg p-3 border-l-4 ${agent.borderColor}`}>
                <p className="text-white text-sm">{agent.latestUpdate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        {isAuthenticated ? (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Check-in', 'Expense', 'Missions', 'Reports'].map((action) => (
                <button
                  key={action}
                  className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors"
                >
                  <div className="text-white text-sm">{action}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <p className="text-gray-400 mb-4">Sign up to access powerful quick actions and shortcuts.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Check-in', 'Expense', 'Missions', 'Reports'].map((action) => (
                <div key={action} className="bg-gray-700 rounded-lg p-4 text-center opacity-50">
                  <div className="text-gray-500 text-sm">{action}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Features Section */}
        {isAuthenticated ? (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Role-Specific Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Runner', 'Client', 'Operations'].map((role) => (
                <button
                  key={role}
                  className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors"
                >
                  <div className="text-white text-sm">{role} Features</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Role-Specific Features</h3>
            <p className="text-gray-400 mb-4">Get personalized features based on your role when you sign up.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Runner', 'Client', 'Operations'].map((role) => (
                <div key={role} className="bg-gray-700 rounded-lg p-4 text-center opacity-50">
                  <div className="text-gray-500 text-sm">{role} Features</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard; 