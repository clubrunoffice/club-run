import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../contexts/RBACContext';
import { PermissionGate } from '../RoleBasedUI';
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  Clock, 
  XCircle,
  User,
  Activity,
  BarChart3,
  Filter,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react';
import { pqcSecurity } from '../../services/pqc/PQCSecurityService';
import { langGraphWorkflow } from '../../services/langgraph/LangGraphWorkflowService';
import DJServicePackModal from '../missions/DJServicePackModal';
import { DJServicePack } from '../missions/DJServicePackSelector';

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  missionId: string;
  missionTitle: string;
  missionBudget: number;
  missionPerDiem: number;
  missionDuration: number; // in days
  agentId: string;
  agentName: string;
  agentRole: string;
  receipt?: string;
  location?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  isWithinPerDiem: boolean;
  perDiemRemaining: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastActive: string;
  totalExpenses: number;
  averageExpense: number;
  missionsCompleted: number;
  rating: number;
}

interface ExpenseAnalytics {
  totalExpenses: number;
  pendingExpenses: number;
  approvedExpenses: number;
  rejectedExpenses: number;
  monthlyTrend: number;
  withinPerDiemCount: number;
  exceedsPerDiemCount: number;
  totalPerDiemBudget: number;
  totalPerDiemUsed: number;
  topCategories: Array<{ category: string; amount: number; count: number }>;
  agentPerformance: Array<{ agentId: string; agentName: string; totalAmount: number; count: number }>;
  missionPerformance: Array<{ missionId: string; missionTitle: string; totalExpenses: number; perDiemUtilization: number }>;
}

