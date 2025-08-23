import React from 'react';
import { MapPin, DollarSign, Clock, Star, Calendar, Users, Zap } from 'lucide-react';

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

interface MissionCardProps {
  mission: Mission;
  userRole: 'CLIENT' | 'RUNNER';
  onClick?: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, userRole, onClick }) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'corporate': return '🏢';
      case 'wedding': return '💒';
      case 'birthday': return '🎂';
      case 'club': return '🎧';
      default: return '🎵';
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}mi`;
  };

  const formatBudget = (budget: { min: number; max: number; suggested: number }) => {
    if (budget.min === budget.max) {
      return `$${budget.min}`;
    }
    return `$${budget.min}-${budget.max}`;
  };

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Urgent';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 7) return `${diffDays} days left`;
    return `${Math.ceil(diffDays / 7)} weeks left`;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getEventTypeIcon(mission.eventType)}</span>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {mission.title}
            </h3>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(mission.urgency)}`}>
            {mission.urgency.toUpperCase()}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {mission.description}
        </p>

        {/* Location and Distance */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{mission.address}</span>
          {userRole === 'RUNNER' && (
            <span className="ml-2 text-blue-600 font-medium">
              {formatDistance(mission.distance)} away
            </span>
          )}
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-green-600 font-semibold">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{formatBudget(mission.budget)}</span>
          </div>
          {userRole === 'RUNNER' && (
            <div className="text-sm text-gray-500">
              Suggested: ${mission.budget.suggested}
            </div>
          )}
        </div>
      </div>

      {/* Service Package */}
      <div className="px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {mission.servicePack.name}
          </span>
          <span className="text-xs text-gray-500">
            {mission.servicePack.includes.length} services
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {/* Client Rating */}
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-gray-700">{mission.clientRating}</span>
            </div>
            
            {/* Deadline */}
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-gray-600">
                {getTimeUntilDeadline(mission.deadline)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            {userRole === 'CLIENT' ? 'View Details' : 'Accept Mission'}
          </button>
        </div>
      </div>

      {/* Quick Info Pills */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(mission.deadline).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Users className="w-3 h-3 mr-1" />
            {mission.eventType}
          </span>
          {mission.urgency === 'high' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Zap className="w-3 h-3 mr-1" />
              Priority
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
