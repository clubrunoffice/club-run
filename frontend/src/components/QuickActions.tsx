import { useUIAgent, quickActionConfigs } from '../contexts/UIAgentContext';

const QuickActions: React.FC = () => {
  const { handleQuickAction, getRoleConfig } = useUIAgent();
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