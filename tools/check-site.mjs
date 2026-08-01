import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const files = [];
const walk = dir => readdirSync(dir).forEach(name => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) walk(path);
  else files.push(path);
});
walk(root);

const errors = [];
const htmlFiles = files.filter(path => path.endsWith('.html'));
for (const path of htmlFiles) {
  const text = readFileSync(path, 'utf8');
  const name = relative(root, path);
  const forbidden = text.match(/STAGING|НЕ PRODUCTION|preview главной|Изолированный preview|admin\.ru/i);
  if (forbidden) errors.push(`${name}: forbidden marker ${forbidden[0]}`);
  if (!/<meta name="description" content=".{40,}"/.test(text) && name !== '404.html') errors.push(`${name}: missing/short description`);
  if ((text.match(/<h1[ >]/g) || []).length !== 1) errors.push(`${name}: expected exactly one h1`);
  if (!text.includes('class="site-footer"')) errors.push(`${name}: missing site footer`);
  if (!text.includes('class="skip-link"')) errors.push(`${name}: missing skip link`);
}

const css = readFileSync(join(root, 'styles.css'), 'utf8');
if (css.includes('\\n')) errors.push('styles.css: literal \\n sequence');
if (css.includes('.preview-bar')) errors.push('styles.css: obsolete preview-bar rule');
if (css.includes('top:108px')) errors.push('styles.css: obsolete mobile menu offset');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Site guard OK: ${htmlFiles.length} HTML files`);
