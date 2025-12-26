import React, { useState, useEffect } from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { PermissionGate } from '../components/RoleBasedUI';
import { Eye, Edit, Trash2, Shield, UserPlus, Users, FileText, BarChart3 } from 'lucide-react';

interface P2PMission {
  id: string;
  title: string;
  description: string;
  creator: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
  deadline: string;
  category: string;
}

export const P2PMissions: React.FC = () => {
  const { user, isAuthenticated, hasPermission, getCurrentTheme } = useRBAC();
  const [p2pMissions, setP2pMissions] = useState<P2PMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<P2PMission | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<P2PMission | null>(null);
  const theme = getCurrentTheme();

  // Handle Join Mission
  const handleJoinMission = (mission: P2PMission) => {
    setSelectedMission(mission);
    setShowJoinModal(true);
  };

  // Confirm Join
  const confirmJoin = async () => {
    if (!selectedMission) return;
    
    try {
      // TODO: Call backend API to join mission
      // await fetch(`/api/p2p-missions/${selectedMission.id}/join`, { method: 'POST' });
      
      alert(`Successfully joined mission: ${selectedMission.title}`);
      
      // Update mission status locally
      setP2pMissions(prev => prev.map(m => 
        m.id === selectedMission.id 
          ? { ...m, status: 'in-progress' as const }
          : m
      ));
      
      setShowJoinModal(false);
      setSelectedMission(null);
    } catch (error) {
      console.error('Failed to join mission:', error);
      alert('Failed to join mission. Please try again.');
    }
  };

  // Handle View Details
  const handleViewDetails = (mission: P2PMission) => {
    setSelectedMission(mission);
    setShowDetailsModal(true);
  };

  // Close modals
  const closeModals = () => {
    setShowDetailsModal(false);
    setShowJoinModal(false);
    setShowEditModal(false);
    setSelectedMission(null);
    setEditForm(null);
  };

  // Admin actions
  const handleEditMission = (mission: P2PMission) => {
    setEditForm({ ...mission });
    setSelectedMission(mission);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    
    // Validate form
    if (!editForm.title.trim() || !editForm.description.trim()) {
      alert('Title and description are required');
      return;
    }
    
    if (editForm.budget < 0) {
      alert('Budget cannot be negative');
      return;
    }
    
    // Update mission in state
    setP2pMissions(prev => prev.map(m => 
      m.id === editForm.id ? editForm : m
    ));
    
    alert('Mission updated successfully!');
    setShowEditModal(false);
    setEditForm(null);
    setSelectedMission(null);
  };

  const handleDeleteMission = (mission: P2PMission) => {
    if (confirm(`Are you sure you want to delete "${mission.title}"?`)) {
      setP2pMissions(prev => prev.filter(m => m.id !== mission.id));
      alert('Mission deleted successfully');
    }
  };

  const handleAssignMission = (mission: P2PMission) => {
    alert(`Assign mission: ${mission.title}\n\nCurator would assign this mission to a team member.`);
  };

  const handleCreateMission = () => {
    alert('Create P2P Mission\n\nThis would open a form for creating a new mission.');
  };

  // Role checks
  const userRole = user?.role || 'GUEST';
  const isAdminRole = userRole === 'ADMIN' || userRole === 'OPERATIONS';
  const isCurator = userRole === 'CURATOR';
  const isClient = userRole === 'CLIENT';
  const isPartner = userRole === 'PARTNER';
  const isDJ = userRole === 'DJ' || userRole === 'VERIFIED_DJ';
  const isGuest = userRole === 'GUEST';

  // Mock data for demonstration
  useEffect(() => {
    const mockP2PMissions: P2PMission[] = [
      {
        id: '1',
        title: 'Music Collaboration Project',
        description: 'Looking for a producer to collaborate on a new track. I have the vocals, need help with the beat.',
        creator: 'MusicMaker123',
        budget: 200,
        status: 'open',
        createdAt: '2024-01-15',
        deadline: '2024-02-15',
        category: 'Music Production'
      },
      {
        id: '2',
        title: 'Event Planning Partnership',
        description: 'Need a partner to help plan and execute a music festival. Split profits 50/50.',
        creator: 'EventPro',
        budget: 0,
        status: 'open',
        createdAt: '2024-01-12',
        deadline: '2024-03-01',
        category: 'Event Planning'
      },
      {
        id: '3',
        title: 'Studio Session Exchange',
        description: 'I have a home studio, looking to exchange recording time for mixing services.',
        creator: 'StudioOwner',
        budget: 0,
        status: 'in-progress',
        createdAt: '2024-01-10',
        deadline: '2024-01-30',
        category: 'Studio Services'
      }
    ];

    setTimeout(() => {
      setP2pMissions(mockP2PMissions);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view P2P missions.</p>
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
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">P2P Missions</h1>
                {isAdminRole && (
                  <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg px-4 py-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Admin View</span>
                  </div>
                )}
                {isCurator && (
                  <div className="bg-orange-500/20 border border-orange-500 rounded-lg px-4 py-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-semibold">Curator View</span>
                  </div>
                )}
                {isPartner && (
                  <div className="bg-cyan-500/20 border border-cyan-500 rounded-lg px-4 py-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    <span className="text-cyan-400 font-semibold">Partner View</span>
                  </div>
                )}
              </div>
              <p className="text-xl text-gray-300">
                {isAdminRole ? 'Manage and oversee all P2P missions' :
                 isCurator ? 'Coordinate and assign missions to your team' :
                 isPartner ? 'View mission analytics and partnership opportunities' :
                 isClient ? 'Create and manage your peer-to-peer missions' :
                 isDJ ? 'Join missions and collaborate with peers' :
                 'Explore available peer-to-peer collaborations'}
              </p>
            </div>
            {(isClient || isCurator || isAdminRole) && (
              <button 
                onClick={handleCreateMission}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <span>Create P2P Mission</span>
              </button>
            )}
          </div>
        </div>
      </section>

        {/* Content */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                <p className="mt-4 text-gray-300">Loading P2P missions...</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {p2pMissions.map((mission) => (
                  <div key={mission.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        mission.status === 'open' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                        mission.status === 'in-progress' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                        'bg-gray-500 bg-opacity-20 text-gray-400'
                      }`}>
                        {mission.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-500 bg-opacity-20 text-purple-400 rounded-full">
                        {mission.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{mission.description}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Creator:</span>
                        <span className="text-white">{mission.creator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-blue-400">
                          {mission.budget > 0 ? `$${mission.budget}` : 'Partnership'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deadline:</span>
                        <span className="text-white">{new Date(mission.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Role-based action buttons */}
                    {isAdminRole ? (
                      // ADMIN/OPERATIONS: Full management controls
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(mission)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button 
                          onClick={() => handleEditMission(mission)}
                          className="px-3 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all duration-200"
                          title="Edit Mission"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMission(mission)}
                          className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200"
                          title="Delete Mission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : isCurator ? (
                      // CURATOR: Assign and manage team missions
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(mission)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                        <button 
                          onClick={() => handleAssignMission(mission)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Assign
                        </button>
                      </div>
                    ) : isClient ? (
                      // CLIENT: Manage own missions and view others
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(mission)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                        {mission.creator === user?.email && (
                          <button 
                            onClick={() => handleEditMission(mission)}
                            className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200"
                            title="Edit My Mission"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : isPartner ? (
                      // PARTNER: View analytics and details
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(mission)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button 
                          onClick={() => alert(`Analytics for: ${mission.title}\n\nShowing mission performance metrics.`)}
                          className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all duration-200"
                          title="View Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : isDJ ? (
                      // DJ/VERIFIED_DJ: Join missions and view details
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleJoinMission(mission)}
                          disabled={mission.status !== 'open'}
                          className={`flex-1 px-3 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                            mission.status === 'open'
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                              : 'bg-gray-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <UserPlus className="w-4 h-4" />
                          {mission.status === 'open' ? 'Join' : 'In Progress'}
                        </button>
                        <button 
                          onClick={() => handleViewDetails(mission)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    ) : (
                      // GUEST: View only
                      <button 
                        onClick={() => handleViewDetails(mission)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Join Mission Modal */}
        {showJoinModal && selectedMission && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Join Mission</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to join <strong className="text-blue-400">{selectedMission.title}</strong>?
              </p>
              
              <div className="space-y-3 mb-6 bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator:</span>
                  <span className="text-white">{selectedMission.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-blue-400">
                    {selectedMission.budget > 0 ? `$${selectedMission.budget}` : 'Partnership'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline:</span>
                  <span className="text-white">{new Date(selectedMission.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJoin}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Confirm Join
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedMission && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedMission.title}</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  selectedMission.status === 'open' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                  selectedMission.status === 'in-progress' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                  'bg-gray-500 bg-opacity-20 text-gray-400'
                }`}>
                  {selectedMission.status}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-purple-500 bg-opacity-20 text-purple-400 rounded-full">
                  {selectedMission.category}
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                <p className="text-gray-300">{selectedMission.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-900 rounded-lg p-4">
                <div>
                  <span className="text-gray-400 text-sm block mb-1">Creator</span>
                  <span className="text-white font-medium">{selectedMission.creator}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm block mb-1">Budget</span>
                  <span className="text-blue-400 font-medium">
                    {selectedMission.budget > 0 ? `$${selectedMission.budget}` : 'Partnership'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm block mb-1">Created</span>
                  <span className="text-white font-medium">{new Date(selectedMission.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm block mb-1">Deadline</span>
                  <span className="text-white font-medium">{new Date(selectedMission.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                {selectedMission.status === 'open' && (
                  <PermissionGate resource="p2p-missions" action="accept">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowJoinModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      Join Mission
                    </button>
                  </PermissionGate>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Mission Modal */}
        {showEditModal && editForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Edit Mission</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Mission title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Mission description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Music Production">Music Production</option>
                    <option value="Event Planning">Event Planning</option>
                    <option value="Studio Services">Studio Services</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Collaboration">Collaboration</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget ($)</label>
                  <input
                    type="number"
                    value={editForm.budget}
                    onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="0 for partnership"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'open' | 'in-progress' | 'completed' })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};
