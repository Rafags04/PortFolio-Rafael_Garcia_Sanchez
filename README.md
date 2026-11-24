# Portfolio Personal — Rafael García Sánchez (@Rafags04)

Portfolio estático construido con **HTML5 + CSS3 + JavaScript (ES6+)** a partir del currículum oficial de **Rafael García Sánchez** y sus repositorios públicos en GitHub. Funciona tanto al abrir [index.html](index.html) directamente en local (`file://`) como publicado en **GitHub Pages**.

## Características principales
- **Presentación y CV:** incluye retrato de perfil ([assets/profile-rafa.png](assets/profile-rafa.png)), descarga directa del PDF oficial ([assets/CV-Rafael-Garcia-Sanchez.pdf](assets/CV-Rafael-Garcia-Sanchez.pdf)) y vista rápida imprimible accesible (`aria-modal`).
- **Proyectos Destacados de GitHub:** escaparate visual de [SimuladorPDA-PermisoConduccionB](https://github.com/Rafags04/SimuladorPDA-PermisoConduccionB) con captura en ejecución ampliable y código real (`Problema → Solución → Stack`).
- **Actividad real de GitHub API (`@Rafags04`):** consulta repositorios propios (sin forks) y calcula bytes por lenguaje en tiempo real.
- **Formación y Competencias:** Grado en Ingeniería Informática (UCLM), Bachillerato de Ciencias, capacitación en Calidad del Software Cuántico (AQC Lab), stack técnico, idiomas y disponibilidad.
- **Footer visual de contacto:** acceso directo con iconos vectoriales a teléfono, email, ubicación y LinkedIn.
- **Bilingüe Español / Inglés (`ES / EN`) y Tema Dual:** conmutadores persistentes (`localStorage`) en la cabecera.

## Estructura de carpetas

```text
PortFolio/
├── index.html                           # Página principal semántica, SEO/Open Graph y scripts defer
├── 404.html                             # Página de error 404 para GitHub Pages
├── style.css                            # Diseño naval/blanco con tema dual e impresión PDF
├── favicon.svg                          # Favicon vectorial
├── robots.txt                           # Directivas de rastreo
├── sitemap.xml                          # Mapa del sitio
├── README.md                            # Documentación
├── assets/
│   ├── CV-Rafael-Garcia-Sanchez.pdf     # CV oficial descargable
│   ├── profile-rafa.png                 # Retrato de perfil (356×357)
│   └── projects/
│       └── simulador-pda.png            # Captura en vivo del simulador PDA DGT
└── src/
    ├── main.js                          # Renderizado seguro (textContent) y modales
    ├── data/
    │   └── profile.js                   # Fuente única bilingüe de datos del CV y proyectos
    └── modules/
        ├── github.js                    # API pública de GitHub (repos + bytes)
        └── modal.js                     # Diálogos accesibles (trampa y retorno de foco)
```

## Cómo añadir nuevos proyectos destacados de GitHub

1. Abre [src/data/profile.js](src/data/profile.js) y localiza `featuredProjects` dentro de `PROFILES.es` y `PROFILES.en`.
2. Añade un nuevo objeto con `id`, `repoName`, `title`, `image`, `imageAlt`, `problem`, `solution`, `stack`, `highlights`, `codeSnippet`, `repoUrl` y `demoUrl`.
3. Guarda su captura en `assets/projects/` (PNG, JPG, WebP o SVG). Con 2 o más proyectos la rejilla se adapta automáticamente a múltiples columnas.

## Despliegue en GitHub Pages

1. Sube los cambios a la rama `main` de `Rafags04/PortFolio`:
   ```bash
   git add .
   git commit -m "feat: portfolio limpio, visual y bilingüe ES/EN"
   git push origin main
   ```
2. En GitHub, entra en **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
