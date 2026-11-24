/**
 * Fuente única de datos reales del portfolio de Rafael García Sánchez.
 * Extraído íntegramente de su CV oficial y repositorios en GitHub (@Rafags04).
 *
 * Cómo añadir un nuevo proyecto destacado de GitHub:
 * 1) Añade un objeto nuevo dentro de "featuredProjects".
 * 2) Pon "repoName" exactamente como se llama el repositorio en GitHub para
 *    sincronizar automáticamente su fecha de actualización y lenguaje principal.
 * 3) Guarda una captura en ./assets/projects/ y pon su ruta en "image"
 *    (o deja "image: null" si prefieres tarjeta sin foto).
 */
(function () {
  window.Portfolio = window.Portfolio || {};

  window.Portfolio.PROFILE = {
    name: 'Rafael García Sánchez',
    shortName: 'Rafael García',
    role: 'Estudiante de Ingeniería Informática',
    institution: 'Universidad de Castilla-La Mancha (UCLM)',
    avatar: './assets/profile-rafa.png',
    about:
      'Estudiante de Ingeniería Informática en búsqueda de su primer empleo en el sector tecnológico. Motivado por aplicar sus conocimientos en un entorno profesional, con interés en seguir aprendiendo y desarrollándose, aportando compromiso, responsabilidad y capacidad de trabajo en equipo.',

    contact: {
      phone: '(+34) 644 41 06 02',
      phoneHref: 'tel:+34644410602',
      email: 'rafags0407@gmail.com',
      location: 'Ciudad Real, 13003',
      githubUser: 'Rafags04',
      githubUrl: 'https://github.com/Rafags04',
      cvPdfUrl: './assets/CV-Rafael-Garcia-Sanchez.pdf'
    },

    featuredProjects: [
      {
        id: 'iso2-testing-p2',
        repoName: 'ISO2-2025GrupoB.03-Testing-P2',
        featured: true,
        title: 'ISO2-2025GrupoB.03-Testing-P2 — Calculadora de Tarifas & Testing JUnit 5',
        categories: ['java', 'testing'],
        image: './assets/projects/iso2-testing.svg',
        imageAlt:
          'Captura técnica del proyecto ISO2-2025GrupoB.03-Testing-P2 con CalculadoraTarifas.java y pruebas JUnit 5',
        problem:
          'Validar de forma rigurosa la lógica de negocio de asignación de tarifas aéreas según múltiples condiciones combinadas (edad, frecuencia de vuelos, estudios, ingresos, destino y acompañantes).',
        solution:
          'Implementación modular en Java (CalculadoraTarifas, Cliente, Tarifa) junto con una batería sistemática de casos de prueba unitarios en JUnit 5 (Jupiter) gestionada con Maven e informes técnicos.',
        stack: ['Java', 'JUnit 5', 'Maven', 'Eclipse', 'HTML', 'Git'],
        highlights: [
          'Diseño de casos de prueba con clases de equivalencia y valores límite en CalculadoraTarifaTest.',
          'Separación clara de dominio entre Cliente, Tarifa y CalculadoraTarifas.',
          'Configuración reproducible con Maven (pom.xml) y plugin Surefire para JUnit Jupiter 5.10.0.'
        ],
        codeSnippet:
          '@Test\npublic void testCP1_1() {\n  CalculadoraTarifas calc = new CalculadoraTarifas();\n  Cliente cli = new Cliente(-3, -1, true, true, true, true, true, -5000, "turista", "europa", true);\n  Tarifa tarifa = calc.calcularTarifa(cli);\n  assertEquals(null, tarifa);\n}',
        repoUrl: 'https://github.com/Rafags04/ISO2-2025GrupoB.03-Testing-P2',
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
          'Aplicación web estática sin dependencias externas con diseño adaptable oscuro/claro, visor interactivo de proyectos, conexión en directo con la API REST de GitHub y terminal de consulta.',
        stack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'GitHub REST API', 'Git'],
        highlights: [
          'Compatible tanto abriendo index.html en local (file://) como publicado en GitHub Pages.',
          'Sincronización en tiempo real de repositorios propios y bytes por lenguaje desde GitHub API.',
          'Diseño accesible WCAG AA+, modo claro/oscuro, buscador en vivo y CV imprimible en PDF.'
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
      {
        title: 'Capacitación sobre Calidad del software cuántico',
        provider: 'AQC Lab',
        date: 'Febrero 2026',
        category: 'tecnologia',
        featured: true
      },
      {
        title: 'Aprendizaje en la búsqueda y el uso de la información (Nivel avanzado)',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'informacion',
        featured: false
      },
      {
        title: 'Aprendizaje en la búsqueda y el uso de la información (Nivel inicial)',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'informacion',
        featured: false
      },
      {
        title: 'Liderazgo',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'liderazgo',
        featured: false
      },
      {
        title: 'Resolución de conflictos',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'liderazgo',
        featured: false
      },
      {
        title: 'Automotivación y productividad',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'liderazgo',
        featured: false
      },
      {
        title: 'Autocoaching',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'liderazgo',
        featured: false
      },
      {
        title: 'Emprendimiento',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'liderazgo',
        featured: false
      },
      {
        title: 'Habilidades interpersonales',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'transversales',
        featured: false
      },
      {
        title: 'Regulación emocional',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'transversales',
        featured: false
      },
      {
        title: 'Igualdad, Diversidad e Inclusión',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'transversales',
        featured: false
      },
      {
        title: 'Sostenibilidad Medioambiental',
        provider: 'Aula de Competencias Transversales',
        date: 'Febrero 2025',
        category: 'transversales',
        featured: false
      }
    ],

    technicalSkills: [
      'Fundamentos de la programación',
      'Lógica computacional',
      'Uso de entornos de desarrollo',
      'Manejo de bases de datos',
      'Uso de herramientas ofimáticas y técnicas',
      'Control de versiones con Git'
    ],

    appliedStack: [
      'Java',
      'JUnit 5',
      'Maven',
      'HTML5',
      'CSS3',
      'JavaScript'
    ],

    softSkills: [
      'Trabajo en Equipo',
      'Puntualidad',
      'Responsabilidad',
      'Compromiso',
      'Organización',
      'Resolución de problemas'
    ],

    languages: [
      { name: 'Castellano', level: 'Nativo', percent: 100 },
      { name: 'Inglés', level: 'Nivel Avanzado - (B2)', percent: 75 }
    ],

    additionalInfo: [
      'Carné de conducir Tipo B',
      'Disponibilidad total'
    ]
  };
})();
