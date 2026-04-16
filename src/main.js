// main.js
import './styles/main.scss'
import { router } from './features/router/router.js'
import './features/carousel/carousel.js'
import './features/programacion/programacion.js'
import './features/frases/frases.js'
import './features/poema/poema.js'
import './features/articulos/articulos.js'
import './features/descuentos/descuentos.js'

class MainContainer extends HTMLElement {
  connectedCallback() {

    if (this.dataset.rendered) return
    this.dataset.rendered = 'true'

    this.innerHTML = `<main id="page-content"></main>`
  }
}
customElements.define('main-container', MainContainer)


// Wait for app-layout to render first, then route
customElements.whenDefined('main-container').then(() => {
  router()
})

// Detect scroll past Hero Carousel to toggle socials
window.addEventListener('scroll', () => {
  const threshold = window.innerHeight * 0.8; // Approx bottom of hero carousel
  if (window.scrollY > threshold) {
    document.body.classList.add('scrolled-past');
  } else {
    document.body.classList.remove('scrolled-past');
  }
});