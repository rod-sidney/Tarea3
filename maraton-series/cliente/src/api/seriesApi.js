// api/seriesApi.js
// Todas las llamadas al API del Maratón en un solo lugar.
// Los componentes no usan fetch directamente: llaman a estas funciones.
const URL_API = import.meta.env.VITE_API_URL // viene del archivo .env

// Hace una petición GET y devuelve los datos de la respuesta.
// Si algo falla, lanza un Error con un mensaje que se puede mostrar en pantalla.
async function pedir(ruta) {
    let respuesta
    try {
        respuesta = await fetch(URL_API + ruta)
    } catch {
        throw new Error('No se pudo conectar con el API. ¿Está encendido el servidor ? ')
    }
    const cuerpo = await respuesta.json()
    if (!respuesta.ok) {
        throw new Error(cuerpo.error.mensaje) // el mensaje que armó el API
    }
    return cuerpo
}

export function obtenerSeries() {
    return pedir('/series')
}

export function obtenerMiembros() {
    return pedir('/miembros')
}