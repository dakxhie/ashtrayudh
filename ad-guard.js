/**
 * Sitewide ad guard — blocks non-interstitial formats everywhere.
 * Interstitial ads load ONLY via interstitial-ads.js on blog pages.
 */
(function () {
  'use strict';

  var BLOG_PAGES = ['blogs.html', 'blog-view.html'];
  var BLOCKED_SCRIPT_PATTERNS = [
    /quge5\.com/i,
    /3nbf4\.com/i,
    /monetag/i,
    /propellerads/i,
    /adsbygoogle/i,
    /googlesyndication/i
  ];

  function currentPage() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function isBlogPage() {
    return BLOG_PAGES.indexOf(currentPage()) !== -1;
  }

  function isAllowedAdScript(script) {
    if (script.getAttribute('data-astrayudh-interstitial') === 'true') return true;
    if (script.src && script.src.indexOf('interstitial-ads.js') !== -1) return true;
    return false;
  }

  function removeBlockedScripts() {
    var scripts = document.querySelectorAll('script[src]');
    scripts.forEach(function (script) {
      if (isAllowedAdScript(script)) return;
      var src = script.getAttribute('src') || '';
      var blocked = BLOCKED_SCRIPT_PATTERNS.some(function (pattern) {
        return pattern.test(src);
      });
      if (blocked) {
        script.parentNode.removeChild(script);
      }
    });
  }

  function unregisterServiceWorkers() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      regs.forEach(function (reg) {
        reg.unregister();
      });
    }).catch(function () { /* ignore */ });
  }

  function blockStrayAdIframes() {
    if (isBlogPage()) return;
    var frames = document.querySelectorAll('iframe[src*="quge5"], iframe[src*="monetag"], iframe[src*="3nbf4"]');
    frames.forEach(function (frame) {
      frame.remove();
    });
  }

  function init() {
    unregisterServiceWorkers();
    removeBlockedScripts();
    blockStrayAdIframes();

    if (!isBlogPage()) {
      document.documentElement.setAttribute('data-no-ads', 'true');
    }

    var observer = new MutationObserver(function () {
      removeBlockedScripts();
      blockStrayAdIframes();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
