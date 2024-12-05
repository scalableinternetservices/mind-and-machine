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

export interface AuthError {
  username?: string[];
  password?: string[];
  general?: string;
}

export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
export const USERNAME_RULES = "Username can only contain letters, numbers, underscores and hyphens"; 