/**
 * ==========================================================================
 * PORTFOLIO - LÓGICA JAVASCRIPT BASE
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

    // Cerrar menú al hacer click en cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
      });
    });
  }

  // 4. Scroll Spy: Resaltar sección activa en el menú al hacer scroll
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  // 5. Pequeño efecto de elevación en el header al hacer scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      header.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    } else {
      header.style.boxShadow = 'none';
      header.style.borderColor = 'var(--border-color)';
    }
  });

  console.log('🚀 Portfolio base cargado correctamente.');
});
