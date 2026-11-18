# Laboratorios del Maratón de series

---

## 1. Montaje del proyecto Maratón de series

### Recorrido explicado
El flujo de preparación es:

1. Vite crea el proyecto React con JavaScript.
2. `npm install` instala las dependencias del proyecto y `npm install bootstrap` agrega Bootstrap.
3. Se eliminan los archivos iniciales que ya no se utilizan (`App.css`, `index.css` y `src/assets`).
4. Se copian los assets suministrados: `App.jsx`, `estilos.css`, `componentes`, `data` y `utils`.
5. `main.jsx` importa Bootstrap y los estilos propios, y renderiza `App`.
6. `npm run dev` inicia Vite para servir la aplicación en el navegador.

---

## 2. Armar el tablero con componentes

### Tabla de componentes

| Componente | Props que recibe | ¿Qué hace? |
|---|---|---|
| `Encabezado.jsx` | Ninguna | Muestra la barra superior de la aplicación con el nombre «Maratón de series». |
| `Pagina.jsx` | `children` | Presenta la estructura general de la página: incluye el encabezado y muestra dentro del contenido los elementos que recibe como `children`. |
| `Panel.jsx` | `titulo`, `children` | Muestra un panel con un título y coloca dentro el contenido recibido mediante `children`. |
| `TarjetaSerie.jsx` | `serie`, `onAvanzar`, `onQuitar` | Muestra los datos de una serie y sus botones. Al hacer clic, ejecuta la función recibida para avisar al componente padre qué acción se solicitó. No modifica por sí misma la lista de series. |
| `ListaSeries.jsx` | `series`, `onAvanzar`, `onQuitar` | Recorre el arreglo `series` y crea una tarjeta por cada elemento. Pasa la serie y las dos funciones a cada `TarjetaSerie`. Si el arreglo está vacío, muestra "Ninguna serie coincide con los filtros.". |

### Preguntas guía

**1. En `Pagina` y `Panel`, ¿de dónde sale lo que se muestra en el lugar de `{children}`?**

Sale del contenido que se escribe entre la etiqueta de apertura y la de cierre del componente cuando se utiliza. Por ejemplo, lo que se coloca dentro de `<Panel> ... </Panel>` llega a `Panel` mediante la prop especial `children`.

**2. En `TarjetaSerie`, ¿qué pasa al hacer clic en «Cambiar estado»? ¿La tarjeta cambia la serie o solo avisa?**

La tarjeta llama a la función `onAvanzar` que recibió por props y le pasa el identificador de la serie. La tarjeta solamente avisa qué serie se quiere cambiar; el componente padre (`App`) es quien debe realizar el cambio de los datos.

**3. En `ListaSeries`, ¿qué se muestra si el arreglo `series` está vacío? ¿Qué valor se usa como `key`?**

Se muestra el mensaje «Ninguna serie coincide con los filtros.». Para identificar cada elemento de la lista se utiliza `serie.id` como valor de `key`.

**4. ¿Qué recibe `ListaSeries` que no usa ella misma, sino que solo le pasa a cada `TarjetaSerie`?**

Recibe las funciones `onAvanzar` y `onQuitar`. `ListaSeries` no ejecuta las acciones; solamente las transmite a cada tarjeta para que esta pueda avisar cuando se presiona uno de sus botones.

### Comprobación de lista vacía

Al cambiar temporalmente `series={seriesIniciales}` por `series={[]}`, `ListaSeries` debe dejar de mostrar tarjetas y presentar el mensaje «Ninguna serie coincide con los filtros.». Después de la prueba se debe restaurar `series={seriesIniciales}`.

---

## 3. Por qué no basta una variable

### Observaciones del experimento

| Acción | Mensaje esperado en la consola | Tarjetas que permanecen visibles |
|---|---|---:|
| 1. Quitar `Dark` | `Quedan 4 series` | 5 |
| 2. Quitar `Arcane` | `Quedan 3 series` | 5 |
| 3. Quitar `Dark` otra vez | `Quedan 3 series` | 5 |
| Recargar la página y quitar una serie | `Quedan 4 series` | 5 |

**La consola muestra que en la variable quedan cada vez menos series, pero en la pantalla siguen las cinco tarjetas. ¿Por qué la pantalla no cambió, si el dato sí cambió?**

Porque modificar una variable normal no hace que React vea el cambio, entonces no vuelve a renderizar.

---

## 4. Cambiar estado y quitar con useState

### Preguntas del paso 9

**1. ¿Qué dos cosas devuelve `useState`?**

Devuelve un arreglo con dos elementos: el valor actual del estado y una función que permite actualizarlo. Aquí se nombran `series` y `setSeries`.

**2. ¿Por qué la página no cambiaba en el paso 8, si el dato sí había cambiado?**

Porque se modificó directamente una propiedad de un objeto que estaba dentro del arreglo y después se llamó a `setSeries(series)` con la misma referencia del arreglo. React recibió el mismo arreglo y no detectó una nueva referencia que justificara volver a dibujar el componente. Cambiar directamente los datos del estado no es la forma correcta de actualizarlo.

**3. ¿Qué hace `filter` en `quitar` y por qué no se usa `splice`?**

`filter` recorre el arreglo y devuelve uno nuevo que contiene las series que cumplen la condición; en este caso, todas menos la que tiene el identificador indicado. No modifica el arreglo original. `splice` sí modifica el arreglo existente directamente, por eso no se usa.

**4. En `avanzar`, ¿para qué sirve `...serie`?**

Crea una copia del objeto de la serie con sus propiedades actuales, como `id`, título, género, temporadas y miembro. Después se reemplaza únicamente la propiedad `estado` por el siguiente estado. Así no se pierden los demás datos de la serie.

**5. ¿Por qué la cantidad del título no necesita su propio `useState`?**

Porque la cantidad se obtiene directamente con `series.length`. Cada vez que cambia el estado de `series`, React vuelve a dibujar el componente y calcula de nuevo esa cantidad.

---

## 5. Filtros y resumen

### Preguntas del paso 9

**1. ¿Por qué el valor de los filtros se guarda en `App` y no dentro de `Filtros`?**

`App` contiene tanto a `Filtros` como a `ListaSeries` y `Resumen`. Los valores elegidos deben estar disponibles para que `App` calcule qué series mostrar. Si el estado se guardara dentro de `Filtros`, los componentes hermanos no tendrían acceso directo a esos valores. Al guardar el estado en el padre común, este puede compartir los valores y las funciones mediante props.

**2. ¿Cómo le avisa `Filtros` a `App` que el usuario eligió otra opción?**

`App` le pasa funciones mediante las props `onCambiarEstado` y `onCambiarMiembro`. Cuando el usuario cambia un `select`, `Filtros` ejecuta la función correspondiente y le entrega el nuevo valor. En `App`, esas funciones son `setFiltroEstado` y `setFiltroMiembro`, por lo que se actualiza el estado del componente padre.

**3. ¿Por qué `visibles` y `conteos` no son `useState`?**

Porque ambos valores se pueden calcular a partir de estados que ya existen. `visibles` se obtiene filtrando `series` según los filtros elegidos, y `conteos` cuenta cuántas series hay en cada estado. Al calcularlos durante el renderizado, permanecen sincronizados con los datos y se evita guardar información duplicada.

**4. ¿Por qué el resumen no cambia cuando se filtra?**

Porque el resumen cuenta las series del arreglo completo `series`, no solamente las que coinciden con los filtros. Los filtros modifican qué tarjetas se muestran, pero no cambian los datos ni la cantidad total de series en cada estado.

**5. ¿Qué pasaría si `quitar` usara `visibles` en lugar de `series`?**

Se podría perder información que está oculta por los filtros. Si se construyera el nuevo estado a partir de `visibles`, las series que no coinciden con el filtro también quedarían fuera del arreglo y desaparecerían aunque el usuario solo hubiera querido quitar una serie visible. Por eso `quitar` debe filtrar el arreglo completo `series`.

---

## 6. Formulario para agregar una serie

### Preguntas del paso 8

**1. ¿Qué hace que el formulario sea controlado?**

Los valores de los campos se guardan en el estado de React. Cada campo muestra el valor del estado mediante `value` y actualiza ese estado con `onChange`. De esa manera, React controla lo que aparece escrito en los campos.

