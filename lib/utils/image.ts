/**
 * Image Utilities
 * Centralised image URL resolution.
 * All components import getImageUrl from here — never construct URLs inline.
 */
import appConfig from '@/config/app.config';

export const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

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
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `${appConfig.api.storageBase}${url}`;
  return url;
};
