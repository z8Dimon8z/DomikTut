/* =============================================
   DOMIKTUT.RU — favorites.js
   Страница избранного: удаление карточек, пустое состояние
   ============================================= */

'use strict';

/* =============================================
   REMOVE FROM FAVORITES
   ============================================= */
function initFavoritesRemove() {
  var list = document.querySelector('.favorites-list');
  var emptyState = document.querySelector('.favorites-empty');
  var countEl = document.querySelector('.favorites-count');

  if (!list) return;

  function updateCount() {
    var cards = list.querySelectorAll('.card-h');
    var n = cards.length;

    if (countEl) {
      countEl.textContent = n + ' ' + objectWord(n);
    }

    if (emptyState) {
      emptyState.style.display = n === 0 ? 'block' : 'none';
      list.style.display = n === 0 ? 'none' : 'flex';
    }
  }

  function objectWord(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'объект';
    if ([2,3,4].indexOf(n % 10) !== -1 && [12,13,14].indexOf(n % 100) === -1) return 'объекта';
    return 'объектов';
  }

  // listen for fav toggle events from main.js
  document.addEventListener('favoritesChanged', function (e) {
    if (e.detail && !e.detail.active) {
      // item was removed — find its card and animate out
      var id = e.detail.id;
      var btn = list.querySelector('[data-fav-id="' + id + '"]');
      if (!btn) return;

      var card = btn.closest('.card-h');
      if (!card) return;

      // animate out
      card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      card.style.opacity = '0';
      card.style.transform = 'translateX(-10px)';

      setTimeout(function () {
        // collapse height smoothly
        card.style.transition = 'max-height 0.2s ease, margin 0.2s ease, padding 0.2s ease';
        card.style.overflow = 'hidden';
        card.style.maxHeight = card.offsetHeight + 'px';

        requestAnimationFrame(function () {
          card.style.maxHeight = '0';
          card.style.marginBottom = '0';
        });

        setTimeout(function () {
          card.remove();
          updateCount();
        }, 220);
      }, 180);
    }
  });

  // initial count sync
  updateCount();
}

/* =============================================
   SYNC COUNT FROM LOCALSTORAGE
   ============================================= */
function syncCountFromStorage() {
  var countEl = document.querySelector('.favorites-count');
  if (!countEl || typeof Favorites === 'undefined') return;
  var n = Favorites.count();
  countEl.textContent = n + ' ' + (n === 1 ? 'объект' : n < 5 ? 'объекта' : 'объектов');
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  syncCountFromStorage();
  initFavoritesRemove();
});
