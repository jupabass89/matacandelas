// router.js

const routes = {
  // Default routes
  '': '/pages/programacion.html',
  '/': '/pages/programacion.html',
  'programacion': '/pages/programacion.html', // home *

  // Fallback
  '*': '',

  // Nuestro Grupo
  'suscribir': '/pages/suscribir.html',
  'historia': '/pages/historia.html',
  'cifras': '/pages/cifras.html',
  'ubicacion': '/pages/ubicacion.html',
  'casa': '/pages/casa.html',
  'logo': '/pages/logo.html',
  'contacto': '/pages/contacto.html',

  // Obras
  'obras': '/pages/obras.html',

  // Documentos
  'documentos': '/pages/documentos.html',
}

export async function router(path = window.location.pathname) {
  // Espera a que el elemento page-content esté disponible
  const pageContent = await waitForElement('#page-content')
  if (!pageContent) {
    console.error('page-content no encontrado')
    return
  }

  // Extrae solo el nombre de la ruta (sin /)
  const routeName = path.split('/').filter(Boolean).pop() || ''

  // Primero busca en routes definidas
  let file = routes[routeName]

  // Si no está en routes, intenta buscar en blog/
  if (!file) {
    const isFileExist = await fileExists(`/blog/${routeName}.html`)
    if (isFileExist) {
      file = `/blog/${routeName}`
    } else {
      // Si no existe, usa fallback
      file = routes['programacion']
    }
  }
  console.log('Ruta:', routeName, 'Archivo:', file)

  try {
    const res = await fetch(file)
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const html = await res.text()

    pageContent.innerHTML = html
    window.scrollTo(0, 0)
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