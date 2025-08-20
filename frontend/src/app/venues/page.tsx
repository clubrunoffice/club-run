'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Venue, VenueCategory, CrowdLevel, VenueStatus } from '@/types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PhoneIcon,
  GlobeAltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Mock data for venues
const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'The Basement',
    address: '123 Underground St',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30301',
    phone: '(404) 555-0123',
    website: 'https://thebasement.com',
    hours: '9 PM - 2 AM',
    description: 'Underground electronic music venue with state-of-the-art sound system',
    category: VenueCategory.NIGHTCLUB,
    crowdLevel: CrowdLevel.BUSY,
    safetyRating: 4.5,
    avgCost: 25,
    checkInReward: 75,
    status: VenueStatus.OPEN,
    coordinates: { lat: 33.7490, lng: -84.3880 },
    images: ['/venues/basement-1.jpg'],
    amenities: ['Dance Floor', 'VIP', 'Live DJ', 'Bar'],
    tags: ['Electronic', 'Underground', 'Late Night'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'SkyLounge',
    address: '456 Rooftop Ave',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30302',
    phone: '(404) 555-0456',
    website: 'https://skylounge.com',
    hours: '5 PM - 12 AM',
    description: 'Upscale rooftop lounge with panoramic city views',
    category: VenueCategory.LOUNGE,
    crowdLevel: CrowdLevel.MODERATE,
    safetyRating: 4.8,
    avgCost: 45,
    checkInReward: 100,
    status: VenueStatus.OPEN,
    coordinates: { lat: 33.7490, lng: -84.3880 },
    images: ['/venues/skylounge-1.jpg'],
    amenities: ['Rooftop', 'Cocktails', 'Small Plates', 'Reservations'],
    tags: ['Upscale', 'Rooftop', 'Cocktails'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '529 Bar',
    address: '789 Music Row',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30303',
    phone: '(404) 555-0789',
    website: 'https://529bar.com',
    hours: '8 PM - 3 AM',
    description: 'Intimate live music venue featuring local and touring bands',
    category: VenueCategory.LIVE_MUSIC,
    crowdLevel: CrowdLevel.LIGHT,
    safetyRating: 4.2,
    avgCost: 15,
    checkInReward: 50,
    status: VenueStatus.OPEN,
    coordinates: { lat: 33.7490, lng: -84.3880 },
    images: ['/venues/529-1.jpg'],
    amenities: ['Live Music', 'Bar', 'Outdoor Patio', 'Food'],
    tags: ['Live Music', 'Local', 'Intimate'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export default function VenuesPage() {
  const { venues, setVenues, searchQuery, setSearchQuery, filters, updateFilters } = useAppStore();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useEffect(() => {
    // Load mock data
    setVenues(mockVenues);
  }, [setVenues]);

  const handleCheckIn = (venueId: string) => {
    console.log('Checking in to venue:', venueId);
    // Add check-in logic here
  };

  const getCrowdLevelColor = (level: CrowdLevel) => {
    switch (level) {
      case CrowdLevel.EMPTY: return 'text-gray-500';
      case CrowdLevel.LIGHT: return 'text-green-500';
      case CrowdLevel.MODERATE: return 'text-yellow-500';
      case CrowdLevel.BUSY: return 'text-orange-500';
      case CrowdLevel.PACKED: return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCrowdLevelText = (level: CrowdLevel) => {
    switch (level) {
      case CrowdLevel.EMPTY: return 'Empty';
      case CrowdLevel.LIGHT: return 'Light';
      case CrowdLevel.MODERATE: return 'Moderate';
      case CrowdLevel.BUSY: return 'Busy';
      case CrowdLevel.PACKED: return 'Packed';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: VenueStatus) => {
    switch (status) {
      case VenueStatus.OPEN: return 'text-green-600';
      case VenueStatus.CLOSED: return 'text-red-600';
      case VenueStatus.TEMPORARILY_CLOSED: return 'text-yellow-600';
      case VenueStatus.COMING_SOON: return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filters.venues.category || 
                           filters.venues.category.length === 0 ||
                           filters.venues.category.includes(venue.category);
    
    const matchesCrowdLevel = !filters.venues.crowdLevel ||
                             filters.venues.crowdLevel.length === 0 ||
                             filters.venues.crowdLevel.includes(venue.crowdLevel);
    
    return matchesSearch && matchesCategory && matchesCrowdLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
              <p className="text-sm text-gray-600">Discover the best nightlife spots</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="space-y-2">
                    {Object.values(VenueCategory).map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.venues.category?.includes(category) || false}
                          onChange={(e) => {
                            const currentCategories = filters.venues.category || [];
                            const newCategories = e.target.checked
                              ? [...currentCategories, category]
                              : currentCategories.filter((c: VenueCategory) => c !== category);
                            updateFilters('venues', { ...filters.venues, category: newCategories });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {category.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Crowd Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crowd Level</label>
                  <div className="space-y-2">
                    {Object.values(CrowdLevel).map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.venues.crowdLevel?.includes(level) || false}
                          onChange={(e) => {
                            const currentLevels = filters.venues.crowdLevel || [];
                            const newLevels = e.target.checked
                              ? [...currentLevels, level]
                              : currentLevels.filter((l: CrowdLevel) => l !== level);
                            updateFilters('venues', { ...filters.venues, crowdLevel: newLevels });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">$ (Under $20)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">$$ ($20-$40)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">$$$ (Over $40)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredVenues.length} of {venues.length} venues
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Venue Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.status)} bg-white`}>
                    {venue.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-2 text-white">
                    <StarIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{venue.safetyRating}</span>
                  </div>
                </div>
              </div>

              {/* Venue Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <span className="text-sm font-medium">+{venue.checkInReward}</span>
                    <span className="text-xs">tokens</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{venue.description}</p>

                {/* Venue Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{venue.address}, {venue.city}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <span className={getCrowdLevelColor(venue.crowdLevel)}>
                        {getCrowdLevelText(venue.crowdLevel)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span>${venue.avgCost}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{venue.hours}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {venue.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                        +{venue.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCheckIn(venue.id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Check In
                  </button>
                  
                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Venue Detail Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedVenue.name}</h3>
                  <button
                    onClick={() => setSelectedVenue(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{selectedVenue.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedVenue.address}, {selectedVenue.city}, {selectedVenue.state} {selectedVenue.zipCode}</span>
                    </div>
                    
                    {selectedVenue.phone && (
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedVenue.phone}</span>
                      </div>
                    )}
                    
                    {selectedVenue.website && (
                      <div className="flex items-center text-sm">
                        <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={selectedVenue.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {selectedVenue.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Safety Rating:</span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{selectedVenue.safetyRating}/5</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Cost:</span>
                      <span>${selectedVenue.avgCost}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Crowd Level:</span>
                      <span className={getCrowdLevelColor(selectedVenue.crowdLevel)}>
                        {getCrowdLevelText(selectedVenue.crowdLevel)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Check-in Reward:</span>
                      <span className="text-yellow-600">+{selectedVenue.checkInReward} tokens</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-sm">Amenities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedVenue.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleCheckIn(selectedVenue.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Check In
                </button>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 