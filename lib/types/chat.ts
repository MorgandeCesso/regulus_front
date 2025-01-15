export interface Chat {
  id: number;
  title: string;
  updated_at: string;  // date-time формат
}

export interface PaginatedChats {
  items: Chat[];
  total: number;
  limit: number;    // вместо size
  offset: number;   // вместо page
}

export interface ChatResponse {
  chat_id: number;
  response: string;
}

export interface StatusResponse {
  status: string;
}

export interface CreateChatDTO {
  title: string;
} 