/* =============================================
   DOMIKTUT.RU — house.js
   Страница объекта: галерея, расчёт стоимости, sticky CTA
   ============================================= */

'use strict';

/* =============================================
   GALLERY SWITCHER
   ============================================= */
var GALLERY_COLORS = [
  'linear-gradient(135deg,#6B8FA8 0%,#3A6580 100%)',
  'linear-gradient(135deg,#8BA89C 0%,#5E8573 100%)',
  'linear-gradient(135deg,#B0A080 0%,#8A7A5A 100%)',
  'linear-gradient(135deg,#9EB3C5 0%,#6B8FA8 100%)',
  'linear-gradient(135deg,#7B9EB3 0%,#4A7A9B 100%)'
];

function initGallery() {
  var mainPhoto = document.querySelector('.gallery__main');
  var thumbs = document.querySelectorAll('.gallery__thumb');
  if (!mainPhoto || !thumbs.length) return;

  // add active style for thumbs
  if (!document.getElementById('gallery-style')) {
    var style = document.createElement('style');
    style.id = 'gallery-style';
    style.textContent =
      '.gallery__thumb{cursor:pointer;opacity:.8;transition:opacity .15s;}' +
      '.gallery__thumb:hover,.gallery__thumb--active{opacity:1;outline:2px solid #E8530A;}';
    document.head.appendChild(style);
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      // update main photo background
      var inner = mainPhoto.querySelector('.photo-placeholder');
      if (inner && GALLERY_COLORS[index]) {
        inner.style.background = GALLERY_COLORS[index];
      }

      // update active thumb
      thumbs.forEach(function (t) { t.classList.remove('gallery__thumb--active'); });
      thumb.classList.add('gallery__thumb--active');
    });
  });

  // set first thumb active
  thumbs[0] && thumbs[0].classList.add('gallery__thumb--active');
}

/* =============================================
   BOOKING PRICE CALCULATOR
   ============================================= */
// Price config (per night)
var PRICES = {
  weekday: 8000,   // Mon–Thu
  weekend: 10000,  // Fri–Sun
  holiday: 12000   // not detected automatically, use weekend price as fallback
};

function isWeekend(date) {
  var day = date.getDay(); // 0=Sun, 6=Sat
  return day === 0 || day === 5 || day === 6; // Fri, Sat, Sun
}

function calcTotal(checkin, checkout) {
  if (!checkin || !checkout || checkout <= checkin) return null;
  var total = 0;
  var nights = 0;
  var cur = new Date(checkin);
  while (cur < checkout) {
    total += isWeekend(cur) ? PRICES.weekend : PRICES.weekday;
    nights++;
    cur.setDate(cur.getDate() + 1);
  }
  return { total: total, nights: nights };
}

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function initBookingCalc() {
  var checkinInput = document.querySelector('.booking-dates input[type="date"]:first-child');
  var checkoutInput = document.querySelector('.booking-dates input[type="date"]:last-child');
  var totalLabel = document.querySelector('.booking-total__label');
  var totalValue = document.querySelector('.booking-total__value');

  if (!checkinInput || !checkoutInput || !totalLabel || !totalValue) return;

  function update() {
    var checkin = checkinInput.value ? new Date(checkinInput.value) : null;
    var checkout = checkoutInput.value ? new Date(checkoutInput.value) : null;

    if (!checkin || !checkout) return;

    // validation: checkout must be after checkin
    if (checkout <= checkin) {
      checkoutInput.style.borderColor = '#E8530A';
      totalLabel.textContent = 'Выберите корректные даты';
      totalValue.textContent = '—';
      return;
    }

    checkoutInput.style.borderColor = '';
    var result = calcTotal(checkin, checkout);
    if (!result) return;

    totalLabel.textContent = 'Итого за ' + result.nights + ' ' + nightWord(result.nights);
    totalValue.textContent = formatPrice(result.total);
  }

  function nightWord(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'сутки';
    if ([2,3,4].indexOf(n % 10) !== -1 && ![12,13,14].indexOf(n % 100) === -1) return 'суток';
    return 'суток';
  }

  checkinInput.addEventListener('change', function () {
    // auto-set checkout to next day if not set or before checkin
    if (checkinInput.value) {
      var d = new Date(checkinInput.value);
      d.setDate(d.getDate() + 1);
      var next = d.toISOString().split('T')[0];
      if (!checkoutInput.value || checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = next;
      }
    }
    update();
  });

  checkoutInput.addEventListener('change', update);

  // initial calculation
  update();
}

/* =============================================
   STICKY CTA ON MOBILE
   ============================================= */
function initStickyMobileCta() {
  if (window.innerWidth > 768) return;

  var bookBtn = document.querySelector('.booking-card .btn--primary');
  if (!bookBtn) return;

  var stickyBtn = bookBtn.cloneNode(true);
  stickyBtn.id = 'sticky-cta';
  stickyBtn.style.cssText =
    'position:fixed;bottom:0;left:0;right:0;border-radius:0;z-index:150;' +
    'display:none;padding:14px 24px;font-size:15px;';
  document.body.appendChild(stickyBtn);

  var bookingCard = document.querySelector('.booking-card');

  window.addEventListener('scroll', function () {
    if (!bookingCard) return;
    var rect = bookingCard.getBoundingClientRect();
    // show sticky when booking card is scrolled out of view above
    stickyBtn.style.display = rect.bottom < 0 ? 'flex' : 'none';
  });

  stickyBtn.addEventListener('click', function () {
    if (bookingCard) bookingCard.scrollIntoView({ behavior: 'smooth' });
  });
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  initGallery();
  initBookingCalc();
  initStickyMobileCta();
});
