import { create } from 'zustand';
import { chatApi } from '../api/chat';
import type { Chat, CreateChatDTO } from '../types/chat';

interface ChatState {
  chats: Chat[];
  total: number;
  offset: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  loadChats: (offset?: number) => Promise<void>;
  createChat: (title: string) => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  total: 0,
  offset: 0,
  limit: 20,
  isLoading: false,
  error: null,

  loadChats: async (offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatApi.getChats(offset, get().limit);
      set({
        chats: offset === 0 
          ? response.items  // Первая загрузка
          : [...get().chats, ...response.items],  // Добавляем к существующим
        total: response.total,
        offset: offset + get().limit,
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Ошибка загрузки чатов', isLoading: false });
    }
  },

  createChat: async (title: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatApi.createChat({ title });
      await get().loadChats(0);
    } catch (error) {
      set({ error: 'Ошибка создания чата', isLoading: false });
    }
  },

  deleteChat: async (chatId: number) => {
    set({ isLoading: true, error: null });
    try {
      await chatApi.deleteChat(chatId);
      set(state => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Ошибка удаления чата', isLoading: false });
    }
  },
})); 