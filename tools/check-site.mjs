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
  if (!/<header class="site-header">[\s\S]*?<nav[^>]*aria-label="Основная навигация"/.test(text)) errors.push(`${name}: main navigation missing accessible label`);
  const footer = text.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] || '';
  if (!footer.includes('href="/insights/"')) errors.push(`${name}: footer missing insights`);
  if (!footer.includes('href="/privacy/"')) errors.push(`${name}: footer missing privacy`);
  if (text.includes('>Продукты и игры<')) errors.push(`${name}: obsolete books and games label`);
  if (text.includes('class="hero-visual" aria-hidden="true"')) errors.push(`${name}: meaningful hero hidden from accessibility tree`);
  for (const tag of text.matchAll(/<img\b[^>]*>/g)) {
    if (!/\bwidth="\d+"/.test(tag[0]) || !/\bheight="\d+"/.test(tag[0])) errors.push(`${name}: image without dimensions`);
  }
  if (name !== '404.html') {
    if (!text.includes('rel="canonical"')) errors.push(`${name}: missing canonical`);
    if (!text.includes('property="og:title"') || !text.includes('property="og:image"')) errors.push(`${name}: missing Open Graph`);
    if (!text.includes('application/ld+json')) errors.push(`${name}: missing JSON-LD`);
  }
}

const css = readFileSync(join(root, 'styles.css'), 'utf8');
if (css.includes('\\n')) errors.push('styles.css: literal \\n sequence');
if (css.includes('.preview-bar')) errors.push('styles.css: obsolete preview-bar rule');
if (css.includes('top:108px')) errors.push('styles.css: obsolete mobile menu offset');
if (!css.includes('.process-section') || !css.includes('.process-list')) errors.push('styles.css: missing long-form process component');
for (const resource of ['icon.svg','apple-touch-icon.png','site.webmanifest','og-default.png']) {
  if (!files.some(path => path === join(root,resource))) errors.push(`missing resource: ${resource}`);
}
const sitemap = readFileSync(join(root,'sitemap.xml'),'utf8');
if (!sitemap.includes('<lastmod>')) errors.push('sitemap.xml: missing lastmod');
if (!sitemap.includes('https://akonnov.com/insights/</loc>')) errors.push('sitemap.xml: indexable insights missing');
if (!sitemap.includes('https://akonnov.com/insights/ai-system-not-chatbot/')) errors.push('sitemap.xml: first insight article missing');
if (!sitemap.includes('https://akonnov.com/insights/process-audit/')) errors.push('sitemap.xml: process audit insight missing');
if (!sitemap.includes('https://akonnov.com/insights/verifiable-rag/')) errors.push('sitemap.xml: verifiable RAG insight missing');
if (!sitemap.includes('https://akonnov.com/insights/game-idea-to-print/')) errors.push('sitemap.xml: game development insight missing');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Site guard OK: ${htmlFiles.length} HTML files`);
