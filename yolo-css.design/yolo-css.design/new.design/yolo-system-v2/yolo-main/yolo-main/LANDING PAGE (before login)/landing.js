(function initLandingPage() {
  'use strict';

  // 1. Intersection Observer for lightweight, performant scroll animations
  const setupScrollReveals = () => {
    // Respect user preferences for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const revealElements = document.querySelectorAll('.lp-reveal');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Disconnect observer after animation to save performance
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  };

  // 2. Sticky Navigation Logic
  const setupStickyNav = () => {
    const header = document.getElementById('lp-header');
    if (!header) return;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    let isScrolled = null;
    const handleScroll = () => {
      const scrolled = window.scrollY > 24;
      if (scrolled === isScrolled) return;

      isScrolled = scrolled;
      header.classList.toggle('lp-scrolled', scrolled);
      if (themeColor) themeColor.content = scrolled ? '#FFFFFF' : '#123B66';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  };

  // 3. Mobile Navigation Toggle
  const setupMobileNav = () => {
    const toggleBtn = document.getElementById('lp-mobile-toggle');
    const navMenu = document.getElementById('lp-nav-menu');
    
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('is-open', !isExpanded);
    });

    navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });

    document.addEventListener('click', event => {
      if (!navMenu.classList.contains('is-open') || event.target.closest('#lp-header')) return;
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !navMenu.classList.contains('is-open')) return;
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      toggleBtn.focus();
    });

    window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
      if (!event.matches) return;
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  };

  // Search is a frontend-only entry point to the login panel.
  const setupSearchForm = () => {
    const form = document.getElementById('lp-search-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.assign(form.action);
    });
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveals();
    setupStickyNav();
    setupMobileNav();
    setupSearchForm();
  });

})();