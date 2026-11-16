/**
 * Diálogo accesible (aria-modal) con trampa de foco (Tab / Shift+Tab),
 * cierre con Escape o clic en el fondo y retorno de foco al disparador.
 */
(function () {
  window.Portfolio = window.Portfolio || {};

  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  window.Portfolio.createAccessibleModal = function createAccessibleModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) {
      return { open: function () {}, close: function () {}, isOpen: function () { return false; } };
    }

    let lastFocusedElement = null;

    function getFocusableElements() {
      return Array.from(modalEl.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('hidden') && el.offsetParent !== null
      );
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || !modalEl.contains(document.activeElement)) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last || !modalEl.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleBackdropClick(event) {
      if (event.target === modalEl) {
        close();
      }
    }

    function open(triggerElement) {
      if (!modalEl.hidden) return;
      lastFocusedElement = triggerElement || document.activeElement;
      modalEl.hidden = false;
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', handleKeyDown);
      modalEl.addEventListener('click', handleBackdropClick);

      const focusables = getFocusableElements();
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    function close() {
      if (modalEl.hidden) return;
      modalEl.hidden = true;
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeyDown);
      modalEl.removeEventListener('click', handleBackdropClick);

      if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === 'function' &&
        document.contains(lastFocusedElement)
      ) {
        lastFocusedElement.focus();
      }
      lastFocusedElement = null;
    }

    return {
      open,
      close,
      isOpen: function () {
        return !modalEl.hidden;
      }
    };
  };
})();
