import { MessageCircle, BarChart3, DollarSign } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Copilot',
      description: 'Intelligent voice assistant that helps with venue recommendations, customer service, and operational decisions.',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Real-time insights into crowd patterns, revenue optimization, and performance metrics.',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      icon: DollarSign,
      title: 'Budget Management',
      description: 'Automated expense tracking and financial optimization to maximize your profitability.',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
  ];

  return (
    <section className="px-6 py-20 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Powerful Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-gray-700"
            >
              <div className={`${feature.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;