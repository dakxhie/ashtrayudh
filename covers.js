/**
 * Cover slots — image with SVG illustration fallback.
 */
(function (global) {
  'use strict';

  function mountIllustration(el) {
    if (!el || el.querySelector('.illus-svg')) return;
    var name = el.getAttribute('data-illustration');
    if (!name || !global.AstrayudhIllustrations) return;
    var svg = global.AstrayudhIllustrations.get(name);
    if (!svg) return;
    el.innerHTML = svg;
    el.classList.add('illus-mount', 'illus-mount--visible');
  }

  function showIllustration(slot) {
    if (!slot) return;
    slot.classList.add('cover-slot--illus');
    var illus = slot.querySelector('.cover-illus');
    if (illus) mountIllustration(illus);
  }

  function bindCoverSlot(slot) {
    if (!slot || slot.dataset.coverBound === 'true') return;
    slot.dataset.coverBound = 'true';

    if (slot.dataset.forceIllus === 'true') {
      showIllustration(slot);
      return;
    }

    var img = slot.querySelector('img[data-cover-img], img.cover-slot__img');
    if (!img) {
      showIllustration(slot);
      return;
    }

    img.addEventListener('error', function () {
      showIllustration(slot);
    });

    if (!img.getAttribute('src') || img.hasAttribute('hidden') || (img.complete && img.naturalWidth === 0)) {
      showIllustration(slot);
      return;
    }
  }

  function initCoverSlots(root) {
    var scope = root || document;
    scope.querySelectorAll('.cover-slot').forEach(bindCoverSlot);
  }

  global.AstrayudhCovers = {
    init: initCoverSlots,
    bind: bindCoverSlot,
    showIllustration: showIllustration,
    mountIllustration: mountIllustration
  };
})(window);
