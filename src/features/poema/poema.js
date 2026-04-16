import './poema.scss';
import data from './poema.json';
import templateRaw from './poema.html?raw';

class MatacandelasPoema extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = templateRaw;

    const card = this.querySelector('#poema-card');
    if (!card) return;

    // Build stanzas HTML
    const stanzasHtml = data.stanzas
      .map(stanza => {
        // Convert newlines to <br> within each stanza
        const lines = stanza.split('\n').join('<br>');
        return `<p class="poema-stanza">${lines}</p>`;
      })
      .join('');

    const metaHtml = [
      data.year ? `<span class="poema-meta-item">${data.year}</span>` : '',
      data.source ? `<span class="poema-meta-item poema-meta-source">${data.source}</span>` : '',
    ]
      .filter(Boolean)
      .join('<span class="poema-meta-sep">·</span>');

    card.innerHTML = `
      <div class="poema-quotes-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>
      </div>
      <h2 class="poema-title">${data.title}</h2>
      <p class="poema-author">de ${data.author}</p>
      <div class="poema-body">${stanzasHtml}</div>
      ${metaHtml ? `<div class="poema-meta">${metaHtml}</div>` : ''}
    `;
  }
}

customElements.define('matacandelas-poema', MatacandelasPoema);
