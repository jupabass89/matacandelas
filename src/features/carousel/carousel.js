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
      <div class="carousel-slide ${index === 0 ? 'active' : ''}">
        <div class="carousel-bg" style="background-image: url('${item.image}');"></div>
        <div class="carousel-content">
          <span class="carousel-badge">${item.badge}</span>
          <h2 class="carousel-title">${item.title}</h2>
          <p class="carousel-desc">${item.description}</p>
          <a href="${item.buttonHref}" class="btn btn-danger btn-lg compra-btn">${item.buttonText}</a>
        </div>
      </div>
    `).join('');

    indicatorsContainer.innerHTML = data.map((_, index) => `
      <button class="indicator ${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>
    `).join('');

    this.initCarousel();
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
