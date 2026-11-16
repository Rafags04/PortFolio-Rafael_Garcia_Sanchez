/**
 * Única fuente de verdad del portfolio.
 * Regla de honestidad: todo dato pendiente lleva el prefijo "TODO:" para que
 * la interfaz lo marque visualmente y puedas localizarlo y sustituirlo rápido.
 */
export const PROFILE = {
  name: 'Rafa (TODO: Añadir apellidos)',
  shortName: 'Rafa',
  role: 'TODO: Definir rol objetivo (p. ej. Desarrollador Full-Stack Junior)',
  headline: 'TODO: Escribir resumen de 1-2 frases sobre quién eres y qué aportas.',
  location: 'TODO: Ciudad / País (Modalidad remoto / híbrido / presencial)',
  availability: 'TODO: Indicar disponibilidad actual (p. ej. Abierto a prácticas o puesto junior)',

  contact: {
    email: 'TODO: tu-email-real@dominio.com',
    linkedin: 'TODO: https://www.linkedin.com/in/tu-usuario',
    githubUser: 'Rafags04',
    githubUrl: 'https://github.com/Rafags04',
    cvPdfUrl: 'TODO: Añadir ruta a tu CV en PDF (p. ej. ./assets/cv-rafa.pdf) o usar el botón de vista imprimible'
  },

  projects: [
    {
      id: 'iso2-testing-p2',
      title: 'ISO2-2025GrupoB.03-Testing-P2',
      problem: 'TODO: Describir el problema real que resuelve este proyecto de Ingeniería del Software II / Testing.',
      solution: 'TODO: Explicar cómo se implementó la solución y las pruebas del proyecto.',
      stack: ['HTML', 'JavaScript', 'Java', 'CSS'],
      repoUrl: 'https://github.com/Rafags04/ISO2-2025GrupoB.03-Testing-P2',
      demoUrl: null
    },
    {
      id: 'portfolio-gh-pages',
      title: 'Portfolio Personal en GitHub Pages',
      problem: 'Necesidad de presentar proyectos, stack y contacto en menos de 30 segundos sin dependencias pesadas ni datos ficticios.',
      solution: 'Arquitectura estática con ES Modules nativos, integración en vivo con la API de GitHub por bytes de lenguaje, terminal diferida y accesibilidad WCAG AA.',
      stack: ['HTML5', 'CSS3', 'JavaScript (ES Modules)', 'GitHub REST API'],
      repoUrl: 'https://github.com/Rafags04/PortFolio',
      demoUrl: 'https://rafags04.github.io/PortFolio/'
    }
  ],

  experienceAndEducation: [
    {
      type: 'Formación',
      title: 'TODO: Titulación / Centro / Fechas',
      detail: 'TODO: Añadir especialidad, competencias clave o trabajo académico destacado.'
    },
    {
      type: 'Experiencia',
      title: 'TODO: Experiencia o prácticas / Empresa / Fechas',
      detail: 'TODO: Describir tareas reales realizadas, tecnologías usadas y resultado obtenido.'
    }
  ],

  skills: [
    {
      category: 'Lenguajes verificados en repositorios',
      items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Java', 'Git / GitHub']
    },
    {
      category: 'Pendiente de confirmar',
      items: [
        'TODO: Confirmar tecnologías que dominas de verdad (frameworks, bases de datos, testing, Docker, etc.)'
      ]
    }
  ]
};

