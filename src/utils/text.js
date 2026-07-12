/**
 * @fileoverview
 * Text utility helpers.
 */

export function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countLines(text) {
  return text.split('\n').length;
}

export function wordWrap(text, maxWidth = 80) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxWidth) {
      lines.push(current.trim());
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.join('\n');
}
