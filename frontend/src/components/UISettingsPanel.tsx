import React from 'react';
import { useUIAgent } from '../contexts/UIAgentContext';
import { X, Palette, Layout, Zap, Eye, Type } from 'lucide-react';

interface UISettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UISettingsPanel: React.FC<UISettingsPanelProps> = ({ isOpen, onClose }) => {
  const { state, setTheme, setLayout, setAnimations, setAccessibility } = useUIAgent();
  const { currentRole, userPreferences } = state;

  const roleDisplayNames = {
    GUEST: '👤 Guest',
    RUNNER: '🏃 Runner',
    CLIENT: '👑 Client',
    OPERATIONS: '⚙️ Operations',
    PARTNER: '🤝 Partner',
    ADMIN: '🔧 Admin'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">UI Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Current Role Display (Read-only) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-medium">
              <Palette className="w-4 h-4" />
              Current Role
            </label>
            <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              {roleDisplayNames[currentRole]}
            </div>
            <p className="text-xs text-gray-400">
              Role is managed by system administrator
            </p>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-medium">
              <Palette className="w-4 h-4" />
              Theme
            </label>
            <select
              value={userPreferences.theme}
              onChange={(e) => setTheme(e.target.value as 'auto' | 'light' | 'dark')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="auto">Auto (Time-based)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Layout Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-medium">
              <Layout className="w-4 h-4" />
              Layout
            </label>
            <select
              value={userPreferences.layout}
              onChange={(e) => setLayout(e.target.value as 'default' | 'compact')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
            </select>
          </div>

          {/* Animations Toggle */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-medium">
              <Zap className="w-4 h-4" />
              Animations
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="animations"
                checked={userPreferences.animations}
                onChange={(e) => setAnimations(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="animations" className="ml-2 text-white">
                Enable interface animations
              </label>
            </div>
          </div>

          {/* Accessibility Toggle */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-medium">
              <Eye className="w-4 h-4" />
              Accessibility
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="accessibility"
                checked={userPreferences.accessibility}
                onChange={(e) => setAccessibility(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="accessibility" className="ml-2 text-white">
                High contrast mode
              </label>
            </div>
          </div>

          {/* Font Size Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-medium">
              <Type className="w-4 h-4" />
              Font Size
            </label>
            <select
              value={userPreferences.fontSize}
              onChange={(e) => {
                // This would need to be implemented in the context
                console.log('Font size changed to:', e.target.value);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UISettingsPanel; 