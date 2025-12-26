import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRBAC } from '../contexts/RBACContext';
import { PermissionGate } from '../components/RoleBasedUI';
import { Eye, Edit, Trash2, Shield, UserPlus, Users, Settings, CheckCircle, BarChart3 } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  client: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
  deadline: string;
  targetRole?: string[]; // Which roles can see/apply to this mission
  missionType?: 'gig' | 'delivery' | 'task' | 'service'; // Type of mission
}

export const Missions: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasPermission, getCurrentTheme } = useRBAC();
  const [platformMissions, setPlatformMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<{
    pending: Mission[];
    active: Mission[];
    cancelled: Mission[];
    inReview: Mission[];
  }>({
    pending: [],
    active: [],
    cancelled: [],
    inReview: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'platform' | 'my-missions'>('platform');
  const theme = getCurrentTheme();

  // Role checks
  const userRole = user?.role || 'GUEST';
  const isAdmin = userRole === 'ADMIN';
  const isOperations = userRole === 'OPERATIONS';
  const isCurator = userRole === 'CURATOR';
  const isClient = userRole === 'CLIENT';
  const isVerifiedDJ = userRole === 'VERIFIED_DJ';
  const isDJ = userRole === 'DJ' || isVerifiedDJ;
  const isRunner = userRole === 'RUNNER';

  // Action handlers
  const handleViewDetails = (mission: Mission) => {
    alert(`View details for: ${mission.title}\n\nThis would show full mission information.`);
  };

  const handleApplyMission = (mission: Mission) => {
    alert(`Apply to mission: ${mission.title}\n\nYour application has been submitted!`);
  };

  const handleEditMission = (mission: Mission) => {
    alert(`Edit mission: ${mission.title}\n\nOpening edit form...`);
  };

  const handleDeleteMission = (mission: Mission) => {
    if (confirm(`Delete mission: ${mission.title}?`)) {
      setMissions(prev => prev.filter(m => m.id !== mission.id));
      alert('Mission deleted successfully');
    }
  };

  const handleManageMission = (mission: Mission) => {
    alert(`Manage mission: ${mission.title}\n\nOpening admin management panel...`);
  };

  const handleAssignMission = (mission: Mission) => {
    alert(`Assign mission: ${mission.title}\n\nSelect team member to assign...`);
  };

  const handleViewAnalytics = (mission: Mission) => {
    alert(`Analytics for: ${mission.title}\n\nShowing mission performance data...`);
  };

  // Helper function to render mission cards with different statuses
  const renderMissionCard = (mission: Mission, status: 'pending' | 'active' | 'review' | 'cancelled') => {
    const statusConfig = {
      pending: {
        badge: 'Pending',
        badgeColor: 'bg-yellow-500 bg-opacity-20 text-yellow-400',
        actions: (
          <>
            <button 
              onClick={() => handleViewDetails(mission)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              View Details
            </button>
            <button 
              onClick={() => alert('Withdraw application')}
              className="px-3 py-2 text-sm font-medium text-red-400 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
            >
              Withdraw
            </button>
          </>
        )
      },
      active: {
        badge: 'In Progress',
        badgeColor: 'bg-blue-500 bg-opacity-20 text-blue-400',
        actions: (
          <>
            <button 
              onClick={() => handleViewDetails(mission)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Continue Work
            </button>
            <button 
              onClick={() => alert('Submit for review')}
              className="px-3 py-2 text-sm font-medium text-green-400 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
            >
              Submit
            </button>
          </>
        )
      },
      review: {
        badge: 'Under Review',
        badgeColor: 'bg-purple-500 bg-opacity-20 text-purple-400',
        actions: (
          <button 
            onClick={() => handleViewDetails(mission)}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            View Status
          </button>
        )
      },
      cancelled: {
        badge: 'Cancelled',
        badgeColor: 'bg-red-500 bg-opacity-20 text-red-400',
        actions: (
          <button 
            onClick={() => handleViewDetails(mission)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
          >
            View Details
          </button>
        )
      }
    };

    const config = statusConfig[status];

    return (
      <div key={mission.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.badgeColor}`}>
            {config.badge}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{mission.description}</p>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Client:</span>
            <span className="text-white">{mission.client}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Budget:</span>
            <span className="text-blue-400 font-semibold">${mission.budget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Deadline:</span>
            <span className="text-white">{new Date(mission.deadline).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {config.actions}
        </div>
      </div>
    );
  };

  // Mock data for demonstration
  useEffect(() => {
    // All available platform missions (will be filtered by role)
    const allPlatformMissions: Mission[] = [
      // DJ/VERIFIED_DJ Gigs
      {
        id: '1',
        title: 'DJ for Corporate Holiday Party',
        description: 'Professional DJ needed for annual corporate holiday party. Must have experience with mixed-age audiences and corporate events. Equipment provided.',
        client: 'TechCorp Inc.',
        budget: 500,
        status: 'open',
        createdAt: '2024-01-15',
        deadline: '2024-02-01',
        targetRole: ['DJ', 'VERIFIED_DJ'],
        missionType: 'gig'
      },
      {
        id: '3',
        title: 'Club Night Resident DJ',
        description: 'Weekly club night residency. Must have experience with electronic music (House, Techno, EDM). Bring your own controller.',
        client: 'Club XYZ',
        budget: 300,
        status: 'open',
        createdAt: '2024-01-12',
        deadline: '2024-01-25',
        targetRole: ['DJ', 'VERIFIED_DJ'],
        missionType: 'gig'
      },
      {
        id: '5',
        title: 'Wedding Reception DJ',
        description: 'Looking for experienced wedding DJ. Must have wedding playlist and MC experience. 5-hour event with cocktail hour.',
        client: 'Johnson Family',
        budget: 800,
        status: 'open',
        createdAt: '2024-01-18',
        deadline: '2024-02-10',
        targetRole: ['DJ', 'VERIFIED_DJ'],
        missionType: 'gig'
      },
      // RUNNER Service Missions
      {
        id: '11',
        title: 'Music Equipment Delivery',
        description: 'Pick up DJ equipment from rental shop and deliver to event venue. Must have reliable vehicle.',
        client: 'Event Productions LLC',
        budget: 75,
        status: 'open',
        createdAt: '2024-01-16',
        deadline: '2024-01-28',
        targetRole: ['RUNNER'],
        missionType: 'delivery'
      },
      {
        id: '12',
        title: 'Flyer Distribution - Music Festival',
        description: 'Distribute 500 flyers for upcoming music festival at local venues and events.',
        client: 'Summer Fest Organizers',
        budget: 100,
        status: 'open',
        createdAt: '2024-01-14',
        deadline: '2024-02-05',
        targetRole: ['RUNNER'],
        missionType: 'task'
      },
      {
        id: '13',
        title: 'Vinyl Record Pickup & Cataloging',
        description: 'Pick up vintage vinyl collection from seller, transport safely, and help catalog records.',
        client: 'Retro Records Shop',
        budget: 120,
        status: 'open',
        createdAt: '2024-01-19',
        deadline: '2024-02-15',
        targetRole: ['RUNNER'],
        missionType: 'service'
      }
    ];
    
    // Filter platform missions by user role
    const mockPlatformMissions = allPlatformMissions.filter(mission => {
      // ADMIN and OPERATIONS can see all missions
      if (isAdmin || isOperations) return true;
      
      // CURATOR can see all missions to assign to teams
      if (isCurator) return true;
      
      // Filter by targetRole if specified
      if (mission.targetRole && mission.targetRole.length > 0) {
        return mission.targetRole.includes(userRole);
      }
      
      // If no targetRole specified, show to all
      return true;
    });

    // User-specific missions organized by status
    const mockUserMissions = {
      pending: [
        {
          id: '2',
          title: 'Wedding Reception Music',
          description: 'Looking for a DJ to provide music for a wedding reception. Must have wedding experience.',
          client: 'Smith Family',
          budget: 800,
          status: 'open' as const,
          createdAt: '2024-01-10',
          deadline: '2024-03-15'
        }
      ],
      active: [
        {
          id: '4',
          title: 'Corporate Gala Event',
          description: 'Active mission in progress. Provide music for annual corporate gala.',
          client: 'Enterprise Ltd',
          budget: 1200,
          status: 'in-progress' as const,
          createdAt: '2024-01-05',
          deadline: '2024-02-05'
        }
      ],
      cancelled: [
        {
          id: '6',
          title: 'Private Party (Cancelled)',
          description: 'This mission was cancelled by the client.',
          client: 'Williams Family',
          budget: 400,
          status: 'open' as const,
          createdAt: '2024-01-08',
          deadline: '2024-01-30'
        }
      ],
      inReview: [
        {
          id: '7',
          title: 'Festival Performance',
          description: 'Mission completed, awaiting client review and payment release.',
          client: 'Summer Fest Organizers',
          budget: 1500,
          status: 'completed' as const,
          createdAt: '2024-01-01',
          deadline: '2024-01-20'
        }
      ]
    };

    setTimeout(() => {
      setPlatformMissions(mockPlatformMissions);
      setUserMissions(mockUserMissions);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view missions.</p>
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Missions Dashboard</h1>
              <p className="text-xl text-gray-300">
                {user.role === 'RUNNER' ? 'Browse platform missions and track your applications' :
                 user.role === 'CLIENT' ? 'View all missions and manage your created ones' :
                 user.role === 'DJ' ? 'Find DJ gigs and performance opportunities' :
                 user.role === 'CURATOR' ? 'Browse missions and manage team assignments' :
                 user.role === 'OPERATIONS' ? 'Monitor all platform missions and user activities' :
                 user.role === 'ADMIN' ? 'Full mission management and platform oversight' :
                 'Browse available missions'}
              </p>
            </div>
            <PermissionGate resource="missions" action="create">
              <button 
                onClick={() => navigate('/missions/create')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <span>Create Mission</span>
              </button>
            </PermissionGate>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('platform')}
              className={`px-6 py-3 font-semibold transition-all duration-200 ${
                activeTab === 'platform'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              🌐 Platform Missions
              <span className="ml-2 px-2 py-1 text-xs bg-blue-500 bg-opacity-20 text-blue-400 rounded-full">
                {platformMissions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('my-missions')}
              className={`px-6 py-3 font-semibold transition-all duration-200 ${
                activeTab === 'my-missions'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              📋 My Missions
              <span className="ml-2 px-2 py-1 text-xs bg-purple-500 bg-opacity-20 text-purple-400 rounded-full">
                {userMissions.pending.length + userMissions.active.length + userMissions.inReview.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Missions Content */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading missions...</p>
            </div>
          ) : activeTab === 'platform' ? (
            // PLATFORM MISSIONS TAB
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Available Platform Missions</h2>
              <p className="text-gray-400 mb-8">
                {isDJ ? 'Browse available gigs and apply to performance opportunities' :
                 isRunner ? 'Browse service missions and apply to delivery/task opportunities' :
                 'Browse and apply to missions posted by clients across the platform'}
              </p>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {platformMissions.map((mission) => (
                  <div key={mission.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500 bg-opacity-20 text-green-400">
                        Available
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{mission.description}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Client:</span>
                        <span className="text-white">{mission.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-blue-400 font-semibold">${mission.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deadline:</span>
                        <span className="text-white">{new Date(mission.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(mission)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {(isRunner || isDJ) && (
                        <button 
                          onClick={() => handleApplyMission(mission)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // MY MISSIONS TAB
            <div className="space-y-12">
              {/* Pending Missions */}
              {userMissions.pending.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 bg-yellow-500 rounded-full mr-3"></div>
                    <h2 className="text-2xl font-bold text-white">Pending Applications</h2>
                    <span className="ml-3 px-3 py-1 text-sm bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full">
                      {userMissions.pending.length}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-6">Missions you've applied to, awaiting client response</p>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userMissions.pending.map((mission) => renderMissionCard(mission, 'pending'))}
                  </div>
                </div>
              )}

              {/* Active Missions */}
              {userMissions.active.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                    <h2 className="text-2xl font-bold text-white">Active Missions</h2>
                    <span className="ml-3 px-3 py-1 text-sm bg-blue-500 bg-opacity-20 text-blue-400 rounded-full">
                      {userMissions.active.length}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-6">Currently in progress - deliver great work!</p>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userMissions.active.map((mission) => renderMissionCard(mission, 'active'))}
                  </div>
                </div>
              )}

              {/* In Review Missions */}
              {userMissions.inReview.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                    <h2 className="text-2xl font-bold text-white">In Review</h2>
                    <span className="ml-3 px-3 py-1 text-sm bg-purple-500 bg-opacity-20 text-purple-400 rounded-full">
                      {userMissions.inReview.length}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-6">Completed work awaiting client review and payment</p>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userMissions.inReview.map((mission) => renderMissionCard(mission, 'review'))}
                  </div>
                </div>
              )}

              {/* Cancelled Missions */}
              {userMissions.cancelled.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 bg-red-500 rounded-full mr-3"></div>
                    <h2 className="text-2xl font-bold text-white">Cancelled</h2>
                    <span className="ml-3 px-3 py-1 text-sm bg-red-500 bg-opacity-20 text-red-400 rounded-full">
                      {userMissions.cancelled.length}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-6">Missions that were cancelled or rejected</p>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userMissions.cancelled.map((mission) => renderMissionCard(mission, 'cancelled'))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {userMissions.pending.length === 0 && 
               userMissions.active.length === 0 && 
               userMissions.inReview.length === 0 && 
               userMissions.cancelled.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Missions Yet</h3>
                  <p className="text-gray-400 mb-6">Start by applying to platform missions!</p>
                  <button
                    onClick={() => setActiveTab('platform')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Browse Platform Missions
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
