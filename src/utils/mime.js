// @ts-check

/**
 * @fileoverview
 * MIME type lookup utility.
 */

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.zip': 'application/zip',
  '.pdf': 'application/pdf',
};

export function getMimeType(filename) {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

