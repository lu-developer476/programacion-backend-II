# Programación Backend II — Plataforma de Eventos

Proyecto Final evolucionado sobre la base de autenticación, usuarios, productos y carritos. La entrega incorpora **Passport + JWT, roles, eventos, tickets, validaciones, cupos, notificaciones por Nodemailer y arquitectura por capas**.

## Puntos principales

- Registro y login mediante Passport Local.
- Estrategia Passport JWT `current`, con token en cookie HTTP-only o Bearer.
- Contraseñas protegidas con `bcrypt.hashSync`.
- Roles `user`, `organizer` y `admin`.
- Autorización por rol y propiedad del recurso.
- Gestión completa de eventos: crear, listar, consultar, actualizar y cancelar.
- Inscripción mediante tickets.
- Validación de evento, estado, fecha, duplicados y cupos.
- Reserva de cupo atómica para evitar sobreinscripciones concurrentes.
- Confirmación de inscripción por Nodemailer/SMTP.
- Separación Controllers → Services → Repositories → DAO → Models.
- DTOs para controlar la salida de datos.
- Manejo centralizado de errores.
- Variables de entorno y colección Postman.
- Se conservan los módulos de ecommerce existentes como parte de la evolución del proyecto.

## Requisitos

- Node.js 20+
- MongoDB local o MongoDB Atlas

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

Configurá al menos `MONGO_URL` y `JWT_SECRET`. Para emails, completá las variables `SMTP_*` y `MAIL_FROM`.

## Variables de entorno

```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/programacion_be_ii
JWT_SECRET=cambiar-por-un-secreto-largo-y-seguro
JWT_EXPIRES_IN=1h
COOKIE_NAME=coderCookieToken
CLIENT_URL=http://localhost:3000
NODE_ENV=development

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=no-reply@example.com
```

No subas `.env` ni credenciales al repositorio.

## Roles y autorización

- `user`: consulta eventos y gestiona sus propias inscripciones.
- `organizer`: además puede crear y administrar sus propios eventos.
- `admin`: puede administrar usuarios, productos y cualquier evento/ticket autorizado.

Las rutas de eventos verifican tanto el rol como la propiedad del evento. Un organizer no puede modificar el evento de otro organizer.

## Sesiones

### `POST /api/sessions/register`

```json
{
  "first_name": "Laura",
  "last_name": "Castro",
  "email": "laura@example.com",
  "age": 29,
  "password": "Clave123!"
}
```

El registro utiliza Passport Local y crea el carrito asociado.

### `POST /api/sessions/login`

```json
{
  "email": "laura@example.com",
  "password": "Clave123!"
}
```

Genera JWT y lo guarda en cookie HTTP-only.

### `GET /api/sessions/current`

Requiere cookie de sesión o:

```http
Authorization: Bearer TU_TOKEN
```

Nunca devuelve la contraseña.

## Eventos

| Método | Ruta | Acceso | Acción |
|---|---|---|---|
| GET | `/api/events` | Público | Listar eventos |
| GET | `/api/events/:eid` | Público | Consultar evento |
| POST | `/api/events` | Organizer/Admin | Crear evento |
| PUT | `/api/events/:eid` | Organizer propietario/Admin | Actualizar evento |
| PATCH | `/api/events/:eid/cancel` | Organizer propietario/Admin | Cancelar evento |
| GET | `/api/events/:eid/tickets` | Organizer propietario/Admin | Ver inscripciones |
| POST | `/api/events/:eid/tickets` | Usuario autenticado | Inscribirse |

### Ejemplo de creación

```json
{
  "title": "Workshop de Backend",
  "description": "Workshop práctico sobre APIs y arquitectura backend.",
  "date": "2027-03-15T19:00:00.000Z",
  "location": "Buenos Aires",
  "capacity": 50
}
```

El servicio valida campos obligatorios, fecha futura, capacidad positiva, estado y propiedad del organizador.

## Tickets

| Método | Ruta | Acceso | Acción |
|---|---|---|---|
| GET | `/api/tickets/mine` | Autenticado | Mis tickets |
| PATCH | `/api/tickets/:tid/cancel` | Dueño/Organizer/Admin | Cancelar ticket |

Al inscribirse se comprueba:

1. El evento existe.
2. Está programado.
3. Su fecha todavía es válida.
4. El usuario no está ya inscripto.
5. Existe capacidad disponible.
6. Se reserva el cupo de forma atómica.
7. Se crea el ticket.
8. Se envía confirmación por email cuando SMTP está configurado.

## Arquitectura

```text
src/
├── config/
│   ├── config.js
│   ├── database.js
│   └── passport.config.js
├── controllers/
├── dao/
│   ├── models/
│   └── *.dao.js
├── dto/
├── middlewares/
├── repositories/
├── routes/
├── services/
└── utils/
```

Responsabilidades:

- **Controller:** HTTP y formato de respuesta.
- **Service:** reglas de negocio y validaciones.
- **Repository:** abstracción de persistencia.
- **DAO:** acceso a Mongoose.
- **Model:** esquema y restricciones de MongoDB.
- **DTO:** forma segura y explícita de exponer datos.

## Ecommerce conservado

Los endpoints de usuarios, productos y carritos de las entregas anteriores siguen disponibles. Los controladores de usuarios y productos fueron desacoplados para respetar la misma arquitectura por capas.

## Crear administrador

Completá las variables `ADMIN_*` del `.env` y ejecutá:

```bash
npm run seed:admin
```

## Pruebas

```bash
npm test
```

Las pruebas verifican requisitos estructurales críticos, incluyendo modelo de usuario, bcrypt, estrategias Passport, protección de `/current`, capas de arquitectura y módulos de eventos/tickets.

## Postman

La colección `postman/Programacion-BE-II.postman_collection.json` incluye el flujo de autenticación y endpoints principales para probar la API.

## Entrega

El repositorio debe incluir código fuente, README, `.env.example`, documentación y scripts, pero no `.env`, `node_modules` ni credenciales privadas.
