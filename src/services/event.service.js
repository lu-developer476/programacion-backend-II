import { eventRepository } from '../repositories/event.repository.js';
import { ticketRepository } from '../repositories/ticket.repository.js';
import { HttpError } from '../utils/http-error.js';

const assertFutureDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime()) || parsed <= new Date()) throw new HttpError(400, 'La fecha del evento debe ser válida y futura');
  return parsed;
};

const canManage = (event, user) =>
  user.role === 'admin' || event.organizer?._id?.toString() === user._id.toString();

export const eventService = {
  async create(data, user) {
    const { title, description, date, location, capacity } = data;
    if (!title || !description || !date || !location || capacity === undefined) throw new HttpError(400, 'title, description, date, location y capacity son obligatorios');
    if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) throw new HttpError(400, 'capacity debe ser un entero mayor o igual a 1');
    return eventRepository.create({ title, description, date: assertFutureDate(date), location, capacity: Number(capacity), organizer: user._id });
  },
  async list(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.organizer) filter.organizer = query.organizer;
    return eventRepository.findAll(filter);
  },
  async get(id) {
    const event = await eventRepository.findById(id);
    if (!event) throw new HttpError(404, 'Evento no encontrado');
    return event;
  },
  async update(id, data, user) {
    const event = await this.get(id);
    if (!canManage(event, user)) throw new HttpError(403, 'Solo el organizador o un administrador puede modificar el evento');
    const updates = {};
    for (const key of ['title', 'description', 'location', 'status']) if (data[key] !== undefined) updates[key] = data[key];
    if (data.date !== undefined) updates.date = assertFutureDate(data.date);
    if (data.capacity !== undefined) {
      const capacity = Number(data.capacity);
      if (!Number.isInteger(capacity) || capacity < 1) throw new HttpError(400, 'capacity debe ser un entero mayor o igual a 1');
      if (capacity < event.reserved) throw new HttpError(409, 'La capacidad no puede ser menor a las inscripciones confirmadas');
      updates.capacity = capacity;
    }
    return eventRepository.updateById(id, updates);
  },
  async cancel(id, user) {
    return this.update(id, { status: 'cancelled' }, user);
  },
  async reserve(eventId, userId) {
    const event = await this.get(eventId);
    if (event.status !== 'scheduled') throw new HttpError(409, 'El evento no está disponible para inscripciones');
    if (new Date(event.date) <= new Date()) throw new HttpError(409, 'El período de inscripción finalizó');
    if (event.reserved >= event.capacity) throw new HttpError(409, 'No hay cupos disponibles');
    if (await ticketRepository.exists(eventId, userId)) throw new HttpError(409, 'Ya estás inscripto en este evento');
    return event;
  },
  canManage,
};
