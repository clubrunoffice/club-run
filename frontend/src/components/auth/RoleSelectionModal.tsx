import React, { useState } from 'react';
import { Music, Briefcase, Star } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onSelectRole: (role: string) => void;
  onSkip: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onSelectRole,
  onSkip,
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const roles = [
    {
      id: 'RUNNER',
      name: 'Music Runner',
      description: 'Entry-level role to browse missions, apply to gigs, and build your profile.',
      icon: <Music className="w-8 h-8" />,
      color: 'from-emerald-500 to-green-500',
      features: ['Browse missions', 'Apply to gigs', 'Basic check-ins', 'Build reputation']
    },
    {
      id: 'DJ',
      name: 'DJ',
      description: 'Professional DJ with mission acceptance, payments, and P2P mission capabilities.',
      icon: <Music className="w-8 h-8" />,
      color: 'from-blue-600 to-purple-600',
      features: ['Accept missions', 'Get paid', 'P2P missions', 'Full features']
    },
    {
      id: 'CLIENT',
      name: 'Client',
      description: 'Event organizer or venue owner. Post missions, hire talent, and manage events.',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      features: ['Post missions', 'Hire DJs', 'Track progress', 'Pay securely']
    },
    {
      id: 'CURATOR',
      name: 'Curator',
      description: 'Team manager coordinating multiple events and assigning missions to DJs.',
      icon: <Star className="w-8 h-8" />,
      color: 'from-orange-600 to-yellow-600',
      features: ['Build teams', 'Assign missions', 'Manage operations', 'Analytics']
    }
  ];

  const handleContinue = async () => {
    if (selectedRole && !isSubmitting) {
      setIsSubmitting(true);
      await onSelectRole(selectedRole);
      // Note: onSelectRole handles redirect, so we won't reach here normally
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
            <p className="text-white text-lg font-semibold">Setting up your account...</p>
            <p className="text-gray-400 text-sm">This will only take a moment</p>
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to Club Run! 🎉
          </h2>
          <p className="text-gray-400">
            Choose your role to get started. You can always change this later.
          </p>
        </div>

        {/* Role Cards */}
        <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                ${selectedRole === role.id
                  ? 'border-purple-500 bg-purple-900 bg-opacity-20 shadow-lg shadow-purple-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }
              `}
            >
              {/* Selected Indicator */}
              {selectedRole === role.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br ${role.color}`}>
                {role.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{role.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {role.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-300">
                    <span className="mr-2 text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mx-6 mb-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
          <div className="flex items-start">
            <div className="text-blue-400 mr-3 mt-0.5">ℹ️</div>
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-blue-300 mb-1">Role Progression Path:</p>
              <p><span className="text-emerald-400 font-semibold">Music Runner</span> (Level 1) → Browse and apply to missions, build your profile</p>
              <p className="mt-1"><span className="text-blue-400 font-semibold">DJ</span> (Level 2) → Accept missions, receive payments, access P2P missions</p>
              <p className="mt-1"><span className="text-green-400 font-semibold">Verified DJ</span> (Level 3) → Complete Serato verification for automatic proof logging and premium features</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-800 flex justify-between items-center">
          <button
            onClick={onSkip}
            disabled={isSubmitting}
            className={`transition-colors ${
              isSubmitting 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2
              ${selectedRole && !isSubmitting
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Setting up...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
