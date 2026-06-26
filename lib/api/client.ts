import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import appConfig from '@/config/app.config';

const client: AxiosInstance = axios.create({
  baseURL: appConfig.api.baseUrl,
  withCredentials: true, // browser automatically sends the HttpOnly 'token' cookie
  timeout: appConfig.api.timeout,
  headers: {
    Accept: 'application/json',
  },
});

// ─── Response Interceptor ───────────────────────────────────────────────────
// On 401 inside an admin route, clear local state and redirect to login.
client.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    const isUnauthorized = error.response?.status === 401;
    const isBrowser      = typeof window !== 'undefined';
    const isAdminRoute   = isBrowser && window.location.pathname.startsWith('/admin');
    const isLoginPage    = isBrowser && window.location.pathname.includes('/login');

    if (isUnauthorized && isBrowser && isAdminRoute && !isLoginPage) {
      localStorage.removeItem(appConfig.auth.userKey);
      window.location.href = `${appConfig.auth.loginPath}?expired=true`;
    }

    return Promise.reject(error);
  }
);

export default client;
