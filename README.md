# Portfolio Personal — Rafael García Sánchez (@Rafags04)

Portfolio estático construido desde cero con **HTML5 + CSS3 + JavaScript (ES6+)** a partir del currículum oficial de **Rafael García Sánchez** y sus repositorios reales en GitHub. Funciona tanto al abrir [index.html](index.html) directamente en local (`file://`) como publicado en **GitHub Pages**.

## Características principales
- **Datos reales del CV:** incluye retrato de perfil ([assets/profile-rafa.png](assets/profile-rafa.png)), descarga directa del PDF oficial ([assets/CV-Rafael-Garcia-Sanchez.pdf](assets/CV-Rafael-Garcia-Sanchez.pdf)), formación académica en la UCLM, las 12 certificaciones de formación complementaria filtrables, habilidades técnicas, soft skills, idiomas y datos de contacto copiables.
- **Sección de Proyectos Destacados de GitHub:** muestra tus repositorios seleccionados con capturas ampliables, buscador en vivo, filtros por tecnología, sincronización con GitHub y visor modal con código real (`Problema → Solución → Stack`).
- **Actividad real de GitHub API (`@Rafags04`):** consulta repositorios propios (sin forks) y calcula bytes exactos por lenguaje.
- **Tema dual (Modo Oscuro Naval / Modo Claro CV):** conmutador en la cabecera con persistencia en `localStorage`.
- **Terminal interactiva:** consulta rápida de todo el perfil (`whoami`, `projects`, `education`, `courses`, `skills`, `languages`, `github`, `contact`, `cv`).

## Estructura de carpetas

```text
PortFolio/
├── index.html                           # Página principal semántica, SEO/Open Graph y scripts defer
├── 404.html                             # Página de error 404 para GitHub Pages
├── style.css                            # Diseño editorial naval/blanco, tema dual e impresión PDF
├── favicon.svg                          # Favicon vectorial
├── robots.txt                           # Directivas de rastreo
├── sitemap.xml                          # Mapa del sitio
├── README.md                            # Documentación
├── assets/
│   ├── CV-Rafael-Garcia-Sanchez.pdf     # CV oficial descargable
│   ├── profile-rafa.png                 # Retrato de perfil (356×357)
│   └── projects/                        # Capturas de los proyectos destacados
│       ├── simulador-pda.png
│       └── portfolio-web.svg
└── src/
    ├── main.js                          # Renderizado seguro (textContent), buscador, filtros y modales
    ├── data/
    │   └── profile.js                   # Fuente única de datos del CV y proyectos destacados
    └── modules/
        ├── github.js                    # API pública de GitHub (repos + bytes)
        ├── modal.js                     # Diálogos accesibles (trampa y retorno de foco)
        └── terminal.js                  # Terminal interactiva y bucle rAF único pausable
```

## Cómo añadir nuevos proyectos destacados de GitHub

1. Abre [src/data/profile.js](src/data/profile.js) y localiza el array `featuredProjects`.
2. Añade un nuevo objeto con `id`, `repoName` (el nombre exacto en GitHub para sincronizar su fecha), `title`, `categories`, `image` (opcional, o `null`), `problem`, `solution`, `stack`, `highlights`, `codeSnippet`, `repoUrl` y `demoUrl`.
3. Si incluyes captura, guárdala en `assets/projects/` (SVG, PNG, JPG o WebP) y enlázala en `image`.

## Despliegue en GitHub Pages

1. Sube los cambios a la rama `main` de `Rafags04/PortFolio`:
   ```bash
   git add .
   git commit -m "feat: rediseño completo del portfolio con CV real y proyectos destacados"
   git push origin main
   ```
2. En GitHub, entra en **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
