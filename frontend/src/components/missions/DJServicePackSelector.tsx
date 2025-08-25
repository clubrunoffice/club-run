import React, { useState } from 'react';
import { 
  Music, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Star, 
  Zap, 
  Users, 
  Camera, 
  Video, 
  Lightbulb,
  Mic,
  Headphones,
  Speaker,
  Wifi,
  Shield,
  Award
} from 'lucide-react';

export interface DJServicePack {
  id: string;
  name: string;
  price: number;
  priceRange: string;
  duration: number;
  includes: string[];
  equipment: string[];
  features: string[];
  perDiem: number;
  maxGuests: number;
  setupTime: number;
  breakdownTime: number;
  insurance: boolean;
  backupEquipment: boolean;
  customPlaylist: boolean;
  mcServices: boolean;
  photoBooth: boolean;
  liveStreaming: boolean;
  lightingDesign: boolean;
  fogMachine: boolean;
  wirelessMics: number;
  speakers: string;
  subwoofers: boolean;
  djBooth: boolean;
  rating: number;
  reviews: number;
  popular: boolean;
  recommended: boolean;
}

interface DJServicePackSelectorProps {
  selectedPack?: string;
  onPackSelect: (pack: DJServicePack) => void;
  eventType?: string;
  guestCount?: number;
  showDetails?: boolean;
  className?: string;
}

