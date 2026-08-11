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
