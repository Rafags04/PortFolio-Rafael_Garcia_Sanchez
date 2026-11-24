/**
 * Punto de entrada bilingüe del portfolio real de Rafael García Sánchez.
 * Construye toda la interfaz de forma segura usando textContent (nunca innerHTML).
 */
(function () {
  const Portfolio = window.Portfolio || {};
  if (typeof Portfolio.getProfile !== 'function' || typeof Portfolio.getStrings !== 'function') return;

  const state = {
    currentProjects: Portfolio.getProfile().featuredProjects.slice(),
    modalProjectIndex: 0,
    githubReposMap: new Map()
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

    if (avatarEl && profile.avatar) {
      avatarEl.src = profile.avatar;
      avatarEl.alt = L() === 'en' ? `Portrait of ${profile.name}` : `Retrato de ${profile.name}`;
    }
    if (nameEl) nameEl.textContent = profile.name;
    if (roleEl) roleEl.textContent = `${profile.role} · ${profile.institution}`;
    if (aboutEl) aboutEl.textContent = profile.about;

    if (downloadCvBtn) {
      if (profile.contact.cvPdfUrl) {
        downloadCvBtn.href = profile.contact.cvPdfUrl;
      }
      downloadCvBtn.textContent = '';
      downloadCvBtn.append(
        createContactIcon('download'),
        document.createTextNode(s.heroDownloadCv)
      );
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
    if (navGroup) {
      navGroup.hidden = !isMulti;
    }
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
    if (!container) return;

    const projects = profile.featuredProjects;
    state.currentProjects = projects;
    container.textContent = '';
    container.classList.toggle('is-single', projects.length === 1);

    for (const project of projects) {
      const card = document.createElement('article');
      card.className = 'surface-card project-card';

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
    const profile = P();
    const list = document.getElementById('courses-list');
    if (!list) return;

    list.textContent = '';
    for (const course of profile.complementaryCourses) {
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

  function populateContactList(containerEl) {
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
  }

  function renderContact() {
    populateContactList(document.getElementById('contact-list'));
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

  function updateThemeButtonLabel() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    btn.setAttribute('aria-pressed', String(isLight));
    btn.textContent = isLight ? S().themeToDark : S().themeToLight;
  }

  function applyTranslations(announceToast = false) {
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

    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.textContent = s.langBtnText;
      langBtn.setAttribute('aria-label', s.langBtnAria);
    }

    updateThemeButtonLabel();
    renderHero();
    renderProjects();
    renderAcademicEducation();
    renderComplementaryCourses();
    renderCompetencies();
    renderContact();
    renderCvSheet();
    renderFooter();

    if (projectModal && projectModal.isOpen()) {
      renderProjectModalContent(state.modalProjectIndex);
    }
    if (typeof Portfolio.refreshGitHubLanguage === 'function') {
      Portfolio.refreshGitHubLanguage();
    }

    if (announceToast) {
      showToast(s.toastLangChanged);
    }
  }

  function setupLanguageToggle() {
    const langBtn = document.getElementById('btn-lang-toggle');
    if (!langBtn) return;
    langBtn.addEventListener('click', () => {
      const next = L() === 'es' ? 'en' : 'es';
      Portfolio.setLang(next);
      applyTranslations(true);
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

  function setupCardSpotlight() {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;

    document.addEventListener(
      'pointermove',
      (event) => {
        if (!(event.target instanceof Element)) return;
        const card = event.target.closest('.surface-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
      },
      { passive: true }
    );
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
    setupProjectModal();
    setupThemeToggle();
    setupLanguageToggle();
    setupCardSpotlight();
    setupScrollReveal();

    const cvModal = Portfolio.createAccessibleModal('cv-modal');
    const openBtn = document.getElementById('btn-open-cv');
    const closeTopBtn = document.getElementById('btn-close-cv-top');
    const closeBottomBtn = document.getElementById('btn-close-cv');
    const printBtn = document.getElementById('btn-print-cv');

    if (openBtn) openBtn.addEventListener('click', () => cvModal.open(openBtn));
    if (closeTopBtn) closeTopBtn.addEventListener('click', () => cvModal.close());
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', () => cvModal.close());
    if (printBtn) printBtn.addEventListener('click', () => window.print());

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

    applyTranslations(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
