// router.js

const routes = {
    'programacion': '/pages/programacion.html',
    'historia': '/pages/historia.html',
    '/': '/pages/programacion-beta.html',
    '': '/pages/programacion-beta.html',
    'test': '/pages/test.html',
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

    const file = routes[routeName] ?? routes['']
    // const file = `pages/${routeName || 'programacion-beta'}.html`
    
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