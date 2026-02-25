/* ============================================================
   ALVARO ALDAMA PORTFOLIO — main.js
   GSAP + Canvas Neural Network + Magnetic Cursor + 3D Effects
   ============================================================ */

'use strict';

/* ─── GSAP Plugin Registration ─── */
gsap.registerPlugin(ScrollTrigger);

/* ─── DOM Helpers ─── */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

/* ================================================================
   1. LOADER
   ================================================================ */
(function initLoader() {
  const loader = qs('#loader');
  const cmdEl = qs('#loader-cmd');
  const fillEl = qs('#loader-fill');
  const pctEl = qs('#loader-pct');

  const commands = [
    'npm install portfolio...',
    'Loading assets...',
    'Building experience...',
    'Ready!'
  ];
  // Fix prompt label
  const promptEl = qs('.loader__prompt');
  if (promptEl) promptEl.textContent = 'alvaro69aldama@gmail.com ~$';

  let pct = 0;
  let cmdIdx = 0;
  let charIdx = 0;
  let currentCmd = '';

  function typeChar() {
    if (cmdIdx >= commands.length) {
      finishLoader(); return;
    }
    const target = commands[cmdIdx];
    if (charIdx < target.length) {
      currentCmd += target[charIdx++];
      cmdEl.textContent = currentCmd;
      const progress = ((cmdIdx / commands.length) + (charIdx / target.length / commands.length));
      pct = Math.round(progress * 100);
      fillEl.style.transform = `scaleX(${pct / 100})`;
      pctEl.textContent = pct + '%';
      setTimeout(typeChar, 30 + Math.random() * 25);
    } else {
      cmdIdx++; charIdx = 0; currentCmd = '';
      setTimeout(typeChar, 250);
    }
  }

  function finishLoader() {
    fillEl.style.transform = 'scaleX(1)';
    pctEl.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      initHomeAnimations();
    }, 400);
  }

  typeChar();
})();

/* ================================================================
   2. NEURAL NETWORK CANVAS BACKGROUND
   ================================================================ */
(function initNeuralCanvas() {
  const canvas = qs('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  const NODE_COUNT = window.innerWidth < 768 ? 50 : 100;
  const MAX_DIST = window.innerWidth < 768 ? 100 : 140;
  const GREEN = { r: 31, g: 147, b: 70 };

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
    ctx.clearRect(0, 0, W, H);

    // Update + draw nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += .02;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Mouse repulsion
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

    // Draw connections
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

    requestAnimationFrame(draw);
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
   3. CUSTOM CURSOR
   ================================================================ */
(function initCursor() {
  if (window.innerWidth < 769) return;
  const dot = qs('#cursor');
  const ring = qs('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Smooth ring follow
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

  // Hover state
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('a, button, [data-tilt], .work__card, .cert-card, .astat, .tl__card');
    if (el) {
      dot.classList.add('cursor--hover');
      ring.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', e => {
    const el = e.target.closest('a, button, [data-tilt], .work__card, .cert-card, .astat, .tl__card');
    if (el) {
      dot.classList.remove('cursor--hover');
      ring.classList.remove('cursor--hover');
    }
  });

  // Click pulse
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
   4. MAGNETIC BUTTONS
   ================================================================ */
(function initMagneticBtns() {
  if (window.innerWidth < 769) return;

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
   5. HEADER — scroll state
   ================================================================ */
(function initHeader() {
  const header = qs('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================================================================
   6. SCROLL PROGRESS BAR
   ================================================================ */
(function initScrollProgress() {
  const bar = qs('#scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ================================================================
   7. THEME TOGGLE
   ================================================================ */
(function initTheme() {
  const btn = qs('#theme-button');
  const saved = localStorage.getItem('theme');
  if (saved === 'light') { document.body.classList.add('light-theme'); btn.classList.replace('bx-moon', 'bx-sun'); }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    btn.classList.replace(isLight ? 'bx-moon' : 'bx-sun', isLight ? 'bx-sun' : 'bx-moon');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
})();

/* ================================================================
   8. TYPEWRITER (home)
   ================================================================ */
(function initTypewriter() {
  const el = qs('#typewriter-el');
  if (!el) return;
  const words = ['Full Stack Dev', 'IA Enthusiast', 'Tech Support', 'Problem Solver', 'PWA Builder'];
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
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.home__status', { y: 20, opacity: 0, duration: .6 })
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
   10. SCROLL-TRIGGERED ANIMATIONS (GSAP ScrollTrigger)
   ================================================================ */
(function initScrollAnimations() {
  // Utility: reveal on scroll
  function revealSection(selector, config = {}) {
    gsap.from(selector, {
      scrollTrigger: { trigger: selector, start: 'top 88%', once: true },
      y: 40, opacity: 0, duration: .8,
      stagger: .1, ease: 'power3.out',
      ...config
    });
  }

  // Section titles
  gsap.utils.toArray('.section__title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      y: 30, opacity: 0, duration: .8, ease: 'power3.out'
    });
  });
  gsap.utils.toArray('.section__tag, .section__line').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      x: -20, opacity: 0, duration: .6, ease: 'power3.out'
    });
  });

  // About section
  gsap.from('.about__img-frame', {
    scrollTrigger: { trigger: '.about', start: 'top 80%', once: true },
    x: -60, opacity: 0, duration: 1, ease: 'power3.out'
  });
  gsap.from('.about__content > *', {
    scrollTrigger: { trigger: '.about__content', start: 'top 82%', once: true },
    y: 30, opacity: 0, stagger: .15, duration: .7, ease: 'power3.out'
  });

  // Timeline cards
  gsap.utils.toArray('.tl__item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', once: true },
      x: -40, opacity: 0, duration: .8,
      delay: i * .1, ease: 'power3.out'
    });
  });

  // Skill cards
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      y: 50, opacity: 0, duration: .8,
      delay: i * .1, ease: 'power3.out'
    });
  });

  // Work cards
  gsap.utils.toArray('.work__card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      y: 40, opacity: 0, duration: .7,
      delay: (i % 3) * .1, ease: 'power3.out'
    });
  });

  // Certificate cards
  gsap.utils.toArray('.cert-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 92%', once: true },
      scale: .9, opacity: 0, duration: .6,
      delay: (i % 4) * .08, ease: 'back.out(1.4)'
    });
  });

  // Contact
  gsap.from('.contact__info > *', {
    scrollTrigger: { trigger: '.contact__info', start: 'top 85%', once: true },
    y: 30, opacity: 0, stagger: .12, duration: .7, ease: 'power3.out'
  });
  gsap.from('.contact__form > *', {
    scrollTrigger: { trigger: '.contact__form', start: 'top 85%', once: true },
    y: 20, opacity: 0, stagger: .1, duration: .7, ease: 'power3.out'
  });
})();

