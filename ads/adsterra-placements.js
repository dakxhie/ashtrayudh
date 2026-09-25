/**
 * Ad shell: writing stays in the center column.
 * Banners fill the top, both sides, and the bottom.
 * Every click outside forms fires popunder + smartlink.
 */
(function (global) {
  'use strict';

  var EXCLUDED_PAGES = ['admin.html'];
  var clickCount = 0;

  function config() {
    return global.ADSTERRA_CONFIG || {};
  }

  function core() {
    return global.AdsterraCore;
  }

  function currentPage() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function isExcluded() {
    return EXCLUDED_PAGES.indexOf(currentPage()) !== -1;
  }

  function slotFor(unit, extraClass) {
    var c = core();
    if (!c || !unit) return null;
    var el = c.createContainer('ad-slot--unit ' + (extraClass || ''), unit.label || 'Advertisement');
    el.style.maxWidth = (typeof unit.width === 'number' ? unit.width + 24 : 980) + 'px';
    c.renderUnit(el, unit, 'ad-slot__iframe--unit');
    return el;
  }

  function fill(parent, units, extraClass) {
    units.forEach(function (unit) {
      var el = slotFor(unit, extraClass);
      if (el) parent.appendChild(el);
    });
  }

  function wrapPage() {
    if (document.querySelector('.ad-shell')) return document.querySelector('.ad-shell');

    var navbar = document.querySelector('.navbar');
    var footer = document.querySelector('.footer');
    if (!navbar || !footer) return null;

    var shell = document.createElement('div');
    shell.className = 'ad-shell';

    var top = document.createElement('div');
    top.className = 'ad-shell__top';
    var row = document.createElement('div');
    row.className = 'ad-shell__row';
    var left = document.createElement('aside');
    left.className = 'ad-shell__rail ad-shell__rail--left';
    left.setAttribute('aria-label', 'Advertisements');
    var center = document.createElement('div');
    center.className = 'ad-shell__center';
    var right = document.createElement('aside');
    right.className = 'ad-shell__rail ad-shell__rail--right';
    right.setAttribute('aria-label', 'Advertisements');
    var bottom = document.createElement('div');
    bottom.className = 'ad-shell__bottom';
    var sticky = document.createElement('div');
    sticky.className = 'ad-shell__sticky';

    row.appendChild(left);
    row.appendChild(center);
    row.appendChild(right);
    shell.appendChild(top);
    shell.appendChild(row);
    shell.appendChild(bottom);
    footer.parentNode.insertBefore(shell, footer);
    footer.parentNode.insertBefore(sticky, footer);

    var node = navbar.nextSibling;
    while (node && node !== shell && node !== footer) {
      var next = node.nextSibling;
      if (node.nodeType === 1 && node.tagName !== 'SCRIPT') {
        center.appendChild(node);
      }
      node = next;
    }

    var banners = config().banners || {};
    fill(top, [
      banners.leaderboard728x90,
      banners.banner468x60
    ], 'ad-slot--top');

    fill(left, [
      banners.skyscraper160x600,
      banners.vertical160x300
    ], 'ad-slot--rail');

    fill(right, [
      banners.medium300x250,
      banners.vertical160x300,
      banners.skyscraper160x600
    ], 'ad-slot--rail');

    fill(bottom, [
      banners.leaderboard728x90,
      banners.banner468x60,
      banners.medium300x250
    ], 'ad-slot--bottom');

    if (config().native && global.AdsterraNativeBanner) {
      var native = global.AdsterraNativeBanner.create('Native advertisement');
      if (native) bottom.appendChild(native);
    }

    fill(sticky, [banners.mobile320x50], 'ad-slot--sticky');

    insertBetweenSections(center, banners.banner468x60);
    return shell;
  }

  function insertBetweenSections(center, unit) {
    var sections = center.querySelectorAll(':scope > section, :scope > main, :scope > article');
    if (!sections.length || !unit) return;
    Array.prototype.forEach.call(sections, function (section, index) {
      if (index === 0) return;
      var el = slotFor(unit, 'ad-slot--between');
      if (el) center.insertBefore(el, section);
    });
  }

  function mountExistingSlots() {
    document.querySelectorAll('[data-adsterra-native]').forEach(function (el) {
      if (global.AdsterraNativeBanner) global.AdsterraNativeBanner.mount(el);
    });
    document.querySelectorAll('[data-adsterra-300x250]').forEach(function (el) {
      if (global.AdsterraBanner300x250) global.AdsterraBanner300x250.mount(el);
    });
    document.querySelectorAll('[data-adsterra-mobile]').forEach(function (el) {
      if (global.AdsterraBannerMobile) global.AdsterraBannerMobile.mount(el);
    });
    document.querySelectorAll('[data-adsterra-sidebar]').forEach(function (el) {
      if (global.AdsterraSidebar160x600) global.AdsterraSidebar160x600.mount(el);
    });
  }

  function noteClick(kind) {
    clickCount += 1;
    var note = document.querySelector('.ad-click-note');
    if (!note) {
      note = document.createElement('div');
      note.className = 'ad-click-note';
      document.body.appendChild(note);
    }
    note.textContent = 'Click ' + clickCount + ': ' + kind;
    note.classList.add('is-on');
    clearTimeout(note._timer);
    note._timer = setTimeout(function () { note.classList.remove('is-on'); }, 1200);
  }

  function fireClickAds() {
    var cfg = config();
    var c = core();
    if (!cfg.enabled || !c) return;

    if (cfg.mock) {
      noteClick('popunder + smartlink + social bar');
      return;
    }

    if (cfg.popunder && cfg.popunder.scriptUrl) {
      c.loadScriptOnce(cfg.popunder.scriptUrl, cfg.popunder.marker || 'popunder');
    }
    if (cfg.socialBar && cfg.socialBar.scriptUrl) {
      c.loadScriptOnce(cfg.socialBar.scriptUrl, cfg.socialBar.marker || 'social-bar');
    }
    if (cfg.inPagePush && cfg.inPagePush.scriptUrl) {
      c.loadScriptOnce(cfg.inPagePush.scriptUrl, cfg.inPagePush.marker || 'in-page-push');
    }
    if (cfg.smartlink && cfg.smartlink.url) {
      window.open(cfg.smartlink.url, '_blank', 'noopener');
    }
  }

  function onClick(event) {
    var c = core();
    if (c && c.isProtectedTarget(event.target)) return;
    fireClickAds();
  }

  function initAutoPlacements() {
    if (!config().enabled || isExcluded()) return;
    wrapPage();
    mountExistingSlots();
    document.addEventListener('click', onClick, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoPlacements);
  } else {
    initAutoPlacements();
  }

  global.AdsterraPlacements = {
    mountExistingSlots: mountExistingSlots,
    init: initAutoPlacements,
    fireClickAds: fireClickAds
  };
})(window);
