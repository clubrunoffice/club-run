import React, { useState } from 'react';
import MissionCreationWizard from '../components/missions/MissionCreationWizard';

const MissionTest: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [missionData, setMissionData] = useState<any>(null);

  const handleComplete = (data: any) => {
    setMissionData(data);
    setShowWizard(false);
    console.log('Mission completed:', data);
  };

  const handleCancel = () => {
    setShowWizard(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mission Creation Wizard Test</h1>
        
        {!showWizard ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test the Updated Mission Creation Wizard</h2>
            <p className="text-gray-600 mb-6">
              This page tests the updated 4-step mission creation process with DJ Service Package Link.
            </p>
            
            <button
              onClick={() => setShowWizard(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Open Mission Creation Wizard
            </button>

            {missionData && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Mission Created Successfully!</h3>
                <pre className="text-sm text-green-800 overflow-auto">
                  {JSON.stringify(missionData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <MissionCreationWizard
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default MissionTest;
