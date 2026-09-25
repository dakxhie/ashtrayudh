/**
 * AdsterraSidebar160x600 — desktop sidebar banner (≥1024px only).
 */
(function (global) {
  'use strict';

  var core = global.AdsterraCore;
  var config = global.ADSTERRA_CONFIG || {};

  function shouldRender() {
    return core && core.isDesktopSidebar();
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

    var unit = config.sidebar160x600;
    if (!unit) return false;

    container.classList.add('ad-slot--sidebar-160x600');
    return core.renderUnit(container, unit, 'ad-slot__iframe--sidebar');
  }

  function create(label) {
    if (!core) return null;
    var el = core.createContainer('ad-slot--sidebar-160x600', label || 'Advertisement');
    el.setAttribute('data-adsterra-sidebar', 'true');
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
      document.querySelectorAll('[data-adsterra-sidebar]').forEach(function (el) {
        mount(el);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewportWatcher);
  } else {
    initViewportWatcher();
  }

  global.AdsterraSidebar160x600 = { mount: mount, create: create, unmount: unmount };
})(window);
