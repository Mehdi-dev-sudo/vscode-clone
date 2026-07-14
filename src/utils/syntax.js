// @ts-check

/**
 * @fileoverview
 * Simple syntax highlighter for common languages.
 * Tokenizes code and returns HTML with color spans.
 * This is a lightweight approach — not a full parser.
 */

/**
 * Language detection by file extension.
 * @param {string} fileName
 * @returns {string}
 */
export function detectLanguage(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const map = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    css: 'css',
    html: 'html',
    htm: 'html',
    json: 'json',
    md: 'markdown',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    svg: 'xml',
  };
  return map[ext] || 'plaintext';
}

/**
 * Simple JavaScript/TypeScript tokenizer.
 * Operates on raw code, collects all token positions first,
 * then builds highlighted HTML by interleaving escaped text and spans.
 * @param {string} code
 * @returns {string} HTML with syntax spans.
 */
export function highlightJavaScript(code) {
  const CLASS_MAP = {
    comment: 'syntax-comment',
    string: 'syntax-string',
    keyword: 'syntax-keyword',
    number: 'syntax-number',
    class: 'syntax-class',
  };

  const patterns = [
    { regex: /\/\/.*$/gm, cls: 'comment' },
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'comment' },
    { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, cls: 'string' },
    { regex: /\b(import|export|from|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|class|extends|super|async|await|yield|try|catch|finally|throw|this|true|false|null|undefined|NaN|Infinity)\b/g, cls: 'keyword' },
    { regex: /\b(\d+\.?\d*|0x[0-9a-fA-F]+)\b/g, cls: 'number' },
    { regex: /\b([A-Z][a-zA-Z0-9]+)\b/g, cls: 'class' },
  ];

  // Collect all tokens with their positions
  const tokens = [];
  for (const { regex, cls } of patterns) {
    let m;
    while ((m = regex.exec(code)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, cls, text: m[0] });
    }
  }

  // Sort by position, remove overlaps (earlier and longer wins)
  tokens.sort((a, b) => a.start - b.start || b.end - a.end);
  const clean = [];
  let cursor = 0;
  for (const t of tokens) {
    if (t.start < cursor) continue;
    clean.push(t);
    cursor = t.end;
  }

  // Build output: escaped text interleaved with token spans
  const parts = [];
  let pos = 0;
  for (const t of clean) {
    if (t.start > pos) {
      parts.push(escapeHtml(code.slice(pos, t.start)));
    }
    parts.push(`<span class="${CLASS_MAP[t.cls] || t.cls}">${t.text}</span>`);
    pos = t.end;
  }
  if (pos < code.length) {
    parts.push(escapeHtml(code.slice(pos)));
  }

  return parts.join('');
}

/**
 * Highlight CSS content.
 * @param {string} code
 * @returns {string}
 */
export function highlightCSS(code) {
  let result = escapeHtml(code);
  result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
  result = result.replace(/(--[\w-]+|#[0-9a-fA-F]{3,8}|\b\d+\.?\d*(?:px|em|rem|%|vh|vw|s|ms)?\b)/g, '<span class="syntax-number">$1</span>');
  result = result.replace(/([a-z-]+)(?=\s*:)/g, '<span class="syntax-attribute">$1</span>');
  result = result.replace(/([:;{}])/g, '<span class="syntax-punctuation">$1</span>');
  return result;
}

/**
 * Highlight generic code by language.
 * @param {string} code
 * @param {string} language
 * @returns {string}
 */
export function highlight(code, language = 'javascript') {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return highlightJavaScript(code);
    case 'css':
      return highlightCSS(code);
    default:
      return escapeHtml(code);
  }
}

/**
 * Escape HTML special characters.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
