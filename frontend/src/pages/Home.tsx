import React, { useState } from 'react';
import { 
  MapPin,
  Music,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  MissionCreationModal, 
  RunnerOpportunitiesModal, 
  PlatformStatsModal, 
  FeaturesModal, 
  MissionTypesModal 
} from '../components/InteractiveModals';

const Home: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showRunnerModal, setShowRunnerModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showMissionTypesModal, setShowMissionTypesModal] = useState(false);

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Smart Mission Matching",
      description: "AI-powered matching connects clients with the perfect runners based on location, skills, and availability."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trust & Safety",
      description: "Verified profiles, insurance coverage, and real-time tracking ensure safe and reliable service delivery."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-Time Tracking",
      description: "Live GPS tracking, progress updates, and communication tools keep everyone informed throughout the mission."
    }
  ];

  const stats = [
    { number: "500+", label: "Missions Completed" },
    { number: "200+", label: "Skilled Runners" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24hr", label: "Average Response" }
  ];

  const handleSignUp = () => {
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                🚀 PRE-MVP 3.5: Curator Role & Appointed-Team Mission System
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Music Services<br />Mission Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect clients needing music services with skilled runners. Post missions, find talent, and earn money with our intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
              onClick={() => setShowMissionModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg"
            >
                <span>🎵 Get my music to Djs</span>
              </button>
                          <button
              onClick={() => setShowRunnerModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-lg"
            >
                <Zap className="w-5 h-5" />
                <span>🏃‍♂️ Earn Money as a Music Runner</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Platform Success</h2>
            <button
              onClick={() => setShowStatsModal(true)}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Click to see detailed statistics →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowStatsModal(true)}>
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Mission Experience Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Everything you need for seamless music service missions between clients and runners.
            </p>
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="text-blue-400 hover:text-blue-300 text-lg underline"
            >
              Learn more about our features →
            </button>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-700 cursor-pointer hover:scale-105"
                onClick={() => setShowFeaturesModal(true)}
              >
                <div className={`mb-4 flex justify-center ${
                  index === 0 ? 'text-blue-400' : 
                  index === 1 ? 'text-green-400' : 'text-purple-400'
                }`}>
                  <div className={`p-3 rounded-lg ${
                    index === 0 ? 'bg-blue-500 bg-opacity-20' : 
                    index === 1 ? 'bg-green-500 bg-opacity-20' : 'bg-purple-500 bg-opacity-20'
                  }`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Types Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Popular Mission Types
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              From corporate events to intimate celebrations, we've got you covered.
            </p>
            <button
              onClick={() => setShowMissionTypesModal(true)}
              className="text-green-400 hover:text-green-300 text-lg underline"
            >
              Explore all mission types →
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏢', title: 'Corporate Events', avgBudget: '$800-1200' },
              { icon: '💒', title: 'Weddings', avgBudget: '$1000-1500' },
              { icon: '🎂', title: 'Birthday Parties', avgBudget: '$300-500' },
              { icon: '🎧', title: 'Club/Bar Events', avgBudget: '$500-800' }
            ].map((type, index) => (
              <div 
                key={index} 
                className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-700 cursor-pointer hover:scale-105"
                onClick={() => setShowMissionTypesModal(true)}
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{type.title}</h3>
                <p className="text-blue-400 font-medium">{type.avgBudget}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Music Mission?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of clients and runners who have already discovered the perfect music service match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowMissionModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg"
            >
              <Music className="w-5 h-5" />
              <span>Post a Mission</span>
            </button>
            <button
              onClick={() => setShowRunnerModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-lg"
            >
              <Zap className="w-5 h-5" />
              <span>Find Missions</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Club Run. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setIsVideoPlaying(false)}>
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-white">Club Run Demo</h3>
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-300">Video player would go here</p>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Interactive Modals */}
      <MissionCreationModal
        isOpen={showMissionModal}
        onClose={() => setShowMissionModal(false)}
      />
      
      <RunnerOpportunitiesModal
        isOpen={showRunnerModal}
        onClose={() => setShowRunnerModal(false)}
      />
      
      <PlatformStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />
      
      <FeaturesModal
        isOpen={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
      />
      
      <MissionTypesModal
        isOpen={showMissionTypesModal}
        onClose={() => setShowMissionTypesModal(false)}
      />
    </div>
  );
};

export default Home;