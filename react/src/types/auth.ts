export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    username: string;
  };
} 