// @ts-check

/**
 * @fileoverview
 * HTML utility helpers.
 */

export function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function createDocumentFragment(strings, ...values) {
  const html = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
}

