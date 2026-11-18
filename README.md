# Maratón de series

**Tarea 3 — Parte A: laboratorios guiados**

**Curso:** SOFT-12-C1 -- Programación Web Avanzada

**Estudiante:** Sidney Rodríguez

**Sección:** SCV2   **Periodo:** III Cuatrimestre 2026

**Docente:** Álvaro Cordero Peña

**Fecha de entrega:** 22 de noviembre de 2026

## Descripción del proyecto

Este repositorio reúne los laboratorios guiados del curso que forman la Parte A de la Tarea 3: los proyectos base de React y el Maratón de series en su estado final.

Maratón de series es el tablero de un club de amigos que se organiza para ver series. Cada serie tiene un título, un género, un número de temporadas, el miembro del club que la propuso y un estado: Por ver, Viendo o Vista. En el tablero se pueden listar las series, filtrarlas por estado y por miembro, ver el detalle de cada una, agregar series nuevas, cambiar su estado y quitarlas. El Maratón tiene tres partes:

- **Servidor — Express y MongoDB:** API REST que recibe las peticiones de React, aplica las reglas del negocio y guarda las series y los miembros en MongoDB Atlas.
- **Cliente — React con React Router:** interfaz con varias páginas (inicio, lista con filtros, detalle y formulario) que consume el API de Express.
- **Servidor .NET — ASP.NET Core, EF Core y SQL Server:** el mismo modelo llevado a tablas con migraciones y datos iniciales, con dos rutas GET que responden el mismo JSON que Express.

Como los laboratorios son acumulativos, el estado final de `maraton-series/` contiene el trabajo de todos los anteriores. Cada laboratorio está documentado en `docs/laboratorios.md`.

## Tecnologías

- JavaScript (módulos ES)
- React 19 y React Router 8
- Vite
- Bootstrap
- Node.js y Express 5
- MongoDB Atlas y el driver oficial de MongoDB
- C# y ASP.NET Core (.NET 10)
- Entity Framework Core 10
- SQL Server
- Git y GitHub

## Laboratorios incluidos

| Laboratorios | Dónde están |
|---|---|
| Proyectos base: conceptos de React; props, children, eventos y `useState` | `proyectos-base/` |
| Maratón con React: montaje del proyecto, armar el tablero con componentes, ¿por qué no basta una variable?, cambiar estado y quitar con `useState`, filtros y resumen, y formulario para agregar una serie | `maraton-series/cliente/` |
| El API del Maratón: estructura del proyecto, el API escuchando peticiones, conectar el API con MongoDB, el módulo miembros, listar y crear series, y cambiar estado y eliminar | `maraton-series/servidor/` |
| Maratón conectado al API: React lee el API, el formulario crea con POST, y cambiar estado y quitar desde React | `maraton-series/cliente/` |
| React Router: varias páginas, detalle con `:id` y filtros en la dirección | `maraton-series/cliente/` y la ruta `GET /api/series/:id` de `maraton-series/servidor/` |
| EF Core y SQL Server: el Maratón en tablas con migraciones y dos rutas GET | `maraton-series/servidor-net/` |

## Estructura del repositorio

- `docs/`: documentación de los laboratorios.
  - `laboratorios.md`: una sección por laboratorio.
  - `capturas/`: capturas que se usan como evidencia en `laboratorios.md`.
- `proyectos-base/`: proyectos de los laboratorios de conceptos de React; props, children, eventos y `useState`.
- `maraton-series/`: el Maratón de series en su estado final.
  - `servidor/`: API con Express y MongoDB.
  - `cliente/`: aplicación de React con React Router, creada con Vite.
  - `servidor-net/`: API con ASP.NET Core, EF Core y SQL Server.
- `.gitignore`: deja fuera del repositorio `node_modules/`, los archivos `.env` y `dist/`. El `.gitignore` de `servidor-net/` deja fuera `bin/` y `obj/`.

## Instalación y ejecución

### Requisitos

