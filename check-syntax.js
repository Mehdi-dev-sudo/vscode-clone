const fs = require('fs');
const path = require('path');
const dir = 'src';

function checkDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dirPath, e.name);
    if (e.isDirectory()) checkDir(full);
    else if (e.name.endsWith('.js')) {
      try {
        const code = fs.readFileSync(full, 'utf8');
        // Try parsing by stripping module-specific syntax
        const stripped = code
          .replace(/^\/\/ @ts-check\n?/m, '')
          .replace(/import\s+.*?from\s+['"].*?['"];?\n?/gs, '')
          .replace(/import\s+['"].*?['"];?\n?/gs, '')
          .replace(/export\s+(default\s+)?/g, '');
        new Function(stripped);
      } catch (err) {
        const msg = err.message;
        console.log('ERROR:', full, '-', msg);
      }
    }
  }
}
checkDir(dir);
console.log('Done.');
