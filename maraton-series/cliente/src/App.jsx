// App.jsx
// Guarda el estado (series, miembros y filtros), pide los datos al API al iniciar
// y reparte por props a la lista, los filtros, el resumen y el formulario.
import { useEffect, useState } from 'react'
import { ESTADOS } from './data/series.js'
import { siguienteEstado } from './utils/series.js'
import {
  obtenerSeries,
  obtenerMiembros,
  crearSerie,
  cambiarEstadoSerie,
  eliminarSerie,
} from './api/seriesApi.js'
import Pagina from './componentes/layout/Pagina.jsx'
import Panel from './componentes/comunes/Panel.jsx'
import ListaSeries from './componentes/series/ListaSeries.jsx'
import Filtros from './componentes/filtros/Filtros.jsx'
import Resumen from './componentes/resumen/Resumen.jsx'
import FormularioSerie from './componentes/formulario/FormularioSerie.jsx'

function App() {
  // ── Estado ──
  const [series, setSeries] = useState([]) // empieza vacío: llega del API

  const [miembros, setMiembros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroMiembro, setFiltroMiembro] = useState('Todos')

  // ── Al mostrarse App por primera vez: pedir los datos al API ──
  useEffect(() => {
    async function cargar() {
      try {
        const [listaSeries, listaMiembros] = await Promise.all([
          obtenerSeries(),
          obtenerMiembros(),
        ])
        setSeries(listaSeries)
        setMiembros(listaMiembros)
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, []) // [] = solo una vez, al montar

  // ── Estado derivado: se calcula cada vez que App se dibuja ──
  const visibles = series.filter(
    (serie) =>
      (filtroEstado === 'Todos' || serie.estado === filtroEstado) &&
      (filtroMiembro === 'Todos' || serie.miembro === filtroMiembro)
  )

  const conteos = ESTADOS.map((estado) => ({
    estado: estado,
    cantidad: series.filter((serie) => serie.estado === estado).length,
  }))

  // ── Cambios: primero el API, después el estado ──
  // Sin try/catch: si el API rechaza los datos, el error le llega al formulario
  async function agregar(datos) {
    const creada = await crearSerie(datos)
    setSeries((actuales) => [...actuales, creada])
  }

  async function avanzar(id) {
    const actual = series.find((serie) => serie._id === id)
    try {
      const actualizada = await cambiarEstadoSerie(id,
        siguienteEstado(actual.estado))
      setSeries((actuales) =>
        actuales.map((serie) => (serie._id === id ? actualizada : serie))
      )
    } catch (err) {
      setError(err.message)
    }
  }
  
  async function quitar(id) {
    try {
      await eliminarSerie(id)
      setSeries((actuales) => actuales.filter((serie) => serie._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Pagina>
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => setError('')}
          ></button>
        </div>
      )}
      <div className="row g-4">
        <div className="col-lg-8">
          <Panel titulo="Filtros">
            <Filtros
              miembros={miembros}
              estado={filtroEstado}
              miembro={filtroMiembro}
              onCambiarEstado={setFiltroEstado}
              onCambiarMiembro={setFiltroMiembro}
            />
          </Panel>

          <Panel titulo={`Series del club (${visibles.length})`}>
            <ListaSeries series={visibles} onAvanzar={avanzar} onQuitar={quitar} />
          </Panel>

        </div>

        <div className="col-lg-4">

          <Panel titulo="Resumen">
            <Resumen conteos={conteos} />
          </Panel>

          <Panel titulo="Agregar una serie">
            <FormularioSerie miembros={miembros} onAgregar={agregar} />
          </Panel>

        </div>

      </div>

    </Pagina>
  )
}

export default App
