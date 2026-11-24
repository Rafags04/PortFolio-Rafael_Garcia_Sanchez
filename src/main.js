/**
 * RafaOS — Arranque limpio estilo macOS, ventanas flotantes movibles/redimensionables,
 * selector de fondos nativos de Mac, Dock con lupa, Spotlight ⌘K y evaluador DGT en vivo.
 */
(function () {
  const Portfolio = window.Portfolio || {};
  if (typeof Portfolio.getProfile !== 'function' || typeof Portfolio.getStrings !== 'function') return;

  const WALLPAPERS = {
    'big-sur': 'wpBigSur',
    sequoia: 'wpSequoia',
    monterey: 'wpMonterey',
    mojave: 'wpMojave'
  };

  const state = {
    currentProjects: Portfolio.getProfile().featuredProjects.slice(),
    modalProjectIndex: 0,
    githubReposMap: new Map(),
    dgtFaults: { L: 0, D: 0, E: 0 },
    activeWinId: '',
    topZ: 20,
    geometries: new Map(),
    currentWallpaper: 'big-sur',
    spotlightSelectedIndex: 0
  };

  function P() {
    return Portfolio.getProfile();
  }
  function S() {
    return Portfolio.getStrings();
  }
  function L() {
    return Portfolio.getLang();
  }

  function tpl(str, vars) {
    return Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
      str
    );
  }

  let toastTimer = null;
  function showToast(message) {
    const toastEl = document.getElementById('toast-notification');
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 3000);
  }

  async function copyToClipboard(text, label) {
    const msg = tpl(S().toastCopied, { label, val: text });
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard unavailable');
      }
      showToast(msg);
    } catch {
      const temp = document.createElement('input');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        showToast(msg);
      } catch {
        showToast(`${label}: ${text}`);
      }
      document.body.removeChild(temp);
    }
  }

  function formatShortDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(L() === 'en' ? 'en-GB' : 'es-ES', {
      year: 'numeric',
      month: 'short'
    }).format(d);
  }

  function createContactIcon(type) {
    const ns = 'http://www.w3.org/2000/svg';
    const isCopy = type === 'copy';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', isCopy ? '14' : '16');
    svg.setAttribute('height', isCopy ? '14' : '16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    const shapesByType = {
      phone: [
        ['path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z' }]
      ],
      email: [
        ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2' }],
        ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }]
      ],
      location: [
        ['path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }],
        ['circle', { cx: '12', cy: '10', r: '3' }]
      ],
      linkedin: [
        ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }],
        ['rect', { width: '4', height: '12', x: '2', y: '9' }],
        ['circle', { cx: '4', cy: '4', r: '2' }]
      ],
      github: [
        ['path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' }],
        ['path', { d: 'M9 18c-4.51 2-5-2-7-2' }]
      ],
      download: [
        ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
        ['polyline', { points: '7 10 12 15 17 10' }],
        ['line', { x1: '12', x2: '12', y1: '15', y2: '3' }]
      ],
      cv: [
        ['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }],
        ['polyline', { points: '14 2 14 8 20 8' }],
        ['line', { x1: '16', x2: '8', y1: '13', y2: '13' }],
        ['line', { x1: '16', x2: '8', y1: '17', y2: '17' }]
      ],
      copy: [
        ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }],
        ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }]
      ]
    };

    for (const [tag, attrs] of shapesByType[type] || []) {
      const node = document.createElementNS(ns, tag);
      for (const [k, v] of Object.entries(attrs)) {
        node.setAttribute(k, v);
      }
      svg.appendChild(node);
    }
    return svg;
  }

  /* ------------------------------------------------------------------------
     GESTOR DE VENTANAS LIBRES FLOTANTES (arrastrar, redimensionar, mosaico)
     ------------------------------------------------------------------------ */
  function isDesktopMode() {
    return window.innerWidth >= 768;
  }

  function getAppLabelForWin(winId) {
    const s = S();
    const map = {
      about: s.appAboutName,
      projects: s.appProjectsName,
      education: s.appEduName,
      github: s.appGithubName,
      contact: s.appContactName
    };
    return map[winId] || s.menuFinder || 'Finder';
  }

  function updateMenubarActiveApp() {
    const el = document.getElementById('menubar-active-app');
    if (el) el.textContent = getAppLabelForWin(state.activeWinId);
  }

  function updateDesktopAndDockState() {
    const desktopEl = document.getElementById('desktop-stage');
    const anyOpen = Array.from(document.querySelectorAll('.mac-window')).some((w) => !w.hidden);
    if (desktopEl) desktopEl.classList.toggle('has-open-window', anyOpen);

    document.querySelectorAll('#mac-dock .dock-item[data-dock-target]').forEach((btn) => {
      const targetId = btn.getAttribute('data-dock-target');
      const winEl = document.querySelector(`.mac-window[data-window="${targetId}"]`);
      btn.classList.toggle('is-open', Boolean(winEl && !winEl.hidden));
    });
  }

  function getDefaultGeometry(winId) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const defaults = {
      about: { width: 540, height: 390, x: Math.round(vw * 0.08), y: 74 },
      projects: { width: 820, height: 490, x: Math.max(24, vw - 860), y: 86 },
      education: { width: 620, height: 520, x: Math.round(vw * 0.14), y: 112 },
      github: { width: 520, height: 470, x: Math.max(24, vw - 565), y: 130 },
      contact: { width: 410, height: 350, x: Math.round((vw - 410) / 2), y: 158 }
    };
    const base = defaults[winId] || { width: 520, height: 400, x: 80, y: 90 };
    const width = Math.min(base.width, vw - 24);
    const height = Math.min(base.height, vh - 134);
    const x = Math.max(12, Math.min(base.x, vw - width - 12));
    const y = Math.max(38, Math.min(base.y, vh - height - 92));
    return { x, y, width, height };
  }

  function applyWindowGeometry(winEl, geom) {
    if (!winEl) return;
    if (!isDesktopMode() || winEl.classList.contains('is-maximized')) {
      winEl.style.left = '';
      winEl.style.top = '';
      winEl.style.width = '';
      winEl.style.height = '';
      return;
    }
    winEl.style.left = `${geom.x}px`;
    winEl.style.top = `${geom.y}px`;
    winEl.style.width = `${geom.width}px`;
    if (geom.height) {
      winEl.style.height = `${geom.height}px`;
    } else {
      winEl.style.height = '';
    }
  }

  function focusWindow(winId) {
    const targetWin = document.querySelector(`.mac-window[data-window="${winId}"]`);
    if (!targetWin || targetWin.hidden) return;
    document.querySelectorAll('.mac-window').forEach((w) => w.classList.remove('is-focused'));
    state.topZ += 1;
    targetWin.style.zIndex = String(state.topZ);
    targetWin.classList.add('is-focused');
    state.activeWinId = winId;
    updateMenubarActiveApp();
  }

  function closeOrMinimizeWindow(winEl) {
    if (!winEl) return;
    winEl.classList.remove('is-maximized', 'is-focused');
    winEl.hidden = true;
    updateDesktopAndDockState();

    const visibleWins = Array.from(document.querySelectorAll('.mac-window')).filter((w) => !w.hidden);
    if (visibleWins.length > 0) {
      visibleWins.sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0));
      focusWindow(visibleWins[0].getAttribute('data-window'));
    } else {
      state.activeWinId = '';
      updateMenubarActiveApp();
    }
  }

  function toggleMaximizeWindow(winEl) {
    if (!winEl) return;
    const winId = winEl.getAttribute('data-window');
    focusWindow(winId);
    const willMax = !winEl.classList.contains('is-maximized');
    winEl.classList.toggle('is-maximized', willMax);
    if (willMax) {
      winEl.style.left = '';
      winEl.style.top = '';
      winEl.style.width = '';
      winEl.style.height = '';
    } else {
      const geom = state.geometries.get(winId) || getDefaultGeometry(winId);
      state.geometries.set(winId, geom);
      applyWindowGeometry(winEl, geom);
    }
  }

  function openOrFocusWindow(winId) {
    const winEl = document.querySelector(`.mac-window[data-window="${winId}"]`);
    if (!winEl) return;
    const wasHidden = winEl.hidden;
    winEl.hidden = false;

    if (isDesktopMode()) {
      let geom = state.geometries.get(winId);
      if (!geom) {
        geom = getDefaultGeometry(winId);
        state.geometries.set(winId, geom);
      }
      applyWindowGeometry(winEl, geom);
    } else {
      applyWindowGeometry(winEl, {});
      if (wasHidden) {
        winEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    updateDesktopAndDockState();
    focusWindow(winId);
  }

  function tileAllWindows(announce = true) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padX = 16;
    const gap = 12;
    const topStart = 40;
    const bottomReserve = 86;

    if (isDesktopMode()) {
      const availW = vw - padX * 2;
      const availH = vh - topStart - bottomReserve;
      const topH = Math.max(240, Math.round((availH - gap) * 0.49));
      const botH = Math.max(220, availH - topH - gap);

      const aboutW = Math.round((availW - gap) * 0.42);
      const projW = availW - aboutW - gap;

      const eduW = Math.round((availW - gap * 2) * 0.4);
      const ghW = Math.round((availW - gap * 2) * 0.34);
      const contW = availW - eduW - ghW - gap * 2;

      const tiled = {
        about: { x: padX, y: topStart, width: aboutW, height: topH },
        projects: { x: padX + aboutW + gap, y: topStart, width: projW, height: topH },
        education: { x: padX, y: topStart + topH + gap, width: eduW, height: botH },
        github: { x: padX + eduW + gap, y: topStart + topH + gap, width: ghW, height: botH },
        contact: { x: padX + eduW + ghW + gap * 2, y: topStart + topH + gap, width: contW, height: botH }
      };

      Object.entries(tiled).forEach(([id, geom]) => {
        const winEl = document.querySelector(`.mac-window[data-window="${id}"]`);
        if (!winEl) return;
        winEl.hidden = false;
        winEl.classList.remove('is-maximized');
        state.geometries.set(id, geom);
        applyWindowGeometry(winEl, geom);
      });
    } else {
      document.querySelectorAll('.mac-window').forEach((winEl) => {
        winEl.hidden = false;
        winEl.classList.remove('is-maximized');
        applyWindowGeometry(winEl, {});
      });
    }

    updateDesktopAndDockState();
    focusWindow('about');
    if (announce) showToast(S().toastTiled);
  }

  function minimizeAllWindows() {
    document.querySelectorAll('.mac-window').forEach((winEl) => {
      winEl.classList.remove('is-maximized', 'is-focused');
      winEl.hidden = true;
    });
    updateDesktopAndDockState();
    state.activeWinId = '';
    updateMenubarActiveApp();
  }

  function setupWindowManager() {
    document.querySelectorAll('.mac-window[data-window]').forEach((winEl) => {
      const winId = winEl.getAttribute('data-window');
      const titlebar = winEl.querySelector('.mac-titlebar');
      const resizeHandle = winEl.querySelector('.mac-resize-handle');

      winEl.addEventListener('pointerdown', () => focusWindow(winId));

      winEl.querySelectorAll('.tl-btn[data-win-action]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.getAttribute('data-win-action');
          if (action === 'close' || action === 'min') {
            closeOrMinimizeWindow(winEl);
          } else if (action === 'zoom') {
            toggleMaximizeWindow(winEl);
          }
        });
      });

      if (titlebar) {
        titlebar.addEventListener('dblclick', (e) => {
          if (e.target.closest('button, a, .mac-segmented')) return;
          toggleMaximizeWindow(winEl);
        });

        let dragState = null;

        titlebar.addEventListener('pointerdown', (e) => {
          if (!isDesktopMode() || winEl.classList.contains('is-maximized')) return;
          if (e.button !== 0 || e.target.closest('button, a, .mac-segmented')) return;

          focusWindow(winId);
          const rect = winEl.getBoundingClientRect();
          const curGeom = state.geometries.get(winId) || {
            x: Math.round(rect.left),
            y: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
          state.geometries.set(winId, curGeom);

          dragState = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            origX: curGeom.x,
            origY: curGeom.y,
            width: curGeom.width
          };
          titlebar.setPointerCapture?.(e.pointerId);
        });

        titlebar.addEventListener('pointermove', (e) => {
          if (!dragState || e.pointerId !== dragState.pointerId) return;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const nextX = Math.max(
            -dragState.width + 140,
            Math.min(dragState.origX + (e.clientX - dragState.startX), vw - 140)
          );
          const nextY = Math.max(
            34,
            Math.min(dragState.origY + (e.clientY - dragState.startY), vh - 96)
          );
          const cur = state.geometries.get(winId) || {};
          cur.x = Math.round(nextX);
          cur.y = Math.round(nextY);
          state.geometries.set(winId, cur);
          winEl.style.left = `${cur.x}px`;
          winEl.style.top = `${cur.y}px`;
        });

        const endDrag = (e) => {
          if (!dragState || e.pointerId !== dragState.pointerId) return;
          titlebar.releasePointerCapture?.(e.pointerId);
          dragState = null;
        };
        titlebar.addEventListener('pointerup', endDrag);
        titlebar.addEventListener('pointercancel', endDrag);
      }

      if (resizeHandle) {
        let resizeState = null;

        resizeHandle.addEventListener('pointerdown', (e) => {
          if (!isDesktopMode() || winEl.classList.contains('is-maximized')) return;
          if (e.button !== 0) return;
          e.stopPropagation();
          focusWindow(winId);
          const rect = winEl.getBoundingClientRect();
          const curGeom = state.geometries.get(winId) || {
            x: Math.round(rect.left),
            y: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
          state.geometries.set(winId, curGeom);

          resizeState = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            origW: rect.width,
            origH: rect.height,
            winX: curGeom.x,
            winY: curGeom.y
          };
          resizeHandle.setPointerCapture?.(e.pointerId);
        });

        resizeHandle.addEventListener('pointermove', (e) => {
          if (!resizeState || e.pointerId !== resizeState.pointerId) return;
          const maxW = Math.max(320, window.innerWidth - Math.max(12, resizeState.winX) - 12);
          const maxH = Math.max(220, window.innerHeight - resizeState.winY - 84);
          const nextW = Math.round(Math.max(320, Math.min(resizeState.origW + (e.clientX - resizeState.startX), maxW)));
          const nextH = Math.round(Math.max(220, Math.min(resizeState.origH + (e.clientY - resizeState.startY), maxH)));
          const cur = state.geometries.get(winId) || {};
          cur.width = nextW;
          cur.height = nextH;
          state.geometries.set(winId, cur);
          winEl.style.width = `${nextW}px`;
          winEl.style.height = `${nextH}px`;
        });

        const endResize = (e) => {
          if (!resizeState || e.pointerId !== resizeState.pointerId) return;
          resizeHandle.releasePointerCapture?.(e.pointerId);
          resizeState = null;
        };
        resizeHandle.addEventListener('pointerup', endResize);
        resizeHandle.addEventListener('pointercancel', endResize);
      }
    });

    window.addEventListener('resize', () => {
      document.querySelectorAll('.mac-window[data-window]').forEach((winEl) => {
        if (winEl.hidden) return;
        const winId = winEl.getAttribute('data-window');
        const geom = state.geometries.get(winId);
        if (geom) applyWindowGeometry(winEl, geom);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const anyModalOpen = Array.from(document.querySelectorAll('.modal-backdrop')).some((m) => !m.hidden);
      if (anyModalOpen) return;
      const maxWin = document.querySelector('.mac-window.is-maximized');
      if (maxWin) {
        const winId = maxWin.getAttribute('data-window');
        maxWin.classList.remove('is-maximized');
        const geom = state.geometries.get(winId) || getDefaultGeometry(winId);
        state.geometries.set(winId, geom);
        applyWindowGeometry(maxWin, geom);
      }
    });

    updateDesktopAndDockState();
  }

  /* ------------------------------------------------------------------------
     ICONOS DEL ESCRITORIO, DOCK, MENÚ VENTANA Y FONDOS DE MAC
     ------------------------------------------------------------------------ */
  function setWallpaper(wallpaperId, announce = false) {
    const validId = Object.prototype.hasOwnProperty.call(WALLPAPERS, wallpaperId) ? wallpaperId : 'big-sur';
    state.currentWallpaper = validId;
    document.documentElement.style.setProperty('--wallpaper-url', `url('./assets/wallpapers/${validId}.svg')`);

    document.querySelectorAll('#wallpaper-dropdown [data-wallpaper]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-wallpaper') === validId);
    });

    try {
      localStorage.setItem('portfolio_wallpaper', validId);
    } catch {
      // Ignorar
    }

    if (announce) {
      const name = S()[WALLPAPERS[validId]] || validId;
      showToast(tpl(S().toastWallpaper, { name }));
    }
  }

  function setupDockDesktopAndMenus(cvModal) {
    const desktopEl = document.getElementById('desktop-stage');
    const deskBtns = Array.from(document.querySelectorAll('#desktop-icons .desk-icon-btn'));

    deskBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deskBtns.forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        const target = btn.getAttribute('data-desk-open');
        if (target) {
          openOrFocusWindow(target);
        } else if (btn.id === 'desk-btn-cv') {
          cvModal.open(btn);
        }
      });
    });

    if (desktopEl) {
      desktopEl.addEventListener('click', (e) => {
        if (!e.target.closest('.desk-icon-btn')) {
          deskBtns.forEach((b) => b.classList.remove('is-selected'));
        }
      });
    }

    const dock = document.getElementById('mac-dock');
    if (dock) {
      dock.querySelectorAll('.dock-item[data-dock-target]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-dock-target');
          if (target) openOrFocusWindow(target);
        });
      });

      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const fine = window.matchMedia?.('(pointer: fine)').matches;
      if (fine && !reduced) {
        const items = Array.from(dock.querySelectorAll('.dock-item'));
        dock.addEventListener(
          'pointermove',
          (event) => {
            if (!isDesktopMode()) return;
            items.forEach((item) => {
              const r = item.getBoundingClientRect();
              const center = r.left + r.width / 2;
              const dist = Math.abs(event.clientX - center);
              const factor = Math.max(0, 1 - dist / 115);
              item.style.setProperty('--dock-scale', (1 + factor * 0.28).toFixed(3));
            });
          },
          { passive: true }
        );
        dock.addEventListener('pointerleave', () => {
          items.forEach((item) => item.style.setProperty('--dock-scale', '1'));
        });
      }
    }

    // Menús desplegables Ventana y Fondo
    const menuPairs = [
      { btn: document.getElementById('btn-window-menu'), drop: document.getElementById('window-dropdown') },
      { btn: document.getElementById('btn-wallpaper-menu'), drop: document.getElementById('wallpaper-dropdown') }
    ];

    const closeAllMenus = () => {
      menuPairs.forEach(({ btn, drop }) => {
        if (drop) drop.hidden = true;
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    };

    menuPairs.forEach(({ btn, drop }) => {
      if (!btn || !drop) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = drop.hidden;
        closeAllMenus();
        drop.hidden = !willOpen;
        btn.setAttribute('aria-expanded', String(willOpen));
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.menubar-menu-wrap')) {
        closeAllMenus();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllMenus();
    });

    document.getElementById('menu-act-tile')?.addEventListener('click', () => {
      closeAllMenus();
      tileAllWindows(true);
    });
    document.getElementById('menu-act-show-all')?.addEventListener('click', () => {
      closeAllMenus();
      tileAllWindows(false);
    });
    document.getElementById('menu-act-min-all')?.addEventListener('click', () => {
      closeAllMenus();
      minimizeAllWindows();
    });
    document.getElementById('menu-act-cv')?.addEventListener('click', closeAllMenus);

    document.querySelectorAll('#wallpaper-dropdown [data-wallpaper]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-wallpaper');
        closeAllMenus();
        if (id) setWallpaper(id, true);
      });
    });

    let initialWp = 'big-sur';
    try {
      const savedWp = localStorage.getItem('portfolio_wallpaper');
      if (savedWp && WALLPAPERS[savedWp]) initialWp = savedWp;
    } catch {
      // Ignorar
    }
    setWallpaper(initialWp, false);
  }

  function updateMenubarClock() {
    const clockEl = document.getElementById('menubar-clock');
    if (!clockEl) return;
    const now = new Date();
    const locale = L() === 'en' ? 'en-GB' : 'es-ES';
    clockEl.textContent = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now);
    clockEl.setAttribute('datetime', now.toISOString());
  }

  /* ------------------------------------------------------------------------
     RENDER DE CONTENIDO (WIDGET + HERO, PROYECTOS + DGT, FORMACIÓN, CONTACTO, CV)
     ------------------------------------------------------------------------ */
  function renderHero() {
    const profile = P();
    const s = S();
    const avatarEl = document.getElementById('hero-avatar');
    const nameEl = document.getElementById('hero-name');
    const roleEl = document.getElementById('hero-role');
    const aboutEl = document.getElementById('hero-about');
    const ghLink = document.getElementById('hero-github-link');
    const downloadCvBtn = document.getElementById('btn-download-cv');
    const openCvBtn = document.getElementById('btn-open-cv');
    const menuCvLink = document.getElementById('menu-act-cv');

    const wAvatar = document.getElementById('widget-avatar');
    const wName = document.getElementById('widget-name');
    const wRole = document.getElementById('widget-role');

    const altText = L() === 'en' ? `Portrait of ${profile.name}` : `Retrato de ${profile.name}`;
    if (avatarEl && profile.avatar) {
      avatarEl.src = profile.avatar;
      avatarEl.alt = altText;
    }
    if (wAvatar && profile.avatar) {
      wAvatar.src = profile.avatar;
      wAvatar.alt = altText;
    }
    if (nameEl) nameEl.textContent = profile.name;
    if (wName) wName.textContent = profile.name;
    if (roleEl) roleEl.textContent = `${profile.role} · ${profile.institution}`;
    if (wRole) wRole.textContent = `${profile.role} · UCLM`;
    if (aboutEl) aboutEl.textContent = profile.about;

    if (downloadCvBtn) {
      if (profile.contact.cvPdfUrl) downloadCvBtn.href = profile.contact.cvPdfUrl;
      downloadCvBtn.textContent = '';
      downloadCvBtn.append(
        createContactIcon('download'),
        document.createTextNode(s.heroDownloadCv)
      );
    }
    if (menuCvLink && profile.contact.cvPdfUrl) {
      menuCvLink.href = profile.contact.cvPdfUrl;
    }
    if (openCvBtn) {
      openCvBtn.textContent = '';
      openCvBtn.append(
        createContactIcon('cv'),
        document.createTextNode(s.heroOpenCv)
      );
    }
    if (ghLink) {
      ghLink.href = profile.contact.githubUrl;
      ghLink.textContent = '';
      ghLink.append(
        createContactIcon('github'),
        document.createTextNode(`GitHub (@${profile.contact.githubUser})`)
      );
    }
  }

  let projectModal = null;

  function setProjectModalTab(tabName) {
    const tabBtns = document.querySelectorAll('.proj-tab-btn[data-proj-tab]');
    const panels = {
      summary: document.getElementById('proj-tab-panel-summary'),
      code: document.getElementById('proj-tab-panel-code'),
      stack: document.getElementById('proj-tab-panel-stack')
    };

    tabBtns.forEach((btn) => {
      const active = btn.getAttribute('data-proj-tab') === tabName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    Object.entries(panels).forEach(([key, panelEl]) => {
      if (panelEl) panelEl.hidden = key !== tabName;
    });
  }

  function renderProjectModalContent(projectIndex) {
    const s = S();
    const list = state.currentProjects.length ? state.currentProjects : P().featuredProjects;
    const safeIdx = ((projectIndex % list.length) + list.length) % list.length;
    state.modalProjectIndex = safeIdx;
    const project = list[safeIdx];

    const indexEl = document.getElementById('proj-modal-index');
    const prevBtn = document.getElementById('btn-prev-project');
    const navGroup = prevBtn ? prevBtn.parentElement : null;
    const titleEl = document.getElementById('proj-modal-title');
    const figureEl = document.getElementById('proj-modal-figure');
    const imgEl = document.getElementById('proj-modal-img');
    const summaryPanel = document.getElementById('proj-tab-panel-summary');
    const codePanel = document.getElementById('proj-tab-panel-code');
    const stackPanel = document.getElementById('proj-tab-panel-stack');
    const linksGroup = document.getElementById('proj-modal-external-links');

    const isMulti = list.length > 1;
    if (indexEl) {
      indexEl.hidden = !isMulti;
      if (isMulti) indexEl.textContent = tpl(s.projModalIndex, { idx: safeIdx + 1, total: list.length });
    }
    if (navGroup) navGroup.hidden = !isMulti;
    if (titleEl) titleEl.textContent = project.title;

    if (figureEl && imgEl) {
      if (project.image) {
        figureEl.hidden = false;
        imgEl.src = project.image;
        imgEl.alt = project.imageAlt || project.title;
      } else {
        figureEl.hidden = true;
        imgEl.removeAttribute('src');
        imgEl.alt = '';
      }
    }

    if (summaryPanel) {
      summaryPanel.textContent = '';
      const pProb = document.createElement('p');
      const strongProb = document.createElement('strong');
      strongProb.textContent = `${s.problemLabel}: `;
      pProb.append(strongProb, document.createTextNode(project.problem));

      const pSol = document.createElement('p');
      const strongSol = document.createElement('strong');
      strongSol.textContent = `${s.solutionLabel}: `;
      pSol.append(strongSol, document.createTextNode(project.solution));

      summaryPanel.append(pProb, pSol);
    }

    if (codePanel) {
      codePanel.textContent = '';
      const pre = document.createElement('pre');
      pre.className = 'proj-code-block';
      pre.textContent = project.codeSnippet || '// No snippet available.';
      codePanel.appendChild(pre);
    }

    if (stackPanel) {
      stackPanel.textContent = '';
      const ulTags = document.createElement('ul');
      ulTags.className = 'tag-list';
      for (const tech of project.stack || []) {
        const li = document.createElement('li');
        li.className = 'tag';
        li.textContent = tech;
        ulTags.appendChild(li);
      }
      stackPanel.appendChild(ulTags);

      if (Array.isArray(project.highlights) && project.highlights.length > 0) {
        const ulHi = document.createElement('ul');
        ulHi.className = 'proj-highlights-list';
        for (const h of project.highlights) {
          const li = document.createElement('li');
          li.textContent = h;
          ulHi.appendChild(li);
        }
        stackPanel.appendChild(ulHi);
      }
    }

    if (linksGroup) {
      linksGroup.textContent = '';
      const repoBtn = document.createElement('a');
      repoBtn.className = 'btn btn-primary btn-sm';
      repoBtn.href = project.repoUrl;
      repoBtn.target = '_blank';
      repoBtn.rel = 'noopener noreferrer';
      repoBtn.textContent = s.projModalOpenRepo;
      linksGroup.appendChild(repoBtn);

      if (project.demoUrl) {
        const demoBtn = document.createElement('a');
        demoBtn.className = 'btn btn-ghost btn-sm';
        demoBtn.href = project.demoUrl;
        demoBtn.target = '_blank';
        demoBtn.rel = 'noopener noreferrer';
        demoBtn.textContent = s.projModalViewDemo;
        linksGroup.appendChild(demoBtn);
      }
    }

    setProjectModalTab('summary');
  }

  function openProjectModal(projectId, triggerEl) {
    const list = state.currentProjects.length ? state.currentProjects : P().featuredProjects;
    const idx = Math.max(0, list.findIndex((p) => p.id === projectId));
    renderProjectModalContent(idx);
    if (projectModal) projectModal.open(triggerEl);
  }

  function renderProjects() {
    const profile = P();
    const s = S();
    const container = document.getElementById('projects-list');
    const codePanel = document.getElementById('proj-inline-code-panel');
    if (!container) return;

    const projects = profile.featuredProjects;
    state.currentProjects = projects;
    container.textContent = '';
    container.classList.toggle('is-single', projects.length === 1);

    for (const project of projects) {
      const card = document.createElement('article');
      card.className = 'project-card';

      if (project.image) {
        const mediaBtn = document.createElement('button');
        mediaBtn.type = 'button';
        mediaBtn.className = 'project-media-btn';
        mediaBtn.setAttribute('aria-label', `${s.viewDetailsBtn}: ${project.title}`);

        const img = document.createElement('img');
        img.className = 'project-media-img';
        img.src = project.image;
        img.alt = project.imageAlt || project.title;
        img.loading = 'lazy';

        const badge = document.createElement('span');
        badge.className = 'project-media-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = s.zoomLabel;

        mediaBtn.append(img, badge);
        mediaBtn.addEventListener('click', () => openProjectModal(project.id, mediaBtn));
        card.appendChild(mediaBtn);
      }

      const body = document.createElement('div');
      body.className = 'project-card-body';

      const liveRepo = project.repoName ? state.githubReposMap.get(project.repoName) : null;
      if (liveRepo) {
        const syncTag = document.createElement('span');
        syncTag.className = 'repo-sync-tag';
        const dateStr = formatShortDate(liveRepo.updated_at);
        syncTag.textContent = dateStr ? `${s.githubSyncTag} ${dateStr}` : s.githubSyncedTag;
        body.appendChild(syncTag);
      }

      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.title;

      const dl = document.createElement('dl');
      dl.className = 'project-details';

      const dtProb = document.createElement('dt');
      dtProb.textContent = s.problemLabel;
      const ddProb = document.createElement('dd');
      ddProb.textContent = project.problem;

      const dtSol = document.createElement('dt');
      dtSol.textContent = s.solutionLabel;
      const ddSol = document.createElement('dd');
      ddSol.textContent = project.solution;

      dl.append(dtProb, ddProb, dtSol, ddSol);

      const stackList = document.createElement('ul');
      stackList.className = 'tag-list';
      stackList.setAttribute('aria-label', `${project.title} stack`);
      for (const tech of project.stack || []) {
        const li = document.createElement('li');
        li.className = 'tag';
        li.textContent = tech;
        stackList.appendChild(li);
      }

      const links = document.createElement('div');
      links.className = 'project-links';

      const detailBtn = document.createElement('button');
      detailBtn.type = 'button';
      detailBtn.className = 'btn btn-primary btn-sm';
      detailBtn.textContent = s.viewDetailsBtn;
      detailBtn.addEventListener('click', () => openProjectModal(project.id, detailBtn));
      links.appendChild(detailBtn);

      const repoLink = document.createElement('a');
      repoLink.className = 'btn btn-secondary btn-sm';
      repoLink.href = project.repoUrl;
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';
      repoLink.textContent = s.repoGithubBtn;
      links.appendChild(repoLink);

      if (project.demoUrl) {
        const demoLink = document.createElement('a');
        demoLink.className = 'btn btn-ghost btn-sm';
        demoLink.href = project.demoUrl;
        demoLink.target = '_blank';
        demoLink.rel = 'noopener noreferrer';
        demoLink.textContent = s.viewWebBtn;
        links.appendChild(demoLink);
      }

      body.append(title, dl, stackList, links);
      card.appendChild(body);
      container.appendChild(card);
    }

    if (codePanel && projects[0]) {
      const p = projects[0];
      codePanel.textContent = '';
      const pre = document.createElement('pre');
      pre.className = 'proj-code-block';
      pre.textContent = p.codeSnippet || '';
      codePanel.appendChild(pre);

      if (Array.isArray(p.highlights) && p.highlights.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'proj-highlights-list';
        for (const h of p.highlights) {
          const li = document.createElement('li');
          li.textContent = h;
          ul.appendChild(li);
        }
        codePanel.appendChild(ul);
      }
    }
  }

  function setProjectWindowTab(tabName) {
    document.querySelectorAll('.mac-seg-btn[data-win-proj-tab]').forEach((btn) => {
      const active = btn.getAttribute('data-win-proj-tab') === tabName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    const overviewEl = document.getElementById('projects-list');
    const simEl = document.getElementById('dgt-live-panel');
    const codeEl = document.getElementById('proj-inline-code-panel');
    if (overviewEl) overviewEl.hidden = tabName !== 'overview';
    if (simEl) simEl.hidden = tabName !== 'simulator';
    if (codeEl) codeEl.hidden = tabName !== 'code';
  }

  function updateDgtSimulatorDisplay() {
    const s = S();
    const { L: minor, D: major, E: disq } = state.dgtFaults;
    const isFail = disq >= 1 || major >= 2 || (major >= 1 && minor >= 5) || minor >= 10;

    const lEl = document.getElementById('dgt-count-l');
    const dEl = document.getElementById('dgt-count-d');
    const eEl = document.getElementById('dgt-count-e');
    const pill = document.getElementById('dgt-result-pill');

    if (lEl) lEl.textContent = String(minor);
    if (dEl) dEl.textContent = String(major);
    if (eEl) eEl.textContent = String(disq);
    if (pill) {
      pill.textContent = isFail ? s.dgtFail : s.dgtPass;
      pill.classList.toggle('is-fail', isFail);
      pill.classList.toggle('is-pass', !isFail);
    }
  }

  function setupProjectWindowInteractions() {
    document.querySelectorAll('.mac-seg-btn[data-win-proj-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setProjectWindowTab(btn.getAttribute('data-win-proj-tab') || 'overview');
      });
    });

    document.getElementById('btn-dgt-l')?.addEventListener('click', () => {
      state.dgtFaults.L += 1;
      updateDgtSimulatorDisplay();
    });
    document.getElementById('btn-dgt-d')?.addEventListener('click', () => {
      state.dgtFaults.D += 1;
      updateDgtSimulatorDisplay();
    });
    document.getElementById('btn-dgt-e')?.addEventListener('click', () => {
      state.dgtFaults.E += 1;
      updateDgtSimulatorDisplay();
    });
    document.getElementById('btn-dgt-reset')?.addEventListener('click', () => {
      state.dgtFaults = { L: 0, D: 0, E: 0 };
      updateDgtSimulatorDisplay();
    });

    updateDgtSimulatorDisplay();
  }

  function setupProjectModal() {
    projectModal = Portfolio.createAccessibleModal('project-modal');
    const closeBtn = document.getElementById('btn-close-project-modal');
    const closeTlBtn = document.getElementById('btn-close-project-tl');
    const prevBtn = document.getElementById('btn-prev-project');
    const nextBtn = document.getElementById('btn-next-project');
    const tabBtns = document.querySelectorAll('.proj-tab-btn[data-proj-tab]');

    if (closeBtn) closeBtn.addEventListener('click', () => projectModal.close());
    if (closeTlBtn) closeTlBtn.addEventListener('click', () => projectModal.close());
    if (prevBtn) prevBtn.addEventListener('click', () => renderProjectModalContent(state.modalProjectIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => renderProjectModalContent(state.modalProjectIndex + 1));

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        setProjectModalTab(btn.getAttribute('data-proj-tab') || 'summary');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (!projectModal.isOpen() || state.currentProjects.length <= 1) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        renderProjectModalContent(state.modalProjectIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        renderProjectModalContent(state.modalProjectIndex + 1);
      }
    });
  }

  function renderAcademicEducation() {
    const list = document.getElementById('academic-list');
    if (!list) return;
    list.textContent = '';

    for (const item of P().academicEducation) {
      const li = document.createElement('li');
      li.className = `settings-row ${item.highlight ? 'is-primary' : ''}`;

      const period = document.createElement('span');
      period.className = 'academic-period';
      period.textContent = item.period;

      const title = document.createElement('h4');
      title.className = 'academic-title';
      title.textContent = item.title;

      const inst = document.createElement('p');
      inst.className = 'academic-institution';
      inst.textContent = item.institution;

      li.append(period, title, inst);
      list.appendChild(li);
    }
  }

  function renderComplementaryCourses() {
    const list = document.getElementById('courses-list');
    if (!list) return;

    list.textContent = '';
    for (const course of P().complementaryCourses) {
      const li = document.createElement('li');
      li.className = `settings-row ${course.featured ? 'is-featured' : ''}`;

      const meta = document.createElement('span');
      meta.className = 'course-meta';
      meta.textContent = course.date;

      const title = document.createElement('h4');
      title.className = 'course-title';
      title.textContent = course.title;

      const provider = document.createElement('p');
      provider.className = 'course-provider';
      provider.textContent = course.provider;

      li.append(meta, title, provider);
      list.appendChild(li);
    }
  }

  function renderCompetencies() {
    const profile = P();

    const techList = document.getElementById('tech-skills-list');
    if (techList) {
      techList.textContent = '';
      for (const skill of profile.technicalSkills) {
        const li = document.createElement('li');
        li.className = 'tag';
        li.textContent = skill;
        techList.appendChild(li);
      }
    }

    const langList = document.getElementById('languages-list');
    if (langList) {
      langList.textContent = '';
      for (const lang of profile.languages) {
        const row = document.createElement('div');
        row.className = 'language-row';

        const head = document.createElement('div');
        head.className = 'language-head';
        const strong = document.createElement('strong');
        strong.textContent = lang.name;
        const level = document.createElement('span');
        level.className = 'language-level';
        level.textContent = lang.level;
        head.append(strong, level);

        const track = document.createElement('div');
        track.className = 'language-bar-track';
        const fill = document.createElement('div');
        fill.className = 'language-bar-fill';
        fill.style.width = `${lang.percent}%`;
        track.appendChild(fill);

        row.append(head, track);
        langList.appendChild(row);
      }
    }

    const extraList = document.getElementById('profile-extra-list');
    if (extraList) {
      extraList.textContent = '';
      for (const itemText of [...profile.softSkills, ...profile.additionalInfo]) {
        const li = document.createElement('li');
        li.textContent = itemText;
        extraList.appendChild(li);
      }
    }
  }

  function renderContact() {
    const containerEl = document.getElementById('contact-list');
    if (!containerEl) return;
    const profile = P();
    const s = S();
    containerEl.textContent = '';

    const entries = [
      {
        icon: 'phone',
        label: s.contactPhoneLabel,
        value: profile.contact.phone,
        href: profile.contact.phoneHref,
        copyLabel: s.contactPhoneLabel
      },
      {
        icon: 'email',
        label: s.contactEmailLabel,
        value: profile.contact.email,
        href: `mailto:${profile.contact.email}`,
        copyLabel: 'Email'
      },
      {
        icon: 'location',
        label: s.contactLocationLabel,
        value: profile.contact.location,
        href: null,
        copyLabel: null
      },
      {
        icon: 'linkedin',
        label: s.contactLinkedInLabel,
        value: profile.contact.linkedinUrl,
        displayValue: 'LinkedIn ↗',
        title: profile.contact.linkedinUrl,
        href: encodeURI(profile.contact.linkedinUrl),
        external: true,
        copyLabel: null
      }
    ];

    for (const entry of entries) {
      const item = document.createElement('div');
      item.className = 'footer-contact-item';

      const iconBox = document.createElement('span');
      iconBox.className = 'footer-icon-box';
      iconBox.setAttribute('aria-hidden', 'true');
      iconBox.appendChild(createContactIcon(entry.icon));

      const heading = document.createElement('span');
      heading.className = 'visually-hidden footer-item-label';
      heading.textContent = entry.label;

      const valueBox = document.createElement('div');
      valueBox.className = 'footer-item-value';

      if (entry.href) {
        const link = document.createElement('a');
        link.href = entry.href;
        if (entry.title) link.title = entry.title;
        if (entry.external) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        link.textContent = entry.displayValue || entry.value;
        valueBox.appendChild(link);
      } else {
        const span = document.createElement('span');
        span.textContent = entry.displayValue || entry.value;
        valueBox.appendChild(span);
      }

      if (entry.copyLabel) {
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'footer-copy-btn';
        copyBtn.setAttribute('aria-label', `${s.copyBtn}: ${entry.label}`);
        copyBtn.title = s.copyBtn;
        copyBtn.appendChild(createContactIcon('copy'));
        copyBtn.addEventListener('click', () => copyToClipboard(entry.value, entry.copyLabel));
        valueBox.appendChild(copyBtn);
      }

      item.append(iconBox, heading, valueBox);
      containerEl.appendChild(item);
    }

    const dockLi = document.getElementById('dock-linkedin-link');
    if (dockLi && profile.contact.linkedinUrl) {
      dockLi.href = encodeURI(profile.contact.linkedinUrl);
    }
  }

  function renderCvSheet() {
    const profile = P();
    const s = S();
    const sheet = document.getElementById('cv-modal-content');
    const pdfLink = document.getElementById('cv-pdf-link');

    if (pdfLink && profile.contact.cvPdfUrl) {
      pdfLink.href = profile.contact.cvPdfUrl;
    }
    if (!sheet) return;
    sheet.textContent = '';

    const header = document.createElement('div');
    header.className = 'cv-header';

    const nameH3 = document.createElement('h3');
    nameH3.textContent = profile.name;

    const roleP = document.createElement('p');
    roleP.className = 'cv-role';
    roleP.textContent = profile.role;

    const contactP = document.createElement('p');
    contactP.className = 'cv-contact-line';
    contactP.textContent = [
      profile.contact.phone,
      profile.contact.email,
      profile.contact.location,
      profile.contact.linkedinHandle || profile.contact.linkedinUrl,
      profile.contact.githubUrl
    ]
      .filter(Boolean)
      .join(' · ');

    header.append(nameH3, roleP, contactP);
    sheet.appendChild(header);

    const addSection = (titleText) => {
      const sec = document.createElement('section');
      sec.className = 'cv-section';
      const h4 = document.createElement('h4');
      h4.textContent = titleText;
      sec.appendChild(h4);
      sheet.appendChild(sec);
      return sec;
    };

    const aboutSec = addSection(s.cvSecAbout);
    const aboutP = document.createElement('p');
    aboutP.textContent = profile.about;
    aboutSec.appendChild(aboutP);

    const eduSec = addSection(s.cvSecEdu);
    for (const edu of profile.academicEducation) {
      const item = document.createElement('div');
      item.className = 'cv-item';
      const strong = document.createElement('strong');
      strong.textContent = edu.title;
      const p = document.createElement('p');
      p.textContent = `${edu.institution} | ${edu.period}`;
      item.append(strong, p);
      eduSec.appendChild(item);
    }

    const projSec = addSection(s.cvSecProj);
    for (const p of profile.featuredProjects) {
      const item = document.createElement('div');
      item.className = 'cv-item';
      const strong = document.createElement('strong');
      strong.textContent = `${p.title} (${p.stack.join(', ')})`;
      const desc = document.createElement('p');
      desc.textContent = p.solution;
      const url = document.createElement('p');
      url.className = 'cv-repo-url';
      url.textContent = p.repoUrl;
      item.append(strong, desc, url);
      projSec.appendChild(item);
    }

    const coursesSec = addSection(s.cvSecCourses);
    for (const c of profile.complementaryCourses) {
      const p = document.createElement('p');
      p.textContent = `• ${c.title} — ${c.provider} | ${c.date}`;
      coursesSec.appendChild(p);
    }

    const compSec = addSection(s.cvSecComp);
    const pTech = document.createElement('p');
    pTech.textContent = `${s.cvLabelTech}: ${profile.technicalSkills.join(' · ')}`;
    const pSoft = document.createElement('p');
    pSoft.textContent = `${s.cvLabelSoft}: ${profile.softSkills.join(' · ')}`;
    const pLang = document.createElement('p');
    pLang.textContent = `${s.cvLabelLang}: ${profile.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}`;
    const pAdd = document.createElement('p');
    pAdd.textContent = `${s.cvLabelAdd}: ${profile.additionalInfo.join(' · ')}`;
    compSec.append(pTech, pSoft, pLang, pAdd);
  }

  function renderFooter() {
    const yearEl = document.getElementById('footer-year');
    const nameEl = document.getElementById('footer-name');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    if (nameEl) nameEl.textContent = P().name;
  }

  /* ------------------------------------------------------------------------
     SPOTLIGHT SEARCH (⌘K)
     ------------------------------------------------------------------------ */
  let spotlightModal = null;
  let currentSpotlightActions = [];

  function getSpotlightActions(cvModal) {
    const s = S();
    const profile = P();
    return [
      {
        id: 'sim',
        label: s.spActSim,
        run: () => {
          openOrFocusWindow('projects');
          setProjectWindowTab('simulator');
        }
      },
      {
        id: 'cv-preview',
        label: s.spActCvPreview,
        run: () => cvModal.open(document.getElementById('btn-spotlight'))
      },
      {
        id: 'cv-pdf',
        label: s.spActCvDownload,
        run: () => {
          openOrFocusWindow('about');
          document.getElementById('btn-download-cv')?.click();
        }
      },
      {
        id: 'copy-email',
        label: s.spActCopyEmail,
        run: () => copyToClipboard(profile.contact.email, 'Email')
      },
      {
        id: 'copy-phone',
        label: s.spActCopyPhone,
        run: () => copyToClipboard(profile.contact.phone, s.contactPhoneLabel)
      },
      {
        id: 'linkedin',
        label: s.spActLinkedin,
        run: () => window.open(encodeURI(profile.contact.linkedinUrl), '_blank', 'noopener,noreferrer')
      },
      {
        id: 'github',
        label: s.spActGithub,
        run: () => window.open(profile.contact.githubUrl, '_blank', 'noopener,noreferrer')
      },
      {
        id: 'tile',
        label: s.spActTile,
        run: () => tileAllWindows(true)
      },
      {
        id: 'lang',
        label: s.spActLang,
        run: () => document.getElementById('btn-lang-toggle')?.click()
      },
      {
        id: 'theme',
        label: s.spActTheme,
        run: () => document.getElementById('btn-theme-toggle')?.click()
      }
    ];
  }

  function renderSpotlightResults(cvModal, queryText = '') {
    const listEl = document.getElementById('spotlight-results');
    if (!listEl) return;
    const q = queryText.trim().toLowerCase();
    const all = getSpotlightActions(cvModal);
    const filtered = q ? all.filter((item) => item.label.toLowerCase().includes(q)) : all;
    currentSpotlightActions = filtered;
    state.spotlightSelectedIndex = 0;

    listEl.textContent = '';
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'spotlight-empty';
      empty.textContent = S().spotlightEmpty;
      listEl.appendChild(empty);
      return;
    }

    filtered.forEach((act, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `spotlight-result-btn ${idx === 0 ? 'is-selected' : ''}`;
      btn.setAttribute('role', 'option');
      btn.textContent = act.label;
      btn.addEventListener('click', () => {
        spotlightModal?.close();
        act.run();
      });
      listEl.appendChild(btn);
    });
  }

  function setupSpotlight(cvModal) {
    spotlightModal = Portfolio.createAccessibleModal('spotlight-modal');
    const triggerBtn = document.getElementById('btn-spotlight');
    const inputEl = document.getElementById('spotlight-input');

    function openSpotlight(opener) {
      if (inputEl) inputEl.value = '';
      renderSpotlightResults(cvModal, '');
      spotlightModal.open(opener);
    }

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => openSpotlight(triggerBtn));
    }

    if (inputEl) {
      inputEl.addEventListener('input', (e) => {
        renderSpotlightResults(cvModal, e.target.value || '');
      });

      inputEl.addEventListener('keydown', (e) => {
        const buttons = document.querySelectorAll('#spotlight-results .spotlight-result-btn');
        if (e.key === 'ArrowDown' && buttons.length) {
          e.preventDefault();
          state.spotlightSelectedIndex = (state.spotlightSelectedIndex + 1) % buttons.length;
          buttons.forEach((b, i) => b.classList.toggle('is-selected', i === state.spotlightSelectedIndex));
        } else if (e.key === 'ArrowUp' && buttons.length) {
          e.preventDefault();
          state.spotlightSelectedIndex = (state.spotlightSelectedIndex - 1 + buttons.length) % buttons.length;
          buttons.forEach((b, i) => b.classList.toggle('is-selected', i === state.spotlightSelectedIndex));
        } else if (e.key === 'Enter' && currentSpotlightActions.length) {
          e.preventDefault();
          const chosen = currentSpotlightActions[state.spotlightSelectedIndex] || currentSpotlightActions[0];
          spotlightModal.close();
          chosen?.run();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (spotlightModal.isOpen()) {
          spotlightModal.close();
        } else {
          if (cvModal.isOpen()) cvModal.close();
          if (projectModal?.isOpen()) projectModal.close();
          openSpotlight(document.activeElement);
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     IDIOMA ES/EN + TEMA OSCURO/CLARO + INICIALIZACIÓN
     ------------------------------------------------------------------------ */
  function updateThemeButtonLabel() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const label = isLight ? S().themeToDark : S().themeToLight;
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('title', label);
    btn.setAttribute('aria-label', label);
    btn.textContent = isLight ? '🌙' : '☀️';
  }

  function applyTranslations(announceToast = false, cvModal = null) {
    const s = S();
    const lang = L();

    document.documentElement.lang = lang;
    document.title = s.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && Object.prototype.hasOwnProperty.call(s, key)) {
        el.textContent = s[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && Object.prototype.hasOwnProperty.call(s, key)) {
        el.setAttribute('placeholder', s[key]);
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key && Object.prototype.hasOwnProperty.call(s, key)) {
        el.setAttribute('aria-label', s[key]);
      }
    });

    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.textContent = s.langBtnText;
      langBtn.setAttribute('aria-label', s.langBtnAria);
    }

    const spotlightBtn = document.getElementById('btn-spotlight');
    if (spotlightBtn) spotlightBtn.setAttribute('aria-label', s.spotlightBtnAria);

    const dockLabels = {
      about: s.dockAbout,
      projects: s.dockProjects,
      education: s.dockEdu,
      github: s.dockGithub,
      contact: s.dockContact
    };
    document.querySelectorAll('#mac-dock .dock-item[data-dock-target]').forEach((btn) => {
      const target = btn.getAttribute('data-dock-target');
      if (dockLabels[target]) btn.setAttribute('aria-label', dockLabels[target]);
    });
    document.getElementById('dock-cv-btn')?.setAttribute('aria-label', s.dockCv);

    updateThemeButtonLabel();
    updateMenubarActiveApp();
    updateMenubarClock();
    renderHero();
    renderProjects();
    updateDgtSimulatorDisplay();
    renderAcademicEducation();
    renderComplementaryCourses();
    renderCompetencies();
    renderContact();
    renderCvSheet();
    renderFooter();

    if (spotlightModal?.isOpen() && cvModal) {
      const inputEl = document.getElementById('spotlight-input');
      renderSpotlightResults(cvModal, inputEl ? inputEl.value : '');
    }
    if (projectModal?.isOpen()) {
      renderProjectModalContent(state.modalProjectIndex);
    }
    if (typeof Portfolio.refreshGitHubLanguage === 'function') {
      Portfolio.refreshGitHubLanguage();
    }

    if (announceToast) {
      showToast(s.toastLangChanged);
    }
  }

  function setupLanguageToggle(cvModal) {
    const langBtn = document.getElementById('btn-lang-toggle');
    if (!langBtn) return;
    langBtn.addEventListener('click', () => {
      const next = L() === 'es' ? 'en' : 'es';
      Portfolio.setLang(next);
      applyTranslations(true, cvModal);
    });
  }

  function setupThemeToggle() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;

    function applyTheme(theme) {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      updateThemeButtonLabel();
    }

    try {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved === 'light' || saved === 'dark') {
        applyTheme(saved);
      }
    } catch {
      // Ignorar
    }

    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem('portfolio_theme', next);
      } catch {
        // Ignorar
      }
      showToast(next === 'light' ? S().toastThemeLight : S().toastThemeDark);
    });
  }

  function initApp() {
    const cvModal = Portfolio.createAccessibleModal('cv-modal');

    setupWindowManager();
    setupDockDesktopAndMenus(cvModal);
    setupProjectModal();
    setupProjectWindowInteractions();
    setupThemeToggle();
    setupLanguageToggle(cvModal);

    const openCvBtn = document.getElementById('btn-open-cv');
    const dockCvBtn = document.getElementById('dock-cv-btn');
    const closeTopBtn = document.getElementById('btn-close-cv-top');
    const closeTlBtn = document.getElementById('btn-close-cv-tl');
    const closeBottomBtn = document.getElementById('btn-close-cv');
    const printBtn = document.getElementById('btn-print-cv');

    if (openCvBtn) openCvBtn.addEventListener('click', () => cvModal.open(openCvBtn));
    if (dockCvBtn) dockCvBtn.addEventListener('click', () => cvModal.open(dockCvBtn));
    if (closeTopBtn) closeTopBtn.addEventListener('click', () => cvModal.close());
    if (closeTlBtn) closeTlBtn.addEventListener('click', () => cvModal.close());
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', () => cvModal.close());
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    setupSpotlight(cvModal);

    if (typeof Portfolio.initGitHubSection === 'function') {
      Portfolio.initGitHubSection({
        username: P().contact.githubUser,
        onStateChange: (nextState) => {
          if (nextState.data && Array.isArray(nextState.data.repos)) {
            state.githubReposMap = new Map(nextState.data.repos.map((r) => [r.name, r]));
            renderProjects();
          }
        }
      });
    }

    applyTranslations(false, cvModal);
    setInterval(updateMenubarClock, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
