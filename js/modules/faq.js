// js/modules/faq.js
export default function initFaq() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const summary = item.querySelector("summary.faq-question");
    const answer  = item.querySelector(".faq-answer");

    // При загрузке, если уже открыт
    if (item.hasAttribute("open")) {
      answer.style.height = answer.scrollHeight + "px";
      answer.style.opacity = 1;
    }

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = item.hasAttribute("open");

      if (isOpen) {
        // Закрываем
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => {
          answer.style.transition = "height 0.4s ease, opacity 0.4s ease";
          answer.style.height = "0";
          answer.style.opacity = 0;
        });
        item.removeAttribute("open");
      } else {
        // Открываем
        answer.style.transition = "";
        answer.style.height = "0";
        answer.style.opacity = 0;
        item.setAttribute("open", "");
        requestAnimationFrame(() => {
          answer.style.transition = "height 0.4s ease, opacity 0.4s ease";
          answer.style.height = answer.scrollHeight + "px";
          answer.style.opacity = 1;
        });
      }
    });

    // После анимации делаем height: auto для адаптивности
    answer.addEventListener("transitionend", (evt) => {
      if (evt.propertyName === "height" && item.hasAttribute("open")) {
        answer.style.height = "auto";
        answer.style.transition = "";
      }
    });
  });
}
