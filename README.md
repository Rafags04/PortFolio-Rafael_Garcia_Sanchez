# Portfolio Personal — Rafags04

Portfolio estático en **HTML5 + CSS3 + JavaScript (ES6+)** sin herramientas de build, diseñado para funcionar tanto al abrir `index.html` directamente desde tu ordenador (`file://`) como desplegado en **GitHub Pages**.

## Características principales
- **Compatible con apertura local (`file://`) y servidor web (`https://`):** scripts cargados con `defer` sin bloqueos CORS de módulos locales.
- **Primera pantalla clara (test de 30 segundos):** presenta nombre, rol, propuesta de valor, contacto rápido, proyectos y botón directo a CV imprimible/PDF.
- **Proyectos filtrables por tecnología:** Problema → Solución → Stack → Repositorio/Demo con filtros interactivos.
- **Actividad real de GitHub API:** consulta repositorios propios (excluyendo forks) y calcula el desglose real de lenguajes por **bytes** (con respaldo de demostración si no hay conexión).
- **Terminal interactiva de consulta:** pre-iniciada, responde por teclado y botones rápidos, con un único bucle `requestAnimationFrame` pausado fuera de pantalla, con la pestaña oculta y desactivado en móvil o con `prefers-reduced-motion`.
- **Accesible:** HTML semántico, contraste AA/AAA, enlace para saltar al contenido y diálogo `aria-modal` con trampa de foco y retorno de foco al cerrar.

## Estructura de carpetas

```text
PortFolio/
├── index.html               # Página principal semántica, SEO/Open Graph y scripts defer
├── 404.html                 # Página de error 404 para GitHub Pages
├── style.css                # Hoja de estilos mobile-first y reglas de impresión
├── favicon.svg              # Favicon vectorial ligero
├── robots.txt               # Directivas de rastreo
├── sitemap.xml              # Mapa del sitio
├── README.md                # Esta documentación
└── src/
    ├── main.js              # Renderizado seguro (textContent), filtros y eventos
    ├── data/
    │   └── profile.js       # Única fuente de verdad (datos de ejemplo listos para sustituir)
    └── modules/
        ├── github.js        # Cliente de la API pública de GitHub (repos + bytes)
        ├── modal.js         # Gestión de foco del diálogo CV
        └── terminal.js      # Terminal interactiva y rAF único pausable
```

## Cómo sustituir los datos de ejemplo por los tuyos

1. Abre [src/data/profile.js](src/data/profile.js) y actualiza el objeto `window.Portfolio.PROFILE` con tu nombre real, rol, descripción, email, LinkedIn, proyectos, formación, experiencia y tecnologías.
2. Actualiza también los textos estáticos iniciales del Hero y las metaetiquetas `<title>` / `description` / `og:*` en [index.html](index.html) para que coincidan desde el primer pintado.
3. Si añades un archivo PDF propio (por ejemplo `./assets/cv.pdf`), pon su ruta en `contact.cvPdfUrl` dentro de `src/data/profile.js`.

## Cómo desplegar en GitHub Pages

1. Sube los cambios a la rama `main` de tu repositorio `Rafags04/PortFolio`:
   ```bash
   git add .
   git commit -m "Actualiza datos del portfolio"
   git push origin main
   ```
2. En GitHub, entra en **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`, y pulsa **Save**.
