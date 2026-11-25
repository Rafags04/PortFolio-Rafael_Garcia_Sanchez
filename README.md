# RafaOS — Portfolio estilo macOS de Rafael García Sánchez (@Rafags04)

Portfolio interactivo estilo **macOS Sequoia / Sonoma** construido con **HTML5 + CSS3 + JavaScript (ES6+)** sin dependencias externas a partir del currículum oficial de **Rafael García Sánchez** y sus repositorios públicos en GitHub. Funciona tanto al abrir [index.html](index.html) directamente en local (`file://`) como publicado en **GitHub Pages**.

## Características principales
- **Arranque limpio de escritorio macOS:** todas las aplicaciones inician minimizadas como al encender el Mac, mostrando únicamente el widget de bienvenida estilo macOS Sonoma y el Dock flotante inferior (sin iconos en el escritorio).
- **Barra de menú superior fija:** muestra la app activa (`Finder`, `Sobre mí`, etc.), menús **Ventana** (`Ordenar en mosaico`, `Mostrar todas`, `Minimizar todas`, `Descargar CV.pdf`) y **Fondo** para elegir entre **4 fondos nativos de Mac** (`Big Sur`, `Sequoia`, `Monterey` y `Mojave`), además de **Spotlight (`⌘K`)**, selector `EN / ES`, aspecto **Oscuro / Claro** y reloj en vivo.
- **Dock interactivo con etiquetas flotantes y contactos ampliados:** al pasar el ratón sobre cualquier icono aparece su etiqueta flotante (`Sobre mí`, `Proyectos`, `Experiencia Laboral`, `Formación`, `Tecnologías`, `Contactos`, etc.) y junto a **LinkedIn** incluye accesos directos a **GitHub**, **Teléfono** y **Email**. Las 6 ventanas se pueden **arrastrar libremente**, **redimensionar** desde la esquina inferior derecha, minimizar al Dock (`–`), cerrar (`×`) o ampliar (`+` / doble clic en barra).
- **Probador en vivo del Simulador PDA DGT:** pestaña interactiva dentro de *SimuladorPDA_PermisoB.app* para registrar faltas (`Leves`, `Deficientes`, `Eliminatorias`) y calcular `APTO` / `NO APTO` según el reglamento real.

## Estructura de carpetas

```text
PortFolio-Rafael_Garcia_Sanchez/
├── .gitignore                           # Exclusión de secretos, claves, cachés y archivos locales
├── index.html                           # Escritorio macOS semántico y scripts defer
├── 404.html                             # Página de error 404 para GitHub Pages
├── style.css                            # Escritorio libre, Vibrancy cristal, semáforos y Dock
├── favicon.svg                          # Favicon vectorial
├── README.md                            # Documentación
├── assets/
│   ├── CV-Rafael-Garcia-Sanchez.pdf     # CV oficial descargable
│   ├── profile-rafa.png                 # Retrato de perfil (356×357)
│   ├── projects/
│   │   ├── simulador-pda.png            # Captura en vivo del simulador PDA DGT
│   │   ├── qiskit-case-study.png        # Vista del caso de estudio y circuito Qiskit
│   │   └── red-corporativa-pt.png       # Topología lógica real en Cisco Packet Tracer
│   └── wallpapers/                      # 4 fondos integrados de serie estilo macOS
│       ├── big-sur.svg
│       ├── sequoia.svg
│       ├── monterey.svg
│       └── mojave.svg
└── src/
    ├── main.js                          # Gestor de ventanas, Dock, Spotlight, Tecnologías, DGT live y CV modal
    ├── data/
    │   └── profile.js                   # Fuente única bilingüe (ES/EN) del CV, tecnologías y proyectos
    └── modules/
        └── modal.js                     # Diálogos accesibles (trampa y retorno de foco)
```

## Despliegue en GitHub Pages

URL pública: `https://rafags04.github.io/PortFolio-Rafael_Garcia_Sanchez/`

1. Sube los cambios a la rama `main` de `Rafags04/PortFolio-Rafael_Garcia_Sanchez`:
   ```bash
   git add .
   git commit -m "feat: portfolio estilo macOS (RafaOS)"
   git push origin main
   ```
2. En GitHub, entra en **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
