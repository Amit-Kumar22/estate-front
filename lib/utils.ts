/**
 * lib/utils.ts — Backward-compatibility barrel
 *
 * Re-exports from the modular utils and constants directories.
 * New code should import directly from the specific module:
 *   import { getImageUrl }    from '@/lib/utils/image';
 *   import { formatDate }     from '@/lib/utils/format';
 *   import { getStatusColor } from '@/lib/constants/project-status';
 *   import { getCookie }      from '@/lib/utils/cookies';
 */

export {
  formatDate,
  formatRelativeDate,
  formatShortDate,
  truncate,
  slugify,
  capitalize,
  formatLeadSource,
  debounce,
} from './utils/format';

export { getImageUrl, PLACEHOLDER_IMAGE } from './utils/image';
export { cn }                             from './utils/style';
export { getCookie, setCookie, removeCookie } from './utils/cookies';
export { getErrorMessage } from './utils/errors';

// WhatsApp helper (legacy name kept for compatibility)
export { buildWhatsAppUrl, buildWhatsAppUrl as getWhatsAppUrl } from './utils/style';

// Status helpers (now in constants)
export { getStatusColor, getStatusLabel, getStatusDotColor } from './constants/project-status';

// Keep formatPrice as a passthrough (price is already a formatted string from the API)
export const formatPrice = (price: string): string => price;
