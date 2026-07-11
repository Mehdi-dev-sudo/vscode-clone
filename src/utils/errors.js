/**
 * @fileoverview
 * Error handling utilities — centralized error reporting and user-friendly
 * error messages for common failure scenarios.
 */

/**
 * Application error codes mapped to user-friendly messages.
 */
const ERROR_MESSAGES = {
  'file:not-found': 'The file could not be found. It may have been moved or deleted.',
  'file:read-error': 'An error occurred while reading the file.',
  'file:write-error': 'Could not save the file. Check permissions.',
  'storage:full': 'Local storage is full. Try clearing some data.',
  'storage:unavailable': 'Storage is unavailable in this environment.',
  'command:not-found': 'The requested command is not available.',
  'network:offline': 'You appear to be offline. Check your connection.',
  'theme:not-found': 'The requested theme could not be loaded.',
  'component:init-error': 'A component failed to initialize.',
  'unknown': 'An unexpected error occurred. Please try again.',
};

/**
 * Get a user-friendly error message.
 * @param {string} code - Error code from ERROR_MESSAGES.
 * @param {string} [fallback] - Fallback message if code not found.
 * @returns {string}
 */
export function getErrorMessage(code, fallback = 'An error occurred.') {
  return ERROR_MESSAGES[code] || fallback;
}

/**
 * Log an error with context and show a notification.
 * @param {string} code
 * @param {Error} [error]
 * @param {Object} [context] - Additional context for debugging.
 */
export function handleError(code, error, context = {}) {
  const message = getErrorMessage(code);
  console.error(`[Error] ${code}: ${message}`, error?.message || '', context);

  // Show notification if the notification module is available
  import('../components/notifications/notifications.js').then(({ Notifications }) => {
    Notifications.error(message, error?.message);
  });
}

/**
 * Safe wrapper for async operations.
 * @param {Function} fn - Async function to execute.
 * @param {string} errorCode - Error code on failure.
 * @returns {Promise<*>}
 */
export async function trySafe(fn, errorCode = 'unknown') {
  try {
    return await fn();
  } catch (error) {
    handleError(errorCode, error);
    return null;
  }
}