/* ================================================================
   11. SKILL BARS — fill on scroll
   ================================================================ */
(function initSkillBars() {
  qsa('.sbar__fill').forEach(bar => {
    const targetW = bar.dataset.w;
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 88%',
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
  qsa('[data-count]').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const target = +el.dataset.count;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val) + '+'; }
        });
      }
    });
  });

  // About stats
  qsa('.astat__num').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const target = +el.dataset.count;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val) + '+'; }
        });
      }
    });
  });
})();

/* ================================================================
   13. VANILLA TILT — 3D card hover
   ================================================================ */
(function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;

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
    const target = qs(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY
      - qs('#header').offsetHeight - 10;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
})();

/* ================================================================
   16. SCROLL TO TOP BUTTON
   ================================================================ */
(function initBackTop() {
  const btn = qs('#back-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ================================================================
   17. MIXITUP FILTER (Projects)
   ================================================================ */
(function initMixItUp() {
  if (typeof mixitup === 'undefined') return;
  const container = qs('#work-grid');
  if (!container) return;

  const mixer = mixitup(container, {
    selectors: { target: '.work__card' },
    animation: { duration: 350, effects: 'fade translateY(20px)', easing: 'ease' }
  });

  qsa('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      qsa('.filter-btn').forEach(b => b.classList.remove('active-filter'));
      this.classList.add('active-filter');
      mixer.filter(this.dataset.filter === 'all' ? 'all' : this.dataset.filter);
    });
  });
})();

/* ================================================================
   18. CONTACT FORM (EmailJS)
   ================================================================ */
(function initContactForm() {
  const form = qs('#contact-form');
  const msgEl = qs('#contact-message');
  const submitBtn = qs('#submit-btn');
  if (!form || !msgEl) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgEl.textContent = '';
    submitBtn.disabled = true;

    // Spinner
    const inner = submitBtn.querySelector('.btn__inner');
    const origHTML = inner.innerHTML;
    inner.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enviando...';

    try {
      await emailjs.sendForm('service_h4np7mc', 'template_mesi807', '#contact-form', '8bj8mBek5nZGjpETZ');
      msgEl.textContent = '✓ Mensaje enviado! Te contactare pronto.';
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
   20. SKILL CARD — glow follows mouse
   ================================================================ */
(function initCardGlow() {
  qsa('.skill-card, .work__card, .tl__card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
      this.style.setProperty('--mx', x);
      this.style.setProperty('--my', y);
      const glow = this.querySelector('.skill-card__glow, .work__card-glow, .tl__card-glow');
      if (glow) glow.style.background = `radial-gradient(circle at ${x} ${y}, var(--green-dim), transparent 60%)`;
    });
  });
})();

/* ================================================================
   21. HERO SECTION — parallax on scroll
   ================================================================ */
(function initHeroParallax() {
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
   22. CONSOLE EASTER EGG
   ================================================================ */
console.log('%c< Code69 />', 'color:#1f9346;font-size:22px;font-weight:bold;font-family:monospace;');
console.log('%c Alvaro Aldama — Full Stack Developer', 'color:#2ecc71;font-size:13px;font-family:monospace;');
console.log('%c GitHub: https://github.com/Alvaro6ix', 'color:#888;font-size:11px;');