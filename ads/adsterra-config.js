/**
 * Adsterra configuration — Website ID: 5892372
 * Live unit IDs from the publisher dashboard.
 */
(function (global) {
  'use strict';

  function banner(key, width, height, label) {
    return {
      key: key,
      label: label,
      width: width,
      height: height,
      format: 'iframe',
      invokeUrl: 'https://www.highrevenueformat.com/' + key + '/invoke.js'
    };
  }

  global.ADSTERRA_CONFIG = {
    websiteId: '5892372',
    enabled: true,
    mock: false,

    socialBar: {
      key: '43c10dc0ee5b3f5e262bb76ae64cf917',
      label: 'Social bar',
      scriptUrl: 'https://pl30198537.profitableratecpmnetwork.com/43/c1/0d/43c10dc0ee5b3f5e262bb76ae64cf917.js',
      marker: 'social-bar'
    },

    popunder: {
      key: '477950f7b422cb8710aa37215cd5eb70',
      label: 'Popunder',
      scriptUrl: 'https://pl31498551.profitableratecpmnetwork.com/47/79/50/477950f7b422cb8710aa37215cd5eb70.js',
      marker: 'popunder'
    },

    smartlink: {
      key: '4c19dfa0536db063182a9ec2bd2d4f7e',
      label: 'Smartlink',
      url: 'https://www.profitableratecpmnetwork.com/eygxr812?key=4c19dfa0536db063182a9ec2bd2d4f7e'
    },

    native: {
      invokeUrl: 'https://pl30198536.profitableratecpmnetwork.com/963d8a6575bd07d7f74997868c9ca231/invoke.js',
      containerId: 'container-963d8a6575bd07d7f74997868c9ca231',
      unitKey: '963d8a6575bd07d7f74997868c9ca231',
      label: 'Native banner',
      width: '100%',
      height: 250
    },

    banners: {
      leaderboard728x90: banner('91e1cb355fe5a1776b744f8a54881847', 728, 90, 'Leaderboard'),
      banner468x60: banner('d94c336e7dd87dc916382fcda1c4cd35', 468, 60, 'Banner'),
      medium300x250: banner('2703d8383ae89caf0d2f6db88756e6d7', 300, 250, 'Medium rectangle'),
      skyscraper160x600: banner('73869054172a1e56c6298e9d8e934c7b', 160, 600, 'Wide skyscraper'),
      vertical160x300: banner('bf4c2af390bccb6c65aca33baf3d84f6', 160, 300, 'Vertical banner'),
      mobile320x50: banner('240d8abc7c81c3c4c4cef61bbbbd98fb', 320, 50, 'Mobile banner')
    },

    interstitial: {
      everyClick: true,
      sessionKey: 'astrayudh_adsterra_interstitial_count'
    },

    protectedSelectors: [
      'form', 'input', 'textarea', 'select', 'button[type="submit"]',
      '.contact-form', '.contact-box', '.hamburger', '.admin-panel',
      '[data-no-ad]', '.blogs-controls'
    ]
  };

  var banners = global.ADSTERRA_CONFIG.banners;
  global.ADSTERRA_CONFIG.banner300x250 = banners.medium300x250;
  global.ADSTERRA_CONFIG.bannerMobile320x50 = banners.mobile320x50;
  global.ADSTERRA_CONFIG.bannerMobile320x50.maxWidth = 767;
  global.ADSTERRA_CONFIG.sidebar160x600 = banners.skyscraper160x600;
  global.ADSTERRA_CONFIG.sidebar160x600.minWidth = 1024;
})(window);
