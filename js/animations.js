/**
 * Script para animaciones CSS con IntersectionObserver
 * Detecta cuando elementos entran en viewport y activa sus animaciones
 */

document.addEventListener('DOMContentLoaded', function() {
  // Crear IntersectionObserver para activar animaciones al scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Agregar clase 'visible' cuando el elemento entra en viewport
        entry.target.classList.add('visible');
        // Opcional: dejar de observar después de la primera animación
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con clases de animación
  const animatedElements = document.querySelectorAll(
    '.scroll-animate, .scroll-animate-left, .scroll-animate-right'
  );
  
  animatedElements.forEach(function(element) {
    observer.observe(element);
  });

  // Animar elementos que ya están en viewport al cargar
  setTimeout(function() {
    animatedElements.forEach(function(element) {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add('visible');
      }
    });
  }, 100);
});
