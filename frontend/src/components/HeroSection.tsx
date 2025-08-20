import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="px-6 py-20 text-center text-white bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          AI-Powered Nightlife Operations
        </h1>
        <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-4xl mx-auto">
          Optimize your nightlife business with intelligent AI agents that
          handle research, budgeting, reporting, and customer interactions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl"
          >
            <Rocket size={20} />
            <span>Launch Agent Dashboard</span>
          </Link>
          
          <button className="border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 hover:border-gray-500 transition-all flex items-center space-x-3">
            <Play size={20} />
            <span>View Demo</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;