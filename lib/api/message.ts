import { api } from './axios';
import type { Message, PaginatedMessages, ChatFiles, UploadFileResponse } from '../types/message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const messageApi = {
  getMessages: async (chatId: number, offset: number = 0, limit: number = 20): Promise<PaginatedMessages> => {
    console.log('Fetching messages:', { chatId, offset, limit });
    try {
      const response = await api.get<PaginatedMessages>(`/chat/${chatId}/messages`, {
        params: { offset, limit }
      });
      console.log('Messages response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Messages fetch error:', error.response?.data);
      throw error;
    }
  },

  sendMessage: async (chatId: number, content: string): Promise<Message> => {
    console.log('Sending message:', { chatId, content });
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Current token:', token);
      
      const response = await api.post<Message>(`/chat/send_message`, {
        chat_id: chatId,
        content
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Message sent:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Message send error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers,
        method: error.config?.method
      });
      throw error;
    }
  },

  getChatFiles: async (chatId: number): Promise<ChatFiles> => {
    console.log('Fetching chat files:', chatId);
    try {
      const response = await api.get<ChatFiles>(`/chat/${chatId}/files`);
      console.log('Files response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Files fetch error:', error.response?.data);
      throw error;
    }
  },

  uploadFile: async (chatId: number, file: FormData): Promise<UploadFileResponse> => {
    console.log('Uploading file:', { chatId });
    try {
      const response = await api.post<UploadFileResponse>(`/chat/${chatId}/upload_file`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
        maxContentLength: 50 * 1024 * 1024,
      });
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Ошибка загрузки файла');
    }
  }
}; 