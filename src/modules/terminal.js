/**
 * Módulo de Terminal Interactiva (único elemento "wow", cargado en diferido).
 * Incluye el único bucle requestAnimationFrame del sitio, pausado fuera de pantalla,
 * con pestaña oculta y desactivado en móvil o con prefers-reduced-motion.
 */
export function initTerminal({ profile, getGitHubState, openCvModal, collectTodoItems }) {
  const outputEl = document.getElementById('terminal-output');
  const formEl = document.getElementById('terminal-form');
  const inputEl = document.getElementById('terminal-input');
  const badgeEl = document.getElementById('terminal-loader-badge');
  const pulseCanvas = document.getElementById('terminal-pulse-canvas');
  const quickBtns = document.querySelectorAll('.term-cmd-btn[data-cmd]');

  if (!outputEl || !formEl || !inputEl) return;

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
      appendLine('  whoami     -> Nombre, rol objetivo, ubicación y disponibilidad');
      appendLine('  projects   -> Proyectos reales con problema, solución y repositorio');
      appendLine('  github     -> Estado y bytes por lenguaje desde la API de GitHub');
      appendLine('  skills     -> Tecnologías declaradas en src/data/profile.js');
      appendLine('  education  -> Formación y experiencia');
      appendLine('  contact    -> Email, LinkedIn y GitHub');
      appendLine('  todos      -> Lista de campos TODO: pendientes por rellenar');
      appendLine('  cv         -> Abrir diálogo accesible de CV / PDF');
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
      if (!state || (!state.ok && !state.error)) {
        appendLine('Consultando GitHub API en curso…', 'info');
        return;
      }
      if (!state.ok) {
        appendLine(`Error GitHub API: ${state.error}`, 'warn');
        return;
      }
      appendLine(`Repositorios propios (sin forks): ${state.data.repos.length}`, 'accent');
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
      appendLine(`CV PDF:   ${profile.contact.cvPdfUrl}`);
      return;
    }

    if (cmd === 'todos') {
      const pending = collectTodoItems();
      if (pending.length === 0) {
        appendLine('No queda ningún marcador TODO: pendiente en src/data/profile.js.', 'accent');
      } else {
        appendLine(`Campos TODO: pendientes (${pending.length}):`, 'warn');
        pending.forEach((t) => appendLine(`  • ${t.path}: ${t.value}`));
      }
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
    }
  });

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) runCommand(cmd);
      inputEl.focus();
    });
  });

  appendLine('Terminal cargada en diferido. Escribe "help" para consultar datos del portfolio.', 'accent');

  // Bucle único de animación pausable para el indicador visual de la terminal
  initPulseIndicator(pulseCanvas, badgeEl);
}

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
      badgeEl.textContent = 'Activa (carga diferida)';
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
  reducedMotionMq.addEventListener('change', syncAnimationState);

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

