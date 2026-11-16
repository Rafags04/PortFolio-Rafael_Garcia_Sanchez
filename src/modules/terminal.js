/**
 * Terminal interactiva compatible con file:// y https://.
 * Gestiona el único bucle requestAnimationFrame del sitio, pausado fuera de
 * pantalla, con la pestaña oculta y en modo estático en móvil o reduced-motion.
 */
(function () {
  window.Portfolio = window.Portfolio || {};

  function initPulseIndicator(canvas, badgeEl) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisibleInViewport = true;
    let rafId = null;

    function shouldAnimate() {
      return (
        !reducedMotionMq.matches &&
        window.innerWidth >= 768 &&
        !document.hidden &&
        isVisibleInViewport
      );
    }

    function drawStaticDot() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(10, 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    function updateBadge() {
      if (!badgeEl) return;
      if (reducedMotionMq.matches || window.innerWidth < 768) {
        badgeEl.textContent = 'Activa (modo estático)';
      } else {
        badgeEl.textContent = 'Activa';
      }
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      drawStaticDot();
    }

    function frame(timestamp) {
      if (!shouldAnimate()) {
        stopLoop();
        return;
      }
      const phase = (Math.sin(timestamp * 0.004) + 1) * 0.5;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = `rgba(56, 189, 248, ${(0.25 + phase * 0.5).toFixed(2)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(10, 10, 4.5 + phase * 3.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(10, 10, 3.2, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(frame);
    }

    function syncAnimationState() {
      updateBadge();
      if (shouldAnimate()) {
        if (rafId === null) {
          rafId = requestAnimationFrame(frame);
        }
      } else {
        stopLoop();
      }
    }

    document.addEventListener('visibilitychange', syncAnimationState);
    window.addEventListener('resize', syncAnimationState, { passive: true });
    if (typeof reducedMotionMq.addEventListener === 'function') {
      reducedMotionMq.addEventListener('change', syncAnimationState);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          isVisibleInViewport = entries.some((entry) => entry.isIntersecting);
          syncAnimationState();
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    syncAnimationState();
  }

  window.Portfolio.initTerminal = function initTerminal({ profile, getGitHubState, openCvModal }) {
    const outputEl = document.getElementById('terminal-output');
    const formEl = document.getElementById('terminal-form');
    const inputEl = document.getElementById('terminal-input');
    const badgeEl = document.getElementById('terminal-loader-badge');
    const pulseCanvas = document.getElementById('terminal-pulse-canvas');
    const quickBtns = document.querySelectorAll('.term-cmd-btn[data-cmd]');

    if (!outputEl || !formEl || !inputEl) return;

    const COMMANDS = ['help', 'whoami', 'projects', 'github', 'skills', 'education', 'contact', 'cv', 'clear'];
    const history = [];
    let historyIndex = -1;

    function appendLine(text, variant = 'info') {
      const line = document.createElement('div');
      line.className = `term-line term-${variant}`;
      line.textContent = text;
      outputEl.appendChild(line);
      outputEl.scrollTop = outputEl.scrollHeight;
    }

    function runCommand(rawInput) {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      history.unshift(trimmed);
      historyIndex = -1;
      appendLine(`$ ${trimmed}`, 'cmd');

      const cmd = trimmed.toLowerCase();

      if (cmd === 'clear') {
        outputEl.textContent = '';
        return;
      }

      if (cmd === 'help') {
        appendLine('Comandos disponibles:', 'accent');
        appendLine('  whoami     -> Nombre, rol, ubicación y disponibilidad');
        appendLine('  projects   -> Proyectos con problema, solución y repositorio');
        appendLine('  github     -> Estado y bytes por lenguaje desde GitHub');
        appendLine('  skills     -> Stack técnico por áreas');
        appendLine('  education  -> Formación académica y experiencia');
        appendLine('  contact    -> Email, LinkedIn y GitHub');
        appendLine('  cv         -> Abrir diálogo accesible de CV imprimible');
        appendLine('  clear      -> Limpiar salida');
        return;
      }

      if (cmd === 'whoami') {
        appendLine(`Nombre:         ${profile.name}`, 'accent');
        appendLine(`Rol:            ${profile.role}`);
        appendLine(`Resumen:        ${profile.headline}`);
        appendLine(`Ubicación:      ${profile.location}`);
        appendLine(`Disponibilidad: ${profile.availability}`);
        return;
      }

      if (cmd === 'projects') {
        profile.projects.forEach((p, index) => {
          appendLine(`[${index + 1}] ${p.title}`, 'accent');
          appendLine(`    Problema: ${p.problem}`);
          appendLine(`    Solución: ${p.solution}`);
          appendLine(`    Stack:    ${p.stack.join(', ')}`);
          appendLine(`    Repo:     ${p.repoUrl}`);
        });
        return;
      }

      if (cmd === 'github') {
        const state = getGitHubState();
        if (!state || !state.data) {
          appendLine('Consultando GitHub API en curso…', 'info');
          return;
        }
        const sourceTag = state.mode === 'demo' ? '(modo demo sin conexión)' : '(API en vivo)';
        appendLine(`Repositorios propios ${sourceTag}: ${state.data.repos.length}`, 'accent');
        state.data.languageEntries.forEach((entry) => {
          const pct = state.data.totalBytes > 0
            ? ((entry.bytes / state.data.totalBytes) * 100).toFixed(1)
            : '0.0';
          appendLine(`  • ${entry.name}: ${entry.bytes} bytes (${pct}%)`);
        });
        return;
      }

      if (cmd === 'skills') {
        profile.skills.forEach((group) => {
          appendLine(`${group.category}:`, 'accent');
          appendLine(`  ${group.items.join(' · ')}`);
        });
        return;
      }

      if (cmd === 'education') {
        profile.experienceAndEducation.forEach((item) => {
          appendLine(`[${item.type}] ${item.title}`, 'accent');
          appendLine(`  ${item.detail}`);
        });
        return;
      }

      if (cmd === 'contact') {
        appendLine(`Email:    ${profile.contact.email}`);
        appendLine(`LinkedIn: ${profile.contact.linkedin}`);
        appendLine(`GitHub:   ${profile.contact.githubUrl}`);
        return;
      }

      if (cmd === 'cv') {
        appendLine('Abriendo diálogo accesible de CV…', 'accent');
        openCvModal(inputEl);
        return;
      }

      appendLine(`Comando no reconocido: "${trimmed}". Escribe "help" para ver opciones.`, 'warn');
    }

    formEl.addEventListener('submit', (event) => {
      event.preventDefault();
      runCommand(inputEl.value);
      inputEl.value = '';
    });

    inputEl.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex += 1;
          inputEl.value = history[historyIndex];
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex > 0) {
          historyIndex -= 1;
          inputEl.value = history[historyIndex];
        } else {
          historyIndex = -1;
          inputEl.value = '';
        }
      } else if (event.key === 'Tab') {
        event.preventDefault();
        const val = inputEl.value.trim().toLowerCase();
        const match = COMMANDS.find((c) => c.startsWith(val));
        if (match) inputEl.value = match;
      }
    });

    quickBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) runCommand(cmd);
        inputEl.focus();
      });
    });

    // Arranque pre-iniciado con resumen rápido y guía
    appendLine(`${profile.name} — ${profile.role}`, 'accent');
    appendLine('Sistema listo. Pulsa un botón superior o escribe "help" para consultar secciones.', 'info');

    initPulseIndicator(pulseCanvas, badgeEl);
  };
})();