**2. ¿Cómo sabe la función `cambiar` qué campo debe actualizar?**

Lee `name` y `value` desde `event.target`. El atributo `name` identifica el campo que cambió, y la propiedad calculada `[name]` permite actualizar únicamente esa propiedad dentro del objeto `datos`.

**3. ¿Qué pasa si se borra `event.preventDefault()`? Pruébelo y vuelva a ponerlo.**

El navegador realiza el envío tradicional del formulario y recarga o navega la página. En ese proceso se pierde el estado que mantenía los valores y los mensajes del formulario, por lo que la interacción controlada no se comporta como se espera. `event.preventDefault()` evita ese envío tradicional y permite que React procese el evento sin recargar la página.

**4. ¿Cómo se logra que cada mensaje de error aparezca debajo de su campo?**

La función `validarSerie(datos)` devuelve un objeto con los errores de los campos. `setErrores` guarda ese objeto. En cada campo se comprueba si existe un error para mostrar la clase `is-invalid` y, justo después del control, un elemento con la clase `invalid-feedback` que contiene el mensaje correspondiente.

**5. ¿Por qué el id y el estado «Por ver» se ponen en `App` y no en el formulario?**

Porque `App` es quien administra la lista de series. El formulario se ocupa de capturar y validar los datos que escribe el usuario, pero no debe decidir cómo se identifica ni cuál es el estado inicial de una serie dentro de la aplicación. `App` crea la nueva serie, asigna el identificador y establece `Por ver` antes de agregarla al estado.

**6. Al agregar una serie, el resumen y los filtros se actualizaron sin tocarlos. ¿Por qué?**

Porque el resumen y la lista filtrada son datos derivados del arreglo `series`. Cuando `App` agrega la serie y actualiza el estado con `setSeries`, React vuelve a dibujar el componente y se recalculan `visibles` y `conteos`. Por eso ambos componentes reflejan la nueva serie sin que sea necesario modificar sus estados por separado.

---

## 7. Estructura del proyecto del API

### Preguntas del recuadro Reflexiona

**1. ¿Por qué React no puede conectarse directamente a MongoDB y hace falta un API?**

El código de React se ejecuta en el navegador y puede ser inspeccionado por quien visita la página. Si React se conectara directamente a MongoDB, las credenciales de la base quedarían expuestas. El API funciona como intermediario: recibe las peticiones de React, aplica las reglas y se conecta a MongoDB desde el servidor, donde se mantiene protegida la configuración privada.

**2. ¿Por qué se trasladó el proyecto React a una carpeta madre? ¿Cambió algo de su configuración?**

Se trasladó para mantener el cliente y el servidor dentro de una misma aplicación y de un mismo repositorio, pero separados en sus propias carpetas. Así cada uno conserva su `package.json`, dependencias y `node_modules`. La configuración interna de Vite no cambia porque utiliza rutas relativas. Lo que cambia al trabajar desde la carpeta madre es que se debe entrar a `cliente` con `cd cliente` antes de ejecutar `npm run dev`.

**3. ¿Qué hacen `--env-file` y `--watch` en el comando `dev`?**

`--env-file=.env` indica a Node.js que cargue las variables del archivo `.env` en `process.env` al iniciar el servidor. `--watch` hace que Node.js vigile los archivos del proyecto y reinicie el proceso cuando detecta cambios.

**4. ¿Qué diferencia hay entre `.env` y `.env.example`? ¿Cuál se sube a GitHub y por qué?**

`.env` contiene los valores reales de configuración, incluida la cadena de conexión y las credenciales; por eso debe permanecer en la computadora y no subirse a GitHub. `.env.example` contiene los nombres de las variables y valores ilustrativos, sin secretos reales. Sí se sube para que otra persona sepa qué configuración debe preparar.

**5. ¿Qué es un módulo del API? ¿Por qué `series` tiene un archivo más que `miembros`?**

Un módulo agrupa los archivos que implementan un recurso del API. En este proyecto existen los módulos `miembros` y `series`. `series` tiene un archivo adicional, `series.validacion.js`, porque las series se crean desde un formulario y los datos recibidos deben validarse. En el módulo inicial de miembros se consulta una lista y no se requiere esa validación de creación.

**6. Usando el restaurante, explique qué hará cada capa: `routes`, `controller`, `service` y `repository`.**

- `routes` es como la recepción: identifica la dirección y el tipo de petición, y la dirige a la función correspondiente.
- `controller` es como el mesero: recibe lo que solicita el cliente, llama al servicio y prepara la respuesta HTTP.
- `service` es como el chef: aplica las reglas del negocio y decide qué debe hacerse con los datos.
- `repository` es como la bodega: consulta o guarda la información en la base de datos.

### Comprobaciones de las actividades

| Comprobación | Resultado que establece la guía |
|---|---|
| `npm run dev` dentro de `servidor` | Node ejecuta `src/index.js` y queda esperando cambios, con el mensaje `Completed running 'src/index.js'. Waiting for file changes before restarting...`. |
| Leer variables de entorno | `node --env-file=.env -e "console.log(process.env.DB_NAME, process.env.PORT)"` debe mostrar `maraton 3000`. |
| Verificar lo que Git incluirá | `git status -u` desde la carpeta madre debe mostrar los archivos de cliente y servidor, pero no `servidor/.env` ni `node_modules`. |
| Cliente | React debe seguir funcionando en `http://localhost:5173`. |

---

## 8. El API escuchando peticiones

### Actividad 8: explique el recorrido de la petición 3

La petición 3 de `requests.http` es un `POST` a `/api/series` cuyo cuerpo JSON está mal escrito. El recorrido es el siguiente:

| # | Pieza | Qué hace con la petición 3 |
|---:|---|---|
| 1 | `app.listen` (`index.js`) | Deja la aplicación de Express escuchando en el puerto configurado (3000). No procesa el JSON por sí mismo; permite que el servidor reciba la petición. |
| 2 | `cors` | Procesa la petición y agrega el encabezado que autoriza al origen del cliente React, `http://localhost:5173`. |
| 3 | `express.json()` | Intenta interpretar el cuerpo como JSON. Como está mal escrito, detecta el error de análisis y lo pasa a Express mediante `next(error)`. |
| 4 | `rutaNoEncontrada` | No se ejecuta para esta petición. Al utilizarse `next(error)`, Express salta los middlewares normales y busca un manejador de errores. |
| 5 | `manejarErrores` | Reconoce el error de JSON inválido (`entity.parse.failed`) y responde con HTTP 400 y el cuerpo `{ error: { codigo: 'JSON_INVALIDO', mensaje: 'El cuerpo no es un JSON válido.' } }`. |

### Preguntas del recuadro "Reflexiona"

**1. ¿Qué diferencia hay entre una petición y una respuesta? ¿Cuáles son las partes de cada una?**

La petición es el mensaje que el cliente envía al servidor para solicitar una operación. Incluye el método HTTP, la dirección, los encabezados y, cuando corresponde, un cuerpo con datos. La respuesta es el mensaje que el servidor devuelve después de procesarla; incluye un código de estado, encabezados y un cuerpo con los datos o el error.

**2. ¿Por qué `rutaNoEncontrada` usa `next(new HttpError(...))` en lugar de responder directamente?**

Porque así comunica el error al manejador central `manejarErrores`, que se encarga de construir todas las respuestas de error con el mismo formato. De esa manera, las rutas que detectan errores no tienen que repetir la lógica para responderlos.

**3. ¿Cómo sabe Express que `manejarErrores` es un manejador de errores?**

Express lo reconoce porque la función recibe cuatro parámetros y en el orden correspondiente: `(err, req, res, next)`. El primer parámetro es el error que se produjo.

**4. ¿Por qué `cors` va primero y `manejarErrores` de último en `app.js`?**

`cors` va primero para que las respuestas que se generen después, incluidas las respuestas de error, incorporen los encabezados de CORS. `manejarErrores` va al final para poder recibir los errores generados por los middlewares y las rutas que se ejecutaron antes.

**5. ¿Para quién es `codigo` y para quién es `mensaje`? ¿Para qué servirá `detalles`?**

`codigo` está pensado para el programa, por ejemplo React, porque utiliza un identificador estable para reconocer el tipo de error. `mensaje` está pensado para la persona usuaria y explica el problema con palabras. `detalles` permite enviar información adicional, especialmente mensajes de validación asociados a campos concretos del formulario.

