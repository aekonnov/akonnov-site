const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-header nav');

button.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  button.setAttribute('aria-expanded', String(open));
  button.textContent = open ? 'Закрыть' : 'Меню';
});

nav.addEventListener('click', () => {
  nav.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Меню';
});
