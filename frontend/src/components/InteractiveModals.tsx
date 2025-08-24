import React from 'react';
import { X, Music, Zap, MapPin, Shield, TrendingUp, DollarSign, Users, Clock, CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mission Creation Modal
export const MissionCreationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Your Mission</h2>
              <p className="opacity-90">Post a music service request</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens when you post a mission:</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Matching</h4>
                  <p className="text-gray-600 text-sm">Our AI instantly matches your request with qualified music professionals</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Receive Proposals</h4>
                  <p className="text-gray-600 text-sm">Get detailed proposals from multiple runners within hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Choose & Book</h4>
                  <p className="text-gray-600 text-sm">Select the best match and book securely through our platform</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Mission Types Available:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-blue-700">Wedding DJ</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-blue-700">Corporate Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-blue-700">Live Music</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-blue-700">Sound Equipment</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/auth'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Sign Up to Post Mission
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Runner Opportunities Modal
export const RunnerOpportunitiesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Earn as a Music Runner</h2>
              <p className="opacity-90">Find missions and grow your business</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works for runners:</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Get Matched</h4>
                  <p className="text-gray-600 text-sm">Receive notifications for missions that match your skills and location</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Submit Proposals</h4>
                  <p className="text-gray-600 text-sm">Send detailed proposals with your rates and portfolio</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Complete & Earn</h4>
                  <p className="text-gray-600 text-sm">Deliver services and get paid securely through our platform</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Average Earnings:</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">$150</div>
                <div className="text-sm text-green-700">Per Hour</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">$800</div>
                <div className="text-sm text-green-700">Per Event</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">$3,200</div>
                <div className="text-sm text-green-700">Monthly</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/auth'}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
            >
              Sign Up as Runner
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Requirements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Platform Stats Modal
export const PlatformStatsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Platform Statistics</h2>
            <p className="opacity-90">Real-time data from our growing community</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-blue-700">Missions Completed</div>
              <div className="text-xs text-blue-500 mt-1">Last 30 days</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-sm text-green-700">Active Runners</div>
              <div className="text-xs text-green-500 mt-1">Verified professionals</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm text-purple-700">Satisfaction Rate</div>
              <div className="text-xs text-purple-500 mt-1">Client feedback</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">24hr</div>
              <div className="text-sm text-orange-700">Average Response</div>
              <div className="text-xs text-orange-500 mt-1">Mission matching</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Activity:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">New mission posted - Wedding DJ needed in NYC</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Runner completed corporate event - 5-star rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">New runner joined - Live band specialist</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/auth'}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Join Our Community
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View More Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Modal
export const FeaturesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Smart Mission Matching",
      description: "AI-powered algorithm matches clients with the perfect runners based on location, skills, availability, and past performance.",
      color: "blue"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trust & Safety",
      description: "Verified profiles, insurance coverage, background checks, and real-time tracking ensure safe and reliable service delivery.",
      color: "green"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-Time Tracking",
      description: "Live GPS tracking, progress updates, photo verification, and communication tools keep everyone informed throughout the mission.",
      color: "purple"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Platform Features</h2>
            <p className="opacity-90">Everything you need for seamless music service missions</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className={`mb-4 flex justify-center ${
                  feature.color === 'blue' ? 'text-blue-600' : 
                  feature.color === 'green' ? 'text-green-600' : 'text-purple-600'
                }`}>
                  <div className={`p-3 rounded-lg ${
                    feature.color === 'blue' ? 'bg-blue-100' : 
                    feature.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Additional Benefits:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Secure Payment Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">24/7 Customer Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Insurance Coverage</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Performance Analytics</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/auth'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Experience These Features
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mission Types Modal
export const MissionTypesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const missionTypes = [
    { icon: '🏢', title: 'Corporate Events', avgBudget: '$800-1200', description: 'Professional music services for business events, conferences, and corporate functions.' },
    { icon: '💒', title: 'Weddings', avgBudget: '$1000-1500', description: 'Complete wedding music services including ceremony, reception, and special moments.' },
    { icon: '🎂', title: 'Birthday Parties', avgBudget: '$300-500', description: 'Fun and energetic music for birthday celebrations of all ages.' },
    { icon: '🎧', title: 'Club/Bar Events', avgBudget: '$500-800', description: 'High-energy DJ and live music for nightlife venues and entertainment.' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Mission Types</h2>
            <p className="opacity-90">Explore different types of music service opportunities</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {missionTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">{type.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                    <p className="text-green-600 font-medium">{type.avgBudget}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Why Choose Club Run for Your Music Needs?</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">Verified Professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Quick Matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Competitive Pricing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="text-gray-700">Secure Payments</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/auth'}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200"
            >
              Start Your Mission
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Browse Examples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
