import React, { useState } from 'react';
import { 
  Play, 
  MessageSquare, 
  BarChart3, 
  DollarSign, 
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Copilot",
      description: "Intelligent voice assistant that helps with venue recommendations, customer service, and operational decisions."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Real-time insights into crowd patterns, revenue optimization, and performance metrics."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Budget Management",
      description: "Automated expense tracking and financial optimization to maximize your profitability."
    }
  ];

  const stats = [
    { number: "500+", label: "Venues Managed" },
    { number: "1M+", label: "Transactions" },
    { number: "95%", label: "Efficiency Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              AI-Powered<br />Nightlife Operations
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Optimize your nightlife business with intelligent AI agents that handle research, budgeting, reporting, and customer interactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agent-dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg"
              >
                <Rocket className="w-5 h-5" />
                <span>Launch Agent Dashboard</span>
              </Link>
              <Link
                to="/auth"
                className="border border-white text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-white hover:text-black transition-all duration-200 text-lg"
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
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
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to optimize your nightlife business operations.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-700">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Nightlife Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of venues that have already optimized their operations with Club Run.
          </p>
          <Link
            to="/auth"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg mx-auto w-fit"
          >
            <Rocket className="w-5 h-5" />
            <span>Get Started Today</span>
          </Link>
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
    </div>
  );
};

export default Home;