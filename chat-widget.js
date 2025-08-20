// Global Chat Widget for Club Run
// Include this script on any page to add the AI Copilot chat widget

(function() {
    'use strict';

    // Chat Widget HTML Template
    const chatWidgetHTML = `
        <div id="chat-widget" class="fixed bottom-6 right-6 z-50">
            <div class="chat-widget rounded-xl shadow-2xl w-80 h-96 flex flex-col">
                <!-- Chat Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">AI Copilot</h3>
                            <p class="text-xs text-blue-100">Ready to help!</p>
                        </div>
                    </div>
                    <button id="minimize-chat" class="text-white/80 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <!-- Chat Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                    <div class="text-center py-8">
                        <svg class="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Hello! I'm your AI Copilot</h3>
                        <p class="text-sm text-gray-600 mb-4">
                            I can help you with venue recommendations, business insights, and operational decisions.
                        </p>
                        <div class="grid grid-cols-2 gap-2">
                            <button class="quick-action-btn flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" data-action="venues">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="text-xs">Find Venues</span>
                            </button>
                            <button class="quick-action-btn flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" data-action="launch">
                                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span class="text-xs">Launch App</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="p-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2">
                        <input
                            id="chat-input"
                            type="text"
                            placeholder="Ask me anything..."
                            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button id="send-message" class="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const minimizedChatHTML = `
        <div id="minimized-chat" class="fixed bottom-6 right-6 z-50 hidden">
            <button id="expand-chat" class="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 flex items-center justify-center hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
        </div>
    `;

    // Chat Widget CSS
    const chatWidgetCSS = `
        <style>
            .chat-widget {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .typing-indicator {
                display: flex;
                gap: 4px;
            }
            .typing-dot {
                width: 8px;
                height: 8px;
                background: #667eea;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            .typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
            #chat-widget, #minimized-chat {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
        </style>
    `;

    // Initialize Chat Widget
    function initChatWidget() {
        // Add CSS to head
        if (!document.getElementById('chat-widget-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'chat-widget-styles';
            styleElement.innerHTML = chatWidgetCSS;
            document.head.appendChild(styleElement);
        }

        // Add chat widget to body
        if (!document.getElementById('chat-widget')) {
            document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);
            document.body.insertAdjacentHTML('beforeend', minimizedChatHTML);
        }

        // Initialize functionality
        initChatFunctionality();
    }

    // Chat Functionality
    function initChatFunctionality() {
        const chatWidget = document.getElementById('chat-widget');
        const minimizedChat = document.getElementById('minimized-chat');
        const minimizeBtn = document.getElementById('minimize-chat');
        const expandBtn = document.getElementById('expand-chat');
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-message');
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');

        if (!chatWidget || !minimizedChat) return;

        // Minimize/Expand functionality
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                chatWidget.classList.add('hidden');
                minimizedChat.classList.remove('hidden');
            });
        }

        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                chatWidget.classList.remove('hidden');
                minimizedChat.classList.add('hidden');
            });
        }

        // Send message functionality
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';

            // Show typing indicator
            showTypingIndicator();

            // Simulate AI response
            setTimeout(() => {
                hideTypingIndicator();
                const response = generateResponse(message);
                addMessage(response, 'ai');
            }, 1000 + Math.random() * 2000);
        }

        function addMessage(content, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
            
            const messageBubble = document.createElement('div');
            messageBubble.className = `max-w-[80%] rounded-lg p-3 ${
                sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
            }`;
            
            messageBubble.innerHTML = `
                <p class="text-sm">${content}</p>
                <p class="text-xs opacity-70 mt-2">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            `;
            
            messageDiv.appendChild(messageBubble);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'flex justify-start';
            typingDiv.id = 'typing-indicator';
            
            typingDiv.innerHTML = `
                <div class="bg-gray-100 rounded-lg p-3">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            `;
            
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        function generateResponse(input) {
            const lowerInput = input.toLowerCase();
            const currentPath = window.location.pathname;
            
            if (lowerInput.includes('venue') || lowerInput.includes('place') || lowerInput.includes('club')) {
                return "I can help you find great venues! Here are some popular options in Atlanta. Would you like me to show you venues with specific features like rooftop bars or live music?";
            }
            
            if (lowerInput.includes('launch') || lowerInput.includes('app') || lowerInput.includes('dashboard')) {
                if (currentPath.includes('frontend')) {
                    return "You're already in the app! I can help you navigate to different sections like venues, missions, or your dashboard.";
                } else {
                    return "Great! You can launch the full Agent Dashboard by clicking the 'Launch App' button in the navigation or the main CTA button. It has all the advanced features!";
                }
            }
            
            if (lowerInput.includes('ai') || lowerInput.includes('agent') || lowerInput.includes('copilot')) {
                return "I'm your AI Copilot! I can help with venue research, budget management, reporting, and customer interactions. What would you like to know?";
            }
            
            if (lowerInput.includes('help') || lowerInput.includes('support')) {
                return "I'm here to help! I can assist with venue recommendations, business insights, operational decisions, and guide you through the platform. What do you need?";
            }
            
            if (lowerInput.includes('mission') || lowerInput.includes('task')) {
                return "I can help you with missions! Track your progress, find new challenges, and earn rewards. Would you like to see your current missions?";
            }
            
            if (lowerInput.includes('check in') || lowerInput.includes('checkin')) {
                return "I can help you check in at venues! Use the check-in feature to earn tokens and track your nightlife adventures.";
            }
            
            return "I'm your AI Copilot and I'm here to help with your nightlife business! I can help you find venues, manage budgets, analyze data, and make operational decisions. What would you like to do?";
        }

        // Event listeners
        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }

        // Quick action buttons
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'venues') {
                    addMessage('I can help you find venues! What type of venue are you looking for?', 'ai');
                } else if (action === 'launch') {
                    if (currentPath.includes('frontend')) {
                        addMessage('You\'re already in the app! Let me help you navigate to different sections.', 'ai');
                    } else {
                        window.location.href = 'frontend/';
                    }
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }

    // Export for global access
    window.ClubRunChat = {
        init: initChatWidget,
        show: () => {
            const chatWidget = document.getElementById('chat-widget');
            const minimizedChat = document.getElementById('minimized-chat');
            if (chatWidget && minimizedChat) {
                chatWidget.classList.remove('hidden');
                minimizedChat.classList.add('hidden');
            }
        },
        hide: () => {
            const chatWidget = document.getElementById('chat-widget');
            const minimizedChat = document.getElementById('minimized-chat');
            if (chatWidget && minimizedChat) {
                chatWidget.classList.add('hidden');
                minimizedChat.classList.remove('hidden');
            }
        }
    };

})(); 