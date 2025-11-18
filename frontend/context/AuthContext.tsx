'use client';

import React, { createContext, useState, useEffect } from 'react';
import { authApi, AuthResponse } from '@/lib/auth';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          // Token is invalid, clear auth
          authApi.clearAuth();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      authApi.setToken(response.token, response.refreshToken);
      setUser(response.user);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await authApi.register({ email, username, password });
      authApi.setToken(response.token, response.refreshToken);
      setUser(response.user);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    authApi.clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
