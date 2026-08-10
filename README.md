# Proyecto Final — Programación Backend II

API REST de e-commerce desarrollada con Node.js, Express y MongoDB. El proyecto aplica arquitectura por capas, DAO, Repository, DTO, autenticación JWT, autorización por roles, hashing de contraseñas y recuperación segura de contraseña.

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT
- bcrypt
- Nodemailer
- dotenv

## Arquitectura

```text
src/
├── app.js
├── config/
├── dao/
│   ├── models/
│   └── mongo/
├── dtos/
├── repositories/
└── routes/
```

Las rutas reciben las solicitudes HTTP, los repositorios abstraen la lógica de acceso y los DAOs encapsulan la persistencia en MongoDB. Los DTOs evitan exponer la contraseña y otros datos sensibles.

## Instalación

```bash
git clone https://github.com/lu-developer476/programacion-backend-II.git
cd programacion-backend-II
npm install
```

Copiar `.env.example` como `.env` y completar al menos:

```env
PORT=8080
MONGO_URL=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/backendII
JWT_SECRET=un-secreto-largo-y-privado
MAIL_USER=
MAIL_PASS=
RESET_TOKEN_MINUTES=60
```

Iniciar:

```bash
npm run dev
```

o:

```bash
npm start
```

## Autenticación

Las rutas protegidas esperan:

```text
Authorization: Bearer <JWT>
```

### Sesiones

| Método | Ruta | Acceso | Función |
|---|---|---|---|
| POST | `/api/sessions/register` | Público | Registrar usuario y crear carrito |
| POST | `/api/sessions/login` | Público | Validar credenciales y generar JWT |
| GET | `/api/sessions/current` | USER / ADMIN | Obtener usuario mediante DTO |
| POST | `/api/sessions/forgot-password` | Público | Generar token de recuperación |
| POST | `/api/sessions/reset-password` | Público | Cambiar contraseña con token |

Las contraseñas se almacenan mediante bcrypt. El registro público crea usuarios con rol `user`; la asignación de `admin` queda restringida a operaciones administrativas.

## Usuarios

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/users` | ADMIN |
| GET | `/api/users/:uid` | ADMIN |
| POST | `/api/users` | ADMIN |
| PUT | `/api/users/:uid` | ADMIN |
| DELETE | `/api/users/:uid` | ADMIN |

## Productos

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/products` | Público |
| GET | `/api/products/:pid` | Público |
| POST | `/api/products` | ADMIN |
| PUT | `/api/products/:pid` | ADMIN |
| DELETE | `/api/products/:pid` | ADMIN |

La consulta de productos admite:

```text
/api/products?limit=10&page=1&sort=asc&category=notebooks&availability=true
```

La respuesta incluye paginación, página anterior/siguiente y enlaces navegables.

## Carritos

| Método | Ruta | Acceso | Función |
|---|---|---|---|
| POST | `/api/carts` | USER / ADMIN | Crear carrito |
| GET | `/api/carts/:cid` | USER / ADMIN | Obtener carrito con productos |
| POST | `/api/carts/:cid/product/:pid` | USER / ADMIN | Agregar producto |
| PUT | `/api/carts/:cid` | USER / ADMIN | Reemplazar productos |
| PUT | `/api/carts/:cid/product/:pid` | USER / ADMIN | Actualizar cantidad |
| DELETE | `/api/carts/:cid/product/:pid` | USER / ADMIN | Quitar producto |
| DELETE | `/api/carts/:cid` | USER / ADMIN | Vaciar carrito |
| POST | `/api/carts/:cid/purchase` | USER / ADMIN | Comprar y generar ticket |

La compra comprueba el stock disponible. Los productos con stock suficiente se descuentan y se incluyen en el ticket; los que no pueden comprarse permanecen en el carrito.

## Recuperación de contraseña

El flujo es:

1. `POST /api/sessions/forgot-password` con `{ "email": "..." }`.
2. Se genera un token aleatorio almacenando únicamente su hash.
3. El token expira según `RESET_TOKEN_MINUTES`.
4. Con `POST /api/sessions/reset-password` se envía `{ "token": "...", "password": "..." }`.
5. No se permite reutilizar una contraseña anterior.
6. El token se invalida después de utilizarse.

Si Nodemailer no está configurado, el endpoint devuelve un token de desarrollo para poder probar el flujo localmente. En un entorno real se deben configurar `MAIL_USER` y `MAIL_PASS`.

## Health check

```text
GET /health
```

Devuelve el estado básico de la API.

## Importante

No subir `.env` al repositorio. Usar `.env.example` como plantilla.

Proyecto final de Programación Backend II — implementación orientada a arquitectura, seguridad y persistencia con MongoDB.
