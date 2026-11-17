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
