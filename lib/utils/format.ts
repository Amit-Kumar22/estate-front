/**
 * Format Utilities
 * All date, number, and text formatting functions in one place.
 */

/**
 * Format a date string using Indian locale.
 */
export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/**
 * Format a date to a short relative string (2m ago, 3h ago, etc.)
 */
export const formatRelativeDate = (dateString: string): string => {
  const now   = Date.now();
  const diff  = now - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return formatDate(dateString);
};

/**
 * Format a short date (e.g. 09 Jun 2026)
 */
export const formatShortDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

/**
 * Truncate a string to the given length.
 */
export const truncate = (str: string, length: number): string =>
  str.length <= length ? str : `${str.slice(0, length)}…`;

/**
 * Convert a string to a URL-safe slug.
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Capitalize the first letter.
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Format a lead source for display.
 */
export const formatLeadSource = (source: string): string =>
  source.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Generic debounce.
 */
export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  wait: number
): ((...args: T) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};
