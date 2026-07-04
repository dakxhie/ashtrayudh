/**
 * Shared UI behaviors — mobile navigation and page transitions.
 */
(function () {
  'use strict';

  function initMobileMenu() {
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!hamburgerBtn || !mobileMenu) return;

    var menuLinks = document.querySelectorAll('.mobile-menu-link, .mobile-menu-cta');

    hamburgerBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open', mobileMenu.classList.contains('active'));
    });

    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.navbar')) {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  function initPageTransition() {
    document.body.classList.add('page-enter');
  }

  function initNavbarScroll() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var onScroll = function () {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 16);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function init() {
    initMobileMenu();
    initPageTransition();
    initNavbarScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
