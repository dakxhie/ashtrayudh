/**
 * Astrayudh — shared UI: navigation, theme, scroll animations.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initTheme() {
    document.body.classList.add('theme-active');

    if (document.querySelector('.theme-orbs')) return;

    var orbs = document.createElement('div');
    orbs.className = 'theme-orbs';
    orbs.setAttribute('aria-hidden', 'true');
    orbs.innerHTML = '<span></span><span></span><span></span>';
    document.body.insertBefore(orbs, document.body.firstChild);
  }

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
    if (prefersReducedMotion) return;
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

  function initAOS() {
    if (typeof window.AOS === 'undefined') return;

    window.AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      delay: 0,
      disable: prefersReducedMotion ? 'mobile' : false
    });
  }

  function initScrollReveal() {
    if (prefersReducedMotion) return;

    var targets = document.querySelectorAll(
      '.card, .content-card, .section-heading, .feature-box, .cta-box, ' +
      '.contact-box, .privacy-box, .blogs-controls, .chapter-link, .reader-card'
    );

    targets.forEach(function (el, index) {
      if (el.closest('[data-aos]') || el.hasAttribute('data-aos')) return;
      el.classList.add('reveal');
      if (index % 3 === 1) el.classList.add('reveal-delay-1');
      if (index % 3 === 2) el.classList.add('reveal-delay-2');
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('reveal--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initHeroParallax() {
    if (prefersReducedMotion) return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled > window.innerHeight) return;
      hero.style.backgroundPosition = 'center ' + (scrolled * 0.25) + 'px';
    }, { passive: true });
  }

  function initStaggerCards() {
    var grids = document.querySelectorAll('.cards, .premium-grid-layout, .loading-grid');
    grids.forEach(function (grid) {
      var items = grid.children;
      for (var i = 0; i < items.length; i++) {
        if (!prefersReducedMotion) {
          items[i].style.animationDelay = (i * 0.08) + 's';
        }
      }
    });
  }

  function init() {
    initTheme();
    initMobileMenu();
    initPageTransition();
    initNavbarScroll();
    initAOS();
    initScrollReveal();
    initHeroParallax();
    initStaggerCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
