import React, { useState } from 'react';
import { 
  MapPin,
  Music,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRBAC } from '../contexts/RBACContext';
import { useAuth } from '../contexts/PrivyAuthContext';
import { 
  MissionCreationModal, 
  RunnerOpportunitiesModal, 
  PlatformStatsModal, 
  FeaturesModal, 
  MissionTypesModal 
} from '../components/InteractiveModals';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useRBAC();
  const { login } = useAuth();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showRunnerModal, setShowRunnerModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showMissionTypesModal, setShowMissionTypesModal] = useState(false);

  // Role-specific hero content
  const getHeroContent = () => {
    if (!isAuthenticated || !user) {
      return {
        title: "Music Services\nMission Platform",
        subtitle: "Connect clients needing music services with skilled runners. Post missions, find talent, and earn money with our intelligent platform.",
        badge: "🚀 PRE-MVP 3.5: Curator Role & Appointed-Team Mission System"
      };
    }

    switch (user.role) {
      case 'RUNNER':
        const runnerName = user.email?.includes('privy.generated') ? 'Runner' : (user.email?.split('@')[0] || user.name);
        return {
          title: `Welcome Back, ${runnerName}! 🏃‍♂️`,
          subtitle: "Ready to earn? Browse available missions and start building your reputation today.",
          badge: `Music Runner • Level ${user.level || 'Navigator'}`
        };
      case 'DJ':
        const djName = user.email?.includes('privy.generated') ? 'DJ' : (user.email?.split('@')[0] || user.name);
        return {
          title: `Welcome Back, ${djName}! 🎵`,
          subtitle: "Your professional dashboard is ready. Accept missions, manage submissions, and grow your business.",
          badge: `Professional DJ • ${user.missionsCompleted || 0} Missions Completed`
        };
      case 'VERIFIED_DJ':
        const verifiedDjName = user.email?.includes('privy.generated') ? 'Verified DJ' : (user.email?.split('@')[0] || user.name);
        return {
          title: `Welcome Back, ${verifiedDjName}! ✅`,
          subtitle: "As a verified DJ, you have access to premium features and higher-paying missions.",
          badge: `Verified DJ • ${user.missionsCompleted || 0} Missions Completed`
        };
      case 'CLIENT':
        const clientName = user.email?.includes('privy.generated') ? 'Client' : (user.email?.split('@')[0] || user.name);
        return {
          title: `Welcome Back, ${clientName}! 🎯`,
          subtitle: "Post new missions, manage your team, and track project progress from your dashboard.",
          badge: `Client • ${user.missionsCompleted || 0} Missions Created`
        };
      case 'CURATOR':
        const curatorName = user.email?.includes('privy.generated') ? 'Curator' : (user.email?.split('@')[0] || user.name);
        return {
          title: `Welcome Back, ${curatorName}! 🎨`,
          subtitle: "Manage your teams, assign missions, and coordinate multiple events efficiently.",
          badge: `Curator • Team Manager`
        };
      case 'OPERATIONS':
      case 'ADMIN':
        const adminName = user.email?.includes('privy.generated') ? user.role : (user.email?.split('@')[0] || user.name);
        return {
          title: `Welcome Back, ${adminName}! 👑`,
          subtitle: "System overview, user management, and platform analytics at your fingertips.",
          badge: `${user.role} • Full Access`
        };
      default:
        const guestName = user.email?.includes('privy.generated') ? 'Guest' : (user.email?.split('@')[0] || user.name);
        return {
          title: `Welcome, ${guestName}! 👋`,
          subtitle: "Select your role to get started and unlock your personalized dashboard.",
          badge: "Guest User"
        };
    }
  };

  // Role-specific CTAs
  const getRoleCTAs = () => {
    if (!isAuthenticated || !user) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowMissionModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg"
          >
            <span>🎵 Get my music to DJs</span>
          </button>
          <button
            onClick={() => setShowRunnerModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-lg"
          >
            <Zap className="w-5 h-5" />
            <span>🏃‍♂️ Earn Money as a Music Runner</span>
          </button>
        </div>
      );
    }

    // Authenticated user CTAs based on role
    switch (user.role) {
      case 'RUNNER':
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/missions"
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-emerald-700 hover:to-green-700 transition-all duration-200 text-lg shadow-lg"
            >
              <Zap className="w-5 h-5" />
              <span>Browse Available Missions</span>
            </Link>
            <Link
              to="/dashboard"
              className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 text-lg"
            >
              <span>View My Dashboard</span>
            </Link>
          </div>
        );
      case 'DJ':
      case 'VERIFIED_DJ':
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/missions"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg shadow-lg"
            >
              <Music className="w-5 h-5" />
              <span>View Music Submissions</span>
            </Link>
            <Link
              to="/dashboard"
              className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 text-lg"
            >
              <span>Go to Dashboard</span>
            </Link>
          </div>
        );
      case 'CLIENT':
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/missions/create"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-lg shadow-lg"
            >
              <span>➕ Create New Mission</span>
            </Link>
            <Link
              to="/missions"
              className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 text-lg"
            >
              <span>View My Missions</span>
            </Link>
          </div>
        );
      case 'CURATOR':
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/curator-dashboard"
              className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-orange-700 hover:to-yellow-700 transition-all duration-200 text-lg shadow-lg"
            >
              <span>🎨 Curator Dashboard</span>
            </Link>
            <Link
              to="/teams"
              className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 text-lg"
            >
              <span>Manage Teams</span>
            </Link>
          </div>
        );
      case 'OPERATIONS':
      case 'ADMIN':
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admin/users"
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-red-700 hover:to-pink-700 transition-all duration-200 text-lg shadow-lg"
            >
              <Shield className="w-5 h-5" />
              <span>User Management</span>
            </Link>
            <Link
              to="/admin/stats"
              className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 text-lg"
            >
              <span>System Analytics</span>
            </Link>
          </div>
        );
      default: // GUEST
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => login()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-lg shadow-lg"
            >
              <span>🎯 Select Your Role</span>
            </button>
            <Link
              to="/features"
              className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 text-lg"
            >
              <span>Learn More</span>
            </Link>
          </div>
        );
    }
  };

  const heroContent = getHeroContent();

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

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Role-Based */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {heroContent.badge}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white whitespace-pre-line">
              {heroContent.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {heroContent.subtitle}
            </p>
            {getRoleCTAs()}
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