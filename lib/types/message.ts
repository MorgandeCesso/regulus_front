export interface Message {
  id: number;
  chat_id: number;
  content: string;
  created_at: string;
  is_sent_by_bot: boolean;
}

export interface PaginatedMessages {
  items: Message[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChatFiles {
  filenames: string[];
}

export interface UploadFileResponse {
  file_id: string;
  status: string;
} 