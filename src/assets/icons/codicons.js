/**
 * @fileoverview
 * VS Code Codicon SVG definitions.
 * All icons are inline SVGs for zero external dependencies.
 * Reference: https://microsoft.github.io/vscode-codicons/
 */

/** @type {Object<string, string>} */
export const ICONS = {
  files: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h5l2 2h5v8H2V3zm1 1v7h11V6H8.5L7 5H3z" fill="currentColor"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 10.5l3.5 3.5-1 1-3.5-3.5a5.5 5.5 0 111-1zM6.5 1a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" fill="currentColor"/></svg>',
  sourceControl: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 1.5C4 .67 4.67 0 5.5 0S7 .67 7 1.5c0 .4-.16.77-.42 1.04l.91.91.54-.54a1.5 1.5 0 112.12 2.12l-.79.79A1.5 1.5 0 117.5 8h-.04l-.87.87c.07.2.12.42.12.63 0 .83-.67 1.5-1.5 1.5S4 10.33 4 9.5c0-.4.16-.77.42-1.04L3.5 7.54l-.54.54A1.5 1.5 0 11.84 5.96l.79-.79A1.5 1.5 0 114.5 2.5h.04l.87-.87A1.5 1.5 0 014 1.5z" fill="currentColor"/></svg>',
  runDebug: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2v12l10-6L4 2z" fill="currentColor"/></svg>',
  extensions: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 2h5v5H1V2zm0 7h5v5H1V9zm9-7h5v5h-5V2zM7 5.5l2 2.5-2 2.5M9 2h5v5H9V2z" fill="currentColor"/></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 8.5l1.5 1v1.5l-1.5.5-1 1.5 2 3-1 1-3-2-1.5 1H8l-1-1.5-3 2-1-1 2-3-1-1.5V10l1.5-1L4 7.5V6l1.5-.5L7 4h1.5l1-1.5 3 2 1-1 1 1-2 3 1 1.5v1l-1.5.5zM8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="currentColor"/></svg>',
  chevronRight: '<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  chevronDown: '<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  close: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5"/></svg>',
  newFile: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9 1H4v14h9V4l-4-3zm0 1.5L11.5 5H9V2.5zM5 12V4h3v2h3v6H5z" fill="currentColor"/></svg>',
  newFolder: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3h5l2 2h5v8H2V3zm1 1v7h11V6H8.5L7 5H3z" fill="currentColor"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 0111.5-3.5l-1.5 1A4.5 4.5 0 003.5 8H2zm12 0a6 6 0 01-11.5 3.5l1.5-1A4.5 4.5 0 0012.5 8H14z" fill="currentColor"/></svg>',
  collapseAll: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M7 3H3v10h4V3zM13 3H9v10h4V3z" fill="currentColor"/></svg>',
  folder: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h5l2 2h5v8H2V3zm1 1v7h11V6H8.5L7 5H3z" fill="currentColor"/></svg>',
  file: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1H4v14h9V4l-4-3zm0 1.5L11.5 5H9V2.5zM5 12V4h3v2h3v6H5z" fill="currentColor"/></svg>',
  folderOpen: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h5l2 2h5v1H6l-4 5V3zm0 8l4-5h9v5l-3 2H5l-3-2z" fill="currentColor"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 2V1h6v1h3v1h-1v11l-1 1H4l-1-1V4H2V3h3V2zM5 4v9h6V4H5z" fill="currentColor"/></svg>',
  rename: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 2l.5.5-9 9L3 13l1.5-2 9-9zM11 4.5l.5.5L6 10.5l-.5-.5L11 4.5z" fill="currentColor"/></svg>',
  terminal: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v10H2V3zm1 1v8h10V4H3zm2 2l3 2-3 2" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  output: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v10H2V3zm1 1v8h10V4H3zm2 2h6v1H5V6zm0 2h6v1H5V8z" fill="currentColor"/></svg>',
  problems: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l7 7-7 7-7-7 7-7z" fill="currentColor"/></svg>',
  debug: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 2v12l10-6L4 2z" fill="currentColor"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 11l-4-4 1.5-1.5L6 8 12.5 1.5 14 3 6 11z" fill="currentColor"/></svg>',
  warning: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l7 14H1L8 1zm0 4v5M8 11v2" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  error: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l7 14H1L8 1zm0 4v5M8 11v2" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a1 1 0 110 2 1 1 0 010-2zm1 10H7V6h2v7z" fill="currentColor"/></svg>',
  lightBulb: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 00-3 9c0 1.5 1 2 1 3h4c0-1 1-1.5 1-3A5 5 0 008 1zM6 13h4v1H6v-1z" fill="currentColor"/></svg>',
  account: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 100 10A5 5 0 008 1zm0 2a3 3 0 110 6 3 3 0 010-6zM2 15c0-3 2.7-5 6-5s6 2 6 5H2z" fill="currentColor"/></svg>',
  globe: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 102.5 8 5.5 5.5 0 008 13.5z" fill="currentColor"/><path d="M1 8h14M8 1v14" stroke="currentColor" stroke-width="1"/></svg>',
  feedback: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1h14v10H5l-4 4V1zm2 2v8.5l2.5-2.5H13V3H3z" fill="currentColor"/></svg>',
  gitBranch: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 1.5C4 .67 4.67 0 5.5 0S7 .67 7 1.5c0 .4-.16.77-.42 1.04l.91.91.54-.54a1.5 1.5 0 112.12 2.12l-.79.79A1.5 1.5 0 117.5 8h-.04l-.87.87c.07.2.12.42.12.63 0 .83-.67 1.5-1.5 1.5S4 10.33 4 9.5c0-.4.16-.77.42-1.04L3.5 7.54l-.54.54A1.5 1.5 0 11.84 5.96l.79-.79A1.5 1.5 0 114.5 2.5h.04l.87-.87A1.5 1.5 0 014 1.5z" fill="currentColor"/></svg>',
  clearAll: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12L8 14 2 4z" fill="currentColor"/></svg>',
  copy: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 2h8v1H4V2zm0 2h8v1H4V4zm-1 3h10v8H3V7zm1 1v6h8V8H4z" fill="currentColor"/></svg>',
  paste: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 2h4v1H6V2zm-2 3h8v1H4V5zm-1 2h10v6H3V7zm1 1v4h8V8H4z" fill="currentColor"/></svg>',
  cut: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 3l6 5-2 3H3l2-3L1 3zm14 0l-6 5 2 3h2l-2-3 4-5zM5.5 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="currentColor"/></svg>',
  link: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M7 2l3 3-1 1-3-3-1 1 3 3-1 1-3-3a2 2 0 012.8-2.8L7 2zM9 14l-3-3 1-1 3 3 1-1-3-3 1-1 3 3a2 2 0 01-2.8 2.8L9 14z" fill="currentColor"/></svg>',
  unfold: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3l4 4H4l4-4zM8 13l-4-4h8l-4 4z" fill="currentColor"/></svg>',
  bracket: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 2H4v12h2v1H3V1h3v1zm4-1h3v14h-3v-1h2V2h-2V1z" fill="currentColor"/></svg>',
};

/**
 * Get an icon's SVG content by name.
 * @param {string} name - Icon name key.
 * @returns {string} SVG markup or empty string.
 */
export function getIcon(name) {
  return ICONS[name] || '';
}