- Node.js 22.22 o superior, con npm. React Router 8 exige esa versión; el servidor de Express usa además la opción `--env-file`, disponible desde Node.js 20.6.
- SDK de .NET 10. El archivo `global.json` de `servidor-net/` hace que el proyecto use la versión 10 aunque la computadora tenga instalada una más nueva.
- La herramienta `dotnet-ef` 10.0.14, para las migraciones.
- SQL Server: en Windows, SQL Server 2025 Express (instancia `SQLEXPRESS`); en Mac, SQL Server 2022 en un contenedor de Docker.
- Un clúster de MongoDB Atlas con la base `maraton` y sus colecciones `miembros` y `series`.
- Visual Studio Code con las extensiones REST Client (para los archivos `requests.http`), SQL Server (mssql) y C# Dev Kit.
- Un navegador actualizado, por ejemplo, Google Chrome.

Para obtener el proyecto, clonar el repositorio:

`git clone https://github.com/rod-sidney/Tarea3.git`

Cada proyecto es independiente: los proyectos base, `cliente/` y `servidor/` tienen su propio `package.json`, y `servidor-net/` su propio `MaratonApi.csproj`, por lo que las dependencias se instalan por separado dentro de cada carpeta. Las carpetas `node_modules/`, `bin/` y `obj/` no se incluyen en el repositorio: se generan al instalar las dependencias o al compilar. Tampoco se incluyen los archivos `.env` ni la cadena de conexión de SQL Server; el repositorio trae los `.env.example`, y la cadena se configura con user-secrets.

### Los tres servidores y el cliente

| Pieza | Carpeta | Comando | Dirección |
|---|---|---|---|
| Servidor Express (API) | `maraton-series/servidor` | `npm run dev` | `http://localhost:3000/api` |
| Cliente React (Vite) | `maraton-series/cliente` | `npm run dev` | `http://localhost:5173` |
| Servidor .NET (API) | `maraton-series/servidor-net` | `dotnet run` | `http://localhost:5080/api` |

Cada uno se ejecuta en su propia terminal; en Visual Studio Code se abre otra terminal con el botón + del panel de terminal. La primera vez hay que instalar las dependencias y configurar cada parte, como se explica en las secciones siguientes. Después, el orden para encender el Maratón es:

1. Revisar que el clúster de MongoDB Atlas esté activo (los clústeres gratuitos se pausan después de 30 días sin uso) y que SQL Server esté encendido.
2. Encender el servidor Express y esperar los mensajes `Conectado a MongoDB: maraton` y `API escuchando en http://localhost:3000`.
3. Encender el cliente y abrir `http://localhost:5173` en el navegador.
4. Encender el servidor .NET y esperar el mensaje `Now listening on: http://localhost:5080`.

El cliente trabaja con el servidor Express. El servidor .NET tiene por ahora solo `GET /api/miembros` y `GET /api/series`, y se prueba con su propio archivo `requests.http`.

## Proyectos base

Esta parte del repositorio corresponde a los proyectos base de los laboratorios de React: conceptos de React; props, children, eventos y `useState`. Cada carpeta dentro de `proyectos-base/` es un proyecto independiente, creado con Vite.

### Instalación de dependencias

Desde una terminal, ingresar a la carpeta del proyecto y ejecutar:

`npm install`

### Ejecución

Para iniciar el servidor de desarrollo, ejecutar:

`npm run dev`

Luego, abrir en el navegador la dirección que muestra la terminal (por defecto, `http://localhost:5173`). Si el cliente del Maratón está encendido, Vite usa el siguiente puerto libre, por ejemplo, `http://localhost:5174`.

## Maratón — Servidor Express

Esta parte corresponde a `maraton-series/servidor/`, el API REST del Maratón. Recibe las peticiones del cliente de React, aplica las reglas del negocio y guarda los datos en MongoDB Atlas. Está organizado en dos módulos, `miembros` y `series`, y cada módulo separa sus capas: rutas, controlador, servicio y repositorio.

### Tecnologías utilizadas

- Node.js con módulos ES (`"type": "module"`).
- Express 5 para las rutas y los middlewares.
- El driver oficial de MongoDB (paquete `mongodb`) para conectarse a MongoDB Atlas.
- `cors` para autorizar únicamente al cliente de React.
- Las opciones `--env-file` y `--watch` de Node.js, para leer el `.env` y reiniciar el API con cada cambio.

### Estructura de archivos

