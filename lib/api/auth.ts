import { api } from './axios';
import type { 
  LoginDTO, 
  RegisterDTO, 
  AuthResponse, 
  User,
  StatusResponse 
} from '../types/auth';

export const authApi = {
  login: async (data: LoginDTO): Promise<AuthResponse> => {
    console.log('Sending login request:', data);
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', data.username);
      formData.append('password', data.password);

      const response = await api.post<AuthResponse>('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
      throw error;
    }
  },

  register: async (data: RegisterDTO): Promise<User> => {
    console.log('Sending register request:', data);
    try {
      const response = await api.post<User>('/auth/register', data);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
      throw error;
    }
  },

  logout: async (): Promise<StatusResponse> => {
    try {
      const response = await api.post<StatusResponse>('/auth/logout', {});
      console.log('Logout response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Logout error:', error.response?.data);
      throw error;
    }
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response.data;
  }
}; 