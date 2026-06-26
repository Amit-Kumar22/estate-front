'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { Admin } from '@/types';
import appConfig from '@/config/app.config';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Use cached display data for an instant render while we validate
      const stored = localStorage.getItem(appConfig.auth.userKey);
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        setAdmin(JSON.parse(stored) as Admin);
        // Browser sends the HttpOnly 'token' cookie automatically (withCredentials: true)
        const res = await authApi.getMe();
        setAdmin(res.data.data.admin);
        localStorage.setItem(appConfig.auth.userKey, JSON.stringify(res.data.data.admin));
      } catch {
        // Session expired or invalid — clear local state
        localStorage.removeItem(appConfig.auth.userKey);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { data } = res.data;

    // JWT is stored in the HttpOnly cookie set by the backend — never touch it here.
    // Only cache non-sensitive display data (name, email, role) in localStorage.
    localStorage.setItem(appConfig.auth.userKey, JSON.stringify(data.admin));
    setAdmin(data.admin);
  };

  const logout = async () => {
    try {
      await authApi.logout(); // backend clears the HttpOnly 'token' cookie
    } finally {
      localStorage.removeItem(appConfig.auth.userKey);
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ admin, isLoading, isAuthenticated: !!admin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

