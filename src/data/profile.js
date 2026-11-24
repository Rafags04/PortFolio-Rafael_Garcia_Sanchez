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
      featuredProjects: [
        {
          id: 'simulador-pda-permiso-b',
          repoName: 'SimuladorPDA-PermisoConduccionB',
          title: 'SimuladorPDA-PermisoConduccionB — Simulador PDA DGT (Permiso B)',
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
        {
          title: 'Capacitación sobre Calidad del software cuántico',
          provider: 'AQC Lab',
          date: 'Febrero 2026',
          featured: true
        }
      ],
      technicalSkills: [
        'JavaScript (ES6+)',
        'Python (Flask)',
        'Java',
        'HTML5 & CSS3',
        'Bases de datos & IndexedDB',
        'Docker',
        'Git & GitHub',
        'PWA / Vite'
      ],
      softSkills: ['Trabajo en equipo', 'Resolución de problemas'],
      languages: [
        { name: 'Inglés', level: 'Nivel Avanzado (B2)', percent: 75 },
        { name: 'Castellano', level: 'Nativo', percent: 100 }
      ],
      additionalInfo: ['Disponibilidad total', 'Carné de conducir Tipo B']
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
      featuredProjects: [
        {
          id: 'simulador-pda-permiso-b',
          repoName: 'SimuladorPDA-PermisoConduccionB',
          title: 'SimuladorPDA-PermisoConduccionB — DGT Driving Exam PDA Simulator (Category B)',
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
        {
          title: 'Quantum Software Quality Training',
          provider: 'AQC Lab',
          date: 'February 2026',
          featured: true
        }
      ],
      technicalSkills: [
        'JavaScript (ES6+)',
        'Python (Flask)',
        'Java',
        'HTML5 & CSS3',
        'Databases & IndexedDB',
        'Docker',
        'Git & GitHub',
        'PWA / Vite'
      ],
      softSkills: ['Teamwork', 'Problem solving'],
      languages: [
        { name: 'English', level: 'Upper-Intermediate (B2)', percent: 75 },
        { name: 'Spanish', level: 'Native', percent: 100 }
      ],
      additionalInfo: ['Full availability', 'Class B Driving License']
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
      navContact: 'Contacto',
      langBtnText: '🌐 EN',
      langBtnAria: 'Switch language to English',
      themeToLight: '☀️ Modo Claro CV',
      themeToDark: '🌙 Modo Oscuro Naval',
      heroDownloadCv: 'Descargar CV Original (PDF)',
      heroOpenCv: 'Vista Rápida / Imprimir CV',
      copyBtn: 'Copiar',
      projectsHeading: 'Proyectos Destacados',
      githubSyncTag: 'GitHub · act.',
      githubSyncedTag: 'Sincronizado con GitHub',
      zoomLabel: '🔍 Ampliar',
      problemLabel: 'Problema',
      solutionLabel: 'Solución',
      viewDetailsBtn: 'Ver captura y detalles',
      repoGithubBtn: 'Repositorio en GitHub',
      viewWebBtn: 'Ver web',
      githubHeading: 'Actividad en GitHub (@Rafags04)',
      githubSyncBtn: 'Sincronizar con GitHub',
      githubLangHeading: 'Lenguajes por bytes (repositorios propios)',
      githubReposHeading: 'Repositorios públicos recientes (sin forks)',
      eduHeading: 'Formación',
      eduAcademicTitle: 'Formación Académica',
      eduCoursesTitle: 'Certificaciones',
      compHeading: 'Competencias e Idiomas',
      techSkillsHeading: 'Stack Técnico',
      languagesHeading: 'Idiomas',
      profileExtraHeading: 'Perfil y Disponibilidad',
      contactHeading: 'Contacto',
      contactPhoneLabel: 'Teléfono',
      contactEmailLabel: 'Email',
      contactLocationLabel: 'Ubicación',
      contactLinkedInLabel: 'LinkedIn',
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
      cvSecProj: 'Proyectos Destacados',
      cvSecCourses: 'Certificaciones',
      cvSecComp: 'Competencias e Idiomas',
      cvLabelTech: 'Stack Técnico',
      cvLabelSoft: 'Habilidades',
      cvLabelLang: 'Idiomas',
      cvLabelAdd: 'Disponibilidad',
      toastCopied: '{label} copiado: {val}',
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
      navContact: 'Contact',
      langBtnText: '🌐 ES',
      langBtnAria: 'Cambiar idioma a Español',
      themeToLight: '☀️ Light CV Mode',
      themeToDark: '🌙 Dark Navy Mode',
      heroDownloadCv: 'Download Original CV (PDF)',
      heroOpenCv: 'Quick View / Print CV',
      copyBtn: 'Copy',
      projectsHeading: 'Featured Projects',
      githubSyncTag: 'GitHub · upd.',
      githubSyncedTag: 'Synced with GitHub',
      zoomLabel: '🔍 Expand',
      problemLabel: 'Problem',
      solutionLabel: 'Solution',
      viewDetailsBtn: 'Preview & details',
      repoGithubBtn: 'GitHub Repository',
      viewWebBtn: 'Live site',
      githubHeading: 'GitHub Activity (@Rafags04)',
      githubSyncBtn: 'Sync with GitHub',
      githubLangHeading: 'Languages by bytes (own repositories)',
      githubReposHeading: 'Recent public repositories (no forks)',
      eduHeading: 'Education',
      eduAcademicTitle: 'Academic Background',
      eduCoursesTitle: 'Certifications',
      compHeading: 'Skills & Languages',
      techSkillsHeading: 'Technical Stack',
      languagesHeading: 'Languages',
      profileExtraHeading: 'Profile & Availability',
      contactHeading: 'Contact',
      contactPhoneLabel: 'Phone',
      contactEmailLabel: 'Email',
      contactLocationLabel: 'Location',
      contactLinkedInLabel: 'LinkedIn',
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
      cvSecProj: 'Featured Projects',
      cvSecCourses: 'Certifications',
      cvSecComp: 'Skills & Languages',
      cvLabelTech: 'Technical Stack',
      cvLabelSoft: 'Skills',
      cvLabelLang: 'Languages',
      cvLabelAdd: 'Availability',
      toastCopied: '{label} copied: {val}',
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
