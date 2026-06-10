/**
 * Axios HTTP Client
 * Single configured axios instance used by all API service modules.
 */
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import appConfig from '@/config/app.config';
import { getCookie, removeCookie } from '@/lib/utils/cookies';

const client: AxiosInstance = axios.create({
  baseURL: appConfig.api.baseUrl,
  withCredentials: true, // forwards the backend's HttpOnly 'jwt' cookie automatically
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Read the JWT from the client-readable cookie and attach as Bearer token.
// This is required for cross-origin requests (dev: :3000 → :5000) where the
// browser does not auto-send SameSite=Strict cookies.
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getCookie(appConfig.auth.tokenCookieName);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
client.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    const isUnauthorized = error.response?.status === 401;
    const isBrowser     = typeof window !== 'undefined';
    const isAdminRoute  = isBrowser && window.location.pathname.startsWith('/admin');
    const isLoginPage   = isBrowser && window.location.pathname.includes('/login');

    if (isUnauthorized && isBrowser && isAdminRoute && !isLoginPage) {
      // Clear auth cookie + stored user data, then redirect
      removeCookie(appConfig.auth.tokenCookieName);
      localStorage.removeItem(appConfig.auth.userKey);
      window.location.href = `${appConfig.auth.loginPath}?expired=true`;
    }

    return Promise.reject(error);
  }
);

export default client;
