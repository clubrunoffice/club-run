import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  DollarSign, 
  BarChart3,
  Music,
  Users,
  Settings,
  Shield,
  Zap,
  Activity,
  Play,
  Pause,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/PrivyAuthContext';
import { useRBAC } from '../contexts/RBACContext';
import { pqcSecurity } from '../services/pqc/PQCSecurityService';
import { langGraphWorkflow, WorkflowState, AgentNode } from '../services/langgraph/LangGraphWorkflowService';
import { djVerificationService, VerificationRequest } from '../services/verification/DJVerificationService';
import DJVerificationButton from '../components/verification/DJVerificationButton';
import './AgentDashboard.css';

interface EnhancedAgent {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  efficiency: string;
  status: 'ACTIVE' | 'SECURE' | 'QUANTUM' | 'PREVIEW';
  description: string;
  latestUpdate: string;
  borderColor: string;
  securityLevel: string;
  workflowId?: string;
  pqcEnabled: boolean;
}

const EnhancedAgentDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user, hasRole, getCurrentTheme } = useRBAC();
  const theme = getCurrentTheme();

  // Admin-only access control
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Shield className="w-16 h-16 mx-auto text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
          <p className="text-gray-300 mb-6">
            This dashboard is restricted to administrators only. Only users with ADMIN role can view the complete agent system.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // State management
  const [agents, setAgents] = useState<EnhancedAgent[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowState[]>([]);
  const [agentNodes, setAgentNodes] = useState<AgentNode[]>([]);
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [workflowStats, setWorkflowStats] = useState<any>(null);
  const [agentStats, setAgentStats] = useState<any>(null);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowState | null>(null);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);

  // Initialize enhanced agents with PQC security and LangGraph workflows
  const initializeEnhancedAgents = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setAgents([
        {
          id: 'previewAgent',
          title: 'Preview Agent',
          icon: <Search className="w-6 h-6" />,
          iconBg: 'bg-gray-500',
          efficiency: 'Preview',
          status: 'PREVIEW',
          description: 'Preview: Explore Club Run platform features with quantum security',
          latestUpdate: 'Preview: Sign up to access real AI agents with PQC protection',
          borderColor: 'border-l-gray-500',
          securityLevel: 'Standard',
          pqcEnabled: false
        }
      ]);
      return;
    }

    const baseAgents = getRoleAgents();
    const enhancedAgents: EnhancedAgent[] = [];

    for (const agent of baseAgents) {
      // Create secure workflow for each agent
      let workflowId: string | undefined;
      if (isSecurityEnabled) {
        try {
          const workflowTemplate = getWorkflowTemplateForAgent(agent.id);
          const workflow = await langGraphWorkflow.createWorkflow(workflowTemplate, {
            name: `${agent.title} Workflow`,
            description: `Secure workflow for ${agent.title}`,
            priority: 'high'
          });
          workflowId = workflow.id;
        } catch (error) {
          console.error(`Failed to create workflow for ${agent.id}:`, error);
        }
      }

      // Secure agent communication with PQC
      let secureUpdate = agent.latestUpdate;
      if (isSecurityEnabled && workflowId) {
        try {
          const secureMessage = await pqcSecurity.secureAgentCommunication(agent.id, {
            update: agent.latestUpdate,
            timestamp: Date.now()
          });
          secureUpdate = `🔐 Quantum-Secured: ${agent.latestUpdate}`;
        } catch (error) {
          console.error(`Failed to secure communication for ${agent.id}:`, error);
        }
      }

      enhancedAgents.push({
        ...agent,
        status: isSecurityEnabled ? 'QUANTUM' : 'ACTIVE',
        description: isSecurityEnabled 
          ? `${agent.description} (Quantum-Resistant Security Enabled)`
          : agent.description,
        latestUpdate: secureUpdate,
        securityLevel: isSecurityEnabled ? 'Quantum-Resistant Level 3+' : 'Standard',
        workflowId,
        pqcEnabled: isSecurityEnabled
      });
    }

    setAgents(enhancedAgents);
  }, [isAuthenticated, user, isSecurityEnabled]);

  // Get workflow template based on agent type
  const getWorkflowTemplateForAgent = (agentId: string): 'musicCuration' | 'missionManagement' | 'teamCoordination' => {
    if (agentId.includes('music') || agentId.includes('playlist') || agentId.includes('library')) {
      return 'musicCuration';
    } else if (agentId.includes('mission') || agentId.includes('p2p') || agentId.includes('budget')) {
      return 'missionManagement';
    } else if (agentId.includes('team') || agentId.includes('collab') || agentId.includes('project')) {
      return 'teamCoordination';
    }
    return 'musicCuration'; // Default
  };

  // Role-based agents (enhanced version)
  const getRoleAgents = (): any[] => {
    if (!isAuthenticated || !user) {
      return [];
    }

    // ADMIN sees ALL agents from all roles
    if (user.role === 'ADMIN') {
      return [
        // Platform Guide Agent (GUEST)
        {
          id: 'platformGuideAgent',
          title: 'Platform Guide Agent',
          icon: <Eye className="w-6 h-6" />,
          iconBg: 'bg-gray-500',
          efficiency: '100%',
          status: 'ACTIVE',
          description: 'Helps guests explore Club Run features and benefits',
          latestUpdate: 'Guiding new users - 45 active explorers',
          borderColor: 'border-l-gray-500',
          role: 'GUEST'
        },
        // Music Curation Agent (DJ)
        {
          id: 'musicCurationAgent',
          title: 'Music Curation Agent',
          icon: <Music className="w-6 h-6" />,
          iconBg: 'bg-blue-500',
          efficiency: '95%',
          status: 'ACTIVE',
          description: 'Assists DJs with music submissions and playlist management',
          latestUpdate: '24 new submissions received - 3 high priority',
          borderColor: 'border-l-blue-500',
          role: 'DJ'
        },
        // Enhanced Music Agent (VERIFIED_DJ)
        {
          id: 'enhancedMusicAgent',
          title: 'Enhanced Music Agent',
          icon: <Music className="w-6 h-6" />,
          iconBg: 'bg-green-500',
          efficiency: '98%',
          status: 'ACTIVE',
          description: 'Advanced music curation with Serato integration',
          latestUpdate: '8 Serato libraries synced - 1,892 tracks analyzed',
          borderColor: 'border-l-green-500',
          role: 'VERIFIED_DJ'
        },
        // Mission Management Agent (CLIENT)
        {
          id: 'missionManagementAgent',
          title: 'Mission Management Agent',
          icon: <Search className="w-6 h-6" />,
          iconBg: 'bg-purple-500',
          efficiency: '92%',
          status: 'ACTIVE',
          description: 'Helps clients create and manage missions',
          latestUpdate: '15 missions created - 7 active, 4 completed',
          borderColor: 'border-l-purple-500',
          role: 'CLIENT'
        },
        // Team Coordination Agent (CURATOR)
        {
          id: 'teamCoordinationAgent',
          title: 'Team Coordination Agent',
          icon: <Users className="w-6 h-6" />,
          iconBg: 'bg-orange-500',
          efficiency: '96%',
          status: 'ACTIVE',
          description: 'Manages team collaboration and project coordination',
          latestUpdate: '5 teams coordinated - 12 projects tracked',
          borderColor: 'border-l-orange-500',
          role: 'CURATOR'
        },
        // System Operations Agent (OPERATIONS)
        {
          id: 'systemOperationsAgent',
          title: 'System Operations Agent',
          icon: <Activity className="w-6 h-6" />,
          iconBg: 'bg-red-500',
          efficiency: '99%',
          status: 'ACTIVE',
          description: 'Monitors platform health and manages system operations',
          latestUpdate: 'System health: 99.8% uptime - All services optimal',
          borderColor: 'border-l-red-500',
          role: 'OPERATIONS'
        },
        // Business Intelligence Agent (PARTNER)
        {
          id: 'businessIntelligenceAgent',
          title: 'Business Intelligence Agent',
          icon: <BarChart3 className="w-6 h-6" />,
          iconBg: 'bg-cyan-500',
          efficiency: '94%',
          status: 'ACTIVE',
          description: 'Provides business analytics and partnership insights',
          latestUpdate: 'Analytics: Revenue +25%, User growth +40%',
          borderColor: 'border-l-cyan-500',
          role: 'PARTNER'
        },
        // System Administration Agent (ADMIN)
        {
          id: 'systemAdministrationAgent',
          title: 'System Administration Agent',
          icon: <Shield className="w-6 h-6" />,
          iconBg: 'bg-red-600',
          efficiency: '100%',
          status: 'ACTIVE',
          description: 'Complete system control and oversight',
          latestUpdate: 'Full system access - All controls operational',
          borderColor: 'border-l-red-600',
          role: 'ADMIN'
        },
        // Research Agent (All roles)
        {
          id: 'researchAgent',
          title: 'Research Agent',
          icon: <Search className="w-6 h-6" />,
          iconBg: 'bg-indigo-500',
          efficiency: '97%',
          status: 'ACTIVE',
          description: 'Market research and trend analysis',
          latestUpdate: '42 trends identified - 8 actionable insights',
          borderColor: 'border-l-indigo-500',
          role: 'ALL'
        },
        // Reporting Agent (All roles)
        {
          id: 'reportingAgent',
          title: 'Reporting Agent',
          icon: <BarChart3 className="w-6 h-6" />,
          iconBg: 'bg-teal-500',
          efficiency: '98%',
          status: 'ACTIVE',
          description: 'Automated reporting and analytics',
          latestUpdate: '156 reports generated - 23 scheduled',
          borderColor: 'border-l-teal-500',
          role: 'ALL'
        }
      ];
    }

    // Role-specific agents for non-admin users
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
            description: 'Analyzing music submissions and trends with quantum security',
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
            description: 'Managing playlist recommendations with LangGraph workflows',
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
            description: 'Organizing music library and metadata with PQC protection',
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
            description: 'Managing mission creation and tracking with quantum security',
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
            description: 'Coordinating P2P collaborations with LangGraph workflows',
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
            description: 'Tracking mission expenses and payments with PQC protection',
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
            description: 'Managing team coordination and projects with quantum security',
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
            description: 'Optimizing collaboration workflows with LangGraph',
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
            description: 'Coordinating project timelines with PQC protection',
            latestUpdate: '3 projects in progress - 2 completed',
            borderColor: 'border-l-blue-500'
          }
        ];
      
      case 'OPERATIONS':
        return [
          {
            id: 'userAgent',
            title: 'User Management Agent',
            icon: <Users className="w-6 h-6" />,
            iconBg: 'bg-red-500',
            efficiency: '99%',
            status: 'ACTIVE',
            description: 'Managing user verification and roles with quantum security',
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
            description: 'Monitoring platform performance with LangGraph workflows',
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
            description: 'Processing system analytics with PQC protection',
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
            description: 'Managing general platform activities with quantum security',
            latestUpdate: 'Platform overview - All systems normal',
            borderColor: 'border-l-gray-500'
          }
        ];
    }
  };

  // Initialize dashboard
  useEffect(() => {
    initializeEnhancedAgents();
    updateStats();
  }, [initializeEnhancedAgents]);

  // Update statistics
  const updateStats = useCallback(() => {
    setSecurityStatus(pqcSecurity.getSecurityStatus());
    setWorkflowStats(langGraphWorkflow.getWorkflowStats());
    setAgentStats(langGraphWorkflow.getAgentStats());
    setAgentNodes(langGraphWorkflow.getAllAgents());
    setWorkflows(langGraphWorkflow.getAllWorkflows());
  }, []);

  // Toggle security
  const toggleSecurity = useCallback(async () => {
    setIsSecurityEnabled(!isSecurityEnabled);
    await initializeEnhancedAgents();
  }, [isSecurityEnabled, initializeEnhancedAgents]);

  // Execute workflow
  const executeWorkflow = useCallback(async (workflowId: string) => {
    try {
      setIsWorkflowRunning(true);
      const workflow = await langGraphWorkflow.executeWorkflow(workflowId);
      setSelectedWorkflow(workflow);
      updateStats();
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    } finally {
      setIsWorkflowRunning(false);
    }
  }, [updateStats]);

  // Refresh dashboard
  const refreshDashboard = useCallback(async () => {
    await initializeEnhancedAgents();
    updateStats();
  }, [initializeEnhancedAgents, updateStats]);

  // Handle verification update
  const handleVerificationUpdate = useCallback((request: VerificationRequest) => {
    setVerificationRequest(request);
    // Refresh dashboard to update agent status
    setTimeout(() => {
      refreshDashboard();
    }, 1000);
  }, [refreshDashboard]);

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Hero Header with Security Status */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mr-4">
                Complete AI Agent System
              </h1>
              {isSecurityEnabled && (
                <div className="flex items-center bg-green-600 bg-opacity-20 border border-green-400 rounded-lg px-3 py-1">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-400 text-sm font-semibold">PQC SECURE</span>
                </div>
              )}
            </div>
            <p className="text-xl text-gray-300 mb-4">
              Administrator View: All 10 Working AI Agents with Quantum Security & LangGraph Workflows
            </p>
            <p className="text-gray-400 text-lg">
              Complete system overview with role-based AI agents and LangGraph orchestration
            </p>
          
            {/* Security Controls */}
            {isAuthenticated && (
              <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 border border-blue-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={toggleSecurity}
                      className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                        isSecurityEnabled 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {isSecurityEnabled ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                      {isSecurityEnabled ? 'Quantum Security ON' : 'Quantum Security OFF'}
                    </button>
                    <button
                      onClick={refreshDashboard}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                    <button
                      onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      {showSecurityDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      Security Details
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {securityStatus?.securityLevel || 'Standard'}
                    </div>
                    <div className="text-blue-100 text-sm">
                      {securityStatus?.activeSessions || 0} active sessions
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DJ Verification Section */}
            {isAuthenticated && user && (user.role === 'DJ' || user.role === 'VERIFIED_DJ') && (
              <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 border border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">DJ Verification Status</h3>
                    <p className="text-green-100 text-sm">
                      {user.role === 'VERIFIED_DJ' 
                        ? 'You are a verified DJ with enhanced features and Serato integration.'
                        : 'Upgrade to Verified DJ for enhanced features and Serato integration.'
                      }
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <DJVerificationButton
                      userId={user.id}
                      userRole={user.role}
                      userEmail={user.email}
                      onVerificationUpdate={handleVerificationUpdate}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sign-up prompt for guests */}
            {!isAuthenticated && (
              <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 border border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Experience the Full Power</h3>
                    <p className="text-blue-100 mb-4">
                      You're viewing a preview of the Enhanced Agent Dashboard. Sign up to access real-time data, 
                      personalized insights, quantum security, and full AI agent functionality with LangGraph workflows.
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

      {/* Security Details Panel */}
      {showSecurityDetails && isAuthenticated && (
        <section className="py-8 bg-gray-900 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <h3 className="text-white font-semibold">Security Status</h3>
                </div>
                <p className="text-gray-300 text-sm">{securityStatus?.securityLevel}</p>
                <p className="text-gray-400 text-xs">{securityStatus?.algorithms?.join(', ')}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-white font-semibold">Active Sessions</h3>
                </div>
                <p className="text-gray-300 text-sm">{securityStatus?.activeSessions || 0}</p>
                <p className="text-gray-400 text-xs">Secure connections</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-purple-400 mr-2" />
                  <h3 className="text-white font-semibold">Workflows</h3>
                </div>
                <p className="text-gray-300 text-sm">{workflowStats?.total || 0}</p>
                <p className="text-gray-400 text-xs">{workflowStats?.running || 0} running</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-amber-400 mr-2" />
                  <h3 className="text-white font-semibold">Agents</h3>
                </div>
                <p className="text-gray-300 text-sm">{agentStats?.total || 0}</p>
                <p className="text-gray-400 text-xs">{agentStats?.available || 0} available</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Agent Cards Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Enhanced AI Agent Overview
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your personalized AI agents are working behind the scenes with quantum-resistant security and LangGraph workflows.
            </p>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-700 cursor-pointer hover:scale-105 relative overflow-hidden"
              >
                {/* Security Badge */}
                {agent.pqcEnabled && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    PQC
                  </div>
                )}

                {/* Workflow Status */}
                {agent.workflowId && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    LangGraph
                  </div>
                )}

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
                  <span className={`inline-block text-white text-xs px-2 py-1 rounded font-medium ${
                    agent.status === 'QUANTUM' ? 'bg-green-600' :
                    agent.status === 'SECURE' ? 'bg-blue-600' :
                    agent.status === 'ACTIVE' ? 'bg-purple-600' : 'bg-gray-600'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{agent.description}</p>
                <div className="text-blue-400 font-medium mb-2">{agent.efficiency} Efficiency</div>
                <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500 mb-4">
                  <p className="text-white text-sm">{agent.latestUpdate}</p>
                </div>
                
                {/* Security Level */}
                <div className="text-xs text-gray-400 mb-2">
                  Security: {agent.securityLevel}
                </div>

                {/* Workflow Controls */}
                {agent.workflowId && isAuthenticated && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => executeWorkflow(agent.workflowId!)}
                      disabled={isWorkflowRunning}
                      className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Execute
                    </button>
                    <button
                      onClick={() => setSelectedWorkflow(workflows.find(w => w.id === agent.workflowId) || null)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Execution Status */}
      {selectedWorkflow && (
        <section className="py-8 bg-black border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Workflow: {selectedWorkflow.metadata.name}</h3>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Status: <span className={`font-semibold ${
                    selectedWorkflow.status === 'completed' ? 'text-green-400' :
                    selectedWorkflow.status === 'running' ? 'text-blue-400' :
                    selectedWorkflow.status === 'failed' ? 'text-red-400' : 'text-gray-400'
                  }`}>{selectedWorkflow.status.toUpperCase()}</span></p>
                  <p className="text-gray-300 text-sm mb-2">Current Step: {selectedWorkflow.currentStep}</p>
                  <p className="text-gray-300 text-sm">Created: {selectedWorkflow.createdAt.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Steps:</h4>
                  <div className="space-y-1">
                    {selectedWorkflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center text-sm">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          step.status === 'completed' ? 'bg-green-400' :
                          step.status === 'running' ? 'bg-blue-400' :
                          step.status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-gray-300">{step.name}</span>
                        <span className={`ml-auto text-xs ${
                          step.status === 'completed' ? 'text-green-400' :
                          step.status === 'running' ? 'text-blue-400' :
                          step.status === 'failed' ? 'text-red-400' : 'text-gray-400'
                        }`}>{step.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Quick Actions Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          {isAuthenticated ? (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Enhanced Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Check-in', icon: <Activity className="w-4 h-4" /> },
                  { name: 'Expense', icon: <DollarSign className="w-4 h-4" /> },
                  { name: 'Missions', icon: <Search className="w-4 h-4" /> },
                  { name: 'Reports', icon: <BarChart3 className="w-4 h-4" /> }
                ].map((action) => (
                  <button
                    key={action.name}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                  >
                    {action.icon}
                    <span className="ml-2">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Enhanced Quick Actions</h3>
              <p className="text-gray-300 mb-4">Sign up to access powerful quick actions with quantum security.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Check-in', icon: <Activity className="w-4 h-4" /> },
                  { name: 'Expense', icon: <DollarSign className="w-4 h-4" /> },
                  { name: 'Missions', icon: <Search className="w-4 h-4" /> },
                  { name: 'Reports', icon: <BarChart3 className="w-4 h-4" /> }
                ].map((action) => (
                  <div key={action.name} className="bg-gray-700 rounded-lg p-4 text-center opacity-50">
                    <div className="flex items-center justify-center text-gray-500 text-sm">
                      {action.icon}
                      <span className="ml-2">{action.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Role Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Enhanced Role-Specific Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get personalized features based on your role and permissions with quantum security and LangGraph workflows.
            </p>
          </div>
          {isAuthenticated ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { name: 'Runner', features: ['Mission Execution', 'Check-ins', 'Expense Tracking'] },
                { name: 'Client', features: ['Mission Creation', 'P2P Management', 'Payment Processing'] },
                { name: 'Operations', features: ['User Management', 'System Analytics', 'Security Monitoring'] }
              ].map((role, index) => (
                <div key={role.name} className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-700 cursor-pointer hover:scale-105">
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
                  <h3 className="text-xl font-semibold mb-3 text-white">{role.name} Features</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center">
                        <Shield className="w-3 h-3 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { name: 'Runner', features: ['Mission Execution', 'Check-ins', 'Expense Tracking'] },
                { name: 'Client', features: ['Mission Creation', 'P2P Management', 'Payment Processing'] },
                { name: 'Operations', features: ['User Management', 'System Analytics', 'Security Monitoring'] }
              ].map((role, index) => (
                <div key={role.name} className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 opacity-50">
                  <div className={`mb-4 flex justify-center ${
                    index === 0 ? 'text-gray-400' : 
                    index === 1 ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    <div className="p-3 rounded-lg bg-gray-600 bg-opacity-20">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-400">{role.name} Features</h3>
                  <p className="text-gray-500">Sign up to access role-specific tools with quantum security</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EnhancedAgentDashboard;
