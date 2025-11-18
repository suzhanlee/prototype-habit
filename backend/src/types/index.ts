export interface JWTPayload {
  userId: number;
  email: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    username: string;
  };
  token: string;
  refreshToken?: string;
}

export interface ErrorResponse {
  error: {
    message: string;
    status: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    status: number;
  };
  success: boolean;
}
