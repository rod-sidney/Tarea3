// miembros/miembros.repository.js
// ÚNICO lugar que habla con MongoDB para los miembros.

import { obtenerDb } from '../config/db.js'

const coleccion = () => obtenerDb().collection('miembros')

export async function listar() {
    return coleccion()
        .find({}, { projection: { nombre: 1 } }) // solo _id y nombre
        .sort({ nombre: 1 })
        .toArray()
}