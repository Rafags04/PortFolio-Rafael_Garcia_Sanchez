import { PROFILE } from './data/profile.js';
import { createAccessibleModal } from './modules/modal.js';
import { initGitHubSection } from './modules/github.js';

function isTodoValue(value) {
  return typeof value === 'string' && value.trim().startsWith('TODO:');
}

/**
 * Inserta texto de forma segura usando textContent (nunca innerHTML).
 * Si empieza por "TODO:", antepone una etiqueta visual explícita.
 */
function appendTodoAwareText(container, text) {
  container.textContent = '';
  if (isTodoValue(text)) {
    const badge = document.createElement('span');
    badge.className = 'todo-badge';
    badge.textContent = 'TODO';
    const cleanText = text.trim().replace(/^TODO:\s*/, '');
    container.append(badge, document.createTextNode(` ${cleanText}`));
    return;
  }
  container.textContent = text;
}

function collectTodoItems(obj = PROFILE, prefix = '') {
  const results = [];
  if (typeof obj === 'string') {
    if (obj.includes('TODO:')) {
      results.push({ path: prefix, value: obj });
    }
    return results;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      results.push(...collectTodoItems(item, `${prefix}[${index}]`));
    });
    return results;
  }
  if (obj && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      const nextPath = prefix ? `${prefix}.${key}` : key;
      results.push(...collectTodoItems(val, nextPath));
    }
  }
  return results;
}

function renderHero() {
  const nameEl = document.getElementById('hero-name');
  const roleEl = document.getElementById('hero-role');
  const headlineEl = document.getElementById('hero-headline');
  const locationEl = document.getElementById('hero-location');
  const availabilityEl = document.getElementById('hero-availability');
  const ghLinkEl = document.getElementById('hero-github-link');
  const stripEl = document.getElementById('hero-contact-strip');

  if (nameEl) appendTodoAwareText(nameEl, PROFILE.name);
  if (roleEl) appendTodoAwareText(roleEl, PROFILE.role);
  if (headlineEl) appendTodoAwareText(headlineEl, PROFILE.headline);
  if (locationEl) appendTodoAwareText(locationEl, PROFILE.location);
  if (availabilityEl) appendTodoAwareText(availabilityEl, PROFILE.availability);

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
    emailItem.appendChild(emailLabel);

    if (isTodoValue(PROFILE.contact.email)) {
      const emailSpan = document.createElement('span');
      appendTodoAwareText(emailSpan, PROFILE.contact.email);
      emailItem.appendChild(emailSpan);
    } else {
      const mailLink = document.createElement('a');
      mailLink.href = `mailto:${PROFILE.contact.email}`;
      mailLink.textContent = PROFILE.contact.email;
      emailItem.appendChild(mailLink);
    }

    const linkedinItem = document.createElement('div');
    linkedinItem.className = 'contact-pill';
    const liLabel = document.createElement('span');
    liLabel.className = 'contact-pill-label';
    liLabel.textContent = 'LinkedIn: ';
    linkedinItem.appendChild(liLabel);

    if (isTodoValue(PROFILE.contact.linkedin)) {
      const liSpan = document.createElement('span');
      appendTodoAwareText(liSpan, PROFILE.contact.linkedin);
      linkedinItem.appendChild(liSpan);
    } else {
      const liLink = document.createElement('a');
      liLink.href = PROFILE.contact.linkedin;
      liLink.target = '_blank';
      liLink.rel = 'noopener noreferrer';
      liLink.textContent = 'Perfil profesional';
      linkedinItem.appendChild(liLink);
    }

    stripEl.append(emailItem, linkedinItem);
  }
}

function renderProjects() {
  const container = document.getElementById('projects-list');
  if (!container) return;
  container.textContent = '';

  for (const project of PROFILE.projects) {
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
    appendTodoAwareText(ddProb, project.problem);

    const dtSol = document.createElement('dt');
    dtSol.textContent = 'Solución';
    const ddSol = document.createElement('dd');
    appendTodoAwareText(ddSol, project.solution);

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
    appendTodoAwareText(title, item.title);

    const detail = document.createElement('p');
    detail.className = 'timeline-detail';
    appendTodoAwareText(detail, item.detail);

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
      li.className = isTodoValue(item) ? 'tag tag-todo' : 'tag';
      appendTodoAwareText(li, item);
      ul.appendChild(li);
    }

    card.append(title, ul);
    container.appendChild(card);
  }
}

