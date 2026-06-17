/**
 * Image Utilities
 * Centralised image URL resolution.
 * All components import getImageUrl from here — never construct URLs inline.
 */
import appConfig from '@/config/app.config';

export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI0VDRUNFQyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIxODAiIHJ4PSIzMCIvPjxwYXRoIGQ9Ik0xNTAgNzFjMTQuOSA1LjQgMzQuNCAyMC44IDQ1LjEgNTMuOEEyMiAyMiAwIDAgMSAxNzIgMTE2SDIyMmEyNCAyNCAwIDAgMSAwIDQ4SDE4MnY0M0ExNSAxNSAwIDAgMSAxNjcgMjEzSDEzNGEyMiAyMiAwIDAgMS0xNi0zMS40bDM1LjItNjUuM2M4LjYtMTYuMSAxMy43LTI5LjkgMjItMzguMXoiLz48Y2lyY2xlIGN4PSIxMTAiIGN5PSI4MCIgcj0iMjAiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjgwIiByPSIyMCIgZmlsbD0iI0ZGRiIgY29sb3I9IiNEL0Q0RDQiIG9wYWNpdHk9IjAuNSIvPjwvZz48L3N2Zz4=';

/**
 * Resolves a stored image path to an absolute URL.
 *
 * Rules:
 *  - Already absolute (http/https) → return as-is
 *  - Starts with /uploads           → prepend API storageBase
 *  - Empty / null / undefined       → return placeholder
 */
export const getImageUrl = (url?: string | null): string => {
  if (!url) return PLACEHOLDER_IMAGE;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return PLACEHOLDER_IMAGE;
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) return trimmedUrl;

  const normalizedUrl = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
  if (normalizedUrl.startsWith('/uploads')) {
    return `${appConfig.api.storageBase}${normalizedUrl}`;
  }

  return normalizedUrl;
};
