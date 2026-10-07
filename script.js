/**
 * ==========================================================================
 * PORTFOLIO - LÓGICA DE INTERFAZ & INTEGRACIÓN 3D
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar iconos Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Actualizar año automáticamente en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Menú móvil (Toggle)
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-active');
      const isExpanded = navMenu.classList.contains('is-active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
      });
    });
  }

  // 4. Selector de Temas RGB Dinámico
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeKey = btn.getAttribute('data-theme');
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (window.pcViewer && typeof window.pcViewer.setTheme === 'function') {
        window.pcViewer.setTheme(themeKey);
      }
    });
  });

  // 5. Botón de Reensamblado Cinematográfico (Scroll al inicio)
  const reassembleBtn = document.getElementById('btn-reassemble-pc');
  if (reassembleBtn) {
    reassembleBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Scroll Spy: Sincronización de sección activa en Navbar y HUD Pills
  const stageSections = document.querySelectorAll('.stage-section[id]');
  const hudPills = document.querySelectorAll('.hud-pill');

  const onScrollSpy = () => {
    const scrollY = window.pageYOffset;
    const windowH = window.innerHeight;

    stageSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - windowH * 0.35;
      const sectionId = section.getAttribute('id');
      const stageIdx = section.getAttribute('data-stage');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Actualizar navbar
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Actualizar HUD Pills
        hudPills.forEach(pill => {
          if (pill.getAttribute('href') === `#${sectionId}` || pill.getAttribute('data-step') === stageIdx) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  // 7. Simulación de Telemetría Dinámica (Temperatura en tiempo real)
  const tempEl = document.getElementById('hud-temp-val');
  if (tempEl) {
    setInterval(() => {
      const baseTemp = 37;
      const variation = Math.sin(Date.now() * 0.001) * 3 + (Math.random() * 1.5);
      tempEl.textContent = `${Math.round(baseTemp + variation)}°C`;
    }, 2000);
  }

  // 8. Sombra y elevación del header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
      header.style.borderColor = 'rgba(255, 255, 255, 0.12)';
    } else {
      header.style.boxShadow = 'none';
      header.style.borderColor = 'var(--border-color)';
    }
  }, { passive: true });

  console.log('🚀 Experiencia 3D interactiva sincronizada.');
});
