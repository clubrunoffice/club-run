import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Music, 
  Star,
  Zap,
  User,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { djVerificationService, VerificationRequest } from '../../services/verification/DJVerificationService';

interface DJVerificationButtonProps {
  userId: string;
  userRole: string;
  userEmail: string;
  onVerificationUpdate?: (request: VerificationRequest) => void;
}

const DJVerificationButton: React.FC<DJVerificationButtonProps> = ({
  userId,
  userRole,
  userEmail,
  onVerificationUpdate
}) => {
  const [eligibility, setEligibility] = useState<any>(null);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkEligibility();
    checkVerificationStatus();
  }, [userId, userRole]);

  const checkEligibility = async () => {
    try {
      setIsLoading(true);
      const result = await djVerificationService.checkEligibility(userId, userRole);
      setEligibility(result);
    } catch (error) {
      console.error('Failed to check eligibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      const status = await djVerificationService.getVerificationStatus(userId);
      setVerificationRequest(status);
    } catch (error) {
      console.error('Failed to check verification status:', error);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      setIsSubmitting(true);
      const request = await djVerificationService.submitVerificationRequest(
        userId,
        userEmail,
        userRole
      );
      setVerificationRequest(request);
      onVerificationUpdate?.(request);
      
      // Simulate auto-approval for demo purposes
      setTimeout(async () => {
        try {
          const approvedRequest = await djVerificationService.autoApproveVerification(request.id);
          setVerificationRequest(approvedRequest);
          onVerificationUpdate?.(approvedRequest);
        } catch (error) {
          console.error('Auto-approval failed:', error);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to submit verification:', error);
      alert(`Verification submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    if (verificationRequest) {
      switch (verificationRequest.status) {
        case 'approved':
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'rejected':
          return <XCircle className="w-5 h-5 text-red-500" />;
        case 'in_review':
          return <Clock className="w-5 h-5 text-yellow-500" />;
        default:
          return <Clock className="w-5 h-5 text-blue-500" />;
      }
    }
    return null;
  };

  const getStatusText = () => {
    if (verificationRequest) {
      switch (verificationRequest.status) {
        case 'approved':
          return 'Verified DJ';
        case 'rejected':
          return 'Verification Rejected';
        case 'in_review':
          return 'Under Review';
        default:
          return 'Pending Review';
      }
    }
    return null;
  };

  const getButtonVariant = () => {
    if (verificationRequest?.status === 'approved') {
      return 'bg-green-600 hover:bg-green-700 text-white';
    }
    if (verificationRequest?.status === 'rejected') {
      return 'bg-red-600 hover:bg-red-700 text-white';
    }
    if (verificationRequest?.status === 'in_review' || verificationRequest?.status === 'pending') {
      return 'bg-yellow-600 hover:bg-yellow-700 text-white';
    }
    if (eligibility?.eligible) {
      return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white';
    }
    return 'bg-gray-600 hover:bg-gray-700 text-white';
  };

  const getButtonText = () => {
    if (verificationRequest?.status === 'approved') {
      return 'Verified DJ';
    }
    if (verificationRequest?.status === 'rejected') {
      return 'Reapply for Verification';
    }
    if (verificationRequest?.status === 'in_review' || verificationRequest?.status === 'pending') {
      return 'Verification Pending';
    }
    if (eligibility?.eligible) {
      return 'Become Verified DJ';
    }
    return 'Check Eligibility';
  };

  const getButtonIcon = () => {
    if (verificationRequest?.status === 'approved') {
      return <Shield className="w-4 h-4" />;
    }
    if (eligibility?.eligible) {
      return <Zap className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  if (userRole === 'VERIFIED_DJ') {
    return (
      <div className="bg-green-600 bg-opacity-20 border border-green-400 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-green-400 mr-2" />
          <span className="text-green-400 font-semibold">Already Verified DJ</span>
        </div>
        <p className="text-green-300 text-sm mt-1">
          You have access to Serato integration and enhanced features.
        </p>
      </div>
    );
  }

  if (userRole !== 'DJ') {
    return (
      <div className="bg-gray-600 bg-opacity-20 border border-gray-400 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-400 font-semibold">DJ Role Required</span>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          You must be a DJ to apply for verified status.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Button */}
      <button
        onClick={() => {
          if (eligibility?.eligible && !verificationRequest) {
            handleSubmitVerification();
          } else if (verificationRequest?.status === 'rejected') {
            handleSubmitVerification();
          } else {
            setShowDetails(!showDetails);
          }
        }}
        disabled={isLoading || isSubmitting || (verificationRequest?.status === 'pending' || verificationRequest?.status === 'in_review')}
        className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${getButtonVariant()} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading || isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          getStatusIcon() || getButtonIcon()
        )}
        <span className="ml-2">
          {isSubmitting ? 'Submitting...' : getButtonText()}
        </span>
      </button>

      {/* Status Display */}
      {verificationRequest && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="ml-2 text-white font-semibold">{getStatusText()}</span>
            </div>
            <span className="text-gray-400 text-sm">
              {verificationRequest.submissionDate.toLocaleDateString()}
            </span>
          </div>
          {verificationRequest.notes && (
            <p className="text-gray-300 text-sm mt-2">{verificationRequest.notes}</p>
          )}
        </div>
      )}

      {/* Eligibility Details */}
      {showDetails && eligibility && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Verification Requirements</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Music className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-gray-300 text-sm">Music Submissions:</span>
              <span className={`ml-auto font-semibold ${
                eligibility.requirements.musicSubmissions >= eligibility.criteria.minMusicSubmissions 
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                {eligibility.requirements.musicSubmissions}/{eligibility.criteria.minMusicSubmissions}
              </span>
            </div>
            
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-gray-300 text-sm">Playlist Creations:</span>
              <span className={`ml-auto font-semibold ${
                eligibility.requirements.playlistCreations >= eligibility.criteria.minPlaylistCreations 
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                {eligibility.requirements.playlistCreations}/{eligibility.criteria.minPlaylistCreations}
              </span>
            </div>
            
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-gray-300 text-sm">Community Rating:</span>
              <span className={`ml-auto font-semibold ${
                eligibility.requirements.communityRating >= eligibility.criteria.minCommunityRating 
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                {eligibility.requirements.communityRating}/{eligibility.criteria.minCommunityRating}
              </span>
            </div>
            
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-gray-300 text-sm">Serato Integration:</span>
              <span className={`ml-auto font-semibold ${
                eligibility.requirements.seratoIntegration ? 'text-green-400' : 'text-red-400'
              }`}>
                {eligibility.requirements.seratoIntegration ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center">
              <User className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-gray-300 text-sm">Profile Completeness:</span>
              <span className={`ml-auto font-semibold ${
                eligibility.requirements.profileCompleteness >= eligibility.criteria.minProfileCompleteness 
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                {eligibility.requirements.profileCompleteness}%
              </span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-gray-300 text-sm">Account Age:</span>
              <span className={`ml-auto font-semibold ${
                eligibility.requirements.accountAge >= eligibility.criteria.minAccountAge 
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                {eligibility.requirements.accountAge} days
              </span>
            </div>
          </div>

          {/* Missing Requirements */}
          {eligibility.missingRequirements.length > 0 && (
            <div className="bg-red-600 bg-opacity-20 border border-red-400 rounded-lg p-3">
              <h4 className="text-red-400 font-semibold mb-2">Missing Requirements:</h4>
              <ul className="text-red-300 text-sm space-y-1">
                {eligibility.missingRequirements.map((requirement: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <XCircle className="w-3 h-3 mr-2" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-green-600 bg-opacity-20 border border-green-400 rounded-lg p-3 mt-3">
            <h4 className="text-green-400 font-semibold mb-2">Verified DJ Benefits:</h4>
            <ul className="text-green-300 text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                Serato integration and verification
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                Priority access to music submissions
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                Enhanced playlist management tools
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                Verified badge and status
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DJVerificationButton;
