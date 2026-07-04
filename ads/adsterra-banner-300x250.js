/**
 * AdsterraBanner300x250 — reusable 300×250 iframe banner component.
 */
(function (global) {
  'use strict';

  var core = global.AdsterraCore;
  var config = global.ADSTERRA_CONFIG || {};

  function mount(container) {
    if (!core || !container) return false;
    if (!config.enabled) return false;
    if (container.dataset.adsterraMounted === 'true') return true;

    var unit = config.banner300x250;
    var srcdoc = core.buildAtOptionsSrcdoc(unit);
    if (!srcdoc) return false;

    container.classList.add('ad-slot--300x250');
    return core.renderIframe(container, srcdoc, unit.width, unit.height, 'ad-slot__iframe--300x250');
  }

  function create(label) {
    if (!core) return null;
    var el = core.createContainer('ad-slot--300x250', label || 'Advertisement');
    el.setAttribute('data-adsterra-300x250', 'true');
    if (!mount(el)) el.classList.add('ad-slot--failed');
    return el;
  }

  function unmount(container) {
    if (core) core.unmount(container);
  }

  global.AdsterraBanner300x250 = { mount: mount, create: create, unmount: unmount };
})(window);
