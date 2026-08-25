(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const root = document.querySelector('[data-page-root]');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const progressBar = document.getElementById('progress-bar');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my, rx = mx, ry = my;
  let curKind = null;

  function setCursor(kind) {
    if (kind === curKind) return;
    curKind = kind;
    if (!cursorRing || !cursorDot) return;
    const on = kind === 'link';
    cursorRing.style.width = on ? '58px' : '40px';
    cursorRing.style.height = on ? '58px' : '40px';
    cursorRing.style.margin = on ? '-29px 0 0 -29px' : '-20px 0 0 -20px';
    cursorRing.style.background = on ? 'rgba(47,75,247,.14)' : 'transparent';
  }

  function bar() {
    if (!progressBar) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (Math.min(1, Math.max(0, window.scrollY / Math.max(h, 1))) * 100).toFixed(1) + '%';
  }

  window.addEventListener('scroll', () => { bar(); sweep(); }, { passive: true });

  if (fine) {
    if (root) root.setAttribute('data-cursor-custom', '');
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      const el = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      setCursor(el ? el.dataset.cursor : null);
    }, { passive: true });
  } else {
    [cursorDot, cursorRing].forEach((el) => { if (el) el.style.display = 'none'; });
  }

  if (fine && !reduced) {
    document.querySelectorAll('[data-magnet]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * .28;
        const dy = (e.clientY - (r.top + r.height / 2)) * .38;
        el.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
        el.style.boxShadow = '0 2px 0 rgba(27,42,107,.9)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = 'none'; el.style.boxShadow = 'none'; });
    });
  }

  let io = null;
  function reveals() {
    if (!root || reduced) return;
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const past = en.boundingClientRect.top < 0;
        if (!en.isIntersecting && !past) return;
        const el = en.target;
        const d = parseFloat(el.dataset.reveal) || 0;
        const t = '360ms cubic-bezier(.34,1.56,.64,1) ' + d + 'ms';
        el.style.transition = 'opacity ' + t + ', transform ' + t;
        el.style.opacity = '1';
        el.style.transform = 'none';
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * .92) {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0,26px,0)';
      }
      io.observe(el);
    });
  }

  function sweep() {
    if (!io) return;
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.style.opacity !== '0') return;
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.style.transition = 'opacity 360ms cubic-bezier(.34,1.56,.64,1), transform 360ms cubic-bezier(.34,1.56,.64,1)';
        el.style.opacity = '1';
        el.style.transform = 'none';
        io.unobserve(el);
      }
    });
  }

  function loop() {
    requestAnimationFrame(loop);
    if (!fine) return;
    cx += (mx - cx) * .38;
    cy += (my - cy) * .38;
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    if (cursorDot) cursorDot.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
    if (cursorRing) cursorRing.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
  }

  function icons(tries) {
    const n = tries || 0;
    if (window.lucide && window.lucide.createIcons) {
      try { window.lucide.createIcons(); } catch (err) { /* icons optional */ }
    } else if (n < 40) setTimeout(() => icons(n + 1), 150);
  }

  icons();
  reveals();
  bar();
  loop();
})();