function renderContactAndTodos() {
  const contactList = document.getElementById('contact-list');
  if (contactList) {
    contactList.textContent = '';

    const entries = [
      { label: 'Correo electrónico', value: PROFILE.contact.email, type: 'email' },
      { label: 'LinkedIn', value: PROFILE.contact.linkedin, type: 'url' },
      { label: 'GitHub', value: PROFILE.contact.githubUrl, type: 'url' },
      { label: 'CV en PDF', value: PROFILE.contact.cvPdfUrl, type: 'pdf' }
    ];

    for (const entry of entries) {
      const card = document.createElement('article');
      card.className = 'surface-card contact-card';

      const heading = document.createElement('h3');
      heading.className = 'contact-card-label';
      heading.textContent = entry.label;

      const valueBox = document.createElement('div');
      valueBox.className = 'contact-card-value';

      if (isTodoValue(entry.value)) {
        appendTodoAwareText(valueBox, entry.value);
      } else {
        const link = document.createElement('a');
        link.href = entry.type === 'email' ? `mailto:${entry.value}` : entry.value;
        if (entry.type !== 'email') {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        link.textContent = entry.value;
        valueBox.appendChild(link);
      }

      card.append(heading, valueBox);
      contactList.appendChild(card);
    }
  }

  const auditBox = document.getElementById('todo-audit-box');
  const auditList = document.getElementById('todo-audit-list');
  if (auditBox && auditList) {
    const pending = collectTodoItems();
    auditList.textContent = '';
    if (pending.length === 0) {
      auditBox.hidden = true;
    } else {
      auditBox.hidden = false;
      for (const item of pending) {
        const li = document.createElement('li');
        const code = document.createElement('code');
        code.textContent = item.path;
        li.append(code, document.createTextNode(` — ${item.value}`));
        auditList.appendChild(li);
      }
    }
  }
}

function renderCvSheet() {
  const sheet = document.getElementById('cv-modal-content');
  const pdfLink = document.getElementById('cv-pdf-link');

  if (pdfLink) {
    if (isTodoValue(PROFILE.contact.cvPdfUrl) || !PROFILE.contact.cvPdfUrl) {
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
  appendTodoAwareText(nameH3, PROFILE.name);

  const roleP = document.createElement('p');
  roleP.className = 'cv-role';
  appendTodoAwareText(roleP, PROFILE.role);

  const contactP = document.createElement('p');
  contactP.className = 'cv-contact-line';
  contactP.textContent =
    `GitHub: ${PROFILE.contact.githubUrl} · Email: ${PROFILE.contact.email} · LinkedIn: ${PROFILE.contact.linkedin}`;

  header.append(nameH3, roleP, contactP);
  sheet.appendChild(header);

  const summarySec = document.createElement('section');
  summarySec.className = 'cv-section';
  const summaryH4 = document.createElement('h4');
  summaryH4.textContent = 'Perfil';
  const summaryP = document.createElement('p');
  appendTodoAwareText(summaryP, PROFILE.headline);
  summarySec.append(summaryH4, summaryP);
  sheet.appendChild(summarySec);

  const projSec = document.createElement('section');
  projSec.className = 'cv-section';
  const projH4 = document.createElement('h4');
  projH4.textContent = 'Proyectos reales';
  projSec.appendChild(projH4);

  for (const p of PROFILE.projects) {
    const item = document.createElement('div');
    item.className = 'cv-item';

    const itemTitle = document.createElement('strong');
    itemTitle.textContent = `${p.title} (${p.stack.join(', ')})`;

    const itemProblem = document.createElement('p');
    appendTodoAwareText(itemProblem, p.problem);

    const itemSolution = document.createElement('p');
    appendTodoAwareText(itemSolution, p.solution);

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
    appendTodoAwareText(itemTitle, `${e.type}: ${e.title}`);

    const itemDetail = document.createElement('p');
    appendTodoAwareText(itemDetail, e.detail);

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
  if (nameEl) nameEl.textContent = PROFILE.shortName;
}

function setupLazyTerminal(getGitHubState, openCvModal) {
  const terminalSection = document.getElementById('terminal');
  if (!terminalSection) return;

  let loaded = false;
  async function loadNow() {
    if (loaded) return;
    loaded = true;
    const mod = await import('./modules/terminal.js');
    mod.initTerminal({
      profile: PROFILE,
      getGitHubState,
      openCvModal,
      collectTodoItems: () => collectTodoItems(PROFILE)
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          loadNow();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(terminalSection);
  } else {
    loadNow();
  }

  terminalSection.addEventListener('pointerdown', loadNow, { once: true });
  terminalSection.addEventListener('focusin', loadNow, { once: true });
}

function init() {
  renderHero();
  renderProjects();
  renderTimeline();
  renderSkills();
  renderContactAndTodos();
  renderCvSheet();
  renderFooter();

  const cvModal = createAccessibleModal('cv-modal');
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

  let githubState = { ok: false, data: null, error: null };
  initGitHubSection({
    username: PROFILE.contact.githubUser,
    onStateChange: (nextState) => {
      githubState = nextState;
    }
  });

  setupLazyTerminal(
    () => githubState,
    (trigger) => cvModal.open(trigger)
  );
}

init();