Dentro de `maraton-series/servidor/` se encuentran los siguientes archivos y carpetas:

- `package.json`: dependencias y comandos del proyecto (`dev` y `start`).
- `.env.example`: los nombres de las variables de entorno, sin valores reales.
- `requests.http`: peticiones de prueba para la extensión REST Client.
- `src/index.js`: punto de entrada; se conecta a MongoDB y después enciende el API.
- `src/app.js`: arma la aplicación de Express: `cors`, `express.json()`, los routers de cada módulo y el manejo de errores, en ese orden.
- `src/config/`: `env.js` (lee y revisa las variables de entorno) y `db.js` (abre una sola conexión a MongoDB y la entrega con `obtenerDb()`).
- `src/middlewares/errores.js`: `rutaNoEncontrada` y `manejarErrores`, que responden todos los errores con el formato `{ error: { codigo, mensaje, detalles } }`.
- `src/utils/`: `HttpError.js` (errores previstos con su código HTTP) y `revisarId.js` (revisa el formato de un `ObjectId`).
- `src/miembros/`: `miembros.routes.js`, `miembros.controller.js`, `miembros.service.js` y `miembros.repository.js`.
- `src/series/`: las mismas cuatro capas, más `series.validacion.js` con las reglas de los datos que llegan del formulario.

### Instalación de dependencias

Desde una terminal, ingresar a la carpeta `maraton-series/servidor` y ejecutar:

`npm install`

Este comando instala Express, el driver de MongoDB y `cors`.

### Configuración

1. En MongoDB Atlas, revisar que el clúster esté activo, que el usuario de la cadena de conexión exista en Database Access y que la dirección IP de la computadora esté en Network Access.
2. Revisar que la base `maraton` tenga las colecciones `miembros` y `series`, con su validación `$jsonSchema` y sus datos de prueba. Se crean con el playground `02-modelo.mongodb.js` del laboratorio de diseño de MongoDB.
3. Copiar `.env.example` como `.env` en la misma carpeta y completar los valores:

| Variable | Valor | Para qué |
|---|---|---|
| `PORT` | `3000` | El puerto del API. |
| `MONGODB_URI` | La cadena de conexión del clúster de Atlas (`mongodb+srv://usuario:contraseña@…`) | Usuario, contraseña y dirección del clúster. Es un secreto: no se sube al repositorio. |
| `DB_NAME` | `maraton` | El nombre de la base. |
| `CLIENT_ORIGIN` | `http://localhost:5173` | El único origen que `cors` autoriza: el cliente de React. |

Si falta `MONGODB_URI`, `DB_NAME` o `CLIENT_ORIGIN`, el API no arranca y la terminal indica cuál falta.

### Ejecución

Para iniciar el API en modo de desarrollo, ejecutar:

`npm run dev`

La terminal debe mostrar `Conectado a MongoDB: maraton` y después `API escuchando en http://localhost:3000`. Con `--watch`, el API se reinicia solo al guardar un archivo de código. El `.env` se lee solo al arrancar: si se modifica, hay que detener el API con Ctrl + C y volver a ejecutar `npm run dev`.

Para ejecutarlo sin el reinicio automático, ejecutar:

`npm start`

### Rutas

| Método y ruta | Qué hace | Respuestas |
|---|---|---|
| `GET /api/miembros` | Lista los miembros, solo con `_id` y `nombre`, ordenados por nombre. | 200 |
| `GET /api/series` | Lista las series, cada una con el nombre del miembro que la propuso. | 200 |
| `GET /api/series/:id` | Devuelve una serie. | 200 · 400 · 404 |
| `POST /api/series` | Crea una serie con estado «Por ver». | 201 · 400 |
| `PATCH /api/series/:id/estado` | Cambia el estado de una serie. | 200 · 400 · 404 |
| `DELETE /api/series/:id` | Elimina una serie. | 204 · 400 · 404 |

Para probarlas, abrir `requests.http` en Visual Studio Code y hacer clic en **Send Request** sobre cada petición. En las peticiones que piden un identificador, pegar el `_id` de una serie o de un miembro, que se obtiene con las peticiones que listan.

## Maratón — Cliente React

