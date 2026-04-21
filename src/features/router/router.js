// router.js
import routes from './routes.json'

export async function router(path = window.location.pathname) {
  // Espera a que el elemento page-content esté disponible
  const pageContent = await waitForElement('#page-content')
  if (!pageContent) {
    console.error('page-content no encontrado')
    return
  }

  // Normaliza el path: quita el primer / y el último si existe
  let routeName = path.startsWith('/') ? path.slice(1) : path
  if (routeName.endsWith('/')) routeName = routeName.slice(0, -1)

  console.log('Buscando ruta:', routeName || '(home)')
  
  // Busca en las rutas definidas
  let routeData = routes[routeName]

  // Si no se encuentra exactamente, manejar casos especiales o fallback
  if (!routeData) {
    if (routeName === '') {
      routeData = routes['home'] || routes['/'] || routes['']
    } else {
      routeData = routes['404']
    }
  }

  const file = routeData?.path;

  if (routeData) {
    if (routeData.title) document.title = routeData.title;
    if (routeData.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', routeData.description);
    }
  }

  console.log('Archivo seleccionado:', file)

  try {
    const res = await fetch(file)
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const html = await res.text()

    pageContent.innerHTML = html

    if (window.location.hash) {
      setTimeout(() => {
        const hashEl = document.querySelector(window.location.hash)
        if (hashEl) hashEl.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo(0, 0)
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }

    // Execute scripts manually since innerHTML doesn't
    const scripts = pageContent.querySelectorAll('script')
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
      newScript.textContent = oldScript.textContent
      oldScript.parentNode.replaceChild(newScript, oldScript)
    })
  } catch (error) {
    console.error('Error loading page:', error)
    pageContent.innerHTML = '<p>Error al cargar la página</p>'
  }
}

// Función auxiliar para esperar a que un elemento exista
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector)
    if (element) return resolve(element)

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector)
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, timeout)
  })
}

window.addEventListener('popstate', router)
