import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Music, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  TrendingUp, 
  Award,
  BarChart3,
  Clock,
  HardDrive,
  FolderOpen,
  RefreshCw
} from 'lucide-react';

interface SeratoVerificationData {
  skillLevel: string;
  score: number;
  factors: string[];
  verifiedAt: string;
  database: {
    library: {
      tracks: number;
      size: number;
    };
    history: {
      sessions: number;
      totalTime: number;
    };
    crates: {
      count: number;
      names: string[];
    };
    analysis: {
      analyzedTracks: number;
    };
    lastActivity: string;
    installationDate: string;
  };
}

interface VerificationStatus {
  verified: boolean;
  skillLevel: string | null;
  score: number | null;
  verifiedAt: string | null;
  lastVerified: string | null;
}

export const SeratoVerificationButton: React.FC = () => {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [verificationData, setVerificationData] = useState<SeratoVerificationData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{
    found: boolean;
    path: string | null;
    files: string[];
  } | null>(null);

  useEffect(() => {
    // Load verification status on component mount
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const response = await fetch(`/api/serato-file/status/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data.status);
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    }
  };

  const detectSeratoInstallation = async () => {
    try {
      setIsDetecting(true);
      setError(null);

      const response = await fetch('/api/serato-file/detect', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setDetectionResult(data);
        if (!data.found) {
          setError('Serato installation not found. Please install Serato DJ Pro first.');
        }
      } else {
        setError(data.message || 'Failed to detect Serato installation');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  };

  const verifySeratoSkills = async () => {
    try {
      setIsVerifying(true);
      setError(null);

      const response = await fetch('/api/serato-file/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setVerificationData(data.verification);
        setVerificationStatus({
          verified: true,
          skillLevel: data.verification.skillLevel,
          score: data.verification.score,
          verifiedAt: data.verification.verifiedAt,
          lastVerified: data.verification.verifiedAt
        });
        setShowDetails(true);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const reVerifySkills = async () => {
    try {
      setIsVerifying(true);
      setError(null);

      const response = await fetch('/api/serato-file/reverify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setVerificationData(data.verification);
        setVerificationStatus({
          verified: true,
          skillLevel: data.verification.skillLevel,
          score: data.verification.score,
          verifiedAt: data.verification.verifiedAt,
          lastVerified: data.verification.lastVerified
        });
        setShowDetails(true);
      } else {
        setError(data.message || 'Re-verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getSkillLevelColor = (skillLevel: string) => {
    switch (skillLevel) {
      case 'EXPERT': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'ADVANCED': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'INTERMEDIATE': return 'text-green-600 bg-green-100 border-green-200';
      case 'NOVICE': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'BEGINNER': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSkillLevelIcon = (skillLevel: string) => {
    switch (skillLevel) {
      case 'EXPERT': return <Award className="w-5 h-5" />;
      case 'ADVANCED': return <TrendingUp className="w-5 h-5" />;
      case 'INTERMEDIATE': return <BarChart3 className="w-5 h-5" />;
      case 'NOVICE': return <Music className="w-5 h-5" />;
      case 'BEGINNER': return <Music className="w-5 h-5" />;
      default: return <Music className="w-5 h-5" />;
    }
  };

  if (verificationStatus?.verified && verificationData) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        {/* Verification Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                🎛️ Serato DJ Verification
              </h3>
              <p className="text-sm text-gray-600">
                Verified: {new Date(verificationStatus.verifiedAt!).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Skill Level Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getSkillLevelIcon(verificationData.skillLevel)}
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSkillLevelColor(verificationData.skillLevel)}`}>
                  {verificationData.skillLevel} DJ
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {verificationData.score}/100
              </div>
              <div className="text-sm text-gray-600">Skill Score</div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        {showDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Library</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {verificationData.database.library.tracks.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">tracks</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Sessions</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {verificationData.database.history.sessions}
                </div>
                <div className="text-xs text-gray-500">total</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Crates</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {verificationData.database.crates.count}
                </div>
                <div className="text-xs text-gray-500">organized</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Analyzed</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {verificationData.database.analysis.analyzedTracks}
                </div>
                <div className="text-xs text-gray-500">tracks</div>
              </div>
            </div>

            {/* Score Factors */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Score Breakdown</h4>
              <div className="space-y-2">
                {verificationData.factors.map((factor, index) => (
                  <div key={index} className="text-sm text-blue-800">
                    • {factor}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Crates */}
            {verificationData.database.crates.names.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recent Crates</h4>
                <div className="flex flex-wrap gap-2">
                  {verificationData.database.crates.names.slice(0, 8).map((crate, index) => (
                    <span key={index} className="px-2 py-1 bg-white rounded text-xs text-gray-700 border">
                      {crate}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <button
            onClick={reVerifySkills}
            disabled={isVerifying}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Re-verify Skills</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Music className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            🎛️ Serato DJ Verification
          </h3>
          <p className="text-sm text-gray-600">
            Verify your DJ skills by analyzing your Serato library
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Detection Result */}
      {detectionResult && (
        <div className={`border rounded-lg p-4 mb-4 ${detectionResult.found ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            {detectionResult.found ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )}
            <span className={`font-medium ${detectionResult.found ? 'text-green-800' : 'text-yellow-800'}`}>
              {detectionResult.found ? 'Serato Found!' : 'Serato Not Found'}
            </span>
          </div>
          {detectionResult.found && (
            <div className="text-sm text-green-700">
              <p>Path: {detectionResult.path}</p>
              <p>Files: {detectionResult.files.join(', ')}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!detectionResult && (
          <button
            onClick={detectSeratoInstallation}
            disabled={isDetecting}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDetecting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <HardDrive className="w-4 h-4" />
            )}
            <span>🔍 Detect Serato Installation</span>
          </button>
        )}

        {detectionResult?.found && (
          <button
            onClick={verifySeratoSkills}
            disabled={isVerifying}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>🎛️ Verify Serato Skills</span>
          </button>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Benefits of Verification</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Get priority access to premium missions</li>
          <li>• Show verified skill level to clients</li>
          <li>• Earn professional DJ badges</li>
          <li>• Higher earning potential</li>
          <li>• Build trust with event organizers</li>
        </ul>
      </div>
    </div>
  );
};
