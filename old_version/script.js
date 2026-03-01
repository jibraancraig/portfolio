// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ============================================
// CYCLING HERO TITLES
// ============================================
const roles = document.querySelectorAll('.hero-role');
let currentRoleIndex = 0;
const ROLE_INTERVAL = 3000;

function cycleRoles() {
  const current = roles[currentRoleIndex];
  const nextIndex = (currentRoleIndex + 1) % roles.length;
  const next = roles[nextIndex];

  // Fade out current
  current.classList.remove('active');
  current.classList.add('exiting');

  // After fade-out, swap
  setTimeout(() => {
    current.classList.remove('exiting');
    next.classList.add('active');
    currentRoleIndex = nextIndex;
  }, 500);
}

setInterval(cycleRoles, ROLE_INTERVAL);

// ============================================
// DARK MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');

// Check for saved preference, default to light
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function addRevealClasses() {
  const revealTargets = [
    '.about-text',
    '.about-stats',
    '.timeline-item',
    '.project-card',
    '.skill-category',
    '.social-card',
    '.social-subtitle'
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });
}

function handleReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

addRevealClasses();
window.addEventListener('scroll', handleReveal);
window.addEventListener('load', handleReveal);

// ============================================
// COUNTER ANIMATION (About Stats)
// ============================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  counters.forEach(counter => {
    if (counter.dataset.animated) return;

    const rect = counter.getBoundingClientRect();
    if (rect.top > window.innerHeight - 60) return;

    counter.dataset.animated = 'true';
    const target = parseInt(counter.dataset.target, 10);
    const suffix = counter.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      counter.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ============================================
// ACTIVE NAV LINK HIGHLIGHT
// ============================================
function setActiveNavLink() {
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = document.querySelectorAll('.nav-links a');

  let currentSection = '';

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentSection = section.getAttribute('id');
    }
  });

  navAnchors.forEach(anchor => {
    anchor.classList.remove('active');
    if (anchor.getAttribute('href') === '#' + currentSection) {
      anchor.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

// ============================================
// SMOOTH SCROLL (fallback for older browsers)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});