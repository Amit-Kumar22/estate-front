/**
 * Extracts the backend's error message from an Axios error so toasts show the
 * real reason (validation error, duplicate data, unauthorized, etc.) instead
 * of a generic "Failed" string. Falls back to a caller-supplied message, then
 * a generic one, if the backend didn't send a message (e.g. network failure).
 */
export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }

  if (error instanceof Error && error.message && !('response' in error)) {
    return error.message;
  }

  return fallback;
};
