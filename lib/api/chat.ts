import { api } from './axios';
import type { 
  Chat, 
  PaginatedChats, 
  ChatResponse, 
  StatusResponse,
  CreateChatDTO 
} from '../types/chat';

export const chatApi = {
  getChats: async (offset: number = 0, limit: number = 20): Promise<PaginatedChats> => {
    console.log('Fetching chats:', { offset, limit });
    try {
      const response = await api.get<PaginatedChats>('/chat/list', {
        params: { offset, limit }
      });
      console.log('Chats response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Chats fetch error:', error.response?.data);
      throw error;
    }
  },

  createChat: async (data: CreateChatDTO): Promise<ChatResponse> => {
    console.log('Creating chat:', data);
    try {
      const response = await api.post<ChatResponse>('/chat/create_chat', data);
      console.log('Chat created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Chat creation error:', error.response?.data);
      throw error;
    }
  },

  deleteChat: async (chatId: number): Promise<StatusResponse> => {
    console.log('Deleting chat:', chatId);
    try {
      const response = await api.delete<StatusResponse>(`/chat/${chatId}`);
      console.log('Chat deleted:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Chat deletion error:', error.response?.data);
      throw error;
    }
  }
}; 