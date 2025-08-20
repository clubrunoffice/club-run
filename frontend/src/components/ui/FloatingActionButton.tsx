'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export const FloatingActionButton: React.FC = () => {
  const { toggleCopilot, copilotOpen } = useAppStore();

  return (
    <button
      onClick={toggleCopilot}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full shadow-lg
        bg-gradient-to-r from-blue-600 to-purple-600
        hover:from-blue-700 hover:to-purple-700
        text-white transition-all duration-200
        flex items-center justify-center
        ${copilotOpen ? 'scale-90 opacity-50' : 'scale-100 opacity-100 hover:scale-110'}
      `}
      aria-label="Open AI Copilot"
    >
      <ChatBubbleLeftRightIcon className="w-6 h-6" />
    </button>
  );
}; 