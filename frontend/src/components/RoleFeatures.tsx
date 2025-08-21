import React from 'react';
import { useUIAgent } from '../contexts/UIAgentContext';

interface RoleFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface RoleFeaturesMap {
  runner: RoleFeature[];
  client: RoleFeature[];
  operations: RoleFeature[];
}

const RoleFeatures: React.FC = () => {
  const { state } = useUIAgent();
  const { currentRole } = state;

  const roleFeatures: RoleFeaturesMap = {
    runner: [
      { id: 'venueResearch', icon: '🏢', title: 'Venue Research', description: 'Advanced venue analysis and crowd intelligence' },
      { id: 'expenseTracking', icon: '💰', title: 'Expense Tracking', description: 'Real-time expense monitoring and optimization' },
      { id: 'routeOptimization', icon: '🗺️', title: 'Route Optimization', description: 'Efficient route planning for venue visits' }
    ],
    client: [
      { id: 'bookingAnalytics', icon: '📅', title: 'Booking Analytics', description: 'Comprehensive booking analysis and insights' },
      { id: 'preferenceAnalysis', icon: '⭐', title: 'Preference Analysis', description: 'Service preference tracking and optimization' },
      { id: 'serviceOptimization', icon: '🎯', title: 'Service Optimization', description: 'Personalized service recommendations' }
    ],
    operations: [
      { id: 'staffManagement', icon: '👥', title: 'Staff Management', description: 'Staff scheduling and performance tracking' },
      { id: 'inventoryTracking', icon: '📦', title: 'Inventory Tracking', description: 'Real-time inventory management and alerts' },
      { id: 'performanceMetrics', icon: '📈', title: 'Performance Metrics', description: 'Comprehensive operational performance analysis' }
    ]
  };

  const features = roleFeatures[currentRole as keyof RoleFeaturesMap] || [];

  return (
    <div className="role-features-section">
      <h2>Role-Specific Features</h2>
      <div className="role-features-grid">
        {features.map((feature: RoleFeature) => (
          <div 
            key={feature.id} 
            className="role-feature"
            data-role={currentRole}
            data-feature={feature.id}
          >
            <h3>{feature.icon} {feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleFeatures; 