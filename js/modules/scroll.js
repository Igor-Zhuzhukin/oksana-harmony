// js/modules/scroll.js
export default function initScroll() {
  console.log('▶️ initScroll вызван');
  // …ваша логика скролла…


document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});
}