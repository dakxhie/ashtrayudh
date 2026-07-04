/**
 * AdsterraInterstitial — Social Bar (single script, interaction-gated).
 */
(function (global) {
  'use strict';

  var config = global.ADSTERRA_CONFIG || {};
  var interstitialCfg = config.interstitial || {};
  var core = global.AdsterraCore;

  var pageLoadTime = Date.now();
  var meaningfulInteractions = 0;
  var lastAdTime = 0;
  var isLoading = false;
  var pendingTrigger = false;
  var scriptLoaded = false;

  function getAdsShown() {
    try {
      return parseInt(sessionStorage.getItem(interstitialCfg.sessionKey) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function setAdsShown(count) {
    try {
      sessionStorage.setItem(interstitialCfg.sessionKey, String(count));
    } catch (e) { /* ignore */ }
  }

  function isMeaningfulTarget(target) {
    if (!core || core.isProtectedTarget(target)) return false;
    return !!target.closest(
      '.content-card, .card-btn, .blog-text, .reader-content, .chapter-text, ' +
      '.hero-buttons a, .btn.primary, .breadcrumbs a, .footer-links a, ' +
      '.mobile-menu-link, .nav-links a, .card, .chapter-link'
    );
  }

  function canShow() {
    if (!config.enabled) return false;
    if (getAdsShown() >= (interstitialCfg.maxPerPage || 2)) return false;
    if (isLoading || pendingTrigger) return false;
    if (Date.now() - pageLoadTime < (interstitialCfg.pageReadyDelayMs || 5000)) return false;
    if (lastAdTime && Date.now() - lastAdTime < (interstitialCfg.cooldownMs || 90000)) return false;
    return true;
  }

  function shouldShowFirst() {
    return meaningfulInteractions >= 1;
  }

  function shouldShowSecond() {
    if (getAdsShown() < 1) return false;
    var timeOnPage = Date.now() - pageLoadTime;
    return meaningfulInteractions >= 2 || timeOnPage >= (interstitialCfg.secondAdMinTimeMs || 120000);
  }

  function loadSocialBarOnce() {
    if (scriptLoaded) return Promise.resolve(true);

    var unit = config.socialBar;
    if (!unit || !unit.scriptUrl || !core) return Promise.resolve(false);

    return core.loadScriptOnce(unit.scriptUrl, unit.marker || 'social-bar').then(function (ok) {
      if (ok) scriptLoaded = true;
      return ok;
    });
  }

  function triggerInterstitial() {
    if (!canShow()) return;

    var shown = getAdsShown();
    if (shown === 0 && !shouldShowFirst()) return;
    if (shown === 1 && !shouldShowSecond()) return;

    pendingTrigger = true;
    isLoading = true;

    loadSocialBarOnce().then(function (ready) {
      pendingTrigger = false;
      isLoading = false;
      if (!ready) return;

      setAdsShown(getAdsShown() + 1);
      lastAdTime = Date.now();
    });
  }

  function onMeaningfulInteraction() {
    meaningfulInteractions += 1;
    triggerInterstitial();
  }

  function onClick(event) {
    if (!isMeaningfulTarget(event.target)) return;
    onMeaningfulInteraction();
  }

  function onScroll() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var ratio = window.scrollY / scrollable;

    if (meaningfulInteractions === 0 && ratio >= 0.4) {
      onMeaningfulInteraction();
      return;
    }

    if (meaningfulInteractions >= 1 && ratio >= 0.75 && shouldShowSecond()) {
      triggerInterstitial();
    }
  }

  function init() {
    if (!config.enabled) return;

    document.addEventListener('click', onClick, { passive: true, capture: true });

    var scrollTimer;
    window.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(onScroll, 200);
    }, { passive: true });

    setInterval(function () {
      if (getAdsShown() === 1 && shouldShowSecond()) {
        triggerInterstitial();
      }
    }, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.AdsterraInterstitial = { trigger: triggerInterstitial, init: init };
})(window);
