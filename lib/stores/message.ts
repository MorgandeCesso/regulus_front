import { create } from 'zustand';
import { messageApi } from '../api/message';
import type { Message, ChatFiles } from '../types/message';

interface MessageState {
  messages: Message[];
  files: string[];
  total: number;
  offset: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  loadMessages: (chatId: number, offset?: number) => Promise<void>;
  sendMessage: (chatId: number, content: string) => Promise<void>;
  loadFiles: (chatId: number) => Promise<void>;
  uploadFile: (chatId: number, file: FormData) => Promise<void>;
  clearState: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  files: [],
  total: 0,
  offset: 0,
  limit: 20,
  isLoading: false,
  error: null,
  isTyping: false,

  loadMessages: async (chatId: number, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await messageApi.getMessages(chatId, offset, get().limit);
      set({
        messages: offset === 0 
          ? response.items 
          : [...response.items, ...get().messages],
        total: response.total,
        offset: offset + get().limit,
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Ошибка загрузки сообщений', isLoading: false });
    }
  },

  sendMessage: async (chatId: number, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const message = await messageApi.sendMessage(chatId, content);
      set(state => ({
        messages: [...state.messages, message],
        isTyping: true,
        isLoading: false
      }));
      const response = await messageApi.getMessages(chatId, 0, 1);
      if (response.items.length > 0) {
        set(state => ({
          messages: [...state.messages, response.items[0]],
          isTyping: false
        }));
      }
    } catch (error) {
      set({ error: 'Ошибка отправки сообщения', isLoading: false, isTyping: false });
    }
  },

  loadFiles: async (chatId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await messageApi.getChatFiles(chatId);
      set({
        files: response.filenames,
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Ошибка загрузки файлов', isLoading: false });
    }
  },

  uploadFile: async (chatId: number, file: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await messageApi.uploadFile(chatId, file);
      await get().loadFiles(chatId);
    } catch (error) {
      set({ error: 'Ошибка загрузки файла', isLoading: false });
    }
  },

  clearState: () => {
    set({
      messages: [],
      files: [],
      total: 0,
      offset: 0,
      isLoading: false,
      error: null
    });
  },
})); 