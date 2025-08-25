import React from 'react';
import { X, Music, Clock, DollarSign, Users, CheckCircle, Star, Zap, Award, Mic, Headphones, Speaker, Camera, Video, Lightbulb, Shield } from 'lucide-react';
import { DJServicePack } from './DJServicePackSelector';

interface DJServicePackModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePack: DJServicePack | null;
  missionId?: string;
}

const DJServicePackModal: React.FC<DJServicePackModalProps> = ({
  isOpen,
  onClose,
  servicePack,
  missionId
}) => {
  if (!isOpen || !servicePack) return null;

  const getPackIcon = (packId: string) => {
    switch (packId) {
      case 'starter':
        return <Music className="w-8 h-8" />;
      case 'professional':
        return <Star className="w-8 h-8" />;
      case 'premium':
        return <Zap className="w-8 h-8" />;
      case 'luxury':
        return <Award className="w-8 h-8" />;
      default:
        return <Music className="w-8 h-8" />;
    }
  };

  const getPackColor = (packId: string) => {
    switch (packId) {
      case 'starter':
        return 'from-blue-500 to-blue-600';
      case 'professional':
        return 'from-green-500 to-green-600';
      case 'premium':
        return 'from-purple-500 to-purple-600';
      case 'luxury':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getPackColor(servicePack.id)} text-white p-6 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getPackIcon(servicePack.id)}
              <div>
                <h2 className="text-2xl font-bold">{servicePack.name}</h2>
                <p className="text-lg opacity-90">{servicePack.priceRange}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Rating */}
          <div className="flex items-center mt-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(servicePack.rating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm opacity-90">
              {servicePack.rating} ({servicePack.reviews} reviews)
            </span>
            {servicePack.popular && (
              <span className="ml-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
            {servicePack.recommended && (
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Recommended
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mission Info */}
          {missionId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Mission Information</h3>
              <p className="text-blue-700">Mission ID: {missionId}</p>
              <p className="text-blue-700">This service pack is linked to your mission expenses</p>
            </div>
          )}

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">{servicePack.duration} Hours</p>
                <p className="text-sm text-gray-600">Performance Duration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900">Up to {servicePack.maxGuests}</p>
                <p className="text-sm text-gray-600">Maximum Guests</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="font-semibold text-gray-900">${servicePack.perDiem}/day</p>
                <p className="text-sm text-gray-600">Per Diem Allowance</p>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicePack.includes.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Equipment & Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Audio Equipment</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Speaker className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{servicePack.speakers}</span>
                  </div>
                  {servicePack.subwoofers && (
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Subwoofers Included</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{servicePack.wirelessMics} Wireless Microphones</span>
                  </div>
                  {servicePack.djBooth && (
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Professional DJ Booth</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Additional Features</h4>
                <div className="space-y-2">
                  {servicePack.fogMachine && (
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700">Fog Machine Effects</span>
                    </div>
                  )}
                  {servicePack.lightingDesign && (
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700">Custom Lighting Design</span>
                    </div>
                  )}
                  {servicePack.photoBooth && (
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-pink-500" />
                      <span className="text-gray-700">Photo Booth</span>
                    </div>
                  )}
                  {servicePack.liveStreaming && (
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700">Live Streaming</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Services & Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicePack.customPlaylist && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Music className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Custom Playlist</p>
                    <p className="text-sm text-gray-600">Personalized music selection</p>
                  </div>
                </div>
              )}
              {servicePack.mcServices && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Mic className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-900">MC Services</p>
                    <p className="text-sm text-gray-600">Professional emcee included</p>
                  </div>
                </div>
              )}
              {servicePack.insurance && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Insurance</p>
                    <p className="text-sm text-gray-600">Full coverage included</p>
                  </div>
                </div>
              )}
              {servicePack.backupEquipment && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Speaker className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Backup Equipment</p>
                    <p className="text-sm text-gray-600">Redundant gear available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Setup Information */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Setup & Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{servicePack.setupTime} minutes</p>
                <p className="text-sm text-gray-600">Setup Time</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Music className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{servicePack.duration} hours</p>
                <p className="text-sm text-gray-600">Performance Time</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{servicePack.breakdownTime} minutes</p>
                <p className="text-sm text-gray-600">Breakdown Time</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-gray-900">${servicePack.price}</p>
                <p className="text-gray-600">Base Package Price</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">${servicePack.perDiem}</p>
                <p className="text-gray-600">Daily Per Diem Allowance</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This per diem allowance covers all expenses related to this service pack, 
                including equipment, travel, and incidentals. Any expenses exceeding this amount will require 
                additional approval.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Need to modify this package? Contact your mission coordinator.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJServicePackModal;
