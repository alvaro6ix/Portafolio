/* ============================================================
   ALVARO ALDAMA PORTFOLIO — main.js
   GSAP + Canvas Neural Network + Magnetic Cursor + 3D Effects
   v2 — Bug fixes, accessibility, polygon theme toggle, FAQ
   ============================================================ */

'use strict';

/* ─── Remove no-js flag ASAP so CSS knows JS is active ─── */
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

/* ─── GSAP Plugin Registration ─── */
if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

/* ─── Reduced motion guard ─── */
const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── DOM Helpers ─── */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

/* ================================================================
   0. GLOBAL FALLBACK — ensures cards/FAQ/certs always become visible
   even if any animation fails. Runs ASAP and again as a hard fallback.
   ================================================================ */
(function initRevealFallback() {
  // Hard fallback: after 2.5s force visibility on all reveal-targets.
  const FORCE_VISIBLE_MS = 2500;
  setTimeout(() => {
    document.body.classList.add('fallback-show');
  }, FORCE_VISIBLE_MS);

  // Also fire on window load if anything is still hidden:
  window.addEventListener('load', () => {
    setTimeout(() => {
      qsa('.work__card, .cert-card, .faq__item').forEach(el => {
        if (!el.classList.contains('is-revealed')) {
          el.classList.add('is-revealed');
        }
      });
    }, 300);
  });
})();

/* ================================================================
   1. LOADER (with hard timeout to prevent locking)
   ================================================================ */
(function initLoader() {
  const loader = qs('#loader');
  const cmdEl = qs('#loader-cmd');
  const fillEl = qs('#loader-fill');
  const pctEl = qs('#loader-pct');
  if (!loader) return;

  const commands = [
    'npm install portfolio...',
    'Loading assets...',
    'Building experience...',
    'Ready!'
  ];

  const promptEl = qs('.loader__prompt');
  if (promptEl) promptEl.textContent = 'alvaro69aldama@gmail.com ~$';

  let pct = 0;
  let cmdIdx = 0;
  let charIdx = 0;
  let currentCmd = '';
  let finished = false;

  function finishLoader() {
    if (finished) return;
    finished = true;
    if (fillEl) fillEl.style.transform = 'scaleX(1)';
    if (pctEl) pctEl.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      initHomeAnimations();
    }, 350);
  }

  function typeChar() {
    if (finished) return;
    if (cmdIdx >= commands.length) {
      finishLoader();
      return;
    }
    const target = commands[cmdIdx];
    if (charIdx < target.length) {
      currentCmd += target[charIdx++];
      if (cmdEl) cmdEl.textContent = currentCmd;
      const progress = ((cmdIdx / commands.length) + (charIdx / target.length / commands.length));
      pct = Math.round(progress * 100);
      if (fillEl) fillEl.style.transform = `scaleX(${pct / 100})`;
      if (pctEl) pctEl.textContent = pct + '%';
      setTimeout(typeChar, PREFERS_REDUCED ? 10 : 30 + Math.random() * 25);
    } else {
      cmdIdx++; charIdx = 0; currentCmd = '';
      setTimeout(typeChar, PREFERS_REDUCED ? 50 : 250);
    }
  }

  // HARD failsafe: never lock loader more than 4.5s
  setTimeout(finishLoader, PREFERS_REDUCED ? 600 : 4500);

  typeChar();
})();

/* ================================================================
   2. NEURAL NETWORK CANVAS BACKGROUND (skip if reduced motion)
   ================================================================ */
(function initNeuralCanvas() {
  const canvas = qs('#hero-canvas');
  if (!canvas) return;
  if (PREFERS_REDUCED) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  const NODE_COUNT = window.innerWidth < 768 ? 40 : 90;
  const MAX_DIST = window.innerWidth < 768 ? 100 : 140;
  const GREEN = { r: 31, g: 147, b: 70 };
  let rafId = null;
  let isVisible = true;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .5,
        vy: (Math.random() - .5) * .5,
        r: Math.random() * 1.8 + .6,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    if (!isVisible) {
      rafId = requestAnimationFrame(draw);
      return;
    }
    ctx.clearRect(0, 0, W, H);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += .02;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        n.x += dx / dist * 1.2;
        n.y += dy / dist * 1.2;
      }

      const alpha = (.3 + .15 * Math.sin(n.pulse));
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + .4 * Math.sin(n.pulse), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GREEN.r},${GREEN.g},${GREEN.b},${alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${GREEN.r},${GREEN.g},${GREEN.b},.4)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * .25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${GREEN.r},${GREEN.g},${GREEN.b},${alpha})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  // Pause canvas if scrolled out of hero (performance)
  const hero = qs('.home');
  if (hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(hero);
  }

  window.addEventListener('resize', () => { resize(); createNodes(); });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize(); createNodes(); draw();
})();

