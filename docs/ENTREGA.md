# Correspondencia con la rúbrica

## Continuidad e integración

La entrega conserva la base de usuarios, autenticación, productos y carritos y la evoluciona incorporando el dominio principal de **Plataforma de Eventos**. Los nuevos módulos utilizan la misma arquitectura por capas.

## Autenticación y seguridad

- Passport Local para `register` y `login`.
- Passport JWT para `current`.
- `bcrypt.hashSync` para contraseñas.
- JWT con `sub`, email y rol.
- Cookie `HTTP-only`.
- Soporte adicional de Bearer token para pruebas.
- Sanitización de respuestas para no exponer `password` ni `__v`.

## Tickets, cupos e inscripciones

`Event` y `Ticket` implementan:

- inscripción autenticada;
- evento existente;
- estado programado;
- fecha futura;
- prevención de duplicados mediante índice único;
- validación de capacidad;
- reserva atómica de cupos;
- cancelación y liberación del cupo.

## Passport, roles y autorización

Las estrategias se encuentran en `src/config/passport.config.js`:

- `register`
- `login`
- `current`

La autorización combina rol y propiedad del recurso. Los organizers solo administran sus eventos; los admins pueden administrar cualquier evento autorizado.

## Gestión de eventos

La entidad `Event` contempla:

- título y descripción;
- fecha;
- ubicación;
- capacidad;
- cupos reservados;
- estado;
- organizador.

La API permite listar, consultar, crear, actualizar y cancelar eventos, con validaciones de fecha, capacidad, estado y propiedad.

## Nodemailer

`src/services/notification.service.js` utiliza Nodemailer y variables de entorno SMTP. La inscripción confirmada dispara un email de confirmación cuando el transporte SMTP está configurado.

## Arquitectura profesional

La separación es:

`routes → controllers → services → repositories → DAO → models`

Los DTOs controlan la representación de salida. Los controladores ya no contienen acceso directo a los modelos de usuarios/productos y la lógica de negocio principal está concentrada en services.

## Documentación y calidad

Se mantienen:

- README detallado;
- `.env.example`;
- scripts de inicio y seed;
- colección Postman;
- pruebas automáticas;
- `.gitignore` para `.env` y `node_modules`.

No se incluyen credenciales privadas.
