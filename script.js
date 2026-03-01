// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// ============================================
// NAV SCROLL
// ============================================
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ============================================
// CYCLING TITLES
// ============================================
const titles = document.querySelectorAll('.hero-title-item');
let currentTitle = 0;

setInterval(() => {
  const cur = titles[currentTitle];
  const next = titles[(currentTitle + 1) % titles.length];

  cur.classList.remove('active');
  cur.classList.add('exiting');

  setTimeout(() => {
    cur.classList.remove('exiting');
    next.classList.add('active');
    currentTitle = (currentTitle + 1) % titles.length;
  }, 450);
}, 3000);

// ============================================
// THEME TOGGLE
// ============================================
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');

if (saved === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

toggle.addEventListener('click', () => {
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
// SCROLL REVEAL
// ============================================
const revealSelectors = [
  '.principle-card',
  '.project-card',
  '.about-body',
  '.about-stats',
  '.timeline-item',
  '.skill-group',
  '.connect-link',
  '.connect-sub'
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

function checkReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });

  // Timeline markers become hollow (visible) on scroll
  document.querySelectorAll('.timeline-item').forEach(item => {
    if (item.getBoundingClientRect().top < window.innerHeight - 80) {
      item.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(counter => {
    if (counter.dataset.animated) return;
    if (counter.getBoundingClientRect().top > window.innerHeight - 60) return;

    counter.dataset.animated = 'true';
    const target = parseInt(counter.dataset.target, 10);
    const suffix = counter.dataset.suffix || '';
    const start = performance.now();
    const duration = 1600;

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      counter.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else counter.textContent = target + suffix;
    }

    requestAnimationFrame(tick);
  });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});