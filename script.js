const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-header nav');

const focusableSelector = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

const closeMenu = (restoreFocus = false) => {
  if (!button || !nav) return;
  const wasOpen = nav.classList.contains('open');
  nav.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Меню';
  if (restoreFocus && wasOpen) button.focus();
};

if (button && nav) {
  button.setAttribute('aria-controls', nav.id || 'site-navigation');
  if (!nav.id) nav.id = 'site-navigation';
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Закрыть' : 'Меню';
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

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const status = contactForm.querySelector('[data-contact-form-status]');
  const submit = contactForm.querySelector('button[type="submit"]');
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const token = contactForm.querySelector('[name="cf-turnstile-response"]')?.value || '';
    if (!token) {
      status.textContent = 'Подтвердите антиспам-проверку.';
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
    status.textContent = 'Отправляем…';
    try {
      const response = await fetch(contactForm.dataset.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Не удалось отправить заявку.');
      contactForm.reset();
      if (window.turnstile) window.turnstile.reset();
      status.textContent = 'Заявка отправлена. Спасибо!';
    } catch (error) {
      status.textContent = error.message || 'Не удалось отправить заявку. Напишите на admin@akonnov.ru.';
      if (window.turnstile) window.turnstile.reset();
    } finally {
      submit.disabled = false;
    }
  });
}
