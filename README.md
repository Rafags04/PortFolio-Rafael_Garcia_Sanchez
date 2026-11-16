# Portfolio Personal — Rafags04

Portfolio estático en **HTML5 + CSS3 + JavaScript (ES6+)** sin herramientas de build, diseñado para funcionar tanto al abrir `index.html` directamente desde tu ordenador (`file://`) como desplegado en **GitHub Pages**.

## Características principales
- **Compatible con apertura local (`file://`) y servidor web (`https://`):** scripts cargados con `defer` sin bloqueos CORS de módulos locales.
- **Primera pantalla clara (test de 30 segundos):** presenta nombre, rol, propuesta de valor, contacto rápido, proyectos y botón directo a CV imprimible/PDF.
- **Proyectos filtrables con captura ampliable:** Problema → Solución → Stack → Repositorio/Demo con buscador en tiempo real, filtros por categoría, foto opcional por proyecto y visor modal con pestañas y navegación `Anterior / Siguiente`.
- **Interactividad completa:** conmutador de tema oscuro/claro, copiar email con aviso visual, etiquetas tecnológicas clicables que filtran proyectos y efecto spotlight en tarjetas.
- **Actividad real de GitHub API:** consulta repositorios propios (excluyendo forks) y calcula el desglose real de lenguajes por **bytes** (con respaldo de demostración si no hay conexión).
- **Terminal interactiva de consulta:** pre-iniciada, responde por teclado y botones rápidos, con un único bucle `requestAnimationFrame` pausado fuera de pantalla, con la pestaña oculta y desactivado en móvil o con `prefers-reduced-motion`.
- **Accesible:** HTML semántico, contraste AA/AAA, enlace para saltar al contenido y diálogo `aria-modal` con trampa de foco y retorno de foco al cerrar.

## Estructura de carpetas

```text
PortFolio/
├── index.html               # Página principal semántica, SEO/Open Graph y scripts defer
├── 404.html                 # Página de error 404 para GitHub Pages
├── style.css                # Hoja de estilos mobile-first, tema dual y reglas de impresión
├── favicon.svg              # Favicon vectorial ligero
├── robots.txt               # Directivas de rastreo
├── sitemap.xml              # Mapa del sitio
├── README.md                # Esta documentación
├── assets/
│   └── projects/            # Capturas/imágenes de cada proyecto (SVG/PNG/JPG/WebP)
└── src/
    ├── main.js              # Renderizado seguro (textContent), buscador, visor modal y tema
    ├── data/
    │   └── profile.js       # Única fuente de verdad (datos e imágenes por proyecto)
    └── modules/
        ├── github.js        # Cliente de la API pública de GitHub (repos + bytes)
        ├── modal.js         # Gestión de foco de los diálogos modales
        └── terminal.js      # Terminal interactiva y rAF único pausable
```

## Cómo sustituir los datos de ejemplo por los tuyos

1. Abre [src/data/profile.js](src/data/profile.js) y actualiza el objeto `window.Portfolio.PROFILE` con tu nombre real, rol, descripción, email, LinkedIn, proyectos, formación, experiencia y tecnologías.
2. Para poner tu propia foto en un proyecto, guarda la captura dentro de `assets/projects/` y apunta el campo `image` a `./assets/projects/tu-captura.png` (o pon `image: null` si un proyecto no lleva foto).
3. Actualiza también los textos estáticos iniciales del Hero y las metaetiquetas `<title>` / `description` / `og:*` en [index.html](index.html) para que coincidan desde el primer pintado.
4. Si añades un archivo PDF propio (por ejemplo `./assets/cv.pdf`), pon su ruta en `contact.cvPdfUrl` dentro de `src/data/profile.js`.

## Cómo desplegar en GitHub Pages

1. Sube los cambios a la rama `main` de tu repositorio `Rafags04/PortFolio`:
   ```bash
   git add .
   git commit -m "Actualiza datos del portfolio"
   git push origin main
   ```
2. En GitHub, entra en **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`, y pulsa **Save**.
