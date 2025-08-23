import { buildApiUrl, API_ENDPOINTS, debugLog } from '../config/environment';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface VenueData {
  neighborhood_profile: string;
  safety_info: string;
  parking_info: string;
  local_restrictions: string;
  nearby_amenities: string;
  special_tips: string;
  accessibility: string;
  estimated_travel_time: string;
}

export interface Runner {
  id: string;
  name: string;
  performance_rating: number;
  completed_missions_count: number;
  total_earnings: number;
  location: string;
  availability_status: string;
}

export interface Mission {
  id: string;
  venue_address: string;
  assigned_runner: string;
  status: string;
  created_at: string;
  estimated_completion_time: string;
}

// API Service Class
class ApiService {
  constructor() {
    // Configuration is handled by the environment config
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const token = this.getAuthToken();

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      debugLog(`Making request to: ${url}`, { method: options.method || 'GET' });
      
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      debugLog('API request failed', { error, url });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Auth token management
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    await this.request(API_ENDPOINTS.LOGOUT, { method: 'POST' });
    this.removeAuthToken();
    return { success: true };
  }

  // Venue methods
  async researchVenue(address: string): Promise<ApiResponse<VenueData>> {
    return this.request<VenueData>(API_ENDPOINTS.VENUE_RESEARCH, {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async getVenues(): Promise<ApiResponse<VenueData[]>> {
    return this.request<VenueData[]>(API_ENDPOINTS.VENUES);
  }

  async getVenueDetails(id: string): Promise<ApiResponse<VenueData>> {
    return this.request<VenueData>(API_ENDPOINTS.VENUE_DETAILS(id));
  }

  // Runner methods
  async getRunners(): Promise<ApiResponse<Runner[]>> {
    return this.request<Runner[]>(API_ENDPOINTS.RUNNERS);
  }

  async getRunnerDetails(id: string): Promise<ApiResponse<Runner>> {
    return this.request<Runner>(API_ENDPOINTS.RUNNER_DETAILS(id));
  }

  async getRunnerAvailability(): Promise<ApiResponse<Runner[]>> {
    return this.request<Runner[]>(API_ENDPOINTS.RUNNER_AVAILABILITY);
  }

  // Mission methods
  async getMissions(): Promise<ApiResponse<Mission[]>> {
    return this.request<Mission[]>(API_ENDPOINTS.MISSIONS);
  }

  async getMissionDetails(id: string): Promise<ApiResponse<Mission>> {
    return this.request<Mission>(API_ENDPOINTS.MISSION_DETAILS(id));
  }

  async createMission(missionData: Partial<Mission>): Promise<ApiResponse<Mission>> {
    return this.request<Mission>(API_ENDPOINTS.CREATE_MISSION, {
      method: 'POST',
      body: JSON.stringify(missionData),
    });
  }

  async updateMission(id: string, missionData: Partial<Mission>): Promise<ApiResponse<Mission>> {
    return this.request<Mission>(API_ENDPOINTS.UPDATE_MISSION(id), {
      method: 'PUT',
      body: JSON.stringify(missionData),
    });
  }

  // Demo methods
  async getDemoHealth(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.DEMO_HEALTH);
  }

  async demoResearch(address: string): Promise<ApiResponse<VenueData>> {
    return this.request<VenueData>(API_ENDPOINTS.DEMO_RESEARCH, {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async demoAssign(missionData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.DEMO_ASSIGN, {
      method: 'POST',
      body: JSON.stringify(missionData),
    });
  }

  async demoReport(reportData: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.DEMO_REPORT, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async demoWeeklyReport(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.DEMO_WEEKLY, {
      method: 'POST',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getCurrentUser(): any {
    const token = this.getAuthToken();
    if (!token) return null;
    
    try {
      // Decode JWT token (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 