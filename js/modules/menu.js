
export default function initMenu() {
  console.log("▶️ initMenu вызван");

  const navToggle = document.querySelector('.nav-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const navClose = document.querySelector('.nav-close');
  const navLinks = document.querySelectorAll('.nav-overlay a');

  if (!navToggle || !navOverlay || !navClose) {
    console.warn("❌ Элементы .nav-* не найдены!");
    return; // ← этот return уже внутри функции, теперь ОК
  }

  navToggle.addEventListener('click', () => {
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  navClose.addEventListener('click', () => {
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}
