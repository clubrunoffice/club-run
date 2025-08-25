import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Music, Clock, CheckCircle, ArrowRight, ArrowLeft, Phone, User } from 'lucide-react';
import { DJServicePack } from './DJServicePackSelector';

interface MissionData {
  clubDetails: {
    clubName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    clubHours: string;
    contactPhone: string;
  };
  clientDetails: {
    clientName: string;
    artistName: string;
    contactPhone: string;
    contactEmail: string;
  };
  musicRequirements: {
    servicePack: string;
    duration: number;
    specialRequests: string;
    selectedPack?: DJServicePack;
    servicePackLink?: string;
  };
  budget: {
    min: number;
    max: number;
    suggested: number;
  };
}

interface MissionCreationWizardProps {
  onComplete: (missionData: MissionData) => void;
  onCancel: () => void;
}

const MissionCreationWizard: React.FC<MissionCreationWizardProps> = ({ onComplete, onCancel }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Debug log to verify component is loading correctly
  console.log('MissionCreationWizard loaded with totalSteps:', 4);
  
  const [missionData, setMissionData] = useState<MissionData>({
    clubDetails: {
      clubName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      clubHours: '',
      contactPhone: ''
    },
    clientDetails: {
      clientName: '',
      artistName: '',
      contactPhone: '',
      contactEmail: user?.email || ''
    },
    musicRequirements: {
      servicePack: '',
      duration: 4,
      specialRequests: '',
      selectedPack: undefined,
      servicePackLink: ''
    },
    budget: {
      min: 200,
      max: 800,
      suggested: 500
    }
  });

  const totalSteps = 4;



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
        return missionData.clubDetails.clubName && 
               missionData.clubDetails.address && 
               missionData.clubDetails.clubHours;
      case 2:
        return missionData.clientDetails.clientName && 
               missionData.clientDetails.artistName;
      case 3:
        return missionData.musicRequirements.duration > 0;
      case 4:
        return missionData.musicRequirements.servicePackLink;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Club Location & Details</h3>
        <p className="text-gray-600 mb-6">Provide the club location and contact information for RUNNERS to complete the mission.</p>
        
        {/* Requirements Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-3">Your 3 Requirements:</h4>
          <div className="space-y-2">
            <div className="flex items-center text-blue-800">
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2">1</span>
              <span>Club Name * (required)</span>
            </div>
            <div className="flex items-center text-blue-800">
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2">2</span>
              <span>Street Address * (required)</span>
            </div>
            <div className="flex items-center text-blue-800">
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2">3</span>
              <span>Club Hours * (required) ← Your #3 requirement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Club Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Club Name *
        </label>
        <input
          type="text"
          value={missionData.clubDetails.clubName}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            clubDetails: { ...prev.clubDetails, clubName: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter club name"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Street Address *
        </label>
        <input
          type="text"
          value={missionData.clubDetails.address}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            clubDetails: { ...prev.clubDetails, address: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter street address"
        />
      </div>

      {/* City, State, Zip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={missionData.clubDetails.city}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              clubDetails: { ...prev.clubDetails, city: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={missionData.clubDetails.state}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              clubDetails: { ...prev.clubDetails, state: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
          <input
            type="text"
            value={missionData.clubDetails.zipCode}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              clubDetails: { ...prev.clubDetails, zipCode: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="ZIP Code"
          />
        </div>
      </div>

      {/* Club Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          Club Hours *
        </label>
        <input
          type="text"
          value={missionData.clubDetails.clubHours}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            clubDetails: { ...prev.clubDetails, clubHours: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 9:00 PM - 2:00 AM, Tuesday - Saturday"
        />
        <p className="text-sm text-gray-500 mt-1">
          This helps RUNNERS know when the club is open for the mission.
        </p>
      </div>

      {/* Club Contact Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-1" />
          Club Contact Phone
        </label>
        <input
          type="tel"
          value={missionData.clubDetails.contactPhone}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            clubDetails: { ...prev.clubDetails, contactPhone: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter club contact phone"
        />
      </div>

      {/* Step 1 Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Step 1 Summary:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Club Name:</span>
            <span className="font-medium">{missionData.clubDetails.clubName || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-medium">{missionData.clubDetails.address || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Club Hours:</span>
            <span className="font-medium">{missionData.clubDetails.clubHours || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Client & Artist Information</h3>
        <p className="text-gray-600 mb-6">Provide client and artist details for the RUNNERS to contact.</p>
        
        {/* Requirements Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-900 mb-3">Your 2 Requirements:</h4>
          <div className="space-y-2">
            <div className="flex items-center text-green-800">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">1</span>
              <span>Client Name * (required)</span>
            </div>
            <div className="flex items-center text-green-800">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">2</span>
              <span>Artist Name * (required)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Client Name *
        </label>
        <input
          type="text"
          value={missionData.clientDetails.clientName}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            clientDetails: { ...prev.clientDetails, clientName: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter client name"
        />
      </div>

      {/* Artist Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Music className="w-4 h-4 inline mr-1" />
          Artist Name *
        </label>
        <input
          type="text"
          value={missionData.clientDetails.artistName}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            clientDetails: { ...prev.clientDetails, artistName: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter artist name"
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Contact Phone
          </label>
          <input
            type="tel"
            value={missionData.clientDetails.contactPhone}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              clientDetails: { ...prev.clientDetails, contactPhone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter contact phone"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Contact Email
          </label>
          <input
            type="email"
            value={missionData.clientDetails.contactEmail}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              clientDetails: { ...prev.clientDetails, contactEmail: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter contact email"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Important Note</h4>
        <p className="text-blue-800 text-sm">
          <strong>ONLY RUNNERS can be assigned to missions.</strong> This information will be provided to RUNNERS 
          so they can contact the client and artist to coordinate the mission details.
        </p>
      </div>

      {/* Step 2 Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Step 2 Summary:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Client Name:</span>
            <span className="font-medium">{missionData.clientDetails.clientName || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Artist Name:</span>
            <span className="font-medium">{missionData.clientDetails.artistName || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Mission Requirements</h3>
        <p className="text-gray-600 mb-6">Provide additional mission requirements and special requests for RUNNERS.</p>
        
        {/* Requirements Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-purple-900 mb-3">Mission Requirements:</h4>
          <div className="space-y-2">
            <div className="flex items-center text-purple-800">
              <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mr-2">1</span>
              <span>Expected Mission Duration (Hours) * (required)</span>
            </div>
            <div className="flex items-center text-purple-800">
              <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mr-2">2</span>
              <span>Special Requests (Optional)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          Expected Mission Duration (Hours)
        </label>
        <input
          type="number"
          min="1"
          max="24"
          value={missionData.musicRequirements.duration}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            musicRequirements: { ...prev.musicRequirements, duration: parseInt(e.target.value) || 4 }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="4"
        />
        <p className="text-sm text-gray-500 mt-1">
          This helps RUNNERS understand the time commitment required.
        </p>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Music className="w-4 h-4 inline mr-1" />
          Special Requests (Optional)
        </label>
        <textarea
          placeholder="Any specific music preferences, special equipment needs, venue requirements, or other special instructions..."
          value={missionData.musicRequirements.specialRequests}
          onChange={(e) => setMissionData(prev => ({
            ...prev,
            musicRequirements: { ...prev.musicRequirements, specialRequests: e.target.value }
          }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          These details will be provided to RUNNERS to ensure they can meet all requirements.
        </p>
      </div>

      {/* Mission Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Mission Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Club:</span>
            <span className="text-blue-900">{missionData.clubDetails.clubName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Client:</span>
            <span className="text-blue-900">{missionData.clientDetails.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Artist:</span>
            <span className="text-blue-900">{missionData.clientDetails.artistName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Duration:</span>
            <span className="text-blue-900">{missionData.musicRequirements.duration} hours</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Next Step</h4>
        <p className="text-yellow-800 text-sm">
          In the next step, you'll provide the DJ service package link that RUNNERS will use to access 
          complete service details, equipment specifications, and pricing information.
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 4: DJ Service Package Link</h3>
        <p className="text-gray-600 mb-6">Provide the DJ service package link for RUNNERS to access detailed information.</p>
        
        {/* Requirements Card */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-orange-900 mb-3">CLIENT/CURATOR Requirement:</h4>
          <div className="space-y-2">
            <div className="flex items-center text-orange-800">
              <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-2">1</span>
              <span>DJ Service Package Link * (required)</span>
            </div>
            <p className="text-orange-700 text-sm mt-2">
              <strong>CLIENT/CURATOR provides the link</strong> - RUNNERS will access this link to view complete service details, 
              equipment specifications, pricing, and per diem allowances.
            </p>
          </div>
        </div>
      </div>

      {/* Service Pack Link */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Music className="w-4 h-4 inline mr-1" />
            DJ Service Package Link *
          </label>
          <input
            type="url"
            value={missionData.musicRequirements.servicePackLink}
            onChange={(e) => setMissionData(prev => ({
              ...prev,
              musicRequirements: { ...prev.musicRequirements, servicePackLink: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/dj-service-package"
          />
          <p className="text-sm text-gray-500 mt-1">
            This link will be provided to RUNNERS so they can view the complete service package details.
          </p>
        </div>

        {missionData.musicRequirements.servicePackLink && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Service Package Link Preview</h4>
            <p className="text-blue-800 text-sm mb-2">
              RUNNERS will access this link to view:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Complete equipment specifications</li>
              <li>• Service duration and pricing</li>
              <li>• Per diem allowances</li>
              <li>• Feature requirements</li>
              <li>• Setup and breakdown times</li>
            </ul>
          </div>
        )}
      </div>

      {/* Mission Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Mission Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Club:</span>
            <span className="font-medium">{missionData.clubDetails.clubName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{missionData.clubDetails.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hours:</span>
            <span className="font-medium">{missionData.clubDetails.clubHours}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Client:</span>
            <span className="font-medium">{missionData.clientDetails.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Artist:</span>
            <span className="font-medium">{missionData.clientDetails.artistName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{missionData.musicRequirements.duration} hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Link:</span>
            <span className="font-medium">{missionData.musicRequirements.servicePackLink ? 'Provided' : 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Mission Ready</h4>
        <p className="text-green-800 text-sm">
          <strong>ONLY RUNNERS will be assigned to this mission.</strong> The DJ service package link will be provided 
          to RUNNERS so they can access complete service details and requirements.
        </p>
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Music Mission</h2>
            <p className="text-sm text-blue-600 mt-1">Updated: 4-Step Process with DJ Service Package Link</p>
          </div>
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
              Step {currentStep} of {totalSteps} - {currentStep === 1 ? 'Club Location' : currentStep === 2 ? 'Client/Artist Info' : currentStep === 3 ? 'Mission Requirements' : 'DJ Service Package Link'}
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
