import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MissionCreationWizard from '../components/missions/MissionCreationWizard';
import { useAuth } from '../contexts/PrivyAuthContext';

const MissionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(true);

  const handleComplete = (missionData: any) => {
    console.log('Mission created successfully:', missionData);
    // Here you would typically send the mission data to your API
    alert('Mission created successfully! RUNNERS will now be able to apply.');
    navigate('/missions');
  };

  const handleCancel = () => {
    navigate('/missions');
  };

  // Check if user has permission to create missions
  if (!user || (user.role !== 'CLIENT' && user.role !== 'CURATOR' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Only CLIENTS, CURATORS, and ADMINS can create missions.
          </p>
          <button
            onClick={() => navigate('/missions')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Missions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showWizard && (
        <div className="py-8">
          <MissionCreationWizard
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default MissionCreate;
