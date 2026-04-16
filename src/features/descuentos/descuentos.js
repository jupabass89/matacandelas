import './descuentos.scss';
import data from './descuentos.json';
import templateRaw from './descuentos.html?raw';

// SVG icon map
const ICONS = {
  people: `<svg class="descu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>`,

  bike: `<svg class="descu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5"></circle>
    <circle cx="18.5" cy="17.5" r="3.5"></circle>
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"></path>
  </svg>`,

  card: `<svg class="descu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>`,

  ticket: `<svg class="descu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>`,
};

class MatacandelasDescuentos extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = templateRaw;

    const list = this.querySelector('#descuentos-list');
    if (!list) return;

    list.innerHTML = data.map(item => {
      const icon = ICONS[item.icon] || '';

      // Replace {LABEL} placeholder with an anchor if a link is provided
      let textHtml = item.text;
      if (item.link) {
        textHtml = textHtml.replace(
          `{${item.link.label}}`,
          `<a href="${item.link.href}" title="${item.link.title}" target="_blank" rel="noopener noreferrer">${item.link.label}</a>`
        );
      }

      return `
        <div class="descu">
          ${icon}
          <p>${textHtml}</p>
        </div>
      `;
    }).join('');
  }
}

customElements.define('matacandelas-descuentos', MatacandelasDescuentos);
