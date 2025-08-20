import React from 'react';
import { useUIAgent, quickActionConfigs } from '../contexts/UIAgentContext';

const QuickActions: React.FC = () => {
  const { state, handleQuickAction, getRoleConfig } = useUIAgent();
  const { currentRole } = state;
  const roleConfig = getRoleConfig();

  return (
    <div className="quick-actions-section">
      <h2>Quick Actions</h2>
      <div className="quick-actions-grid">
        {roleConfig.quickActions.map((action) => {
          const config = quickActionConfigs[action as keyof typeof quickActionConfigs];
          if (!config) return null;

          return (
            <button
              key={action}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action)}
              title={config.label}
            >
              <div className="quick-action-icon">{config.icon}</div>
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions; 