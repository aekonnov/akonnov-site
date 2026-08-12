import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
if (!root) throw new Error('Usage: node tools/apply-audit-p2-links.mjs <site-root>');

const read = route => readFileSync(join(root, route, 'index.html'), 'utf8');
const write = (route, text) => writeFileSync(join(root, route, 'index.html'), text);
let updated = 0;

const save = (route, transform) => {
  const before = read(route);
  const after = transform(before);
  if (after !== before) {
    write(route, after);
    updated++;
  }
};

const related = (title, links) =>
  `<section class="related-links" aria-labelledby="related-reading"><p class="eyebrow">Читать по теме</p><h2 id="related-reading">${title}</h2><div>${links.map(([href,label]) => `<a href="${href}">${label}<span aria-hidden="true">→</span></a>`).join('')}</div></section>`;

const insertBeforeContact = (text, section) =>
  text.includes(section) ? text : text.replace(/(<section[^>]*class="contact(?:\s[^"]*)?"[^>]*>)/, `${section}$1`);

const portfolioMain = `<main id="main"><section class="page-hero portfolio"><p class="eyebrow">Опыт · роли · профессиональная база</p><h1>Двадцать лет<br><em>на стороне результата</em></h1><p class="lead">Профессиональная траектория в финансах, инвестициях, внутреннем контроле, управлении изменениями, цифровизации и предпринимательстве.</p></section>
<section class="stat-strip"><div><strong>20+</strong><span>лет профессионального опыта</span></div><div><strong>12+</strong><span>крупных финансовых проектов</span></div><div><strong>$300+ млн</strong><span>совокупный объём проектного финансирования</span></div></section>
<section class="portfolio-route"><a href="/portfolio/sber-partner-finance/"><span>Текущая профессиональная роль</span><b>Партнёрское финансирование: стратегия, данные, финансы и ИИ →</b></a></section>
<section class="case-section"><div><p class="eyebrow">Профессиональные контуры</p><h2>Роли и области ответственности</h2></div><div class="case-list"><article><h3>Финансы и инвестиции</h3><p>Проектное финансирование, финансовые модели, оценка, due diligence, M&amp;A, ликвидность и корпоративное управление.</p><span>Банки · Private Equity · телеком</span><a class="case-card-action" href="/consulting/finance-investments/">Направление работы →</a></article><article><h3>Контроль и управление изменениями</h3><p>Внутренний аудит, риск-менеджмент, проектные офисы, редизайн процессов и внедрение управленческих систем.</p><span>Промышленность · TISSUE · агросектор</span><a class="case-card-action" href="/consulting/process-optimization/">Направление работы →</a></article><article><h3>Предпринимательство и продукты</h3><p>Собственные проекты в HoReCa, настольных играх, электронной коммерции, полиграфии и digital production.</p><span>Продукт · операции · продажи</span><a class="case-card-action" href="/books-games/">Книги и игры →</a></article></div></section>
<section class="qualification-band"><div><p class="eyebrow">Профессиональная база</p><h2>Финансы, контроль и технологии</h2></div><div class="qualification-list"><p><b>Основное высшее образование</b><span>Финансы и кредит</span></p><p><b>FCCA / ACCA</b><span>международный учёт и финансы</span></p><p><b>CIA</b><span>внутренний аудит</span></p><p><b>Oxford Brookes University</b><span>бакалавр международного учёта</span></p><p><b>Data Science и ML</b><span>Яндекс Практикум и МГТУ им. Н. Э. Баумана</span></p><p><b>1500+ часов обучения данным и ИИ</b><span>Data Science, анализ данных, машинное обучение и AI-инструменты</span></p></div></section>
<section class="employment-note"><p><b>Текущая профессиональная роль:</b> с 2024 года — руководитель проектов Центра партнёрского финансирования и специальных проектов ПАО Сбербанк. <a href="/portfolio/sber-partner-finance/">Подробно о задачах и проектах →</a></p></section>
<section class="experience-band"><p>Банки · Партнёрское финансирование · Консалтинг · Цифровизация · Private Equity · Телеком · Промышленность · TISSUE · Агросектор · HoReCa · IT · Игры · Полиграфия · ИИ</p></section>
<section class="portfolio-cases-cta"><p class="eyebrow">Отдельный раздел</p><h2>Конкретные ситуации, роли и состав работы</h2><p>Подробные разборы проектов собраны в «Кейсах», без дублирования профессионального профиля.</p><a class="button primary" href="/cases/">Открыть все кейсы →</a></section>
<section id="contact" class="contact contact-dark"><div><p class="eyebrow">Нужен релевантный опыт?</p><h2>Обсудим вашу задачу</h2></div><div class="contact-card"><a href="mailto:admin@akonnov.ru">admin@akonnov.ru</a><a href="https://t.me/biz_in" target="_blank" rel="noreferrer">Telegram ↗</a></div></section></main>`;

save('portfolio', text => text.replace(/<main id="main">[\s\S]*?<\/main>/, portfolioMain));

