/**
 * Automatic Adsterra placements across public pages.
 */
(function (global) {
  'use strict';

  var EXCLUDED_PAGES = ['admin.html'];

  function currentPage() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function isExcluded() {
    return EXCLUDED_PAGES.indexOf(currentPage()) !== -1;
  }

  function insertBeforeFooter(el) {
    var footer = document.querySelector('.footer');
    if (footer && el) footer.parentNode.insertBefore(el, footer);
  }

  function insertAfterNavbar(el) {
    var navbar = document.querySelector('.navbar');
    if (navbar && el) navbar.parentNode.insertBefore(el, navbar.nextSibling);
  }

  function mountExistingSlots() {
    document.querySelectorAll('[data-adsterra-native]').forEach(function (el) {
      if (global.AdsterraNativeBanner) global.AdsterraNativeBanner.mount(el);
    });

    document.querySelectorAll('[data-adsterra-300x250]').forEach(function (el) {
      if (global.AdsterraBanner300x250) global.AdsterraBanner300x250.mount(el);
    });

    document.querySelectorAll('[data-adsterra-mobile]').forEach(function (el) {
      if (global.AdsterraBannerMobile) global.AdsterraBannerMobile.mount(el);
    });

    document.querySelectorAll('[data-adsterra-sidebar]').forEach(function (el) {
      if (global.AdsterraSidebar160x600) global.AdsterraSidebar160x600.mount(el);
    });
  }

  function initSidebarPlacement() {
    var panel = document.querySelector('.chapters-panel');
    if (!panel || panel.querySelector('[data-adsterra-sidebar]')) return;
    if (!global.AdsterraSidebar160x600) return;

    var slot = global.AdsterraSidebar160x600.create('Sidebar advertisement');
    if (slot) panel.appendChild(slot);
  }

  function initAutoPlacements() {
    if (!global.ADSTERRA_CONFIG || !global.ADSTERRA_CONFIG.enabled) return;
    if (isExcluded()) return;

    if (global.AdsterraBannerMobile) {
      var mobileSlot = global.AdsterraBannerMobile.create('Mobile advertisement');
      if (mobileSlot) insertAfterNavbar(mobileSlot);
    }

    if (global.AdsterraBanner300x250) {
      var footerSlot = global.AdsterraBanner300x250.create('Footer advertisement');
      if (footerSlot) insertBeforeFooter(footerSlot);
    }

    initSidebarPlacement();
    mountExistingSlots();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoPlacements);
  } else {
    initAutoPlacements();
  }

  global.AdsterraPlacements = {
    mountExistingSlots: mountExistingSlots,
    init: initAutoPlacements
  };
})(window);
