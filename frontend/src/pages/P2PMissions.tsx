import React, { useState, useEffect } from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { PermissionGate } from '../components/RoleBasedUI';

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
  const theme = getCurrentTheme();

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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">P2P Missions</h1>
              <p className="text-xl text-gray-300">
                Peer-to-peer collaborations and partnerships
              </p>
            </div>
            <PermissionGate resource="p2p-missions" action="create">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                <span>Create P2P Mission</span>
              </button>
            </PermissionGate>
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
                    
                    <div className="flex space-x-3">
                      <PermissionGate resource="p2p-missions" action="accept">
                        <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                          Join
                        </button>
                      </PermissionGate>
                      
                      <PermissionGate resource="p2p-missions" action="read">
                        <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                          View Details
                        </button>
                      </PermissionGate>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
  );
};
