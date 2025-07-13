// js/modules/quiz.js
export default function initQuiz() {
  console.log('▶️ initQuiz вызван');

  const startBtn      = document.getElementById('startTestBtn');
  const testBlock     = document.getElementById('testBlock');
  const miniTestForm  = document.getElementById('miniTestForm');
  const testResult    = document.getElementById('testResult');
  const contactForm   = document.getElementById('contactForm');

  if (!startBtn || !testBlock || !miniTestForm || !testResult || !contactForm) {
    console.warn('❌ initQuiz: какие-то элементы не найдены, выходим.');
    return;
  }

  // Начальное состояние
  testBlock.hidden    = true;
  testResult.hidden   = true;
  contactForm.hidden  = true;

  // 1) Клик "Пройти тест"
  startBtn.addEventListener('click', () => {
    startBtn.hidden    = true;
    testBlock.hidden   = false;
    // Плавный fade-in (предположим CSS transition на .section)
    testBlock.style.opacity = 0;
    setTimeout(() => testBlock.style.opacity = 1, 50);
  });

  // 2) Отправка мини-теста
  miniTestForm.addEventListener('submit', e => {
    e.preventDefault();

    const checkedCount = miniTestForm.querySelectorAll('input[type="checkbox"]:checked').length;
    let message = '';

    if (checkedCount === 0) {
      message = `Вы отметили, что сейчас в целом чувствуете гармонию с собой. 
        Если захотите обсудить важные вопросы или просто разобраться в себе глубже, 
        буду рада помочь на консультации.`;
    } else if (checkedCount <= 2) {
      message = `Вы сталкиваетесь с отдельными трудностями, и это нормально. 
        Иногда достаточно одного разговора, чтобы увидеть ситуацию иначе. 
        Я готова поддержать вас на пути к внутренней устойчивости.`;
    } else if (checkedCount <= 4) {
      message = `Вы отмечаете несколько аспектов, вызывающих напряжение. 
        Важно заботиться о себе, не откладывать своё состояние на потом. 
        Психологическая поддержка поможет найти новые опоры.`;
    } else {
      message = `Вы чувствуете значительный дискомфорт или усталость. 
        Не стоит проходить через это в одиночку — вместе мы сможем найти пути 
        к восстановлению и внутреннему равновесию.`;
    }

    // Вставляем результат и кнопку "Записаться"
    testResult.innerHTML = `
      <p>${message.trim()}</p>
      <div class="text-center" style="margin-top:20px;">
        <button type="button" class="btn btn-primary js-quiz-book-btn">
          Записаться на консультацию
        </button>
      </div>
    `;

    miniTestForm.hidden = true;
    testResult.hidden   = false;
    testResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // 3) Клик "Записаться" — показываем форму
    const bookBtn = testResult.querySelector('.js-quiz-book-btn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        testResult.hidden  = true;
        contactForm.hidden = false;
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
}
