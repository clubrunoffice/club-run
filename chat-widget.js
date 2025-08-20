// Global Chat Widget for Club Run
// Include this script on any page to add the AI Copilot chat widget

(function() {
    'use strict';

    // Global Voice Permission Management System
    window.VoicePermissionManager = {
        PERMISSION_KEY: 'clubrun_mic_permission',
        PERMISSION_STATES: {
            NEVER: 'never',
            ALWAYS: 'always',
            ASK: 'ask'
        },

        getStoredPermission() {
            return localStorage.getItem(this.PERMISSION_KEY) || this.PERMISSION_STATES.ASK;
        },

        setStoredPermission(permission) {
            localStorage.setItem(this.PERMISSION_KEY, permission);
            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('voicePermissionChanged', { 
                detail: { permission } 
            }));
        },

        async requestPermission() {
            const storedPermission = this.getStoredPermission();
            
            if (storedPermission === this.PERMISSION_STATES.NEVER) {
                return false;
            }
            
            if (storedPermission === this.PERMISSION_STATES.ASK) {
                const userChoice = await this.showPermissionDialog();
                if (userChoice === this.PERMISSION_STATES.NEVER) {
                    return false;
                }
            }
            
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                return true;
            } catch (error) {
                console.error('Microphone permission error:', error);
                return false;
            }
        },

        // Force show permission dialog for testing
        forceShowPermissionDialog() {
            console.log('Force showing permission dialog');
            return this.showPermissionDialog();
        },

        showPermissionDialog() {
            return new Promise((resolve) => {
                const dialog = document.createElement('div');
                dialog.className = 'permission-dialog';
                dialog.innerHTML = `
                    <div class="permission-content">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">Microphone Access</h3>
                                <p class="text-sm text-gray-600">Club Run needs microphone access for voice input</p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">
                            This allows you to speak with the AI Copilot using voice commands. Your voice data is processed locally and not stored.
                        </p>
                        <div class="permission-options">
                            <div class="permission-option primary" data-permission="always">
                                <span>Always Allow</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div class="permission-option" data-permission="ask">
                                <span>Ask Every Time</span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="permission-option danger" data-permission="never">
                                <span>Never Allow</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <div id="permission-sync-status" class="hidden mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span class="text-sm text-blue-700">Syncing permissions across interfaces...</span>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(dialog);

                // Add event listeners
                const options = dialog.querySelectorAll('.permission-option');
                const syncStatus = dialog.querySelector('#permission-sync-status');
                
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        const permission = option.dataset.permission;
                        
                        // Show syncing status
                        syncStatus.classList.remove('hidden');
                        
                        // Set permission and notify other components
                        this.setStoredPermission(permission);
                        
                        // Show success message
                        setTimeout(() => {
                            syncStatus.innerHTML = `
                                <div class="flex items-center space-x-2">
                                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span class="text-sm text-green-700">Permissions synced successfully!</span>
                                </div>
                            `;
                            
                            // Close dialog after showing success
                            setTimeout(() => {
                                document.body.removeChild(dialog);
                                resolve(permission);
                            }, 1000);
                        }, 500);
                    });
                });

                // Close on background click
                dialog.addEventListener('click', (e) => {
                    if (e.target === dialog) {
                        document.body.removeChild(dialog);
                        resolve(this.PERMISSION_STATES.NEVER);
                    }
                });
            });
        },

        resetPermission() {
            localStorage.removeItem(this.PERMISSION_KEY);
            window.dispatchEvent(new CustomEvent('voicePermissionChanged', { 
                detail: { permission: this.PERMISSION_STATES.ASK } 
            }));
        }
    };

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
                            <p class="text-xs text-blue-100">Ready to help! 🎤 Voice enabled</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button id="voice-mode-toggle" class="text-white/80 hover:text-white transition-colors p-1 rounded" title="Voice Mode">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                        <button id="minimize-chat" class="text-white/80 hover:text-white transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                    <div class="text-center py-6">
                        <svg class="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Hello! I'm your AI Copilot</h3>
                        <p class="text-sm text-gray-600 mb-4">
                            I can help you with venue recommendations, business insights, and operational decisions. You can type or use voice input!
                        </p>
                        <div class="space-y-2">
                            <button class="quick-action-btn w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-blue-700 font-medium" data-action="checkin">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>📱 Quick Check-In</span>
                            </button>
                            <button class="quick-action-btn w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors text-green-700 font-medium" data-action="expense">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span>💳 Log Expense</span>
                            </button>
                            <button class="quick-action-btn w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors text-purple-700 font-medium" data-action="missions">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>✅ View Missions</span>
                            </button>
                            <button class="quick-action-btn w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors text-orange-700 font-medium" data-action="venues">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>📍 Find Venues</span>
                            </button>
                        </div>
                        <div class="mt-4 text-xs text-gray-500">
                            💡 Tip: Click the microphone button or use the voice toggle to speak with me!
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
                        <button id="mic-button" class="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors" title="Voice Input">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
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
            <button id="expand-chat" class="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 flex items-center justify-center hover:scale-110">
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
            .permission-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .permission-content {
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .permission-options {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 16px;
            }
            .permission-option {
                padding: 12px 16px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .permission-option:hover {
                background: #f9fafb;
                border-color: #d1d5db;
            }
            .permission-option.primary {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }
            .permission-option.primary:hover {
                background: #2563eb;
            }
            .permission-option.danger {
                background: #ef4444;
                color: white;
                border-color: #ef4444;
            }
            .permission-option.danger:hover {
                background: #dc2626;
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
        const micBtn = document.getElementById('mic-button');
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        const voiceModeToggle = document.getElementById('voice-mode-toggle');
        const voiceStatus = document.getElementById('voice-status');

        if (!chatWidget || !minimizedChat) return;

        // Permission management - now using global VoicePermissionManager
        const PERMISSION_KEY = 'clubrun_mic_permission';
        const PERMISSION_STATES = {
            NEVER: 'never',
            ALWAYS: 'always',
            ASK: 'ask'
        };

        function getStoredPermission() {
            return window.VoicePermissionManager.getStoredPermission();
        }

        function setStoredPermission(permission) {
            window.VoicePermissionManager.setStoredPermission(permission);
        }

        function showPermissionDialog() {
            return window.VoicePermissionManager.showPermissionDialog();
        }

        async function requestMicrophonePermission() {
            const permission = await window.VoicePermissionManager.requestPermission();
            
            if (!permission) {
                const storedPermission = getStoredPermission();
                if (storedPermission === PERMISSION_STATES.NEVER) {
                    addMessage('Microphone access is disabled. You can enable it in your browser settings or change your preference.', 'ai');
                } else {
                    addMessage('Microphone permission denied. Please allow microphone access in your browser settings to use voice input.', 'ai');
                }
            }
            
            return permission;
        }

        // Microphone permission and voice recognition
        let isListening = false;
        let recognition = null;

        // Initialize speech recognition if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isListening = true;
                micBtn.classList.remove('bg-gray-100', 'text-gray-600');
                micBtn.classList.add('bg-red-500', 'text-white');
                micBtn.innerHTML = `
                    <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                `;
                chatInput.placeholder = 'Listening...';
                voiceStatus.classList.remove('hidden');
                
                // Update AI Copilot status
                if (typeof updateAICopilotStatus === 'function') {
                    updateAICopilotStatus('Listening for voice input...', 'listening');
                }
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                chatInput.value = transcript;
                
                // Auto-send the message
                setTimeout(() => {
                    sendMessage();
                }, 500);
            };

            recognition.onend = () => {
                isListening = false;
                micBtn.classList.remove('bg-red-500', 'text-white');
                micBtn.classList.add('bg-gray-100', 'text-gray-600');
                micBtn.innerHTML = `
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                `;
                chatInput.placeholder = 'Ask me anything...';
                voiceStatus.classList.add('hidden');
                
                // Update AI Copilot status
                if (typeof updateAICopilotStatus === 'function') {
                    updateAICopilotStatus('Voice input completed', 'active');
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                isListening = false;
                micBtn.classList.remove('bg-red-500', 'text-white');
                micBtn.classList.add('bg-gray-100', 'text-gray-600');
                micBtn.innerHTML = `
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                `;
                chatInput.placeholder = 'Ask me anything...';
                voiceStatus.classList.add('hidden');
                
                let errorMessage = 'Voice input error. Please try again.';
                if (event.error === 'not-allowed') {
                    errorMessage = 'Microphone permission denied. Please allow microphone access to use voice input.';
                } else if (event.error === 'no-speech') {
                    errorMessage = 'No speech detected. Please try speaking again.';
                }
                
                addMessage(errorMessage, 'ai');
                
                // Update AI Copilot status
                if (typeof updateAICopilotStatus === 'function') {
                    updateAICopilotStatus('Voice input error', 'standby');
                }
            };
        }

        // Voice mode toggle functionality
        if (voiceModeToggle) {
            voiceModeToggle.addEventListener('click', () => {
                if (recognition) {
                    if (isListening) {
                        recognition.stop();
                        micBtn.classList.remove('bg-red-500', 'text-white');
                        micBtn.classList.add('bg-gray-100', 'text-gray-600');
                        micBtn.innerHTML = `
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        `;
                        chatInput.placeholder = 'Ask me anything...';
                        voiceStatus.classList.add('hidden');
                    } else {
                        // Request microphone permission if not already granted
                        requestMicrophonePermission()
                            .then((permission) => {
                                if (permission === false) {
                                    return;
                                }
                                recognition.start();
                                micBtn.classList.remove('bg-gray-100', 'text-gray-600');
                                micBtn.classList.add('bg-red-500', 'text-white');
                                micBtn.innerHTML = `
                                    <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                `;
                                chatInput.placeholder = 'Listening...';
                                voiceStatus.classList.remove('hidden');
                                if (typeof showNotification === 'function') {
                                    showNotification('🎤 Voice activated! Speak now...', 'info');
                                }
                            });
                    }
                } else {
                    addMessage('Voice input is not supported in this browser. Please use text input instead.', 'ai');
                }
            });
        }

        // Microphone button click handler
        if (micBtn) {
            micBtn.addEventListener('click', () => {
                if (!recognition) {
                    addMessage('Voice input is not supported in this browser. Please use text input instead.', 'ai');
                    return;
                }

                if (isListening) {
                    recognition.stop();
                    return;
                }

                // Request microphone permission
                requestMicrophonePermission()
                    .then((permission) => {
                        if (permission === false) {
                            addMessage('Microphone access is disabled. You can enable it in your browser settings or change your preference.', 'ai');
                            return;
                        }
                        // Permission granted, start recognition
                        recognition.start();
                        
                        // Show notification
                        if (typeof showNotification === 'function') {
                            showNotification('🎤 Microphone activated! Speak now...', 'info');
                        }
                    })
                    .catch((error) => {
                        console.error('Microphone permission error:', error);
                        addMessage('Microphone permission denied. Please allow microphone access in your browser settings to use voice input.', 'ai');
                        
                        // Show notification
                        if (typeof showNotification === 'function') {
                            showNotification('❌ Microphone permission denied', 'error');
                        }
                        
                        // Update AI Copilot status
                        if (typeof updateAICopilotStatus === 'function') {
                            updateAICopilotStatus('Microphone permission denied', 'standby');
                        }
                    });
            });
        }

        // Add a function to reset permission preferences (for testing)
        window.resetMicrophonePermission = function() {
            window.VoicePermissionManager.resetPermission();
            addMessage('Microphone permission preferences have been reset. You will be asked again next time.', 'ai');
        };

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
            
            // Show quick actions after AI responses
            if (sender === 'ai') {
                setTimeout(() => {
                    showQuickActions();
                }, 1000);
            }
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

        function showQuickActions() {
            // Remove existing quick actions if any
            const existingActions = document.querySelector('.quick-actions-container');
            if (existingActions) {
                existingActions.remove();
            }
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'quick-actions-container mt-4 space-y-2';
            actionsDiv.innerHTML = `
                <p class="text-xs text-gray-500 text-center mb-2">Quick Actions:</p>
                <div class="grid grid-cols-2 gap-2">
                    <button class="quick-action-btn flex items-center justify-center space-x-2 p-2 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-blue-700 text-xs" data-action="checkin">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>Check In</span>
                    </button>
                    <button class="quick-action-btn flex items-center justify-center space-x-2 p-2 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors text-green-700 text-xs" data-action="expense">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Log Expense</span>
                    </button>
                    <button class="quick-action-btn flex items-center justify-center space-x-2 p-2 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors text-purple-700 text-xs" data-action="missions">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Missions</span>
                    </button>
                    <button class="quick-action-btn flex items-center justify-center space-x-2 p-2 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors text-orange-700 text-xs" data-action="venues">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Venues</span>
                    </button>
                </div>
                <div class="mt-2 text-center">
                    <button class="quick-action-btn text-xs text-gray-500 hover:text-gray-700 underline" data-action="reset-permissions">
                        Reset Microphone Permissions
                    </button>
                </div>
            `;
            
            chatMessages.appendChild(actionsDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Add event listeners to new quick action buttons
            const newQuickActionBtns = actionsDiv.querySelectorAll('.quick-action-btn');
            newQuickActionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    
                    // Add visual feedback
                    btn.classList.add('scale-95');
                    setTimeout(() => btn.classList.remove('scale-95'), 150);
                    
                    if (action === 'checkin') {
                        addMessage('Opening Quick Check-In form...', 'ai');
                        if (typeof openQuickCheckIn === 'function') {
                            setTimeout(() => {
                                openQuickCheckIn();
                                if (typeof showNotification === 'function') {
                                    showNotification('📱 Quick Check-In form opened!', 'info');
                                }
                                if (typeof updateAICopilotStatus === 'function') {
                                    updateAICopilotStatus('Check-in form opened', 'active');
                                }
                            }, 500);
                        }
                    } else if (action === 'expense') {
                        addMessage('Opening Log Expense form...', 'ai');
                        if (typeof openLogExpense === 'function') {
                            setTimeout(() => {
                                openLogExpense();
                                if (typeof showNotification === 'function') {
                                    showNotification('💰 Log Expense form opened!', 'info');
                                }
                                if (typeof updateAICopilotStatus === 'function') {
                                    updateAICopilotStatus('Expense form opened', 'active');
                                }
                            }, 500);
                        }
                    } else if (action === 'missions') {
                        addMessage('Opening Active Missions...', 'ai');
                        if (typeof openViewMissions === 'function') {
                            setTimeout(() => {
                                openViewMissions();
                                if (typeof showNotification === 'function') {
                                    showNotification('🎯 Active Missions opened!', 'info');
                                }
                                if (typeof updateAICopilotStatus === 'function') {
                                    updateAICopilotStatus('Missions view opened', 'active');
                                }
                            }, 500);
                        }
                    } else if (action === 'venues') {
                        addMessage('I can help you find venues! What type of venue are you looking for?', 'ai');
                        if (typeof updateAICopilotStatus === 'function') {
                            updateAICopilotStatus('Venue search activated', 'active');
                        }
                    } else if (action === 'reset-permissions') {
                        window.resetMicrophonePermission();
                    }
                });
            });
        }

        function generateResponse(input) {
            const lowerInput = input.toLowerCase();
            const currentPath = window.location.pathname;
            
            // Update main AI Copilot status when processing
            if (typeof updateAICopilotStatus === 'function') {
                updateAICopilotStatus(`Processing: "${input}"`, 'listening');
            }
            
            // Quick Actions triggers
            if (lowerInput.includes('check in') || lowerInput.includes('checkin') || lowerInput.includes('check-in')) {
                // Trigger the check-in modal
                if (typeof openQuickCheckIn === 'function') {
                    setTimeout(() => {
                        openQuickCheckIn();
                        if (typeof showNotification === 'function') {
                            showNotification('📱 Quick Check-In form opened!', 'info');
                        }
                        if (typeof updateAICopilotStatus === 'function') {
                            updateAICopilotStatus('Check-in form opened', 'active');
                        }
                    }, 1000);
                }
                return "Opening the Quick Check-In form for you! Please fill in the venue details and I'll help you check in.";
            }
            
            if (lowerInput.includes('log expense') || lowerInput.includes('expense') || lowerInput.includes('spend') || lowerInput.includes('cost')) {
                // Trigger the expense modal
                if (typeof openLogExpense === 'function') {
                    setTimeout(() => {
                        openLogExpense();
                        if (typeof showNotification === 'function') {
                            showNotification('💰 Log Expense form opened!', 'info');
                        }
                        if (typeof updateAICopilotStatus === 'function') {
                            updateAICopilotStatus('Expense form opened', 'active');
                        }
                    }, 1000);
                }
                return "Opening the Log Expense form! Please enter the expense details and I'll help you track it.";
            }
            
            if (lowerInput.includes('mission') || lowerInput.includes('task') || lowerInput.includes('progress')) {
                // Trigger the missions modal
                if (typeof openViewMissions === 'function') {
                    setTimeout(() => {
                        openViewMissions();
                        if (typeof showNotification === 'function') {
                            showNotification('🎯 Active Missions opened!', 'info');
                        }
                        if (typeof updateAICopilotStatus === 'function') {
                            updateAICopilotStatus('Missions view opened', 'active');
                        }
                    }, 1000);
                }
                return "Opening your Active Missions! Here you can see all your current tasks and their progress.";
            }
            
            if (lowerInput.includes('venue') || lowerInput.includes('place') || lowerInput.includes('club') || lowerInput.includes('bar')) {
                if (typeof updateAICopilotStatus === 'function') {
                    updateAICopilotStatus('Searching for venues...', 'active');
                }
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
                if (typeof updateAICopilotStatus === 'function') {
                    updateAICopilotStatus('AI Copilot ready to help!', 'active');
                }
                return "I'm your AI Copilot! I can help with venue research, budget management, reporting, and customer interactions. What would you like to know?";
            }
            
            if (lowerInput.includes('help') || lowerInput.includes('support')) {
                if (typeof updateAICopilotStatus === 'function') {
                    updateAICopilotStatus('Providing help and support', 'active');
                }
                return "I'm here to help! I can assist with venue recommendations, business insights, operational decisions, and guide you through the platform. What do you need?";
            }
            
            if (lowerInput.includes('budget') || lowerInput.includes('money') || lowerInput.includes('finance')) {
                if (typeof updateAICopilotStatus === 'function') {
                    updateAICopilotStatus('Accessing budget information', 'active');
                }
                return "I can help you manage your budget! You can log expenses, track spending, and get insights on your financial performance. Would you like to log an expense or view your budget status?";
            }
            
            if (typeof updateAICopilotStatus === 'function') {
                updateAICopilotStatus('Ready to help with your request', 'active');
            }
            return "I'm your AI Copilot and I'm here to help with your nightlife business! I can help you check in at venues, log expenses, view missions, find venues, manage budgets, analyze data, and make operational decisions. What would you like to do?";
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
                
                // Add visual feedback
                btn.classList.add('scale-95');
                setTimeout(() => btn.classList.remove('scale-95'), 150);
                
                if (action === 'checkin') {
                    addMessage('Opening Quick Check-In form...', 'ai');
                    if (typeof openQuickCheckIn === 'function') {
                        setTimeout(() => {
                            openQuickCheckIn();
                            if (typeof showNotification === 'function') {
                                showNotification('📱 Quick Check-In form opened!', 'info');
                            }
                            if (typeof updateAICopilotStatus === 'function') {
                                updateAICopilotStatus('Check-in form opened', 'active');
                            }
                        }, 500);
                    } else {
                        addMessage('Sorry, the check-in feature is not available right now.', 'ai');
                    }
                } else if (action === 'expense') {
                    addMessage('Opening Log Expense form...', 'ai');
                    if (typeof openLogExpense === 'function') {
                        setTimeout(() => {
                            openLogExpense();
                            if (typeof showNotification === 'function') {
                                showNotification('💰 Log Expense form opened!', 'info');
                            }
                            if (typeof updateAICopilotStatus === 'function') {
                                updateAICopilotStatus('Expense form opened', 'active');
                            }
                        }, 500);
                    } else {
                        addMessage('Sorry, the expense logging feature is not available right now.', 'ai');
                    }
                } else if (action === 'missions') {
                    addMessage('Opening Active Missions...', 'ai');
                    if (typeof openViewMissions === 'function') {
                        setTimeout(() => {
                            openViewMissions();
                            if (typeof showNotification === 'function') {
                                showNotification('🎯 Active Missions opened!', 'info');
                            }
                            if (typeof updateAICopilotStatus === 'function') {
                                updateAICopilotStatus('Missions view opened', 'active');
                            }
                        }, 500);
                    } else {
                        addMessage('Sorry, the missions feature is not available right now.', 'ai');
                    }
                } else if (action === 'venues') {
                    addMessage('I can help you find venues! What type of venue are you looking for? You can ask me about specific features like rooftop bars, live music venues, or popular nightclubs.', 'ai');
                    if (typeof updateAICopilotStatus === 'function') {
                        updateAICopilotStatus('Venue search activated', 'active');
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

    // Listen for voice permission changes from other components
    window.addEventListener('voicePermissionChanged', (event) => {
        const { permission } = event.detail;
        updateVoiceUIState(permission);
        
        // Show notification about permission change
        if (typeof showNotification === 'function') {
            const permissionText = permission === 'always' ? 'Always Allow' : 
                                 permission === 'never' ? 'Never Allow' : 'Ask Every Time';
            showNotification(`🎤 Voice permission updated: ${permissionText}`, 'info');
        }
    });

    // Function to update voice UI state based on permission
    function updateVoiceUIState(permission) {
        const voiceModeToggle = document.getElementById('voice-mode-toggle');
        const voiceStatus = document.getElementById('voice-status');
        const micBtn = document.getElementById('mic-button');
        
        if (voiceModeToggle) {
            if (permission === 'never') {
                voiceModeToggle.classList.add('opacity-50');
                voiceModeToggle.title = 'Voice disabled - Change permission to enable';
            } else {
                voiceModeToggle.classList.remove('opacity-50');
                voiceModeToggle.title = 'Voice Mode';
            }
        }
        
        if (voiceStatus) {
            if (permission === 'always') {
                voiceStatus.classList.remove('hidden');
                voiceStatus.textContent = '🎤 Voice enabled';
            } else if (permission === 'never') {
                voiceStatus.classList.remove('hidden');
                voiceStatus.textContent = '🎤 Voice disabled';
            } else {
                voiceStatus.classList.add('hidden');
            }
        }
        
        // Update microphone button state
        if (micBtn && permission === 'never') {
            micBtn.classList.add('opacity-50');
            micBtn.title = 'Microphone disabled - Change permission to enable';
        } else if (micBtn) {
            micBtn.classList.remove('opacity-50');
            micBtn.title = 'Click to use voice input';
        }
    }

    // Initialize voice UI state on load
    function initializeVoiceUIState() {
        if (window.VoicePermissionManager) {
            const currentPermission = window.VoicePermissionManager.getStoredPermission();
            updateVoiceUIState(currentPermission);
        }
    }

    // Call initialization after widget is created
    setTimeout(initializeVoiceUIState, 100);

    // Global function to reset microphone permissions
    window.resetMicrophonePermission = function() {
        if (window.VoicePermissionManager) {
            // Show syncing indicator
            if (typeof showSyncIndicator === 'function') {
                showSyncIndicator();
            }
            
            // Reset permission
            window.VoicePermissionManager.resetPermission();
            
            // Show success message
            setTimeout(() => {
                if (typeof showNotification === 'function') {
                    showNotification('🔄 Microphone permissions reset and synced across all interfaces', 'success');
                }
                
                // Update UI states
                updateVoiceUIState('ask');
                
                // Add message to chat
                addMessage('Microphone permissions have been reset. You will be asked for permission again when using voice features.', 'ai');
            }, 1000);
        } else {
            addMessage('Error: Voice Permission Manager not available', 'ai');
        }
    };

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