/* ================================================================
   3. CUSTOM CURSOR (desktop only, no reduced motion)
   ================================================================ */
(function initCursor() {
  if (window.innerWidth < 769 || PREFERS_REDUCED) return;
  const dot = qs('#cursor');
  const ring = qs('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  const hoverSel = 'a, button, [data-tilt], .work__card, .cert-card, .astat, .tl__card, .faq__q, summary';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) {
      dot.classList.add('cursor--hover');
      ring.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) {
      dot.classList.remove('cursor--hover');
      ring.classList.remove('cursor--hover');
    }
  });

  document.addEventListener('mousedown', () => {
    dot.classList.add('cursor--click');
    ring.classList.add('cursor--click');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('cursor--click');
    ring.classList.remove('cursor--click');
  });
})();

/* ================================================================
   4. MAGNETIC BUTTONS (skip on reduced motion)
   ================================================================ */
(function initMagneticBtns() {
  if (window.innerWidth < 769 || PREFERS_REDUCED) return;
  if (typeof gsap === 'undefined') return;

  qsa('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * .28;
      const dy = (e.clientY - cy) * .28;
      gsap.to(this, { x: dx, y: dy, duration: .3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(this, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' });
    });
  });
})();

/* ================================================================
   5. HEADER scroll state
   ================================================================ */
