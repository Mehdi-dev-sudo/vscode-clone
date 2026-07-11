/**
 * @fileoverview
 * File naming utilities — generates sequential untitled names
 * and provides consistent file extension handling.
 */

/**
 * Counter for untitled files.
 * @type {number}
 */
let untitledCounter = 0;

/**
 * Counter for untitled folders.
 * @type {number}
 */
let untitledFolderCounter = 0;

/**
 * Reset untitled counters.
 */
export function resetCounters() {
  untitledCounter = 0;
  untitledFolderCounter = 0;
}

/**
 * Generate the next untitled file name.
 * @returns {string}
 */
export function getNextUntitledFileName() {
  untitledCounter++;
  if (untitledCounter === 1) return 'untitled.js';
  return `untitled-${untitledCounter}.js`;
}

/**
 * Generate the next untitled folder name.
 * @returns {string}
 */
export function getNextUntitledFolderName() {
  untitledFolderCounter++;
  if (untitledFolderCounter === 1) return 'New Folder';
  return `New Folder ${untitledFolderCounter}`;
}

/**
 * Get the file extension from a name.
 * @param {string} name
 * @returns {string}
 */
export function getExtension(name) {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? name.slice(idx) : '';
}

/**
 * Get the language identifier from a file name.
 * @param {string} name
 * @returns {string}
 */
export function getLanguageFromFileName(name) {
  const ext = getExtension(name).slice(1).toLowerCase();
  const langMap = {
    js: 'javascript', jsx: 'javascriptreact', ts: 'typescript',
    tsx: 'typescriptreact', css: 'css', html: 'html', json: 'json',
    md: 'markdown', py: 'python', rb: 'ruby', java: 'java',
    c: 'c', cpp: 'cpp', cs: 'csharp', go: 'go', rs: 'rust',
    php: 'php', sql: 'sql', sh: 'shell', bash: 'shell',
    yml: 'yaml', yaml: 'yaml', xml: 'xml', svg: 'xml',
  };
  return langMap[ext] || 'plaintext';
}

/**
 * Sanitize a file name (remove invalid characters).
 * @param {string} name
 * @returns {string}
 */
export function sanitizeFileName(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_');
}
