// Frontend Environment Configuration
export interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  nodeEnv: string;
  enableAnalytics: boolean;
  enableDebugMode: boolean;
  googleMapsApiKey?: string;
  stripePublishableKey?: string;
  appName: string;
  appVersion: string;
  appDescription: string;
}

// Development configuration
const developmentConfig: EnvironmentConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE !== 'false',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  appName: import.meta.env.VITE_APP_NAME || 'Club Run',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0-pre',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'AI-Powered Nightlife Operations Platform'
};

// Production configuration
const productionConfig: EnvironmentConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://your-production-api.com',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'production',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebugMode: false,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  appName: import.meta.env.VITE_APP_NAME || 'Club Run',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0-pre',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'AI-Powered Nightlife Operations Platform'
};

// Export the appropriate configuration based on environment
export const config: EnvironmentConfig = 
  import.meta.env.MODE === 'production' ? productionConfig : developmentConfig;

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  
  // User endpoints
  USER_PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
  
  // Venue endpoints
  VENUES: '/api/venues',
  VENUE_DETAILS: (id: string) => `/api/venues/${id}`,
  VENUE_RESEARCH: '/api/venues/research',
  
  // Mission endpoints
  MISSIONS: '/api/missions',
  MISSION_DETAILS: (id: string) => `/api/missions/${id}`,
  CREATE_MISSION: '/api/missions',
  UPDATE_MISSION: (id: string) => `/api/missions/${id}`,
  
  // Runner endpoints
  RUNNERS: '/api/runners',
  RUNNER_DETAILS: (id: string) => `/api/runners/${id}`,
  RUNNER_AVAILABILITY: '/api/runners/availability',
  
  // Report endpoints
  REPORTS: '/api/reports',
  GENERATE_REPORT: '/api/reports/generate',
  EXPORT_REPORT: (id: string) => `/api/reports/${id}/export`,
  
  // Demo endpoints
  DEMO_HEALTH: '/demo/health',
  DEMO_RESEARCH: '/demo/research',
  DEMO_ASSIGN: '/demo/assign',
  DEMO_REPORT: '/demo/report',
  DEMO_WEEKLY: '/demo/weekly-report'
};

// Utility function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};

// Utility function to check if we're in development mode
export const isDevelopment = (): boolean => {
  return config.nodeEnv === 'development';
};

// Utility function to check if we're in production mode
export const isProduction = (): boolean => {
  return config.nodeEnv === 'production';
};

// Utility function for debug logging
export const debugLog = (message: string, data?: any): void => {
  if (config.enableDebugMode) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

export default config; 