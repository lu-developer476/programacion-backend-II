import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('el modelo User contiene todos los campos exigidos y roles', async () => {
  const source = await read('../src/dao/models/user.model.js');
  for (const field of ['first_name','last_name','email','age','password','cart','role']) assert.match(source, new RegExp(`${field}\\s*:`));
  assert.match(source, /default:\s*'user'/);
  assert.match(source, /unique:\s*true/);
  assert.match(source, /organizer/);
});

test('la contraseña utiliza bcrypt.hashSync', async () => {
  const source = await read('../src/utils/password.js');
  assert.match(source, /bcrypt\.hashSync/);
});

test('Passport incluye estrategias register, login y current', async () => {
  const source = await read('../src/config/passport.config.js');
  for (const strategy of ['register','login','current']) assert.match(source, new RegExp(`'${strategy}'`));
  assert.match(source, /JwtStrategy/);
});

test('sessions expone GET /current protegido', async () => {
  const source = await read('../src/routes/sessions.router.js');
  assert.match(source, /router\.get\('\/current',\s*authenticateCurrent,\s*current\)/);
});

test('la arquitectura contiene controllers, services, repositories, DAO y DTO', async () => {
  const source = await read('../README.md');
  for (const layer of ['controllers','services','repositories','DAO','DTO']) assert.match(source, new RegExp(layer, 'i'));
});

test('eventos y tickets incluyen validaciones y rutas principales', async () => {
  const eventService = await read('../src/services/event.service.js');
  const ticketService = await read('../src/services/ticket.service.js');
  const eventRouter = await read('../src/routes/events.router.js');
  assert.match(eventService, /futura/);
  assert.match(eventService, /capacity/);
  assert.match(ticketService, /Ya estás inscripto/);
  assert.match(ticketService, /reserveSlot/);
  assert.match(eventRouter, /\/tickets/);
});

test('Nodemailer se configura desde variables de entorno', async () => {
  const source = await read('../src/services/notification.service.js');
  const config = await read('../src/config/config.js');
  assert.match(source, /nodemailer/);
  assert.match(config, /SMTP_HOST/);
  assert.match(config, /SMTP_PASSWORD/);
});
