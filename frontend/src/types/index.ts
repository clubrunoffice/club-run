// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  tokens: number;
  level: number;
  experience: number;
  checkIns: number;
  missionsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

// Venue Types
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  website?: string;
  hours: string;
  description: string;
  category: VenueCategory;
  crowdLevel: CrowdLevel;
  safetyRating: number;
  avgCost: number;
  checkInReward: number;
  status: VenueStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  amenities: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export enum VenueCategory {
  NIGHTCLUB = 'nightclub',
  BAR = 'bar',
  LOUNGE = 'lounge',
  RESTAURANT = 'restaurant',
  BREWERY = 'brewery',
  WINERY = 'winery',
  COCKTAIL_BAR = 'cocktail_bar',
  SPORTS_BAR = 'sports_bar',
  KARAOKE = 'karaoke',
  COMEDY_CLUB = 'comedy_club',
  LIVE_MUSIC = 'live_music',
  DANCE_CLUB = 'dance_club',
  ROOFTOP = 'rooftop',
  SPEAKEASY = 'speakeasy',
  PUB = 'pub',
  TAVERN = 'tavern'
}

export enum CrowdLevel {
  EMPTY = 'empty',
  LIGHT = 'light',
  MODERATE = 'moderate',
  BUSY = 'busy',
  PACKED = 'packed'
}

export enum VenueStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  TEMPORARILY_CLOSED = 'temporarily_closed',
  COMING_SOON = 'coming_soon'
}

// Mission Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  category: MissionCategory;
  reward: number;
  progress: number;
  target: number;
  timeLeft: string;
  expiresAt: string;
  isCompleted: boolean;
  requirements: MissionRequirement[];
  createdAt: string;
  updatedAt: string;
}

export enum MissionType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SPECIAL = 'special',
  EVENT = 'event'
}

export enum MissionCategory {
  CHECK_IN = 'check_in',
  SOCIAL = 'social',
  EXPLORATION = 'exploration',
  COLLECTION = 'collection',
  ACHIEVEMENT = 'achievement'
}

export interface MissionRequirement {
  type: string;
  value: any;
  current: number;
  target: number;
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  confidence: number;
  task: string;
  insight: string;
  lastActive: string;
  capabilities: string[];
}

export enum AgentType {
  RESEARCH = 'research',
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  QA = 'qa',
  ANALYTICS = 'analytics',
  NOTIFICATION = 'notification',
  DEPLOYMENT = 'deployment',
  LIVE_PREVIEW = 'live_preview'
}

export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BUSY = 'busy',
  ERROR = 'error'
}

// AI Copilot Types
export interface Message {
  id: string;
  type: 'user' | 'copilot';
  content: string;
  timestamp: Date;
  actions?: Action[];
  metadata?: {
    confidence?: number;
    processingTime?: number;
    tokens?: number;
  };
}

export interface Action {
  type: ActionType;
  payload: any;
  description: string;
}

export enum ActionType {
  CHECK_IN = 'check_in',
  THEME_TOGGLE = 'theme_toggle',
  NAVIGATE = 'navigate',
  OPEN_VENUE = 'open_venue',
  START_MISSION = 'start_mission',
  SHARE_ACTIVITY = 'share_activity',
  UPDATE_PROFILE = 'update_profile',
  SEND_NOTIFICATION = 'send_notification'
}

// Navigation Types
export type TabName = 'dashboard' | 'venues' | 'missions' | 'profile' | 'community' | 'copilot';

export interface NavigationItem {
  name: TabName;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

// Activity Types
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  userId: string;
  venueId?: string;
  missionId?: string;
  metadata?: any;
  createdAt: string;
}

export enum ActivityType {
  CHECK_IN = 'check_in',
  MISSION_COMPLETED = 'mission_completed',
  LEVEL_UP = 'level_up',
  TOKEN_EARNED = 'token_earned',
  VENUE_DISCOVERED = 'venue_discovered',
  FRIEND_JOINED = 'friend_joined'
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
  timestamp: string;
}

// WebSocket Types
export interface SocketEvent {
  type: string;
  payload: any;
  timestamp: string;
}

export interface RealTimeUpdate {
  type: 'venue_update' | 'mission_update' | 'user_update' | 'agent_update';
  data: any;
  timestamp: string;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CheckInForm {
  venueId: string;
  rating?: number;
  review?: string;
  photos?: File[];
}

// Filter Types
export interface VenueFilters {
  category?: VenueCategory[];
  crowdLevel?: CrowdLevel[];
  priceRange?: [number, number];
  rating?: number;
  amenities?: string[];
  tags?: string[];
  radius?: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface MissionFilters {
  type?: MissionType[];
  category?: MissionCategory[];
  status?: 'active' | 'completed' | 'expired';
  reward?: [number, number];
}

// Search Types
export interface SearchResult {
  venues: Venue[];
  missions: Mission[];
  users: User[];
  total: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export enum NotificationType {
  MISSION_COMPLETED = 'mission_completed',
  LEVEL_UP = 'level_up',
  TOKEN_EARNED = 'token_earned',
  VENUE_UPDATE = 'venue_update',
  FRIEND_ACTIVITY = 'friend_activity',
  SYSTEM = 'system'
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Settings Types
export interface UserSettings {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    activityVisibility: 'public' | 'friends' | 'private';
    locationSharing: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    units: 'metric' | 'imperial';
  };
}

// Analytics Types
export interface UserStats {
  totalCheckIns: number;
  totalMissions: number;
  totalTokens: number;
  currentLevel: number;
  experienceToNextLevel: number;
  favoriteVenues: string[];
  recentActivity: Activity[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Geolocation Types
export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: string;
}

export interface Geofence {
  id: string;
  name: string;
  center: Location;
  radius: number;
  venues: string[];
} 