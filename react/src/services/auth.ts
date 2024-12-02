import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

const API_URL = 'http://localhost:3000';

// set axios default config
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const authService = {
  initializeAuth() {
    const userId = parseInt(localStorage.getItem('userId') || '0');
    if (userId) {
      // we can set other initialized logic here
      console.log('Auth initialized with user:', userId);
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/login`, credentials, {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:8000'
        }
      });
      
      if (response.data.user && response.data.user.id) {
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.username);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/signup`, credentials, {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:8000'
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },

  getCurrentUser() {
    const userId = parseInt(localStorage.getItem('userId') || '0');
    const username = localStorage.getItem('username');
    return userId ? { id: userId, username } : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('userId');
  }
}; 