const DynamicPayoutSystem: React.FC = () => {
  const { user, isAuthenticated, hasPermission, getCurrentTheme } = useRBAC();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    agent: 'all',
    dateRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'analytics'>('list');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [pqcSession, setPqcSession] = useState<any>(null);
  const [workflowState, setWorkflowState] = useState<any>(null);
  const [servicePackModal, setServicePackModal] = useState<{
    isOpen: boolean;
    servicePack: DJServicePack | null;
    missionId: string | null;
  }>({
    isOpen: false,
    servicePack: null,
    missionId: null
  });
  
  const theme = getCurrentTheme();

  // Initialize PQC security and LangGraph workflow
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        // Create secure session for expense management
        const session = await pqcSecurity.createSecureSession('expense-management');
        setPqcSession(session);
        
        // Initialize expense analysis workflow
        const workflow = await langGraphWorkflow.createWorkflow('missionManagement', {
          name: 'Expense Management Workflow',
          description: 'AI-powered expense tracking and agent correlation',
          version: '1.0.0',
          author: user?.name || 'System',
          tags: ['expenses', 'agents', 'analytics'],
          priority: 'high'
        });
        setWorkflowState(workflow);
      } catch (error) {
        console.error('Security initialization error:', error);
      }
    };

    if (isAuthenticated && user) {
      initializeSecurity();
    }
  }, [isAuthenticated, user]);

  // Mock data for demonstration - Only essential mission expenses
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        title: 'Parking Fee',
        description: 'Parking at Downtown Convention Center for corporate event',
        amount: 25,
        category: 'Parking',
        status: 'approved',
        submittedAt: '2024-01-15',
        missionId: 'mission-1',
        missionTitle: 'Corporate Event DJ Setup',
        missionBudget: 2000,
        missionPerDiem: 200,
        missionDuration: 3,
        agentId: 'agent-1',
        agentName: 'Alex Johnson',
        agentRole: 'RUNNER',
        location: 'Downtown Convention Center',
        tags: ['parking', 'venue'],
        priority: 'medium',
        approvedBy: 'Sarah Manager',
        approvedAt: '2024-01-16',
        notes: 'Approved - standard parking fee for venue',
        isWithinPerDiem: true,
        perDiemRemaining: 175
      },
      {
        id: '2',
        title: 'Gas Money',
        description: 'Fuel for travel to and from wedding venue',
        amount: 35,
        category: 'Gas',
        status: 'pending',
        submittedAt: '2024-01-16',
        missionId: 'mission-2',
        missionTitle: 'Wedding Reception DJ',
        missionBudget: 1500,
        missionPerDiem: 150,
        missionDuration: 1,
        agentId: 'agent-2',
        agentName: 'Maria Garcia',
        agentRole: 'RUNNER',
        location: 'Grand Hotel Ballroom',
        tags: ['gas', 'transportation'],
        priority: 'medium',
        isWithinPerDiem: true,
        perDiemRemaining: 115
      },
      {
        id: '3',
        title: 'Food Expense',
        description: 'Lunch during 8-hour club night performance',
        amount: 18,
        category: 'Food',
        status: 'approved',
        submittedAt: '2024-01-14',
        missionId: 'mission-3',
        missionTitle: 'Club Night DJ Performance',
        missionBudget: 800,
        missionPerDiem: 100,
        missionDuration: 2,
        agentId: 'agent-3',
        agentName: 'DJ Mike',
        agentRole: 'RUNNER',
        location: 'Club XYZ',
        tags: ['food', 'meal'],
        priority: 'low',
        approvedBy: 'John Admin',
        approvedAt: '2024-01-15',
        isWithinPerDiem: true,
        perDiemRemaining: 82
      },
      {
        id: '4',
        title: 'Venue Cover Charge',
        description: 'Entry fee for Beach Club DJ performance',
        amount: 30,
        category: 'Venue Cover',
        status: 'approved',
        submittedAt: '2024-01-13',
        missionId: 'mission-4',
        missionTitle: 'Beach Club DJ Set',
        missionBudget: 1200,
        missionPerDiem: 120,
        missionDuration: 1,
        agentId: 'agent-1',
        agentName: 'Alex Johnson',
        agentRole: 'RUNNER',
        location: 'Beach Club',
        tags: ['venue', 'cover'],
        priority: 'high',
        approvedBy: 'Manager',
        approvedAt: '2024-01-14',
        notes: 'Approved - standard venue cover charge',
        isWithinPerDiem: true,
        perDiemRemaining: 90
      },
      {
        id: '5',
        title: 'Parking at Club',
        description: 'Parking fee for club night performance',
        amount: 15,
        category: 'Parking',
        status: 'pending',
        submittedAt: '2024-01-17',
        missionId: 'mission-3',
        missionTitle: 'Club Night DJ Performance',
        missionBudget: 800,
        missionPerDiem: 100,
        missionDuration: 2,
        agentId: 'agent-3',
        agentName: 'DJ Mike',
        agentRole: 'RUNNER',
        location: 'Club XYZ',
        tags: ['parking', 'club'],
        priority: 'low',
                isWithinPerDiem: true,
        perDiemRemaining: 67
      }
    ];

    const mockAgents: Agent[] = [
      {
        id: 'agent-1',
        name: 'Alex Johnson',
        role: 'RUNNER',
        status: 'online',
        lastActive: '2024-01-16T10:30:00Z',
        totalExpenses: 270,
        averageExpense: 135,
        missionsCompleted: 15,
        rating: 4.8
      },
      {
        id: 'agent-2',
        name: 'Maria Garcia',
        role: 'DJ',
        status: 'busy',
        lastActive: '2024-01-16T09:15:00Z',
        totalExpenses: 45,
        averageExpense: 45,
        missionsCompleted: 8,
        rating: 4.6
      },
      {
        id: 'agent-3',
        name: 'DJ Mike',
        role: 'DJ',
        status: 'offline',
        lastActive: '2024-01-15T22:00:00Z',
        totalExpenses: 75,
        averageExpense: 75,
        missionsCompleted: 12,
        rating: 4.9
      }
    ];

    const mockAnalytics: ExpenseAnalytics = {
      totalExpenses: 390,
      pendingExpenses: 45,
      approvedExpenses: 225,
      rejectedExpenses: 120,
      monthlyTrend: 12.5,
      withinPerDiemCount: 3,
      exceedsPerDiemCount: 1,
      totalPerDiemBudget: 570,
      totalPerDiemUsed: 390,
      topCategories: [
        { category: 'Parking', amount: 40, count: 2 },
        { category: 'Gas', amount: 35, count: 1 },
        { category: 'Food', amount: 18, count: 1 },
        { category: 'Venue Cover', amount: 30, count: 1 }
      ],
      agentPerformance: [
        { agentId: 'agent-1', agentName: 'Alex Johnson', totalAmount: 55, count: 2 },
        { agentId: 'agent-3', agentName: 'DJ Mike', totalAmount: 33, count: 2 },
        { agentId: 'agent-2', agentName: 'Maria Garcia', totalAmount: 35, count: 1 }
      ],
      missionPerformance: [
        { missionId: 'mission-1', missionTitle: 'Corporate Event DJ Setup', totalExpenses: 25, perDiemUtilization: 12.5 },
        { missionId: 'mission-2', missionTitle: 'Wedding Reception DJ', totalExpenses: 35, perDiemUtilization: 23.3 },
        { missionId: 'mission-3', missionTitle: 'Club Night DJ Performance', totalExpenses: 33, perDiemUtilization: 33 },
        { missionId: 'mission-4', missionTitle: 'Beach Club DJ Set', totalExpenses: 30, perDiemUtilization: 25 }
      ]
    };

    setTimeout(() => {
      setExpenses(mockExpenses);
      setAgents(mockAgents);
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'parking':
        return '🅿️';
      case 'gas':
        return '⛽';
      case 'food':
        return '🍕';
      case 'venue cover':
        return '🎫';
      default:
        return '💰';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPerDiemStatusColor = (isWithinPerDiem: boolean) => {
    return isWithinPerDiem ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getPerDiemStatusIcon = (isWithinPerDiem: boolean) => {
    return isWithinPerDiem ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const getServicePackForMission = (missionId: string): DJServicePack | null => {
    // Mock service pack mapping - in real app, this would come from the mission data
    const servicePackMap: Record<string, DJServicePack> = {
      'mission-1': {
        id: 'professional',
        name: 'Professional DJ Package',
        price: 450,
        priceRange: '$400-500',
        duration: 6,
        includes: ['Professional DJ', 'Premium Sound System', '6 Hours of Music', 'LED Lighting Rig', 'MC Services', 'Custom Playlist'],
        equipment: ['High-end sound system (4 speakers)', 'LED lighting rig', 'Wireless microphones (2)', 'Fog machine', 'DJ controller', 'Custom playlist creation'],
        features: ['Professional DJ service', 'Premium sound system', '6 hours of continuous music', 'Advanced lighting effects', 'MC services included', 'Custom playlist creation', 'Fog machine effects'],
        perDiem: 450,
        maxGuests: 200,
        setupTime: 45,
        breakdownTime: 45,
        insurance: true,
        backupEquipment: true,
        customPlaylist: true,
        mcServices: true,
        photoBooth: false,
        liveStreaming: false,
        lightingDesign: false,
        fogMachine: true,
        wirelessMics: 2,
        speakers: '4x 1500W Speakers',
        subwoofers: true,
        djBooth: true,
        rating: 4.6,
        reviews: 128,
        popular: true,
        recommended: true
      },
      'mission-2': {
        id: 'premium',
        name: 'Premium DJ Package',
        price: 750,
        priceRange: '$700-800',
        duration: 8,
        includes: ['Professional DJ', 'Premium Sound System', '8 Hours of Music', 'Advanced Lighting Design', 'MC Services', 'Custom Playlist', 'Photo Booth', 'Live Streaming'],
        equipment: ['Professional sound system (6 speakers)', 'Advanced lighting design', 'Wireless microphones (3)', 'Fog machine', 'Photo booth', 'Live streaming equipment', 'DJ controller', 'Custom playlist creation'],
        features: ['Professional DJ service', 'Premium sound system', '8 hours of continuous music', 'Advanced lighting design', 'MC services included', 'Custom playlist creation', 'Photo booth included', 'Live streaming capability', 'Fog machine effects'],
        perDiem: 750,
        maxGuests: 300,
        setupTime: 60,
        breakdownTime: 60,
        insurance: true,
        backupEquipment: true,
        customPlaylist: true,
        mcServices: true,
        photoBooth: true,
        liveStreaming: true,
        lightingDesign: true,
        fogMachine: true,
        wirelessMics: 3,
        speakers: '6x 2000W Speakers',
        subwoofers: true,
        djBooth: true,
        rating: 4.8,
        reviews: 89,
        popular: true,
        recommended: false
      },
      'mission-3': {
        id: 'starter',
        name: 'Starter DJ Package',
        price: 250,
        priceRange: '$200-300',
        duration: 4,
        includes: ['Professional DJ', 'Basic Sound System', '4 Hours of Music', 'Basic Lighting', 'Music Selection'],
        equipment: ['Professional sound system (2 speakers)', 'Basic LED lights', 'Wireless microphone', 'DJ controller', 'Music library access'],
        features: ['Professional DJ service', 'Basic sound system', '4 hours of continuous music', 'Basic lighting effects', 'Music selection from library'],
        perDiem: 250,
        maxGuests: 100,
        setupTime: 30,
        breakdownTime: 30,
        insurance: false,
        backupEquipment: false,
        customPlaylist: false,
        mcServices: false,
        photoBooth: false,
        liveStreaming: false,
        lightingDesign: false,
        fogMachine: false,
        wirelessMics: 1,
        speakers: '2x 1000W Speakers',
        subwoofers: false,
        djBooth: false,
        rating: 4.2,
        reviews: 45,
        popular: false,
        recommended: false
      },
      'mission-4': {
        id: 'luxury',
        name: 'Luxury DJ Package',
        price: 1200,
        priceRange: '$1000+',
        duration: 10,
        includes: ['Professional DJ', 'Luxury Sound System', '10 Hours of Music', 'Custom Lighting Design', 'MC Services', 'Custom Playlist', 'Photo Booth', 'Live Streaming', 'VIP Setup', 'Dedicated Sound Engineer'],
        equipment: ['Luxury sound system (8 speakers)', 'Custom lighting design', 'Wireless microphones (4)', 'Fog machine', 'Photo booth', 'Live streaming equipment', 'VIP setup', 'Dedicated sound engineer', 'DJ controller', 'Custom playlist creation'],
        features: ['Professional DJ service', 'Luxury sound system', '10 hours of continuous music', 'Custom lighting design', 'MC services included', 'Custom playlist creation', 'Photo booth included', 'Live streaming capability', 'VIP setup included', 'Dedicated sound engineer', 'Fog machine effects'],
        perDiem: 1200,
        maxGuests: 500,
        setupTime: 90,
        breakdownTime: 90,
        insurance: true,
        backupEquipment: true,
        customPlaylist: true,
        mcServices: true,
        photoBooth: true,
        liveStreaming: true,
        lightingDesign: true,
        fogMachine: true,
        wirelessMics: 4,
        speakers: '8x 2500W Speakers',
        subwoofers: true,
        djBooth: true,
        rating: 4.9,
        reviews: 67,
        popular: false,
        recommended: false
      }
    };
    
    return servicePackMap[missionId] || null;
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = filter.status === 'all' || expense.status === filter.status;
    const matchesCategory = filter.category === 'all' || expense.category === filter.category;
    const matchesAgent = filter.agent === 'all' || expense.agentId === filter.agent;
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.agentName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesAgent && matchesSearch;
  });

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowExpenseModal(true);
    
    // Find corresponding agent
    const agent = agents.find(a => a.id === expense.agentId);
    if (agent) {
      setSelectedAgent(agent);
    }
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentModal(true);
  };

  const handleApproveExpense = async (expenseId: string) => {
    try {
      // Simulate secure approval process
      if (pqcSession) {
        const secureMessage = await pqcSecurity.encryptData(
          JSON.stringify({ action: 'approve', expenseId, approver: user?.id }),
          pqcSession.keyPair.publicKey
        );
        console.log('Secure approval message:', secureMessage);
      }

      // Update expense status
      setExpenses(prev => prev.map(expense => 
        expense.id === expenseId 
          ? { ...expense, status: 'approved', approvedBy: user?.name, approvedAt: new Date().toISOString() }
          : expense
      ));

      // Execute workflow for expense approval
      if (workflowState) {
        await langGraphWorkflow.executeWorkflow(workflowState.id, {
          action: 'expense_approval',
          expenseId,
          approver: user?.id
        });
      }
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleRejectExpense = async (expenseId: string, reason: string) => {
    try {
      // Simulate secure rejection process
      if (pqcSession) {
        const secureMessage = await pqcSecurity.encryptData(
          JSON.stringify({ action: 'reject', expenseId, rejector: user?.id, reason }),
          pqcSession.keyPair.publicKey
        );
        console.log('Secure rejection message:', secureMessage);
      }

      // Update expense status
      setExpenses(prev => prev.map(expense => 
        expense.id === expenseId 
          ? { ...expense, status: 'rejected', notes: reason }
          : expense
      ));
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view expenses.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-white mt-4">Loading expense data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                <Zap className="inline-block w-12 h-12 mr-4 text-yellow-400" />
                Dynamic Expense Management
              </h1>
              <p className="text-xl text-gray-300">
                AI-powered expense tracking with agent correlation and quantum security
              </p>
            </div>
            <PermissionGate resource="expenses" action="create">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                <Plus className="w-5 h-5" />
                <span>Submit Expense</span>
              </button>
            </PermissionGate>
          </div>
        </div>
      </section>

      {/* Analytics Summary */}
      {analytics && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200">Total Expenses</p>
                    <p className="text-3xl font-bold">${analytics.totalExpenses}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200">Pending</p>
                    <p className="text-3xl font-bold">${analytics.pendingExpenses}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200">Approved</p>
                    <p className="text-3xl font-bold">${analytics.approvedExpenses}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200">Monthly Trend</p>
                    <p className="text-3xl font-bold">{analytics.monthlyTrend}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200">Within Per Diem</p>
                    <p className="text-3xl font-bold">{analytics.withinPerDiemCount}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200">Exceeds Per Diem</p>
                    <p className="text-3xl font-bold">{analytics.exceedsPerDiemCount}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-200">Per Diem Utilization</p>
                    <p className="text-3xl font-bold">{Math.round((analytics.totalPerDiemUsed / analytics.totalPerDiemBudget) * 100)}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Controls */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Equipment">Equipment</option>
                <option value="Transportation">Transportation</option>
                <option value="Licensing">Licensing</option>
                <option value="Food">Food</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`px-3 py-1 rounded ${viewMode === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  Analytics
                </button>
              </div>
              
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Expenses List */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  onClick={() => handleExpenseClick(expense)}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                                             <div>
                         <h3 className="text-lg font-semibold text-white">{expense.title}</h3>
                         <p className="text-gray-400">{expense.description}</p>
                         <div className="flex items-center space-x-4 mt-2">
                           <span className="text-sm text-gray-500">
                             <User className="inline w-4 h-4 mr-1" />
                             {expense.agentName} ({expense.agentRole})
                           </span>
                           <span className="text-sm text-gray-500">
                             📍 {expense.location}
                           </span>
                         </div>
                         <div className="mt-2">
                           <div className="flex items-center space-x-4">
                             <span className="text-sm text-blue-400 font-medium">
                               🎯 {expense.missionTitle}
                             </span>
                             <span className="text-sm text-gray-500">
                               Budget: ${expense.missionBudget} | Per Diem: ${expense.missionPerDiem}/day
                             </span>
                           </div>
                           <div className="mt-1">
                             <button 
                               className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const servicePack = getServicePackForMission(expense.missionId);
                                 if (servicePack) {
                                   setServicePackModal({
                                     isOpen: true,
                                     servicePack,
                                     missionId: expense.missionId
                                   });
                                 }
                               }}
                             >
                               🎵 View DJ Service Pack
                             </button>
                           </div>
                         </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">${expense.amount}</p>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                      </div>
                      
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        <span className="text-sm font-medium capitalize">{expense.status}</span>
                      </div>
                      
                                             {expense.priority && (
                         <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(expense.priority)}`}>
                           {expense.priority}
                         </div>
                       )}
                       <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getPerDiemStatusColor(expense.isWithinPerDiem)}`}>
                         {getPerDiemStatusIcon(expense.isWithinPerDiem)}
                         <span className="text-sm font-medium">
                           {expense.isWithinPerDiem ? 'Within Per Diem' : 'Exceeds Per Diem'}
                         </span>
                       </div>
                    </div>
                  </div>
                  
                  {expense.tags && expense.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {expense.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  onClick={() => handleExpenseClick(expense)}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{getCategoryIcon(expense.category)}</div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(expense.status)}`}>
                      {getStatusIcon(expense.status)}
                      <span className="text-sm font-medium capitalize">{expense.status}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{expense.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{expense.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Amount:</span>
                      <span className="text-xl font-bold text-white">${expense.amount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Agent:</span>
                      <span className="text-white text-sm">{expense.agentName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Location:</span>
                      <span className="text-white text-sm">{expense.location}</span>
                    </div>
                  </div>
                  
                  {expense.tags && expense.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {expense.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {expense.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">+{expense.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'analytics' && analytics && (
            <div className="space-y-8">
              {/* Top Categories */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Top Expense Categories</h3>
                <div className="space-y-4">
                  {analytics.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCategoryIcon(category.category)}</span>
                        <span className="text-white">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${category.amount}</p>
                        <p className="text-gray-400 text-sm">{category.count} expenses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Performance */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Agent Performance</h3>
                <div className="space-y-4">
                  {analytics.agentPerformance.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{agent.agentName}</p>
                          <p className="text-gray-400 text-sm">{agent.count} expenses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${agent.totalAmount}</p>
                        <p className="text-gray-400 text-sm">Total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mission Performance */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Mission Performance</h3>
                <div className="space-y-4">
                  {analytics.missionPerformance.map((mission, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">🎯</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{mission.missionTitle}</p>
                          <p className="text-gray-400 text-sm">${mission.totalExpenses} expenses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{mission.perDiemUtilization}%</p>
                        <p className="text-gray-400 text-sm">Per Diem Used</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Agent Status */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Active Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => handleAgentClick(agent)}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${getAgentStatusColor(agent.status)}`}></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                      <p className="text-gray-400 text-sm">{agent.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Total Expenses:</span>
                    <span className="text-white font-semibold">${agent.totalExpenses}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Avg. Expense:</span>
                    <span className="text-white font-semibold">${agent.averageExpense}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Missions:</span>
                    <span className="text-white font-semibold">{agent.missionsCompleted}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Rating:</span>
                    <span className="text-white font-semibold">⭐ {agent.rating}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">
                    Last active: {new Date(agent.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expense Detail Modal */}
      {showExpenseModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Expense Details</h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{selectedExpense.title}</h3>
                <p className="text-gray-400">{selectedExpense.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-white">${selectedExpense.amount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(selectedExpense.status)}`}>
                    {getStatusIcon(selectedExpense.status)}
                    <span className="font-medium capitalize">{selectedExpense.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Category</p>
                  <p className="text-white">{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Priority</p>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(selectedExpense.priority || 'medium')}`}>
                    {selectedExpense.priority || 'medium'}
                  </span>
                </div>
              </div>
              
              {/* Mission Information */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Mission Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Mission</p>
                    <p className="text-white font-semibold">{selectedExpense.missionTitle}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Budget</p>
                    <p className="text-white">${selectedExpense.missionBudget}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Daily Per Diem</p>
                    <p className="text-white">${selectedExpense.missionPerDiem}/day</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Duration</p>
                    <p className="text-white">{selectedExpense.missionDuration} day(s)</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Per Diem Status</p>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getPerDiemStatusColor(selectedExpense.isWithinPerDiem)}`}>
                      {getPerDiemStatusIcon(selectedExpense.isWithinPerDiem)}
                      <span className="font-medium">
                        {selectedExpense.isWithinPerDiem ? 'Within Limit' : 'Exceeds Limit'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Remaining Per Diem</p>
                    <p className="text-white">${selectedExpense.perDiemRemaining}</p>
                  </div>
                </div>
              </div>
              
              {selectedAgent && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Associated Agent</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedAgent.name}</p>
                      <p className="text-gray-400 text-sm">{selectedAgent.role}</p>
                      <p className="text-gray-400 text-sm">Rating: ⭐ {selectedAgent.rating}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedExpense.notes && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Notes</p>
                  <p className="text-white bg-gray-700 rounded-lg p-3">{selectedExpense.notes}</p>
                </div>
              )}
              
              {selectedExpense.status === 'pending' && hasPermission('expenses', 'update') && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApproveExpense(selectedExpense.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectExpense(selectedExpense.id, 'Rejected by admin')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail Modal */}
      {showAgentModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Agent Details</h2>
              <button
                onClick={() => setShowAgentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${getAgentStatusColor(selectedAgent.status)}`}></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedAgent.name}</h3>
                  <p className="text-gray-400">{selectedAgent.role}</p>
                  <p className="text-gray-400 text-sm">Rating: ⭐ {selectedAgent.rating}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold text-white">${selectedAgent.totalExpenses}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Average Expense</p>
                  <p className="text-2xl font-bold text-white">${selectedAgent.averageExpense}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Missions Completed</p>
                  <p className="text-2xl font-bold text-white">{selectedAgent.missionsCompleted}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="text-white font-semibold capitalize">{selectedAgent.status}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm mb-2">Last Active</p>
                <p className="text-white">{new Date(selectedAgent.lastActive).toLocaleString()}</p>
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Missions
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DJ Service Pack Modal */}
      <DJServicePackModal
        isOpen={servicePackModal.isOpen}
        onClose={() => setServicePackModal({ isOpen: false, servicePack: null, missionId: null })}
        servicePack={servicePackModal.servicePack}
        missionId={servicePackModal.missionId || undefined}
      />
    </div>
  );
};

export default DynamicPayoutSystem;
