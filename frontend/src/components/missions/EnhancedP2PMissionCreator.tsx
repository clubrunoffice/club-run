import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface TrackRequirements {
  title: string;
  artist: string;
  album?: string;
  isrc?: string;
  duration?: number;
  bpm?: number;
  key?: string;
}

interface MissionFormData {
  title: string;
  description: string;
  venueAddress: string;
  eventType: string;
  budget: number;
  deadline: string;
  paymentMethod: string;
  teamId?: string;
  openMarket: boolean;
  autoVerifyEnabled: boolean;
  trackRequirements?: TrackRequirements;
  verificationWindow: {
    startTime: string;
    endTime: string;
  };
}

export function EnhancedP2PMissionCreator() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showTrackRequirements, setShowTrackRequirements] = useState(false);
  const [teams, setTeams] = useState([]);
  
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    venueAddress: '',
    eventType: '',
    budget: 0,
    deadline: '',
    paymentMethod: 'usdc',
    openMarket: true,
    autoVerifyEnabled: false,
    verificationWindow: {
      startTime: '',
      endTime: ''
    }
  });

  const [trackRequirements, setTrackRequirements] = useState<TrackRequirements>({
    title: '',
    artist: '',
    album: '',
    isrc: '',
    duration: 0,
    bpm: 0,
    key: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('verificationWindow.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        verificationWindow: {
          ...prev.verificationWindow,
          [field]: value
        }
      }));
    } else if (name.startsWith('track.')) {
      const field = name.split('.')[1];
      setTrackRequirements(prev => ({
        ...prev,
        [field]: type === 'number' ? Number(value) : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const missionData = {
        ...formData,
        requirements: JSON.stringify({
          track: showTrackRequirements ? trackRequirements : null,
          autoVerify: formData.autoVerifyEnabled,
          verificationWindow: formData.verificationWindow
        })
      };

      const response = await fetch('/api/p2p-missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(missionData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Mission created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          venueAddress: '',
          eventType: '',
          budget: 0,
          deadline: '',
          paymentMethod: 'usdc',
          openMarket: true,
          autoVerifyEnabled: false,
          verificationWindow: {
            startTime: '',
            endTime: ''
          }
        });
        setTrackRequirements({
          title: '',
          artist: '',
          album: '',
          isrc: '',
          duration: 0,
          bpm: 0,
          key: ''
        });
      } else {
        const error = await response.json();
        alert(`Error creating mission: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating mission:', error);
      alert('Failed to create mission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Create Enhanced P2P Mission
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Mission Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Play 'Midnight Groove' at Club XYZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Event Type</option>
              <option value="club_night">Club Night</option>
              <option value="festival">Festival</option>
              <option value="private_event">Private Event</option>
              <option value="radio_show">Radio Show</option>
              <option value="streaming">Streaming</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the mission requirements, venue details, and any special instructions..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Address *
            </label>
            <input
              type="text"
              name="venueAddress"
              value={formData.venueAddress}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, Atlanta, GA 30301"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (USD) *
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="usdc">USDC (Crypto)</option>
              <option value="matic">MATIC (Crypto)</option>
              <option value="cashapp">Cash App</option>
              <option value="zelle">Zelle</option>
              <option value="venmo">Venmo</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>

        {/* Automatic Verification Section */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🎯 Automatic Verification Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoVerifyEnabled"
                name="autoVerifyEnabled"
                checked={formData.autoVerifyEnabled}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoVerifyEnabled" className="ml-2 block text-sm text-gray-900">
                Enable automatic Serato verification (DJs connect once, verification happens automatically)
              </label>
            </div>

            {formData.autoVerifyEnabled && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-4">
                  <strong>✨ Seamless Experience:</strong> DJs connect their Serato account once, then just play music normally. 
                  Club Run automatically verifies track plays and handles all payments and proof logging.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="verificationWindow.startTime"
                      value={formData.verificationWindow.startTime}
                      onChange={handleInputChange}
                      required={formData.autoVerifyEnabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification End Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="verificationWindow.endTime"
                      value={formData.verificationWindow.endTime}
                      onChange={handleInputChange}
                      required={formData.autoVerifyEnabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Track Requirements Section */}
        {formData.autoVerifyEnabled && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                🎵 Track Requirements
              </h3>
              <button
                type="button"
                onClick={() => setShowTrackRequirements(!showTrackRequirements)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showTrackRequirements ? 'Hide' : 'Add'} Track Requirements
              </button>
            </div>

            {showTrackRequirements && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <p className="text-sm text-gray-600">
                  Specify the exact track that needs to be played for automatic verification.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Track Title *
                    </label>
                    <input
                      type="text"
                      name="track.title"
                      value={trackRequirements.title}
                      onChange={handleInputChange}
                      required={showTrackRequirements}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Midnight Groove"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artist *
                    </label>
                    <input
                      type="text"
                      name="track.artist"
                      value={trackRequirements.artist}
                      onChange={handleInputChange}
                      required={showTrackRequirements}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., DJ Example"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Album
                    </label>
                    <input
                      type="text"
                      name="track.album"
                      value={trackRequirements.album}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Summer Vibes 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISRC Code
                    </label>
                    <input
                      type="text"
                      name="track.isrc"
                      value={trackRequirements.isrc}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., USRC12345678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      name="track.duration"
                      value={trackRequirements.duration}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="180"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BPM
                    </label>
                    <input
                      type="number"
                      name="track.bpm"
                      value={trackRequirements.bpm}
                      onChange={handleInputChange}
                      min="0"
                      max="200"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="128"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key
                    </label>
                    <input
                      type="text"
                      name="track.key"
                      value={trackRequirements.key}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Am"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mission Visibility */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Mission Visibility
          </h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="openMarket"
              name="openMarket"
              checked={formData.openMarket}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="openMarket" className="ml-2 block text-sm text-gray-900">
              Open to all runners (uncheck to restrict to team members only)
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Mission...' : 'Create Mission'}
          </button>
        </div>
      </form>
    </div>
  );
}
