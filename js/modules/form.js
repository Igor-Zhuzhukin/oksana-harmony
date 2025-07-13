// js/modules/form.js

export default function initForm() {
  console.log('▶️ initForm вызван');

  // 1) Найти контейнер или саму форму
  // Может быть <section id="contactForm"> или <form id="contactForm">
  const wrapper = document.getElementById('contactForm');
  if (!wrapper) {
    console.warn('⚠️ initForm: #contactForm не найден — выходим.');
    return;
  }

  // 2) Определяем, где «наше» <form>
  let bookingForm;
  if (wrapper.tagName === 'FORM') {
    bookingForm = wrapper;
  } else {
    bookingForm = wrapper.querySelector('form.booking-form-content') || wrapper.querySelector('form#contactForm');
  }
  if (!bookingForm) {
    console.warn('⚠️ initForm: не найден <form> внутри #contactForm — выходим.');
    return;
  }

  // 3) Поля имени и телефона
  const nameInput  = bookingForm.querySelector('input[name="name"], input[type="text"]');
  const phoneInput = bookingForm.querySelector('input[name="phone"], input[name="contact"], input[type="tel"]');
  if (!nameInput || !phoneInput) {
    console.warn('⚠️ initForm: поля name или contact/phone не найдены — выходим.');
    return;
  }

  // 4) UX-атрибуты
  nameInput.maxLength    = 30;
  nameInput.autocomplete = 'name';
  nameInput.placeholder  = 'Иван Иванов';
  nameInput.setAttribute('aria-describedby', 'name-error');
  nameInput.setAttribute('aria-invalid', 'false');

  phoneInput.type       = 'tel';
  phoneInput.inputMode  = 'tel';
  phoneInput.maxLength  = 17;
  phoneInput.placeholder = '+7 XXX XXX XX XX';
  phoneInput.setAttribute('aria-describedby', 'contact-error');
  phoneInput.setAttribute('aria-invalid', 'false');

  // 5) Контейнеры для ошибок (если нет — создаём)
  let nameError = bookingForm.querySelector('#name-error');
  if (!nameError) {
    nameError = document.createElement('div');
    nameError.id = 'name-error';
    nameError.className = 'error-message';
    nameInput.insertAdjacentElement('afterend', nameError);
  }
  let phoneError = bookingForm.querySelector('#contact-error');
  if (!phoneError) {
    phoneError = document.createElement('div');
    phoneError.id = 'contact-error';
    phoneError.className = 'error-message';
    phoneInput.insertAdjacentElement('afterend', phoneError);
  }

  // 6) Показ/скрытие ошибки
  const toggleError = (el, msg) => {
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    const inp = el === nameError ? nameInput : phoneInput;
    inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
    inp.classList.toggle('input-error', !!msg);
  };

  // 7) Валидация Имени
  nameInput.addEventListener('input', () => {
    let v = nameInput.value
      .replace(/[^A-Za-zА-Яа-яЁё\s]/g, '')
      .replace(/^\s+/, '')
      .replace(/\s+/g, ' ')
      .slice(0, 30);
    nameInput.value = v;

    const ok = /^[A-Za-zА-Яа-яЁё]{2,}(?:\s[A-Za-zА-Яа-яЁё]{1,})?$/.test(v);
    toggleError(
      nameError,
      ok ? '' : 'Имя: 2–30 букв, только латиница/кириллица, первая буква заглавная'
    );
  });

  nameInput.addEventListener('blur', () => {
    let v = nameInput.value.trim().replace(/\s+/g, ' ');
    if (v) nameInput.value = v.charAt(0).toUpperCase() + v.slice(1);
  });

  // 8) Валидация Телефона
  phoneInput.addEventListener('input', () => {
    let digits = phoneInput.value.replace(/\D/g, '');
    if (digits.startsWith('7')) digits = digits.slice(1);
    digits = digits.slice(0, 10);

    let fmt = '+7';
    if (digits.length > 0) fmt += ' ' + digits.slice(0, 3);
    if (digits.length > 3) fmt += ' ' + digits.slice(3, 6);
    if (digits.length > 6) fmt += ' ' + digits.slice(6, 8);
    if (digits.length > 8) fmt += ' ' + digits.slice(8, 10);
    phoneInput.value = fmt;

    const ok = digits.length === 10;
    toggleError(
      phoneError,
      ok ? '' : 'Телефон: введите 10 цифр после +7'
    );
  });

  if (!phoneInput.value) phoneInput.value = '+7 ';

  // 9) Отправка
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    const nameOk = /^[A-Za-zА-Яа-яЁё]{2,}(?:\s[A-Za-zА-Яа-яЁё]{1,})?$/.test(nameInput.value.trim());
    const phoneOk = phoneInput.value.replace(/\D/g, '').slice(-10).length === 10;

    toggleError(nameError,  nameOk ? '' : 'Введите корректное имя');
    toggleError(phoneError, phoneOk ? '' : 'Введите 10 цифр после +7');

    if (!nameOk)  return nameInput.focus();
    if (!phoneOk) return phoneInput.focus();

    console.log('📝 Форма отправлена', new FormData(bookingForm));
    alert('Форма успешно отправлена! Я свяжусь с вами в течение 24 часов.');

    bookingForm.reset();
    phoneInput.value = '+7 ';
    toggleError(nameError, '');
    toggleError(phoneError, '');
  });
}
