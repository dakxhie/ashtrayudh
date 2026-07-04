/**
 * Astrayudh Interstitial Ad Manager — BLOG PAGES ONLY
 * Max 2 interstitials per visit, interaction-gated, graceful fallback.
 */
(function () {
  'use strict';

  var CONFIG = {
    ZONE_ID: 211579,
    SCRIPT_URL: 'https://quge5.com/88/tag.min.js',
    MAX_ADS_PER_VISIT: 2,
    COOLDOWN_MS: 90000,
    SECOND_AD_MIN_TIME_MS: 120000,
    PAGE_READY_DELAY_MS: 5000,
    ALLOWED_PAGES: ['blogs.html', 'blog-view.html'],
    SESSION_KEY: 'astrayudh_blog_interstitial_count'
  };

  var pageLoadTime = Date.now();
  var meaningfulInteractions = 0;
  var lastAdTime = 0;
  var isShowingAd = false;
  var pendingTrigger = false;
  var sdkLoaded = false;

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

    return !!target.closest(
      'form, input, textarea, select, button[type="submit"], ' +
      '.contact-form, .contact-box, #searchInput, #sortSelect, ' +
      '#loadMoreBtn, .hamburger, .admin-panel, [data-no-ad], .blogs-controls'
    );
  }

  function isMeaningfulTarget(target) {
    if (isProtectedTarget(target)) return false;
    return !!target.closest(
      '.content-card, .card-btn, .blog-text, .reader-content, ' +
      '.hero-buttons a, .btn.primary, .breadcrumbs a, .footer-links a, ' +
      '.mobile-menu-link, .nav-links a'
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

  function loadSdk() {
    if (sdkLoaded) return Promise.resolve(!!getShowFn());

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
            type: 'end',
            requestVar: 'astrayudh_blog_interstitial_' + (getAdsShown() + 1)
          });
        })
        .catch(function () {
          return showFn({
            requestVar: 'astrayudh_blog_interstitial_' + (getAdsShown() + 1)
          });
        })
        .catch(function () { /* graceful failure */ })
        .finally(function () {
          setAdsShown(getAdsShown() + 1);
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
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var ratio = window.scrollY / scrollable;

    if (meaningfulInteractions === 0 && ratio >= 0.4) {
      onMeaningfulInteraction();
      return;
    }

    if (meaningfulInteractions === 1 && ratio >= 0.75 && shouldShowSecondAd()) {
      triggerInterstitial();
    }
  }

  function init() {
    if (!isAllowedPage()) return;

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
