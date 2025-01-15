import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log('Request interceptor token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок и обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, tokenType } = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `${tokenType} ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Редирект на логин если refresh token истек
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        // TODO: Добавить навигацию на экран логина
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
); 