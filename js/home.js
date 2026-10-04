(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const root = document.querySelector('[data-page-root]');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const toast = document.getElementById('toast');
  const dock = document.getElementById('dock-nav');
  const toTop = document.getElementById('to-top');
  const menuButton = document.getElementById('menu-button');
  const panel = document.getElementById('mobile-panel');
  const panelInner = document.getElementById('mobile-panel-inner');
  const chips = document.getElementById('filter-chips');
  const gallery = document.getElementById('gallery');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my, rx = mx, ry = my;
  let curKind = null;
  let menuOpen = false, toastTimer = null;

  function setCursor(kind) {
    if (kind === curKind) return;
    curKind = kind;
    if (!cursorRing || !cursorDot) return;
    const labels = { view: 'View', copy: 'Copy', drag: 'Drag' };
    const label = labels[kind];
    if (label) {
      cursorRing.style.width = '76px'; cursorRing.style.height = '76px'; cursorRing.style.margin = '-38px 0 0 -38px';
      cursorRing.style.background = 'var(--lime-500)'; cursorRing.style.borderColor = 'var(--lime-500)';
      cursorRing.textContent = label;
      cursorDot.style.opacity = '0';
    } else if (kind === 'link') {
      cursorRing.style.width = '58px'; cursorRing.style.height = '58px'; cursorRing.style.margin = '-29px 0 0 -29px';
      cursorRing.style.background = 'rgba(47,75,247,.14)'; cursorRing.style.borderColor = 'var(--blue-500)';
      cursorRing.textContent = '';
      cursorDot.style.opacity = '1';
    } else {
      cursorRing.style.width = '40px'; cursorRing.style.height = '40px'; cursorRing.style.margin = '-20px 0 0 -20px';
      cursorRing.style.background = 'transparent'; cursorRing.style.borderColor = 'var(--blue-500)';
      cursorRing.textContent = '';
      cursorDot.style.opacity = '1';
    }
  }

  if (fine) {
    if (root) root.setAttribute('data-cursor-custom', '');
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      const el = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      setCursor(el ? el.dataset.cursor : null);
    }, { passive: true });
    window.addEventListener('pointerdown', () => {
      if (cursorRing) cursorRing.style.transform += ' scale(.82)';
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

  // --- reveal-on-scroll ---
  let io = null;
  // once the entrance finishes, drop the inline transform/transition so CSS :hover lifts work again
  function settle(el, delay) {
    setTimeout(() => { el.style.transition = ''; el.style.transform = ''; }, 360 + delay);
  }
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
        settle(el, d);
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
        settle(el, 0);
        io.unobserve(el);
      }
    });
  }

  // --- scrollspy + dock ---
  function spy() {
    const ids = ['work', 'selected', 'expertise', 'about', 'contact'];
    let active = null;
    ids.forEach((id) => {
      const s = document.getElementById(id);
      if (!s) return;
      const r = s.getBoundingClientRect();
      if (r.top <= window.innerHeight * .4 && r.bottom > window.innerHeight * .4) active = id;
    });
    document.querySelectorAll('[data-nav]').forEach((a) => {
      const on = a.dataset.nav === active;
      a.style.borderBottomColor = on ? 'var(--lime-500)' : 'transparent';
      a.style.color = on ? 'var(--blue-600)' : 'var(--ink-700)';
    });
    document.querySelectorAll('[data-dock]').forEach((a) => {
      const on = a.dataset.dock === active;
      const contact = a.dataset.dock === 'contact';
      if (a.dataset.dock === 'top') { a.style.background = 'transparent'; a.style.color = 'var(--ink-500)'; a.style.transform = 'none'; return; }
      a.style.background = on ? 'var(--blue-500)' : (contact ? 'var(--lime-500)' : 'transparent');
      a.style.color = on ? 'var(--paper-000)' : (contact ? 'var(--ink-900)' : 'var(--ink-500)');
      a.style.transform = on ? 'scale(1.08)' : 'none';
    });

    if (dock) {
      const show = window.scrollY > window.innerHeight * .8 && window.innerWidth >= 900;
      if (!show) dockClearAll();
      dock.style.transform = show ? 'translate3d(0,-50%,0)' : 'translate3d(28px,-50%,0)';
      dock.style.opacity = show ? '1' : '0';
      dock.style.pointerEvents = show ? 'auto' : 'none';
    }

    if (toTop) {
      const show = window.scrollY > window.innerHeight * .8;
      toTop.style.transform = show ? 'none' : 'translate3d(0,16px,0)';
      toTop.style.opacity = show ? '1' : '0';
      toTop.style.pointerEvents = show ? 'auto' : 'none';
    }
  }

  function dockLabel(el, on) {
    const l = el && el.querySelector('span');
    if (!l) return;
    l.style.opacity = on ? '1' : '0';
    l.style.transform = on ? 'none' : 'translate3d(6px,0,0)';
  }

  function dockClearAll() {
    if (!dock) return;
    dock.querySelectorAll('[data-dock]').forEach((a) => dockLabel(a, false));
  }

  if (dock) {
    dock.addEventListener('mouseleave', dockClearAll);
    dock.querySelectorAll('[data-dock]').forEach((a) => {
      a.addEventListener('mouseenter', () => { dockClearAll(); dockLabel(a, true); });
      a.addEventListener('mouseleave', () => dockLabel(a, false));
    });
  }

  // --- mobile menu ---
  function closeMenu() {
    if (!panel || !panelInner) return;
    menuOpen = false;
    panel.style.opacity = '0';
    panelInner.style.transform = 'translate3d(100%,0,0)';
    setTimeout(() => { if (!menuOpen) panel.style.display = 'none'; }, 360);
  }

  function toggleMenu() {
    if (!panel || !panelInner) return;
    menuOpen = !menuOpen;
    if (menuOpen) {
      panel.style.display = 'block';
      requestAnimationFrame(() => { panel.style.opacity = '1'; panelInner.style.transform = 'translate3d(0,0,0)'; });
    } else closeMenu();
  }

  if (menuButton) menuButton.addEventListener('click', toggleMenu);
  document.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', toggleMenu));
  if (panel) panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', toggleMenu));

  // --- filter chips ---
  if (chips && gallery) {
    chips.addEventListener('click', (e) => {
      const btn = e.target instanceof Element ? e.target.closest('[data-chip]') : null;
      if (!btn) return;
      const cat = btn.dataset.chip;
      chips.querySelectorAll('[data-chip]').forEach((c) => c.setAttribute('data-active', c === btn ? 'true' : 'false'));
      btn.style.transform = 'scale(.94)';
      setTimeout(() => { btn.style.transform = 'none'; }, 130);
      let i = 0;
      gallery.querySelectorAll('[data-cat]').forEach((item) => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.transition = 'opacity 200ms ease, transform 360ms cubic-bezier(.34,1.56,.64,1)';
        if (show) {
          item.style.display = 'block';
          const d = (i++) * 40;
          item.style.transitionDelay = d + 'ms';
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'none'; });
        } else {
          item.style.transitionDelay = '0ms';
          item.style.opacity = '0';
          item.style.transform = 'scale(.94)';
          setTimeout(() => { if (item.style.opacity === '0') item.style.display = 'none'; }, 220);
        }
      });
    });
  }

  // --- copy email ---
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const show = () => {
        if (!toast) return;
        toast.style.transform = 'translate3d(-50%,0,0)';
        toast.style.opacity = '1';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.style.transform = 'translate3d(-50%,calc(100% + 60px),0)';
          toast.style.opacity = '0';
        }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText('wandrea.moscoso@gmail.com').then(show, show);
      else show();
    });
  }

  // --- Hati demo video: big play button overlays the paused video ---
  const hatiVideo = document.getElementById('hati-video');
  const hatiPlay = document.getElementById('hati-play');
  if (hatiVideo && hatiPlay) {
    const sync = () => {
      const paused = hatiVideo.paused;
      hatiPlay.style.opacity = paused ? '1' : '0';
      hatiPlay.style.pointerEvents = paused ? 'auto' : 'none';
      hatiPlay.setAttribute('aria-label', paused ? 'Play the Hati demo' : 'Pause the Hati demo');
    };
    hatiPlay.addEventListener('click', () => {
      if (hatiVideo.paused) { const p = hatiVideo.play(); if (p && p.catch) p.catch(() => {}); }
      else hatiVideo.pause();
    });
    hatiVideo.addEventListener('play', sync);
    hatiVideo.addEventListener('pause', sync);
    sync();
    // pause once the video scrolls out of view
    new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (!en.isIntersecting && !hatiVideo.paused) hatiVideo.pause(); });
    }).observe(hatiVideo);
  }

  // --- background music toggle (off until the visitor turns it on) ---
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const musicLabel = document.getElementById('music-label');
  let musicOn = false;

  function musicUI(on) {
    const s = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"';
    if (musicIcon) {
      musicIcon.innerHTML = on
        ? '<svg ' + s + '><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a10 10 0 0 1 0 14"></path></svg>'
        : '<svg ' + s + '><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="m22 9-6 6"></path><path d="m16 9 6 6"></path></svg>';
      musicIcon.style.background = on ? 'var(--blue-500)' : 'var(--ink-500)';
    }
    if (musicLabel) musicLabel.textContent = on ? 'Music on' : 'Music off';
    if (musicBtn) {
      musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      musicBtn.setAttribute('aria-label', on ? 'Mute background music' : 'Play background music');
    }
  }

  if (music && musicBtn) {
    musicUI(false);
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (musicOn || !music.paused) {
        music.pause();
        musicOn = false;
        musicUI(false);
        try { localStorage.setItem('wm-portfolio-music', 'off'); } catch (err) { /* ignore */ }
      } else {
        music.volume = 0.35;
        music.play().then(() => { musicOn = true; musicUI(true); }).catch(() => {});
        try { localStorage.setItem('wm-portfolio-music', 'on'); } catch (err) { /* ignore */ }
      }
    });
  }

  // --- main loop ---
  function loop() {
    requestAnimationFrame(loop);
    if (fine) {
      cx += (mx - cx) * .38;
      cy += (my - cy) * .38;
      rx += (mx - rx) * .14;
      ry += (my - ry) * .14;
      if (cursorDot) cursorDot.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (cursorRing) cursorRing.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
    }
  }

  window.addEventListener('scroll', () => { spy(); sweep(); }, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900 && menuOpen) closeMenu();
  });

  function icons(tries) {
    const n = tries || 0;
    if (window.lucide && window.lucide.createIcons) {
      try { window.lucide.createIcons(); } catch (err) { /* icons optional */ }
    } else if (n < 40) setTimeout(() => icons(n + 1), 150);
  }

  icons();
  reveals();
  spy();
  loop();
})();
