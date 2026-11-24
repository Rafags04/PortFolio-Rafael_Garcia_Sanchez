# RafaOS — Portfolio estilo macOS de Rafael García Sánchez (@Rafags04)

Portfolio interactivo estilo **macOS Sequoia / Sonoma** construido con **HTML5 + CSS3 + JavaScript (ES6+)** sin dependencias externas a partir del currículum oficial de **Rafael García Sánchez** y sus repositorios públicos en GitHub. Funciona tanto al abrir [index.html](index.html) directamente en local (`file://`) como publicado en **GitHub Pages**.

## Características principales
- **Experiencia de escritorio macOS real:** barra de menú superior fija con app activa dinámica, menú desplegable **Ventana** (`Ordenar en mosaico`, `Mostrar todas`, `Minimizar todas`), reloj en vivo y centro de notificaciones.
- **5 ventanas interactivas arrastrables y redimensionables:** *Sobre mí*, *SimuladorPDA_PermisoB.app*, *Formación y Competencias*, *Monitor GitHub* y *Contactos*, con semáforos funcionales (`×` cerrar, `–` minimizar al Dock, `+` ampliar/restaurar y doble clic en la barra de título).
- **Dock flotante inferior:** con efecto lupa al pasar el ratón, indicadores luminosos de ventanas abiertas y acceso directo a Vista Previa del CV y LinkedIn.
- **Buscador Spotlight (`⌘K` / `Ctrl+K`):** ejecuta acciones rápidas, abre demos, copia contacto o cambia idioma y tema desde teclado.
- **Probador en vivo del Simulador PDA DGT:** pestaña interactiva dentro de *SimuladorPDA_PermisoB.app* para registrar faltas (`Leves`, `Deficientes`, `Eliminatorias`) y calcular `APTO` / `NO APTO` según el reglamento real.
- **Bilingüe ES / EN y Tema Dual (Oscuro / Claro macOS):** persistencia en `localStorage`.

## Estructura de carpetas

```text
PortFolio/
├── index.html                           # Escritorio macOS semántico, SEO/Open Graph y scripts defer
├── 404.html                             # Página de error 404 para GitHub Pages
├── style.css                            # Wallpaper Sequoia, Vibrancy cristal, semáforos y Dock
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
    ├── main.js                          # Gestor de ventanas, Dock, Spotlight, DGT live y CV modal
    ├── data/
    │   └── profile.js                   # Fuente única bilingüe (ES/EN) del CV y proyectos
    └── modules/
        ├── github.js                    # API pública de GitHub (repos propios + bytes)
        └── modal.js                     # Diálogos accesibles (trampa y retorno de foco)
```

## Despliegue en GitHub Pages

1. Sube los cambios a la rama `main` de `Rafags04/PortFolio`:
   ```bash
   git add .
   git commit -m "feat: portfolio estilo macOS (RafaOS)"
   git push origin main
   ```
2. En GitHub, entra en **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
