import { ticketRepository } from '../repositories/ticket.repository.js';
import { eventRepository } from '../repositories/event.repository.js';
import { HttpError } from '../utils/http-error.js';
import { notificationService } from './notification.service.js';

export const ticketService = {
  async create(eventId, user) {
    const event = await import('./event.service.js').then(({ eventService }) => eventService.get(eventId));
    if (event.status !== 'scheduled') throw new HttpError(409, 'El evento no está disponible para inscripciones');
    if (new Date(event.date) <= new Date()) throw new HttpError(409, 'El período de inscripción finalizó');
    if (await ticketRepository.exists(eventId, user._id)) throw new HttpError(409, 'Ya estás inscripto en este evento');

    const reservedEvent = await eventRepository.reserveSlot(eventId);
    if (!reservedEvent) throw new HttpError(409, 'No hay cupos disponibles o el evento fue cancelado');

    try {
      const ticket = await ticketRepository.create({ event: eventId, user: user._id, status: 'confirmed' });
      const populated = await ticketRepository.findById(ticket._id);
      await notificationService.sendRegistrationConfirmation(populated).catch((error) => console.error('No se pudo enviar el email de confirmación:', error.message));
      return populated;
    } catch (error) {
      await eventRepository.releaseSlot(eventId);
      if (error?.code === 11000) throw new HttpError(409, 'Ya estás inscripto en este evento');
      throw error;
    }
  },
  listMine(userId) { return ticketRepository.findByUser(userId); },
  listByEvent(eventId) { return ticketRepository.findByEvent(eventId); },
  async cancel(id, user) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) throw new HttpError(404, 'Ticket no encontrado');
    const ownerId = ticket.user?._id?.toString();
    const event = ticket.event;
    const organizerId = event?.organizer?._id?.toString();
    if (user.role !== 'admin' && ownerId !== user._id.toString() && organizerId !== user._id.toString()) throw new HttpError(403, 'No tenés permisos sobre este ticket');
    if (ticket.status === 'cancelled') throw new HttpError(409, 'El ticket ya está cancelado');
    const cancelled = await ticketRepository.cancelById(id);
    await eventRepository.releaseSlot(event._id);
    return cancelled;
  },
};
