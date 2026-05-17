const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
let html = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

// Inline CSS in place
html = html.replace(
  /<link[^>]+href="([^"]+\.css)"[^>]*>/g,
  (_, href) => {
    const cssPath = path.join(buildDir, href);
    if (!fs.existsSync(cssPath)) return '';
    const css = fs.readFileSync(cssPath, 'utf8');
    return `<style>${css}</style>`;
  }
);

// Collect and remove JS script tags
const scripts = [];
html = html.replace(
  /<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g,
  (_, src) => {
    const jsPath = path.join(buildDir, src);
    if (fs.existsSync(jsPath)) {
      scripts.push(fs.readFileSync(jsPath, 'utf8'));
    }
    return '';
  }
);

// Insert scripts at end of body so #root exists
const inlineScripts = scripts.map((js) => `<script>${js}</script>`).join('');
html = html.replace('</body>', `${inlineScripts}</body>`);

fs.writeFileSync(path.join(buildDir, 'index.html'), html);
console.log('Built single-file index.html');
