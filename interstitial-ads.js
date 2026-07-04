/**
 * Astrayudh Interstitial Ad Manager
 * Monetag interstitial-only — max 2 per visit, interaction-gated, graceful fallback.
 */
(function () {
  'use strict';

  var CONFIG = {
    // Replace with a dedicated Monetag Interstitial zone ID from your dashboard for best results.
    ZONE_ID: 211579,
    SCRIPT_URL: 'https://quge5.com/88/tag.min.js',
    MAX_ADS_PER_VISIT: 2,
    COOLDOWN_MS: 90000,
    SECOND_AD_MIN_TIME_MS: 120000,
    PAGE_READY_DELAY_MS: 5000,
    ALLOWED_PAGES: ['blogs.html', 'blog-view.html'],
    SESSION_KEY: 'astrayudh_interstitial_count'
  };

  var pageLoadTime = Date.now();
  var meaningfulInteractions = 0;
  var lastAdTime = 0;
  var isShowingAd = false;
  var sdkLoaded = false;
  var pendingTrigger = false;

  function getAdsShown() {
    try {
      return parseInt(sessionStorage.getItem(CONFIG.SESSION_KEY) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function setAdsShown(count) {
    try {
      sessionStorage.setItem(CONFIG.SESSION_KEY, String(count));
    } catch (e) { /* ignore */ }
  }

  function isAllowedPage() {
    var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return CONFIG.ALLOWED_PAGES.indexOf(page) !== -1;
  }

  function isProtectedTarget(target) {
    if (!target || !target.closest) return true;

    var blocked = target.closest(
      'form, input, textarea, select, button[type="submit"], ' +
      '.contact-form, .contact-box, #searchInput, #sortSelect, ' +
      '#loadMoreBtn, .hamburger, .admin-panel, [data-no-ad]'
    );
    if (blocked) return true;

    if (target.closest('form')) return true;
    if (target.closest('a[href*="contact"]') && target.closest('.contact-form, .contact-box')) return true;

    return false;
  }

  function isMeaningfulTarget(target) {
    if (isProtectedTarget(target)) return false;
    return !!target.closest(
      'a.nav-links, .nav-links a, .hero-buttons a, .btn, .content-card, ' +
      '.card, .chapter-btn, .card-btn, .mobile-menu-link, .nav-btn, ' +
      '.cta-box a, .feature-box a, .footer-links a'
    );
  }

  function canShowAd() {
    if (!isAllowedPage()) return false;
    if (getAdsShown() >= CONFIG.MAX_ADS_PER_VISIT) return false;
    if (isShowingAd || pendingTrigger) return false;
    if (Date.now() - pageLoadTime < CONFIG.PAGE_READY_DELAY_MS) return false;
    if (lastAdTime && Date.now() - lastAdTime < CONFIG.COOLDOWN_MS) return false;
    return true;
  }

  function shouldShowFirstAd() {
    return meaningfulInteractions >= 1;
  }

  function shouldShowSecondAd() {
    var shown = getAdsShown();
    if (shown < 1) return false;
    var timeOnPage = Date.now() - pageLoadTime;
    return meaningfulInteractions >= 2 || timeOnPage >= CONFIG.SECOND_AD_MIN_TIME_MS;
  }

  function getShowFn() {
    var name = 'show_' + CONFIG.ZONE_ID;
    return typeof window[name] === 'function' ? window[name] : null;
  }

  function unregisterServiceWorkers() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      regs.forEach(function (reg) {
        reg.unregister();
      });
    }).catch(function () { /* ignore */ });
  }

  function loadSdk() {
    if (sdkLoaded) return Promise.resolve(true);

    return new Promise(function (resolve) {
      var existing = document.querySelector('script[data-astrayudh-interstitial]');
      if (existing) {
        sdkLoaded = true;
        resolve(!!getShowFn());
        return;
      }

      var script = document.createElement('script');
      script.src = CONFIG.SCRIPT_URL;
      script.async = true;
      script.setAttribute('data-zone', String(CONFIG.ZONE_ID));
      script.setAttribute('data-sdk', 'show_' + CONFIG.ZONE_ID);
      script.setAttribute('data-cfasync', 'false');
      script.setAttribute('data-astrayudh-interstitial', 'true');

      script.onload = function () {
        var attempts = 0;
        var timer = setInterval(function () {
          attempts += 1;
          if (getShowFn()) {
            clearInterval(timer);
            sdkLoaded = true;
            resolve(true);
          } else if (attempts >= 40) {
            clearInterval(timer);
            sdkLoaded = true;
            resolve(false);
          }
        }, 100);
      };

      script.onerror = function () {
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  function triggerInterstitial() {
    if (!canShowAd()) return;

    var shown = getAdsShown();
    if (shown === 0 && !shouldShowFirstAd()) return;
    if (shown === 1 && !shouldShowSecondAd()) return;

    pendingTrigger = true;

    loadSdk().then(function (ready) {
      pendingTrigger = false;
      if (!ready || !canShowAd()) return;

      var showFn = getShowFn();
      if (!showFn) return;

      isShowingAd = true;

      showFn({ type: 'preload' }).catch(function () { /* no inventory */ })
        .then(function () {
          return showFn({
            requestVar: 'astrayudh_interstitial_' + (getAdsShown() + 1)
          });
        })
        .catch(function () { /* graceful failure */ })
        .finally(function () {
          var next = getAdsShown() + 1;
          setAdsShown(next);
          lastAdTime = Date.now();
          isShowingAd = false;
        });
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
    if (meaningfulInteractions >= 1) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var ratio = window.scrollY / scrollable;
    if (ratio >= 0.45) {
      onMeaningfulInteraction();
    }
  }

  function init() {
    if (!isAllowedPage()) return;

    unregisterServiceWorkers();

    // Preload SDK after page is ready (not on initial load)
    setTimeout(function () {
      if (isAllowedPage()) loadSdk();
    }, CONFIG.PAGE_READY_DELAY_MS);

    document.addEventListener('click', onClick, { passive: true, capture: true });

    var scrollTimer;
    window.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(onScroll, 200);
    }, { passive: true });

    setInterval(function () {
      if (getAdsShown() === 1 && shouldShowSecondAd()) {
        triggerInterstitial();
      }
    }, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
