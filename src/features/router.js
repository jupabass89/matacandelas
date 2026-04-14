// router.js

// routes
import mainRoutes from './routes/main-routes.json'
import blogRoutes from './routes/blog-routes.json'

const routes = {...mainRoutes, ...blogRoutes}

export async function router(path = window.location.pathname) {
  // Espera a que el elemento page-content esté disponible
  const pageContent = await waitForElement('#page-content')
  if (!pageContent) {
    console.error('page-content no encontrado')
    return
  }

  // Extrae solo el nombre de la ruta (sin /)
  const routeName = path.split('/').filter(Boolean).pop() || ''

  console.log(routeName)
  // Primero busca en routes definidas
  let file = routes[routeName]
  let isFileExist

  // Si no está en routes, intenta buscar en blog/
  if (!file) {
    isFileExist = await fileExists(`/blog/${routeName}.html`)
    if (isFileExist) {
      file = `/blog/${routeName}`
    } else {
      // Si no existe, usa fallback
      file = routes['home']
    }
  }
  console.log('Ruta:', routeName, 'Archivo:', file, 'fileExists:', Boolean(isFileExist))

  try {
    const res = await fetch(file)
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const html = await res.text()

    pageContent.innerHTML = html
    window.scrollTo(0, 0)

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

async function fileExists(path) {
  try {
    const res = await fetch(path, {
      method: 'GET',
      headers: { 'Range': 'bytes=0-0' } // Only fetch first byte
    })
    return res.status === 200
  } catch {
    return false
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