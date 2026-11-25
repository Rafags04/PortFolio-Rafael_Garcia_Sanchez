/**
 * Diccionario bilingüe completo (Español / Inglés) para RafaOS (portfolio estilo macOS).
 * Todos los datos proceden del CV oficial de Rafael García Sánchez y GitHub (@Rafags04).
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
          repoUrl: 'https://github.com/Rafags04/SimuladorPDA-PermisoConduccionB'
        },
        {
          id: 'qiskit-maintainability-case-study',
          repoName: 'qiskit-maintainability-case-study',
          title: 'qiskit-maintainability-case-study — Análisis Estático de Mantenibilidad en Qiskit',
          image: './assets/projects/qiskit-case-study.png',
          imageAlt:
            'Vista del caso de estudio de análisis estático y circuito cuántico Qiskit con los 8 algoritmos de referencia',
          problem:
            'Disponer de un conjunto reproducible e inalterado de algoritmos cuánticos reales en Qiskit para evaluar métricas estáticas de calidad y mantenibilidad del software cuántico sin depender de simuladores ni ejecución en hardware.',
          solution:
            'Repositorio de estudio con 8 algoritmos cuánticos de referencia procedentes de QCRAFT-Scheduler (Bernstein-Vazirani, Deutsch-Jozsa, Grover, Phase Estimation, Shor, Simon, Teleportation y TSP) preparados para herramientas de análisis estático de métricas cuánticas.',
          stack: [
            'Python',
            'Qiskit',
            'Circuitos Cuánticos',
            'Análisis Estático',
            'Calidad del Software'
          ],
          highlights: [
            'Corpus de 8 algoritmos cuánticos en examples/ preservados sin modificaciones desde QCRAFT-Scheduler.',
            'Circuitos con QuantumRegister, ClassicalRegister, puertas H, CX, fase P(π/4), barreras y control clásico c_if.',
            'Alineado con ingeniería y calidad del software cuántico mediante inspección estática de métricas.'
          ],
          codeSnippet:
            "from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit\nfrom numpy import pi\n\nqreg_q = QuantumRegister(3, 'q')\ncreg_crzz = ClassicalRegister(3, 'crzz')\ncreg_crxx = ClassicalRegister(4, 'crxx')\ncircuit = QuantumCircuit(qreg_q, creg_crzz, creg_crxx)\n\ncircuit.h(qreg_q[1])\ncircuit.cx(qreg_q[1], qreg_q[2])\ncircuit.p(pi / 4, qreg_q[0])\ncircuit.cx(qreg_q[0], qreg_q[1])\ncircuit.h(qreg_q[0])\ncircuit.measure(qreg_q[0], creg_crzz[0])\ncircuit.measure(qreg_q[1], creg_crxx[0])\ncircuit.z(qreg_q[2]).c_if(creg_crzz, 1)\ncircuit.x(qreg_q[2]).c_if(creg_crxx, 1)",
          repoUrl: 'https://github.com/Rafags04/qiskit-maintainability-case-study'
        },
        {
          id: 'red-corporativa-ies-calero',
          repoName: 'DisenioRedCorporativa-IESAntonioMariaCalero',
          title: 'DisenioRedCorporativa-IESAntonioMariaCalero — Diseño de Red Corporativa',
          image: './assets/projects/red-corporativa-pt.png',
          imageAlt:
            'Topología lógica jerárquica en Cisco Packet Tracer de la red corporativa del IES Antonio María Calero',
          problem:
            'Diseñar desde cero una infraestructura de red corporativa segura, escalable y de alta disponibilidad para el IES Antonio María Calero (Pozoblanco), segmentando profesorado, alumnado, secretaría, jefatura, cámaras IP, WiFi, gestión y servidores.',
          solution:
            'Arquitectura jerárquica Top-Down de tres niveles (acceso Cisco 2960, distribución multicapa Cisco 3560 con redundancia HSRP y borde dual Cisco 2911 con NAT y rutas flotantes), 8 VLANs, DHCP Relay, supervisión SNMPv2/NetFlow, presupuesto técnico real y validación completa en Cisco Packet Tracer.',
          stack: [
            'Cisco Packet Tracer',
            'Redes TCP/IP & VLANs',
            'HSRP / Alta Disponibilidad',
            'DHCP & NAT',
            'SNMPv2 & NetFlow',
            'Diseño Top-Down'
          ],
          highlights: [
            'Topología jerárquica con doble router de borde Cisco 2911 y reparto de carga HSRP en switches multicapa 3560.',
            'Segmentación en 8 VLANs (/24 y /23), servidor DHCP dedicado con ip helper-address, NAT redundante, SNMPv2 y NetFlow.',
            'Incluye simulación validada (.pkt), memoria técnica en PDF y presupuesto real dimensionado (32.378,73 €).'
          ],
          codeSnippet:
            '# Segmentación VLANs + Alta Disponibilidad HSRP (Cisco 3560 / 2911)\nVLAN 10 PROFESORADO : 192.168.10.0/24  GW 192.168.10.1 (HSRP: Multicapa1)\nVLAN 20 ALUMNADO    : 192.168.20.0/23  GW 192.168.20.1 (HSRP: Multicapa2)\nVLAN 30 SECRETARIA  : 192.168.30.0/24  GW 192.168.30.1 (HSRP: Multicapa1)\nVLAN 40 JEFATURA    : 192.168.40.0/24  GW 192.168.40.1 (HSRP: Multicapa2)\nVLAN 50 CAMARAS     : 192.168.50.0/24  GW 192.168.50.1 (HSRP: Multicapa1)\nVLAN 60 WIFI        : 192.168.60.0/23  GW 192.168.60.1 (HSRP: Multicapa2)\nVLAN 70 GESTION     : 192.168.70.0/24  GW 192.168.70.1 (SNMPv2 · NetFlow)\nVLAN 80 SERVIDORES  : 192.168.80.0/24  GW 192.168.80.1 (DHCP Relay)',
          repoUrl: 'https://github.com/Rafags04/DisenioRedCorporativa-IESAntonioMariaCalero'
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
        'Python (Flask & Qiskit)',
        'Java',
        'HTML5 & CSS3',
        'Redes TCP/IP & Cisco PT',
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
          repoUrl: 'https://github.com/Rafags04/SimuladorPDA-PermisoConduccionB'
        },
        {
          id: 'qiskit-maintainability-case-study',
          repoName: 'qiskit-maintainability-case-study',
          title: 'qiskit-maintainability-case-study — Quantum Maintainability Static Analysis',
          image: './assets/projects/qiskit-case-study.png',
          imageAlt:
            'Static analysis workspace and Qiskit quantum circuit across the 8 benchmark quantum algorithms',
          problem:
            'Provide an unmodified, reproducible corpus of real Qiskit quantum algorithms to evaluate static quantum software quality and maintainability metrics without relying on simulators or quantum hardware execution.',
          solution:
            'Case study repository featuring 8 reference quantum algorithms sourced from QCRAFT-Scheduler (Bernstein-Vazirani, Deutsch-Jozsa, Grover, Phase Estimation, Shor, Simon, Teleportation, and TSP) prepared for static quantum metrics tools.',
          stack: [
            'Python',
            'Qiskit',
            'Quantum Circuits',
            'Static Analysis',
            'Software Quality'
          ],
          highlights: [
            'Benchmark suite of 8 canonical quantum algorithms in examples/ preserved unmodified from QCRAFT-Scheduler.',
            'Circuits built with QuantumRegister, ClassicalRegister, H, CX, phase P(π/4) gates, barriers, and classical c_if control.',
            'Aligned with quantum software engineering and maintainability research via static code inspection.'
          ],
          codeSnippet:
            "from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit\nfrom numpy import pi\n\nqreg_q = QuantumRegister(3, 'q')\ncreg_crzz = ClassicalRegister(3, 'crzz')\ncreg_crxx = ClassicalRegister(4, 'crxx')\ncircuit = QuantumCircuit(qreg_q, creg_crzz, creg_crxx)\n\ncircuit.h(qreg_q[1])\ncircuit.cx(qreg_q[1], qreg_q[2])\ncircuit.p(pi / 4, qreg_q[0])\ncircuit.cx(qreg_q[0], qreg_q[1])\ncircuit.h(qreg_q[0])\ncircuit.measure(qreg_q[0], creg_crzz[0])\ncircuit.measure(qreg_q[1], creg_crxx[0])\ncircuit.z(qreg_q[2]).c_if(creg_crzz, 1)\ncircuit.x(qreg_q[2]).c_if(creg_crxx, 1)",
          repoUrl: 'https://github.com/Rafags04/qiskit-maintainability-case-study'
        },
        {
          id: 'red-corporativa-ies-calero',
          repoName: 'DisenioRedCorporativa-IESAntonioMariaCalero',
          title: 'DisenioRedCorporativa-IESAntonioMariaCalero — Corporate Network Design',
          image: './assets/projects/red-corporativa-pt.png',
          imageAlt:
            'Hierarchical logical topology in Cisco Packet Tracer for the IES Antonio María Calero corporate network',
          problem:
            'Design from scratch a secure, scalable, high-availability corporate network infrastructure for IES Antonio María Calero (Pozoblanco), logically segmenting faculty, students, administration, management, IP CCTV, WiFi, network management, and internal servers.',
          solution:
            'Three-tier Top-Down hierarchical architecture (Cisco 2960 access switches, redundant Cisco 3560 multilayer distribution switches with HSRP load sharing, and dual Cisco 2911 edge routers with NAT and floating static routes), 8 VLANs, DHCP Relay, SNMPv2/NetFlow monitoring, real hardware budget, and full validation in Cisco Packet Tracer.',
          stack: [
            'Cisco Packet Tracer',
            'TCP/IP & VLANs',
            'HSRP / High Availability',
            'DHCP & NAT',
            'SNMPv2 & NetFlow',
            'Top-Down Design'
          ],
          highlights: [
            'Hierarchical topology with dual Cisco 2911 edge routers and active/standby HSRP load balancing across Cisco 3560 switches.',
            '8 segmented VLANs (/24 and /23), dedicated DHCP server with ip helper-address, redundant NAT, SNMPv2, and NetFlow.',
            'Includes validated Packet Tracer prototype (.pkt), technical engineering report (PDF), and itemized budget (€32,378.73).'
          ],
          codeSnippet:
            '# VLAN Segmentation + HSRP High Availability (Cisco 3560 / 2911)\nVLAN 10 FACULTY     : 192.168.10.0/24  GW 192.168.10.1 (HSRP: Multicapa1)\nVLAN 20 STUDENTS    : 192.168.20.0/23  GW 192.168.20.1 (HSRP: Multicapa2)\nVLAN 30 OFFICE      : 192.168.30.0/24  GW 192.168.30.1 (HSRP: Multicapa1)\nVLAN 40 MANAGEMENT  : 192.168.40.0/24  GW 192.168.40.1 (HSRP: Multicapa2)\nVLAN 50 CCTV        : 192.168.50.0/24  GW 192.168.50.1 (HSRP: Multicapa1)\nVLAN 60 WIFI        : 192.168.60.0/23  GW 192.168.60.1 (HSRP: Multicapa2)\nVLAN 70 NET-ADMIN   : 192.168.70.0/24  GW 192.168.70.1 (SNMPv2 · NetFlow)\nVLAN 80 SERVERS     : 192.168.80.0/24  GW 192.168.80.1 (DHCP Relay)',
          repoUrl: 'https://github.com/Rafags04/DisenioRedCorporativa-IESAntonioMariaCalero'
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
        'Python (Flask & Qiskit)',
        'Java',
        'HTML5 & CSS3',
        'TCP/IP Networks & Cisco PT',
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
      pageTitle: 'Rafael García Sánchez | Ingeniero Informático en formación (UCLM) — Portfolio RafaOS',
      metaDescription:
        'Portfolio oficial de Rafael García Sánchez (@Rafags04), estudiante de Ingeniería Informática en la UCLM (Ciudad Real). Proyectos en desarrollo web PWA, software cuántico Qiskit y diseño de redes corporativas en Cisco Packet Tracer.',
      skipLink: 'Saltar al escritorio',
      menuFinder: 'Finder',
      menuWindow: 'Ventana',
      menuTile: 'Ordenar en mosaico',
      menuShowAll: 'Mostrar todas las ventanas',
      menuMinimizeAll: 'Minimizar todas (Escritorio)',
      menuCvPdf: 'Descargar CV.pdf',
      menuWallpaper: 'Fondo',
      wpBigSur: 'macOS Big Sur (Montañas)',
      wpSequoia: 'macOS Sequoia (Ondas)',
      wpMonterey: 'macOS Monterey (Cañón)',
      wpMojave: 'macOS Mojave (Dunas)',
      widgetHint: 'Haz clic en cualquier aplicación del Dock para abrirla · ⌘K Spotlight',
      spotlightBtnAria: 'Buscar con Spotlight (⌘K)',
      langBtnText: 'EN',
      langBtnAria: 'Switch language to English',
      themeToLight: 'Modo Claro',
      themeToDark: 'Modo Oscuro',
      winAboutTitle: 'Sobre mí — Rafael García',
      winProjectsTitle: 'Proyectos — Rafael García',
      winEduTitle: 'Formación y Competencias',
      winGithubTitle: 'Monitor GitHub — @Rafags04',
      winContactTitle: 'Contactos — Rafael García',
      appAboutName: 'Sobre mí',
      appProjectsName: 'Proyectos',
      appEduName: 'Formación',
      appGithubName: 'Monitor GitHub',
      appContactName: 'Contactos',
      winClose: 'Cerrar ventana',
      winMinimize: 'Minimizar al Dock',
      winZoom: 'Ampliar / Restaurar ventana',
      heroDownloadCv: 'Descargar CV (PDF)',
      heroOpenCv: 'Vista Previa CV…',
      tabOverview: 'Proyectos',
      tabLiveSim: 'Probar Simulador DGT',
      tabCode: 'Código',
      githubSyncTag: 'GitHub · act.',
      githubSyncedTag: 'Sincronizado con GitHub',
      zoomLabel: 'Ampliar',
      problemLabel: 'Problema',
      solutionLabel: 'Solución',
      viewDetailsBtn: 'Vista Rápida (Ampliar)',
      repoGithubBtn: 'Abrir en GitHub ↗',
      dgtSimTitle: 'Evaluador Oficial DGT — Permiso B',
      dgtSimRule: 'NO APTO con: 1 Eliminatoria · 2 Deficientes · 1 Deficiente + 5 Leves · 10 Leves',
      dgtMinorLabel: 'Leves',
      dgtMajorLabel: 'Deficientes',
      dgtDisqLabel: 'Eliminatorias',
      dgtAddMinor: '+ Leve',
      dgtAddMajor: '+ Deficiente',
      dgtAddDisq: '+ Eliminatoria',
      dgtReset: 'Reiniciar examen',
      dgtPass: 'APTO',
      dgtFail: 'NO APTO',
      githubSyncBtn: 'Actualizar',
      githubLangHeading: 'Lenguajes por bytes',
      githubReposHeading: 'Repositorios propios',
      eduAcademicTitle: 'Formación Académica',
      eduCoursesTitle: 'Certificaciones',
      techSkillsHeading: 'Stack Técnico',
      languagesHeading: 'Idiomas',
      profileExtraHeading: 'Perfil y Disponibilidad',
      contactPhoneLabel: 'Teléfono',
      contactEmailLabel: 'Email',
      contactLocationLabel: 'Ubicación',
      contactLinkedInLabel: 'LinkedIn',
      contactGitHubLabel: 'GitHub',
      copyBtn: 'Copiar',
      dockAbout: 'Sobre mí',
      dockProjects: 'Proyectos',
      dockEdu: 'Formación',
      dockGithub: 'Monitor GitHub',
      dockContact: 'Contactos',
      dockCv: 'Vista Previa CV',
      dockLinkedin: 'LinkedIn',
      dockGithubProfile: 'GitHub (@Rafags04)',
      dockPhone: 'Teléfono · 644 41 06 02',
      dockEmail: 'Email · rafags0407@gmail.com',
      spotlightPlaceholder: 'Buscar en RafaOS (proyectos, CV, email, idioma…)',
      spotlightEmpty: 'Sin resultados para tu búsqueda.',
      spActSim: 'Probar Simulador PDA DGT en vivo',
      spActCvPreview: 'Abrir Vista Previa del CV',
      spActCvDownload: 'Descargar CV Original (PDF)',
      spActCopyEmail: 'Copiar email (rafags0407@gmail.com)',
      spActCopyPhone: 'Copiar teléfono ((+34) 644 41 06 02)',
      spActLinkedin: 'Abrir perfil de LinkedIn',
      spActGithub: 'Abrir perfil de GitHub (@Rafags04)',
      spActTile: 'Ordenar y mostrar todas las ventanas',
      spActLang: 'Cambiar idioma (Español / English)',
      spActTheme: 'Cambiar aspecto (Oscuro / Claro)',
      projModalClose: 'Cerrar (Esc)',
      projModalTabSummary: 'Problema y Solución',
      projModalTabCode: 'Fragmento de Código',
      projModalTabStack: 'Stack y Puntos Clave',
      projModalOpenRepo: 'Abrir repositorio en GitHub',
      cvModalTitle: 'Vista Previa — Currículum Vitae',
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
      toastThemeLight: 'Aspecto macOS Claro activado',
      toastThemeDark: 'Aspecto macOS Oscuro activado',
      toastLangChanged: 'Idioma cambiado a Español',
      toastTiled: 'Ventanas ordenadas en mosaico',
      toastWallpaper: 'Fondo cambiado a {name}'
    },

    en: {
      pageTitle: 'Rafael García Sánchez | Computer Engineering Student (UCLM) — RafaOS Portfolio',
      metaDescription:
        'Official portfolio of Rafael García Sánchez (@Rafags04), Computer Engineering student at UCLM (Ciudad Real, Spain). Projects in PWA web development, IBM Qiskit quantum software quality, and Cisco Packet Tracer corporate network design.',
      skipLink: 'Skip to desktop',
      menuFinder: 'Finder',
      menuWindow: 'Window',
      menuTile: 'Tile Windows',
      menuShowAll: 'Show All Windows',
      menuMinimizeAll: 'Minimize All (Desktop)',
      menuCvPdf: 'Download CV.pdf',
      menuWallpaper: 'Wallpaper',
      wpBigSur: 'macOS Big Sur (Mountains)',
      wpSequoia: 'macOS Sequoia (Ribbons)',
      wpMonterey: 'macOS Monterey (Canyon)',
      wpMojave: 'macOS Mojave (Dunes)',
      widgetHint: 'Click any app in the Dock to open it · ⌘K Spotlight',
      spotlightBtnAria: 'Spotlight Search (⌘K)',
      langBtnText: 'ES',
      langBtnAria: 'Cambiar idioma a Español',
      themeToLight: 'Light Mode',
      themeToDark: 'Dark Mode',
      winAboutTitle: 'About This Dev — Rafael García',
      winProjectsTitle: 'Projects — Rafael García',
      winEduTitle: 'Education & Skills',
      winGithubTitle: 'GitHub Monitor — @Rafags04',
      winContactTitle: 'Contacts — Rafael García',
      appAboutName: 'About Me',
      appProjectsName: 'Projects',
      appEduName: 'Education',
      appGithubName: 'GitHub Monitor',
      appContactName: 'Contacts',
      winClose: 'Close window',
      winMinimize: 'Minimize to Dock',
      winZoom: 'Zoom / Restore window',
      heroDownloadCv: 'Download CV (PDF)',
      heroOpenCv: 'Quick Look CV…',
      tabOverview: 'Projects',
      tabLiveSim: 'Live DGT Demo',
      tabCode: 'Code',
      githubSyncTag: 'GitHub · upd.',
      githubSyncedTag: 'Synced with GitHub',
      zoomLabel: 'Expand',
      problemLabel: 'Problem',
      solutionLabel: 'Solution',
      viewDetailsBtn: 'Quick Look (Expand)',
      repoGithubBtn: 'Open on GitHub ↗',
      dgtSimTitle: 'Official DGT Evaluator — Category B',
      dgtSimRule: 'FAIL at: 1 Disqualifying · 2 Major · 1 Major + 5 Minor · 10 Minor',
      dgtMinorLabel: 'Minor',
      dgtMajorLabel: 'Major',
      dgtDisqLabel: 'Disqualifying',
      dgtAddMinor: '+ Minor',
      dgtAddMajor: '+ Major',
      dgtAddDisq: '+ Disqualifying',
      dgtReset: 'Reset exam',
      dgtPass: 'PASS',
      dgtFail: 'FAIL',
      githubSyncBtn: 'Refresh',
      githubLangHeading: 'Languages by bytes',
      githubReposHeading: 'Own repositories',
      eduAcademicTitle: 'Academic Background',
      eduCoursesTitle: 'Certifications',
      techSkillsHeading: 'Technical Stack',
      languagesHeading: 'Languages',
      profileExtraHeading: 'Profile & Availability',
      contactPhoneLabel: 'Phone',
      contactEmailLabel: 'Email',
      contactLocationLabel: 'Location',
      contactLinkedInLabel: 'LinkedIn',
      contactGitHubLabel: 'GitHub',
      copyBtn: 'Copy',
      dockAbout: 'About Me',
      dockProjects: 'Projects',
      dockEdu: 'Education',
      dockGithub: 'GitHub Monitor',
      dockContact: 'Contacts',
      dockCv: 'CV Preview',
      dockLinkedin: 'LinkedIn',
      dockGithubProfile: 'GitHub (@Rafags04)',
      dockPhone: 'Phone · 644 41 06 02',
      dockEmail: 'Email · rafags0407@gmail.com',
      spotlightPlaceholder: 'Search RafaOS (projects, CV, email, language…)',
      spotlightEmpty: 'No matching actions.',
      spActSim: 'Try Live DGT PDA Simulator',
      spActCvPreview: 'Open CV Quick Preview',
      spActCvDownload: 'Download Original CV (PDF)',
      spActCopyEmail: 'Copy email (rafags0407@gmail.com)',
      spActCopyPhone: 'Copy phone ((+34) 644 41 06 02)',
      spActLinkedin: 'Open LinkedIn profile',
      spActGithub: 'Open GitHub profile (@Rafags04)',
      spActTile: 'Tile & show all windows',
      spActLang: 'Switch language (Español / English)',
      spActTheme: 'Toggle appearance (Dark / Light)',
      projModalClose: 'Close (Esc)',
      projModalTabSummary: 'Problem & Solution',
      projModalTabCode: 'Code Snippet',
      projModalTabStack: 'Stack & Highlights',
      projModalOpenRepo: 'Open GitHub repository',
      cvModalTitle: 'Preview — Curriculum Vitae',
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
      toastThemeLight: 'macOS Light appearance enabled',
      toastThemeDark: 'macOS Dark appearance enabled',
      toastLangChanged: 'Language switched to English',
      toastTiled: 'Windows tiled neatly',
      toastWallpaper: 'Wallpaper set to {name}'
    }
  };

  let currentLang = 'es';
  try {
    const urlLang =
      typeof window.location !== 'undefined'
        ? new URLSearchParams(window.location.search).get('lang')
        : null;
    const savedLang = localStorage.getItem('portfolio_lang');
    if (urlLang === 'en' || urlLang === 'es') {
      currentLang = urlLang;
    } else if (savedLang === 'en' || savedLang === 'es') {
      currentLang = savedLang;
    }
  } catch {
    // Ignorar si almacenamiento no disponible
  }

  window.Portfolio.UI_STRINGS = UI_STRINGS;
  window.Portfolio.getLang = () => currentLang;
  window.Portfolio.getProfile = () => PROFILES[currentLang];
  window.Portfolio.getStrings = () => UI_STRINGS[currentLang];
  window.Portfolio.setLang = (lang) => {
    currentLang = lang === 'en' ? 'en' : 'es';
    try {
      localStorage.setItem('portfolio_lang', currentLang);
    } catch {
      // Ignorar
    }
    return currentLang;
  };
})();
