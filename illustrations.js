/**
 * Astrayudh — inline SVG illustrations (neumorphic line art).
 */
(function (global) {
  'use strict';

  var accent = '#c04d62';
  var accentSoft = 'rgba(192, 77, 98, 0.25)';
  var stroke = '#eceef3';
  var muted = '#8b92a3';

  var ILLUSTRATIONS = {
    studio: '<svg class="illus-svg illus-svg--hero" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect class="illus-draw" x="48" y="72" width="224" height="148" rx="22" stroke="' + stroke + '" stroke-width="2.2" fill="' + accentSoft + '"/>' +
      '<rect class="illus-draw illus-draw--d1" x="68" y="92" width="184" height="18" rx="9" stroke="' + muted + '" stroke-width="1.6" fill="rgba(255,255,255,0.04)"/>' +
      '<circle class="illus-orbit illus-orbit--1" cx="92" cy="101" r="5" fill="' + accent + '"/>' +
      '<circle class="illus-orbit illus-orbit--2" cx="108" cy="101" r="5" fill="' + muted + '"/>' +
      '<circle class="illus-orbit illus-orbit--3" cx="124" cy="101" r="5" fill="' + muted + '"/>' +
      '<path class="illus-draw illus-draw--d2" d="M88 148h144M88 172h96M88 196h120" stroke="' + muted + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path class="illus-float illus-float--1" d="M248 56l14 14-14 14" stroke="' + accent + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="illus-float illus-float--2" d="M56 48c8-10 22-10 30 0" stroke="' + accent + '" stroke-width="2" stroke-linecap="round" opacity="0.7"/>' +
      '<circle class="illus-spark illus-spark--1" cx="270" cy="88" r="4" fill="' + accent + '"/>' +
      '<circle class="illus-spark illus-spark--2" cx="42" cy="118" r="3" fill="' + accent + '" opacity="0.6"/>' +
      '<path class="illus-draw illus-draw--d3" d="M210 210l28 28" stroke="' + stroke + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path class="illus-draw illus-draw--d3" d="M224 224l14-14" stroke="' + accent + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '</svg>',

    apps: '<svg class="illus-svg illus-svg--hero" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect class="illus-draw" x="108" y="36" width="104" height="208" rx="24" stroke="' + stroke + '" stroke-width="2.4" fill="' + accentSoft + '"/>' +
      '<rect class="illus-draw illus-draw--d1" x="124" y="56" width="72" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>' +
      '<rect class="illus-draw illus-draw--d2" x="124" y="88" width="72" height="48" rx="12" stroke="' + muted + '" stroke-width="1.8" fill="rgba(255,255,255,0.03)"/>' +
      '<rect class="illus-draw illus-draw--d2" x="124" y="148" width="34" height="34" rx="10" stroke="' + muted + '" stroke-width="1.6" fill="rgba(255,255,255,0.03)"/>' +
      '<rect class="illus-draw illus-draw--d3" x="162" y="148" width="34" height="34" rx="10" stroke="' + muted + '" stroke-width="1.6" fill="rgba(255,255,255,0.03)"/>' +
      '<circle class="illus-orbit illus-orbit--1" cx="160" cy="218" r="8" stroke="' + accent + '" stroke-width="2" fill="none"/>' +
      '<path class="illus-float illus-float--1" d="M72 120h24M72 136h16" stroke="' + accent + '" stroke-width="2" stroke-linecap="round" opacity="0.55"/>' +
      '<path class="illus-float illus-float--2" d="M224 120h24M232 136h16" stroke="' + accent + '" stroke-width="2" stroke-linecap="round" opacity="0.55"/>' +
      '</svg>',

    blogs: '<svg class="illus-svg illus-svg--hero" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path class="illus-draw" d="M88 56h144a12 12 0 0 1 12 12v144a12 12 0 0 1-12 12H88V56z" stroke="' + stroke + '" stroke-width="2.2" fill="' + accentSoft + '"/>' +
      '<path class="illus-draw illus-draw--d1" d="M88 56v168" stroke="' + accent + '" stroke-width="2.2"/>' +
      '<path class="illus-draw illus-draw--d2" d="M112 96h96M112 120h88M112 144h72M112 168h96" stroke="' + muted + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path class="illus-float illus-float--1" d="M228 72l28-20v148l-28-20" stroke="' + stroke + '" stroke-width="2" stroke-linejoin="round" fill="rgba(255,255,255,0.04)"/>' +
      '<circle class="illus-spark illus-spark--1" cx="64" cy="88" r="4" fill="' + accent + '"/>' +
      '<circle class="illus-spark illus-spark--2" cx="256" cy="200" r="3" fill="' + accent + '" opacity="0.65"/>' +
      '</svg>',

    stories: '<svg class="illus-svg illus-svg--hero" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect class="illus-draw" x="56" y="64" width="56" height="152" rx="10" stroke="' + stroke + '" stroke-width="2" fill="' + accentSoft + '"/>' +
      '<rect class="illus-draw illus-draw--d1" x="132" y="48" width="56" height="168" rx="10" stroke="' + stroke + '" stroke-width="2.2" fill="rgba(192,77,98,0.18)"/>' +
      '<rect class="illus-draw illus-draw--d2" x="208" y="80" width="56" height="136" rx="10" stroke="' + stroke + '" stroke-width="2" fill="' + accentSoft + '"/>' +
      '<path class="illus-draw illus-draw--d3" d="M148 88h24M148 108h24M148 128h24" stroke="' + muted + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path class="illus-float illus-float--1" d="M72 96h24M72 116h24M72 136h24" stroke="' + muted + '" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>' +
      '<path class="illus-float illus-float--2" d="M224 108h24M224 128h24" stroke="' + muted + '" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>' +
      '<circle class="illus-spark illus-spark--1" cx="160" cy="236" r="5" fill="' + accent + '"/>' +
      '</svg>',

    contact: '<svg class="illus-svg illus-svg--hero" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect class="illus-draw" x="56" y="88" width="208" height="128" rx="18" stroke="' + stroke + '" stroke-width="2.2" fill="' + accentSoft + '"/>' +
      '<path class="illus-draw illus-draw--d1" d="M56 104l104 72 104-72" stroke="' + accent + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path class="illus-float illus-float--1" d="M248 56l32 32-32 32" stroke="' + stroke + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="illus-float illus-float--2" d="M264 72H232" stroke="' + accent + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle class="illus-spark illus-spark--1" cx="88" cy="68" r="4" fill="' + accent + '"/>' +
      '<circle class="illus-spark illus-spark--2" cx="240" cy="228" r="3" fill="' + accent + '" opacity="0.6"/>' +
      '</svg>',

    about: '<svg class="illus-svg illus-svg--hero" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle class="illus-draw" cx="160" cy="140" r="72" stroke="' + stroke + '" stroke-width="2.2" fill="' + accentSoft + '"/>' +
      '<circle class="illus-draw illus-draw--d1" cx="160" cy="140" r="8" fill="' + accent + '"/>' +
      '<path class="illus-draw illus-draw--d2" d="M160 68v24M160 188v24M88 140h24M208 140h24" stroke="' + muted + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path class="illus-orbit illus-orbit--1" d="M160 88l32 52H128z" stroke="' + accent + '" stroke-width="1.8" fill="rgba(192,77,98,0.12)"/>' +
      '<circle class="illus-spark illus-spark--1" cx="236" cy="96" r="4" fill="' + accent + '"/>' +
      '<circle class="illus-spark illus-spark--2" cx="84" cy="196" r="3" fill="' + accent + '" opacity="0.65"/>' +
      '</svg>',

    vortix: '<svg class="illus-svg illus-svg--feature" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path class="illus-draw" d="M100 28L168 68v80L100 188 32 148V68z" stroke="' + stroke + '" stroke-width="2.2" fill="' + accentSoft + '"/>' +
      '<path class="illus-draw illus-draw--d1" d="M100 56l44 24v48l-44 24-44-24V80z" stroke="' + accent + '" stroke-width="2" fill="rgba(192,77,98,0.15)"/>' +
      '<circle class="illus-orbit illus-orbit--1" cx="100" cy="100" r="12" fill="' + accent + '"/>' +
      '</svg>',

    cta: '<svg class="illus-svg illus-svg--feature" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path class="illus-draw" d="M40 120c0-33 27-60 60-60s60 27 60 60" stroke="' + stroke + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path class="illus-draw illus-draw--d1" d="M100 60V40M72 68l-14-14M128 68l14-14" stroke="' + accent + '" stroke-width="2" stroke-linecap="round"/>' +
      '<rect class="illus-float illus-float--1" x="68" y="118" width="64" height="42" rx="12" stroke="' + stroke + '" stroke-width="2" fill="' + accentSoft + '"/>' +
      '<path class="illus-float illus-float--2" d="M88 139h24" stroke="' + accent + '" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>',

    empty: '<svg class="illus-svg illus-svg--empty" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="72" cy="72" r="36" stroke="' + muted + '" stroke-width="2.2" fill="' + accentSoft + '"/>' +
      '<path d="M96 96l28 28" stroke="' + accent + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M60 72h24M72 60v24" stroke="' + muted + '" stroke-width="2" stroke-linecap="round" opacity="0.5"/>' +
      '</svg>',

    'icon-apps': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="14" y="8" width="20" height="32" rx="5" stroke="' + stroke + '" stroke-width="1.8" fill="' + accentSoft + '"/><rect x="18" y="14" width="12" height="8" rx="2" fill="' + accent + '" opacity="0.5"/></svg>',
    'icon-blogs': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M14 10h20a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H14V10z" stroke="' + stroke + '" stroke-width="1.8" fill="' + accentSoft + '"/><path d="M14 10v28" stroke="' + accent + '" stroke-width="1.8"/><path d="M20 18h14M20 24h12M20 30h10" stroke="' + muted + '" stroke-width="1.5" stroke-linecap="round"/></svg>',
    'icon-stories': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="10" y="12" width="10" height="24" rx="2" stroke="' + stroke + '" stroke-width="1.6" fill="' + accentSoft + '"/><rect x="19" y="8" width="10" height="28" rx="2" stroke="' + stroke + '" stroke-width="1.8" fill="rgba(192,77,98,0.18)"/><rect x="28" y="14" width="10" height="22" rx="2" stroke="' + stroke + '" stroke-width="1.6" fill="' + accentSoft + '"/></svg>',
    'icon-design': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="14" stroke="' + stroke + '" stroke-width="1.8" fill="' + accentSoft + '"/><circle cx="19" cy="21" r="2" fill="' + accent + '"/><circle cx="27" cy="19" r="2" fill="' + muted + '"/><circle cx="26" cy="28" r="2" fill="' + muted + '"/></svg>',
    'icon-story': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M12 12h24v24H12z" stroke="' + stroke + '" stroke-width="1.8" fill="' + accentSoft + '"/><path d="M18 20h12M18 26h8" stroke="' + muted + '" stroke-width="1.5" stroke-linecap="round"/></svg>',
    'icon-tech': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="10" y="14" width="28" height="20" rx="4" stroke="' + stroke + '" stroke-width="1.8" fill="' + accentSoft + '"/><path d="M16 34h16" stroke="' + accent + '" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'icon-calm': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M10 28c6-8 22-8 28 0" stroke="' + stroke + '" stroke-width="1.8" stroke-linecap="round"/><circle cx="24" cy="20" r="8" stroke="' + accent + '" stroke-width="1.8" fill="' + accentSoft + '"/></svg>',
    'icon-creativity': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 8l4 10 10 2-7 7 2 10-9-5-9 5 2-10-7-7 10-2z" stroke="' + accent + '" stroke-width="1.6" fill="' + accentSoft + '"/></svg>',
    'icon-simplicity': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="12" y="12" width="24" height="24" rx="6" stroke="' + stroke + '" stroke-width="1.8" fill="' + accentSoft + '"/><path d="M18 24h12" stroke="' + accent + '" stroke-width="2" stroke-linecap="round"/></svg>',
    'icon-minimal': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="14" y="14" width="20" height="20" rx="4" stroke="' + stroke + '" stroke-width="1.8"/><path d="M18 24h12" stroke="' + accent + '" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'icon-fast': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M10 28h20l-4 10 18-22H24l4-10" stroke="' + accent + '" stroke-width="1.8" stroke-linejoin="round" fill="' + accentSoft + '"/></svg>',
    'icon-premium': '<svg class="illus-svg illus-svg--icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 8l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z" stroke="' + stroke + '" stroke-width="1.6" fill="' + accentSoft + '"/></svg>'
  };

  function mountIllustration(el) {
    var name = el.getAttribute('data-illustration');
    if (!name || !ILLUSTRATIONS[name]) return;
    if (el.querySelector('.illus-svg')) return;

    el.innerHTML = ILLUSTRATIONS[name];
    el.classList.add('illus-mount');

    requestAnimationFrame(function () {
      el.classList.add('illus-mount--visible');
    });
  }

  function initIllustrations(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-illustration]').forEach(mountIllustration);
  }

  function emptyStateMarkup(message) {
    return (
      '<div class="empty-state-art" data-illustration="empty"></div>' +
      '<p>' + message + '</p>'
    );
  }

  global.AstrayudhIllustrations = {
    init: initIllustrations,
    mount: mountIllustration,
    emptyStateMarkup: emptyStateMarkup,
    get: function (name) { return ILLUSTRATIONS[name] || ''; }
  };
})(window);
