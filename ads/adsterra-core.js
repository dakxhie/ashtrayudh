/**
 * Adsterra core — script deduplication, iframe isolation, viewport helpers.
 */
(function (global) {
  'use strict';

  var config = global.ADSTERRA_CONFIG || {};
  var loadedScripts = Object.create(null);

  function createContainer(className, label) {
    var el = document.createElement('div');
    el.className = 'ad-slot ' + className;
    if (label) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'complementary');
    }
    return el;
  }

  function uniqueId(prefix) {
    return prefix + '-' + Math.random().toString(36).slice(2, 10);
  }

  function isMobile() {
    var max = (config.bannerMobile320x50 && config.bannerMobile320x50.maxWidth) || 767;
    return window.matchMedia('(max-width: ' + max + 'px)').matches;
  }

  function isDesktopSidebar() {
    var min = (config.sidebar160x600 && config.sidebar160x600.minWidth) || 1024;
    return window.matchMedia('(min-width: ' + min + 'px)').matches;
  }

  function loadScriptOnce(src, marker) {
    if (!src) return Promise.resolve(false);

    var attr = marker || src;
    if (loadedScripts[attr]) return loadedScripts[attr];

    var existing = document.querySelector('script[data-adsterra-script="' + attr + '"]');
    if (existing) {
      loadedScripts[attr] = Promise.resolve(true);
      return loadedScripts[attr];
    }

    loadedScripts[attr] = new Promise(function (resolve) {
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.setAttribute('data-adsterra-script', attr);
      script.onload = function () { resolve(true); };
      script.onerror = function () { resolve(false); };
      document.body.appendChild(script);
    });

    return loadedScripts[attr];
  }

  function buildAtOptionsSrcdoc(unit) {
    if (!unit || !unit.key) return null;

    var invokeUrl = unit.invokeUrl || (
      'https://www.highperformanceformat.com/' + unit.key + '/invoke.js'
    );

    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>' +
      '<script type="text/javascript">atOptions={' +
      "'key':'" + unit.key + "'," +
      "'format':'" + (unit.format || 'iframe') + "'," +
      "'height':" + unit.height + "," +
      "'width':" + unit.width + "," +
      "'params':{}}" +
      '<\/script>' +
      '<script type="text/javascript" src="' + invokeUrl + '"><\/script>' +
      '</body></html>'
    );
  }

  function buildNativeSrcdoc(nativeCfg) {
    if (!nativeCfg || !nativeCfg.invokeUrl) return null;

    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<style>html,body{margin:0;padding:0;background:transparent}</style></head><body>' +
      '<div id="' + nativeCfg.containerId + '"></div>' +
      '<script async="async" data-cfasync="false" src="' + nativeCfg.invokeUrl + '"><\/script>' +
      '</body></html>'
    );
  }

  function renderIframe(container, srcdoc, width, height, className) {
    if (!container || container.dataset.adsterraMounted === 'true' || !srcdoc) return false;

    var iframe = document.createElement('iframe');
    iframe.className = 'ad-slot__iframe ' + (className || '');
    iframe.title = 'Advertisement';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    iframe.srcdoc = srcdoc;
    iframe.width = String(width);
    iframe.height = String(height);
    iframe.style.border = '0';
    iframe.style.maxWidth = '100%';

    container.innerHTML = '';
    container.appendChild(iframe);
    container.dataset.adsterraMounted = 'true';
    return true;
  }

  function unmount(container) {
    if (!container) return;
    container.innerHTML = '';
    delete container.dataset.adsterraMounted;
  }

  function isProtectedTarget(target) {
    if (!target || !target.closest || !config.protectedSelectors) return true;
    return !!target.closest(config.protectedSelectors.join(', '));
  }

  function onViewportChange(callback) {
    var mqMobile = window.matchMedia('(max-width: ' + ((config.bannerMobile320x50 && config.bannerMobile320x50.maxWidth) || 767) + 'px)');
    var mqDesktop = window.matchMedia('(min-width: ' + ((config.sidebar160x600 && config.sidebar160x600.minWidth) || 1024) + 'px)');

    var handler = function () { callback(); };
    if (mqMobile.addEventListener) {
      mqMobile.addEventListener('change', handler);
      mqDesktop.addEventListener('change', handler);
    } else {
      mqMobile.addListener(handler);
      mqDesktop.addListener(handler);
    }
  }

  global.AdsterraCore = {
    config: config,
    createContainer: createContainer,
    uniqueId: uniqueId,
    isMobile: isMobile,
    isDesktopSidebar: isDesktopSidebar,
    loadScriptOnce: loadScriptOnce,
    buildAtOptionsSrcdoc: buildAtOptionsSrcdoc,
    buildNativeSrcdoc: buildNativeSrcdoc,
    renderIframe: renderIframe,
    unmount: unmount,
    isProtectedTarget: isProtectedTarget,
    onViewportChange: onViewportChange
  };
})(window);
