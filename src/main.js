// main.js
import './styles/main.scss'
import { router } from './features/router.js'

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