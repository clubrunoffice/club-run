import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Mic, ChevronDown, Wallet, CheckCircle, MapPin, Smartphone, Users, Music, Plus, Settings } from 'lucide-react';
import { useRBAC } from '../contexts/RBACContext';
import { useNavigate } from 'react-router-dom';

// TypeScript declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  source?: 'chatgpt' | 'local';
  cost?: number;
}

const ChatBot: React.FC = () => {
  const { user, isAuthenticated, hasRole, getCurrentTheme } = useRBAC();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'pending' | 'not-requested'>('not-requested');
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const theme = getCurrentTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Handle speech recognition events
      recognitionRef.current.onstart = () => {
        setIsTranscribing(true);
        setTranscription('');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscription(finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
        setIsListening(false);
        setTranscription('');
        
        if (event.error === 'not-allowed') {
          setMicPermission('denied');
          addMessage("❌ Microphone access denied. Please allow microphone access in your browser settings.", true);
        } else {
          addMessage("❌ Speech recognition error. Please try again.", true);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
        setIsListening(false);
        
        // If we have a final transcription, send it
        if (transcription.trim()) {
          const userMessage: Message = { id: Date.now(), text: transcription, isBot: false };
          setMessages(prev => [...prev, userMessage]);
          
          // Simulate bot response
          setTimeout(() => {
            addMessage(`I heard you say: "${transcription}". How can I help you with that?`, true);
          }, 1000);
          
          setTranscription('');
        }
      };
    }
  }, [transcription]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage: Message = { id: Date.now(), text: inputValue, isBot: false };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      try {
        // Send to backend for processing
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: inputValue })
        });

        const data = await response.json();
        
        if (data.success) {
          const botMessage: Message = { 
            id: Date.now() + 1, 
            text: data.response.message, 
            isBot: true,
            source: data.response.source,
            cost: data.response.cost
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          // Fallback to role-based responses
          let botResponse: string;
          
          if (!isAuthenticated || !user) {
            botResponse = "Welcome to Club Run! I can help you learn about our platform. What would you like to know about our services?";
          } else {
            switch (user.role) {
              case 'RUNNER':
                botResponse = "Hello Runner! I can help you browse missions, check in, submit expenses, and manage your settings. How can I assist you?";
                break;
              case 'DJ':
                botResponse = "Hello DJ! I can help you review music submissions, manage your library, and create playlists. How can I assist you?";
                break;
              case 'CLIENT':
                botResponse = "Welcome Client! I can help you create missions, manage P2P collaborations, and track your bookings. What would you like to do?";
                break;
              case 'CURATOR':
                botResponse = "Greetings Curator! I can help you manage teams, create P2P missions, and coordinate collaborations. How can I help?";
                break;
              case 'OPERATIONS':
              case 'ADMIN':
                botResponse = "Hello Admin! I can help you monitor system activity, manage users, and ensure platform operations. What do you need?";
                break;
              default:
                botResponse = "I understand you're asking about Club Run operations. Let me help you with that. What specific aspect would you like to discuss?";
            }
          }
          
          const botMessage: Message = { 
            id: Date.now() + 1, 
            text: botResponse, 
            isBot: true,
            source: 'local',
            cost: 0
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: Message = { 
          id: Date.now() + 1, 
          text: "I'm having trouble connecting right now. I can still help with basic tasks. What would you like to do?", 
          isBot: true,
          source: 'local',
          cost: 0
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    // Always ask for permission before activating voice
    if (!isListening) {
      if (micPermission === 'not-requested' || micPermission === 'denied') {
        // Show permission request message
        addMessage("🎤 Voice Assistant: I need permission to access your microphone. Click 'Allow' to enable voice input.", true);
        setMicPermission('pending');
        
        // Request microphone permission
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            // Permission granted
            setMicPermission('granted');
            addMessage("✅ Permission granted! Voice assistant is now active. Click the microphone button to start recording.", true);
            
            // Start speech recognition
            if (recognitionRef.current) {
              recognitionRef.current.start();
              setIsListening(true);
            }
          })
          .catch((error) => {
            // Permission denied
            setMicPermission('denied');
            addMessage("❌ Microphone permission denied. You can still use text input to chat with me.", true);
            console.error('Microphone permission denied:', error);
          });
      } else if (micPermission === 'granted') {
        // Permission already granted, start listening
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
          addMessage("🎤 Voice recording started. Speak now...", true);
        }
      }
    } else {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      addMessage("🎤 Voice recording stopped.", true);
    }
  };

  const addMessage = (text: string, isBot: boolean = false) => {
    const newMessage: Message = { id: Date.now(), text, isBot };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleClickOutside = () => {
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
    
    switch (action) {
      // Guest actions
      case 'help':
        addMessage('How can I help you with Club Run? You can ask me about features, how to get started, or any questions about the platform.', true);
        break;
      case 'about':
        addMessage('Club Run is a music services mission platform that connects clients with skilled runners. We facilitate music delivery, event coordination, and peer-to-peer collaborations.', true);
        break;
      case 'features':
        navigate('/features');
        break;
      case 'signup':
        navigate('/auth');
        break;
      
      // DJ actions
      case 'submissions':
        navigate('/music-submissions');
        break;
      case 'library':
        navigate('/library');
        break;
      case 'expenses':
        navigate('/expenses');
        break;
      case 'settings':
        navigate('/settings');
        break;
      
      // Client actions
      case 'create-mission':
        navigate('/missions/create');
        break;
      case 'p2p-missions':
        navigate('/p2p-missions');
        break;
      case 'my-missions':
        navigate('/missions');
        break;
      case 'payments':
        navigate('/payments');
        break;
      
      // Curator actions
      case 'teams':
        navigate('/teams');
        break;
      case 'create-p2p':
        navigate('/p2p-missions/create');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      
      // Operations/Admin actions
      case 'users':
        navigate('/admin/users');
        break;
      case 'system':
        navigate('/admin/system');
        break;
      case 'logs':
        navigate('/admin/logs');
        break;
      case 'chatgpt-analytics':
        navigate('/chatgpt-analytics');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      
      // Runner actions
      case 'browse-missions':
        navigate('/missions');
        break;
      case 'check-in':
        navigate('/checkins/create');
        break;
      
      default:
        addMessage(`I understand you want to ${action}. Let me help you with that.`, true);
        break;
    }
  };

  // Role-based action buttons
  const getActionButtons = () => {
    if (!isAuthenticated || !user) {
      // Guest buttons - only help and info
      return [
        { 
          icon: <MessageCircle className="w-3.5 h-3.5" />, 
          text: "❓ Help", 
          action: "help",
          bgColor: "bg-gray-50", 
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          hoverColor: "hover:bg-gray-100"
        },
        { 
          icon: <CheckCircle className="w-3.5 h-3.5" />, 
          text: "ℹ️ About", 
          action: "about",
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          hoverColor: "hover:bg-blue-100"
        },
        { 
          icon: <Users className="w-3.5 h-3.5" />, 
          text: "👥 Features", 
          action: "features",
          bgColor: "bg-purple-50", 
          textColor: "text-purple-700",
          borderColor: "border-purple-200",
          hoverColor: "hover:bg-purple-100"
        },
        { 
          icon: <Settings className="w-3.5 h-3.5" />, 
          text: "⚙️ Sign Up", 
          action: "signup",
          bgColor: "bg-green-50", 
          textColor: "text-green-700",
          borderColor: "border-green-200",
          hoverColor: "hover:bg-green-100"
        }
      ];
    }

    // Role-specific buttons
    switch (user.role) {
      case 'RUNNER':
        return [
          { 
            icon: <MapPin className="w-3.5 h-3.5" />, 
            text: "🔍 Browse Missions", 
            action: "browse-missions",
            bgColor: "bg-green-50", 
            textColor: "text-green-700",
            borderColor: "border-green-200",
            hoverColor: "hover:bg-green-100"
          },
          { 
            icon: <CheckCircle className="w-3.5 h-3.5" />, 
            text: "✅ Check In", 
            action: "check-in",
            bgColor: "bg-blue-50", 
            textColor: "text-blue-700",
            borderColor: "border-blue-200",
            hoverColor: "hover:bg-blue-100"
          },
          { 
            icon: <Wallet className="w-3.5 h-3.5" />, 
            text: "💳 Expenses", 
            action: "expenses",
            bgColor: "bg-purple-50", 
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            hoverColor: "hover:bg-purple-100"
          },
          { 
            icon: <MessageCircle className="w-3.5 h-3.5" />, 
            text: "📊 Dashboard", 
            action: "dashboard",
            bgColor: "bg-orange-50", 
            textColor: "text-orange-700",
            borderColor: "border-orange-200",
            hoverColor: "hover:bg-orange-100"
          }
        ];

      case 'DJ':
        return [
          { 
            icon: <Music className="w-3.5 h-3.5" />, 
            text: "🎵 Submissions", 
            action: "submissions",
            bgColor: "bg-blue-50", 
            textColor: "text-blue-700",
            borderColor: "border-blue-200",
            hoverColor: "hover:bg-blue-100"
          },
          { 
            icon: <CheckCircle className="w-3.5 h-3.5" />, 
            text: "📚 Library", 
            action: "library",
            bgColor: "bg-purple-50", 
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            hoverColor: "hover:bg-purple-100"
          },
          { 
            icon: <Wallet className="w-3.5 h-3.5" />, 
            text: "💳 Expenses", 
            action: "expenses",
            bgColor: "bg-green-50", 
            textColor: "text-green-700",
            borderColor: "border-green-200",
            hoverColor: "hover:bg-green-100"
          },
          { 
            icon: <Settings className="w-3.5 h-3.5" />, 
            text: "⚙️ Settings", 
            action: "settings",
            bgColor: "bg-gray-50", 
            textColor: "text-gray-700",
            borderColor: "border-gray-200",
            hoverColor: "hover:bg-gray-100"
          }
        ];

      case 'CLIENT':
        return [
          { 
            icon: <Plus className="w-3.5 h-3.5" />, 
            text: "➕ Create Mission", 
            action: "create-mission",
            bgColor: "bg-purple-50", 
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            hoverColor: "hover:bg-purple-100"
          },
          { 
            icon: <Users className="w-3.5 h-3.5" />, 
            text: "🤝 P2P Missions", 
            action: "p2p-missions",
            bgColor: "bg-blue-50", 
            textColor: "text-blue-700",
            borderColor: "border-blue-200",
            hoverColor: "hover:bg-blue-100"
          },
          { 
            icon: <CheckCircle className="w-3.5 h-3.5" />, 
            text: "📋 My Missions", 
            action: "my-missions",
            bgColor: "bg-green-50", 
            textColor: "text-green-700",
            borderColor: "border-green-200",
            hoverColor: "hover:bg-green-100"
          },
          { 
            icon: <Wallet className="w-3.5 h-3.5" />, 
            text: "💳 Expenses", 
            action: "expenses",
            bgColor: "bg-orange-50", 
            textColor: "text-orange-700",
            borderColor: "border-orange-200",
            hoverColor: "hover:bg-orange-100"
          }
        ];

      case 'CURATOR':
        return [
          { 
            icon: <Users className="w-3.5 h-3.5" />, 
            text: "👥 Team Management", 
            action: "teams",
            bgColor: "bg-amber-50", 
            textColor: "text-amber-700",
            borderColor: "border-amber-200",
            hoverColor: "hover:bg-amber-100"
          },
          { 
            icon: <Plus className="w-3.5 h-3.5" />, 
            text: "🤝 Create P2P", 
            action: "create-p2p",
            bgColor: "bg-purple-50", 
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            hoverColor: "hover:bg-purple-100"
          },
          { 
            icon: <CheckCircle className="w-3.5 h-3.5" />, 
            text: "📋 Collaborations", 
            action: "collaborations",
            bgColor: "bg-blue-50", 
            textColor: "text-blue-700",
            borderColor: "border-blue-200",
            hoverColor: "hover:bg-blue-100"
          },
          { 
            icon: <Wallet className="w-3.5 h-3.5" />, 
            text: "💳 Expenses", 
            action: "expenses",
            bgColor: "bg-green-50", 
            textColor: "text-green-700",
            borderColor: "border-green-200",
            hoverColor: "hover:bg-green-100"
          }
        ];

      case 'OPERATIONS':
      case 'ADMIN':
        return [
          { 
            icon: <Users className="w-3.5 h-3.5" />, 
            text: "👥 User Management", 
            action: "users",
            bgColor: "bg-red-50", 
            textColor: "text-red-700",
            borderColor: "border-red-200",
            hoverColor: "hover:bg-red-100"
          },
          { 
            icon: <CheckCircle className="w-3.5 h-3.5" />, 
            text: "📊 Analytics", 
            action: "analytics",
            bgColor: "bg-blue-50", 
            textColor: "text-blue-700",
            borderColor: "border-blue-200",
            hoverColor: "hover:bg-blue-100"
          },
          { 
            icon: <MessageCircle className="w-3.5 h-3.5" />, 
            text: "🤖 ChatGPT Analytics", 
            action: "chatgpt-analytics",
            bgColor: "bg-purple-50", 
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            hoverColor: "hover:bg-purple-100"
          },
          { 
            icon: <Settings className="w-3.5 h-3.5" />, 
            text: "⚙️ System Settings", 
            action: "system",
            bgColor: "bg-gray-50", 
            textColor: "text-gray-700",
            borderColor: "border-gray-200",
            hoverColor: "hover:bg-gray-100"
          }
        ];

      default:
        return [
          { 
            icon: <CheckCircle className="w-3.5 h-3.5" />, 
            text: "✅ Missions", 
            action: "missions",
            bgColor: "bg-purple-50", 
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            hoverColor: "hover:bg-purple-100"
          },
          { 
            icon: <Wallet className="w-3.5 h-3.5" />, 
            text: "💳 Expenses", 
            action: "expenses",
            bgColor: "bg-green-50", 
            textColor: "text-green-700",
            borderColor: "border-green-200",
            hoverColor: "hover:bg-green-100"
          },
          { 
            icon: <Settings className="w-3.5 h-3.5" />, 
            text: "⚙️ Settings", 
            action: "settings",
            bgColor: "bg-gray-50", 
            textColor: "text-gray-700",
            borderColor: "border-gray-200",
            hoverColor: "hover:bg-gray-100"
          },
          { 
            icon: <MessageCircle className="w-3.5 h-3.5" />, 
            text: "❓ Help", 
            action: "help",
            bgColor: "bg-blue-50", 
            textColor: "text-blue-700",
            borderColor: "border-blue-200",
            hoverColor: "hover:bg-blue-100"
          }
        ];
    }
  };

  const actionButtons = getActionButtons();

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
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {!isAuthenticated || !user ? "Hello! I'm your AI Copilot" : `Hello ${user.role}! I'm your AI Copilot`}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-sm mx-auto">
                    {!isAuthenticated || !user 
                      ? "I can help you learn about Club Run, explore features, and get started with our platform."
                      : user.role === 'DJ' 
                        ? "I can help you review music submissions, manage your library, and create playlists."
                        : user.role === 'CLIENT'
                          ? "I can help you create missions, manage P2P collaborations, and track your bookings."
                          : user.role === 'CURATOR'
                            ? "I can help you manage teams, create P2P missions, and coordinate collaborations."
                            : user.role === 'OPERATIONS' || user.role === 'ADMIN'
                              ? "I can help you monitor system activity, manage users, and ensure platform operations."
                              : "I can help you with your Club Run activities and provide support."
                    }
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isBot
                    ? 'bg-gray-100 text-gray-800'
                    : `${theme.primary} text-white`
                }`}
                    >
                      <div className="text-sm">{message.text}</div>
                                      {message.isBot && message.source && (
                  <div className="text-xs mt-1 opacity-70">
                    {message.source === 'chatgpt' ? (
                      <span className="flex items-center gap-1">
                        🤖 AI Powered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        ⚡ Instant Response
                      </span>
                    )}
                  </div>
                )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={isTranscribing && transcription ? transcription : inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isTranscribing ? "Listening..." : "Ask me anything..."}
                  className={`flex-1 border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-500 ${
                    isTranscribing && transcription 
                      ? 'border-blue-300 focus:ring-blue-500 text-blue-700 bg-blue-50' 
                      : 'border-gray-300 focus:ring-blue-500 text-gray-900'
                  }`}
                  readOnly={isTranscribing && !!transcription}
                />
                <button 
                  onClick={handleVoiceInput}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : micPermission === 'denied'
                        ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
                        : micPermission === 'pending'
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  title={
                    micPermission === 'denied' 
                      ? 'Microphone permission denied' 
                      : micPermission === 'pending'
                        ? 'Requesting microphone permission...'
                        : isListening
                          ? 'Stop voice recording'
                          : 'Start voice recording'
                  }
                >
                  <Mic className={`w-4 h-4 ${
                    micPermission === 'denied' ? 'text-gray-200' : 'text-white'
                  }`} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              
              {/* Real-time transcription */}
              {isTranscribing && transcription && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600 font-medium">Live Transcription:</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{transcription}"</p>
                </div>
              )}
              
              {/* Voice status */}
              {isListening && !transcription && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-red-600 font-medium">Voice input active - Speak now</p>
                </div>
              )}
              {micPermission === 'pending' && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-yellow-600 font-medium">Requesting microphone permission...</p>
                </div>
              )}
              {micPermission === 'denied' && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-500 font-medium">Microphone access denied</p>
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