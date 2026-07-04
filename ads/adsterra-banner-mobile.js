/**
 * AdsterraBannerMobile — 320×50 banner, mobile screens only.
 */
(function (global) {
  'use strict';

  var core = global.AdsterraCore;
  var config = global.ADSTERRA_CONFIG || {};

  function shouldRender() {
    return core && core.isMobile();
  }

  function mount(container) {
    if (!core || !container) return false;
    if (!config.enabled) return false;

    if (!shouldRender()) {
      container.classList.add('ad-slot--hidden-viewport');
      core.unmount(container);
      return false;
    }

    container.classList.remove('ad-slot--hidden-viewport');

    if (container.dataset.adsterraMounted === 'true') return true;

    var unit = config.bannerMobile320x50;
    var srcdoc = core.buildAtOptionsSrcdoc(unit);
    if (!srcdoc) return false;

    container.classList.add('ad-slot--mobile-320x50');
    return core.renderIframe(container, srcdoc, unit.width, unit.height, 'ad-slot__iframe--mobile');
  }

  function create(label) {
    if (!core) return null;
    var el = core.createContainer('ad-slot--mobile-320x50', label || 'Advertisement');
    el.setAttribute('data-adsterra-mobile', 'true');
    if (!mount(el)) {
      if (!shouldRender()) el.classList.add('ad-slot--hidden-viewport');
      else el.classList.add('ad-slot--failed');
    }
    return el;
  }

  function unmount(container) {
    if (core) core.unmount(container);
  }

  function initViewportWatcher() {
    if (!core) return;
    core.onViewportChange(function () {
      document.querySelectorAll('[data-adsterra-mobile]').forEach(function (el) {
        mount(el);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewportWatcher);
  } else {
    initViewportWatcher();
  }

  global.AdsterraBannerMobile = { mount: mount, create: create, unmount: unmount };
})(window);
