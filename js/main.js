// ---------- mobile nav ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });
}

// ---------- hero slider (home page) ----------
(function heroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const progress = document.querySelector('.hero-progress');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  const DURATION = 6000;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    if (progress) progress.textContent = `0${index + 1} — 0${slides.length}`;
    current = index;
  }

  function next() {
    show((current + 1) % slides.length);
  }

  function startAuto() {
    if (prefersReduced) return;
    stopAuto();
    timer = setInterval(next, DURATION);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      startAuto();
    });
  });

  show(0);
  startAuto();
})();

// ---------- work page filter ----------
(function workFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

// ---------- contact form (mailto handoff) ----------
(function contactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:saeedahmedaa00@gmail.com?subject=${subject}&body=${body}`;
  });
})();

// ---------- scroll reveal (elements move up + fade in as you scroll) ----------
(function scrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const selectors = [
    '.section-head', '.lede', '.stat-row', '.brand-strip span',
    '.preview-card', '.cta-banner h2', '.cta-banner p', '.cta-banner .btn',
    '.about-portrait', '.about-lede', '.about-body p', '.skill-tags span',
    '.timeline-item', '.mini-grid .eyebrow', '.mini-list li',
    '.filter-bar', '.work-card', '.note-card',
    '.contact-list li', '.social-row a', '.form-field', '.contact-grid .eyebrow'
  ];

  const targets = document.querySelectorAll(selectors.join(','));
  if (!targets.length) return;

  if (prefersReduced) {
    targets.forEach(el => el.classList.add('reveal', 'in-view'));
    return;
  }

  // group by parent so siblings stagger together instead of all at once
  const groups = new Map();
  targets.forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  groups.forEach(list => {
    list.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => observer.observe(el));
})();
