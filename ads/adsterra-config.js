/**
 * Adsterra configuration — Website ID: 5892372
 */
(function (global) {
  'use strict';

  global.ADSTERRA_CONFIG = {
    websiteId: '5892372',
    enabled: true,

    socialBar: {
      scriptUrl: 'https://pl30198537.effectivecpmnetwork.com/43/c1/0d/43c10dc0ee5b3f5e262bb76ae64cf917.js',
      marker: 'social-bar'
    },

    native: {
      invokeUrl: 'https://pl30198536.effectivecpmnetwork.com/963d8a6575bd07d7f74997868c9ca231/invoke.js',
      containerId: 'container-963d8a6575bd07d7f74997868c9ca231',
      unitKey: '963d8a6575bd07d7f74997868c9ca231'
    },

    banner300x250: {
      key: '2703d8383ae89caf0d2f6db88756e6d7',
      width: 300,
      height: 250,
      format: 'iframe',
      invokeUrl: 'https://www.highperformanceformat.com/2703d8383ae89caf0d2f6db88756e6d7/invoke.js'
    },

    bannerMobile320x50: {
      key: '240d8abc7c81c3c4c4cef61bbbbd98fb',
      width: 320,
      height: 50,
      format: 'iframe',
      invokeUrl: 'https://www.highperformanceformat.com/240d8abc7c81c3c4c4cef61bbbbd98fb/invoke.js',
      maxWidth: 767
    },

    sidebar160x600: {
      key: '73869054172a1e56c6298e9d8e934c7b',
      width: 160,
      height: 600,
      format: 'iframe',
      invokeUrl: 'https://www.highperformanceformat.com/73869054172a1e56c6298e9d8e934c7b/invoke.js',
      minWidth: 1024
    },

    interstitial: {
      maxPerPage: 2,
      cooldownMs: 90000,
      pageReadyDelayMs: 5000,
      secondAdMinTimeMs: 120000,
      sessionKey: 'astrayudh_adsterra_interstitial_count'
    },

    protectedSelectors: [
      'form', 'input', 'textarea', 'select', 'button[type="submit"]',
      '.contact-form', '.contact-box', '.hamburger', '.admin-panel',
      '[data-no-ad]', '.blogs-controls'
    ]
  };
})(window);
