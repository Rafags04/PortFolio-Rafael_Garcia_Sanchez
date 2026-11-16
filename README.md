# Portfolio Personal — Rafags04

Portfolio estático en **HTML5 + CSS3 + JavaScript (ES Modules nativos)** sin herramientas de build, diseñado para desplegarse directamente en **GitHub Pages**.

## Características principales
- **Primera pantalla clara (test de 30 segundos):** presenta nombre, rol, propuesta de valor, contacto rápido, proyectos y botón directo a CV imprimible/PDF.
- **Honestidad total:** los datos pendientes de completar están marcados explícitamente con `TODO:` y resaltados visualmente en la web hasta que los sustituyas.
- **Proyectos estructurados:** Problema → Solución → Stack → Repositorio/Demo real.
- **Actividad real de GitHub API:** consulta repositorios propios (excluyendo forks) y calcula el desglose real de lenguajes por **bytes**. Si la API falla o alcanza el límite de peticiones, muestra un error real sin datos ficticios.
- **Único elemento interactivo extra (Terminal):** cargada en diferido al entrar en pantalla, con un único bucle `requestAnimationFrame` que se pausa fuera de pantalla o con la pestaña oculta y usa modo estático en móvil y con `prefers-reduced-motion`.
- **Accesible:** HTML semántico, contraste AA/AAA, enlace para saltar al contenido y diálogo `aria-modal` con trampa de foco y retorno de foco al cerrar.

## Estructura de carpetas

```text
PortFolio/
├── index.html               # Página principal semántica y SEO/Open Graph
├── 404.html                 # Página de error 404 para GitHub Pages
├── style.css                # Hoja de estilos mobile-first y reglas de impresión
├── favicon.svg              # Favicon vectorial ligero
├── robots.txt               # Directivas de rastreo
├── sitemap.xml              # Mapa del sitio
├── README.md                # Esta documentación
└── src/
    ├── main.js              # Renderizado seguro (textContent) y carga diferida
    ├── data/
    │   └── profile.js       # Única fuente de verdad de tus datos y marcadores TODO:
    └── modules/
        ├── github.js        # Cliente de la API pública de GitHub (repos + bytes)
        ├── modal.js         # Gestión de foco del diálogo CV
        └── terminal.js      # Terminal interactiva diferida y rAF pausable
```

## Cómo editar tus datos

1. Abre `src/data/profile.js`.
2. Sustituye todos los textos que empiezan por `TODO:` por tu información real (apellidos, rol objetivo, resumen, ubicación, email, LinkedIn, ruta a tu PDF si añades uno, descripción problema/solución del repositorio `ISO2-2025GrupoB.03-Testing-P2`, formación, experiencia y tecnologías).
3. Guarda los cambios: el bloque **"Datos pendientes por completar"** en la sección de Contacto desaparecerá automáticamente cuando no quede ningún `TODO:`.

## Cómo desplegar en GitHub Pages

1. Sube los cambios a la rama `main` de tu repositorio `Rafags04/PortFolio`:
   ```bash
   git add .
   git commit -m "Rediseño desde cero del portfolio"
   git push origin main
   ```
2. En GitHub, entra en **Settings → Pages**.
3. En **Build and deployment**, selecciona:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` y carpeta `/ (root)`
4. Pulsa **Save**. Tu sitio quedará publicado en `https://rafags04.github.io/PortFolio/`.

