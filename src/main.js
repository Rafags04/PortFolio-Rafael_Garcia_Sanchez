/**
 * Punto de entrada del portfolio real de Rafael García Sánchez.
 * Construye toda la interfaz de forma segura usando textContent (nunca innerHTML).
 */
(function () {
  const Portfolio = window.Portfolio || {};
  const PROFILE = Portfolio.PROFILE;
  if (!PROFILE) return;

  const state = {
    projectFilter: 'all',
    projectQuery: '',
    courseFilter: 'all',
    currentProjects: PROFILE.featuredProjects.slice(),
    modalProjectIndex: 0,
    githubReposMap: new Map()
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

  async function copyToClipboard(text, label) {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard unavailable');
      }
      showToast(`${label} copiado: ${text}`);
    } catch {
      const temp = document.createElement('input');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        showToast(`${label} copiado: ${text}`);
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
    return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short' }).format(d);
  }

  function renderHero() {
    const avatarEl = document.getElementById('hero-avatar');
    const nameEl = document.getElementById('hero-name');
    const roleEl = document.getElementById('hero-role');
    const aboutEl = document.getElementById('hero-about');
    const locBadge = document.getElementById('hero-location-badge');
    const phoneLink = document.getElementById('hero-phone-link');
    const emailLink = document.getElementById('hero-email-link');
    const ghLink = document.getElementById('hero-github-link');
    const downloadCvBtn = document.getElementById('btn-download-cv');
    const copyPhoneBtn = document.getElementById('btn-copy-phone');
    const copyEmailBtn = document.getElementById('btn-copy-email');

    if (avatarEl && PROFILE.avatar) avatarEl.src = PROFILE.avatar;
    if (nameEl) nameEl.textContent = PROFILE.name;
    if (roleEl) roleEl.textContent = `${PROFILE.role} · ${PROFILE.institution}`;
    if (aboutEl) aboutEl.textContent = PROFILE.about;
    if (locBadge) locBadge.textContent = PROFILE.contact.location;

    if (phoneLink) {
      phoneLink.href = PROFILE.contact.phoneHref;
      phoneLink.textContent = PROFILE.contact.phone;
    }
    if (emailLink) {
      emailLink.href = `mailto:${PROFILE.contact.email}`;
      emailLink.textContent = PROFILE.contact.email;
    }
    if (ghLink) {
      ghLink.href = PROFILE.contact.githubUrl;
      ghLink.textContent = `GitHub (@${PROFILE.contact.githubUser})`;
    }
    if (downloadCvBtn && PROFILE.contact.cvPdfUrl) {
      downloadCvBtn.href = PROFILE.contact.cvPdfUrl;
    }

    if (copyPhoneBtn) {
      copyPhoneBtn.addEventListener('click', () =>
        copyToClipboard(PROFILE.contact.phone, 'Teléfono')
      );
    }
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () =>
        copyToClipboard(PROFILE.contact.email, 'Email')
      );
    }
  }

  function getFilteredProjects() {
    const q = state.projectQuery.trim().toLowerCase();
    return PROFILE.featuredProjects.filter((project) => {
      const matchesCat =
        state.projectFilter === 'all' ||
        (Array.isArray(project.categories) && project.categories.includes(state.projectFilter));
      if (!matchesCat) return false;
      if (!q) return true;
      const haystack = [
        project.title,
        project.repoName || '',
        project.problem,
        project.solution,
        ...(project.stack || [])
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
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
    const list = state.currentProjects.length ? state.currentProjects : PROFILE.featuredProjects;
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

    if (indexEl) indexEl.textContent = `Proyecto destacado ${safeIdx + 1} de ${list.length}`;
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
      pre.textContent = project.codeSnippet || '// Sin fragmento configurado.';
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
      repoBtn.textContent = 'Abrir repositorio en GitHub';
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
    const list = state.currentProjects.length ? state.currentProjects : PROFILE.featuredProjects;
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
      countEl.textContent = `Mostrando ${filtered.length} de ${PROFILE.featuredProjects.length} proyectos destacados`;
    }

    if (filtered.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'surface-card';
      const p = document.createElement('p');
      p.textContent = 'Ningún proyecto destacado coincide con tu filtro actual.';
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn btn-secondary btn-sm';
      resetBtn.style.marginTop = '0.75rem';
      resetBtn.textContent = 'Mostrar todos los destacados';
      resetBtn.addEventListener('click', () => {
        state.projectFilter = 'all';
        state.projectQuery = '';
        const searchInput = document.getElementById('project-search');
        if (searchInput) searchInput.value = '';
        updateProjectFilterButtons('all');
        renderProjects();
      });
      emptyCard.append(p, resetBtn);
      container.appendChild(emptyCard);
      return;
    }

    for (const project of filtered) {
      const card = document.createElement('article');
      card.className = 'surface-card project-card';

      const topRow = document.createElement('div');
      topRow.className = 'project-card-top';

      const featBadge = document.createElement('span');
      featBadge.className = 'featured-badge';
      featBadge.textContent = '★ Destacado de GitHub';
      topRow.appendChild(featBadge);

      const liveRepo = project.repoName ? state.githubReposMap.get(project.repoName) : null;
      if (liveRepo) {
        const syncTag = document.createElement('span');
        syncTag.className = 'repo-sync-tag';
        const dateStr = formatShortDate(liveRepo.updated_at);
        syncTag.textContent = dateStr ? `GitHub · act. ${dateStr}` : 'Sincronizado con GitHub';
        topRow.appendChild(syncTag);
      }
      card.appendChild(topRow);

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
      detailBtn.textContent = 'Ver captura y detalles';
      detailBtn.addEventListener('click', () => openProjectModal(project.id, detailBtn));
      links.appendChild(detailBtn);

      const repoLink = document.createElement('a');
      repoLink.className = 'btn btn-secondary btn-sm';
      repoLink.href = project.repoUrl;
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';
      repoLink.textContent = 'Repositorio en GitHub';
      links.appendChild(repoLink);

      if (project.demoUrl) {
        const demoLink = document.createElement('a');
        demoLink.className = 'btn btn-ghost btn-sm';
        demoLink.href = project.demoUrl;
        demoLink.target = '_blank';
        demoLink.rel = 'noopener noreferrer';
        demoLink.textContent = 'Ver web';
        links.appendChild(demoLink);
      }

      card.append(title, dl, stackList, links);
      container.appendChild(card);
    }
  }

  function updateProjectFilterButtons(activeKey) {
    const filterBtns = document.querySelectorAll('.project-filters .filter-btn[data-filter]');
    filterBtns.forEach((b) => {
      const isMatch = b.getAttribute('data-filter') === activeKey;
      b.classList.toggle('active', isMatch);
      b.setAttribute('aria-pressed', String(isMatch));
    });
  }

  function setupProjectControls() {
    const filterBtns = document.querySelectorAll('.project-filters .filter-btn[data-filter]');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.projectFilter = btn.getAttribute('data-filter') || 'all';
        updateProjectFilterButtons(state.projectFilter);
        renderProjects();
      });
    });

    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.projectQuery = e.target.value || '';
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

  function renderAcademicEducation() {
    const list = document.getElementById('academic-list');
    if (!list) return;
    list.textContent = '';

    for (const item of PROFILE.academicEducation) {
      const li = document.createElement('li');
      li.className = `surface-card academic-card ${item.highlight ? 'is-primary' : ''}`;

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
    const countEl = document.getElementById('courses-count');
    if (!list) return;

    const filtered =
      state.courseFilter === 'all'
        ? PROFILE.complementaryCourses
        : PROFILE.complementaryCourses.filter((c) => c.category === state.courseFilter);

    list.textContent = '';
    if (countEl) {
      countEl.textContent = `${filtered.length} de ${PROFILE.complementaryCourses.length} certificaciones`;
    }

    for (const course of filtered) {
      const li = document.createElement('li');
      li.className = `surface-card course-card ${course.featured ? 'is-featured' : ''}`;

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

  function setupCourseFilters() {
    const filterBtns = document.querySelectorAll('#courses-filters .filter-btn[data-course-filter]');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.courseFilter = btn.getAttribute('data-course-filter') || 'all';
        filterBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        renderComplementaryCourses();
      });
    });
  }

  function renderCompetencies() {
    const techList = document.getElementById('tech-skills-list');
    if (techList) {
      techList.textContent = '';
      for (const skill of PROFILE.technicalSkills) {
        const li = document.createElement('li');
        li.textContent = skill;
        techList.appendChild(li);
      }
    }

    const appliedList = document.getElementById('applied-stack-list');
    if (appliedList) {
      appliedList.textContent = '';
      for (const tech of PROFILE.appliedStack) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag tag-interactive';
        btn.textContent = tech;
        btn.title = `Filtrar proyectos destacados que usan ${tech}`;
        btn.addEventListener('click', () => {
          state.projectFilter = 'all';
          state.projectQuery = tech;
          updateProjectFilterButtons('all');
          const searchInput = document.getElementById('project-search');
          if (searchInput) searchInput.value = tech;
          renderProjects();
          document.getElementById('proyectos-destacados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast(`Filtrando proyectos destacados por "${tech}"`);
        });
        li.appendChild(btn);
        appliedList.appendChild(li);
      }
    }

    const softList = document.getElementById('soft-skills-list');
    if (softList) {
      softList.textContent = '';
      for (const soft of PROFILE.softSkills) {
        const li = document.createElement('li');
        li.className = 'tag';
        li.textContent = soft;
        softList.appendChild(li);
      }
    }

    const langList = document.getElementById('languages-list');
    if (langList) {
      langList.textContent = '';
      for (const lang of PROFILE.languages) {
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

    const addList = document.getElementById('additional-info-list');
    if (addList) {
      addList.textContent = '';
      for (const info of PROFILE.additionalInfo) {
        const li = document.createElement('li');
        li.textContent = info;
        addList.appendChild(li);
      }
    }
  }

  function renderContact() {
    const contactList = document.getElementById('contact-list');
    if (!contactList) return;
    contactList.textContent = '';

    const entries = [
      {
        label: 'Teléfono',
        value: PROFILE.contact.phone,
        href: PROFILE.contact.phoneHref,
        copyLabel: 'Teléfono'
      },
      {
        label: 'Correo electrónico',
        value: PROFILE.contact.email,
        href: `mailto:${PROFILE.contact.email}`,
        copyLabel: 'Email'
      },
      {
        label: 'Ubicación',
        value: PROFILE.contact.location,
        href: null,
        copyLabel: null
      },
      {
        label: 'GitHub',
        value: PROFILE.contact.githubUrl,
        href: PROFILE.contact.githubUrl,
        external: true,
        copyLabel: null
      }
    ];

    for (const entry of entries) {
      const card = document.createElement('article');
      card.className = 'surface-card contact-card';

      const heading = document.createElement('h3');
      heading.className = 'contact-card-label';
      heading.textContent = entry.label;

      const valueBox = document.createElement('div');
      valueBox.className = 'contact-card-value';

      if (entry.href) {
        const link = document.createElement('a');
        link.href = entry.href;
        if (entry.external) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        link.textContent = entry.value;
        valueBox.appendChild(link);
      } else {
        const span = document.createElement('span');
        span.textContent = entry.value;
        valueBox.appendChild(span);
      }

      if (entry.copyLabel) {
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-ghost btn-xs';
        copyBtn.textContent = 'Copiar';
        copyBtn.addEventListener('click', () => copyToClipboard(entry.value, entry.copyLabel));
        valueBox.appendChild(copyBtn);
      }

      card.append(heading, valueBox);
      contactList.appendChild(card);
    }
  }

  function renderCvSheet() {
    const sheet = document.getElementById('cv-modal-content');
    const pdfLink = document.getElementById('cv-pdf-link');

    if (pdfLink && PROFILE.contact.cvPdfUrl) {
      pdfLink.href = PROFILE.contact.cvPdfUrl;
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
      `${PROFILE.contact.phone} · ${PROFILE.contact.email} · ${PROFILE.contact.location} · ${PROFILE.contact.githubUrl}`;

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

    const aboutSec = addSection('Sobre mí');
    const aboutP = document.createElement('p');
    aboutP.textContent = PROFILE.about;
    aboutSec.appendChild(aboutP);

    const eduSec = addSection('Formación Académica');
    for (const edu of PROFILE.academicEducation) {
      const item = document.createElement('div');
      item.className = 'cv-item';
      const strong = document.createElement('strong');
      strong.textContent = edu.title;
      const p = document.createElement('p');
      p.textContent = `${edu.institution} | ${edu.period}`;
      item.append(strong, p);
      eduSec.appendChild(item);
    }

    const projSec = addSection('Proyectos Destacados de GitHub');
    for (const p of PROFILE.featuredProjects) {
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

    const coursesSec = addSection('Formación Complementaria');
    for (const c of PROFILE.complementaryCourses) {
      const p = document.createElement('p');
      p.textContent = `• ${c.title} — ${c.provider} | ${c.date}`;
      coursesSec.appendChild(p);
    }

    const compSec = addSection('Habilidades, Idiomas y Más Información');
    const pTech = document.createElement('p');
    pTech.textContent = `Habilidades Técnicas: ${PROFILE.technicalSkills.join(' · ')}`;
    const pSoft = document.createElement('p');
    pSoft.textContent = `Soft Skills: ${PROFILE.softSkills.join(' · ')}`;
    const pLang = document.createElement('p');
    pLang.textContent = `Idiomas: ${PROFILE.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}`;
    const pAdd = document.createElement('p');
    pAdd.textContent = `Más información: ${PROFILE.additionalInfo.join(' · ')}`;
    compSec.append(pTech, pSoft, pLang, pAdd);
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
      btn.textContent = isLight ? '🌙 Modo Oscuro Naval' : '☀️ Modo Claro CV';
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
      showToast(next === 'light' ? 'Modo Claro CV activado' : 'Modo Oscuro Naval activado');
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
    renderAcademicEducation();
    renderComplementaryCourses();
    setupCourseFilters();
    renderCompetencies();
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
          if (nextState.data && Array.isArray(nextState.data.repos)) {
            state.githubReposMap = new Map(nextState.data.repos.map((r) => [r.name, r]));
            renderProjects();
          }
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
