import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  Venue, 
  Mission, 
  Message, 
  Agent, 
  Activity, 
  Notification, 
  TabName, 
  Theme,
  UserSettings,
  Location
} from '@/types';

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Theme & Settings
  theme: Theme;
  settings: UserSettings;
  
  // Navigation
  activeTab: TabName;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Real-time data
  venues: Venue[];
  missions: Mission[];
  agents: Agent[];
  activities: Activity[];
  notifications: Notification[];
  chatMessages: Message[];
  
  // Location & Geolocation
  currentLocation: Location | null;
  locationPermission: 'granted' | 'denied' | 'prompt';
  
  // UI State
  copilotOpen: boolean;
  searchQuery: string;
  filters: {
    venues: any;
    missions: any;
  };
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  toggleTheme: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  setActiveTab: (tab: TabName) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  
  setVenues: (venues: Venue[]) => void;
  addVenue: (venue: Venue) => void;
  updateVenue: (id: string, updates: Partial<Venue>) => void;
  
  setMissions: (missions: Mission[]) => void;
  addMission: (mission: Mission) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  
  setAgents: (agents: Agent[]) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  
  addActivity: (activity: Activity) => void;
  setActivities: (activities: Activity[]) => void;
  
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  addChatMessage: (message: Message) => void;
  setChatMessages: (messages: Message[]) => void;
  clearChat: () => void;
  
  setCurrentLocation: (location: Location | null) => void;
  setLocationPermission: (permission: 'granted' | 'denied' | 'prompt') => void;
  
  toggleCopilot: () => void;
  setSearchQuery: (query: string) => void;
  updateFilters: (type: 'venues' | 'missions', filters: any) => void;
  
  // Computed values
  unreadNotifications: number;
  activeMissions: Mission[];
  completedMissions: Mission[];
  nearbyVenues: Venue[];
  userStats: {
    totalCheckIns: number;
    totalMissions: number;
    totalTokens: number;
    currentLevel: number;
    experienceToNextLevel: number;
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      theme: 'dark',
      settings: {
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profileVisibility: 'public',
          activityVisibility: 'friends',
          locationSharing: true,
        },
        preferences: {
          language: 'en',
          timezone: 'America/New_York',
          units: 'imperial',
        },
      },
      
      activeTab: 'dashboard',
      sidebarOpen: true,
      mobileMenuOpen: false,
      
      venues: [],
      missions: [],
      agents: [],
      activities: [],
      notifications: [],
      chatMessages: [],
      
      currentLocation: null,
      locationPermission: 'prompt',
      
      copilotOpen: false,
      searchQuery: '',
      filters: {
        venues: {},
        missions: {},
      },
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },
      
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),
      
      setActiveTab: (activeTab) => set({ activeTab }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      toggleMobileMenu: () => set((state) => ({ 
        mobileMenuOpen: !state.mobileMenuOpen 
      })),
      
      setVenues: (venues) => set({ venues }),
      
      addVenue: (venue) => set((state) => ({
        venues: [...state.venues, venue]
      })),
      
      updateVenue: (id, updates) => set((state) => ({
        venues: state.venues.map(venue => 
          venue.id === id ? { ...venue, ...updates } : venue
        )
      })),
      
      setMissions: (missions) => set({ missions }),
      
      addMission: (mission) => set((state) => ({
        missions: [...state.missions, mission]
      })),
      
      updateMission: (id, updates) => set((state) => ({
        missions: state.missions.map(mission => 
          mission.id === id ? { ...mission, ...updates } : mission
        )
      })),
      
      setAgents: (agents) => set({ agents }),
      
      updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map(agent => 
          agent.id === id ? { ...agent, ...updates } : agent
        )
      })),
      
      addActivity: (activity) => set((state) => ({
        activities: [activity, ...state.activities.slice(0, 49)] // Keep last 50
      })),
      
      setActivities: (activities) => set({ activities }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(notification =>
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),
      
      setChatMessages: (messages) => set({ chatMessages: messages }),
      
      clearChat: () => set({ chatMessages: [] }),
      
      setCurrentLocation: (location) => set({ currentLocation: location }),
      
      setLocationPermission: (permission) => set({ locationPermission: permission }),
      
      toggleCopilot: () => set((state) => ({ 
        copilotOpen: !state.copilotOpen 
      })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      updateFilters: (type, filters) => set((state) => ({
        filters: {
          ...state.filters,
          [type]: filters
        }
      })),
      
      // Computed values
      get unreadNotifications() {
        return get().notifications.filter(n => !n.isRead).length;
      },
      
      get activeMissions() {
        return get().missions.filter(m => !m.isCompleted);
      },
      
      get completedMissions() {
        return get().missions.filter(m => m.isCompleted);
      },
      
      get nearbyVenues() {
        const { venues, currentLocation } = get();
        if (!currentLocation) return venues;
        
        return venues.filter(venue => {
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            venue.coordinates.lat,
            venue.coordinates.lng
          );
          return distance <= 5; // Within 5 miles
        });
      },
      
      get userStats() {
        const { user } = get();
        if (!user) return {
          totalCheckIns: 0,
          totalMissions: 0,
          totalTokens: 0,
          currentLevel: 0,
          experienceToNextLevel: 0,
        };
        
        return {
          totalCheckIns: user.checkIns,
          totalMissions: user.missionsCompleted,
          totalTokens: user.tokens,
          currentLevel: user.level,
          experienceToNextLevel: 1000 - (user.experience % 1000), // Assuming 1000 XP per level
        };
      },
    }),
    {
      name: 'club-run-store',
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
        activeTab: state.activeTab,
        sidebarOpen: state.sidebarOpen,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Utility function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useVenues = () => useAppStore((state) => state.venues);
export const useMissions = () => useAppStore((state) => state.missions);
export const useAgents = () => useAppStore((state) => state.agents);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadNotifications = () => useAppStore((state) => state.unreadNotifications);
export const useCopilotOpen = () => useAppStore((state) => state.copilotOpen);
export const useCurrentLocation = () => useAppStore((state) => state.currentLocation);
export const useUserStats = () => useAppStore((state) => state.userStats); 