(function initHeader() {
  const header = qs('#header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================================================================
   6. SCROLL PROGRESS BAR
   ================================================================ */
(function initScrollProgress() {
  const bar = qs('#scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ================================================================
   7. THEME TOGGLE — Polygon View Transitions API
   ================================================================ */
(function initTheme() {
  const btn = qs('#theme-button');
  if (!btn) return;

  const ROOT = document.documentElement;
  const saved = localStorage.getItem('theme');

  // Initialize state
  function applyTheme(isLight, skipSave = false) {
    document.body.classList.toggle('light-theme', isLight);
    ROOT.classList.toggle('dark', !isLight); // for ::view-transition pseudo
    btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    if (!skipSave) localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  // Initial state (default: dark)
  applyTheme(saved === 'light', true);

  function toggleTheme() {
    const willBeLight = !document.body.classList.contains('light-theme');
    applyTheme(willBeLight);
  }

  btn.addEventListener('click', () => {
    // Use View Transitions API if available + no reduced motion
    if (!document.startViewTransition || PREFERS_REDUCED) {
      toggleTheme();
      return;
    }
    btn.classList.add('is-transitioning');
    const transition = document.startViewTransition(() => {
      toggleTheme();
    });
    transition.finished.finally(() => {
      btn.classList.remove('is-transitioning');
    });
  });

  // Keyboard a11y already handled by <button>, but if user pressed space/enter
  // we ensure the click event fires (default behavior for <button>)
})();

/* ================================================================
   8. TYPEWRITER (home)
   ================================================================ */
(function initTypewriter() {
  const el = qs('#typewriter-el');
  if (!el) return;
  if (PREFERS_REDUCED) {
    el.textContent = 'Full Stack Dev';
    return;
  }
  const words = ['Full Stack Dev', 'IT & Project Manager', 'Automation Dev', 'DevOps & VPS', 'IA Enthusiast', 'Problem Solver', 'PWA Builder'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 90 + Math.random() * 30);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 500); return; }
      setTimeout(tick, 45);
    }
  }
  setTimeout(tick, 1200);
})();

/* ================================================================
   9. HOME ANIMATIONS (runs after loader)
   ================================================================ */
function initHomeAnimations() {
  if (typeof gsap === 'undefined') return;
  if (PREFERS_REDUCED) {
    // No animation, just ensure visible
    qsa('.lightswitch, .name__line, .home__role, .home__desc, .home__cta, .home__metrics, .hero__photo-wrap, .float-tag, .home__socials, .scroll__hint, [data-reveal]')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.lightswitch', { y: 20, opacity: 0, duration: .6 })
    .from('.name__line', { y: 60, opacity: 0, duration: .8, stagger: .15 }, '-=.3')
    .from('.home__role', { y: 20, opacity: 0, duration: .6 }, '-=.3')
    .from('.home__desc', { y: 20, opacity: 0, duration: .6 }, '-=.3')
    .from('.home__cta', { y: 20, opacity: 0, duration: .6 }, '-=.3')
    .from('.home__metrics', { y: 20, opacity: 0, duration: .6 }, '-=.3')
    .from('.hero__photo-wrap', { scale: .8, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, '-=.8')
    .from('.float-tag', { scale: 0, opacity: 0, stagger: .15, duration: .5, ease: 'back.out(2)' }, '-=.4')
    .from('.home__socials', { x: -20, opacity: 0, duration: .6 }, '-=.5')
    .from('.scroll__hint', { y: 10, opacity: 0, duration: .6 }, '-=.4');
}

/* ================================================================
   10. SCROLL-TRIGGERED ANIMATIONS (titles, services, timeline, skills, contact)
   NOTE: work cards + cert cards + FAQ now use IntersectionObserver
   (see section 22) — they are NOT animated here, to avoid the bug.
   ================================================================ */
(function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (PREFERS_REDUCED) return;

  function revealOnScroll(selector, config = {}) {
    qsa(selector).forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        y: 30, opacity: 0, duration: .8, ease: 'power3.out',
        clearProps: 'all',
        ...config
      });
    });
  }

  // Section titles
  revealOnScroll('.section__title');
  qsa('.section__tag, .section__line').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      x: -20, opacity: 0, duration: .6, ease: 'power3.out',
      clearProps: 'all'
    });
  });

  // About
  gsap.from('.about__img-frame', {
    scrollTrigger: { trigger: '.about', start: 'top 80%', once: true },
    x: -60, opacity: 0, duration: 1, ease: 'power3.out',
    clearProps: 'all'
  });
  gsap.from('.about__content > *', {
    scrollTrigger: { trigger: '.about__content', start: 'top 82%', once: true },
    y: 30, opacity: 0, stagger: .15, duration: .7, ease: 'power3.out',
    clearProps: 'all'
  });

  // Services
  qsa('.service-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      y: 40, opacity: 0, duration: .8, delay: (i % 3) * .1, ease: 'power3.out',
      clearProps: 'all'
    });
  });

  // Timeline
  qsa('.tl__item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%', once: true },
      x: -40, opacity: 0, duration: .8, delay: i * .1, ease: 'power3.out',
      clearProps: 'all'
    });
  });

  // Skills
  qsa('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      y: 50, opacity: 0, duration: .8, delay: i * .1, ease: 'power3.out',
      clearProps: 'all'
    });
  });

  // Contact
  gsap.from('.contact__info > *', {
    scrollTrigger: { trigger: '.contact__info', start: 'top 88%', once: true },
    y: 30, opacity: 0, stagger: .12, duration: .7, ease: 'power3.out',
    clearProps: 'all'
  });
  gsap.from('.contact__form > *', {
    scrollTrigger: { trigger: '.contact__form', start: 'top 88%', once: true },
    y: 20, opacity: 0, stagger: .1, duration: .7, ease: 'power3.out',
    clearProps: 'all'
  });
})();

/* ================================================================
   11. SKILL BARS — fill on scroll
   ================================================================ */
(function initSkillBars() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: just show bars filled
    qsa('.sbar__fill').forEach(bar => {
      bar.style.transform = `scaleX(${(bar.dataset.w || 80) / 100})`;
    });
    return;
  }

  qsa('.sbar__fill').forEach(bar => {
    const targetW = bar.dataset.w;
    if (PREFERS_REDUCED) {
      bar.style.transform = `scaleX(${targetW / 100})`;
      return;
    }
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(bar, { scaleX: targetW / 100, duration: 1.4, ease: 'power2.out', delay: .1 });
      }
    });
  });
})();

/* ================================================================
   12. COUNTER ANIMATIONS
   ================================================================ */
(function initCounters() {
  function animateCounter(el) {
    const target = +el.dataset.count;
    if (PREFERS_REDUCED || typeof gsap === 'undefined') {
      el.textContent = target + '+';
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 1.8, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val) + '+'; }
    });
  }

  qsa('[data-count]').forEach(el => {
    if (typeof ScrollTrigger === 'undefined') {
      animateCounter(el);
      return;
    }
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => animateCounter(el)
    });
  });
})();

/* ================================================================
   13. VANILLA TILT — 3D card hover
   ================================================================ */
(function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  if (PREFERS_REDUCED) return;
  if (window.innerWidth < 769) return; // skip on mobile (perf)

  VanillaTilt.init(qsa('[data-tilt]'), {
    max: 8,
    speed: 400,
    glare: true,
    'max-glare': .08,
    scale: 1.02
  });
})();