const DJServicePackSelector: React.FC<DJServicePackSelectorProps> = ({
  selectedPack,
  onPackSelect,
  eventType,
  guestCount,
  showDetails = true,
  className = ''
}) => {
  const [hoveredPack, setHoveredPack] = useState<string | null>(null);

  const servicePacks: DJServicePack[] = [
    {
      id: 'starter',
      name: 'Starter DJ Package',
      price: 250,
      priceRange: '$200-300',
      duration: 4,
      includes: [
        'Professional DJ',
        'Basic Sound System',
        '4 Hours of Music',
        'Basic Lighting',
        'Music Selection'
      ],
      equipment: [
        'Professional sound system (2 speakers)',
        'Basic LED lights',
        'Wireless microphone',
        'DJ controller',
        'Music library access'
      ],
      features: [
        'Professional DJ service',
        'Basic sound system',
        '4 hours of continuous music',
        'Basic lighting effects',
        'Music selection from library'
      ],
      perDiem: 250,
      maxGuests: 100,
      setupTime: 30,
      breakdownTime: 30,
      insurance: false,
      backupEquipment: false,
      customPlaylist: false,
      mcServices: false,
      photoBooth: false,
      liveStreaming: false,
      lightingDesign: false,
      fogMachine: false,
      wirelessMics: 1,
      speakers: '2x 1000W Speakers',
      subwoofers: false,
      djBooth: false,
      rating: 4.2,
      reviews: 45,
      popular: false,
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional DJ Package',
      price: 450,
      priceRange: '$400-500',
      duration: 6,
      includes: [
        'Professional DJ',
        'Premium Sound System',
        '6 Hours of Music',
        'LED Lighting Rig',
        'MC Services',
        'Custom Playlist'
      ],
      equipment: [
        'High-end sound system (4 speakers)',
        'LED lighting rig',
        'Wireless microphones (2)',
        'Fog machine',
        'DJ controller',
        'Custom playlist creation'
      ],
      features: [
        'Professional DJ service',
        'Premium sound system',
        '6 hours of continuous music',
        'Advanced lighting effects',
        'MC services included',
        'Custom playlist creation',
        'Fog machine effects'
      ],
      perDiem: 450,
      maxGuests: 200,
      setupTime: 45,
      breakdownTime: 45,
      insurance: true,
      backupEquipment: true,
      customPlaylist: true,
      mcServices: true,
      photoBooth: false,
      liveStreaming: false,
      lightingDesign: false,
      fogMachine: true,
      wirelessMics: 2,
      speakers: '4x 1500W Speakers',
      subwoofers: true,
      djBooth: true,
      rating: 4.6,
      reviews: 128,
      popular: true,
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium DJ Package',
      price: 750,
      priceRange: '$700-800',
      duration: 8,
      includes: [
        'Professional DJ',
        'Premium Sound System',
        '8 Hours of Music',
        'Advanced Lighting Design',
        'MC Services',
        'Custom Playlist',
        'Photo Booth',
        'Live Streaming'
      ],
      equipment: [
        'Professional sound system (6 speakers)',
        'Advanced lighting design',
        'Wireless microphones (3)',
        'Fog machine',
        'Photo booth',
        'Live streaming equipment',
        'DJ controller',
        'Custom playlist creation'
      ],
      features: [
        'Professional DJ service',
        'Premium sound system',
        '8 hours of continuous music',
        'Advanced lighting design',
        'MC services included',
        'Custom playlist creation',
        'Photo booth included',
        'Live streaming capability',
        'Fog machine effects'
      ],
      perDiem: 750,
      maxGuests: 300,
      setupTime: 60,
      breakdownTime: 60,
      insurance: true,
      backupEquipment: true,
      customPlaylist: true,
      mcServices: true,
      photoBooth: true,
      liveStreaming: true,
      lightingDesign: true,
      fogMachine: true,
      wirelessMics: 3,
      speakers: '6x 2000W Speakers',
      subwoofers: true,
      djBooth: true,
      rating: 4.8,
      reviews: 89,
      popular: true,
      recommended: false
    },
    {
      id: 'luxury',
      name: 'Luxury DJ Package',
      price: 1200,
      priceRange: '$1000+',
      duration: 10,
      includes: [
        'Professional DJ',
        'Luxury Sound System',
        '10 Hours of Music',
        'Custom Lighting Design',
        'MC Services',
        'Custom Playlist',
        'Photo Booth',
        'Live Streaming',
        'VIP Setup',
        'Dedicated Sound Engineer'
      ],
      equipment: [
        'Luxury sound system (8 speakers)',
        'Custom lighting design',
        'Wireless microphones (4)',
        'Fog machine',
        'Photo booth',
        'Live streaming equipment',
        'VIP setup',
        'Dedicated sound engineer',
        'DJ controller',
        'Custom playlist creation'
      ],
      features: [
        'Professional DJ service',
        'Luxury sound system',
        '10 hours of continuous music',
        'Custom lighting design',
        'MC services included',
        'Custom playlist creation',
        'Photo booth included',
        'Live streaming capability',
        'VIP setup included',
        'Dedicated sound engineer',
        'Fog machine effects'
      ],
      perDiem: 1200,
      maxGuests: 500,
      setupTime: 90,
      breakdownTime: 90,
      insurance: true,
      backupEquipment: true,
      customPlaylist: true,
      mcServices: true,
      photoBooth: true,
      liveStreaming: true,
      lightingDesign: true,
      fogMachine: true,
      wirelessMics: 4,
      speakers: '8x 2500W Speakers',
      subwoofers: true,
      djBooth: true,
      rating: 4.9,
      reviews: 67,
      popular: false,
      recommended: false
    }
  ];

  const getPackIcon = (packId: string) => {
    switch (packId) {
      case 'starter':
        return <Music className="w-6 h-6" />;
      case 'professional':
        return <Star className="w-6 h-6" />;
      case 'premium':
        return <Zap className="w-6 h-6" />;
      case 'luxury':
        return <Award className="w-6 h-6" />;
      default:
        return <Music className="w-6 h-6" />;
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

  const isRecommendedForEvent = (pack: DJServicePack) => {
    if (!eventType || !guestCount) return false;
    
    switch (eventType) {
      case 'corporate':
        return pack.id === 'professional' || pack.id === 'premium';
      case 'wedding':
        return pack.id === 'premium' || pack.id === 'luxury';
      case 'club':
        return pack.id === 'professional' || pack.id === 'premium';
      case 'concert':
        return pack.id === 'luxury';
      default:
        return pack.id === 'professional';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your DJ Service Pack</h2>
        <p className="text-gray-600">Select the perfect package for your event</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {servicePacks.map((pack) => (
          <div
            key={pack.id}
            className={`relative rounded-lg border-2 transition-all duration-300 cursor-pointer ${
              selectedPack === pack.id
                ? 'border-blue-500 shadow-lg scale-105'
                : hoveredPack === pack.id
                ? 'border-gray-300 shadow-md scale-102'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onMouseEnter={() => setHoveredPack(pack.id)}
            onMouseLeave={() => setHoveredPack(null)}
            onClick={() => onPackSelect(pack)}
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {pack.popular && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Popular
                </span>
              )}
              {pack.recommended && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Recommended
                </span>
              )}
              {isRecommendedForEvent(pack) && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Perfect for {eventType}
                </span>
              )}
            </div>

            {/* Header */}
            <div className={`bg-gradient-to-r ${getPackColor(pack.id)} text-white p-6 rounded-t-lg`}>
              <div className="flex items-center justify-between mb-2">
                {getPackIcon(pack.id)}
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm">{pack.rating}</span>
                  <span className="text-xs opacity-75 ml-1">({pack.reviews})</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">{pack.name}</h3>
              <p className="text-2xl font-bold mt-2">${pack.price}</p>
              <p className="text-sm opacity-75">{pack.priceRange}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Duration */}
              <div className="flex items-center mb-4">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{pack.duration} hours</span>
              </div>

              {/* Max Guests */}
              <div className="flex items-center mb-4">
                <Users className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Up to {pack.maxGuests} guests</span>
              </div>

              {/* Per Diem */}
              <div className="flex items-center mb-4">
                <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">${pack.perDiem}/day per diem</span>
              </div>

              {/* Includes */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                <ul className="space-y-1">
                  {pack.includes.slice(0, 4).map((item, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                  {pack.includes.length > 4 && (
                    <li className="text-sm text-gray-500">
                      +{pack.includes.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Equipment Preview */}
              {showDetails && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Equipment:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Speaker className="w-3 h-3 mr-1" />
                      {pack.speakers}
                    </div>
                    {pack.subwoofers && (
                      <div className="flex items-center">
                        <Headphones className="w-3 h-3 mr-1" />
                        Subwoofers
                      </div>
                    )}
                    <div className="flex items-center">
                      <Mic className="w-3 h-3 mr-1" />
                      {pack.wirelessMics} Wireless Mics
                    </div>
                    {pack.fogMachine && (
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        Fog Machine
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              {showDetails && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {pack.customPlaylist && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Custom Playlist</span>
                    )}
                    {pack.mcServices && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">MC Services</span>
                    )}
                    {pack.photoBooth && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Photo Booth</span>
                    )}
                    {pack.liveStreaming && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Live Stream</span>
                    )}
                    {pack.insurance && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Insurance</span>
                    )}
                    {pack.backupEquipment && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Backup Gear</span>
                    )}
                  </div>
                </div>
              )}

              {/* Setup Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>Setup: {pack.setupTime} min</div>
                <div>Breakdown: {pack.breakdownTime} min</div>
              </div>
            </div>

            {/* Select Button */}
            <div className="p-6 pt-0">
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  selectedPack === pack.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPack === pack.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Comparison */}
      {showDetails && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Detailed Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left">Feature</th>
                  {servicePacks.map((pack) => (
                    <th key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Price</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      ${pack.price}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Duration</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.duration} hours
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Max Guests</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.maxGuests}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Per Diem</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      ${pack.perDiem}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Custom Playlist</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.customPlaylist ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">MC Services</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.mcServices ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Photo Booth</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.photoBooth ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Live Streaming</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.liveStreaming ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Insurance</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.insurance ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Backup Equipment</td>
                  {servicePacks.map((pack) => (
                    <td key={pack.id} className="border border-gray-200 p-3 text-center">
                      {pack.backupEquipment ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DJServicePackSelector;