**6. ¿Por qué, en un error 500, el API no le envía al cliente el detalle técnico?**

Porque los detalles internos pueden revelar información sobre el código, la configuración o la infraestructura del servidor. El API registra el error en la terminal para que el desarrollador pueda investigarlo, pero responde al cliente con un mensaje general para no exponer información interna.

### Actividad 7: experimento sobre una variable faltante (evidencia)

Al comentar temporalmente `CLIENT_ORIGIN` en `servidor/.env` y volver a ejecutar `npm run dev`, el resultado esperado es que el servidor se detenga. Las evidencias de las pruebas de esta parte están en docs/capturas, Evidencia1 y Evidencia2

---

## 9. Conectar el API con MongoDB

### Actividad 7: explique el arranque

Recorrido, en orden, desde que se escribe `npm run dev` hasta que aparece "API escuchando":

| # | Archivo y línea | Qué ocurre |
|---:|---|---|
| 1 | `package.json` · script `dev` | `npm run dev` ejecuta `node --env-file=.env --watch src/index.js`. Node carga las variables de `.env` en `process.env`, empieza a vigilar los archivos para reiniciar con cada cambio y ejecuta `src/index.js`, que lo primero que hace es resolver sus `import`. |
| 2 | `config/env.js` | Es el primer módulo importado. Revisa que existan `MONGODB_URI`, `DB_NAME` y `CLIENT_ORIGIN`; si falta alguna, lanza un error y el API no arranca. Si están todas, arma el objeto `config` con `puerto`, `mongoUri`, `nombreBd` y `origenCliente`. |
| 3 | `config/db.js` · `new MongoClient` | Al importarse `db.js`, se crea el único cliente del API con `config.mongoUri`. En este momento solo lee y revisa la cadena: todavía no se conecta, y `db` sigue en `null`. |
| 4 | `index.js` · `await conectar()` | Ya cargados los imports (incluido `app.js`), se llama a `conectar()`, que ejecuta `await cliente.connect()`: busca los servidores del clúster, establece la conexión segura y valida el usuario y la contraseña. `index.js` se queda esperando en ese `await`; si la conexión falla, el error aparece aquí y el programa no continúa. |
| 5 | `config/db.js` · `cliente.db(…)` | Con la conexión abierta, elige la base indicada en `config.nombreBd` (`maraton`), la guarda en la variable `db` para que `obtenerDb()` la entregue después y escribe en la terminal «Conectado a MongoDB: maraton». Esta línea no comprueba que la base exista. |
| 6 | `index.js` · `app.listen` | Solo se ejecuta si la conexión salió bien. Enciende el servidor de Express en el puerto 3000 y, cuando ya está escuchando, escribe `API escuchando en http://localhost:3000`. |

### Preguntas del recuadro "Reflexiona"

**1. ¿Por qué el API se conecta a MongoDB una sola vez y no en cada petición?**

Porque abrir la conexión es una operación lenta que depende de la red: hay que buscar los servidores del clúster, establecer una conexión segura y validar las credenciales. Si se hiciera en cada petición, todas las respuestas tardarían mucho más y se abrirían conexiones innecesarias hacia Atlas. Por eso el API se conecta una vez al arrancar y todas las peticiones reutilizan esa conexión; el driver mantiene internamente un grupo de conexiones abiertas (*pool*) y lo administra solo.

**2. ¿Qué hace `await conectar()` y qué pasaría si se escribiera sin `await`?**

`await conectar()` hace que `index.js` espere a que la conexión termine antes de ejecutar la línea siguiente (`app.listen`). Si la conexión falla, el error se lanza en ese punto y el API no arranca. Sin `await`, `conectar()` empezaría a conectarse, pero `index.js` no esperaría y ejecutaría `app.listen` de inmediato: el API podría mostrar «API escuchando» antes de «Conectado a MongoDB» y aceptar peticiones que todavía no puede atender, porque `obtenerDb()` lanzaría «La base de datos todavía no está conectada». Además, si la conexión fallara, el error aparecería cuando el API ya estaba encendido, en lugar de impedir el arranque.

**3. En el experimento 6.1, ¿por qué no apareció «API escuchando»?**

Porque `await cliente.connect()` falló: Atlas rechazó la contraseña con `MongoServerError: bad auth : authentication failed`. El error se lanzó dentro de `await conectar()` y detuvo la ejecución de `index.js` en esa línea, así que `app.listen` nunca se ejecutó. En su lugar, `--watch` mostró «Failed running 'src/index.js'. Waiting for file changes before restarting...».

**4. ¿Qué comprueba el mensaje «Conectado a MongoDB» y qué no comprueba?**

Comprueba que la cadena de conexión está bien escrita, que la dirección del clúster existe, que la red tiene permiso para entrar (Network Access) y que el usuario y la contraseña son correctos (Database Access). No comprueba que la base indicada en `DB_NAME` exista ni que tenga las colecciones: `cliente.db(nombre)` solo elige la base, y MongoDB la crea en silencio la primera vez que se guarda algo en ella. Con un nombre mal escrito, como `maratn`, el mensaje aparecería igual y después todas las consultas devolverían listas vacías. Por eso el nombre se revisa en el panel de MongoDB (Actividad 5).

**5. ¿Qué controla Database Access y qué controla Network Access?**

Database Access controla **quién** se conecta: los usuarios de la base de datos y sus contraseñas. Network Access controla **desde dónde** se permite la conexión: la lista de direcciones IP autorizadas. Para que el API entre se necesitan las dos cosas: credenciales válidas y una IP permitida.

**6. ¿Para qué servirá `obtenerDb()` en la siguiente etapa?**

Para que los repositorios, como `miembros.repository.js`, reciban la base `maraton` ya conectada y puedan consultar sus colecciones, por ejemplo con `obtenerDb().collection('miembros')`, sin crear otra conexión. Si se llamara antes de conectar, lanzaría un error claro en lugar de fallar más adelante de forma confusa.

### Comprobaciones de las actividades

| Comprobación | Resultado obtenido |
|---|---|
| `npm run dev` (Actividad 4) | Después de unos segundos de silencio, que es el tiempo de la conexión, aparecen `Conectado a MongoDB: maraton` y luego `API escuchando en http://localhost:3000`, en ese orden. |
| Peticiones de `requests.http` | Responden igual que en la etapa anterior (404, 404 y 400): la base está conectada, pero todavía no hay rutas que la usen. |
| Reinicio con `--watch` | Al agregar un espacio en un comentario de `src/app.js` y guardar, el API se reinicia solo: vuelve a conectarse y a escuchar. |
| Nombre de la base (Actividad 5) | En el panel de MongoDB de VS Code aparece la base `maraton` con las colecciones `miembros` y `series`, y su nombre coincide letra por letra con el que muestra la terminal. |

### Actividad 6: cuando la conexión falla
Ver Evidencia3 en /docs/capturas como ejemplo del error.

| Experimento | Qué se cambió | Qué se observó |
|---|---|---|
| 6.1 Contraseña incorrecta | Una letra de la contraseña dentro de `MONGODB_URI`. | `MongoServerError: bad auth : authentication failed` y luego «Failed running 'src/index.js'. Waiting for file changes before restarting...». No apareció «API escuchando», porque `await conectar()` falló y `app.listen` nunca se ejecutó. |
| 6.2 Dirección del clúster incorrecta | Con la contraseña ya restaurada, una letra de la dirección del clúster (por ejemplo, `cluster0.abcde` por `cluster0.zzzzz`). | `Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.zzzzz.mongodb.net` y otra vez «Failed running...». `ENOTFOUND` significa que el driver buscó en internet los servidores de esa dirección y no existen. |

Al restaurar la `MONGODB_URI` original y ejecutar `npm run dev`, volvieron a aparecer `Conectado a MongoDB: maraton` y `API escuchando en http://localhost:3000`. Ver Evidencia4 en /docs/capturas.

### Actividad 7: experimentos «el síntoma dice la capa»

Ver Evidencia 6 y 7 en /docs/capturas.

