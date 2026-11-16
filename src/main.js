/**
 * Punto de entrada interactivo del portfolio (compatible con file:// y GitHub Pages).
 * Construye toda la interfaz de forma segura usando textContent (nunca innerHTML).
 */
(function () {
  const Portfolio = window.Portfolio || {};
  const PROFILE = Portfolio.PROFILE;
  if (!PROFILE) return;

  const state = {
    filter: 'all',
    query: '',
    currentProjects: PROFILE.projects.slice(),
    modalProjectIndex: 0
  };

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

  async function copyEmailToClipboard() {
    const email = PROFILE.contact.email;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(email);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      showToast(`Email copiado: ${email}`);
    } catch {
      const temp = document.createElement('input');
      temp.value = email;
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        showToast(`Email copiado: ${email}`);
      } catch {
        showToast(`Correo: ${email}`);
      }
      document.body.removeChild(temp);
    }
  }

  function getFilteredProjects() {
    const q = state.query.trim().toLowerCase();
    return PROFILE.projects.filter((project) => {
      const matchesCat =
        state.filter === 'all' ||
        (Array.isArray(project.categories) && project.categories.includes(state.filter));
      if (!matchesCat) return false;
      if (!q) return true;
      const haystack = [
        project.title,
        project.problem,
        project.solution,
        ...(project.stack || [])
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderHero() {
    const nameEl = document.getElementById('hero-name');
    const roleEl = document.getElementById('hero-role');
    const headlineEl = document.getElementById('hero-headline');
    const locationEl = document.getElementById('hero-location');
    const availabilityEl = document.getElementById('hero-availability');
    const ghLinkEl = document.getElementById('hero-github-link');
    const stripEl = document.getElementById('hero-contact-strip');

    if (nameEl) nameEl.textContent = PROFILE.name;
    if (roleEl) roleEl.textContent = PROFILE.role;
    if (headlineEl) headlineEl.textContent = PROFILE.headline;
    if (locationEl) locationEl.textContent = PROFILE.location;
    if (availabilityEl) availabilityEl.textContent = PROFILE.availability;

    if (ghLinkEl) {
      ghLinkEl.href = PROFILE.contact.githubUrl;
      ghLinkEl.textContent = `GitHub (@${PROFILE.contact.githubUser})`;
    }

    if (stripEl) {
      stripEl.textContent = '';

      const emailItem = document.createElement('div');
      emailItem.className = 'contact-pill';
      const emailLabel = document.createElement('span');
      emailLabel.className = 'contact-pill-label';
      emailLabel.textContent = 'Email: ';
      const mailLink = document.createElement('a');
      mailLink.href = `mailto:${PROFILE.contact.email}`;
      mailLink.textContent = PROFILE.contact.email;
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.id = 'btn-copy-email';
      copyBtn.className = 'btn btn-ghost btn-xs';
      copyBtn.textContent = 'Copiar email';
      copyBtn.addEventListener('click', copyEmailToClipboard);
      emailItem.append(emailLabel, mailLink, copyBtn);

      const linkedinItem = document.createElement('div');
      linkedinItem.className = 'contact-pill';
      const liLabel = document.createElement('span');
      liLabel.className = 'contact-pill-label';
      liLabel.textContent = 'LinkedIn: ';
      const liLink = document.createElement('a');
      liLink.href = PROFILE.contact.linkedin;
      liLink.target = '_blank';
      liLink.rel = 'noopener noreferrer';
      liLink.textContent = 'Perfil profesional';
      linkedinItem.append(liLabel, liLink);

      stripEl.append(emailItem, linkedinItem);
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
    const list = state.currentProjects.length ? state.currentProjects : PROFILE.projects;
    const safeIdx = ((projectIndex % list.length) + list.length) % list.length;
    state.modalProjectIndex = safeIdx;
    const project = list[safeIdx];

    const indexEl = document.getElementById('proj-modal-index');
    const titleEl = document.getElementById('proj-modal-title');
    const figureEl = document.getElementById('proj-modal-figure');
    const imgEl = document.getElementById('proj-modal-img');
    const summaryPanel = document.getElementById('proj-tab-panel-summary');
    const codePanel = document.getElementById('proj-tab-panel-code');
    const stackPanel = document.getElementById('proj-tab-panel-stack');
    const linksGroup = document.getElementById('proj-modal-external-links');

    if (indexEl) indexEl.textContent = `Proyecto ${safeIdx + 1} de ${list.length}`;
    if (titleEl) titleEl.textContent = project.title;

    if (figureEl && imgEl) {
      if (project.image) {
        figureEl.hidden = false;
        imgEl.src = project.image;
        imgEl.alt = project.imageAlt || `Captura de ${project.title}`;
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
      strongProb.textContent = 'Problema: ';
      pProb.append(strongProb, document.createTextNode(project.problem));

      const pSol = document.createElement('p');
      const strongSol = document.createElement('strong');
      strongSol.textContent = 'Solución: ';
      pSol.append(strongSol, document.createTextNode(project.solution));

      summaryPanel.append(pProb, pSol);
    }

    if (codePanel) {
      codePanel.textContent = '';
      const pre = document.createElement('pre');
      pre.className = 'proj-code-block';
      pre.textContent = project.codeSnippet || '// Sin fragmento técnico configurado.';
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
      repoBtn.textContent = 'Abrir en GitHub';
      linksGroup.appendChild(repoBtn);

      if (project.demoUrl) {
        const demoBtn = document.createElement('a');
        demoBtn.className = 'btn btn-ghost btn-sm';
        demoBtn.href = project.demoUrl;
        demoBtn.target = '_blank';
        demoBtn.rel = 'noopener noreferrer';
        demoBtn.textContent = 'Ver demo';
        linksGroup.appendChild(demoBtn);
      }
    }

    setProjectModalTab('summary');
  }

  function openProjectModal(projectId, triggerEl) {
    const list = state.currentProjects.length ? state.currentProjects : PROFILE.projects;
    const idx = Math.max(0, list.findIndex((p) => p.id === projectId));
    renderProjectModalContent(idx);
    if (projectModal) projectModal.open(triggerEl);
  }

  function renderProjects() {
    const container = document.getElementById('projects-list');
    const countEl = document.getElementById('project-count');
    if (!container) return;

    const filtered = getFilteredProjects();
    state.currentProjects = filtered;
    container.textContent = '';

    if (countEl) {
      countEl.textContent = `Mostrando ${filtered.length} de ${PROFILE.projects.length} proyectos`;
    }

    if (filtered.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'surface-card';
      const p = document.createElement('p');
      p.textContent = 'Ningún proyecto coincide con tu búsqueda actual.';
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn btn-secondary btn-sm';
      resetBtn.style.marginTop = '0.75rem';
      resetBtn.textContent = 'Mostrar todos los proyectos';
      resetBtn.addEventListener('click', () => {
        state.filter = 'all';
        state.query = '';
        const searchInput = document.getElementById('project-search');
        if (searchInput) searchInput.value = '';
        updateFilterButtons('all');
        renderProjects();
      });
      emptyCard.append(p, resetBtn);
      container.appendChild(emptyCard);
      return;
    }

    for (const project of filtered) {
      const card = document.createElement('article');
      card.className = 'surface-card project-card';

      // Foto opcional del proyecto (solo se pinta si project.image tiene ruta)
      if (project.image) {
        const mediaBtn = document.createElement('button');
        mediaBtn.type = 'button';
        mediaBtn.className = 'project-media-btn';
        mediaBtn.setAttribute('aria-label', `Ampliar captura de ${project.title}`);

        const img = document.createElement('img');
        img.className = 'project-media-img';
        img.src = project.image;
        img.alt = project.imageAlt || `Captura de ${project.title}`;
        img.loading = 'lazy';

        const badge = document.createElement('span');
        badge.className = 'project-media-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = '🔍 Ampliar';

        mediaBtn.append(img, badge);
        mediaBtn.addEventListener('click', () => openProjectModal(project.id, mediaBtn));
        card.appendChild(mediaBtn);
      }

      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.title;

      const dl = document.createElement('dl');
      dl.className = 'project-details';

      const dtProb = document.createElement('dt');
      dtProb.textContent = 'Problema';
      const ddProb = document.createElement('dd');
      ddProb.textContent = project.problem;

      const dtSol = document.createElement('dt');
      dtSol.textContent = 'Solución';
      const ddSol = document.createElement('dd');
      ddSol.textContent = project.solution;

      dl.append(dtProb, ddProb, dtSol, ddSol);

      const stackList = document.createElement('ul');
      stackList.className = 'tag-list';
      stackList.setAttribute('aria-label', `Tecnologías de ${project.title}`);
      for (const tech of project.stack) {
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
      detailBtn.textContent = 'Ver detalles';
      detailBtn.addEventListener('click', () => openProjectModal(project.id, detailBtn));
      links.appendChild(detailBtn);

      const repoLink = document.createElement('a');
      repoLink.className = 'btn btn-secondary btn-sm';
      repoLink.href = project.repoUrl;
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';
      repoLink.textContent = 'GitHub';
      links.appendChild(repoLink);

      if (project.demoUrl) {
        const demoLink = document.createElement('a');
        demoLink.className = 'btn btn-ghost btn-sm';
        demoLink.href = project.demoUrl;
        demoLink.target = '_blank';
        demoLink.rel = 'noopener noreferrer';
        demoLink.textContent = 'Demo';
        links.appendChild(demoLink);
      }

      card.append(title, dl, stackList, links);
      container.appendChild(card);
    }
  }

  function updateFilterButtons(activeKey) {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    filterBtns.forEach((b) => {
      const isMatch = b.getAttribute('data-filter') === activeKey;
      b.classList.toggle('active', isMatch);
      b.setAttribute('aria-pressed', String(isMatch));
    });
  }

  function setupProjectControls() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.filter = btn.getAttribute('data-filter') || 'all';
        updateFilterButtons(state.filter);
        renderProjects();
      });
    });

    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.query = e.target.value || '';
        renderProjects();
      });
    }
  }

  function setupProjectModal() {
    projectModal = Portfolio.createAccessibleModal('project-modal');
    const closeBtn = document.getElementById('btn-close-project-modal');
    const prevBtn = document.getElementById('btn-prev-project');
    const nextBtn = document.getElementById('btn-next-project');
    const tabBtns = document.querySelectorAll('.proj-tab-btn[data-proj-tab]');

    if (closeBtn) closeBtn.addEventListener('click', () => projectModal.close());
    if (prevBtn) {
      prevBtn.addEventListener('click', () => renderProjectModalContent(state.modalProjectIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => renderProjectModalContent(state.modalProjectIndex + 1));
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        setProjectModalTab(btn.getAttribute('data-proj-tab') || 'summary');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (!projectModal.isOpen()) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        renderProjectModalContent(state.modalProjectIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        renderProjectModalContent(state.modalProjectIndex + 1);
      }
    });
  }

  function renderTimeline() {
    const list = document.getElementById('timeline-list');
    if (!list) return;
    list.textContent = '';

    for (const item of PROFILE.experienceAndEducation) {
      const li = document.createElement('li');
      li.className = 'surface-card timeline-item';

      const typeTag = document.createElement('span');
      typeTag.className = 'timeline-type';
      typeTag.textContent = item.type;

      const title = document.createElement('h3');
      title.className = 'timeline-title';
      title.textContent = item.title;

      const detail = document.createElement('p');
      detail.className = 'timeline-detail';
      detail.textContent = item.detail;

      li.append(typeTag, title, detail);
      list.appendChild(li);
    }
  }

  function resolveSkillSearchTerm(skillText) {
    const map = [
      ['HTML5', 'HTML5'],
      ['CSS3', 'CSS3'],
      ['JavaScript', 'JavaScript'],
      ['TypeScript', 'TypeScript'],
      ['React', 'React'],
      ['Node.js', 'Node.js'],
      ['Python', 'Python'],
      ['Java', 'Java'],
      ['PostgreSQL', 'PostgreSQL'],
      ['Redis', 'Redis'],
      ['JUnit', 'JUnit'],
      ['GitHub Actions', 'GitHub Actions'],
      ['Docker', 'Docker']
    ];
    for (const [needle, term] of map) {
      if (skillText.includes(needle)) return term;
    }
    return null;
  }

  function renderSkills() {
    const container = document.getElementById('skills-list');
    if (!container) return;
    container.textContent = '';

    for (const group of PROFILE.skills) {
      const card = document.createElement('article');
      card.className = 'surface-card skill-group-card';

      const title = document.createElement('h3');
      title.textContent = group.category;

      const ul = document.createElement('ul');
      ul.className = 'tag-list';

      for (const item of group.items) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag tag-interactive';
        btn.textContent = item;
        btn.title = `Buscar proyectos relacionados con ${item}`;
        btn.addEventListener('click', () => {
          const term = resolveSkillSearchTerm(item);
          if (!term) {
            showToast(`${item} forma parte transversal de todos los proyectos.`);
            return;
          }
          state.filter = 'all';
          state.query = term;
          updateFilterButtons('all');
          const searchInput = document.getElementById('project-search');
          if (searchInput) searchInput.value = term;
          renderProjects();
          document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast(`Filtrando proyectos por "${term}"`);
        });
        li.appendChild(btn);
        ul.appendChild(li);
      }

      card.append(title, ul);
      container.appendChild(card);
    }
  }

  function renderContact() {
    const contactList = document.getElementById('contact-list');
    if (!contactList) return;
    contactList.textContent = '';

    const entries = [
      { label: 'Correo electrónico', value: PROFILE.contact.email, href: `mailto:${PROFILE.contact.email}`, external: false, isEmail: true },
      { label: 'LinkedIn', value: PROFILE.contact.linkedin, href: PROFILE.contact.linkedin, external: true, isEmail: false },
      { label: 'GitHub', value: PROFILE.contact.githubUrl, href: PROFILE.contact.githubUrl, external: true, isEmail: false }
    ];

    for (const entry of entries) {
      const card = document.createElement('article');
      card.className = 'surface-card contact-card';

      const heading = document.createElement('h3');
      heading.className = 'contact-card-label';
      heading.textContent = entry.label;

      const valueBox = document.createElement('div');
      valueBox.className = 'contact-card-value';

      const link = document.createElement('a');
      link.href = entry.href;
      if (entry.external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      link.textContent = entry.value;
      valueBox.appendChild(link);

      if (entry.isEmail) {
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-ghost btn-xs';
        copyBtn.textContent = 'Copiar';
        copyBtn.addEventListener('click', copyEmailToClipboard);
        valueBox.appendChild(copyBtn);
      }

      card.append(heading, valueBox);
      contactList.appendChild(card);
    }
  }

  function renderCvSheet() {
    const sheet = document.getElementById('cv-modal-content');
    const pdfLink = document.getElementById('cv-pdf-link');

    if (pdfLink) {
      if (!PROFILE.contact.cvPdfUrl) {
        pdfLink.hidden = true;
      } else {
        pdfLink.hidden = false;
        pdfLink.href = PROFILE.contact.cvPdfUrl;
      }
    }

    if (!sheet) return;
    sheet.textContent = '';

    const header = document.createElement('div');
    header.className = 'cv-header';

    const nameH3 = document.createElement('h3');
    nameH3.textContent = PROFILE.name;

    const roleP = document.createElement('p');
    roleP.className = 'cv-role';
    roleP.textContent = PROFILE.role;

    const contactP = document.createElement('p');
    contactP.className = 'cv-contact-line';
    contactP.textContent =
      `GitHub: ${PROFILE.contact.githubUrl} · Email: ${PROFILE.contact.email} · LinkedIn: ${PROFILE.contact.linkedin}`;

    header.append(nameH3, roleP, contactP);
    sheet.appendChild(header);

    const summarySec = document.createElement('section');
    summarySec.className = 'cv-section';
    const summaryH4 = document.createElement('h4');
    summaryH4.textContent = 'Perfil Profesional';
    const summaryP = document.createElement('p');
    summaryP.textContent = PROFILE.headline;
    summarySec.append(summaryH4, summaryP);
    sheet.appendChild(summarySec);

    const projSec = document.createElement('section');
    projSec.className = 'cv-section';
    const projH4 = document.createElement('h4');
    projH4.textContent = 'Proyectos Destacados';
    projSec.appendChild(projH4);

    for (const p of PROFILE.projects) {
      const item = document.createElement('div');
      item.className = 'cv-item';

      const itemTitle = document.createElement('strong');
      itemTitle.textContent = `${p.title} (${p.stack.join(', ')})`;

      const itemProblem = document.createElement('p');
      itemProblem.textContent = `Problema: ${p.problem}`;

      const itemSolution = document.createElement('p');
      itemSolution.textContent = `Solución: ${p.solution}`;

      const itemRepo = document.createElement('p');
      itemRepo.className = 'cv-repo-url';
      itemRepo.textContent = p.repoUrl;

      item.append(itemTitle, itemProblem, itemSolution, itemRepo);
      projSec.appendChild(item);
    }
    sheet.appendChild(projSec);

    const eduSec = document.createElement('section');
    eduSec.className = 'cv-section';
    const eduH4 = document.createElement('h4');
    eduH4.textContent = 'Formación y Experiencia';
    eduSec.appendChild(eduH4);

    for (const e of PROFILE.experienceAndEducation) {
      const item = document.createElement('div');
      item.className = 'cv-item';

      const itemTitle = document.createElement('strong');
      itemTitle.textContent = `${e.type}: ${e.title}`;

      const itemDetail = document.createElement('p');
      itemDetail.textContent = e.detail;

      item.append(itemTitle, itemDetail);
      eduSec.appendChild(item);
    }
    sheet.appendChild(eduSec);

    const skillSec = document.createElement('section');
    skillSec.className = 'cv-section';
    const skillH4 = document.createElement('h4');
    skillH4.textContent = 'Tecnologías';
    skillSec.appendChild(skillH4);

    for (const s of PROFILE.skills) {
      const p = document.createElement('p');
      p.textContent = `${s.category}: ${s.items.join(', ')}`;
      skillSec.appendChild(p);
    }
    sheet.appendChild(skillSec);
  }

  function renderFooter() {
    const yearEl = document.getElementById('footer-year');
    const nameEl = document.getElementById('footer-name');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    if (nameEl) nameEl.textContent = PROFILE.name;
  }

  function setupThemeToggle() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;

    function applyTheme(theme) {
      const isLight = theme === 'light';
      if (isLight) {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      btn.setAttribute('aria-pressed', String(isLight));
      btn.textContent = isLight ? '🌙 Tema oscuro' : '☀️ Tema claro';
    }

    try {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved === 'light' || saved === 'dark') {
        applyTheme(saved);
      }
    } catch {
      // Ignorar si almacenamiento local no disponible
    }

    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem('portfolio_theme', next);
      } catch {
        // Ignorar
      }
      showToast(next === 'light' ? 'Tema claro activado' : 'Tema oscuro activado');
    });
  }

  function setupCardSpotlight() {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const mainEl = document.getElementById('main-content');
    if (!mainEl || reducedMotion || !finePointer) return;

    mainEl.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.surface-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });
  }

  function setupScrollReveal() {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('.content-section');
    sections.forEach((sec) => sec.classList.add('reveal-target'));
    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  function initApp() {
    renderHero();
    setupProjectModal();
    renderProjects();
    setupProjectControls();
    renderTimeline();
    renderSkills();
    renderContact();
    renderCvSheet();
    renderFooter();
    setupThemeToggle();
    setupCardSpotlight();
    setupScrollReveal();

    const cvModal = Portfolio.createAccessibleModal('cv-modal');
    const openBtn = document.getElementById('btn-open-cv');
    const openFooterBtn = document.getElementById('btn-open-cv-footer');
    const closeTopBtn = document.getElementById('btn-close-cv-top');
    const closeBottomBtn = document.getElementById('btn-close-cv');
    const printBtn = document.getElementById('btn-print-cv');

    if (openBtn) openBtn.addEventListener('click', () => cvModal.open(openBtn));
    if (openFooterBtn) openFooterBtn.addEventListener('click', () => cvModal.open(openFooterBtn));
    if (closeTopBtn) closeTopBtn.addEventListener('click', () => cvModal.close());
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', () => cvModal.close());
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    let githubState = { ok: false, mode: 'loading', data: null, error: null };
    if (typeof Portfolio.initGitHubSection === 'function') {
      Portfolio.initGitHubSection({
        username: PROFILE.contact.githubUser,
        onStateChange: (nextState) => {
          githubState = nextState;
        }
      });
    }

    if (typeof Portfolio.initTerminal === 'function') {
      Portfolio.initTerminal({
        profile: PROFILE,
        getGitHubState: () => githubState,
        openCvModal: (trigger) => cvModal.open(trigger)
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