/* ================================================================
   14. NAV — active link on scroll
   ================================================================ */
(function initActiveNav() {
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav__link');

  function updateNav() {
    const offset = window.scrollY + innerHeight * .35;
    sections.forEach(sec => {
      if (offset >= sec.offsetTop && offset < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active-link'));
        const active = qs(`.nav__link[href="#${sec.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
})();

/* ================================================================
   15. SMOOTH ANCHOR SCROLLING
   ================================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = qs(href);
    if (!target) return;
    e.preventDefault();
    const headerH = qs('#header')?.offsetHeight || 60;
    const offset = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
    window.scrollTo({ top: offset, behavior: PREFERS_REDUCED ? 'auto' : 'smooth' });
    // Move focus to target for a11y
    target.setAttribute('tabindex', '-1');
    setTimeout(() => target.focus({ preventScroll: true }), 400);
  });
})();

/* ================================================================
   16. SCROLL TO TOP BUTTON
   ================================================================ */
(function initBackTop() {
  const btn = qs('#back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: PREFERS_REDUCED ? 'auto' : 'smooth' }));
})();

/* ================================================================
   17. MIXITUP FILTER (Projects) — fixed conflicts with reveal
   ================================================================ */
(function initMixItUp() {
  if (typeof mixitup === 'undefined') return;
  const container = qs('#work-grid');
  if (!container) return;

  let mixer;
  try {
    mixer = mixitup(container, {
      selectors: { target: '.work__card' },
      animation: { duration: 350, effects: 'fade translateY(20px)', easing: 'ease' }
    });
  } catch (err) {
    console.warn('[Portfolio] MixItUp init failed, filters disabled.', err);
    return;
  }

  qsa('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      qsa('.filter-btn').forEach(b => b.classList.remove('active-filter'));
      this.classList.add('active-filter');
      try {
        mixer.filter(this.dataset.filter === 'all' ? 'all' : this.dataset.filter);
      } catch (err) {
        console.warn('[Portfolio] MixItUp filter error.', err);
      }
      // Re-reveal cards after filter (in case)
      setTimeout(() => {
        qsa('.work__card').forEach(card => card.classList.add('is-revealed'));
      }, 50);
    });
  });
})();

/* ================================================================
   17b. PROJECT VIDEO PREVIEWS (.webm)
   The <video> sits over the poster <img> and only fades in once it
   really loads, so a missing/failed file just falls back to the image.
   Desktop: plays on card hover. Touch: plays while on screen.
   ================================================================ */
(function initWorkVideos() {
  const videos = qsa('.work__video');
  if (!videos.length) return;

  // The clips are heavy, so nothing is downloaded until it's actually wanted:
  // preload="none" in the markup + these guards.
  const conn = navigator.connection || {};
  const saveData = conn.saveData === true;
  const slowLink = typeof conn.effectiveType === 'string' && conn.effectiveType !== '4g';
  const canHover = window.matchMedia('(hover: hover)').matches;

  // Reduced motion, data saver or a slow link -> keep the poster image only.
  if (PREFERS_REDUCED || saveData || slowLink) {
    videos.forEach(v => v.remove());
    return;
  }

  videos.forEach(video => {
    const card = video.closest('.work__card');
    const drop = () => video.remove();

    video.addEventListener('loadeddata', () => video.classList.add('is-ready'), { once: true });
    video.addEventListener('error', drop, { once: true });
    const source = video.querySelector('source');
    if (source) source.addEventListener('error', drop, { once: true });

    if (canHover && card) {
      card.addEventListener('mouseenter', () => { video.play().catch(() => { }); });
      card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    } else {
      // Touch: play while the card is on screen, pause as soon as it leaves.
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) video.play().catch(() => { });
          else video.pause();
        });
      }, { threshold: .5 });
      io.observe(video);
    }
  });
})();

/* ================================================================
   18. CONTACT FORM (EmailJS)
   ================================================================ */
(function initContactForm() {
  const form = qs('#contact-form');
  const msgEl = qs('#contact-message');
  const submitBtn = qs('#submit-btn');
  if (!form || !msgEl || !submitBtn) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgEl.textContent = '';
    submitBtn.disabled = true;

    const inner = submitBtn.querySelector('.btn__inner');
    const origHTML = inner.innerHTML;
    inner.innerHTML = '<i class="bx bx-loader-alt bx-spin" aria-hidden="true"></i> Enviando...';

    if (typeof emailjs === 'undefined') {
      msgEl.textContent = '✗ Servicio temporalmente fuera de línea. Usa WhatsApp.';
      msgEl.style.color = '#e05252';
      submitBtn.disabled = false;
      inner.innerHTML = origHTML;
      return;
    }

    try {
      await emailjs.sendForm('service_h4np7mc', 'template_mesi807', '#contact-form', '8bj8mBek5nZGjpETZ');
      msgEl.textContent = '✓ Mensaje enviado! Te contactaré pronto.';
      msgEl.style.color = 'var(--green)';
      form.reset();
    } catch (err) {
      console.error(err);
      msgEl.textContent = '✗ Error al enviar. Intenta por WhatsApp o Email directo.';
      msgEl.style.color = '#e05252';
    } finally {
      submitBtn.disabled = false;
      inner.innerHTML = origHTML;
      setTimeout(() => { msgEl.textContent = ''; }, 6000);
    }
  });
})();

/* ================================================================
   19. FOOTER YEAR
   ================================================================ */
(function initYear() {
  const el = qs('#yr');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ================================================================
   20. CARD GLOW — radial gradient follows mouse
   ================================================================ */
(function initCardGlow() {
  if (window.innerWidth < 769 || PREFERS_REDUCED) return;
  qsa('.skill-card, .work__card, .tl__card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
      this.style.setProperty('--mx', x);
      this.style.setProperty('--my', y);
      const glow = this.querySelector('.skill-card__glow, .work__card-glow, .tl__card-glow, .cert-card__glow');
      if (glow) glow.style.background = `radial-gradient(circle at ${x} ${y}, var(--green-dim), transparent 60%)`;
    });
  });
})();

/* ================================================================
   21. HERO PARALLAX
   ================================================================ */
(function initHeroParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || PREFERS_REDUCED) return;

  gsap.to('.hero__photo-wrap', {
    scrollTrigger: { trigger: '.home', start: 'top top', end: 'bottom top', scrub: 1 },
    y: 60, ease: 'none'
  });
  gsap.to('.float-tag', {
    scrollTrigger: { trigger: '.home', start: 'top top', end: 'bottom top', scrub: 1.5 },
    y: 40, ease: 'none'
  });
  gsap.to('#hero-canvas', {
    scrollTrigger: { trigger: '.home', start: 'top top', end: 'bottom top', scrub: 2 },
    y: 80, ease: 'none'
  });
})();

/* ================================================================
   22. INTERSECTION-OBSERVER REVEAL FOR CARDS
   (Replaces GSAP-from for work/cert/FAQ cards — fixes bug where
   ScrollTrigger may not fire & leaves elements invisible.)
   ================================================================ */
(function initObserverReveal() {
  const targets = qsa('.work__card, .cert-card, .faq__item');
  if (!targets.length) return;

  // If reduced motion: reveal immediately
  if (PREFERS_REDUCED || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  let revealedCount = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger by index within parent for nicer effect
        const index = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
        const delay = Math.min(index, 6) * 70;
        setTimeout(() => entry.target.classList.add('is-revealed'), delay);
        io.unobserve(entry.target);
        revealedCount++;
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));

  // Defensive: if user scrolls fast or layout shifts, ensure anything already
  // intersecting the viewport at load gets revealed.
  function checkInView() {
    targets.forEach(el => {
      if (el.classList.contains('is-revealed')) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('is-revealed');
      }
    });
  }
  // Run after layout settles & on load
  setTimeout(checkInView, 500);
  window.addEventListener('load', () => setTimeout(checkInView, 200));
})();

/* ================================================================
   23. FAQ ACCORDION — close others when opening one (optional UX)
   ================================================================ */
(function initFAQAccordion() {
  const items = qsa('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const summary = item.querySelector('summary');
    if (!summary) return;

    summary.addEventListener('click', (e) => {
      // If currently closed, close all others first
      if (!item.open) {
        items.forEach(other => {
          if (other !== item && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });
})();

/* ================================================================
   24. NO-JS guard removal (mark JS-enabled)
   ================================================================ */
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

/* ================================================================
   25. CONSOLE EASTER EGG
   ================================================================ */
console.log('%c< Code69 />', 'color:#1f9346;font-size:22px;font-weight:bold;font-family:monospace;');
console.log('%c Alvaro Aldama — Full Stack Developer', 'color:#2ecc71;font-size:13px;font-family:monospace;');
console.log('%c code69.dev', 'color:#888;font-size:11px;');