| Experimento | Qué se cambió | Qué se observó |
|---|---|---|
| 7.1 Olvidar `toArray()` en el repositorio | Se borró `.toArray()` en `miembros.repository.js`. | La petición 4 respondió `500 Internal Server Error` con `{ "error": { "codigo": "ERROR_INTERNO", "mensaje": "Ocurrió un error inesperado." } }`, y en la terminal del servidor apareció `TypeError: Converting circular structure to JSON`. El repositorio devolvió el cursor y no los documentos. |
| 7.2 Olvidar `await` en el controlador | Se borró `await` en `miembros.controller.js`. | La petición 4 respondió `200 OK` con el cuerpo `{}`: se envió la promesa sin esperar la lista. |

Después de cada experimento se restauró el código y la petición 4 volvió a responder 200 con los cuatro miembros.

---

## 10. El primer módulo: miembros

### Actividad 8: explique el recorrido

Recorrido de la petición `GET /api/miembros`, de ida y de vuelta:

| # | Pieza | Qué hace con esta petición |
|---:|---|---|
| 1 | `app.js` · `app.use('/api/miembros', …)` | La petición pasa primero por `cors` y `express.json()` (no trae cuerpo). Como su dirección empieza con `/api/miembros`, `app.js` la entrega al router de miembros; dentro del router, la dirección que queda es `/`. |
| 2 | `miembros.routes.js` | El router busca una ruta que coincida con el método GET y la dirección `/`. Encuentra `miembrosRouter.get('/', controlador.listar)` y ejecuta `controlador.listar(req, res)`. |
| 3 | `miembros.controller.js` | `listar(req, res)` no usa `req`, porque la petición no trae datos. Llama a `servicio.listar()` y espera con `await` a que llegue la lista. |
| 4 | `miembros.service.js` | Para listar no hay reglas, así que solo llama a `repositorio.listar()` y devuelve lo que este le entregue. |
| 5 | `miembros.repository.js` | Pide la colección con `obtenerDb().collection('miembros')` y arma la consulta: `find({}, { projection: { nombre: 1 } })` para traer todos los documentos solo con `_id` y `nombre`, `.sort({ nombre: 1 })` para ordenarlos y `.toArray()` para leer el cursor completo. |
| 6 | MongoDB | Atlas ejecuta la consulta en la base `maraton` y devuelve los cuatro miembros, solo con `_id` y `nombre`, ordenados de la A a la Z. |
| 7 | De vuelta: `miembros.controller.js` | El arreglo sube del repositorio al servicio y del servicio al controlador. `res.json(miembros)` lo convierte en JSON (los `ObjectId` se vuelven texto) y lo envía con el código por defecto, 200 OK, junto con el encabezado `Access-Control-Allow-Origin` que agregó `cors`. |

### Preguntas del recuadro "Reflexiona"

**1. ¿Qué pregunta responde cada una de las cuatro capas?**

- `routes`: ¿qué función atiende esta dirección y este método? En miembros, `GET /` lo atiende `listar`.
- `controller`: ¿qué pidió el cliente y qué se le responde? Pide la lista al servicio y responde 200 con ella.
- `service`: ¿qué dicen las reglas? Para listar miembros no hay reglas, así que solo pasa el pedido.
- `repository`: ¿cómo se lee o se guarda en la base? Hace el `find` en la colección `miembros`.

**2. ¿Por qué existe el servicio si para listar no hay reglas?**

Porque cada capa solo llama a la de abajo: el controlador nunca habla directamente con el repositorio. Si más adelante aparece una regla, por ejemplo listar solo los miembros activos, se agrega en el servicio sin tocar el controlador ni el repositorio. Además, otros módulos, como series, usarán el servicio de miembros para hacerle preguntas sobre los miembros.

**3. ¿Por qué en el router la ruta es `'/'` y no `'/api/miembros'`?**

Porque las direcciones del router son relativas al lugar donde se monta. `app.js` monta el router con el prefijo `/api/miembros`, y la dirección completa es el prefijo más la ruta del router: `/api/miembros` + `/`. Si en el router se escribiera `'/miembros'`, la dirección completa quedaría `/api/miembros/miembros`.

**4. ¿Qué es un cursor y qué pasó en el experimento 7.1?**

Un cursor es el objeto que devuelve `find`: todavía no contiene los documentos, sino que sabe ir leyendo los resultados de la consulta. `toArray()` los lee todos y los entrega como arreglo. En el experimento 7.1, al borrar `.toArray()`, el repositorio devolvió el cursor en lugar de los documentos; `res.json` no pudo convertir ese objeto en JSON y lanzó `TypeError: Converting circular structure to JSON`. Como fue un error inesperado, `manejarErrores` respondió 500 con el código `ERROR_INTERNO` y dejó el detalle técnico solo en la terminal.

**5. ¿Por qué el experimento 7.2 respondió 200 si estaba mal?**

Porque sin `await` el controlador no esperó la lista: `servicio.listar()` devolvió una promesa, un resultado que llegará después, y eso fue lo que se le pasó a `res.json`. Una promesa convertida en JSON es `{}`. Como no se lanzó ningún error, `res.json` respondió con su código por defecto, 200 OK. Es un error engañoso: el código indica que todo salió bien, pero la respuesta está vacía.

**6. ¿Por qué `POST /api/miembros` responde 404 si la dirección es la misma que la del GET?**

Porque una ruta se identifica por el método y la dirección juntos. El router de miembros solo registró `GET /`; no tiene ninguna función para `POST /`. Como ninguna ruta atendió la petición, Express siguió hasta `rutaNoEncontrada`, que respondió 404 con el mensaje «No existe POST /api/miembros».

### Comprobaciones de las actividades

| Comprobación | Resultado obtenido |
|---|---|
| `npm run dev` | `Conectado a MongoDB: maraton` y `API escuchando en http://localhost:3000`. |
| Petición 4: `GET /api/miembros` | 200 OK con los cuatro miembros (Ana, Diego, Luis y Sofía), cada uno solo con `_id` y `nombre`, ordenados por nombre. Los `_id` llegan como texto porque JSON no tiene el tipo `ObjectId`. |
| Petición 1: `GET /api/series` | Sigue respondiendo 404, porque el módulo series todavía no existe. |
| `POST /api/miembros` | 404 «No existe POST /api/miembros»: la dirección existe, pero el router solo tiene GET. |
| `http://localhost:3000/api/miembros` en el navegador | Muestra el mismo JSON de la petición 4. |

### Actividad 7: experimentos "el síntoma dice la capa"

Ver Evidencias 6 y 7.

| Experimento | Qué se cambió | Qué se observó |
|---|---|---|
| 7.1 Olvidar `toArray()` en el repositorio | Se borró `.toArray()` en `miembros.repository.js`. | La petición 4 respondió `500 Internal Server Error` con `{ "error": { "codigo": "ERROR_INTERNO", "mensaje": "Ocurrió un error inesperado." } }`, y en la terminal del servidor apareció `TypeError: Converting circular structure to JSON`. El repositorio devolvió el cursor y no los documentos. |
| 7.2 Olvidar `await` en el controlador | Se borró `await` en `miembros.controller.js`. | La petición 4 respondió `200 OK` con el cuerpo `{}`: se envió la promesa sin esperar la lista. |

Después de cada experimento se restauró el código y la petición 4 volvió a responder 200 con los cuatro miembros.

---

## 11. Series: listar y crear

### Actividad 9: explique el recorrido del POST

Recorrido de la petición 6 (`POST /api/series` con Severance), en orden:

