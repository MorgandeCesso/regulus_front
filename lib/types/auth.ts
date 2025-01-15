export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  email_verified: boolean;
}

export interface StatusResponse {
  status: string;
  message: string;
} 