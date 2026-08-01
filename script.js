const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-header nav');

const closeMenu = () => {
  if (!button || !nav) return;
  nav.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Меню';
};

if (button && nav) {
  button.setAttribute('aria-controls', nav.id || 'site-navigation');
  if (!nav.id) nav.id = 'site-navigation';
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Закрыть' : 'Меню';
  });
  nav.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !button.contains(event.target)) closeMenu();
  });
}

document.querySelectorAll('[data-current-year]').forEach(node => {
  node.textContent = String(new Date().getFullYear());
});