Esta parte corresponde a `maraton-series/cliente/`, la interfaz del Maratón. Se desarrolla con React y Vite, pide los datos al API de Express y tiene varias páginas gracias a React Router. Todo lo que se agrega, cambia o quita desde la pantalla queda guardado en MongoDB.

### Tecnologías utilizadas

- React 19 con componentes funcionales y los hooks `useState` y `useEffect`.
- React Router 8 (paquete `react-router`): rutas, diseño compartido con `Outlet`, `Link`, `NavLink`, `useParams`, `useNavigate` y `useSearchParams`.
- Vite como herramienta de desarrollo y compilación.
- Bootstrap 5.3 instalado localmente con npm.
- `fetch` con `async`/`await` para consumir el API.
- Oxlint para revisar el código.

### Estructura de archivos

Dentro de `maraton-series/cliente/` se encuentran los siguientes archivos y carpetas:

- `index.html`: página base donde se monta la aplicación.
- `package.json`: dependencias y comandos del proyecto.
- `vite.config.js`: configuración de Vite.
- `.env.example`: la variable `VITE_API_URL` con la dirección del API.
- `src/main.jsx`: punto de entrada; importa Bootstrap y los estilos, y envuelve `App` con `BrowserRouter`.
- `src/App.jsx`: el mapa de la aplicación: qué página se muestra en cada dirección.
- `src/api/seriesApi.js`: todas las llamadas al API (`obtenerSeries`, `obtenerSerie`, `obtenerMiembros`, `crearSerie`, `cambiarEstadoSerie` y `eliminarSerie`), con una función `pedir` que convierte cualquier falla en un mensaje para la pantalla.
- `src/paginas/`: `Inicio`, `PaginaSeries` (lista, filtros y resumen), `DetalleSerie`, `NuevaSerie` y `NoEncontrada`.
- `src/componentes/`: componentes organizados por carpetas.
  - `layout/`: `Layout` (el encabezado y el `Outlet` donde se dibuja cada página) y `Encabezado` (el menú con `NavLink`).
  - `comunes/`: `Panel`, contenedor reutilizable que recibe `children`.
  - `filtros/`: `Filtros`, filtros por estado y por miembro.
  - `resumen/`: `Resumen`, cantidad de series por estado.
  - `series/`: `ListaSeries` y `TarjetaSerie`.
  - `formulario/`: `FormularioSerie`, formulario controlado para agregar series.
- `src/data/series.js`: las listas fijas de estados y géneros.
- `src/utils/`: `series.js` (siguiente estado y clase de cada estado) y `validarSerie.js` (validación del formulario).
- `src/estilos.css`: estilos propios.

### Instalación de dependencias

Desde una terminal, ingresar a la carpeta `maraton-series/cliente` y ejecutar:

`npm install`

Este comando instala React, React Router, Vite, Bootstrap y las demás dependencias declaradas en `package.json`.

### Configuración

Copiar `.env.example` como `.env` en la carpeta `cliente` (al lado de `package.json`, no dentro de `src`). Contiene la dirección del API de Express:

`VITE_API_URL=http://localhost:3000/api`

El nombre de la variable debe empezar con `VITE_` para que React pueda leerla. No es un secreto: su valor termina dentro del JavaScript que descarga el navegador.

### Ejecución

Con el servidor Express encendido, iniciar el servidor de desarrollo:

`npm run dev`

Luego, abrir en el navegador `http://localhost:5173`. El cliente debe correr en el puerto 5173, que es el origen que autoriza el API (`CLIENT_ORIGIN`): si Vite avisa que ese puerto está ocupado, cerrar el otro proceso y volver a ejecutar el comando.

Para generar la versión de producción en la carpeta `dist/`, ejecutar:

`npm run build`

Para revisar el código con Oxlint, ejecutar:

`npm run lint`

### Rutas de la aplicación

| Dirección | Página |
|---|---|
| `/` | Inicio, con el botón «Ver series». |
| `/series` | La lista de series con sus filtros y el resumen. Los filtros se guardan en la dirección, por ejemplo, `/series?estado=Viendo&miembro=Ana`. |
| `/series/nueva` | El formulario para agregar una serie. |
| `/series/:id` | El detalle de una serie. |
| Cualquier otra | La página «404 — Esa página no existe.». |

