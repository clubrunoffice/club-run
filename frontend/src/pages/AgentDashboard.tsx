import React from 'react';
import { 
  Search, 
  DollarSign, 
  BarChart3, 
  Smartphone, 
  Calendar, 
  Eye,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useUIAgent } from '../contexts/UIAgentContext';
import UIAgentCard from '../components/UIAgentCard';
import QuickActions from '../components/QuickActions';
import RoleFeatures from '../components/RoleFeatures';

const AgentDashboard: React.FC = () => {
  const { state, getRoleConfig } = useUIAgent();
  const { currentRole, agentObservations } = state;
  const roleConfig = getRoleConfig();

  const agents = [
    {
      id: 'researchAgent',
      title: 'Research Agent',
      icon: <Search className="w-6 h-6" />,
      iconBg: 'bg-blue-500',
      efficiency: '85%',
      status: 'ACTIVE',
      description: getRoleSpecificDescription('researchAgent'),
      latestUpdate: getRoleSpecificUpdate('researchAgent'),
      borderColor: 'border-l-blue-500'
    },
    {
      id: 'budgetAgent',
      title: 'Budget Agent',
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: 'bg-green-500',
      efficiency: '99%',
      status: 'ACTIVE',
      description: getRoleSpecificDescription('budgetAgent'),
      latestUpdate: getRoleSpecificUpdate('budgetAgent'),
      borderColor: 'border-l-green-500'
    },
    {
      id: 'reportingAgent',
      title: 'Reporting Agent',
      icon: <BarChart3 className="w-6 h-6" />,
      iconBg: 'bg-purple-500',
      efficiency: '98%',
      status: 'ACTIVE',
      description: getRoleSpecificDescription('reportingAgent'),
      latestUpdate: getRoleSpecificUpdate('reportingAgent'),
      borderColor: 'border-l-purple-500'
    }
  ];

  function getRoleSpecificDescription(agentId: string): string {
    const roleDescriptions = {
      GUEST: {
        researchAgent: 'Preview: Analyzing venue crowd reports and trends',
        budgetAgent: 'Preview: Tracking operational expenses and costs',
        reportingAgent: 'Preview: Processing check-in verifications'
      },
      RUNNER: {
        researchAgent: 'Analyzing venue crowd reports and trends',
        budgetAgent: 'Tracking operational expenses and costs',
        reportingAgent: 'Processing check-in verifications'
      },
      CLIENT: {
        researchAgent: 'Analyzing service preferences and trends',
        budgetAgent: 'Tracking booking costs and budgets',
        reportingAgent: 'Generating client analytics reports'
      },
      OPERATIONS: {
        researchAgent: 'Analyzing operational efficiency metrics',
        budgetAgent: 'Tracking overall business performance',
        reportingAgent: 'Generating comprehensive operational reports'
      },
      PARTNER: {
        researchAgent: 'Analyzing partnership opportunities and trends',
        budgetAgent: 'Tracking collaboration costs and budgets',
        reportingAgent: 'Generating partnership performance reports'
      },
      ADMIN: {
        researchAgent: 'Analyzing system-wide metrics and trends',
        budgetAgent: 'Tracking overall system performance',
        reportingAgent: 'Generating comprehensive system reports'
      }
    };

    return roleDescriptions[currentRole]?.[agentId as keyof typeof roleDescriptions[typeof currentRole]] || 
           'Processing data and generating insights';
  }

  function getRoleSpecificUpdate(agentId: string): string {
    const roleUpdates = {
      GUEST: {
        researchAgent: 'Preview: 529 Bar trending up - expect higher crowd tonight.',
        budgetAgent: 'Preview: $15 under budget this week - great job!',
        reportingAgent: 'Preview: All recent check-ins verified successfully.'
      },
      RUNNER: {
        researchAgent: '529 Bar trending up - expect higher crowd tonight.',
        budgetAgent: '$15 under budget this week - great job!',
        reportingAgent: 'All recent check-ins verified successfully.'
      },
      CLIENT: {
        researchAgent: 'Service preferences analyzed - VIP package recommended.',
        budgetAgent: 'Booking costs optimized - 12% savings achieved.',
        reportingAgent: 'Client satisfaction metrics updated - 94% positive feedback.'
      },
      OPERATIONS: {
        researchAgent: 'Operational efficiency improved by 8% this week.',
        budgetAgent: 'Overall business performance tracking - revenue up 15%.',
        reportingAgent: 'Comprehensive operational report generated successfully.'
      },
      PARTNER: {
        researchAgent: 'Partnership opportunities identified - 3 new collaborations possible.',
        budgetAgent: 'Collaboration costs optimized - 18% savings achieved.',
        reportingAgent: 'Partnership performance metrics updated - 96% success rate.'
      },
      ADMIN: {
        researchAgent: 'System-wide metrics analyzed - overall performance up 12%.',
        budgetAgent: 'System performance tracking - all systems operational.',
        reportingAgent: 'Comprehensive system report generated successfully.'
      }
    };

    return roleUpdates[currentRole]?.[agentId as keyof typeof roleUpdates[typeof currentRole]] || 
           'Agent is processing data and generating insights';
  }

  const getGridLayout = () => {
    switch (roleConfig.dashboardLayout) {
      case 'grid-1x3':
        return 'grid-cols-1 lg:grid-cols-3';
      case 'grid-2x2':
        return 'grid-cols-1 lg:grid-cols-2';
      case 'grid-3x2':
        return 'grid-cols-1 lg:grid-cols-3';
      case 'grid-3x3':
        return 'grid-cols-1 lg:grid-cols-3';
      default:
        return 'grid-cols-1 lg:grid-cols-3';
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Agent Dashboard</h1>
          <p className="text-gray-400">AI-Powered Nightlife Operations - {currentRole} Role</p>
          <p className="text-gray-500 text-sm mt-1">Role automatically assigned by system administrator</p>
        </div>

        {/* Agent Cards Section */}
        <div className={`grid ${getGridLayout()} gap-6 mb-12`}>
          {agents.map((agent) => {
            const observation = agentObservations[agent.id];
            const isPriority = observation?.priority === 'high';
            
            return (
              <div 
                key={agent.id} 
                className={`bg-gray-800 rounded-lg p-6 border border-gray-700 transition-all duration-300 ${
                  isPriority ? 'border-blue-500 shadow-lg shadow-blue-500/20' : ''
                }`}
                data-agent={agent.id}
                data-feature={agent.id.replace('Agent', '').toLowerCase()}
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
                  <span className={`inline-block text-white text-xs px-2 py-1 rounded font-medium ${
                    isPriority ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {isPriority ? 'PRIORITY' : agent.status}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{agent.description}</p>
                
                <div className={`bg-gray-700 rounded-lg p-3 border-l-4 ${agent.borderColor}`}>
                  <p className="text-white text-sm">{agent.latestUpdate}</p>
                </div>
              </div>
            );
          })}
          
          {/* UI Agent Card */}
          <UIAgentCard />
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Role Features Section */}
        <div className="mb-8">
          <RoleFeatures />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard; 