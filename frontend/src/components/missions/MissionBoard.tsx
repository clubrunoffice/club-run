import React, { useState, useEffect } from 'react';

import MissionCard from './MissionCard';
import MissionFilters from './MissionFilters';
import { MapPin, Clock, Filter } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  address: string;
  budget: {
    min: number;
    max: number;
    suggested: number;
  };
  eventType: string;
  urgency: 'low' | 'medium' | 'high';
  clientRating: number;
  distance: number;
  servicePack: {
    name: string;
    includes: string[];
    equipment: string[];
  };
  createdAt: string;
  deadline: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface MissionBoardProps {
  userRole: 'CLIENT' | 'RUNNER';
  onMissionSelect?: (mission: Mission) => void;
}

const MissionBoard: React.FC<MissionBoardProps> = ({ userRole, onMissionSelect }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    budget: { min: 0, max: 2000 },
    eventType: '',
    urgency: '',
    distance: 50,
    rating: 0
  });

  // Mock data for demonstration - replace with API call
  useEffect(() => {
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: 'Corporate Event DJ Services',
        description: 'Need professional DJ for 200-person corporate event in downtown Atlanta',
        address: '123 Peachtree St, Atlanta, GA 30303',
        budget: { min: 800, max: 1200, suggested: 1000 },
        eventType: 'corporate',
        urgency: 'high',
        clientRating: 4.8,
        distance: 2.3,
        servicePack: {
          name: 'Premium DJ Package',
          includes: ['DJ + Premium Sound', '6 hours', 'LED lighting', 'MC services'],
          equipment: ['Professional sound system', 'LED lighting rig', 'Wireless microphones']
        },
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        location: { latitude: 33.7490, longitude: -84.3880 }
      },
      {
        id: '2',
        title: 'Wedding Reception Music',
        description: 'Beautiful outdoor wedding reception needs elegant background music',
        address: '456 Piedmont Park, Atlanta, GA 30309',
        budget: { min: 600, max: 900, suggested: 750 },
        eventType: 'wedding',
        urgency: 'medium',
        clientRating: 4.9,
        distance: 5.1,
        servicePack: {
          name: 'Elegant Wedding Package',
          includes: ['Background music', '4 hours', 'Elegant lighting', 'MC for announcements'],
          equipment: ['Acoustic system', 'Ambient lighting', 'Wireless speakers']
        },
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        location: { latitude: 33.7890, longitude: -84.3720 }
      },
      {
        id: '3',
        title: 'Birthday Party DJ',
        description: 'Sweet 16 birthday party needs energetic DJ and lighting',
        address: '789 Buckhead Ave, Atlanta, GA 30305',
        budget: { min: 300, max: 500, suggested: 400 },
        eventType: 'birthday',
        urgency: 'low',
        clientRating: 4.6,
        distance: 8.7,
        servicePack: {
          name: 'Party DJ Package',
          includes: ['High-energy DJ', '4 hours', 'Color lighting', 'Photo booth setup'],
          equipment: ['Party sound system', 'Color LED lights', 'Photo booth']
        },
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        location: { latitude: 33.8480, longitude: -84.3780 }
      }
    ];

    setMissions(mockMissions);
    setFilteredMissions(mockMissions);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = missions;

    if (filters.location) {
      filtered = filtered.filter(mission => 
        mission.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.budget.min > 0 || filters.budget.max < 2000) {
      filtered = filtered.filter(mission => 
        mission.budget.suggested >= filters.budget.min && 
        mission.budget.suggested <= filters.budget.max
      );
    }

    if (filters.eventType) {
      filtered = filtered.filter(mission => 
        mission.eventType === filters.eventType
      );
    }

    if (filters.urgency) {
      filtered = filtered.filter(mission => 
        mission.urgency === filters.urgency
      );
    }

    if (filters.distance < 50) {
      filtered = filtered.filter(mission => 
        mission.distance <= filters.distance
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(mission => 
        mission.clientRating >= filters.rating
      );
    }

    setFilteredMissions(filtered);
  }, [missions, filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleMissionSelect = (mission: Mission) => {
    if (onMissionSelect) {
      onMissionSelect(mission);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'CLIENT' ? 'Available Music Services' : 'Mission Board'}
            </h1>
            <p className="mt-2 text-gray-600">
              {userRole === 'CLIENT' 
                ? 'Find the perfect music service for your event'
                : 'Discover missions that match your skills and location'
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Atlanta, GA</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{filteredMissions.length} available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <MissionFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        userRole={userRole}
      />

      {/* Mission Grid */}
      <div className="mt-8">
        {filteredMissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No missions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later for new missions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                userRole={userRole}
                onClick={() => handleMissionSelect(mission)}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      {userRole === 'RUNNER' && filteredMissions.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🤖 AI Recommendations
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-700">
                <strong>Perfect match!</strong> The "Corporate Event DJ Services" mission is 
                only 2.3 miles away, matches your expertise in corporate events, and offers 
                $1,000 earnings potential.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-700">
                <strong>High priority:</strong> "Wedding Reception Music" has a 4.9 client rating 
                and is in your preferred location. This type of event typically leads to 
                repeat business opportunities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionBoard;
