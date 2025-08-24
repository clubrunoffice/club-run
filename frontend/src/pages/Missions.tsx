import React, { useState, useEffect } from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { PermissionGate } from '../components/RoleBasedUI';

interface Mission {
  id: string;
  title: string;
  description: string;
  client: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
  deadline: string;
}

export const Missions: React.FC = () => {
  const { user, isAuthenticated, hasPermission, getCurrentTheme } = useRBAC();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = getCurrentTheme();

  // Mock data for demonstration
  useEffect(() => {
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: 'DJ for Corporate Event',
        description: 'Need a professional DJ for a corporate event in downtown. Must have experience with corporate events.',
        client: 'TechCorp Inc.',
        budget: 500,
        status: 'open',
        createdAt: '2024-01-15',
        deadline: '2024-02-01'
      },
      {
        id: '2',
        title: 'Wedding Reception Music',
        description: 'Looking for a DJ to provide music for a wedding reception. Must have wedding experience.',
        client: 'Smith Family',
        budget: 800,
        status: 'in-progress',
        createdAt: '2024-01-10',
        deadline: '2024-03-15'
      },
      {
        id: '3',
        title: 'Club Night Performance',
        description: 'Need a DJ for a club night. Must have experience with electronic music.',
        client: 'Club XYZ',
        budget: 300,
        status: 'open',
        createdAt: '2024-01-12',
        deadline: '2024-01-25'
      }
    ];

    setTimeout(() => {
      setMissions(mockMissions);
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Missions</h1>
              <p className="text-xl text-gray-300">
                {user.role === 'RUNNER' ? 'Browse and apply to available missions' :
                 user.role === 'CLIENT' ? 'View and manage your created missions' :
                 user.role === 'DJ' ? 'View available missions for music submissions' :
                 user.role === 'CURATOR' ? 'Browse missions for collaboration opportunities' :
                 user.role === 'OPERATIONS' ? 'Monitor and manage all platform missions' :
                 user.role === 'ADMIN' ? 'Full access to all mission management' :
                 'Browse available missions'}
              </p>
            </div>
            <PermissionGate resource="missions" action="create">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                <span>Create Mission</span>
              </button>
            </PermissionGate>
          </div>
        </div>
      </section>

      {/* Missions List */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading missions...</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {missions.map((mission) => (
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
                  
                  <p className="text-gray-300 text-sm mb-4">{mission.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Client:</span>
                      <span className="text-white">{mission.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-blue-400">${mission.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-white">{new Date(mission.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {/* Apply button only for RUNNERS */}
                    {user.role === 'RUNNER' && (
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                        Apply
                      </button>
                    )}
                    
                    {/* View Details for all authenticated users */}
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                      View Details
                    </button>
                    
                    {/* Role-specific additional actions */}
                    {user.role === 'CLIENT' && (
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                        Edit Mission
                      </button>
                    )}
                    
                    {user.role === 'OPERATIONS' || user.role === 'ADMIN' ? (
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                        Manage
                      </button>
                    ) : null}
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
