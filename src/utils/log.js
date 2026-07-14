// @ts-check

/**
 * @fileoverview
 * Logging utility with levels and styling.
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
let currentLevel = 'debug';

export function setLevel(level) {
  if (LOG_LEVELS[level] !== undefined) currentLevel = level;
}

function shouldLog(level) {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

export const Log = {
  debug(...args) { if (shouldLog('debug')) console.debug('[DEBUG]', ...args); },
  info(...args) { if (shouldLog('info')) console.info('[INFO]', ...args); },
  warn(...args) { if (shouldLog('warn')) console.warn('[WARN]', ...args); },
  error(...args) { if (shouldLog('error')) console.error('[ERROR]', ...args); },
  group(label) { console.group(label); },
  groupEnd() { console.groupEnd(); },
};

