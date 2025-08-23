import React, { useState } from 'react';
import { Filter, MapPin, DollarSign, Clock, Star, X } from 'lucide-react';

interface Filters {
  location: string;
  budget: { min: number; max: number };
  eventType: string;
  urgency: string;
  distance: number;
  rating: number;
}

interface MissionFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  userRole: 'CLIENT' | 'RUNNER';
}

const MissionFilters: React.FC<MissionFiltersProps> = ({ filters, onFilterChange, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const eventTypes = [
    { value: 'corporate', label: 'Corporate', icon: '🏢' },
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
    { value: 'club', label: 'Club/Bar', icon: '🎧' },
    { value: 'party', label: 'Party', icon: '🎉' },
    { value: 'concert', label: 'Concert', icon: '🎤' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleBudgetChange = (type: 'min' | 'max', value: number) => {
    const newBudget = { ...filters.budget, [type]: value };
    onFilterChange({ ...filters, budget: newBudget });
  };

  const clearFilters = () => {
    const defaultFilters: Filters = {
      location: '',
      budget: { min: 0, max: 2000 },
      eventType: '',
      urgency: '',
      distance: 50,
      rating: 0
    };
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return filters.location || 
           filters.budget.min > 0 || 
           filters.budget.max < 2000 || 
           filters.eventType || 
           filters.urgency || 
           filters.distance < 50 || 
           filters.rating > 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {hasActiveFilters() && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Budget
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.budget.min}
                onChange={(e) => handleBudgetChange('min', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.budget.max}
                onChange={(e) => handleBudgetChange('max', parseInt(e.target.value) || 2000)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All types</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Urgency
            </label>
            <select
              value={filters.urgency}
              onChange={(e) => handleFilterChange('urgency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All levels</option>
              {urgencyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Distance (Runner only) */}
            {userRole === 'RUNNER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Distance
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.distance}
                    onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 mile</span>
                    <span className="font-medium">{filters.distance} miles</span>
                    <span>50 miles</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Minimum Rating
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Any rating</span>
                  <span className="font-medium">{filters.rating}+ stars</span>
                  <span>5 stars</span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => onFilterChange({
                    ...filters,
                    urgency: 'high',
                    budget: { min: 500, max: 2000 }
                  })}
                  className="w-full text-left px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                >
                  🔥 High Priority & High Budget
                </button>
                <button
                  onClick={() => onFilterChange({
                    ...filters,
                    distance: 10,
                    budget: { min: 200, max: 1000 }
                  })}
                  className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                >
                  📍 Nearby & Mid-Range
                </button>
                <button
                  onClick={() => onFilterChange({
                    ...filters,
                    rating: 4.5,
                    eventType: 'corporate'
                  })}
                  className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100"
                >
                  ⭐ Top Rated Corporate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionFilters;