| # | Pieza | Qué hace con esta petición |
|---:|---|---|
| 1 | `express.json()` | Después de que `cors` agrega su encabezado, lee el cuerpo de la petición (que trae `Content-Type: application/json`), convierte el texto JSON en un objeto y lo deja en `req.body`: `{ titulo: 'Severance', genero: 'Drama', temporadas: 2, miembroId: '…' }`. Como la dirección empieza con `/api/series`, `app.js` pasa la petición al router de series. |
| 2 | `series.routes.js` | El router busca la ruta que corresponde al método POST en `/` y ejecuta `controlador.crear`. Con la misma dirección, un GET habría ido a `listar`. |
| 3 | `series.controller.js` · `crear` | Llama a `servicio.crear(req.body ?? {})` con el cuerpo de la petición y espera el resultado con `await`. No tiene `try/catch`: si el servicio lanza un error, Express 5 lo envía a `manejarErrores`. |
| 4 | `series.validacion.js` | El servicio llama a `validarSerie(datos)`, que revisa que el título sea texto de al menos 2 caracteres, que el género esté en `GENEROS`, que `temporadas` sea un entero de 1 a 30 y que `miembroId` tenga formato de `ObjectId`. Severance cumple todo, así que devuelve `{}` y el servicio continúa. |
| 5 | `miembros.service.js` · `existe` | El servicio de series le pregunta al de miembros si el `miembroId` corresponde a alguien. `existe` llama a `repositorio.buscarPorId(id)`, que hace un `findOne` convirtiendo el id con `new ObjectId(id)`. Como Sofía existe, devuelve `true`. |
| 6 | `series.service.js` · `repositorio.crear` | El servicio arma el documento campo por campo: el título sin espacios en los extremos, el género, las temporadas, `estado: 'Por ver'`, el `miembroId` convertido con `new ObjectId(…)` y `calificaciones: []`. `repositorio.crear` lo inserta con `insertOne`; MongoDB lo revisa con el `$jsonSchema`, le genera un `_id` y el repositorio devuelve ese `insertedId`. |
| 7 | `series.repository.js` · `buscarPorId` | Con el `_id` nuevo, el servicio lee la serie recién creada: `aggregate` filtra con `$match` por ese `_id` y aplica las etapas de `CON_MIEMBRO`, de modo que la serie vuelve con `miembro: 'Sofía'` y sin `calificaciones`. Se toma el primer elemento del arreglo. |
| 8 | `series.controller.js` · `res.status(201)` | La serie sube al controlador, que responde `201 Created` con ella en JSON: `_id`, `titulo`, `genero`, `temporadas`, `estado: "Por ver"`, `miembroId` y `miembro: "Sofía"`. |


### Preguntas del recuadro "Reflexiona"

**1. ¿Por qué series pregunta a `miembros.service` y no a `miembros.repository`?**

Porque cada módulo es dueño de su colección: solo el módulo miembros sabe cómo se consulta la colección `miembros` y qué reglas tiene. Si series usara directamente el repositorio de miembros, se saltaría las reglas de su servicio y quedaría atado a la forma en que se guardan esos datos, de modo que un cambio en ese repositorio podría romper series. Al preguntarle al servicio con `existe`, series solo depende de una respuesta de sí o no.

**2. ¿Por qué se valida en el servidor si el formulario de React también valida?**

Porque la validación de React se puede saltar: cualquiera puede enviar peticiones directamente al API con REST Client, la consola del navegador u otra herramienta. El servidor es quien protege los datos. Además, al validar antes de guardar, el API responde 400 con un mensaje claro por campo, en lugar de que el `$jsonSchema` de MongoDB rechace el documento y termine en un 500. La validación de React sirve para avisarle de inmediato a la persona usuaria; la del servidor es la que garantiza las reglas.

**3. ¿Qué pasaría si el servicio guardara `req.body` tal cual con `insertOne(datos)`? Use el resultado del paso 7 de la Tarea 7.**

El cliente decidiría lo que entra a la base. En el paso 7 se agregaron `"estado": "Vista"` y `"admin": true` al cuerpo, y la serie se creó de todos modos con estado «Por ver» y sin `admin`, porque el servicio arma el documento campo por campo. Con `insertOne(datos)` esos dos campos llegarían a la base: el cliente elegiría el estado inicial y podría guardar campos que no forman parte del modelo. También se perderían las conversiones del servicio: `miembroId` quedaría como texto en lugar de `ObjectId` (el `$jsonSchema` lo rechazaría con un 500 y, aunque lo aceptara, el `$lookup` no encontraría al miembro), el título no se recortaría y no se agregaría `calificaciones: []`.

**4. ¿Por qué se convierte `miembroId` con `new ObjectId(…)` antes de guardar?**

Porque el id llega del cliente como texto, ya que JSON no tiene el tipo `ObjectId`, pero en la base los `_id` de los miembros son `ObjectId`. El `$jsonSchema` de la colección `series` exige que `miembroId` sea un `ObjectId`, y el `$lookup` compara `miembroId` con el `_id` de `miembros`: un texto nunca sería igual a un `ObjectId`, así que no encontraría al miembro.

**5. ¿Qué hace cada etapa de `CON_MIEMBRO`? ¿Qué demostró el experimento de la Actividad 8?**

- `$lookup` busca en la colección `miembros` los documentos cuyo `_id` es igual al `miembroId` de la serie y los deja en un arreglo llamado `miembro`.
- `$unwind` saca al miembro del arreglo, de `[ {…} ]` a `{…}`; si el arreglo está vacío, descarta la serie.
- `$set` reemplaza el objeto `miembro` por solo su nombre, por ejemplo `miembro: 'Ana'`.
- `$project` quita `calificaciones`, que la pantalla no usa.

MongoDB no avisa cuando el nombre de una colección está mal escrito. Con `from: 'miembro'`, `$lookup` busca en una colección que no existe y dejó el arreglo vacío en todas las series; después `$unwind` las descartó todas y la respuesta fue un 200 con `[]`.

**6. ¿Por qué `crear` responde 201 y con la serie leída de la base, y no con los datos que llegaron?**

201 Created es el código que indica que se creó un recurso nuevo. Se responde con la serie leída de la base porque es la versión que realmente quedó guardada: trae el `_id` que generó MongoDB, el estado «Por ver» que asignó el servidor y el nombre del miembro que agregó el `$lookup`, y no trae los campos de más que haya enviado el cliente. Así React recibe la serie lista para mostrarla.

### Comprobaciones de las actividades

Ver Evidencias 8, 9, 10.

| Comprobación | Resultado obtenido |
|---|---|
| Petición 5: `GET /api/series` | 200 con las cinco series, cada una con el nombre de su miembro (Ana, Luis, Sofía, Diego y Ana). |
| Petición 6: crear Severance | `201 Created` con Severance, `estado: "Por ver"` y `miembro: "Sofía"`. Al enviar otra vez la petición 5 aparecen seis series. |
| Petición 7: datos inválidos | `400 Bad Request` con `DATOS_INVALIDOS` y los cuatro mensajes en `detalles`: título, género, temporadas y `miembroId`. |
| Petición 8: miembro que no existe | 400 con `detalles.miembroId`: «Ese miembro no existe.». |
| Petición 6 con `"temporadas": "2"` | 400 en `temporadas`: el texto `"2"` no es un número entero. |
| Petición 6 con `"estado": "Vista"` y `"admin": true` | La serie se crea con estado «Por ver» y sin el campo `admin`. |
| Colección `series` en el panel de MongoDB | Severance tiene `miembroId` guardado como `ObjectId` y `calificaciones: []`. |

---

## 12. Series: cambiar estado y eliminar

### Actividad 9: explique el recorrido del PATCH

Recorrido de la petición 9 (`PATCH /api/series/:id/estado` con `{ "estado": "Viendo" }`), en orden:

| # | Pieza | Qué hace con esta petición |
|---:|---|---|
| 1 | `app.js` · `/api/series` | La petición pasa por `cors` y por `express.json()`, que deja `{ estado: 'Viendo' }` en `req.body`. Como la dirección empieza con `/api/series`, `app.js` la entrega al router de series, que recibe solo la parte `/<id>/estado`. |
| 2 | `series.routes.js` · `patch('/:id/estado')` | El router encuentra la ruta del método PATCH que coincide con `/:id/estado`, guarda en `req.params.id` el texto que vino en el lugar de `:id` y ejecuta `controlador.cambiarEstado`. |
| 3 | `series.controller.js` · `cambiarEstado` | Llama a `servicio.cambiarEstado(req.params.id, req.body ?? {})` con el id de la dirección y el cuerpo, y espera el resultado con `await`. |
| 4 | `utils/revisarId.js` | Es el primer paso del servicio: revisa con `ObjectId.isValid` que el id tenga formato de `ObjectId` (24 caracteres hexadecimales). El `_id` de Severance es válido, así que no lanza nada y el servicio continúa. |
| 5 | `series.validacion.js` · `validarEstado` | Revisa que `datos.estado` esté en la lista `ESTADOS` (Por ver, Viendo, Vista). «Viendo» es válido, así que devuelve `{}`. |
| 6 | `series.repository.js` · `cambiarEstado` | Ejecuta `updateOne({ _id: new ObjectId(id) }, { $set: { estado: 'Viendo' } })`. MongoDB encuentra la serie y cambia solo su estado; los demás campos quedan igual. Como `matchedCount` es 1, el repositorio devuelve `true` y el servicio no lanza el 404. |
| 7 | `series.repository.js` · `buscarPorId` | El servicio lee la serie ya actualizada con `$match` y las etapas de `CON_MIEMBRO`, así que vuelve con `estado: 'Viendo'` y `miembro: 'Sofía'`. |
| 8 | `series.controller.js` · `res.json` | El controlador recibe la serie actualizada y responde `200 OK` con ella en JSON. |

