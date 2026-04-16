import './articulos.scss';
import data from './articulos.json';
import templateRaw from './articulos.html?raw';

class MatacandelasArticulos extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = templateRaw;

    const list = this.querySelector('#articulos-list');
    if (!list) return;

    list.innerHTML = data.map(item => {
      const authorHtml = item.author
        ? `<span class="articulo-author">${item.author}</span>`
        : '';
      return `
        <li class="articulo-item">
          <a class="articulo-link" href="${item.href}" title="${item.excerpt}">
            <span class="articulo-title">${item.title}</span>
            ${authorHtml}
          </a>
        </li>
      `;
    }).join('');
  }
}

customElements.define('matacandelas-articulos', MatacandelasArticulos);
