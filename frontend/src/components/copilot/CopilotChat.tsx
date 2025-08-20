'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Message, Action, ActionType } from '@/types';
import { 
  XMarkIcon, 
  ChevronDownIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  LightBulbIcon,
  MapPinIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface CopilotChatProps {
  onClose?: () => void;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({ onClose }) => {
  const { 
    copilotOpen, 
    toggleCopilot, 
    chatMessages, 
    addChatMessage,
    currentLocation,
    activeMissions
  } = useAppStore();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (copilotOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [copilotOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const copilotMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'copilot',
        content: generateResponse(inputValue),
        timestamp: new Date(),
        actions: generateActions(inputValue),
      };
      addChatMessage(copilotMessage);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('venue') || lowerInput.includes('place') || lowerInput.includes('club')) {
      return "I can help you find great venues! Here are some popular options nearby. Would you like me to show you venues with specific features like rooftop bars or live music?";
    }
    
    if (lowerInput.includes('mission') || lowerInput.includes('task') || lowerInput.includes('challenge')) {
      return "You have 3 active missions right now. The 'Weekend Warrior' mission is almost complete - just 2 more venue check-ins needed!";
    }
    
    if (lowerInput.includes('check in') || lowerInput.includes('checkin')) {
      return "Great! I can help you check in. Are you at a venue now? I can scan for nearby venues or you can use the QR code scanner.";
    }
    
    if (lowerInput.includes('emergency') || lowerInput.includes('help') || lowerInput.includes('safety')) {
      return "I'm here to help! For emergencies, please call 911 immediately. I can also help you find safe transportation options or contact venue security.";
    }
    
    return "I'm your AI Copilot and I'm here to help with your nightlife experience! I can help you find venues, track missions, check in, and provide safety assistance. What would you like to do?";
  };

  const generateActions = (input: string): Action[] => {
    const lowerInput = input.toLowerCase();
    const actions: Action[] = [];
    
    if (lowerInput.includes('venue') || lowerInput.includes('place')) {
      actions.push({
        type: ActionType.NAVIGATE,
        payload: { route: '/venues' },
        description: 'Browse Venues'
      });
    }
    
    if (lowerInput.includes('mission') || lowerInput.includes('task')) {
      actions.push({
        type: ActionType.NAVIGATE,
        payload: { route: '/missions' },
        description: 'View Missions'
      });
    }
    
    if (lowerInput.includes('check in')) {
      actions.push({
        type: ActionType.CHECK_IN,
        payload: { venueId: null },
        description: 'Check In Now'
      });
    }
    
    return actions;
  };

  const handleAction = (action: Action) => {
    switch (action.type) {
      case ActionType.NAVIGATE:
        // Handle navigation
        console.log('Navigating to:', action.payload.route);
        break;
      case ActionType.CHECK_IN:
        // Handle check-in
        console.log('Checking in...');
        break;
      case ActionType.THEME_TOGGLE:
        // Handle theme toggle
        console.log('Toggling theme...');
        break;
      default:
        console.log('Action:', action);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      setInputValue('Find me a good venue nearby');
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!copilotOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <LightBulbIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Copilot</h3>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setContextOpen(!contextOpen)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform ${contextOpen ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={onClose || toggleCopilot}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Context Panel */}
      {contextOpen && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Location</h4>
              <p className="text-sm text-gray-600">
                {currentLocation ? 'Atlanta, GA' : 'Location not available'}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Active Missions</h4>
              <div className="space-y-1">
                {activeMissions.slice(0, 2).map((mission) => (
                  <p key={mission.id} className="text-sm text-gray-600">
                    {mission.title}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-8">
            <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hello! I'm your AI Copilot</h3>
            <p className="text-sm text-gray-600 mb-4">
              I can help you with venues, missions, check-ins, and more!
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
                <span className="text-xs">Find Venues</span>
              </button>
              <button className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <TrophyIcon className="w-4 h-4 text-yellow-600" />
                <span className="text-xs">Check Missions</span>
              </button>
            </div>
          </div>
        )}
        
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleAction(action)}
                      className="block w-full text-left px-3 py-2 rounded border border-gray-300 bg-white text-sm hover:bg-gray-50 transition-colors"
                    >
                      {action.description}
                    </button>
                  ))}
                </div>
              )}
              
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        {isRecording ? (
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-700">Recording...</span>
            </div>
            <button
              onClick={() => setIsRecording(false)}
              className="p-1 rounded-full bg-red-500 text-white"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
              />
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={handleVoiceInput}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MicrophoneIcon className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 