/**
 * AdsterraNativeBanner — reusable native banner component.
 */
(function (global) {
  'use strict';

  var core = global.AdsterraCore;
  var config = global.ADSTERRA_CONFIG || {};

  function mount(container) {
    if (!core || !container) return false;
    if (!config.enabled) return false;
    if (container.dataset.adsterraMounted === 'true') return true;

    var nativeCfg = config.native;
    var srcdoc = core.buildNativeSrcdoc(nativeCfg);
    if (!srcdoc) return false;

    container.classList.add('ad-slot--native');
    return core.renderIframe(container, srcdoc, '100%', 280, 'ad-slot__iframe--native');
  }

  function create(label) {
    if (!core) return null;
    var el = core.createContainer('ad-slot--native', label || 'Sponsored content');
    el.setAttribute('data-adsterra-native', 'true');
    if (!mount(el)) el.classList.add('ad-slot--failed');
    return el;
  }

  function unmount(container) {
    if (core) core.unmount(container);
  }

  global.AdsterraNativeBanner = { mount: mount, create: create, unmount: unmount };
})(window);