**Dónde se detienen las otras peticiones** (en las tres, la respuesta la escribe `manejarErrores`):

- **Petición 11** (id `abc`): se detiene en la fila 4. `revisarId` lanza `HttpError(400, 'ID_INVALIDO', …)` antes de validar el estado y sin tocar la base. Respuesta: **400 ID_INVALIDO**, «El identificador no es válido.».
- **Petición 10** (estado `Abandonada`): se detiene en la fila 5. `validarEstado` devuelve un error en `estado` y el servicio lanza un `HttpError` 400. Respuesta: **400 DATOS_INVALIDOS**, con `detalles.estado`: «El estado debe ser: Por ver, Viendo, Vista.».
- **Petición 12** (id `650000000000000000000000`): pasa las filas 4 y 5, pero se detiene en la fila 6. `updateOne` no encuentra ninguna serie (`matchedCount` es 0), el repositorio devuelve `false` y el servicio lanza un `HttpError` 404. Respuesta: **404 NO_ENCONTRADA**, «La serie no existe.».

### Preguntas del recuadro "Reflexiona"

**1. ¿Por qué el id va en la dirección y el estado nuevo en el cuerpo?**

Porque la dirección identifica el recurso sobre el que se trabaja: `/api/series/:id/estado` dice a cuál serie se refiere la petición y qué parte de ella se modifica. El cuerpo lleva lo que cambia: `{ "estado": "Viendo" }`. Así se separa «a cuál» de «qué cambia». Por la misma razón, DELETE no lleva cuerpo: la dirección ya dice todo lo necesario.

**2. ¿Qué diferencia hay entre responder 400 `ID_INVALIDO` y 404 `NO_ENCONTRADA`? ¿Quién detecta cada uno?**

400 `ID_INVALIDO` significa que el id está mal escrito: no tiene formato de `ObjectId`, como `abc`. Lo detecta `revisarId`, antes de tocar la base. 404 `NO_ENCONTRADA` significa que el id tiene un formato correcto, pero ninguna serie lo tiene. Lo detecta el servicio con lo que responde MongoDB: `matchedCount` o `deletedCount` en 0. El primero es un error de quien envía la petición; el segundo indica que el recurso no existe.

**3. ¿Por qué `revisarId` está en `utils` y no en la carpeta `series`?**

Porque no pertenece a ningún módulo: revisar el formato de un id es una tarea general. Cualquier módulo que reciba un id en la dirección puede importarla y reutilizarla sin depender del módulo series.

**4. ¿Qué demostró el experimento 8.2 sobre `matchedCount` y `modifiedCount`?**

Que no responden la misma pregunta. `matchedCount` indica cuántos documentos encontró el filtro, es decir, si la serie existe; `modifiedCount` indica cuántos cambiaron de verdad. Con `modifiedCount`, la primera vez que se envió la petición 9 respondió 200, pero la segunda respondió 404 «La serie no existe.»: la serie ya estaba en «Viendo», MongoDB no modificó nada y el servicio lo interpretó como que no existía. Por eso la existencia se decide con `matchedCount`.

**5. En el experimento 8.3, la serie se borró aunque REST Client no recibió respuesta. ¿Qué problema causaría esto en React?**

React se quedaría esperando una respuesta que nunca llega: el `await` de la petición no terminaría, así que el código que quita la tarjeta no se ejecutaría y la serie seguiría en pantalla aunque ya no existe en la base. La persona usuaria creería que no se borró e intentaría quitarla otra vez, lo que daría un 404, o solo vería el cambio al recargar. La pantalla y la base quedarían desincronizadas.

**6. ¿Por qué el segundo DELETE a la misma serie responde 404? ¿En qué situación real pasaría?**

Porque el primer DELETE ya la borró. En el segundo, `deleteOne` no encuentra ningún documento con ese `_id` (`deletedCount` es 0), el repositorio devuelve `false` y el servicio lanza 404 `NO_ENCONTRADA`. En la realidad pasaría, por ejemplo, si dos personas del club tienen el tablero abierto y ambas presionan «Quitar» en la misma serie, si un doble clic envía dos peticiones o si la pantalla estaba desactualizada y la serie ya se había eliminado desde otra pestaña.

### Comprobaciones de las actividades

Ver Evidencia 11, 12, 13, 14, 15 en la carpeta /docs/capturas.

| Comprobación | Resultado obtenido |
|---|---|
| Petición 9: cambiar a «Viendo» | 200 con Severance en estado «Viendo» y miembro «Sofía». |
| Petición 9 enviada otra vez | 200 de nuevo: la serie existe, aunque no cambió nada. |
| Petición 10: estado `Abandonada` | 400 `DATOS_INVALIDOS` con `detalles.estado`: «El estado debe ser: Por ver, Viendo, Vista.». |
| Petición 11: id `abc` | 400 `ID_INVALIDO`: «El identificador no es válido.». |
| Petición 12: id bien formado que no existe | 404 `NO_ENCONTRADA`: «La serie no existe.». |
| Petición 5 y panel de MongoDB | Severance aparece en «Viendo»; en el panel, el documento tiene el estado nuevo y el resto de los campos igual. |
| Petición 13: eliminar | `204 No Content`, sin cuerpo. |
| Petición 14: eliminar otra vez | 404 `NO_ENCONTRADA`. |
| Petición 5 después de eliminar | Severance ya no aparece en la lista. |

Como `GET /api/series` existe desde la etapa 5, la petición 1 se cambió a `GET {{api}}/peliculas` para que siga probando una ruta inexistente.

### Actividad 8: tres experimentos

| Experimento | Qué se cambió | Qué se observó |
|---|---|---|
| 8.1 Sin `revisarId` | Se comentó `revisarId(id)` en `cambiarEstado` de `series.service.js` y se envió la petición 11 (id `abc`). | `500 Internal Server Error` con `ERROR_INTERNO`, y en la terminal `BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer`, lanzado por `new ObjectId` en `series.repository.js`. El error lo cometió quien envió la petición, pero recibió un 500 que no le dice qué hizo mal. |
| 8.2 `modifiedCount` en lugar de `matchedCount` | En `cambiarEstado` de `series.repository.js` se usó `modifiedCount` y se envió la petición 9 dos veces seguidas. | La primera vez respondió 200; la segunda, 404 «La serie no existe.», porque el estado ya era «Viendo» y MongoDB no modificó nada (`modifiedCount` = 0). |
| 8.3 Sin `.end()` | Se cambió `res.status(204).end()` por `res.status(204)` y se envió la petición 13. | REST Client se quedó esperando sin mostrar respuesta y hubo que cancelar la petición. Aun así, la petición 5 mostró que la serie sí se borró: el servidor hizo su trabajo, pero no avisó. |

---

## 13. React lee el API

### Actividad 10: explique el recorrido

Recorrido desde que se abre `http://localhost:5173` hasta que aparecen las tarjetas:

