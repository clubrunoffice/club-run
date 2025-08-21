import { 
  MessageSquare, 
  BarChart3, 
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Copilot",
      description: "Intelligent voice assistant that helps with venue recommendations, customer service, and operational decisions in real-time.",
      benefits: ["Voice-activated assistance", "Venue recommendations", "Customer service automation", "Operational decision support"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "Real-time insights into crowd patterns, revenue optimization, and performance metrics to maximize your venue's potential.",
      benefits: ["Crowd pattern analysis", "Revenue optimization", "Performance metrics", "Predictive insights"]
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Budget Management",
      description: "Automated expense tracking and financial optimization to maximize your profitability and streamline operations.",
      benefits: ["Automated expense tracking", "Financial optimization", "Profitability analysis", "Streamlined operations"]
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-black to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Powerful Features for Nightlife Operations
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the AI-powered tools that will transform your nightlife business and help you optimize every aspect of your operations.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-1 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className={`mb-6 ${
                  index === 0 ? 'text-blue-400' : 
                  index === 1 ? 'text-green-400' : 'text-purple-400'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-blue-400' : 
                        index === 1 ? 'bg-green-400' : 'bg-purple-400'
                      }`}></div>
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Trusted by Venues Worldwide
            </h2>
            <p className="text-gray-300">
              Join hundreds of venues that have optimized their operations with Club Run
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">Venues Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">1M+</div>
              <div className="text-gray-300">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-300">Efficiency Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gray-800 rounded-lg p-12 max-w-4xl mx-auto border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Experience the Future of Nightlife Operations?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your journey with Club Run and discover what's possible with AI-powered business optimization.
            </p>
            <Link
              to="/agent-dashboard"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg mx-auto w-fit"
            >
              <span>Launch Agent Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;