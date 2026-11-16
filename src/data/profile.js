/**
 * Fuente única de datos del portfolio (datos de ejemplo completos).
 * Sustituye estos valores por tus datos reales cuando estés listo.
 * En cada proyecto puedes poner "image: './assets/projects/tu-foto.png'"
 * o "image: null" si no deseas mostrar captura en ese proyecto.
 */
(function () {
  window.Portfolio = window.Portfolio || {};

  window.Portfolio.PROFILE = {
    name: 'Rafael García Sánchez',
    shortName: 'Rafa',
    role: 'Desarrollador de Software Full-Stack & QA Engineer',
    headline:
      'Construyo aplicaciones web rápidas, APIs escalables y suites de testing automatizado. Enfocado en código limpio, accesibilidad y despliegues fiables en producción.',
    location: 'Madrid, España · Remoto / Híbrido',
    availability: 'Disponible para incorporación inmediata (Jornada completa)',

    contact: {
      email: 'rafa.garcia.dev@gmail.com',
      linkedin: 'https://www.linkedin.com/in/rafa-garcia-dev',
      githubUser: 'Rafags04',
      githubUrl: 'https://github.com/Rafags04',
      cvPdfUrl: null
    },

    projects: [
      {
        id: 'iso2-testing-p2',
        title: 'ISO2-2025GrupoB.03-Testing-P2 — Suite de Calidad y Testing',
        categories: ['java', 'js', 'testing'],
        image: './assets/projects/iso2-testing.svg',
        imageAlt: 'Panel de ejecución de pruebas JUnit y métricas de cobertura del proyecto ISO2',
        problem:
          'Falta de cobertura automatizada y validaciones inconsistentes en flujos críticos de negocio durante entregas continuas.',
        solution:
          'Diseño e implementación de pruebas unitarias, de integración y validación de interfaz con informes de cobertura automatizados.',
        stack: ['Java', 'JUnit', 'JavaScript', 'HTML5', 'CSS3'],
        highlights: [
          'Diseño de casos mediante clases de equivalencia y valores límite.',
          'Ejecución automática en Maven/JUnit con métricas de cobertura de ramas.',
          'Validación de formularios frontend y casos de borde sin regresiones.'
        ],
        codeSnippet:
          '@Test\nvoid rejectsBoundaryOutOfRange() {\n  assertThrows(IllegalArgumentException.class,\n    () -> validator.checkRange(-1, 100));\n}',
        repoUrl: 'https://github.com/Rafags04/ISO2-2025GrupoB.03-Testing-P2',
        demoUrl: null
      },
      {
        id: 'pulse-metrics',
        title: 'PulseMetrics — API REST & Telemetría en Tiempo Real',
        categories: ['js', 'backend'],
        image: './assets/projects/pulse-metrics.svg',
        imageAlt: 'Dashboard de latencia P95 y rendimiento de caché Redis en PulseMetrics',
        problem:
          'Consultas SQL lentas y pérdida de trazabilidad bajo picos de concurrencia en paneles de monitorización en vivo.',
        solution:
          'API REST en Node.js y TypeScript con capa de caché en Redis, PostgreSQL transaccional y contenedores Docker reproducibles.',
        stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
        highlights: [
          'Reducción de latencia P95 mediante patrón cache-aside en Redis.',
          'Pooling de conexiones ACID y migraciones versionadas en PostgreSQL.',
          'Endpoints tipados con validación de entrada y control de tasa.'
        ],
        codeSnippet:
          'const cached = await redis.get(cacheKey);\nif (cached) return res.json(JSON.parse(cached));\nconst rows = await db.query(METRICS_SQL);\nawait redis.setEx(cacheKey, 30, JSON.stringify(rows));',
        repoUrl: 'https://github.com/Rafags04',
        demoUrl: null
      },
      {
        id: 'cloud-task',
        title: 'CloudTask — Gestor Colaborativo de Despliegues y Tareas',
        categories: ['js', 'backend', 'testing'],
        image: './assets/projects/cloud-task.svg',
        imageAlt: 'Tablero Kanban de despliegues y estado de contenedores Docker en CloudTask',
        problem:
          'Despliegues manuales propensos a errores humanos y falta de visibilidad del estado de cada entorno en equipos pequeños.',
        solution:
          'Plataforma web en React respaldada por microservicio Python FastAPI, pipelines en GitHub Actions y contenedores Docker.',
        stack: ['React', 'Python FastAPI', 'Docker', 'GitHub Actions'],
        highlights: [
          'Tablero reactivo con estados de build, staging y producción.',
          'Healthchecks automáticos y verificación con Pytest en cada PR.',
          'Empaquetado ligero multi-stage listo para entornos cloud.'
        ],
        codeSnippet:
          '@app.get("/health")\nasync def healthcheck():\n    return {"status": "ok", "workers": 3, "queue_lag_ms": 12}',
        repoUrl: 'https://github.com/Rafags04',
        demoUrl: null
      },
      {
        id: 'portfolio-gh-pages',
        title: 'Portfolio de Ingeniería & Terminal Interactiva',
        categories: ['js'],
        image: './assets/projects/portfolio-terminal.svg',
        imageAlt: 'Vista general del portfolio estático con gráfica de GitHub y terminal interactiva',
        problem:
          'Presentar proyectos, stack técnico y contacto directo en menos de 30 segundos sin librerías pesadas ni fricción móvil.',
        solution:
          'Web estática en HTML5, CSS3 y JavaScript ES6+ compatible con apertura local (file://) y GitHub Pages, datos de GitHub en vivo y terminal interactiva.',
        stack: ['HTML5', 'CSS3', 'JavaScript ES6+', 'GitHub REST API'],
        highlights: [
          'Cero dependencias externas y compatible con file:// y GitHub Pages.',
          'Consumo en directo de bytes por lenguaje desde GitHub REST API.',
          'Visor modal accesible (WCAG AA), buscador en tiempo real y cambio de tema.'
        ],
        codeSnippet:
          'const ownRepos = rawRepos.filter((r) => !r.fork);\nconst langs = await Promise.all(ownRepos.map((r) => fetch(r.languages_url)));',
        repoUrl: 'https://github.com/Rafags04/PortFolio',
        demoUrl: 'https://rafags04.github.io/PortFolio/'
      }
    ],

    experienceAndEducation: [
      {
        type: 'Formación',
        title: 'Grado en Ingeniería Informática · Universidad Politécnica (2022 – 2026)',
        detail:
          'Especialización en Ingeniería del Software, calidad y testing (ISO2), arquitectura de sistemas y desarrollo web.'
      },
      {
        type: 'Experiencia',
        title: 'Desarrollador Full-Stack en Prácticas · TechNova Labs (2025)',
        detail:
          'Desarrollo de endpoints REST con Node.js y PostgreSQL, optimización de consultas SQL (-35% latencia) y pruebas automáticas en CI.'
      },
      {
        type: 'Experiencia',
        title: 'Colaborador Open Source & Proyectos Académicos (2024 – Presente)',
        detail:
          'Implementación de suites de testing en Java/JUnit, automatización con GitHub Actions y diseño de interfaces web accesibles.'
      }
    ],

    skills: [
      {
        category: 'Frontend & UI',
        items: [
          'HTML5 Semántico',
          'CSS3 / Grid & Flexbox',
          'JavaScript (ES6+)',
          'TypeScript',
          'React',
          'Accesibilidad (WCAG AA)'
        ]
      },
      {
        category: 'Backend & Datos',
        items: [
          'Node.js',
          'Python (FastAPI)',
          'Java OOP',
          'PostgreSQL',
          'Redis',
          'APIs RESTful & JWT'
        ]
      },
      {
        category: 'Testing, DevOps & Herramientas',
        items: [
          'JUnit & Testing E2E',
          'Git & GitHub Actions',
          'Docker',
          'Linux & Bash',
          'Lighthouse & Web Vitals'
        ]
      }
    ]
  };
})();