## Maratón — Servidor .NET

Esta parte corresponde a `maraton-series/servidor-net/`, el API del Maratón construido con ASP.NET Core y Entity Framework Core sobre SQL Server. Lleva a tablas el modelo de documentos de MongoDB: `Generos`, `Miembros`, `Series` y la tabla intermedia `MiembroGeneros`, con claves primarias y foráneas, índices únicos y restricciones CHECK. Expone `GET /api/miembros` y `GET /api/series` con el mismo JSON que el servidor Express.

### Tecnologías utilizadas

- .NET 10 (versión de soporte a largo plazo), fijado con `global.json`.
- ASP.NET Core con Minimal APIs.
- Entity Framework Core 10.0.14 con el proveedor de SQL Server, con versión fija.
- La herramienta `dotnet-ef` 10.0.14 para crear y aplicar las migraciones.
- SQL Server 2025 Express en Windows o SQL Server 2022 en Docker en Mac.
- user-secrets para guardar la cadena de conexión fuera del proyecto.

### Estructura de archivos

Dentro de `maraton-series/servidor-net/` se encuentran los siguientes archivos y carpetas:

- `global.json`: fija el SDK de .NET 10.
- `MaratonApi.csproj`: el proyecto, con la versión de .NET, los paquetes de EF Core 10.0.14 y el `UserSecretsId`.
- `Program.cs`: registra el `MaratonContext` con la cadena de conexión y define las rutas.
- `Properties/launchSettings.json`: ejecución en desarrollo en el puerto 5080.
- `appsettings.json`: configuración que no es secreta; no contiene la cadena de conexión.
- `Modelos/`: las entidades `Genero`, `Miembro` y `Serie`.
- `Datos/MaratonContext.cs`: el `DbContext`, con los largos máximos, los índices únicos, las restricciones CHECK, las relaciones, el comportamiento al borrar (`Restrict`), la relación muchos a muchos `MiembroGeneros` y los datos iniciales con `HasData`.
- `Migrations/`: las migraciones `Inicial` (tablas `Generos`, `Miembros` y `Series` con sus datos) y `GenerosFavoritos` (tabla `MiembroGeneros`), junto con la foto del modelo que usa EF Core.
- `sql/consultas.sql`: consultas de comprobación (JOIN, muchos a muchos y GROUP BY) y experimentos que violan las restricciones.
- `requests.http`: peticiones de prueba para REST Client.
- `.gitignore`: deja fuera `bin/` y `obj/`.

### Instalación de dependencias

Desde una terminal, ingresar a la carpeta `maraton-series/servidor-net` y ejecutar:

`dotnet restore`

Este comando descarga los paquetes de EF Core declarados en `MaratonApi.csproj`, con su versión fija. `dotnet build` y `dotnet run` también lo hacen de forma automática.

Si la herramienta `dotnet-ef` no está instalada en la computadora, instalarla una sola vez:

`dotnet tool install --global dotnet-ef --version 10.0.14`

Para comprobarla, ejecutar `dotnet ef --version`: debe mostrar `10.0.14`.

### Configuración de la cadena de conexión

La cadena de conexión no está en `appsettings.json` ni en el código: se guarda con user-secrets, en un archivo `secrets.json` que vive en la carpeta del usuario, fuera del proyecto. El proyecto la lee con la clave `ConnectionStrings:Maraton`.

Dentro de `servidor-net`, ejecutar el comando que corresponde al sistema:

- Windows (SQL Server Express con la cuenta de Windows): `dotnet user-secrets set "ConnectionStrings:Maraton" "Server=localhost\SQLEXPRESS;Database=Maraton;Trusted_Connection=True;TrustServerCertificate=True"`
- Mac (SQL Server en Docker): `dotnet user-secrets set "ConnectionStrings:Maraton" "Server=localhost,1433;Database=Maraton;User Id=sa;Password=<contraseña de sa>;TrustServerCertificate=True"`

Para revisarla, ejecutar `dotnet user-secrets list`: debe mostrar `ConnectionStrings:Maraton = Server=…`.

### Base de datos: migraciones y datos iniciales

