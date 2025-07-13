// js/modules/lightbox-init.js

export default function initLightbox() {
  console.log('▶️ initLightbox (docs) вызван');

  const gallery = document.querySelector('.documents-gallery');
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll('a[data-lightbox]'));
  if (!items.length) return;

  let current = 0;

  // 1) Создаём оверлей
  const overlay = document.createElement('div');
  overlay.className = 'docs-lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.tabIndex = -1;               // чтобы можно было дать фокус
  overlay.innerHTML = `
    <div class="docs-lightbox-content">
      <button class="docs-lightbox-close" aria-label="Закрыть">&times;</button>
      <button class="docs-lightbox-prev" aria-label="Предыдущее">&#10094;</button>
      <img class="docs-lightbox-img" src="" alt="">
      <button class="docs-lightbox-next" aria-label="Следующее">&#10095;</button>
      <div class="docs-lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const content    = overlay.querySelector('.docs-lightbox-content');
  const imgEl      = overlay.querySelector('.docs-lightbox-img');
  const captionEl  = overlay.querySelector('.docs-lightbox-caption');
  const prevBtn    = overlay.querySelector('.docs-lightbox-prev');
  const nextBtn    = overlay.querySelector('.docs-lightbox-next');
  const closeBtn   = overlay.querySelector('.docs-lightbox-close');

  // Собираем фокусируемые внутри контента
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let focusable = [];

  function updateFocusable() {
    focusable = Array.from(content.querySelectorAll(focusableSelectors))
      .filter(el => !el.disabled);
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
    updateFocusable();
    const idx = focusable.indexOf(document.activeElement);
    if (e.shiftKey) {
      // Shift+Tab
      if (idx === 0 || idx === -1) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    } else {
      // Tab
      if (idx === focusable.length - 1) {
        e.preventDefault();
        focusable[0].focus();
      }
    }
  }

  function show(i) {
    current = (i + items.length) % items.length;
    const link = items[current];
    imgEl.src     = link.href;
    imgEl.alt     = link.dataset.title || '';
    captionEl.textContent = link.dataset.title || '';
    overlay.classList.add('open');
    // обновляем фокусируемые и ставим фокус на кнопку закрыть
    updateFocusable();
    closeBtn.focus();
    document.addEventListener('keydown', onKeyDown);
  }

  function hide() {
    overlay.classList.remove('open');
    document.removeEventListener('keydown', onKeyDown);
  }

  function prev() { show(current - 1) }
  function next() { show(current + 1) }

  function onKeyDown(e) {
    // Esc
    if (e.key === 'Escape') {
      hide();
      return;
    }
    // Стрелки
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
      return;
    }
    // Таб-блокировка
    trapTab(e);
  }

  // Навешиваем события
  prevBtn.addEventListener('click', e => { e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); next(); });
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hide();
  });

  items.forEach((link, i) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      show(i);
    });
  });

    // —— начало: свайпы для мобильных ———————————————————
  let touchStartX = 0;
  overlay.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  overlay.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const dx = touchEndX - touchStartX;
    const threshold = 50; // пикселей для распознавания свайпа
    if (dx > threshold) {
      // свайп вправо
      prev();
    } else if (dx < -threshold) {
      // свайп влево
      next();
    }
  }, { passive: true });
  // —— конец: свайпы для мобильных ———————————————————

}
