// @ts-check

/**
 * @fileoverview
 * File type icon mapping — returns the correct icon for a file
 * based on its extension. Supports common file types in VS Code.
 */

import { ICONS } from '../assets/icons/codicons.js';

/**
 * Map of file extensions to icon definitions.
 * @type {Object<string, {icon: string, color?: string}>}
 */
const FILE_ICONS = {
  js: { icon: ICONS.file, color: '#f7df1e' },
  jsx: { icon: ICONS.file, color: '#61dafb' },
  ts: { icon: ICONS.file, color: '#3178c6' },
  tsx: { icon: ICONS.file, color: '#3178c6' },
  css: { icon: ICONS.file, color: '#2965f1' },
  scss: { icon: ICONS.file, color: '#c6538c' },
  html: { icon: ICONS.file, color: '#e34f26' },
  json: { icon: ICONS.file, color: '#292929' },
  md: { icon: ICONS.file, color: '#083fa1' },
  py: { icon: ICONS.file, color: '#3572a5' },
  java: { icon: ICONS.file, color: '#b07219' },
  rb: { icon: ICONS.file, color: '#701516' },
  go: { icon: ICONS.file, color: '#00add8' },
  rs: { icon: ICONS.file, color: '#dea584' },
  php: { icon: ICONS.file, color: '#4f5d95' },
  sql: { icon: ICONS.file, color: '#e38c00' },
  sh: { icon: ICONS.file, color: '#89e051' },
  yml: { icon: ICONS.file, color: '#cb171e' },
  yaml: { icon: ICONS.file, color: '#cb171e' },
  xml: { icon: ICONS.file, color: '#0060ac' },
  svg: { icon: ICONS.file, color: '#ffb13b' },
  gitignore: { icon: ICONS.file, color: '#f05032' },
  lock: { icon: ICONS.file, color: '#7a7a7a' },
};

/**
 * Get the icon and color for a file based on its name.
 * @param {string} fileName
 * @returns {{icon: string, color?: string}}
 */
export function getFileIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const mapped = FILE_ICONS[ext];
  return mapped || { icon: ICONS.file, color: '#cccccc' };
}

/**
 * Get the icon for a folder.
 * @param {boolean} open - Whether the folder is expanded.
 * @returns {string}
 */
export function getFolderIcon(open) {
  return open ? ICONS.folderOpen : ICONS.folder;
}

