import { api } from './axios';
import type { Message, PaginatedMessages, ChatFiles, UploadFileResponse } from '../types/message';

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
      const response = await api.post<Message>(`/chat/${chatId}/messages`, { content });
      console.log('Message sent:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Message send error:', error.response?.data);
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
      });
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Upload error:', error.response?.data);
      throw error;
    }
  }
}; 