
// 1. Seleccionar la base de datos
const maraton = db.getSiblingDB("maraton");

// 2. Crear las colecciones si todavía no existen
if (!maraton.getCollectionNames().includes("miembros")) {
    maraton.createCollection("miembros");
}

if (!maraton.getCollectionNames().includes("series")) {
    maraton.createCollection("series");
}

// 3. Insertar los cuatro miembros si la colección está vacía
if (maraton.miembros.countDocuments() === 0) {
    maraton.miembros.insertMany([
        { nombre: "Ana" },
        { nombre: "Luis" },
        { nombre: "Sofía" },
        { nombre: "Diego" }
    ]);
}

// 4. Buscar el documento de Sofía
const sofia = maraton.miembros.findOne({
    nombre: "Sofía"
});

if (!sofia) {
    throw new Error("No se encontró el miembro Sofía.");
}

// 5. Crear una serie de ejemplo si la colección está vacía
if (maraton.series.countDocuments() === 0) {
    maraton.series.insertOne({
        titulo: "Severance",
        genero: "Drama",
        temporadas: 2,
        estado: "Por ver",
        miembroId: sofia._id
    });
}

// 6. Mostrar un resumen de los datos
print("Base de datos: " + maraton.getName());

print("Miembros:");
printjson(maraton.miembros.find().sort({ nombre: 1 }).toArray());

print("Series:");
printjson(maraton.series.find().toArray());
