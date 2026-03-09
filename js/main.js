/* ============================================================
   DULE ABERA PORTFOLIO — main.js
   Clean, bug-free JavaScript with no CSS conflicts
   ============================================================ */

'use strict';

// ── LOADING SCREEN ──────────────────────────────────────────
window.addEventListener('load', () => {
    const screen = document.getElementById('loadingScreen');
    if (screen) {
        setTimeout(() => screen.classList.add('hidden'), 600);
    }
});

// ── THEME TOGGLE ────────────────────────────────────────────
(function initTheme() {
    const html = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (dark) => {
        html.setAttribute('data-theme', dark ? 'dark' : 'light');
        if (icon) {
            icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    };

    // Initialise from storage or system preference
    const isDark = stored ? stored === 'dark' : prefersDark;
    applyTheme(isDark);

    if (toggle) {
        toggle.addEventListener('click', () => {
            const currentlyDark = html.getAttribute('data-theme') === 'dark';
            applyTheme(!currentlyDark);
        });
    }
})();

// ── NAVBAR — SCROLL & ACTIVE LINK ───────────────────────────
(function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Scroll: add .scrolled class (CSS handles the visual change — no inline style)
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // Active nav link via IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('active', isActive);
                    if (isActive) {
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -75% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));
})();

// ── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = document.querySelector('.navbar')?.offsetHeight ?? 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ── MOBILE HAMBURGER ─────────────────────────────────────────
(function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    const toggle = (open) => {
        hamburger.classList.toggle('open', open);
        mobileNav.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
        toggle(!hamburger.classList.contains('open'));
    });

    // Close when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggle(false));
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggle(false);
    });
})();

// ── STAGGERED FADE-IN ────────────────────────────────────────
(function initFadeIn() {
    const fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return;

    // Assign --i index per parent group for sequential stagger
    fadeEls.forEach((el) => {
        // If --i already set via inline style (HTML), respect it.
        // Otherwise, assign based on DOM order within parent.
        if (!el.style.getPropertyValue('--i')) {
            const siblings = el.parentElement
                ? [...el.parentElement.querySelectorAll('.fade-in')]
                : [];
            el.style.setProperty('--i', siblings.indexOf(el));
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // animate once
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    fadeEls.forEach(el => observer.observe(el));
})();

// ── PROJECT FILTERING ────────────────────────────────────────
(function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allCards = document.querySelectorAll('.project-card');
    const featuredWrap = document.getElementById('featuredProjects');
    const gridWrap = document.getElementById('projectsGrid');

    if (!filterBtns.length || !allCards.length) return;

    let activeFilter = 'all';

    const filterCards = (category) => {
        activeFilter = category;

        allCards.forEach(card => {
            const cat = card.getAttribute('data-category') || '';
            const isVisible = category === 'all' || cat === category;
            card.classList.toggle('hidden-card', !isVisible);
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCards(btn.getAttribute('data-filter') || 'all');
        });
    });
})();

// ── LAZY IMAGE LOADING ───────────────────────────────────────
(function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('lazy');
                }
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '200px 0px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
})();

// ── PERFORMANCE LOG ──────────────────────────────────────────
if ('performance' in window) {
    window.addEventListener('load', () => {
        const t = performance.timing;
        console.log(`Page load: ${t.loadEventEnd - t.navigationStart}ms`);
    });
}