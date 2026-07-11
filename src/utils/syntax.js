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
 * @param {string} code
 * @returns {string} HTML with syntax spans.
 */
export function highlightJavaScript(code) {
  // Order matters — longer patterns first
  const patterns = [
    { regex: /\/\/.*$/gm, className: 'comment' },
    { regex: /\/\*[\s\S]*?\*\//g, className: 'comment' },
    { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, className: 'string' },
    { regex: /\b(import|export|from|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|class|extends|super|async|await|yield|try|catch|finally|throw|this|true|false|null|undefined|NaN|Infinity)\b/g, className: 'keyword' },
    { regex: /\b(\d+\.?\d*|0x[0-9a-fA-F]+)\b/g, className: 'number' },
    { regex: /\b([A-Z][a-zA-Z0-9]+)\b/g, className: 'class' },
    { regex: /(\/\*[\s\S]*?\*\/)/g, className: 'comment' },
  ];

  let result = escapeHtml(code);

  for (const { regex, className } of patterns) {
    result = result.replace(regex, (match) => {
      if (match.startsWith('"') || match.startsWith("'") || match.startsWith('`')) {
        return `<span class="syntax-string">${match}</span>`;
      }
      if (match.startsWith('//') || match.startsWith('/*')) {
        return `<span class="syntax-comment">${match}</span>`;
      }
      if (/^\d/.test(match)) {
        return `<span class="syntax-number">${match}</span>`;
      }
      return `<span class="syntax-${className}">${match}</span>`;
    });
  }

  return result;
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
