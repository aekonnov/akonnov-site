import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const lastmod = process.argv[2] || new Date().toISOString().slice(0, 10);
const html = [];
const walk = dir => readdirSync(dir).forEach(name => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (name === 'index.html') html.push(path);
});
walk(root);
const urls = html.map(path => {
  const rel = relative(root, path).replace(/index\.html$/, '');
  return `https://akonnov.com/${rel}`;
}).sort((a, b) => a === 'https://akonnov.com/' ? -1 : b === 'https://akonnov.com/' ? 1 : a.localeCompare(b));
const body = urls.map(url => `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n');
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`Generated sitemap with ${urls.length} URLs and lastmod ${lastmod}`);
