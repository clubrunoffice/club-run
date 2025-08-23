import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Calendar, Users, DollarSign, Music, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface MissionData {
  eventDetails: {
    eventType: string;
    guestCount: number;
    eventDate: string;
    eventTime: string;
    address: string;
    venueName: string;
  };
  musicRequirements: {
    servicePack: string;
    duration: number;
    specialRequests: string;
  };
  budget: {
    min: number;
    max: number;
    suggested: number;
  };
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

interface MissionCreationWizardProps {
  onComplete: (missionData: MissionData) => void;
  onCancel: () => void;
}

const MissionCreationWizard: React.FC<MissionCreationWizardProps> = ({ onComplete, onCancel }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [missionData, setMissionData] = useState<MissionData>({
    eventDetails: {
      eventType: '',
      guestCount: 50,
      eventDate: '',
      eventTime: '',
      address: '',
      venueName: ''
    },
    musicRequirements: {
      servicePack: '',
      duration: 4,
      specialRequests: ''
    },
    budget: {
      min: 200,
      max: 800,
      suggested: 500
    },
    contactInfo: {
      name: user?.firstName || user?.email || '',
      phone: '',
      email: user?.email || ''
    }
  });

  const totalSteps = 4;

  const eventTypes = [
    { value: 'corporate', label: 'Corporate Event', icon: '🏢', avgBudget: 800 },
    { value: 'wedding', label: 'Wedding', icon: '💒', avgBudget: 1200 },
    { value: 'birthday', label: 'Birthday Party', icon: '🎂', avgBudget: 400 },
    { value: 'club', label: 'Club/Bar', icon: '🎧', avgBudget: 600 },
    { value: 'party', label: 'General Party', icon: '🎉', avgBudget: 350 },
    { value: 'concert', label: 'Concert/Show', icon: '🎤', avgBudget: 1500 }
  ];

  const servicePacks = [
    {
      id: 'basic',
      name: 'Basic DJ Package',
      price: '$200-400',
      includes: ['DJ + Sound System', '4 hours', 'Basic lighting', 'Music selection'],
      equipment: ['Professional sound system', 'Basic LED lights', 'Wireless microphone'],
      duration: 4
    },
    {
      id: 'premium',
      name: 'Premium DJ Package',
      price: '$500-800',
      includes: ['DJ + Premium Sound', '6 hours', 'LED lighting', 'MC services', 'Custom playlist'],
      equipment: ['High-end sound system', 'LED lighting rig', 'Wireless microphones', 'Fog machine'],
      duration: 6
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      price: '$1000+',
      includes: ['Full setup', '8 hours', 'Photo booth', 'Live streaming', 'Custom lighting design'],
      equipment: ['Professional sound system', 'Advanced lighting', 'Photo booth', 'Streaming equipment'],
      duration: 8
    }
  ];

  const calculateSuggestedBudget = (eventType: string, guestCount: number) => {
    const baseBudget = eventTypes.find(t => t.value === eventType)?.avgBudget || 500;
    const guestMultiplier = Math.max(0.8, Math.min(1.5, guestCount / 100));
    return Math.round(baseBudget * guestMultiplier);
  };

  const handleEventTypeChange = (eventType: string) => {
    const suggested = calculateSuggestedBudget(eventType, missionData.eventDetails.guestCount);
    setMissionData(prev => ({
      ...prev,
      eventDetails: { ...prev.eventDetails, eventType },
      budget: { ...prev.budget, suggested }
    }));
  };

  const handleGuestCountChange = (guestCount: number) => {
    const suggested = calculateSuggestedBudget(missionData.eventDetails.eventType, guestCount);
    setMissionData(prev => ({
      ...prev,
      eventDetails: { ...prev.eventDetails, guestCount },
      budget: { ...prev.budget, suggested }
    }));
  };

  const handleServicePackSelect = (packId: string) => {
    const pack = servicePacks.find(p => p.id === packId);
    if (pack) {
      setMissionData(prev => ({
        ...prev,
        musicRequirements: {
          ...prev.musicRequirements,
          servicePack: packId,
          duration: pack.duration
        }
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return missionData.eventDetails.eventType && 
               missionData.eventDetails.eventDate && 
               missionData.eventDetails.address;
      case 2:
        return missionData.musicRequirements.servicePack;
      case 3:
        return missionData.budget.min > 0 && missionData.budget.max >= missionData.budget.min;
      case 4:
        return missionData.contactInfo.name && missionData.contactInfo.phone;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
        <p className="text-gray-600 mb-6">Tell us about your event so we can find the perfect music service.</p>
      </div>

      {/* Event Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Event Type</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {eventTypes.map(type => (
            <button
              key={type.value}
              onClick={() => handleEventTypeChange(type.value)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                missionData.eventDetails.eventType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-medium text-gray-900">{type.label}</div>
              <div className="text-sm text-gray-500">Avg: ${type.avgBudget}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Guest Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="w-4 h-4 inline mr-1" />
          Expected Guest Count
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={missionData.eventDetails.guestCount}
          onChange={(e) => handleGuestCountChange(parseInt(e.target.value) || 50)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          This helps determine the appropriate sound system and service level.
        </p>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Event Date
          </label>
          <input
            type="date"
            value={missionData.eventDetails.eventDate}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              eventDetails: { ...prev.eventDetails, eventDate: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Event Time
          </label>
          <input
            type="time"
            value={missionData.eventDetails.eventTime}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              eventDetails: { ...prev.eventDetails, eventTime: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Venue Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Venue Name (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Atlanta Convention Center"
          value={missionData.eventDetails.venueName}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            eventDetails: { ...prev.eventDetails, venueName: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Venue Address
        </label>
        <input
          type="text"
          placeholder="Enter the full address"
          value={missionData.eventDetails.address}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            eventDetails: { ...prev.eventDetails, address: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          This helps runners calculate travel time and costs.
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Music Requirements</h3>
        <p className="text-gray-600 mb-6">Choose the service package that best fits your event.</p>
      </div>

      {/* Service Packages */}
      <div className="space-y-4">
        {servicePacks.map(pack => (
          <div
            key={pack.id}
            onClick={() => handleServicePackSelect(pack.id)}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-colors ${
              missionData.musicRequirements.servicePack === pack.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{pack.name}</h4>
                <p className="text-2xl font-bold text-blue-600">{pack.price}</p>
              </div>
              {missionData.musicRequirements.servicePack === pack.id && (
                <CheckCircle className="w-6 h-6 text-blue-500" />
              )}
            </div>
            
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Includes:</h5>
              <ul className="space-y-1">
                {pack.includes.map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Equipment:</h5>
              <div className="flex flex-wrap gap-2">
                {pack.equipment.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Music className="w-4 h-4 inline mr-1" />
          Special Requests (Optional)
        </label>
        <textarea
          placeholder="Any specific music preferences, special equipment needs, or other requirements..."
          value={missionData.musicRequirements.specialRequests}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            musicRequirements: { ...prev.musicRequirements, specialRequests: e.target.value }
          }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Pricing</h3>
        <p className="text-gray-600 mb-6">Set your budget range to help runners understand your expectations.</p>
      </div>

      {/* AI Budget Suggestion */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">AI</span>
          </div>
          <h4 className="font-medium text-gray-900">Budget Recommendation</h4>
        </div>
        <p className="text-sm text-gray-700">
          Based on similar {missionData.eventDetails.eventType} events with {missionData.eventDetails.guestCount} guests, 
          we recommend a budget range of <strong>${missionData.budget.suggested - 100}-${missionData.budget.suggested + 200}</strong> 
          for high-quality service within 24 hours.
        </p>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <DollarSign className="w-4 h-4 inline mr-1" />
          Your Budget Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum</label>
            <input
              type="number"
              min="100"
              max="2000"
              value={missionData.budget.min}
              onChange={(e) => setMissionData(prev => ({
                ...prev,
                budget: { ...prev.budget, min: parseInt(e.target.value) || 100 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum</label>
            <input
              type="number"
              min="100"
              max="2000"
              value={missionData.budget.max}
              onChange={(e) => setMissionData(prev => ({
                ...prev,
                budget: { ...prev.budget, max: parseInt(e.target.value) || 2000 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Higher budgets typically attract more experienced runners and faster response times.
        </p>
      </div>

      {/* Budget Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">💡 Budget Tips</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Include travel costs in your budget for runners outside your area</li>
          <li>• Higher budgets often result in better equipment and more experienced DJs</li>
          <li>• Consider tipping for exceptional service (typically 10-20%)</li>
          <li>• Weekends and holidays may have higher rates</li>
        </ul>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <p className="text-gray-600 mb-6">Provide your contact details so runners can reach you with questions.</p>
      </div>

      {/* Contact Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={missionData.contactInfo.name}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, name: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={missionData.contactInfo.phone}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, phone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={missionData.contactInfo.email}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, email: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Mission Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Mission Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Event:</span>
            <span className="font-medium">{eventTypes.find(t => t.value === missionData.eventDetails.eventType)?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{missionData.eventDetails.eventDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{missionData.eventDetails.guestCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{servicePacks.find(p => p.id === missionData.musicRequirements.servicePack)?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Budget:</span>
            <span className="font-medium">${missionData.budget.min}-${missionData.budget.max}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Music Mission</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {renderCurrentStep()}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            
            {currentStep === totalSteps ? (
              <button
                onClick={() => onComplete(missionData)}
                disabled={!canProceed()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Post Mission
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionCreationWizard;
