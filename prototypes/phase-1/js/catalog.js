/* =============================================
   DOMIKTUT.RU — catalog.js
   Каталог: попап фильтров, чипы, степпер, пины карты
   ============================================= */

'use strict';

/* =============================================
   FILTER POPUP
   ============================================= */
function initFilterPopup() {
  var overlay = document.getElementById('filterOverlay');
  var openBtn = document.getElementById('openFilter');
  var closeBtn = document.getElementById('closeFilter');
  var applyBtn = document.getElementById('applyFilter');
  var resetBtn = document.getElementById('resetFilter');

  if (!overlay) return;

  function open() { overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function close() { overlay.classList.remove('is-open'); document.body.style.overflow = ''; }

  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (applyBtn) applyBtn.addEventListener('click', close);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      overlay.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
      var stpVal = document.getElementById('stpVal');
      if (stpVal) stpVal.textContent = '1';
      var priceFrom = overlay.querySelector('input[type="number"]:first-of-type');
      var priceTo = overlay.querySelector('input[type="number"]:last-of-type');
      if (priceFrom) priceFrom.value = '';
      if (priceTo) priceTo.value = '';
    });
  }
}

/* =============================================
   STEPPER
   ============================================= */
function initStepper() {
  var minusBtn = document.getElementById('stpMinus');
  var plusBtn = document.getElementById('stpPlus');
  var valEl = document.getElementById('stpVal');
  if (!minusBtn || !plusBtn || !valEl) return;

  minusBtn.addEventListener('click', function () {
    var v = parseInt(valEl.textContent, 10);
    if (v > 1) valEl.textContent = v - 1;
  });

  plusBtn.addEventListener('click', function () {
    var v = parseInt(valEl.textContent, 10);
    if (v < 50) valEl.textContent = v + 1;
  });
}

/* =============================================
   FILTER CHIPS
   ============================================= */
function initFilterChips() {
  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('filter-chip--active');
      var arrow = chip.querySelector('.filter-chip__arrow');
      if (arrow) chip.classList.toggle('filter-chip--open');
    });
  });
}

/* =============================================
   MAP PINS HOVER
   ============================================= */
function initMapPins() {
  var pins = document.querySelectorAll('.map-pin');
  var cards = document.querySelectorAll('.card-h');
  if (!pins.length) return;

  pins.forEach(function (pin, index) {
    pin.addEventListener('mouseenter', function () {
      // deactivate all pins
      pins.forEach(function (p) { p.classList.remove('map-pin--active'); });
      pin.classList.add('map-pin--active');

      // highlight corresponding card
      cards.forEach(function (c) { c.style.outline = ''; });
      if (cards[index]) {
        cards[index].style.outline = '2px solid #E8530A';
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    pin.addEventListener('mouseleave', function () {
      cards.forEach(function (c) { c.style.outline = ''; });
    });
  });

  // reverse: hover card → highlight pin
  cards.forEach(function (card, index) {
    card.addEventListener('mouseenter', function () {
      pins.forEach(function (p) { p.classList.remove('map-pin--active'); });
      if (pins[index]) pins[index].classList.add('map-pin--active');
    });

    card.addEventListener('mouseleave', function () {
      pins.forEach(function (p) { p.classList.remove('map-pin--active'); });
    });
  });
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  initFilterPopup();
  initStepper();
  initFilterChips();
  initMapPins();
});
