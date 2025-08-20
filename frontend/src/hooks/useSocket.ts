import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api';
import { RealTimeUpdate } from '@/types';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAppStore();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!user || socket?.connected) return;

    setIsConnecting(true);
    setError(null);

    try {
      const newSocket = io(api.getWebSocketUrl(), {
        auth: {
          token: localStorage.getItem('auth_token'),
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Join user room
        if (user) {
          newSocket.emit('join-user', user.id);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        setIsConnected(false);
        setIsConnecting(false);
        
        if (reason === 'io server disconnect') {
          // Server disconnected us, try to reconnect
          setTimeout(() => {
            connect();
          }, 1000);
        }
      });

      newSocket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        setError(err.message);
        setIsConnecting(false);
        
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, Math.pow(2, reconnectAttemptsRef.current) * 1000); // Exponential backoff
        }
      });

      // Real-time updates
      newSocket.on('venue-update', (data: RealTimeUpdate) => {
        console.log('Venue update received:', data);
        // Handle venue updates
      });

      newSocket.on('mission-update', (data: RealTimeUpdate) => {
        console.log('Mission update received:', data);
        // Handle mission updates
      });

      newSocket.on('user-update', (data: RealTimeUpdate) => {
        console.log('User update received:', data);
        // Handle user updates
      });

      newSocket.on('agent-update', (data: RealTimeUpdate) => {
        console.log('Agent update received:', data);
        // Handle agent updates
      });

      // AI Copilot events
      newSocket.on('copilot-response', (data: any) => {
        console.log('Copilot response received:', data);
        // Handle copilot responses
      });

      // Notification events
      newSocket.on('notification', (data: any) => {
        console.log('Notification received:', data);
        // Handle notifications
      });

      // Error events
      newSocket.on('error', (err: any) => {
        console.error('WebSocket error:', err);
        setError(err.message);
      });

      setSocket(newSocket);
    } catch (err: any) {
      console.error('Failed to create WebSocket connection:', err);
      setError(err.message);
      setIsConnecting(false);
    }
  }, [user, socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
      setError(null);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, [socket]);

  const emit = useCallback((event: string, data: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }, [socket]);

  // Auto-connect when user is available
  useEffect(() => {
    if (user && !socket) {
      connect();
    }
  }, [user, socket, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Handle user changes
  useEffect(() => {
    if (user && socket?.connected) {
      socket.emit('join-user', user.id);
    }
  }, [user, socket]);

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    emit,
  };
};

// Hook for specific socket events
export const useSocketEvent = (event: string, callback: (data: any) => void) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
};

// Hook for venue updates
export const useVenueUpdates = () => {
  const { updateVenue } = useAppStore();

  useSocketEvent('venue-update', (data: RealTimeUpdate) => {
    if (data.type === 'venue_update') {
      updateVenue(data.data.id, data.data);
    }
  });
};

// Hook for mission updates
export const useMissionUpdates = () => {
  const { updateMission } = useAppStore();

  useSocketEvent('mission-update', (data: RealTimeUpdate) => {
    if (data.type === 'mission_update') {
      updateMission(data.data.id, data.data);
    }
  });
};

// Hook for user updates
export const useUserUpdates = () => {
  const { setUser } = useAppStore();

  useSocketEvent('user-update', (data: RealTimeUpdate) => {
    if (data.type === 'user_update') {
      setUser(data.data);
    }
  });
};

// Hook for agent updates
export const useAgentUpdates = () => {
  const { updateAgent } = useAppStore();

  useSocketEvent('agent-update', (data: RealTimeUpdate) => {
    if (data.type === 'agent_update') {
      updateAgent(data.data.id, data.data);
    }
  });
};

// Hook for notifications
export const useNotificationUpdates = () => {
  const { addNotification } = useAppStore();

  useSocketEvent('notification', (data: any) => {
    addNotification(data);
  });
};

// Hook for copilot responses
export const useCopilotUpdates = () => {
  const { addChatMessage } = useAppStore();

  useSocketEvent('copilot-response', (data: any) => {
    addChatMessage({
      id: Date.now().toString(),
      type: 'copilot',
      content: data.message,
      timestamp: new Date(),
      actions: data.actions,
      metadata: data.metadata,
    });
  });
}; 