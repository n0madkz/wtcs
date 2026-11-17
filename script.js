const menu = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => nav.classList.toggle('show'));

const modal = document.querySelector('.admin-modal');
document.querySelectorAll('[data-open-admin]').forEach(button => button.addEventListener('click', () => {
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
}));
document.querySelectorAll('[data-close-admin]').forEach(button => button.addEventListener('click', () => {
  modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
}));
document.querySelector('.lead-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.innerHTML = 'Заявка отправлена ✓';
  button.disabled = true;
});

document.querySelectorAll('.brand img, .admin-brand img').forEach(img => {
  img.src = 'assets/west-training-logo.webp';
  img.alt = 'West Training Center & Services';
});
document.querySelectorAll('.header .nav a').forEach(link => {
  if (link.getAttribute('href') === 'corporate.html' || link.dataset.i18n === 'navCorporate') {
    link.href = 'index.html#special-equipment-service';
    link.dataset.i18n = 'navRental';
    link.textContent = 'Аренда спецтехники';
  }
});
