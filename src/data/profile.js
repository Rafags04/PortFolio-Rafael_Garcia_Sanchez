/**
 * Diccionario bilingüe completo (Español / Inglés) para el portfolio de Rafael García Sánchez.
 * Todos los datos proceden de su CV oficial y repositorios reales en GitHub (@Rafags04).
 */
(function () {
  window.Portfolio = window.Portfolio || {};

  const SHARED_CONTACT = {
    phone: '(+34) 644 41 06 02',
    phoneHref: 'tel:+34644410602',
    email: 'rafags0407@gmail.com',
    location: 'Ciudad Real, 13003',
    linkedinUrl: 'https://www.linkedin.com/in/rafa-garcía-725b5a367/',
    linkedinHandle: 'in/rafa-garcía-725b5a367',
    githubUser: 'Rafags04',
    githubUrl: 'https://github.com/Rafags04',
    cvPdfUrl: './assets/CV-Rafael-Garcia-Sanchez.pdf'
  };

  const PROFILES = {
    es: {
      name: 'Rafael García Sánchez',
      shortName: 'Rafael García',
      role: 'Estudiante de Ingeniería Informática',
      institution: 'Universidad de Castilla-La Mancha (UCLM)',
      avatar: './assets/profile-rafa.png',
      about:
        'Estudiante de Ingeniería Informática en búsqueda de su primer empleo en el sector tecnológico. Motivado por aplicar sus conocimientos en un entorno profesional, con interés en seguir aprendiendo y desarrollándose, aportando compromiso, responsabilidad y capacidad de trabajo en equipo.',
      contact: SHARED_CONTACT,
      heroBadges: [
        'UCLM · Ing. Informática',
        'Ciudad Real, 13003',
        'Inglés Avanzado (B2)',
        'Disponibilidad total'
      ],
      featuredProjects: [
        {
          id: 'simulador-pda-permiso-b',
          repoName: 'SimuladorPDA-PermisoConduccionB',
          featured: true,
          title: 'SimuladorPDA-PermisoConduccionB — Simulador PDA DGT (Permiso B)',
          categories: ['pwa', 'javascript', 'python-docker'],
          image: './assets/projects/simulador-pda.png',
          imageAlt:
            'Captura real en ejecución del Simulador PDA de examen práctico del permiso B',
          problem:
            'Facilitar a los profesores de autoescuela el registro ágil de faltas (leves, deficientes y eliminatorias), tiempos y maniobras desde el móvil durante las clases prácticas, simulando la PDA oficial de los examinadores de la DGT.',
          solution:
            'Aplicación web progresiva (PWA) mobile-first con catálogo buscable de faltas, cálculo automático de APTO / NO APTO según criterios DGT, cronómetros de examen y maniobra, historial local con IndexedDB, exportación de informe PDF y despliegue con Flask y Docker.',
          stack: [
            'JavaScript (ES6+)',
            'Vite / PWA',
            'IndexedDB',
            'Python (Flask)',
            'Docker',
            'HTML5 / CSS3'
          ],
          highlights: [
            'Motor de evaluación DGT en src/rules.js (1 eliminatoria, 2 deficientes, 1D+5L o 10 leves).',
            'Persistencia local offline en IndexedDB, cronómetros integrados y exportación a PDF/JSON.',
            'Lista para producción con Service Worker PWA, servidor Flask (app.py) y Docker Compose.'
          ],
          codeSnippet:
            'export function evaluateSimulation(faults = []) {\n  const counts = countFaults(faults);\n  const noApto =\n    counts.E >= 1 ||\n    counts.D >= 2 ||\n    (counts.D >= 1 && counts.L >= 5) ||\n    counts.L >= 10;\n  return { ...counts, result: noApto ? "NO APTO" : "APTO", noApto };\n}',
          repoUrl: 'https://github.com/Rafags04/SimuladorPDA-PermisoConduccionB',
          demoUrl: null
        },
        {
          id: 'portfolio-gh-pages',
          repoName: 'PortFolio',
          featured: true,
          title: 'PortFolio — Portfolio Personal Interactivo en GitHub Pages',
          categories: ['web', 'javascript'],
          image: './assets/projects/portfolio-web.svg',
          imageAlt:
            'Vista previa del portfolio personal de Rafael García Sánchez con sección de GitHub y terminal interactiva',
          problem:
            'Centralizar el currículum académico, las certificaciones complementarias y los proyectos de GitHub en una web rápida, accesible e interactiva.',
          solution:
            'Aplicación web estática sin dependencias externas con diseño adaptable oscuro/claro, traducción español/inglés, visor interactivo de proyectos, conexión en directo con la API REST de GitHub y terminal de consulta.',
          stack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'GitHub REST API', 'Git'],
          highlights: [
            'Compatible tanto abriendo index.html en local (file://) como publicado en GitHub Pages.',
            'Sincronización en tiempo real de repositorios propios y bytes por lenguaje desde GitHub API.',
            'Diseño accesible WCAG AA+, modo claro/oscuro, bilingüe ES/EN y CV imprimible en PDF.'
          ],
          codeSnippet:
            'const ownRepos = rawRepos.filter((repo) => !repo.fork);\nconst langMap = await Promise.all(\n  ownRepos.map((repo) => fetch(repo.languages_url).then((r) => r.json()))\n);',
          repoUrl: 'https://github.com/Rafags04/PortFolio',
          demoUrl: 'https://rafags04.github.io/PortFolio/'
        }
      ],
      academicEducation: [
        {
          title: 'Grado en Ingeniería Informática',
          institution: 'Universidad de Castilla-La Mancha',
          period: 'Septiembre 2022 - Actual',
          highlight: true
        },
        {
          title: 'Bachillerato en la modalidad de Ciencias',
          institution: 'Educación Secundaria Postobligatoria',
          period: 'Septiembre 2020 - Mayo 2022',
          highlight: false
        }
      ],
      complementaryCourses: [
        { title: 'Capacitación sobre Calidad del software cuántico', provider: 'AQC Lab', date: 'Febrero 2026', category: 'tecnologia', featured: true },
        { title: 'Aprendizaje en la búsqueda y el uso de la información (Nivel avanzado)', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'informacion', featured: false },
        { title: 'Aprendizaje en la búsqueda y el uso de la información (Nivel inicial)', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'informacion', featured: false },
        { title: 'Liderazgo', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'liderazgo', featured: false },
        { title: 'Resolución de conflictos', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'liderazgo', featured: false },
        { title: 'Automotivación y productividad', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'liderazgo', featured: false },
        { title: 'Autocoaching', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'liderazgo', featured: false },
        { title: 'Emprendimiento', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'liderazgo', featured: false },
        { title: 'Habilidades interpersonales', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'transversales', featured: false },
        { title: 'Regulación emocional', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'transversales', featured: false },
        { title: 'Igualdad, Diversidad e Inclusión', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'transversales', featured: false },
        { title: 'Sostenibilidad Medioambiental', provider: 'Aula de Competencias Transversales', date: 'Febrero 2025', category: 'transversales', featured: false }
      ],
      technicalSkills: [
        'Fundamentos de la programación',
        'Lógica computacional',
        'Uso de entornos de desarrollo',
        'Manejo de bases de datos',
        'Uso de herramientas ofimáticas y técnicas',
        'Control de versiones con Git'
      ],
      appliedStack: ['JavaScript (ES6+)', 'PWA / IndexedDB', 'Vite', 'Python (Flask)', 'Docker', 'HTML5 / CSS3'],
      softSkills: ['Trabajo en Equipo', 'Puntualidad', 'Responsabilidad', 'Compromiso', 'Organización', 'Resolución de problemas'],
      languages: [
        { name: 'Castellano', level: 'Nativo', percent: 100 },
        { name: 'Inglés', level: 'Nivel Avanzado - (B2)', percent: 75 }
      ],
      additionalInfo: ['Carné de conducir Tipo B', 'Disponibilidad total']
    },

    en: {
      name: 'Rafael García Sánchez',
      shortName: 'Rafael García',
      role: 'Computer Engineering Student',
      institution: 'University of Castilla-La Mancha (UCLM)',
      avatar: './assets/profile-rafa.png',
      about:
        'Computer Engineering student seeking a first professional opportunity in the tech sector. Motivated to apply technical knowledge in a real-world engineering environment, eager to keep learning and growing while contributing commitment, responsibility, and strong teamwork.',
      contact: SHARED_CONTACT,
      heroBadges: [
        'UCLM · Computer Eng.',
        'Ciudad Real, Spain (13003)',
        'English Upper-Intermediate (B2)',
        'Full availability'
      ],
      featuredProjects: [
        {
          id: 'simulador-pda-permiso-b',
          repoName: 'SimuladorPDA-PermisoConduccionB',
          featured: true,
          title: 'SimuladorPDA-PermisoConduccionB — DGT Driving Exam PDA Simulator (Category B)',
          categories: ['pwa', 'javascript', 'python-docker'],
          image: './assets/projects/simulador-pda.png',
          imageAlt:
            'Live running screenshot of the DGT Category B driving exam PDA simulator',
          problem:
            'Help driving school instructors quickly log driving faults (minor, major, and disqualifying), maneuver timers, and exam progress from a smartphone during practice lessons, emulating official DGT examiner PDAs.',
          solution:
            'Mobile-first Progressive Web App (PWA) featuring a searchable fault catalog, automatic PASS / FAIL calculation based on official DGT rules, exam & maneuver timers, offline persistence in IndexedDB, PDF report export, and Flask + Docker deployment.',
          stack: [
            'JavaScript (ES6+)',
            'Vite / PWA',
            'IndexedDB',
            'Python (Flask)',
            'Docker',
            'HTML5 / CSS3'
          ],
          highlights: [
            'Official DGT scoring engine in src/rules.js (1 disqualifying, 2 major, 1M+5m, or 10 minor faults).',
            'Offline-first IndexedDB local history, built-in timers, and PDF/JSON export.',
            'Production-ready with PWA Service Worker, Flask static server (app.py), and Docker Compose.'
          ],
          codeSnippet:
            'export function evaluateSimulation(faults = []) {\n  const counts = countFaults(faults);\n  const noApto =\n    counts.E >= 1 ||\n    counts.D >= 2 ||\n    (counts.D >= 1 && counts.L >= 5) ||\n    counts.L >= 10;\n  return { ...counts, result: noApto ? "NO APTO" : "APTO", noApto };\n}',
          repoUrl: 'https://github.com/Rafags04/SimuladorPDA-PermisoConduccionB',
          demoUrl: null
        },
        {
          id: 'portfolio-gh-pages',
          repoName: 'PortFolio',
          featured: true,
          title: 'PortFolio — Interactive Personal Portfolio on GitHub Pages',
          categories: ['web', 'javascript'],
          image: './assets/projects/portfolio-web.svg',
          imageAlt:
            'Preview of Rafael García Sánchez interactive portfolio with GitHub metrics and terminal',
          problem:
            'Present academic background, complementary training certifications, and real GitHub projects in a fast, accessible, and interactive website.',
          solution:
            'Zero-dependency static web app featuring dark/light themes, instant ES/EN bilingual switching, interactive project lightbox modal, live GitHub REST API integration, and a command terminal.',
          stack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'GitHub REST API', 'Git'],
          highlights: [
            'Works both directly via local file:// protocol and deployed on GitHub Pages.',
            'Live synchronization of own repositories and language byte counts via GitHub API.',
            'WCAG AA+ accessible design, dual theme, ES/EN translation, and printable PDF resume.'
          ],
          codeSnippet:
            'const ownRepos = rawRepos.filter((repo) => !repo.fork);\nconst langMap = await Promise.all(\n  ownRepos.map((repo) => fetch(repo.languages_url).then((r) => r.json()))\n);',
          repoUrl: 'https://github.com/Rafags04/PortFolio',
          demoUrl: 'https://rafags04.github.io/PortFolio/'
        }
      ],
      academicEducation: [
        {
          title: "Bachelor's Degree in Computer Engineering",
          institution: 'University of Castilla-La Mancha (UCLM)',
          period: 'September 2022 - Present',
          highlight: true
        },
        {
          title: 'Science Track High School Diploma (Bachillerato de Ciencias)',
          institution: 'Upper Secondary Education',
          period: 'September 2020 - May 2022',
          highlight: false
        }
      ],
      complementaryCourses: [
        { title: 'Quantum Software Quality Training', provider: 'AQC Lab', date: 'February 2026', category: 'tecnologia', featured: true },
        { title: 'Information Search and Use Learning (Advanced Level)', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'informacion', featured: false },
        { title: 'Information Search and Use Learning (Initial Level)', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'informacion', featured: false },
        { title: 'Leadership', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'liderazgo', featured: false },
        { title: 'Conflict Resolution', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'liderazgo', featured: false },
        { title: 'Self-Motivation and Productivity', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'liderazgo', featured: false },
        { title: 'Self-Coaching', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'liderazgo', featured: false },
        { title: 'Entrepreneurship', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'liderazgo', featured: false },
        { title: 'Interpersonal Skills', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'transversales', featured: false },
        { title: 'Emotional Regulation', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'transversales', featured: false },
        { title: 'Equality, Diversity and Inclusion', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'transversales', featured: false },
        { title: 'Environmental Sustainability', provider: 'Transversal Skills Classroom', date: 'February 2025', category: 'transversales', featured: false }
      ],
      technicalSkills: [
        'Programming fundamentals',
        'Computational logic',
        'Development environments (IDEs)',
        'Database management',
        'Office and technical tooling',
        'Version control with Git'
      ],
      appliedStack: ['JavaScript (ES6+)', 'PWA / IndexedDB', 'Vite', 'Python (Flask)', 'Docker', 'HTML5 / CSS3'],
      softSkills: ['Teamwork', 'Punctuality', 'Responsibility', 'Commitment', 'Organization', 'Problem Solving'],
      languages: [
        { name: 'Spanish', level: 'Native', percent: 100 },
        { name: 'English', level: 'Upper-Intermediate (B2)', percent: 75 }
      ],
      additionalInfo: ['Class B Driving License', 'Full availability']
    }
  };

  const UI_STRINGS = {
    es: {
      pageTitle: 'Rafael García Sánchez | Estudiante de Ingeniería Informática & Portfolio',
      skipLink: 'Saltar al contenido principal',
      navAbout: 'Sobre mí',
      navProjects: 'Proyectos',
      navGithub: 'GitHub',
      navEducation: 'Formación',
      navSkills: 'Competencias',
      navTerminal: 'Terminal',
      navContact: 'Contacto',
      langBtnText: '🌐 EN',
      langBtnAria: 'Switch language to English',
      themeToLight: '☀️ Modo Claro CV',
      themeToDark: '🌙 Modo Oscuro Naval',
      heroEyebrow: 'Currículum & Portfolio · GitHub Pages',
      heroAboutLabel: 'Sobre mí',
      heroDownloadCv: 'Descargar CV Original (PDF)',
      heroOpenCv: 'Vista Rápida / Imprimir CV',
      heroProjectsBtn: 'Proyectos Destacados',
      copyBtn: 'Copiar',
      projectsEyebrow: '01 · Repositorios Seleccionados',
      projectsHeading: 'Proyectos Destacados de GitHub',
      projectsSubtitle: 'Selección de proyectos públicos de @Rafags04 con documentación técnica, fragmentos de código y captura ampliable.',
      projectSearchPlaceholder: 'Buscar en proyectos destacados (ej. PWA, Docker, Flask, IndexedDB)…',
      filterAll: 'Todos',
      filterPwa: 'PWA & Móvil',
      filterJs: 'JavaScript',
      filterPythonDocker: 'Python & Docker',
      filterWeb: 'Web',
      showingProjects: 'Mostrando {shown} de {total} proyectos destacados',
      featuredBadge: '★ Destacado de GitHub',
      githubSyncTag: 'GitHub · act.',
      githubSyncedTag: 'Sincronizado con GitHub',
      zoomLabel: '🔍 Ampliar',
      problemLabel: 'Problema',
      solutionLabel: 'Solución',
      viewDetailsBtn: 'Ver captura y detalles',
      repoGithubBtn: 'Repositorio en GitHub',
      viewWebBtn: 'Ver web',
      noProjectsFound: 'Ningún proyecto destacado coincide con tu filtro actual.',
      showAllProjectsBtn: 'Mostrar todos los destacados',
      githubEyebrow: '02 · GitHub API en Vivo',
      githubHeading: 'Actividad y Lenguajes en GitHub (@Rafags04)',
      githubSyncBtn: 'Sincronizar con GitHub',
      githubLangHeading: 'Lenguajes por bytes (repositorios propios)',
      githubReposHeading: 'Repositorios públicos recientes (sin forks)',
      eduEyebrow: '03 · Currículum Académico',
      eduHeading: 'Formación Académica y Complementaria',
      eduAcademicTitle: 'Formación Académica',
      eduCoursesTitle: 'Formación Complementaria',
      eduCoursesSubtitle: 'Capacitaciones y competencias cursadas en AQC Lab y el Aula de Competencias Transversales.',
      coursesAll: 'Todas (12)',
      coursesTech: 'Software Cuántico',
      coursesInfo: 'Búsqueda de Información',
      coursesLead: 'Liderazgo & Productividad',
      coursesTrans: 'Competencias Transversales',
      coursesCountText: '{shown} de {total} certificaciones',
      compEyebrow: '04 · Perfil Completo',
      compHeading: 'Habilidades, Idiomas y Más Información',
      compSubtitle: 'Pulsa cualquier tecnología aplicada para filtrar los proyectos destacados donde se utiliza.',
      techSkillsHeading: 'Habilidades Técnicas (CV)',
      appliedStackHeading: 'Herramientas aplicadas en GitHub',
      softSkillsHeading: 'Soft Skills',
      languagesHeading: 'Idiomas',
      additionalInfoHeading: 'Más Información',
      termEyebrow: '05 · Modo Interactivo',
      termHeading: 'Terminal de Consulta Rápida',
      termSubtitle: 'Explora todo el currículum y los proyectos por comandos. Prueba courses, projects o languages.',
      termInputPlaceholder: 'Escribe un comando (ej. help) y pulsa Enter…',
      termExecBtn: 'Ejecutar',
      contactEyebrow: 'Contacto Directo',
      contactHeading: 'Contacto',
      contactSubtitle: 'Disponible para oportunidades en el sector tecnológico. Todos los canales directos y el CV en un vistazo.',
      contactDownloadPdf: 'CV (PDF)',
      contactPhoneLabel: 'Teléfono',
      contactEmailLabel: 'Email',
      contactLocationLabel: 'Ubicación',
      contactLinkedInLabel: 'LinkedIn',
      contactGitHubLabel: 'GitHub',
      footerText: 'Portfolio en GitHub Pages.',
      footerOpenPdf: 'Abrir PDF original',
      footerQuickCv: 'Vista rápida CV',
      footerBackTop: '↑ Arriba',
      projModalTitleDefault: 'Detalle del proyecto',
      projModalClose: 'Cerrar (Esc)',
      projModalTabSummary: 'Problema y Solución',
      projModalTabCode: 'Fragmento de Código',
      projModalTabStack: 'Stack y Puntos Clave',
      projModalPrev: '← Anterior',
      projModalNext: 'Siguiente →',
      projModalIndex: 'Proyecto destacado {idx} de {total}',
      projModalOpenRepo: 'Abrir repositorio en GitHub',
      projModalViewDemo: 'Ver demo',
      cvModalTitle: 'Currículum Vitae',
      cvModalCloseTop: 'Cerrar (Esc)',
      cvModalOpenPdf: 'Abrir PDF original',
      cvModalPrint: 'Imprimir / Guardar PDF',
      cvModalClose: 'Cerrar',
      cvSecAbout: 'Sobre mí',
      cvSecEdu: 'Formación Académica',
      cvSecProj: 'Proyectos Destacados de GitHub',
      cvSecCourses: 'Formación Complementaria',
      cvSecComp: 'Habilidades, Idiomas y Más Información',
      cvLabelTech: 'Habilidades Técnicas',
      cvLabelSoft: 'Soft Skills',
      cvLabelLang: 'Idiomas',
      cvLabelAdd: 'Más información',
      toastCopied: '{label} copiado: {val}',
      toastFilteredBy: 'Filtrando proyectos destacados por "{tech}"',
      toastThemeLight: 'Modo Claro CV activado',
      toastThemeDark: 'Modo Oscuro Naval activado',
      toastLangChanged: 'Idioma cambiado a Español'
    },

    en: {
      pageTitle: 'Rafael García Sánchez | Computer Engineering Student & Portfolio',
      skipLink: 'Skip to main content',
      navAbout: 'About me',
      navProjects: 'Projects',
      navGithub: 'GitHub',
      navEducation: 'Education',
      navSkills: 'Skills',
      navTerminal: 'Terminal',
      navContact: 'Contact',
      langBtnText: '🌐 ES',
      langBtnAria: 'Cambiar idioma a Español',
      themeToLight: '☀️ Light CV Mode',
      themeToDark: '🌙 Dark Navy Mode',
      heroEyebrow: 'Resume & Portfolio · GitHub Pages',
      heroAboutLabel: 'About me',
      heroDownloadCv: 'Download Original CV (PDF)',
      heroOpenCv: 'Quick View / Print CV',
      heroProjectsBtn: 'Featured Projects',
      copyBtn: 'Copy',
      projectsEyebrow: '01 · Selected Repositories',
      projectsHeading: 'Featured GitHub Projects',
      projectsSubtitle: 'Curated public repositories from @Rafags04 with technical documentation, code snippets, and expandable preview.',
      projectSearchPlaceholder: 'Search featured projects (e.g. PWA, Docker, Flask, IndexedDB)…',
      filterAll: 'All',
      filterPwa: 'PWA & Mobile',
      filterJs: 'JavaScript',
      filterPythonDocker: 'Python & Docker',
      filterWeb: 'Web',
      showingProjects: 'Showing {shown} of {total} featured projects',
      featuredBadge: '★ Featured on GitHub',
      githubSyncTag: 'GitHub · upd.',
      githubSyncedTag: 'Synced with GitHub',
      zoomLabel: '🔍 Expand',
      problemLabel: 'Problem',
      solutionLabel: 'Solution',
      viewDetailsBtn: 'Preview & details',
      repoGithubBtn: 'GitHub Repository',
      viewWebBtn: 'Live site',
      noProjectsFound: 'No featured project matches your current filter.',
      showAllProjectsBtn: 'Show all featured projects',
      githubEyebrow: '02 · Live GitHub API',
      githubHeading: 'GitHub Activity & Languages (@Rafags04)',
      githubSyncBtn: 'Sync with GitHub',
      githubLangHeading: 'Languages by bytes (own repositories)',
      githubReposHeading: 'Recent public repositories (no forks)',
      eduEyebrow: '03 · Academic Record',
      eduHeading: 'Academic & Complementary Education',
      eduAcademicTitle: 'Academic Background',
      eduCoursesTitle: 'Complementary Training',
      eduCoursesSubtitle: 'Certifications and transversal skills completed at AQC Lab and the Transversal Skills Classroom.',
      coursesAll: 'All (12)',
      coursesTech: 'Quantum Software',
      coursesInfo: 'Information Literacy',
      coursesLead: 'Leadership & Productivity',
      coursesTrans: 'Transversal Skills',
      coursesCountText: '{shown} of {total} certifications',
      compEyebrow: '04 · Full Profile',
      compHeading: 'Skills, Languages & Additional Info',
      compSubtitle: 'Click any applied technology tag to filter featured projects using it.',
      techSkillsHeading: 'Technical Skills (CV)',
      appliedStackHeading: 'Tools applied on GitHub',
      softSkillsHeading: 'Soft Skills',
      languagesHeading: 'Languages',
      additionalInfoHeading: 'Additional Information',
      termEyebrow: '05 · Interactive Mode',
      termHeading: 'Quick Query Terminal',
      termSubtitle: 'Explore resume data and projects via CLI commands. Try courses, projects, or languages.',
      termInputPlaceholder: 'Type a command (e.g. help) and press Enter…',
      termExecBtn: 'Run',
      contactEyebrow: 'Direct Contact',
      contactHeading: 'Contact',
      contactSubtitle: 'Available for opportunities in the tech sector. All direct contact channels and my CV at a glance.',
      contactDownloadPdf: 'CV (PDF)',
      contactPhoneLabel: 'Phone',
      contactEmailLabel: 'Email',
      contactLocationLabel: 'Location',
      contactLinkedInLabel: 'LinkedIn',
      contactGitHubLabel: 'GitHub',
      footerText: 'Portfolio on GitHub Pages.',
      footerOpenPdf: 'Open original PDF',
      footerQuickCv: 'Quick CV view',
      footerBackTop: '↑ Top',
      projModalTitleDefault: 'Project details',
      projModalClose: 'Close (Esc)',
      projModalTabSummary: 'Problem & Solution',
      projModalTabCode: 'Code Snippet',
      projModalTabStack: 'Stack & Highlights',
      projModalPrev: '← Previous',
      projModalNext: 'Next →',
      projModalIndex: 'Featured project {idx} of {total}',
      projModalOpenRepo: 'Open GitHub repository',
      projModalViewDemo: 'View demo',
      cvModalTitle: 'Curriculum Vitae',
      cvModalCloseTop: 'Close (Esc)',
      cvModalOpenPdf: 'Open original PDF',
      cvModalPrint: 'Print / Save as PDF',
      cvModalClose: 'Close',
      cvSecAbout: 'About me',
      cvSecEdu: 'Academic Background',
      cvSecProj: 'Featured GitHub Projects',
      cvSecCourses: 'Complementary Training',
      cvSecComp: 'Skills, Languages & Additional Info',
      cvLabelTech: 'Technical Skills',
      cvLabelSoft: 'Soft Skills',
      cvLabelLang: 'Languages',
      cvLabelAdd: 'Additional info',
      toastCopied: '{label} copied: {val}',
      toastFilteredBy: 'Filtering featured projects by "{tech}"',
      toastThemeLight: 'Light CV mode enabled',
      toastThemeDark: 'Dark Navy mode enabled',
      toastLangChanged: 'Language switched to English'
    }
  };

  let currentLang = 'es';
  try {
    const savedLang = localStorage.getItem('portfolio_lang');
    if (savedLang === 'en' || savedLang === 'es') {
      currentLang = savedLang;
    }
  } catch {
    // Ignorar si almacenamiento no disponible
  }

  window.Portfolio.PROFILES = PROFILES;
  window.Portfolio.UI_STRINGS = UI_STRINGS;
  window.Portfolio.PROFILE = PROFILES[currentLang];
  window.Portfolio.getLang = () => currentLang;
  window.Portfolio.getProfile = () => PROFILES[currentLang];
  window.Portfolio.getStrings = () => UI_STRINGS[currentLang];
  window.Portfolio.setLang = (lang) => {
    currentLang = lang === 'en' ? 'en' : 'es';
    window.Portfolio.PROFILE = PROFILES[currentLang];
    try {
      localStorage.setItem('portfolio_lang', currentLang);
    } catch {
      // Ignorar
    }
    return currentLang;
  };
})();
