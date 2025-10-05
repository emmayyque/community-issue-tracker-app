import { API_ENDPOINTS } from '@utils/constants';
interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }

  class ApiService {
    private baseURL = API_ENDPOINTS.BASE_URL;
  
    private async request<T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
      const url = `${this.baseURL}${endpoint}`;
      
      const defaultOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
  
      try {
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
        
        return data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    async login(email: string, password: string) {
      return this.request(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    }
  
    async register(userData: any) {
      return this.request(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    }
  
    async getProfile() {
      return this.request(API_ENDPOINTS.PROFILE, {
        method: 'GET',
      });
    }
  
    async updateProfile(userData: any) {
      return this.request(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    }
  }
  
  export const apiService = new ApiService();