/**
 * Punto de entrada del portfolio (compatible con file://, http:// y GitHub Pages).
 * Construye toda la interfaz de forma segura usando textContent (nunca innerHTML).
 */
(function () {
  const Portfolio = window.Portfolio || {};
  const PROFILE = Portfolio.PROFILE;
  if (!PROFILE) return;

  let activeFilter = 'all';

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
      emailItem.append(emailLabel, mailLink);

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

  function renderProjects(filterKey = 'all') {
    const container = document.getElementById('projects-list');
    if (!container) return;
    activeFilter = filterKey;
    container.textContent = '';

    const filtered =
      filterKey === 'all'
        ? PROFILE.projects
        : PROFILE.projects.filter(
            (p) => Array.isArray(p.categories) && p.categories.includes(filterKey)
          );

    if (filtered.length === 0) {
      const emptyCard = document.createElement('p');
      emptyCard.className = 'surface-card';
      emptyCard.textContent = 'No hay proyectos en esta categoría.';
      container.appendChild(emptyCard);
      return;
    }

    for (const project of filtered) {
      const card = document.createElement('article');
      card.className = 'surface-card project-card';

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
        demoLink.textContent = 'Ver demo';
        links.appendChild(demoLink);
      }

      card.append(title, dl, stackList, links);
      container.appendChild(card);
    }
  }

  function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterKey = btn.getAttribute('data-filter') || 'all';
        filterBtns.forEach((b) => {
          const isMatch = b === btn;
          b.classList.toggle('active', isMatch);
          b.setAttribute('aria-pressed', String(isMatch));
        });
        renderProjects(filterKey);
      });
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
        li.className = 'tag';
        li.textContent = item;
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
      { label: 'Correo electrónico', value: PROFILE.contact.email, href: `mailto:${PROFILE.contact.email}`, external: false },
      { label: 'LinkedIn', value: PROFILE.contact.linkedin, href: PROFILE.contact.linkedin, external: true },
      { label: 'GitHub', value: PROFILE.contact.githubUrl, href: PROFILE.contact.githubUrl, external: true }
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

  function initApp() {
    renderHero();
    renderProjects(activeFilter);
    setupProjectFilters();
    renderTimeline();
    renderSkills();
    renderContact();
    renderCvSheet();
    renderFooter();

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