| # | Pieza | Qué hace |
|---:|---|---|
| 1 | `App` · primer dibujo | React ejecuta `App` con los estados iniciales: `series` y `miembros` vacíos, `cargando` en `true` y `error` vacío. Como `cargando` es `true`, `App` devuelve solo `<Pagina>` con el indicador que gira y «Cargando series…»; no dibuja filtros ni tarjetas. |
| 2 | `useEffect` · `cargar()` | Después del primer dibujo, React ejecuta el efecto; por el `[]` final, solo esta vez. El efecto llama a `cargar()`, que con `Promise.all` envía a la vez `obtenerSeries()` y `obtenerMiembros()` y espera a que lleguen las dos. |
| 3 | `seriesApi.js` · `obtenerSeries` → `pedir` | `obtenerSeries()` llama a `pedir('/series')`, que une `URL_API` (leída de `import.meta.env.VITE_API_URL`) con la ruta, `http://localhost:3000/api/series`, y hace `await fetch(…)`. El navegador envía el GET con el origen `http://localhost:5173`. |
| 4 | API · `GET /api/series` | Express recibe la petición: `cors` autoriza el origen 5173, el router de series ejecuta `listar` y el servicio y el repositorio consultan MongoDB con el `$lookup`. El API responde 200 con el arreglo de series en JSON, cada una con su `_id` y el nombre de su miembro. Al mismo tiempo, `GET /api/miembros` responde con los miembros. |
| 5 | `seriesApi.js` · `respuesta.json()` | `pedir` lee el cuerpo con `await respuesta.json()` y lo convierte en un arreglo. Como `respuesta.ok` es `true`, lo devuelve. Lo mismo ocurre con la petición de los miembros. |
| 6 | `App` · `setSeries` y `setMiembros` | Cuando llegan las dos listas, `Promise.all` entrega `[listaSeries, listaMiembros]` y `cargar` guarda cada una en su estado. |
| 7 | `App` · `finally` | Con éxito o con error, `finally` ejecuta `setCargando(false)`: la carga terminó. |
| 8 | `App` · segundo dibujo | Los cambios de estado hacen que React vuelva a dibujar `App`. Ahora `cargando` es `false`, así que dibuja la página normal: los filtros con los miembros del API, las tarjetas de las series de MongoDB, con `_id` como `key`, y el resumen con los conteos. |

**Experimento 9.1 (servidor apagado):** cambia la fila 3. `fetch` no recibe ninguna respuesta (`net::ERR_CONNECTION_REFUSED`), así que lanza un error que `pedir` cambia por «No se pudo conectar con el API. ¿Está encendido el servidor?». Las filas 4 y 5 no ocurren, y en lugar de la fila 6 se ejecuta `catch (err) { setError(err.message) }`. En el segundo dibujo la página muestra la alerta roja con ese mensaje, sin tarjetas («Ninguna serie coincide con los filtros.») y con el resumen en cero.

**Experimento 9.3 (variable sin `VITE_`):** cambia la fila 3. `URL_API` vale `undefined`, así que la dirección queda `undefined/series`; como no empieza con `http`, el navegador la pide al mismo Vite (`http://localhost:5173/undefined/series`), que responde con el HTML de la página en lugar del API. Entonces falla la fila 5: `respuesta.json()` intenta leer ese HTML como JSON y lanza un error en el primer carácter, `<`. La página muestra la alerta roja con `Unexpected token '<', "<!doctype "... is not valid JSON` y ninguna serie.

### Preguntas del recuadro "Reflexiona"

**1. ¿Por qué la dirección del API va en un `.env` y no escrita en `seriesApi.js`?**

Porque la dirección depende del lugar donde se ejecute la aplicación: en desarrollo es `http://localhost:3000/api`, pero al publicarla será otra. Con el `.env` se cambia la configuración sin tocar el código, y quien clone el proyecto sabe qué variable preparar gracias a `.env.example`. Además, la dirección queda definida en un solo lugar.

**2. ¿Por qué no se pueden poner secretos en una variable `VITE_`?**

Porque Vite coloca el valor de las variables `VITE_` dentro del JavaScript que descarga el navegador. Cualquier persona que abra la página puede verlo en las herramientas del navegador o en el código descargado. Por eso en el `.env` del cliente solo va información pública, como la dirección del API; los secretos, como la cadena de conexión de MongoDB, se quedan en el `.env` del servidor.

**3. ¿Qué diferencia hay entre el error del experimento 9.1 y el del 9.2, si la página muestra el mismo mensaje? ¿Dónde se nota?**

En el 9.1 el API estaba apagado: la petición no recibió ninguna respuesta. En el 9.2 el API sí respondió, pero solo autoriza el origen `http://localhost:5173` (`CLIENT_ORIGIN`); como React corría en el 5174, el navegador no dejó que React leyera la respuesta. En los dos casos `fetch` falla sin una respuesta que se pueda usar, y `pedir` muestra el mismo mensaje. La diferencia se nota en la consola del navegador: en el 9.1 aparece `net::ERR_CONNECTION_REFUSED`, y en el 9.2 el aviso de que la petición fue bloqueada por la política de CORS porque el encabezado `Access-Control-Allow-Origin` tiene el valor `http://localhost:5173`, distinto del origen que hizo la petición.

**4. ¿Por qué la petición va dentro de `useEffect`? ¿Qué demostró el experimento 9.4?**

Porque el cuerpo del componente se ejecuta cada vez que se dibuja. Si la petición estuviera ahí, al llegar los datos cambiaría el estado, `App` se dibujaría de nuevo y volvería a pedir, sin fin. `useEffect` ejecuta la función después de dibujar y, con `[]`, solo la primera vez. El experimento 9.4 lo demostró: sin `[]`, el efecto se ejecutó después de cada dibujo y la pestaña Red se llenó de cientos de peticiones en pocos segundos, porque cada respuesta cambiaba el estado, eso provocaba otro dibujo y el efecto pedía otra vez.

**5. ¿Por qué `setCargando(false)` va en `finally`?**

Porque la carga termina tanto si las peticiones salen bien como si fallan, y `finally` se ejecuta en los dos casos. Si estuviera dentro del `try`, cuando hay un error nunca se ejecutaría: la página se quedaría para siempre en «Cargando series…» y no mostraría la alerta.

**6. Al agregar una serie y recargar, la serie desaparece. ¿Qué tendría que hacer `agregar` para que no pase?**

Hoy `agregar` solo cambia el estado de React, que vive en la memoria del navegador; al recargar, `App` vuelve a pedir las series a MongoDB, donde esa serie nunca se guardó. Para que no pase, `agregar` tendría que enviar los datos al API con un `POST /api/series` mediante una función de `seriesApi.js`, esperar la respuesta y agregar al estado la serie que devuelve el API, ya guardada en MongoDB y con su `_id` real.

### Actividad 9: cuatro experimentos

| Experimento | Qué se cambió | Qué se observó |
|---|---|---|
| 9.1 El servidor apagado | Se detuvo el API con Ctrl + C y se recargó el Maratón. | La página mostró «No se pudo conectar con el API. ¿Está encendido el servidor?» y la consola, `Failed to load resource: net::ERR_CONNECTION_REFUSED`. |
| 9.2 CORS: React en otro puerto | Se abrió un segundo Vite con `npm run dev -- --port 5174` y se entró a `http://localhost:5174`. | La página mostró el mismo mensaje de conexión, pero la consola indicó que el acceso a `http://localhost:3000/api/series` desde el origen `http://localhost:5174` fue bloqueado por la política de CORS, porque el API solo autoriza `http://localhost:5173`. |
| 9.3 Una variable sin `VITE_` | En `cliente/.env` se cambió `VITE_API_URL` por `API_URL`. | La página mostró `Unexpected token '<', "<!doctype "... is not valid JSON`, y en la pestaña Red la petición fue a `http://localhost:5173/undefined/series`. |
| 9.4 `useEffect` sin `[]` | Se borró el `[]` del final de `useEffect`. | La lista de peticiones en la pestaña Red creció sin parar, cientos en pocos segundos, hasta que se restauró `}, [])`. |

---

## 14. El formulario crea con POST

### Actividad 8: explique el recorrido

Recorrido al agregar Severance · Drama · 2 · Sofía desde el formulario:

