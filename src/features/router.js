// router.js

const routes = {
    '': '/pages/programacion.html',
    '/': '/pages/programacion.html',
    '*': '', // Fallback a programacion.html
    'programacion': '/pages/programacion.html',
    'historia': '/pages/historia.html',
    'suscribir': '/pages/suscribir.html',
    'cifras': '/pages/cifras.html',
    'obras': '/pages/obras.html',
    'logo': '/pages/Logo-Matacandelas.html',
    'documentos': '/pages/documentos.html',
    'casa': '/pages/casa.html',
    'contacto': '/pages/contacto.html',
    'ubicacion': '/pages/ubicacion.html',
}

async function fileExists(path) {
    try {
        const res = await fetch(path, { method: 'HEAD' })
        return res.ok
    } catch {
        return false
    }
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
        const blogPath = `/blog/${routeName}`
        if (await fileExists(blogPath)) {
            file = blogPath
        } else {
            // Si no existe, usa fallback
            file = routes['']
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