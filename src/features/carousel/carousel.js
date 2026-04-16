import './carousel.scss';
import data from './carousel.json';

import templateRaw from './carousel.html?raw';

class MatacandelasCarousel extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = templateRaw;

    const innerContainer = this.querySelector('#carousel-inner-container');
    const indicatorsContainer = this.querySelector('#carousel-indicators-container');

    // Inyectar datos en los contenedores nativos
    innerContainer.innerHTML = data.map((item, index) => `
      <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-event-id="${item.eventId || ''}" style="cursor: pointer;">
        <div class="carousel-bg" style="background-image: url('${item.image}');"></div>
        <div class="carousel-content">
          <span class="carousel-badge">${item.badge}</span>
          <h2 class="carousel-title">${item.title}</h2>
          <p class="carousel-desc">${item.description}</p>
          <button class="btn btn-danger btn-lg compra-btn carousel-action-btn" data-event-id="${item.eventId || ''}" data-ticket-url="${item.ticketUrl || ''}">
            ${item.buttonText}
          </button>
        </div>
      </div>
    `).join('');

    indicatorsContainer.innerHTML = data.map((_, index) => `
      <button class="indicator ${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>
    `).join('');

    this.initCarousel();
    this.initSlideInteractions();
  }

  /**
   * Hace scroll suave hasta la card del evento correspondiente en la sección de programación.
   * @param {string} eventId - El ID del evento (mismo que en programacion.json)
   */
  scrollToEventCard(eventId) {
    if (!eventId) return;

    // Intentamos encontrar la card directamente
    const card = document.getElementById(`event-${eventId}`);

    if (card) {
      const offset = 80; // Compensar el navbar fijo
      const top = card.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Efecto visual de highlight en la card
      card.classList.add('carousel-highlight');
      setTimeout(() => card.classList.remove('carousel-highlight'), 2000);
    } else {
      // Si la sección de programación aún no está visible, hacer scroll a #programacion
      const section = document.getElementById('programacion');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  initSlideInteractions() {
    // Click en el slide completo → scroll a la card del evento
    this.querySelectorAll('.carousel-slide').forEach(slide => {
      slide.addEventListener('click', (e) => {
        // Si el click fue sobre el botón, no hacer nada aquí (el botón tiene su propio listener)
        if (e.target.closest('.carousel-action-btn')) return;

        const eventId = slide.dataset.eventId;
        this.scrollToEventCard(eventId);
      });
    });

    // Click en el botón de acción
    this.querySelectorAll('.carousel-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se propague al slide
        const ticketUrl = btn.dataset.ticketUrl;
        const eventId = btn.dataset.eventId;

        if (ticketUrl && ticketUrl !== 'null' && ticketUrl !== '') {
          // Si hay URL de tickets, navegar ahí (mismo comportamiento que el botón de la card)
          window.open(ticketUrl, '_blank', 'noopener,noreferrer');
        } else {
          // Sin URL de tickets, hacer scroll a la card
          this.scrollToEventCard(eventId);
        }
      });
    });
  }

  initCarousel() {
    const slides = this.querySelectorAll('.carousel-slide');
    const indicators = this.querySelectorAll('.carousel-indicators .indicator');
    const prevBtn = this.querySelector('.carousel-control.prev');
    const nextBtn = this.querySelector('.carousel-control.next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    const goToSlide = (index) => {
      slides[currentSlide].classList.remove('active');
      indicators[currentSlide].classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      indicators[currentSlide].classList.add('active');
      resetInterval();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 8000);
    };

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', prevSlide);
      nextBtn.addEventListener('click', nextSlide);
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
      });
    });

    resetInterval();
  }
}

customElements.define('matacandelas-carousel', MatacandelasCarousel);
