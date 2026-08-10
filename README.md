# Proyecto Final - Backend II

Este repositorio contiene la entrega final del curso de **Programación Backend II: Diseño y Arquitectura**.

El proyecto consiste en la creación de un servidor robusto y escalable para un e-commerce, aplicando buenas prácticas de desarrollo, seguridad y arquitectura profesional.

## Funcionalidades Principales

Este servidor fue desarrollado priorizando la modularidad, escalabilidad y seguridad.

### Arquitectura
- Implementación del **Patrón Repository**.
- Uso de la capa **DAO (Data Access Object)** para desacoplar la lógica de negocio del acceso a datos.

### Seguridad
- Implementación de **DTOs (Data Transfer Objects)** en la ruta `/current` para proteger información sensible de los usuarios.
- Sistema seguro de **recuperación de contraseña** mediante:
  - Envío de correos electrónicos con tokens únicos.
  - Expiración automática del token después de 1 hora.
  - Validación para impedir la reutilización de contraseñas anteriores.

### Autorización
Middleware integrado con la estrategia **current** para gestionar permisos según el rol del usuario:

- **Administrador:** gestión completa de productos.
- **Usuario:** gestión de carrito y proceso de compra.

### Lógica de Compra
- Generación de tickets de compra.
- Validación de stock disponible.
- Persistencia de transacciones realizadas.

### Herramientas Complementarias
- Manejo de variables de entorno con Dotenv.
- Envío de correos electrónicos con Nodemailer.
- Hashing de contraseñas mediante Bcrypt.
- Autenticación basada en JWT.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt
- Nodemailer
- Dotenv

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/backend_ii_proyecto_final_2.git
cd backend_ii_proyecto_final_2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto siguiendo el ejemplo de `.env.example`.

```env
PORT=8080
MONGO_URL=
MAIL_USER=
MAIL_PASS=
JWT_SECRET=
```

### 4. Ejecutar el servidor

```bash
npm start
```

## Estructura General

El proyecto implementa una arquitectura en capas que separa responsabilidades entre:

- Routes
- Controllers
- Services
- Repositories
- DAOs
- Models
- DTOs
- Middlewares

Esta organización facilita el mantenimiento, escalabilidad y reutilización del código.

---

Desarrollado como parte del Proyecto Final de Programación Backend II: Diseño y Arquitectura.

Autor: **Cielo Ferrer**