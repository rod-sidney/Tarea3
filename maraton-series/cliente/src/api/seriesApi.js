// api/seriesApi.js
// Todas las llamadas al API del Maratón en un solo lugar.
// Los componentes no usan fetch directamente: llaman a estas funciones.
const URL_API = import.meta.env.VITE_API_URL // viene del archivo .env

// Hace la petición y devuelve los datos de la respuesta.
// Si el servidor responde con un error, lanza un Error con su mensaje.
async function pedir(ruta, metodo = 'GET', datos) {
    const opciones = { method: metodo }
    if (datos !== undefined) {
        opciones.headers = { 'Content-Type': 'application/json' }
        opciones.body = JSON.stringify(datos)
    }
    let respuesta
    try {
        respuesta = await fetch(URL_API + ruta, opciones)
    } catch {
        throw new Error('No se pudo conectar con el API. ¿Está encendido el servidor ? ')
    }
    const cuerpo = await respuesta.json()
    if (!respuesta.ok) {
        const error = new Error(cuerpo.error.mensaje)
        error.detalles = cuerpo.error.detalles // 400: un mensaje por campo
        throw error
    }
    return cuerpo
}

export function obtenerSeries() {
    return pedir('/series')
}

export function obtenerMiembros() {
    return pedir('/miembros')
}

export function crearSerie(datos) {
    return pedir('/series', 'POST', datos)
}