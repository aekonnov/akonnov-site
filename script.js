const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-header nav');
const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
const strings = isEnglish ? {
  menu: 'Menu', closeMenu: 'Close', analyticsLabel: 'Analytics settings',
  analyticsText: 'We use Yandex Metrica only with your consent to understand site traffic and improve the website.',
  learnMore: 'Learn more', acceptAnalytics: 'Allow analytics', necessaryOnly: 'Necessary only',
  privacyPath: '/en/privacy/', verifyAntispam: 'Please complete the anti-spam check.',
  sending: 'Sending…', sendFailed: 'Could not send your enquiry.',
  sent: 'Your enquiry has been sent. Thank you!',
  sendFailedEmail: 'Could not send your enquiry. Please email admin@akonnov.ru.'
} : {
  menu: 'Меню', closeMenu: 'Закрыть', analyticsLabel: 'Настройки аналитики',
  analyticsText: 'Мы используем Яндекс Метрику только с вашего согласия, чтобы понимать посещаемость и улучшать сайт.',
  learnMore: 'Подробнее', acceptAnalytics: 'Разрешить аналитику', necessaryOnly: 'Только необходимые',
  privacyPath: '/privacy/', verifyAntispam: 'Подтвердите антиспам-проверку.',
  sending: 'Отправляем…', sendFailed: 'Не удалось отправить заявку.',
  sent: 'Заявка отправлена. Спасибо!',
  sendFailedEmail: 'Не удалось отправить заявку. Напишите на admin@akonnov.ru.'
};

const focusableSelector = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

const closeMenu = (restoreFocus = false) => {
  if (!button || !nav) return;
  const wasOpen = nav.classList.contains('open');
  nav.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = strings.menu;
  if (restoreFocus && wasOpen) button.focus();
};

if (button && nav) {
  button.setAttribute('aria-controls', nav.id || 'site-navigation');
  if (!nav.id) nav.id = 'site-navigation';
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? strings.closeMenu : strings.menu;
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a[href]')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab' && nav.classList.contains('open')) {
      const items = [button, ...nav.querySelectorAll(focusableSelector)];
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !button.contains(event.target)) closeMenu();
  });
}

document.querySelectorAll('[data-current-year]').forEach(node => {
  node.textContent = String(new Date().getFullYear());
});

const METRIKA_ID = 111661274;
const ANALYTICS_CONSENT_KEY = 'akonnov_analytics_consent_v1';

const readAnalyticsConsent = () => {
  try { return localStorage.getItem(ANALYTICS_CONSENT_KEY); } catch { return null; }
};

const writeAnalyticsConsent = value => {
  try { localStorage.setItem(ANALYTICS_CONSENT_KEY, value); } catch { /* Continue without persistence. */ }
};

const loadMetrika = () => {
  if (window.ym || document.querySelector('[data-metrika-loader]')) return;
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = Date.now();
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;
  script.dataset.metrikaLoader = 'true';
  document.head.append(script);
  window.ym(METRIKA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true
  });
};

const sendMetrikaGoal = goal => {
  if (readAnalyticsConsent() === 'accepted' && window.ym) {
    window.ym(METRIKA_ID, 'reachGoal', goal);
  }
};

const showAnalyticsConsent = () => {
  if (readAnalyticsConsent()) return;
  const banner = document.createElement('section');
  banner.className = 'analytics-consent';
  banner.setAttribute('aria-label', strings.analyticsLabel);
  banner.innerHTML = `<p>${strings.analyticsText} <a href="${strings.privacyPath}">${strings.learnMore}</a></p><div><button type="button" data-analytics-accept>${strings.acceptAnalytics}</button><button type="button" data-analytics-reject>${strings.necessaryOnly}</button></div>`;
  banner.querySelector('[data-analytics-accept]').addEventListener('click', () => {
    writeAnalyticsConsent('accepted');
    loadMetrika();
    banner.remove();
  });
  banner.querySelector('[data-analytics-reject]').addEventListener('click', () => {
    writeAnalyticsConsent('necessary');
    banner.remove();
  });
  document.body.append(banner);
};

if (readAnalyticsConsent() === 'accepted') loadMetrika();
else showAnalyticsConsent();

document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  if (link.href.startsWith('mailto:admin@akonnov.ru')) sendMetrikaGoal('contact_email_click');
  else if (link.hostname === 't.me' && link.pathname === '/biz_in') sendMetrikaGoal('contact_telegram_click');
  else if (link.closest('.contact-paths,.actions,.contact-card')) sendMetrikaGoal('service_interest_click');
});

if (location.pathname.startsWith('/insights/') && location.pathname !== '/insights/') {
  let articleReadSent = false;
  addEventListener('scroll', () => {
    const available = document.documentElement.scrollHeight - innerHeight;
    if (!articleReadSent && available > 0 && scrollY / available >= .75) {
      articleReadSent = true;
      sendMetrikaGoal('article_read_75');
    }
  }, {passive: true});
}

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const status = contactForm.querySelector('[data-contact-form-status]');
  const submit = contactForm.querySelector('button[type="submit"]');
  let formStartSent = false;
  contactForm.addEventListener('input', () => {
    if (!formStartSent) {
      formStartSent = true;
      sendMetrikaGoal('contact_form_start');
    }
  });
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const token = contactForm.querySelector('[name="cf-turnstile-response"]')?.value || '';
    if (!token) {
      status.textContent = strings.verifyAntispam;
      return;
    }
    const data = new FormData(contactForm);
    const payload = {
      name: data.get('name'),
      contact: data.get('contact'),
      message: data.get('message'),
      website: data.get('website'),
      consent: data.get('consent') === 'on',
      turnstileToken: token
    };
    submit.disabled = true;
    status.textContent = strings.sending;
    try {
      const response = await fetch(contactForm.dataset.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || strings.sendFailed);
      contactForm.reset();
      if (window.turnstile) window.turnstile.reset();
      status.textContent = strings.sent;
      sendMetrikaGoal('contact_form_success');
    } catch (error) {
      status.textContent = error.message || strings.sendFailedEmail;
      if (window.turnstile) window.turnstile.reset();
    } finally {
      submit.disabled = false;
    }
  });
}
