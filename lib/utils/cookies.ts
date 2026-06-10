/**
 * Cookie Utility
 *
 * Thin, dependency-free cookie helpers used for auth token storage.
 * Prefer cookies over localStorage for tokens:
 *   - Automatic expiry without manual cleanup
 *   - Can be scoped to a path
 *   - Secure flag prevents HTTP transmission
 *   - SameSite=Strict prevents CSRF
 */

export interface CookieOptions {
  /** Max age in seconds. Default: 30 days */
  maxAge?: number;
  path?: string;
  /** Omit Secure in development; always set in production */
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Read a cookie value by name.
 * Returns null on SSR or when the cookie does not exist.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Set a cookie with sensible security defaults.
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === 'undefined') return;

  const {
    maxAge = 30 * 24 * 60 * 60,
    path = '/',
    secure = IS_PROD,
    sameSite = 'Strict',
  } = options;

  let cookie = `${name}=${encodeURIComponent(value)}`;
  cookie += `; Max-Age=${maxAge}`;
  cookie += `; Path=${path}`;
  cookie += `; SameSite=${sameSite}`;
  if (secure) cookie += '; Secure';

  document.cookie = cookie;
}

/**
 * Delete a cookie by setting Max-Age=0.
 */
export function removeCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Strict`;
}
