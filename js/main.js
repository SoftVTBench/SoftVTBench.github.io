/**
 * SoftTacWorld — Vanilla JS (Premium)
 * Handles: nav toggle, scroll effects, active section highlight,
 * scroll reveal with stagger, back-to-top, leaderboard tabs
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-active');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked (mobile)
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // --- Navbar scroll effect ---
  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('is-scrolled', currentScroll > scrollThreshold);
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Active nav highlighting via IntersectionObserver ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  });

  sections.forEach(section => navObserver.observe(section));

  // --- Scroll reveal with stagger ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -6% 0px',
    threshold: 0.05
  });

  reveals.forEach(el => revealObserver.observe(el));

  // --- Back to top button ---
  const backBtn = document.getElementById('back-to-top');

  const backTopObserver = new IntersectionObserver((entries) => {
    // When the hero is NOT intersecting, show the button
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        backBtn.classList.add('is-visible');
      } else {
        backBtn.classList.remove('is-visible');
      }
    });
  }, { threshold: 0 });

  const heroSection = document.getElementById('top');
  if (heroSection) backTopObserver.observe(heroSection);

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Leaderboard tabs ---
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Future: filter table rows by data-tab attribute
    });
  });

  // --- Smooth hover tilt for cards (subtle, desktop only) ---
  if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    const cards = document.querySelectorAll('.task-card, .stat-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -2;
        const rotateY = ((x - centerX) / centerX) * 2;
        card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

});
