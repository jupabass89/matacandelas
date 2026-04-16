import frases from './frases.json'

class MatacandelasFrase extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const randomFrase = frases[Math.floor(Math.random() * frases.length)]
    this.textContent = randomFrase
  }
}

if (!customElements.get('matacandelas-frase')) {
  customElements.define('matacandelas-frase', MatacandelasFrase)
}
