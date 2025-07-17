// js/main.js

import initMenu       from './modules/menu.js';
import initQuiz       from './modules/quiz.js';
import initGallery    from './modules/gallery.js';
import initScroll     from './modules/scroll.js';
import initForm       from './modules/form.js';
import initLightbox   from './modules/lightbox-init.js';
import initFaq        from './modules/faq.js';

/**
 * Возвращает полный URL к partial-файлу
 */
function getPartialUrl(file) {
  try {
    return new URL(`../partials/${file}.html`, import.meta.url).href;
  } catch {
    return `partials/${file}.html`;
  }
}

/**
 * Загружает HTML-партиал в контейнер #id и вызывает cb()
 */
async function loadPartial(id, file, cb) {
  const container = document.getElementById(id);
  if (!container) {
    console.warn(`❌ Контейнер #${id} не найден.`);
    return;
  }
  const url = getPartialUrl(file);
  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`status ${res.status}`);
    container.innerHTML = await res.text();
    if (typeof cb === 'function') cb();
    console.log(`✅ Partial "${file}" вставлен в #${id}`);
  } catch (err) {
    console.error(`⚠️ Ошибка загрузки "${file}":`, err);
  }
}

/**
 * Единственный обработчик DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('👷 DOMContentLoaded — старт');

  // 1) Header + меню
  await loadPartial('header', 'header', () => {
    console.log('📦 Header загружен — initMenu()');
    initMenu();
  });

  // 2) Footer
  await loadPartial('footer', 'footer');

  // 3) Форма (если есть на странице)
  if (document.getElementById('contactForm')) {
    console.log('🚀 initForm()');
    initForm();
  }

  // 4) Lightbox (если есть атрибут data-lightbox)
 // после loadPartial('footer', …)
  if (document.querySelector('.documents-gallery')) {
  console.log('🚀 initLightbox() [docs]');
  initLightbox();
}



    // 5) Мини-тест — только на главной с кнопкой "Пройти тест"
  if (document.getElementById('startTestBtn')) {
    console.log('🚀 initQuiz() [index]');
    initQuiz();
  }

  // 6) Остальные модули — всегда
  console.log('🚀 initGallery()'); initGallery();
  console.log('🚀 initScroll()');  initScroll();
  console.log('🚀 initFaq()');    initFaq();

  console.log('🎉 Всё загружено и запущено');
});