| # | Pieza | Qué hace |
|---:|---|---|
| 1 | `FormularioSerie` · `validarSerie` | Al presionar «Agregar serie», `enviar` evita la recarga con `event.preventDefault()` y valida en el navegador con `validarSerie(datos)`. Como los cuatro campos están bien, guarda `{}` con `setErrores` y el envío continúa. |
| 2 | `FormularioSerie` · `setEnviando(true)` | Marca que empezó el envío: el botón se desactiva y dice «Guardando…». Dentro del `try` llama a `await onAgregar(…)` con los datos del formulario, el título recortado y `temporadas` convertido a número con `Number(…)`. |
| 3 | `App` · `agregar` | `onAgregar` es la función `agregar` de `App`. Llama a `await crearSerie(datos)` y espera la serie guardada. No tiene `try/catch`. |
| 4 | `seriesApi` · `crearSerie` → `pedir` | `crearSerie` llama a `pedir('/series', 'POST', datos)`. Como hay datos, `pedir` arma las opciones con `method: 'POST'`, el encabezado `Content-Type: application/json` y `body: JSON.stringify(datos)`, y hace el `fetch` a `http://localhost:3000/api/series`. |
| 5 | API · `POST /api/series` | `express.json()` lee el cuerpo; el servicio valida los datos, comprueba que Sofía existe, arma el documento con estado «Por ver» y `miembroId` como `ObjectId`, lo inserta en MongoDB y lo vuelve a leer con el `$lookup`. Responde 201 con la serie completa. `pedir` lee el cuerpo y, como `respuesta.ok` es `true`, lo devuelve. |
| 6 | `App` · `setSeries` | `agregar` recibe `creada`, con el `_id` de MongoDB, el estado «Por ver» y `miembro: 'Sofía'`, y la agrega a la lista vigente con `setSeries((actuales) => [...actuales, creada])`. Aparece la tarjeta nueva y el resumen se recalcula. |
| 7 | `FormularioSerie` · `setDatos(VACIO)` | Como `await onAgregar(…)` terminó sin error, el `try` continúa y el formulario se limpia. |
| 8 | `FormularioSerie` · `finally` | Ejecuta `setEnviando(false)`: el botón vuelve a estar disponible y dice «Agregar serie». |

**Cuando el API responde 400:** el recorrido se desvía en la fila 5. El API responde 400 `DATOS_INVALIDOS`; `pedir` ve que `respuesta.ok` es `false` y lanza un `Error` con el mensaje general y `error.detalles`, que trae un mensaje por campo. Ese error atraviesa `crearSerie` y `agregar`, que no lo atrapan, así que no se ejecutan la fila 6 (`setSeries`) ni la fila 7 (`setDatos(VACIO)`). Llega al `catch` de `enviar`, que guarda `err.detalles` con `setErrores`, y después la fila 8 vuelve a habilitar el botón. La página muestra cada mensaje del API en rojo debajo de su campo, los datos se quedan en el formulario para corregirlos y no aparece ninguna tarjeta nueva.

### Preguntas del recuadro "Reflexiona"

**1. ¿Qué tres piezas necesita `fetch` para enviar datos? ¿Qué demostraron los experimentos 7.2 y 7.3?**

Necesita `method: 'POST'`, el método HTTP (sin esta opción, `fetch` hace GET); `headers: { 'Content-Type': 'application/json' }`, que avisa que el cuerpo es JSON; y `body: JSON.stringify(datos)`, el cuerpo convertido a texto JSON. El experimento 7.2 demostró que sin `Content-Type` el cuerpo viaja como `text/plain;charset=UTF-8`, `express.json` no lo lee, el API recibe un objeto vacío y responde 400 marcando los cuatro campos aunque estén bien. El 7.3 demostró que sin `JSON.stringify`, `fetch` convierte el objeto a texto a su manera, «[object Object]»; el API no puede leerlo como JSON y responde 400 `JSON_INVALIDO`, que el formulario muestra como alerta: «El cuerpo no es un JSON válido.».

**2. ¿Por qué `agregar` llama primero al API y después a `setSeries`?**

Para que la pantalla solo muestre lo que quedó guardado. Si primero se agregara al estado y después el API rechazara los datos o no respondiera, la tarjeta aparecería en pantalla sin existir en la base y desaparecería al recargar. Además, la serie que devuelve el API llega completa: con el `_id` de MongoDB, el estado «Por ver» y el nombre del miembro gracias al `$lookup`; los datos del formulario no traen nada de eso.

**3. ¿Por qué `agregar` no tiene `try/catch`?**

Porque el error tiene que llegar al formulario, que es quien sabe mostrarlo: cada mensaje debajo de su campo o, si no hay detalles, una alerta general. Si `agregar` atrapara el error, el formulario creería que todo salió bien, se limpiaría y la persona no sabría qué corregir.

**4. ¿Por qué el formulario envía el `miembroId` y no el nombre?**

Porque el API relaciona la serie con su miembro mediante el `_id`: revisa que `miembroId` tenga formato de `ObjectId`, comprueba con `miembros.existe` que el miembro esté en la base y lo guarda como `ObjectId` para que el `$lookup` lo encuentre. El nombre no identifica de forma segura a un miembro, porque podría repetirse o cambiar; el `_id` no. La persona ve el nombre en el select, pero el formulario guarda el `_id` en `value={miembro._id}`.

**5. Si el navegador ya valida, ¿por qué el API valida otra vez?**

Porque la validación del navegador se puede saltar, con REST Client o por un error en React, como mostró el experimento 7.1, y el API es quien protege la base: tiene la última palabra. Además, hay reglas que solo el API puede revisar, como si el miembro existe en la base. La validación del navegador sirve para avisar rápido sin enviar nada.

**6. ¿Qué problema mostró el experimento 7.4?**

Que sin `await`, `enviar` no espera a `onAgregar`: limpia el formulario de inmediato y el `try` termina antes de que llegue el error. Con el API apagado, el error quedó sin atrapar y solo apareció en la consola como «Uncaught (in promise) Error: No se pudo conectar con el API. ¿Está encendido el servidor?». La página no mostró la serie ni ningún mensaje, y la persona perdió lo que había escrito sin saber por qué.

### Comprobaciones de las actividades

| Comprobación | Resultado obtenido |
|---|---|
| Recargar después de cambiar `pedir` (Actividad 1) | El Maratón se ve igual: los GET siguen funcionando con el método por defecto. |
| Borrar `MIEMBROS` (Actividad 2) | La página queda en blanco y la consola indica que `data/series.js` no exporta `MIEMBROS`, porque el formulario todavía lo importaba. Se corrigió en la Actividad 5. |
| Select «Propuesta por» | Muestra Ana, Diego, Luis y Sofía, que vienen del API. |
| Agregar con el formulario vacío | Aparecen los cuatro mensajes del navegador y en la pestaña Red no sale ninguna petición. |
| Agregar Severance · Drama · 2 · Sofía | Aparece la tarjeta en «Por ver», «propuesta por Sofía», y el formulario se limpia. |
| Petición POST en la pestaña Red | En Encabezados, estado 201; en Carga útil, `{"titulo":"Severance","genero":"Drama","temporadas":2,"miembroId":"…"}`; en Respuesta, la serie con su `_id`. |
| Recargar la página | Severance sigue en el tablero; también aparece con la petición 5 de REST Client. |
| Agregar con el API detenido | Aparece una alerta arriba del formulario y los datos se quedan. Al encender el API y presionar otra vez, la serie se guarda. |
| Botón «Guardando…» con una red lenta | Con la limitación de red de la pestaña Red, el botón se desactiva y dice «Guardando…» mientras espera la respuesta. |

### Actividad 7: cuatro experimentos

Se restauró el código después de cada experimento.

| Experimento | Qué se cambió | Qué se observó |
|---|---|---|
| 7.1 Sin la validación del navegador | En `FormularioSerie.jsx` se comentó el `if (Object.keys(nuevosErrores).length > 0) { return }` y se envió el formulario vacío. | En la pestaña Red apareció `series POST 400` y los mensajes ahora venían del API. El del género lo delata: debajo de Género apareció «Elija un género de la lista.», que es el texto del API, no el del navegador («Elija un género.»). |
| 7.2 Sin `Content-Type` | En `seriesApi.js` se comentó la línea `opciones.headers = …` y se agregó una serie con datos correctos. | Los cuatro campos se marcaron en rojo aunque estaban bien. En Red, el encabezado decía `text/plain;charset=UTF-8`: `express.json` no leyó el cuerpo y el API recibió un objeto vacío. |
| 7.3 Sin `JSON.stringify` | Se cambió `opciones.body = JSON.stringify(datos)` por `opciones.body = datos`. | El formulario mostró la alerta «El cuerpo no es un JSON válido.» y la Carga útil en Red decía `[object Object]`. El API respondió 400 `JSON_INVALIDO`. |
| 7.4 Sin `await` | En `FormularioSerie.jsx` se quitó `await` delante de `onAgregar`, se detuvo el API y se agregó una serie. | El formulario se limpió, no apareció la serie ni ningún mensaje, y la consola mostró «Uncaught (in promise) Error: No se pudo conectar con el API. ¿Está encendido el servidor?». |

---