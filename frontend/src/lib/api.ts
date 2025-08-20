import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  User, 
  Venue, 
  Mission, 
  LoginForm, 
  RegisterForm,
  CheckInForm,
  VenueFilters,
  MissionFilters,
  SearchResult
} from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      return new Error(message);
    }
    if (error.request) {
      return new Error('Network error - no response received');
    }
    return new Error(error.message || 'An unexpected error occurred');
  }

  // Authentication endpoints
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    const response = await this.request<{ message: string; user: User; token: string; expiresAt: string }>({
      method: 'POST',
      url: '/api/auth/login',
      data: credentials,
    });
    
    this.setAuthToken(response.token);
    return { user: response.user, token: response.token };
  }

  async register(userData: RegisterForm): Promise<{ user: User; token: string }> {
    const response = await this.request<{ message: string; user: User; token: string; expiresAt: string }>({
      method: 'POST',
      url: '/api/auth/register',
      data: userData,
    });
    
    this.setAuthToken(response.token);
    return { user: response.user, token: response.token };
  }

  async logout(): Promise<void> {
    try {
      await this.request({
        method: 'POST',
        url: '/api/auth/logout',
      });
    } finally {
      this.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<{ user: User }>({
      method: 'GET',
      url: '/api/users/profile',
    });
    return response.user;
  }

  // User endpoints
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.request<{ user: User }>({
      method: 'PUT',
      url: '/api/users/profile',
      data: userData,
    });
    return response.user;
  }

  async getUserStats(): Promise<any> {
    const response = await this.request<{ stats: any }>({
      method: 'GET',
      url: '/api/users/stats',
    });
    return response.stats;
  }

  // Venue endpoints
  async getVenues(filters?: VenueFilters): Promise<Venue[]> {
    const response = await this.request<{ venues: Venue[]; total: number }>({
      method: 'GET',
      url: '/api/venues',
      params: filters,
    });
    return response.venues;
  }

  async getVenue(id: string): Promise<Venue> {
    const response = await this.request<{ venue: Venue }>({
      method: 'GET',
      url: `/api/venues/${id}`,
    });
    return response.venue;
  }

  async searchVenues(query: string, filters?: VenueFilters): Promise<Venue[]> {
    const response = await this.request<{ venues: Venue[] }>({
      method: 'GET',
      url: '/api/venues',
      params: { search: query, ...filters },
    });
    return response.venues;
  }

  async getNearbyVenues(lat: number, lng: number, radius: number = 5): Promise<Venue[]> {
    const response = await this.request<{ venues: Venue[] }>({
      method: 'GET',
      url: '/api/venues',
      params: { lat, lng, radius },
    });
    return response.venues;
  }

  // Check-in endpoints
  async checkIn(checkInData: CheckInForm): Promise<any> {
    const response = await this.request<{ message: string; checkIn: any; tokensEarned: number }>({
      method: 'POST',
      url: '/api/checkins',
      data: checkInData,
    });
    return response;
  }

  async getCheckIns(venueId?: string): Promise<any[]> {
    const response = await this.request<{ checkIns: any[] }>({
      method: 'GET',
      url: '/api/checkins',
      params: venueId ? { venueId } : undefined,
    });
    return response.checkIns;
  }

  // Mission endpoints
  async getMissions(filters?: MissionFilters): Promise<any> {
    const response = await this.request<{ missions: any; stats: any }>({
      method: 'GET',
      url: '/api/missions',
      params: filters,
    });
    return response.missions;
  }

  async getMission(id: string): Promise<Mission> {
    const response = await this.request<{ mission: Mission }>({
      method: 'GET',
      url: `/api/missions/${id}`,
    });
    return response.mission;
  }

  async startMission(id: string): Promise<Mission> {
    const response = await this.request<{ mission: Mission }>({
      method: 'POST',
      url: `/api/missions/${id}/start`,
    });
    return response.mission;
  }

  async claimMissionReward(id: string): Promise<any> {
    const response = await this.request<{ message: string; reward: number }>({
      method: 'POST',
      url: `/api/missions/${id}/claim`,
    });
    return response;
  }

  // Expense endpoints
  async logExpense(expenseData: { amount: number; category: string; description?: string; venueId?: string }): Promise<any> {
    const response = await this.request<{ message: string; expense: any }>({
      method: 'POST',
      url: '/api/expenses',
      data: expenseData,
    });
    return response;
  }

  async getExpenses(filters?: any): Promise<any[]> {
    const response = await this.request<{ expenses: any[]; total: number }>({
      method: 'GET',
      url: '/api/expenses',
      params: filters,
    });
    return response.expenses;
  }

  // Chat endpoints
  async sendMessage(message: string): Promise<any> {
    const response = await this.request<{ message: string; response: any }>({
      method: 'POST',
      url: '/api/chat/message',
      data: { message },
    });
    return response;
  }

  async getChatHistory(): Promise<any[]> {
    const response = await this.request<{ messages: any[] }>({
      method: 'GET',
      url: '/api/chat/history',
    });
    return response.messages;
  }

  // Agent endpoints
  async getAgents(): Promise<any[]> {
    const response = await this.request<{ agents: any[] }>({
      method: 'GET',
      url: '/api/agents',
    });
    return response.agents;
  }

  async getAgent(name: string): Promise<any> {
    const response = await this.request<{ agent: any }>({
      method: 'GET',
      url: `/api/agents/${name}`,
    });
    return response.agent;
  }

  // Activity endpoints
  async getActivities(limit: number = 20, offset: number = 0): Promise<any[]> {
    const response = await this.request<{ activities: any[] }>({
      method: 'GET',
      url: '/api/users/activity',
      params: { limit, offset },
    });
    return response.activities;
  }

  // Search endpoints
  async search(query: string): Promise<SearchResult> {
    const response = await this.request<{ results: SearchResult }>({
      method: 'GET',
      url: '/api/search',
      params: { q: query },
    });
    return response.results;
  }

  // Notification endpoints
  async getNotifications(): Promise<any[]> {
    const response = await this.request<{ notifications: any[] }>({
      method: 'GET',
      url: '/api/notifications',
    });
    return response.notifications;
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.request({
      method: 'PUT',
      url: `/api/notifications/${id}/read`,
    });
  }

  // File upload
  async uploadFile(file: File, type: 'avatar' | 'venue' | 'review'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.request<{ url: string }>({
      method: 'POST',
      url: '/api/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.request<{ status: string; timestamp: string }>({
      method: 'GET',
      url: '/health',
    });
    return response;
  }

  // WebSocket connection URL
  getWebSocketUrl(): string {
    const wsUrl = this.baseURL.replace('http', 'ws');
    return `${wsUrl}`;
  }
}

// Create singleton instance
export const api = new ApiClient();

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  getUserStats,
  getVenues,
  getVenue,
  searchVenues,
  getNearbyVenues,
  checkIn,
  getCheckIns,
  getMissions,
  getMission,
  startMission,
  claimMissionReward,
  logExpense,
  getExpenses,
  sendMessage,
  getChatHistory,
  getAgents,
  getAgent,
  getActivities,
  search,
  getNotifications,
  markNotificationRead,
  uploadFile,
  healthCheck,
  getWebSocketUrl,
} = api; 