/* =============================================
   DOMIKTUT.RU — index.js
   Главная страница: FAQ аккордеон, hero-превью
   ============================================= */

'use strict';

/* =============================================
   FAQ ACCORDION
   ============================================= */
function initFaq() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  // inject max-height animation style
  if (!document.getElementById('faq-anim-style')) {
    var style = document.createElement('style');
    style.id = 'faq-anim-style';
    style.textContent =
      '.faq-item__answer{overflow:hidden;max-height:0;padding-top:0;padding-bottom:0;transition:max-height .28s ease,padding .2s ease;}' +
      '.faq-item.is-open .faq-item__answer{max-height:400px;padding-bottom:18px;}';
    document.head.appendChild(style);
  }

  // remove display:none from CSS — we use max-height animation instead
  document.querySelectorAll('.faq-item__answer').forEach(function (el) {
    el.style.display = 'block';
  });

  items.forEach(function (item) {
    var question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // close all
      items.forEach(function (i) { i.classList.remove('is-open'); });

      // open clicked if was closed
      if (!isOpen) item.classList.add('is-open');
    });
  });
}

/* =============================================
   HERO THUMBNAILS
   ============================================= */
var HERO_COLORS = [
  'linear-gradient(135deg,rgba(107,143,168,0.6) 0%,rgba(58,101,128,0.6) 100%)',
  'linear-gradient(135deg,rgba(139,168,156,0.6) 0%,rgba(94,133,115,0.6) 100%)',
  'linear-gradient(135deg,rgba(158,179,197,0.6) 0%,rgba(107,143,168,0.6) 100%)',
  'linear-gradient(135deg,rgba(124,154,110,0.6) 0%,rgba(78,122,67,0.6) 100%)'
];

function initHeroThumbs() {
  var thumbs = document.querySelectorAll('.hero__thumb');
  var bg = document.querySelector('.hero__bg');
  if (!thumbs.length || !bg) return;

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('hero__thumb--active'); });
      thumb.classList.add('hero__thumb--active');

      if (HERO_COLORS[index]) {
        // blend the overlay color with the base dark
        bg.style.background =
          HERO_COLORS[index] + ', ' +
          'radial-gradient(ellipse at 60% 60%, #1A2E28 0%, #1A1A2E 60%)';
      }
    });
  });
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  initFaq();
  initHeroThumbs();
});
