import './programacion.scss';
import data from './programacion.json';
import templateRaw from './programacion.html?raw';

class MatacandelasProgramacion extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = templateRaw;
    const container = this.querySelector('#programacion-container');

    let html = '';

    data.forEach(month => {
      html += `<h2 class="fecha">${month.monthTitle}</h2>`;
      
      month.events.forEach((item, index) => {
        html += `
          <article class="funcion-card" data-date="${item.date}">
            <section class="date">
              <h5>${item.dayName}</h5>
              <h3>${item.dayNumber}</h3>
              <h5>${item.monthName}</h5>
              <h5>${item.time}</h5>
            </section>
            
            <section class="content">
              <div class="presenter">
                <div class="presenter__strong">${item.presenter}</div> Presenta:
              </div>
              
              <img class="imagen-evento" src="${item.image}" alt="${item.title}">
              
              <h1 class="title">${item.title}</h1>
              <div class="description">${item.description}</div>
              
              <div class="actions-row">
                <button class="vermas-btn" aria-expanded="false" aria-controls="evento-${month.id}-${index}">
                  <span class="vermas-text">Ver más</span>
                  <svg class="vermas-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <a class="btn btn-danger btn-lg compra-btn" target="_blank" href="${item.ticketUrl}">Compra tu Ticket</a>
              </div>
              
              <div id="evento-${month.id}-${index}" class="extended-content" style="display:none;">
                ${item.extendedContent}
              </div>
            </section>
          </article>
        `;
      });
    });

    container.innerHTML = html;
    this.initLogic();
  }

  initLogic() {
    // Hide past events
    const today = new Date();
    const events = this.querySelectorAll(".funcion-card");

    events.forEach(event => {
      const dateAttr = event.getAttribute("data-date");
      const eventDate = new Date(`${dateAttr}T00:00:00`); 
      eventDate.setDate(eventDate.getDate() + 1);

      if (eventDate <= today) {
        event.style.display = "none";
      }
    });

    // Initialize "Ver más" buttons wrapper (accordion behavior)
    this.querySelectorAll('.vermas-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const targetId = btn.getAttribute('aria-controls');
        // Usamos this.querySelector para buscar el elemento con ese id dentro del shadowDOM/componente actual,
        // sin embargo targetId está inyectado directamente entonces funciona globalmente también si no es shadowDOM.
        const target = document.getElementById(targetId);
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          btn.querySelector('.vermas-text').textContent = 'Ver más';
          if(target) target.style.display = 'none';
        } else {
          this.querySelectorAll('.vermas-btn[aria-expanded="true"]').forEach(openBtn => {
             openBtn.setAttribute('aria-expanded', 'false');
             openBtn.querySelector('.vermas-text').textContent = 'Ver más';
             const openId = openBtn.getAttribute('aria-controls');
             const openTarget = document.getElementById(openId);
             if(openTarget) openTarget.style.display = 'none';
          });
          
          btn.setAttribute('aria-expanded', 'true');
          btn.querySelector('.vermas-text').textContent = 'Ver menos';
          if(target) target.style.display = 'block';
        }
      });
    });

    // Close extended content when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.extended-content') && !e.target.closest('.vermas-btn')) {
        this.querySelectorAll('.vermas-btn[aria-expanded="true"]').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
          btn.querySelector('.vermas-text').textContent = 'Ver más';
          const targetId = btn.getAttribute('aria-controls');
          const target = document.getElementById(targetId);
          if (target) target.style.display = 'none';
        });
      }
    });
  }
}

customElements.define('matacandelas-programacion', MatacandelasProgramacion);
