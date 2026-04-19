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
// ASCII WHIRLPOOL (HERO BANNER)
// ============================================
(function initWhirlpool() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  // Ticker tape — streamed along each spiral arm into the City.
  // Mix of LSE / US tickers, FX, commodities, rates, and IB shorthand.
  const tape = (
    '  £AAPL 245.12 +1.20%  ' +
    '  GS 389.40 -0.85%  ' +
    '  JPM 198.55 +0.42%  ' +
    '  MS 94.18 +0.33%  ' +
    '  BARC 312.08 +0.15%  ' +
    '  HSBA 685.50 -0.05%  ' +
    '  LLOY 52.34 +0.31%  ' +
    '  NWG 298.70 +0.22%  ' +
    '  PRU 820.40 -0.10%  ' +
    '  BP 478.20 +0.68%  ' +
    '  SHEL 2654.5 +0.44%  ' +
    '  AZN 10820 -0.22%  ' +
    '  ULVR 3942 +0.08%  ' +
    '  VOD 71.08 -0.12%  ' +
    '  FTSE100 7812.44 +0.22%  ' +
    '  FTSE250 19340.8 -0.18%  ' +
    '  SPX 5240.15 +0.38%  ' +
    '  NDX 18245.9 +0.71%  ' +
    '  DJI 39210 -0.04%  ' +
    '  STOXX50 4985.2 +0.19%  ' +
    '  GILT10Y 4.25%  ' +
    '  UST10Y 4.18%  ' +
    '  BUND10Y 2.35%  ' +
    '  SONIA 5.19%  ' +
    '  SOFR 5.31%  ' +
    '  GBPUSD 1.2685  ' +
    '  EURUSD 1.0845  ' +
    '  GBPEUR 1.1698  ' +
    '  USDJPY 151.22  ' +
    '  XAU 2345.50 +0.90%  ' +
    '  XAG 28.72 +1.15%  ' +
    '  BRENT 86.30 -0.40%  ' +
    '  WTI 82.45 -0.55%  ' +
    '  :: DCF :: NPV :: IRR :: WACC :: EBITDA :: M&A :: IPO :: LBO :: BPS :: EPS :: P/E :: '
  );
  const tapeLen = tape.length;

  // Cell metrics (in CSS pixels)
  const CELL_W = 7;   // approx width of monospace char at 11px
  const CELL_H = 11;

  let width = 0, height = 0, cols = 0, rows = 0, dpr = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / CELL_W) + 1;
    rows = Math.ceil(height / CELL_H) + 1;
    ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textBaseline = 'top';
  }

  resize();
  window.addEventListener('resize', resize);

  const start = performance.now();

  function frame(now) {
    const t = (now - start) * 0.001;

    // Background
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, width, height);

    // Centre of the whirlpool — slightly above middle for visual weight
    const cxPx = width * 0.5;
    const cyPx = height * 0.48;

    // Convert to grid-cell centre units, then normalise by a stable radius
    const maxR = Math.hypot(width, height) * 0.55;

    // Spiral parameters
    const ARMS = 5;                           // number of ticker-tape arms
    const CURL = 3.1;                         // spiral tightness (higher = tighter)
    const SECTOR = (Math.PI * 2) / ARMS;      // angular width of one sector
    const ARM_HALF = SECTOR * 0.38;           // how wide an arm "reads"

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * CELL_W + CELL_W * 0.5;
        const py = row * CELL_H + CELL_H * 0.5;

        const dx = px - cxPx;
        const dy = py - cyPx;
        const r = Math.hypot(dx, dy);
        const theta = Math.atan2(dy, dx);

        const rn = r / maxR + 0.02;
        const logR = Math.log(rn + 0.05);

        // Along a log-spiral arm, (theta - CURL*logR) is constant.
        // Snap to the nearest arm and measure angular distance to it.
        const shifted = theta - CURL * logR;
        const armIdx = Math.round(shifted / SECTOR);
        const distToArm = Math.abs(shifted - armIdx * SECTOR);

        // Angular falloff: bright at arm centre, dark between arms
        const angular = Math.max(0, 1 - distToArm / ARM_HALF);
        // Radial falloff: peak mid-radius, fade toward edges and dead-centre
        const radial = Math.exp(-Math.pow((rn - 0.45) * 2.0, 2));
        const brightness = angular * angular * radial;

        if (brightness < 0.08) {
          // Very sparse background dust between arms — stable per cell
          const h = (col * 73856093) ^ (row * 19349663);
          if ((h & 255) < 3) {
            ctx.fillStyle = 'rgba(255, 190, 110, 0.06)';
            ctx.fillText('·', col * CELL_W, row * CELL_H);
          }
          continue;
        }

        // Arc position along the arm: logR gives the natural coordinate
        // (smaller logR = closer to centre). Subtracting t*flow makes the
        // ticker text stream inward — capital flowing into the City.
        const arcPos = -logR * 26 - t * 12 + armIdx * 13;
        const idx = ((Math.floor(arcPos) % tapeLen) + tapeLen) % tapeLen;
        const ch = tape.charAt(idx);
        if (ch === ' ') continue;

        // Bloomberg-style amber, green for '+', red for '-'
        const alpha = Math.min(1, 0.35 + brightness * 0.85);
        let rC, gC, bC;
        if (ch === '+') {
          rC = 90;  gC = 230; bC = 140;
        } else if (ch === '-') {
          rC = 255; gC = 110; bC = 110;
        } else {
          // amber with brightness variation
          rC = 255;
          gC = 180 + Math.floor(brightness * 55);
          bC = 90  + Math.floor(brightness * 55);
        }
        ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${alpha})`;
        ctx.fillText(ch, col * CELL_W, row * CELL_H);
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

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