Con SQL Server encendido, crear la base `Maraton` con sus tablas y sus datos iniciales:

`dotnet ef database update`

Se aplican en orden las migraciones `Inicial` y `GenerosFavoritos`. La base queda lista para probar, con 5 géneros, 4 miembros (Ana, Luis, Sofía y Diego), 5 series y 6 géneros favoritos.

Para reconstruir la base desde cero, ejecutar:

`dotnet ef database drop --force`

`dotnet ef database update`

Para ver las migraciones del proyecto, ejecutar `dotnet ef migrations list`.

Las consultas de `sql/consultas.sql` se ejecutan desde la extensión SQL Server de Visual Studio Code: seleccionar una consulta y presionar Ctrl + Shift + E (Cmd + Shift + E en Mac).

### Ejecución

Para iniciar el API, ejecutar:

`dotnet run`

La terminal debe mostrar `Now listening on: http://localhost:5080`. En `http://localhost:5080` aparece el texto «API del Maratón en .NET». Después de cada petición, la terminal muestra el SQL que generó EF Core (`Executed DbCommand`).

### Rutas

| Método y ruta | Qué hace | Respuestas |
|---|---|---|
| `GET /api/miembros` | Lista los miembros, solo con `_id` y `nombre`, ordenados por nombre. | 200 |
| `GET /api/series` | Lista las series con el nombre de su género y de su miembro. | 200 |

Para probarlas, abrir `servidor-net/requests.http` y enviar las peticiones con REST Client.

## Express y .NET: el mismo contrato

`GET /api/miembros` y `GET /api/series` responden el mismo JSON en los dos servidores: los mismos nombres de campo, los mismos tipos y los identificadores como texto. Por eso el cliente de React no depende de si los datos vienen de MongoDB o de SQL Server.

| Campo | Express + MongoDB | .NET + SQL Server |
|---|---|---|
| `_id` | El `ObjectId` como texto, por ejemplo, `"6650…a1"` | El `Id` entero como texto, por ejemplo, `"1"` |
| `titulo`, `genero`, `temporadas`, `estado` | Iguales | Iguales |
| `miembroId` | El `ObjectId` del miembro como texto | El `Id` del miembro como texto |
| `miembro` | `"Ana"`, obtenido con `$lookup` | `"Ana"`, obtenido con `JOIN` |

## Documentación

La documentación de los laboratorios se encuentra en la carpeta `docs/`.

El archivo `docs/laboratorios.md` tiene una sección por laboratorio con la captura del resultado esperado, la tabla «Explique el recorrido» completada, las respuestas del recuadro «Reflexiona» y los experimentos que se realizaron, con lo que se observó en cada uno. Las capturas se encuentran en `docs/capturas/`.

## Resumen de commits

| # | Fecha | Hash | Mensaje | Zona | Cambio |
|---|---|---|---|---|---|
| 1 | 2026-11-16 | 5525e61 | Creación del repositorio, README.md inicial, docs iniciales | Carpetas | Agregar laboratorios completados |
| 2 | 2026-11-16 | 79fdeda | Completar laboratorio -Conectar el API con MongoDB-, y respectiva documentación | /docs, /maraton-series/servidor | README.md, laboratorios.md, index.js |
| 3 | 2026-11-17 | 53a7b5a | Completar laboratorio -El primer módulo: miembros- | /docs, /maraton-series/servidor, /mongo, /miembros | laboratorios.md, 02-modelo..mongodb.js, requests.http, app.js, miembros.controller.js, miembros.repository.js, miembros.routes.js, miembros.service.js |
| 4 | 2026-11-17 | d3144ad | Completar laboratorio -Series: listar y crear- | README.md, /docs, maraton-series/servidor, /miembros, /series | requests.http, app.js, miembros.repository.js, miembros.service.js, series.controller.js, series.repository.js, series.routes.js, series.service.js, series.validacion.js |
| 5 | 2026-11-17 | d76aa02 | Completar laboratorio -Series: estado y eliminar- | /docs, /maraton-series/servidor, /series, /utils | README.md, laboratorios.md, requests.http, series.controller.js, series.repository.js, series.routes.js, series.service.js, series.validacion.js, revisarId.js |
