// @ts-check

/**
 * @fileoverview
 * Retry utility — retry async operations with exponential backoff.
 */

export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 300) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries) throw err;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function retryWithDelay(fn, attempts = 3, delay = 500) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

