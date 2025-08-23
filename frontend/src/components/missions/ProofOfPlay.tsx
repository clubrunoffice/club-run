import React, { useState, useRef } from 'react';
import { Camera, MapPin, Mic, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ProofOfPlayProps {
  missionId: string;
  venueAddress: string;
  onProofSubmitted: (proof: ProofData) => void;
  onCancel: () => void;
}

interface ProofData {
  missionId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  photos: string[];
  audioSnippet?: string;
  notes: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

const ProofOfPlay: React.FC<ProofOfPlayProps> = ({ missionId, venueAddress, onProofSubmitted, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<'location' | 'photo' | 'audio' | 'notes' | 'submit'>('location');
  const [proofData, setProofData] = useState<Partial<ProofData>>({
    missionId,
    timestamp: new Date().toISOString(),
    location: undefined,
    photos: [],
    audioSnippet: undefined,
    notes: '',
    verificationStatus: 'pending'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 'location', title: 'Location Verification', icon: MapPin },
    { id: 'photo', title: 'Photo Evidence', icon: Camera },
    { id: 'audio', title: 'Audio Snippet', icon: Mic },
    { id: 'notes', title: 'Mission Notes', icon: Upload },
    { id: 'submit', title: 'Submit Proof', icon: CheckCircle }
  ];

  const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number; accuracy: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const handleLocationCapture = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const location = await getCurrentLocation();
      setProofData(prev => ({ ...prev, location }));
      setCurrentStep('photo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Location capture failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setProofData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...newPhotos]
      }));
    }
  };

  const handleAudioCapture = () => {
    audioInputRef.current?.click();
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const audioFile = files[0];
      setProofData(prev => ({
        ...prev,
        audioSnippet: URL.createObjectURL(audioFile)
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalProof: ProofData = {
        ...proofData,
        missionId,
        timestamp: new Date().toISOString(),
        verificationStatus: 'pending'
      } as ProofData;
      
      onProofSubmitted(finalProof);
    } catch (err) {
      setError('Failed to submit proof. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLocationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Verification</h3>
        <p className="text-gray-600">We need to verify you're at the correct venue</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Venue Address</span>
        </div>
        <p className="text-gray-600 text-sm">{venueAddress}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleLocationCapture}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Getting Location...</span>
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            <span>Capture Current Location</span>
          </>
        )}
      </button>
    </div>
  );

  const renderPhotoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Photo Evidence</h3>
        <p className="text-gray-600">Take photos of the venue and your setup</p>
      </div>

      {proofData.photos && proofData.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {proofData.photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Proof photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => setProofData(prev => ({
                  ...prev,
                  photos: prev.photos?.filter((_, i) => i !== index) || []
                }))}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handlePhotoCapture}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
      >
        <Camera className="w-5 h-5" />
        <span>Add Photos</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );

  const renderAudioStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mic className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Audio Snippet (Optional)</h3>
        <p className="text-gray-600">Record a short audio clip of the music being played</p>
      </div>

      {proofData.audioSnippet && (
        <div className="bg-gray-50 rounded-lg p-4">
          <audio controls className="w-full">
            <source src={proofData.audioSnippet} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <button
        onClick={handleAudioCapture}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
      >
        <Mic className="w-5 h-5" />
        <span>{proofData.audioSnippet ? 'Replace Audio' : 'Record Audio'}</span>
      </button>

      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        className="hidden"
      />
    </div>
  );

  const renderNotesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission Notes</h3>
        <p className="text-gray-600">Add any additional details about the mission</p>
      </div>

      <textarea
        value={proofData.notes || ''}
        onChange={(e) => setProofData(prev => ({ ...prev, notes: e.target.value }))}
        placeholder="Describe the mission execution, crowd response, any issues encountered..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const renderSubmitStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Proof</h3>
        <p className="text-gray-600">Review and submit your mission proof</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Location Captured</span>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Photos Added</span>
          <span className="text-sm font-medium">{proofData.photos?.length || 0} photos</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Audio Snippet</span>
          {proofData.audioSnippet ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <span className="text-sm text-gray-400">Optional</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Notes</span>
          <span className="text-sm font-medium">{proofData.notes?.length || 0} characters</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Submitting Proof...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Submit Proof of Play</span>
          </>
        )}
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'location': return renderLocationStep();
      case 'photo': return renderPhotoStep();
      case 'audio': return renderAudioStep();
      case 'notes': return renderNotesStep();
      case 'submit': return renderSubmitStep();
      default: return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'location': return proofData.location;
      case 'photo': return proofData.photos && proofData.photos.length > 0;
      case 'audio': return true; // Optional
      case 'notes': return true; // Optional
      case 'submit': return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (canProceed()) {
      const stepIndex = steps.findIndex(step => step.id === currentStep);
      if (stepIndex < steps.length - 1) {
        setCurrentStep(steps[stepIndex + 1].id as any);
      }
    }
  };

  const prevStep = () => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id as any);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Proof of Play</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
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
            disabled={currentStep === 'location'}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep !== 'submit' && (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProofOfPlay;
