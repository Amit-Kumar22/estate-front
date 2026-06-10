'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { Admin } from '@/types';
import appConfig from '@/config/app.config';
import { getCookie, setCookie, removeCookie } from '@/lib/utils/cookies';

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
      try {
        // Token lives in a Secure; SameSite=Strict cookie
        const token  = getCookie(appConfig.auth.tokenCookieName);
        // Non-sensitive display data (name, email, role) in localStorage
        const stored = localStorage.getItem(appConfig.auth.userKey);

        if (token && stored) {
          setAdmin(JSON.parse(stored) as Admin);
          // Validate token with the server on every cold start
          const res = await authApi.getMe();
          setAdmin(res.data.data.admin);
          // Refresh the stored display data in case it changed
          localStorage.setItem(appConfig.auth.userKey, JSON.stringify(res.data.data.admin));
        }
      } catch {
        // Token invalid or expired — clear everything
        removeCookie(appConfig.auth.tokenCookieName);
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
    const { token, data } = res.data;

    // Store JWT in a cookie: Secure (prod), SameSite=Strict, 30-day expiry
    setCookie(appConfig.auth.tokenCookieName, token, {
      maxAge:   appConfig.auth.cookieMaxAge,
      sameSite: 'Strict',
    });

    // Store non-sensitive display data in localStorage
    localStorage.setItem(appConfig.auth.userKey, JSON.stringify(data.admin));
    setAdmin(data.admin);
  };

  const logout = async () => {
    try {
      await authApi.logout(); // clears the backend's HttpOnly cookie
    } finally {
      removeCookie(appConfig.auth.tokenCookieName);
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