save('cases', text => {
  const items = [
    ['НПО «Ахтуба»','/cases/akhtuba/'],
    ['Сыктывкар Тиссью Груп','/cases/syktyvkar-tissue/'],
    ['Tree Plus / Mansalto','/cases/tree-plus-mansalto/'],
    ['Банки, инвестиции и M&A','/cases/banking-investments/'],
    ['Норильск-Телеком','/cases/norilsk-telecom/'],
    ['HoReCa / «Корпорация ЖОР»','/cases/horeca-zhor/'],
    ['Digi Anton','/ai/digi-anton/']
  ];
  const json = JSON.stringify({"@context":"https://schema.org","@graph":[
    {"@type":"CollectionPage","name":"Кейсы и подтверждённый опыт — Антон Коннов","url":"https://akonnov.com/cases/","inLanguage":"ru-RU"},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Главная","item":"https://akonnov.com/"},{"@type":"ListItem","position":2,"name":"Кейсы","item":"https://akonnov.com/cases/"}]},
    {"@type":"ItemList","name":"Кейсы Антона Коннова","itemListElement":items.map(([name,url],i)=>({"@type":"ListItem","position":i+1,"name":name,"url":`https://akonnov.com${url}`}))}
  ]});
  return text
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${json}</script>`)
    .replace('</section><section class="boundary-note">', '</section><section class="portfolio-route"><a href="/portfolio/"><span>Профессиональный профиль</span><b>Роли, квалификации и направления опыта →</b></a></section><section class="boundary-note">');
});

const thematic = {
  'consulting/process-optimization': ['Практика диагностики процессов', [
    ['/insights/process-audit/','Как проводить аудит бизнес-процесса'],
    ['/cases/akhtuba/','Аудит и проектный офис НПО «Ахтуба»'],
    ['/cases/tree-plus-mansalto/','Процессы и ERP Tree Plus / Mansalto']
  ]],
  'consulting/finance-investments': ['Финансы в реальных проектах', [
    ['/cases/banking-investments/','Банки, инвестиции и M&A'],
    ['/cases/norilsk-telecom/','Финансовое управление группой'],
    ['/portfolio/sber-partner-finance/','Партнёрское финансирование и ИИ']
  ]],
  'ai': ['Как устроены рабочие AI-системы', [
    ['/insights/ai-system-not-chatbot/','AI-система — не чат-бот'],
    ['/insights/verifiable-rag/','RAG с проверяемыми ответами'],
    ['/ai/cases/','Кейсы прикладного ИИ']
  ]],
  'ai/model-routing': ['Архитектура вокруг моделей', [
    ['/insights/ai-system-not-chatbot/','Семь признаков рабочей AI-системы'],
    ['/insights/verifiable-rag/','Проверяемый RAG'],
    ['/ai/digi-anton/','Digi Anton']
  ]],
  'books-games/development': ['Разработка физического продукта', [
    ['/insights/game-idea-to-print/','Настольная игра: от идеи до тиража'],
    ['/books-games/custom/','Игра под задачу организации'],
    ['/books-games/corporate/','Корпоративные игры']
  ]],
  'books-games/corporate': ['Подтверждённая практика', [
    ['/books-games/mamoniya/','Заказная игра «Мамония»'],
    ['/insights/game-idea-to-print/','От идеи до готового тиража'],
    ['/books-games/custom/','Игра под задачу организации']
  ]],
  'books-games/custom': ['От задачи к готовой игре', [
    ['/books-games/mamoniya/','Заказной кейс «Мамония»'],
    ['/insights/game-idea-to-print/','Этапы разработки и выпуска'],
    ['/books-games/production/','Печать и комплектация']
  ]]
};

for (const [route, [title, links]] of Object.entries(thematic)) {
  save(route, text => {
    const section = related(title, links);
    if (/<section class="related-links"[\s\S]*?<\/section>/.test(text)) {
      return text.replace(/<section class="related-links"[\s\S]*?<\/section>/g, '').replace(/(<section[^>]*class="contact(?:\s[^"]*)?"[^>]*>)/, `${section}$1`);
    }
    return insertBeforeContact(text, section);
  });
}

const articleLinks = {
  'insights/process-audit': [
    ['/insights/verifiable-rag/','Как строить проверяемые ответы по данным'],
    ['/insights/ai-system-not-chatbot/','Почему рабочая AI-система больше чат-бота'],
    ['/consulting/process-optimization/','Оптимизация бизнес-процессов']
  ],
  'insights/verifiable-rag': [
    ['/insights/ai-system-not-chatbot/','Архитектура рабочей AI-системы'],
    ['/insights/process-audit/','Как проводить аудит процесса'],
    ['/ai/islamic-finance-rag/','RAG-кейс в предметной области']
  ],
  'insights/game-idea-to-print': [
    ['/books-games/development/','Полный цикл разработки игры'],
    ['/books-games/mamoniya/','Реальный заказной кейс «Мамония»'],
    ['/books-games/production/','Производство и упаковка']
  ],
  'insights/ai-system-not-chatbot': [
    ['/insights/verifiable-rag/','RAG с проверяемыми ответами'],
    ['/ai/digi-anton/','Действующая система Digi Anton'],
    ['/ai/model-routing/','Маршрутизация моделей']
  ]
};
for (const [route, links] of Object.entries(articleLinks)) {
  save(route, text => insertBeforeContact(text, related('Продолжить чтение', links)));
}

console.log(`Updated ${updated} pages in ${root}`);
