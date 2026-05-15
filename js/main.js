/**
 * Karate Strassen Luxembourg – main.js
 * Handles: navbar scroll, hamburger menu, smooth scroll,
 *          IntersectionObserver fade-in, active nav link
 */

'use strict';

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const navbar     = document.getElementById('navbar');
const hamburger  = document.querySelector('.hamburger');
const navLinks   = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections   = document.querySelectorAll('section[id]');

/* ============================================================
   NAVBAR: scroll-triggered background change
   ============================================================ */
function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // Accessibility
  const expanded = hamburger.classList.contains('open');
  hamburger.setAttribute('aria-expanded', expanded);
  document.body.style.overflow = expanded ? 'hidden' : '';
});

// Close menu when a nav link is clicked
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   SMOOTH SCROLL for nav links
   ============================================================ */
allNavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   ACTIVE NAV LINK – highlight based on scroll position
   ============================================================ */
function setActiveLink() {
  const scrollPos = window.scrollY + navbar.offsetHeight + 40;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const id            = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

/* ============================================================
   FADE-IN ON SCROLL – IntersectionObserver
   ============================================================ */
const fadeObserverOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.12,
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // animate once
    }
  });
}, fadeObserverOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
  fadeObserver.observe(el);
});

/* ============================================================
   STAGGERED CARD ANIMATIONS
   Apply incremental transition delays to card grids
   ============================================================ */
function applyStaggerDelay(selector, delayStep = 100) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * delayStep}ms`;
  });
}

applyStaggerDelay('.value-card', 80);
applyStaggerDelay('.discipline-card', 100);
applyStaggerDelay('.instructor-card', 120);
applyStaggerDelay('.gallery-item', 60);

/* ============================================================
   STATS COUNTER ANIMATION
   Animate the hero stat numbers when visible
   ============================================================ */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const startVal = 0;

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = current + (el.dataset.suffix || '');
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + (el.dataset.suffix || '');
    }
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numberEl = entry.target;
      const target = parseInt(numberEl.dataset.target, 10);
      if (!isNaN(target)) {
        animateCounter(numberEl, target);
      }
      statsObserver.unobserve(numberEl);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  statsObserver.observe(el);
});

/* ============================================================
   SCROLL TO TOP button (created dynamically)
   ============================================================ */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTop';
scrollTopBtn.setAttribute('aria-label', 'Retour en haut');
scrollTopBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--red, #CC0000);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 4px 16px rgba(204,0,0,0.45);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 999;
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.transform = 'translateY(0)';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.transform = 'translateY(16px)';
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
