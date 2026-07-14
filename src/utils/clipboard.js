// @ts-check

/**
 * @fileoverview
 * Clipboard utility helpers.
 */

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  }
}

export async function readFromClipboard() {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
}

