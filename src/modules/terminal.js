/**
 * Terminal interactiva bilingüe (ES/EN), compatible con file:// y https://.
 * Gestiona el único bucle requestAnimationFrame del sitio, pausado fuera de
 * pantalla, con la pestaña oculta y en modo estático en móvil o reduced-motion.
 */
(function () {
  window.Portfolio = window.Portfolio || {};

  let updateBadgeFn = null;
  let printIntroFn = null;

  function activeLang() {
    return typeof window.Portfolio.getLang === 'function' ? window.Portfolio.getLang() : 'es';
  }

  function activeProfile() {
    return typeof window.Portfolio.getProfile === 'function'
      ? window.Portfolio.getProfile()
      : window.Portfolio.PROFILE;
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
      const en = activeLang() === 'en';
      if (reducedMotionMq.matches || window.innerWidth < 768) {
        badgeEl.textContent = en ? 'Active (static mode)' : 'Activa (modo estático)';
      } else {
        badgeEl.textContent = en ? 'Active' : 'Activa';
      }
    }
    updateBadgeFn = updateBadge;

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

  window.Portfolio.refreshTerminalLanguage = function refreshTerminalLanguage() {
    if (typeof updateBadgeFn === 'function') updateBadgeFn();
    if (typeof printIntroFn === 'function') printIntroFn(true);
  };

  window.Portfolio.initTerminal = function initTerminal({ getGitHubState, openCvModal }) {
    const outputEl = document.getElementById('terminal-output');
    const formEl = document.getElementById('terminal-form');
    const inputEl = document.getElementById('terminal-input');
    const badgeEl = document.getElementById('terminal-loader-badge');
    const pulseCanvas = document.getElementById('terminal-pulse-canvas');
    const quickBtns = document.querySelectorAll('.term-cmd-btn[data-cmd]');

    if (!outputEl || !formEl || !inputEl) return;

    const COMMANDS = [
      'help', 'whoami', 'projects', 'education', 'courses',
      'skills', 'languages', 'github', 'contact', 'cv', 'clear'
    ];
    const history = [];
    let historyIndex = -1;

    function appendLine(text, variant = 'info') {
      const line = document.createElement('div');
      line.className = `term-line term-${variant}`;
      line.textContent = text;
      outputEl.appendChild(line);
      outputEl.scrollTop = outputEl.scrollHeight;
    }

    function printIntro(isLanguageSwitch = false) {
      const profile = activeProfile();
      const en = activeLang() === 'en';
      if (isLanguageSwitch) {
        outputEl.textContent = '';
      }
      appendLine(`${profile.name} — ${profile.role} (${profile.institution})`, 'accent');
      appendLine(
        en
          ? 'Click any button above or type "help" to browse education, courses, projects, or contact.'
          : 'Pulsa un botón o escribe "help" para consultar formación, cursos, proyectos o contacto.',
        'info'
      );
    }
    printIntroFn = printIntro;

    function runCommand(rawInput) {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const profile = activeProfile();
      const en = activeLang() === 'en';

      history.unshift(trimmed);
      historyIndex = -1;
      appendLine(`$ ${trimmed}`, 'cmd');

      const cmd = trimmed.toLowerCase();

      if (cmd === 'clear') {
        outputEl.textContent = '';
        return;
      }

      if (cmd === 'help') {
        appendLine(en ? 'Available commands:' : 'Comandos disponibles:', 'accent');
        appendLine(en ? '  whoami     -> Personal profile, bio, and availability' : '  whoami     -> Datos personales, perfil y disponibilidad');
        appendLine(en ? '  projects   -> Featured GitHub repositories' : '  projects   -> Proyectos destacados de GitHub');
        appendLine(en ? '  education  -> Academic degrees' : '  education  -> Formación académica (UCLM y Bachillerato)');
        appendLine(en ? '  courses    -> Complementary training (12 certifications)' : '  courses    -> Formación complementaria (12 certificaciones)');
        appendLine(en ? '  skills     -> Technical skills, stack & soft skills' : '  skills     -> Habilidades técnicas, stack aplicado y soft skills');
        appendLine(en ? '  languages  -> Spoken languages and proficiency' : '  languages  -> Idiomas y nivel acreditado');
        appendLine(en ? '  github     -> Live GitHub repository & byte metrics' : '  github     -> Estado y bytes por lenguaje desde GitHub');
        appendLine(en ? '  contact    -> Phone, email, city & GitHub' : '  contact    -> Teléfono, correo, ciudad y GitHub');
        appendLine(en ? '  cv         -> Open printable CV modal' : '  cv         -> Abrir vista rápida imprimible del CV');
        appendLine(en ? '  clear      -> Clear terminal output' : '  clear      -> Limpiar salida');
        return;
      }

      if (cmd === 'whoami') {
        appendLine(`${en ? 'Name' : 'Nombre'}:          ${profile.name}`, 'accent');
        appendLine(`${en ? 'Role' : 'Perfil'}:          ${profile.role} (${profile.institution})`);
        appendLine(`${en ? 'Location' : 'Ubicación'}:      ${profile.contact.location}`);
        appendLine(`${en ? 'About' : 'Sobre mí'}:       ${profile.about}`);
        appendLine(`${en ? 'Extra' : 'Info adicional'}: ${profile.additionalInfo.join(' · ')}`);
        return;
      }

      if (cmd === 'projects') {
        profile.featuredProjects.forEach((p, index) => {
          appendLine(`[${index + 1}] ${p.title}`, 'accent');
          appendLine(`    ${en ? 'Problem' : 'Problema'}:  ${p.problem}`);
          appendLine(`    ${en ? 'Solution' : 'Solución'}: ${p.solution}`);
          appendLine(`    Stack:    ${p.stack.join(', ')}`);
          appendLine(`    Repo:     ${p.repoUrl}`);
        });
        return;
      }

      if (cmd === 'education') {
        profile.academicEducation.forEach((item) => {
          appendLine(`• ${item.title}`, 'accent');
          appendLine(`  ${item.institution} | ${item.period}`);
        });
        return;
      }

      if (cmd === 'courses') {
        appendLine(
          en
            ? `Complementary training (${profile.complementaryCourses.length} courses):`
            : `Formación complementaria (${profile.complementaryCourses.length} cursos):`,
          'accent'
        );
        profile.complementaryCourses.forEach((c, idx) => {
          appendLine(`  ${String(idx + 1).padStart(2, '0')}. ${c.title} — ${c.provider} (${c.date})`);
        });
        return;
      }

      if (cmd === 'skills') {
        appendLine(en ? 'Technical skills (CV):' : 'Habilidades técnicas (CV):', 'accent');
        appendLine(`  ${profile.technicalSkills.join(' · ')}`);
        appendLine(en ? 'Applied GitHub stack:' : 'Tecnologías aplicadas en repositorios:', 'accent');
        appendLine(`  ${profile.appliedStack.join(' · ')}`);
        appendLine('Soft skills:', 'accent');
        appendLine(`  ${profile.softSkills.join(' · ')}`);
        return;
      }

      if (cmd === 'languages') {
        appendLine(en ? 'Languages:' : 'Idiomas:', 'accent');
        profile.languages.forEach((lang) => {
          appendLine(`  • ${lang.name}: ${lang.level}`);
        });
        return;
      }

      if (cmd === 'github') {
        const state = getGitHubState();
        if (!state || !state.data) {
          appendLine(en ? 'Querying GitHub API…' : 'Consultando GitHub API en curso…', 'info');
          return;
        }
        const sourceTag = state.mode === 'offline'
          ? (en ? '(offline snapshot)' : '(instantánea offline)')
          : (en ? '(live API)' : '(API en vivo)');
        appendLine(
          en
            ? `Own repositories ${sourceTag}: ${state.data.repos.length}`
            : `Repositorios propios ${sourceTag}: ${state.data.repos.length}`,
          'accent'
        );
        state.data.languageEntries.forEach((entry) => {
          const pct = state.data.totalBytes > 0
            ? ((entry.bytes / state.data.totalBytes) * 100).toFixed(1)
            : '0.0';
          appendLine(`  • ${entry.name}: ${entry.bytes} bytes (${pct}%)`);
        });
        return;
      }

      if (cmd === 'contact') {
        appendLine(`${en ? 'Phone' : 'Teléfono'}:   ${profile.contact.phone}`, 'accent');
        appendLine(`Email:     ${profile.contact.email}`);
        appendLine(`${en ? 'Location' : 'Ubicación'}: ${profile.contact.location}`);
        if (profile.contact.linkedinUrl) {
          appendLine(`LinkedIn:  ${profile.contact.linkedinUrl}`);
        }
        appendLine(`GitHub:    ${profile.contact.githubUrl}`);
        return;
      }

      if (cmd === 'cv') {
        appendLine(en ? 'Opening quick CV view…' : 'Abriendo vista rápida del CV…', 'accent');
        openCvModal(inputEl);
        return;
      }

      appendLine(
        en
          ? `Unknown command: "${trimmed}". Type "help" to list commands.`
          : `Comando no reconocido: "${trimmed}". Escribe "help" para ver opciones.`,
        'warn'
      );
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

    printIntro(false);
    initPulseIndicator(pulseCanvas, badgeEl);
  };
})();
