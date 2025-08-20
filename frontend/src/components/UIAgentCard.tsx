import React, { useState } from 'react';
import { useUIAgent } from '../contexts/UIAgentContext';
import UISettingsPanel from './UISettingsPanel';
import { Settings } from 'lucide-react';

const UIAgentCard: React.FC = () => {
  const { state, setTheme, setLayout, setAnimations } = useUIAgent();
  const { currentRole, agentStatus, efficiency, userPreferences } = state;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleThemeToggle = () => {
    const themes: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(userPreferences.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handleLayoutToggle = () => {
    const layouts: Array<'default' | 'compact'> = ['default', 'compact'];
    const currentIndex = layouts.indexOf(userPreferences.layout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setLayout(layouts[nextIndex]);
  };

  const handleAnimationsToggle = () => {
    setAnimations(!userPreferences.animations);
  };

  const roleDisplayNames = {
    GUEST: '👤 Guest',
    RUNNER: '🏃 Runner',
    CLIENT: '👑 Client',
    OPERATIONS: '⚙️ Operations',
    PARTNER: '🤝 Partner',
    ADMIN: '🔧 Admin'
  };

  return (
    <div className="ui-agent-card bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">🎯 UI Agent</h2>
          <p className="text-gray-400">Intelligent interface optimization</p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Status</div>
          <div className="text-lg font-semibold text-green-400">{agentStatus}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Efficiency</div>
          <div className="text-lg font-semibold text-blue-400">{efficiency}</div>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <div className="text-sm text-gray-400 mb-2">Current Role</div>
        <div className="text-lg font-semibold text-white">
          {roleDisplayNames[currentRole]}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Role assigned by system administrator
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleThemeToggle}
          className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-left transition-colors"
        >
          <div className="text-white font-medium">Theme</div>
          <div className="text-gray-400 text-sm capitalize">{userPreferences.theme}</div>
        </button>

        <button
          onClick={handleLayoutToggle}
          className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-left transition-colors"
        >
          <div className="text-white font-medium">Layout</div>
          <div className="text-gray-400 text-sm capitalize">{userPreferences.layout}</div>
        </button>

        <button
          onClick={handleAnimationsToggle}
          className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-left transition-colors"
        >
          <div className="text-white font-medium">Animations</div>
          <div className="text-gray-400 text-sm">
            {userPreferences.animations ? 'Enabled' : 'Disabled'}
          </div>
        </button>
      </div>

      <UISettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default UIAgentCard; 