/* =============================================
   DOMIKTUT.RU — main.js
   Общая логика: избранное (localStorage), мобильное меню
   ============================================= */

'use strict';

/* =============================================
   FAVORITES
   ============================================= */
var Favorites = (function () {
  var KEY = 'domik_favorites';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function has(id) {
    return getAll().indexOf(String(id)) !== -1;
  }

  function add(id) {
    var list = getAll();
    var sid = String(id);
    if (list.indexOf(sid) === -1) list.push(sid);
    save(list);
  }

  function remove(id) {
    var list = getAll().filter(function (item) {
      return item !== String(id);
    });
    save(list);
  }

  function toggle(id) {
    if (has(id)) {
      remove(id);
      return false;
    } else {
      add(id);
      return true;
    }
  }

  function count() {
    return getAll().length;
  }

  return { getAll: getAll, has: has, add: add, remove: remove, toggle: toggle, count: count };
})();

/* =============================================
   SYNC FAVORITE BUTTONS & COUNTER
   ============================================= */
function syncFavoriteButtons() {
  // sync all fav buttons that have data-id
  document.querySelectorAll('[data-fav-id]').forEach(function (btn) {
    var id = btn.getAttribute('data-fav-id');
    var isActive = Favorites.has(id);
    btn.classList.toggle('card-h__fav--active', isActive);
    btn.classList.toggle('card-v__fav--active', isActive);

    var svg = btn.querySelector('svg');
    if (!svg) return;
    if (isActive) {
      svg.setAttribute('fill', '#E8530A');
      svg.setAttribute('stroke', '#E8530A');
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', '#6B6B6B');
    }
  });

  updateFavoriteCounter();
}

function updateFavoriteCounter() {
  var count = Favorites.count();
  var counter = document.querySelector('.header__favorite-count');
  if (!counter) return;
  counter.textContent = count;
  counter.style.display = count > 0 ? 'flex' : 'none';
}

/* =============================================
   FAV BUTTON CLICK HANDLER
   ============================================= */
function initFavButtons() {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-fav-id]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    var id = btn.getAttribute('data-fav-id');
    var isNowActive = Favorites.toggle(id);
    var svg = btn.querySelector('svg');

    btn.classList.toggle('card-h__fav--active', isNowActive);
    btn.classList.toggle('card-v__fav--active', isNowActive);

    if (svg) {
      svg.setAttribute('fill', isNowActive ? '#E8530A' : 'none');
      svg.setAttribute('stroke', isNowActive ? '#E8530A' : '#6B6B6B');
    }

    updateFavoriteCounter();

    // dispatch event so favorites.js can react
    document.dispatchEvent(new CustomEvent('favoritesChanged', { detail: { id: id, active: isNowActive } }));
  });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
  var header = document.querySelector('.header');
  if (!header) return;

  // inject burger button if not present
  var burger = header.querySelector('.header__burger');
  if (!burger) {
    burger = document.createElement('button');
    burger.className = 'header__burger';
    burger.setAttribute('aria-label', 'Меню');
    burger.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<line x1="3" y1="6" x2="21" y2="6"/>' +
      '<line x1="3" y1="12" x2="21" y2="12"/>' +
      '<line x1="3" y1="18" x2="21" y2="18"/>' +
      '</svg>';
    // insert before header__actions
    var actions = header.querySelector('.header__actions');
    if (actions) header.querySelector('.header__inner').insertBefore(burger, actions);
    else header.querySelector('.header__inner').appendChild(burger);
  }

  // inject burger styles
  if (!document.getElementById('burger-style')) {
    var style = document.createElement('style');
    style.id = 'burger-style';
    style.textContent =
      '.header__burger{display:none;border:none;background:none;cursor:pointer;color:#1C1C1C;padding:4px;border-radius:6px;}' +
      '@media(max-width:768px){.header__burger{display:flex;align-items:center;justify-content:center;margin-left:auto;}' +
      '.nav.is-open{display:flex!important;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:#fff;padding:16px 24px;border-bottom:1px solid #E0E0E0;box-shadow:0 4px 12px rgba(0,0,0,.08);z-index:99;gap:16px;}}';
    document.head.appendChild(style);
  }

  burger.addEventListener('click', function () {
    var nav = document.querySelector('.nav');
    if (nav) nav.classList.toggle('is-open');
  });

  document.addEventListener('click', function (e) {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    if (!header.contains(e.target)) nav.classList.remove('is-open');
  });
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  syncFavoriteButtons();
  initFavButtons();
  initMobileMenu();
});
