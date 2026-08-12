import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2];
if (!root) throw new Error('Usage: node tools/apply-audit-p3-schema-nav.mjs <site-root>');

const files = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (name === 'index.html' || name === '404.html') files.push(file);
  }
};
walk(root);

let updated = 0;
for (const file of files) {
  let text = readFileSync(file, 'utf8');
  const before = text;
  text = text.replace(/<nav aria-label="Основная навигация">([\s\S]*?)<\/nav>/, (nav, links) => {
    if (links.includes('href="/insights/"')) return nav;
    const active = relative(root, file).replaceAll('\\','/').startsWith('insights/');
    const item = `<a${active ? ' class="active"' : ''} href="/insights/">Материалы</a>`;
    return `<nav aria-label="Основная навигация">${links.replace(/(<a(?: class="active")? href="\/contact\/">)/, `${item}$1`)}</nav>`;
  });
  if (text !== before) {
    writeFileSync(file, text);
    updated++;
  }
}

const replaceJson = (route, graph) => {
  const file = join(root, route, 'index.html');
  const text = readFileSync(file, 'utf8');
  const next = text.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph})}</script>`);
  if (next !== text) {
    writeFileSync(file, next);
    updated++;
  }
};

const person = {
  "@type":"Person",
  "@id":"https://akonnov.com/about/#person",
  "name":"Антон Коннов",
  "url":"https://akonnov.com/about/",
  "email":"admin@akonnov.ru",
  "jobTitle":"Консультант, руководитель проектов и предприниматель",
  "address":{"@type":"PostalAddress","addressLocality":"Москва","addressCountry":"RU"},
  "knowsAbout":["Управление проектами","Финансы и инвестиции","Внутренний контроль","Риск-менеджмент","Цифровая трансформация","Прикладной искусственный интеллект","Разработка настольных игр"],
  "sameAs":["https://t.me/biz_in","https://www.linkedin.com/in/antonkonnov/","https://www.youtube.com/watch?v=aod7FUHa6so"]
};

replaceJson('', [
  {
    "@type":"ProfessionalService",
    "@id":"https://akonnov.com/#service",
    "name":"Антон Коннов — консалтинг и прикладной ИИ",
    "description":"Консалтинг, управление проектами, финансы, внутренний контроль и прикладной ИИ.",
    "url":"https://akonnov.com/",
    "email":"admin@akonnov.ru",
    "image":"https://akonnov.com/og-default.png",
    "inLanguage":"ru-RU",
    "address":{"@type":"PostalAddress","addressLocality":"Москва","addressCountry":"RU"},
    "areaServed":[{"@type":"Country","name":"Россия"},{"@type":"Place","name":"Удалённо"}],
    "founder":{"@id":"https://akonnov.com/about/#person"},
    "sameAs":["https://t.me/biz_in","https://www.linkedin.com/in/antonkonnov/"]
  },
  person,
  {"@type":"WebSite","@id":"https://akonnov.com/#website","name":"Антон Коннов","url":"https://akonnov.com/","inLanguage":"ru-RU","publisher":{"@id":"https://akonnov.com/about/#person"}}
]);

replaceJson('about', [
  person,
  {"@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Главная","item":"https://akonnov.com/"},
    {"@type":"ListItem","position":2,"name":"Об Антоне","item":"https://akonnov.com/about/"}
  ]}
]);

const steps = [
  ["Границы и результат","Определить начало и завершение процесса, клиента результата, владельца и критерий готовности."],
  ["Фактический маршрут","Пройти реальные примеры по документам, системам и коммуникациям."],
  ["Роли и передачи","Зафиксировать исполнителей, ожидания, возвраты, согласования и смену ответственного."],
  ["Данные и показатели","Сопоставить управленческую отчётность с первичными событиями и отделить симптомы от причин."],
  ["Причины и целевая модель","Определить механизм разрывов и описать роли, сценарии, контроль и требования целевого процесса."],
  ["Приоритет и внедрение","Назначить владельцев, сроки, критерии приёмки и способ проверить результат."]
];
replaceJson('insights/process-audit', [
  {
    "@type":"Article",
    "headline":"Как проводить аудит бизнес-процесса",
    "description":"Практическая методика аудита бизнес-процесса: границы, фактический маршрут, данные, причины отклонений, целевая модель и внедрение.",
    "datePublished":"2026-08-09",
    "dateModified":"2026-08-12",
    "inLanguage":"ru-RU",
    "mainEntityOfPage":"https://akonnov.com/insights/process-audit/",
    "author":{"@id":"https://akonnov.com/about/#person"},
    "publisher":{"@id":"https://akonnov.com/about/#person"}
  },
  {
    "@type":"HowTo",
    "name":"Как проводить аудит бизнес-процесса",
    "description":"Шесть шагов от определения границ до внедрения изменений.",
    "totalTime":"PT8M",
    "step":steps.map(([name,text],i)=>({"@type":"HowToStep","position":i+1,"name":name,"text":text}))
  },
  person,
  {"@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Главная","item":"https://akonnov.com/"},
    {"@type":"ListItem","position":2,"name":"Материалы","item":"https://akonnov.com/insights/"},
    {"@type":"ListItem","position":3,"name":"Аудит бизнес-процесса","item":"https://akonnov.com/insights/process-audit/"}
  ]}
]);

console.log(`Updated ${updated} files in ${root}`);
