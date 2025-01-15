import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/auth';
import { authApi } from '../api/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  register: (username: string, login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (login, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ 
        username: login,
        password 
      });
      console.log('Login success, saving token:', response.access_token);
      await AsyncStorage.setItem('accessToken', response.access_token);
      set({ isLoading: false, user: { username: login } as User });
    } catch (error) {
      console.error('Login error:', error);
      set({ error: 'Ошибка входа', isLoading: false });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Starting registration process...');
      const user = await authApi.register({ 
        username,
        email,
        password 
      });
      console.log('Registration successful, proceeding to auto-login...');
      
      const response = await authApi.login({ 
        username,
        password 
      });
      console.log('Auto-login successful, saving token...');
      
      await AsyncStorage.setItem('accessToken', response.access_token);
      console.log('Token saved, updating user state...');
      
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Registration/Auto-login error:', error);
      set({ error: 'Ошибка регистрации', isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
      await AsyncStorage.removeItem('accessToken');
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
      await AsyncStorage.removeItem('accessToken');
      set({ user: null, error: null, isLoading: false });
    }
  },
})); 