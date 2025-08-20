import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, ChevronDown, Lightbulb, Wallet, CheckCircle, MapPin, Smartphone } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = { id: Date.now(), text: inputValue, isBot: false };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      // Simulate ChatGPT response
      setTimeout(() => {
        const botResponse: Message = { 
          id: Date.now() + 1, 
          text: "I understand you're asking about club operations. Let me help you with that. What specific aspect would you like to discuss?", 
          isBot: true 
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Here you would integrate with OpenAI's voice API
    // For now, just simulate voice input
    if (!isListening) {
      setTimeout(() => {
        const voiceMessage: Message = { id: Date.now(), text: "Voice message received", isBot: false };
        setMessages(prev => [...prev, voiceMessage]);
        setIsListening(false);
      }, 2000);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    // Close the chat when clicking outside
    setIsOpen(false);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking inside the chat widget
    e.stopPropagation();
  };

  const handleQuickAction = (action: string) => {
    // Handle quick action button clicks
    console.log(`Quick action clicked: ${action}`);
    // You can add specific logic for each action here
  };

  const actionButtons = [
    { 
      icon: <Smartphone className="w-3.5 h-3.5" />, 
      text: "📱 Quick Check-In", 
      action: "checkin",
      bgColor: "bg-blue-50", 
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-100"
    },
    { 
      icon: <Wallet className="w-3.5 h-3.5" />, 
      text: "💳 Log Expense", 
      action: "expense",
      bgColor: "bg-green-50", 
      textColor: "text-green-700",
      borderColor: "border-green-200",
      hoverColor: "hover:bg-green-100"
    },
    { 
      icon: <CheckCircle className="w-3.5 h-3.5" />, 
      text: "✅ View Missions", 
      action: "missions",
      bgColor: "bg-purple-50", 
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      hoverColor: "hover:bg-purple-100"
    },
    { 
      icon: <MapPin className="w-3.5 h-3.5" />, 
      text: "📍 Find Venues", 
      action: "venues",
      bgColor: "bg-orange-50", 
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
      hoverColor: "hover:bg-orange-100"
    }
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-end p-4"
          onClick={handleClickOutside}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[520px] flex flex-col"
            onClick={handleChatClick}
          >
            {/* Header - Purple Gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">AI Copilot</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={handleVoiceInput}
                    className={`text-white/80 hover:text-white transition-colors p-1 rounded ${
                      isListening ? 'text-red-300' : ''
                    }`}
                    title="Voice Mode"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white min-h-0 pt-3">
              {/* Welcome Message - Show when no conversation */}
              {messages.length === 0 && (
                <div className="p-4 text-center flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Hello! I'm your AI Copilot</h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-sm mx-auto">
                    I can help you with venue recommendations, business insights, and operational decisions.
                  </p>
                </div>
              )}

              {/* Quick Actions - Always Visible */}
              <div className="px-4 pb-3 flex-shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  {actionButtons.map((button, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(button.action)}
                      className={`flex items-center justify-center space-x-1.5 p-2 rounded-lg border transition-colors font-medium text-xs ${button.bgColor} ${button.textColor} ${button.borderColor} ${button.hoverColor}`}
                    >
                      {button.icon}
                      <span>{button.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                    </div>
                  </div>
                ))}
                
                {/* Voice listening indicator */}
                {isListening && (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        <span className="text-sm">Listening...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
                <button 
                  onClick={handleVoiceInput}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Mic className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              
              {/* Voice status */}
              {isListening && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-red-600 font-medium">Voice input active - Speak now</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;