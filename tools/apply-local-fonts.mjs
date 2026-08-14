import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
if (!root) throw new Error('Usage: node tools/apply-local-fonts.mjs <site-root>');
const files = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (name.endsWith('.html')) files.push(file);
  }
};
walk(root);
let updated = 0;
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = before
    .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/g, '')
    .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/g, '')
    .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet">/g, '');
  if (after !== before) {
    writeFileSync(file, after);
    updated++;
  }
}
const cssFile = join(root, 'styles.css');
const css = readFileSync(cssFile, 'utf8');
const fontFaces = `@font-face{font-family:Manrope;font-style:normal;font-weight:400 700;font-display:swap;src:url("/assets/fonts/manrope-cyrillic.woff2") format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
@font-face{font-family:Manrope;font-style:normal;font-weight:400 700;font-display:swap;src:url("/assets/fonts/manrope-latin.woff2") format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Unbounded;font-style:normal;font-weight:500 600;font-display:swap;src:url("/assets/fonts/unbounded-cyrillic.woff2") format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
@font-face{font-family:Unbounded;font-style:normal;font-weight:500 600;font-display:swap;src:url("/assets/fonts/unbounded-latin.woff2") format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
`;
if (!css.startsWith('@font-face{font-family:Manrope')) {
  writeFileSync(cssFile, fontFaces + css);
  updated++;
}
console.log(`Updated ${updated} files in ${root}`);
